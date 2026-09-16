import { useState, useEffect } from 'react';
import { useApp } from '../context';

export default function TerritorySearch() {
  const {
    searchTerritory,
    searchByCoordinates,
    selectFire,
    setMapCenter,
    setViewMode,
  } = useApp();

  const [query, setQuery] = useState('');
  const [results, setResults] = useState<{
    territories: any[];
    fires: any[];
    nodes: any[];
  } | null>(null);
  const [namedResults, setNamedResults] = useState<any[]>([]);
  const [searchMode, setSearchMode] = useState<'name' | 'coords'>('name');
  const [coordInput, setCoordInput] = useState({ lat: '', lng: '' });
  const [radius, setRadius] = useState(100);

  // Search by name
  useEffect(() => {
    if (searchMode === 'name' && query.trim()) {
      const found = searchTerritory(query);
      setNamedResults(found);
    } else {
      setNamedResults([]);
    }
  }, [query, searchMode, searchTerritory]);

  // Handle coordinate search
  const handleCoordinateSearch = () => {
    const lat = parseFloat(coordInput.lat);
    const lng = parseFloat(coordInput.lng);

    if (isNaN(lat) || isNaN(lng)) {
      return;
    }

    const found = searchByCoordinates(lat, lng, radius);
    setResults(found);
    setMapCenter({ lat, lng });
    setViewMode('map');
  };

  // Handle territory selection
  const handleTerritorySelect = (territory: any) => {
    setMapCenter({ lat: territory.lat, lng: territory.lng });
    setViewMode('map');
    setQuery('');
    setCoordInput({ lat: '', lng: '' });
  };

  // Handle fire selection from coordinate search
  const handleFireSelect = (fireId: string) => {
    selectFire(fireId);
    setViewMode('dashboard');
    setResults(null);
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'city': return '🏙️';
      case 'park': return '🏞️';
      case 'forest': return '🌲';
      case 'mountain': return '⛰️';
      case 'river': return '🏞️';
      case 'highway': return '🛣️';
      case 'region': return '🗺️';
      default: return '📍';
    }
  };

  return (
    <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700 overflow-hidden">
      <div className="px-4 py-3 border-b border-gray-700 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <svg className="w-4 h-4 text-blue-400" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
          </svg>
          <span className="text-white font-medium text-sm">Territory Search</span>
        </div>
        <div className="flex gap-1">
          <button
            onClick={() => { setSearchMode('name'); setResults(null); }}
            className={`text-xs px-2 py-1 rounded transition-colors ${
              searchMode === 'name'
                ? 'bg-blue-500/20 text-blue-400'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            By Name
          </button>
          <button
            onClick={() => { setSearchMode('coords'); setNamedResults([]); }}
            className={`text-xs px-2 py-1 rounded transition-colors ${
              searchMode === 'coords'
                ? 'bg-blue-500/20 text-blue-400'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            By Coords
          </button>
        </div>
      </div>

      <div className="p-3 space-y-3">
        {searchMode === 'name' ? (
          <>
            {/* Name search input */}
            <div className="relative">
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search city, park, forest, mountain..."
                className="w-full bg-gray-900/50 border border-gray-600 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-blue-500/50 transition-colors"
              />
              {query && (
                <button
                  onClick={() => setQuery('')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                >
                  ✕
                </button>
              )}
            </div>

            {/* Named results */}
            {namedResults.length > 0 && (
              <div className="space-y-1.5 max-h-60 overflow-y-auto">
                {namedResults.slice(0, 10).map((territory) => (
                  <button
                    key={territory.id}
                    onClick={() => handleTerritorySelect(territory)}
                    className="w-full flex items-center gap-3 bg-gray-900/50 hover:bg-gray-700/50 rounded-lg p-2.5 transition-colors text-left"
                  >
                    <span className="text-lg">{getTypeIcon(territory.type)}</span>
                    <div className="flex-1 min-w-0">
                      <div className="text-white text-sm font-medium truncate">
                        {territory.name}
                      </div>
                      <div className="text-gray-400 text-xs">
                        {territory.state} • {territory.type}
                      </div>
                      {territory.description && (
                        <div className="text-gray-500 text-xs truncate">
                          {territory.description}
                        </div>
                      )}
                    </div>
                    <div className="text-right">
                      <div className="text-gray-400 text-xs font-mono">
                        {territory.lat.toFixed(2)}°
                      </div>
                      <div className="text-gray-400 text-xs font-mono">
                        {territory.lng.toFixed(2)}°
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )}

            {query && namedResults.length === 0 && (
              <div className="text-center py-4 text-gray-500 text-sm">
                No territories found
              </div>
            )}
          </>
        ) : (
          <>
            {/* Coordinate search inputs */}
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-xs text-gray-400 mb-1 block">Latitude</label>
                <input
                  type="number"
                  step="0.0001"
                  value={coordInput.lat}
                  onChange={(e) => setCoordInput({ ...coordInput, lat: e.target.value })}
                  placeholder="37.7749"
                  className="w-full bg-gray-900/50 border border-gray-600 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-blue-500/50 transition-colors"
                />
              </div>
              <div>
                <label className="text-xs text-gray-400 mb-1 block">Longitude</label>
                <input
                  type="number"
                  step="0.0001"
                  value={coordInput.lng}
                  onChange={(e) => setCoordInput({ ...coordInput, lng: e.target.value })}
                  placeholder="-122.4194"
                  className="w-full bg-gray-900/50 border border-gray-600 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-blue-500/50 transition-colors"
                />
              </div>
            </div>

            {/* Radius selector */}
            <div>
              <label className="text-xs text-gray-400 mb-1 block">
                Search Radius: {radius} km
              </label>
              <input
                type="range"
                min="10"
                max="500"
                step="10"
                value={radius}
                onChange={(e) => setRadius(parseInt(e.target.value))}
                className="w-full h-1 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
              />
            </div>

            {/* Search button */}
            <button
              onClick={handleCoordinateSearch}
              disabled={!coordInput.lat || !coordInput.lng}
              className="w-full bg-blue-600 hover:bg-blue-500 disabled:bg-gray-700 disabled:text-gray-500 text-white text-sm font-medium py-2 rounded-lg transition-colors"
            >
              Search Area
            </button>

            {/* Coordinate search results */}
            {results && (
              <div className="space-y-3 max-h-60 overflow-y-auto">
                {/* Fires */}
                {results.fires.length > 0 && (
                  <div>
                    <div className="text-xs text-gray-400 mb-1.5 flex items-center gap-1">
                      <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                      Fires ({results.fires.length})
                    </div>
                    <div className="space-y-1">
                      {results.fires.map((fire) => (
                        <button
                          key={fire.id}
                          onClick={() => handleFireSelect(fire.id)}
                          className="w-full flex items-center justify-between bg-red-500/5 hover:bg-red-500/10 border border-red-500/20 rounded-lg p-2 transition-colors text-left"
                        >
                          <div className="flex items-center gap-2">
                            <div className={`w-2 h-2 rounded-full ${
                              fire.severity === 'critical' ? 'bg-red-500' :
                              fire.severity === 'high' ? 'bg-orange-500' :
                              fire.severity === 'medium' ? 'bg-yellow-500' : 'bg-green-500'
                            }`}></div>
                            <span className="text-white text-xs">{fire.name}</span>
                          </div>
                          <span className="text-gray-400 text-xs">{fire.distance.toFixed(1)} km</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Territories */}
                {results.territories.length > 0 && (
                  <div>
                    <div className="text-xs text-gray-400 mb-1.5 flex items-center gap-1">
                      <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                      Territories ({results.territories.length})
                    </div>
                    <div className="space-y-1">
                      {results.territories.slice(0, 5).map((territory) => (
                        <button
                          key={territory.id}
                          onClick={() => handleTerritorySelect(territory)}
                          className="w-full flex items-center justify-between bg-blue-500/5 hover:bg-blue-500/10 border border-blue-500/20 rounded-lg p-2 transition-colors text-left"
                        >
                          <div className="flex items-center gap-2">
                            <span className="text-sm">{getTypeIcon(territory.type)}</span>
                            <span className="text-white text-xs">{territory.name}</span>
                          </div>
                          <span className="text-gray-400 text-xs">{territory.distance.toFixed(1)} km</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Nodes */}
                {results.nodes.length > 0 && (
                  <div>
                    <div className="text-xs text-gray-400 mb-1.5 flex items-center gap-1">
                      <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                      Verified Nodes ({results.nodes.length})
                    </div>
                    <div className="space-y-1">
                      {results.nodes.slice(0, 5).map((node) => (
                        <div
                          key={node.id}
                          className="flex items-center justify-between bg-green-500/5 border border-green-500/20 rounded-lg p-2"
                        >
                          <div className="flex items-center gap-2">
                            <div className={`w-2 h-2 rounded-full ${
                              node.status === 'online' ? 'bg-green-500' :
                              node.status === 'warning' ? 'bg-yellow-500' : 'bg-gray-500'
                            }`}></div>
                            <span className="text-white text-xs">{node.name}</span>
                          </div>
                          <span className="text-gray-400 text-xs">{node.distance.toFixed(1)} km</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {results.fires.length === 0 && results.territories.length === 0 && results.nodes.length === 0 && (
                  <div className="text-center py-4 text-gray-500 text-sm">
                    No results within {radius} km radius
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
