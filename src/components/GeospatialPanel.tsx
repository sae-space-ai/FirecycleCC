import { useApp } from '../context';

export default function GeospatialPanel() {
  const { geoLayers, toggleGeoLayer, setGeoLayerOpacity } = useApp();

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'topography': return '⛰️';
      case 'vegetation': return '🌿';
      case 'fuel-load': return '🔥';
      case 'wind-pattern': return '💨';
      case 'evacuation-route': return '🚗';
      case 'water-source': return '💧';
      default: return '🗺️';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'topography': return 'text-amber-400';
      case 'vegetation': return 'text-green-400';
      case 'fuel-load': return 'text-red-400';
      case 'wind-pattern': return 'text-cyan-400';
      case 'evacuation-route': return 'text-blue-400';
      case 'water-source': return 'text-blue-300';
      default: return 'text-gray-400';
    }
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) + ' ' +
           date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false });
  };

  const activeCount = geoLayers.filter(l => l.active).length;

  return (
    <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700 overflow-hidden h-full flex flex-col">
      <div className="px-4 py-3 border-b border-gray-700 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <svg className="w-4 h-4 text-cyan-400" fill="currentColor" viewBox="0 0 24 24">
            <path d="M20.5 3l-.16.03L15 5.1 9 3 3.36 4.9c-.21.07-.36.25-.36.48V20.5c0 .28.22.5.5.5l.16-.03L9 18.9l6 2.1 5.64-1.9c.21-.07.36-.25.36-.48V3.5c0-.28-.22-.5-.5-.5zM15 19l-6-2.11V5l6 2.11V19z"/>
          </svg>
          <span className="text-white font-medium text-sm">Geospatial Layers</span>
        </div>
        <span className="text-xs bg-cyan-500/20 text-cyan-400 px-2 py-0.5 rounded-full">
          {activeCount} active
        </span>
      </div>

      <div className="flex-1 overflow-y-auto p-3 space-y-2">
        {geoLayers.map((layer) => (
          <div
            key={layer.id}
            className="bg-gray-900/50 rounded-lg p-3 border border-gray-700/50"
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className="text-lg">{getTypeIcon(layer.type)}</span>
                <div>
                  <h4 className={`text-sm font-medium ${layer.active ? 'text-white' : 'text-gray-500'}`}>
                    {layer.name}
                  </h4>
                  <p className="text-gray-400 text-xs">
                    {(layer.dataPoints / 1000).toFixed(0)}k data points
                  </p>
                </div>
              </div>
              <button
                onClick={() => toggleGeoLayer(layer.id)}
                className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
                  layer.active ? 'bg-cyan-500' : 'bg-gray-600'
                }`}
              >
                <span
                  className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform ${
                    layer.active ? 'translate-x-4.5' : 'translate-x-0.5'
                  }`}
                />
              </button>
            </div>

            {layer.active && (
              <div className="mt-2 space-y-2">
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-400">Opacity</span>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={layer.opacity * 100}
                    onChange={(e) => setGeoLayerOpacity(layer.id, parseInt(e.target.value) / 100)}
                    className="flex-1 h-1 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-cyan-500"
                  />
                  <span className="text-xs text-gray-300 w-8 text-right">
                    {Math.round(layer.opacity * 100)}%
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className={getTypeColor(layer.type)}>
                    {layer.type.replace('-', ' ')}
                  </span>
                  <span className="text-gray-500">
                    Updated: {formatTime(layer.lastUpdated)}
                  </span>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
