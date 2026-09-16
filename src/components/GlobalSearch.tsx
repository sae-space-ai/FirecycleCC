import { useState, useEffect, useRef } from 'react';
import { useApp } from '../context';

export default function GlobalSearch() {
  const {
    globalSearchOpen, setGlobalSearchOpen,
    fires, allResources, allAlerts,
    selectFire, setViewMode, setFilterSeverity, setFilterResourceStatus,
    searchTerritory, setMapCenter,
  } = useApp();

  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (globalSearchOpen && inputRef.current) {
      inputRef.current.focus();
    }
    if (!globalSearchOpen) {
      setQuery('');
    }
  }, [globalSearchOpen]);

  // Keyboard shortcut: Cmd/Ctrl + K
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setGlobalSearchOpen(!globalSearchOpen);
      }
      if (e.key === 'Escape') {
        setGlobalSearchOpen(false);
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [globalSearchOpen, setGlobalSearchOpen]);

  if (!globalSearchOpen) return null;

  const q = query.toLowerCase().trim();

  // Search fires
  const fireResults = q
    ? fires.filter(f =>
        f.name.toLowerCase().includes(q) ||
        f.location.toLowerCase().includes(q) ||
        f.cause.toLowerCase().includes(q) ||
        f.severity.toLowerCase().includes(q)
      )
    : [];

  // Search resources
  const resourceResults = q
    ? allResources.filter(r =>
        r.name.toLowerCase().includes(q) ||
        r.type.toLowerCase().includes(q) ||
        r.status.toLowerCase().includes(q)
      ).slice(0, 5)
    : [];

  // Search territories
  const territoryResults = q ? searchTerritory(q).slice(0, 5) : [];

  // Quick actions
  const quickActions = [
    { label: 'View Dashboard', action: () => { setViewMode('dashboard'); setGlobalSearchOpen(false); } },
    { label: 'View Map', action: () => { setViewMode('map'); setGlobalSearchOpen(false); } },
    { label: 'View Resources', action: () => { setViewMode('resources'); setGlobalSearchOpen(false); } },
    { label: 'View Analytics', action: () => { setViewMode('analytics'); setGlobalSearchOpen(false); } },
    { label: 'View Geospatial', action: () => { setViewMode('geospatial'); setGlobalSearchOpen(false); } },
    { label: 'Show Critical Fires', action: () => { setFilterSeverity('critical'); setViewMode('map'); setGlobalSearchOpen(false); } },
    { label: 'Show Deployed Resources', action: () => { setFilterResourceStatus('deployed'); setViewMode('resources'); setGlobalSearchOpen(false); } },
    { label: 'View Satellite Data', action: () => { setViewMode('geospatial'); setGlobalSearchOpen(false); } },
    { label: 'View Verified Nodes', action: () => { setViewMode('geospatial'); setGlobalSearchOpen(false); } },
  ].filter(a => !q || a.label.toLowerCase().includes(q));

  const hasResults = fireResults.length > 0 || resourceResults.length > 0 || territoryResults.length > 0 || quickActions.length > 0;

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4"
      onClick={() => setGlobalSearchOpen(false)}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm"></div>

      {/* Modal */}
      <div
        className="relative w-full max-w-2xl bg-gray-900 border border-gray-700 rounded-xl shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search input */}
        <div className="flex items-center gap-3 px-4 py-3 border-b border-gray-700">
          <svg className="w-5 h-5 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
            <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
          </svg>
          <input
            ref={inputRef}
            type="text"
            placeholder="Search fires, resources, actions..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-1 bg-transparent text-white placeholder-gray-500 focus:outline-none text-sm"
          />
          <kbd className="text-xs text-gray-500 bg-gray-800 px-2 py-0.5 rounded border border-gray-700">
            ESC
          </kbd>
        </div>

        {/* Results */}
        <div className="max-h-96 overflow-y-auto p-2">
          {!q && (
            <div className="px-3 py-2">
              <p className="text-xs text-gray-500 mb-2">Quick Actions</p>
              <div className="space-y-0.5">
                {quickActions.map((action, i) => (
                  <button
                    key={i}
                    onClick={action.action}
                    className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-800 transition-colors text-left"
                  >
                    <svg className="w-4 h-4 text-orange-400" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M13 3c-4.97 0-9 4.03-9 9H1l3.89 3.89.07.14L9 12H6c0-3.87 3.13-7 7-7s7 3.13 7 7-3.13 7-7 7c-1.93 0-3.68-.79-4.94-2.06l-1.42 1.42C8.27 19.99 10.51 21 13 21c4.97 0 9-4.03 9-9s-4.03-9-9-9z"/>
                    </svg>
                    <span className="text-gray-200 text-sm">{action.label}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {q && fireResults.length > 0 && (
            <div className="px-3 py-2">
              <p className="text-xs text-gray-500 mb-2">Fires ({fireResults.length})</p>
              <div className="space-y-0.5">
                {fireResults.map((fire) => (
                  <button
                    key={fire.id}
                    onClick={() => {
                      selectFire(fire.id);
                      setViewMode('dashboard');
                      setGlobalSearchOpen(false);
                    }}
                    className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-800 transition-colors text-left"
                  >
                    <div className={`w-2 h-2 rounded-full ${
                      fire.severity === 'critical' ? 'bg-red-500' :
                      fire.severity === 'high' ? 'bg-orange-500' :
                      fire.severity === 'medium' ? 'bg-yellow-500' : 'bg-green-500'
                    }`}></div>
                    <div className="flex-1">
                      <div className="text-white text-sm">{fire.name}</div>
                      <div className="text-gray-500 text-xs">{fire.location} • {fire.acres.toLocaleString()} acres</div>
                    </div>
                    <span className="text-xs text-gray-400">{fire.containment}%</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {q && resourceResults.length > 0 && (
            <div className="px-3 py-2">
              <p className="text-xs text-gray-500 mb-2">Resources ({resourceResults.length})</p>
              <div className="space-y-0.5">
                {resourceResults.map((resource) => (
                  <button
                    key={resource.id}
                    onClick={() => {
                      setViewMode('resources');
                      setGlobalSearchOpen(false);
                    }}
                    className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-800 transition-colors text-left"
                  >
                    <div className={`w-2 h-2 rounded-full ${
                      resource.status === 'deployed' ? 'bg-green-500' :
                      resource.status === 'standby' ? 'bg-yellow-500' :
                      resource.status === 'transit' ? 'bg-blue-500' : 'bg-red-500'
                    }`}></div>
                    <div className="flex-1">
                      <div className="text-white text-sm">{resource.name}</div>
                      <div className="text-gray-500 text-xs capitalize">{resource.type} • {resource.status}</div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {q && territoryResults.length > 0 && (
            <div className="px-3 py-2">
              <p className="text-xs text-gray-500 mb-2">Territories ({territoryResults.length})</p>
              <div className="space-y-0.5">
                {territoryResults.map((territory) => (
                  <button
                    key={territory.id}
                    onClick={() => {
                      setMapCenter({ lat: territory.lat, lng: territory.lng });
                      setViewMode('map');
                      setGlobalSearchOpen(false);
                    }}
                    className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-800 transition-colors text-left"
                  >
                    <span className="text-lg">
                      {territory.type === 'city' ? '🏙️' :
                       territory.type === 'park' ? '🏞️' :
                       territory.type === 'forest' ? '🌲' :
                       territory.type === 'mountain' ? '⛰️' :
                       territory.type === 'river' ? '🏞️' :
                       territory.type === 'highway' ? '🛣️' : '🗺️'}
                    </span>
                    <div className="flex-1">
                      <div className="text-white text-sm">{territory.name}</div>
                      <div className="text-gray-500 text-xs">{territory.state} • {territory.type}</div>
                    </div>
                    <span className="text-xs text-gray-400 font-mono">
                      {territory.lat.toFixed(2)}°, {territory.lng.toFixed(2)}°
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {q && quickActions.length > 0 && (
            <div className="px-3 py-2">
              <p className="text-xs text-gray-500 mb-2">Actions</p>
              <div className="space-y-0.5">
                {quickActions.map((action, i) => (
                  <button
                    key={i}
                    onClick={action.action}
                    className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-800 transition-colors text-left"
                  >
                    <svg className="w-4 h-4 text-orange-400" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M13 3c-4.97 0-9 4.03-9 9H1l3.89 3.89.07.14L9 12H6c0-3.87 3.13-7 7-7s7 3.13 7 7-3.13 7-7 7c-1.93 0-3.68-.79-4.94-2.06l-1.42 1.42C8.27 19.99 10.51 21 13 21c4.97 0 9-4.03 9-9s-4.03-9-9-9z"/>
                    </svg>
                    <span className="text-gray-200 text-sm">{action.label}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {q && !hasResults && (
            <div className="text-center py-8 text-gray-500 text-sm">
              No results for "{query}"
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-4 py-2 border-t border-gray-700 flex items-center justify-between text-xs text-gray-500">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1">
              <kbd className="bg-gray-800 px-1.5 py-0.5 rounded border border-gray-700">↑↓</kbd>
              Navigate
            </span>
            <span className="flex items-center gap-1">
              <kbd className="bg-gray-800 px-1.5 py-0.5 rounded border border-gray-700">↵</kbd>
              Select
            </span>
          </div>
          <span>⌘K to toggle</span>
        </div>
      </div>
    </div>
  );
}
