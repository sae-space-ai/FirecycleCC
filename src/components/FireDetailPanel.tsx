import { useApp } from '../context';

export default function FireDetailPanel() {
  const {
    selectedFire, selectedFireId, selectFire,
    fireResources, fireAlerts, fires, setViewMode,
    fireSatellites, fireVerifiedNodes,
  } = useApp();

  if (!selectedFire || !selectedFireId) {
    return (
      <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700 h-full flex flex-col">
        <div className="px-4 py-3 border-b border-gray-700 flex items-center gap-2">
          <svg className="w-4 h-4 text-orange-400" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2C8.5 7 4 10 4 14.5C4 18.64 7.58 22 12 22C16.42 22 20 18.64 20 14.5C20 10 15.5 7 12 2Z"/>
          </svg>
          <span className="text-white font-medium text-sm">Fire Detail</span>
        </div>
        <div className="flex-1 flex items-center justify-center p-6">
          <div className="text-center">
            <div className="w-16 h-16 bg-gray-700/50 rounded-full flex items-center justify-center mx-auto mb-3">
              <svg className="w-8 h-8 text-gray-500" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
              </svg>
            </div>
            <p className="text-gray-400 text-sm mb-2">Select a fire to view details</p>
            <p className="text-gray-500 text-xs">Click on map or list</p>
          </div>
        </div>
      </div>
    );
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'text-red-400 bg-red-500/20 border-red-500/30';
      case 'high': return 'text-orange-400 bg-orange-500/20 border-orange-500/30';
      case 'medium': return 'text-yellow-400 bg-yellow-500/20 border-yellow-500/30';
      case 'low': return 'text-green-400 bg-green-500/20 border-green-500/30';
      default: return 'text-gray-400 bg-gray-500/20 border-gray-500/30';
    }
  };

  const getContainmentColor = (c: number) => {
    if (c >= 75) return 'bg-green-500';
    if (c >= 50) return 'bg-yellow-500';
    if (c >= 25) return 'bg-orange-500';
    return 'bg-red-500';
  };

  // Find nearby fires
  const nearbyFires = fires
    .filter(f => f.id !== selectedFireId)
    .map(f => ({
      ...f,
      distance: Math.sqrt(
        Math.pow(f.lat - selectedFire.lat, 2) + Math.pow(f.lng - selectedFire.lng, 2)
      ),
    }))
    .sort((a, b) => a.distance - b.distance)
    .slice(0, 3);

  const totalPersonnel = fireResources.reduce((sum, r) => sum + r.personnel, 0);

  return (
    <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl border border-orange-500/30 h-full flex flex-col overflow-hidden shadow-lg shadow-orange-500/5">
      {/* Header */}
      <div className="px-4 py-3 border-b border-gray-700 flex items-center justify-between bg-gradient-to-r from-orange-500/5 to-transparent">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
          <span className="text-white font-medium text-sm">Fire Detail</span>
        </div>
        <button
          onClick={() => selectFire(null)}
          className="text-gray-400 hover:text-white transition-colors text-xs"
        >
          ✕ Close
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* Fire Header */}
        <div>
          <div className="flex items-start justify-between mb-2">
            <div>
              <h2 className="text-white font-bold text-lg">{selectedFire.name}</h2>
              <p className="text-gray-400 text-xs">{selectedFire.location}</p>
            </div>
            <span className={`text-xs px-2 py-1 rounded-full border font-medium ${getSeverityColor(selectedFire.severity)}`}>
              {selectedFire.severity.toUpperCase()}
            </span>
          </div>
          <p className="text-gray-300 text-xs">{selectedFire.status}</p>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-3 gap-2">
          <div className="bg-gray-900/50 rounded-lg p-2.5 text-center">
            <div className="text-white font-bold text-sm">{selectedFire.acres.toLocaleString()}</div>
            <div className="text-gray-400 text-xs">Acres</div>
          </div>
          <div className="bg-gray-900/50 rounded-lg p-2.5 text-center">
            <div className="text-white font-bold text-sm">{selectedFire.containment}%</div>
            <div className="text-gray-400 text-xs">Contained</div>
          </div>
          <div className="bg-gray-900/50 rounded-lg p-2.5 text-center">
            <div className="text-white font-bold text-sm">{totalPersonnel}</div>
            <div className="text-gray-400 text-xs">Personnel</div>
          </div>
        </div>

        {/* Containment Progress */}
        <div>
          <div className="flex items-center justify-between text-xs mb-1.5">
            <span className="text-gray-400">Containment Progress</span>
            <span className="text-white font-medium">{selectedFire.containment}%</span>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-2.5">
            <div
              className={`h-2.5 rounded-full transition-all ${getContainmentColor(selectedFire.containment)}`}
              style={{ width: `${selectedFire.containment}%` }}
            ></div>
          </div>
        </div>

        {/* Info Grid */}
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="bg-gray-900/50 rounded-lg p-2.5">
            <span className="text-gray-400 block">Cause</span>
            <span className="text-white font-medium">{selectedFire.cause}</span>
          </div>
          <div className="bg-gray-900/50 rounded-lg p-2.5">
            <span className="text-gray-400 block">Started</span>
            <span className="text-white font-medium">
              {new Date(selectedFire.startedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
            </span>
          </div>
          <div className="bg-gray-900/50 rounded-lg p-2.5">
            <span className="text-gray-400 block">Crews</span>
            <span className="text-white font-medium">{selectedFire.crews}</span>
          </div>
          <div className="bg-gray-900/50 rounded-lg p-2.5">
            <span className="text-gray-400 block">Aircraft</span>
            <span className="text-white font-medium">{selectedFire.aircraft}</span>
          </div>
        </div>

        {/* Assigned Resources */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-white text-xs font-medium">Assigned Resources</h3>
            <button
              onClick={() => setViewMode('resources')}
              className="text-orange-400 text-xs hover:text-orange-300"
            >
              View All →
            </button>
          </div>
          <div className="space-y-1.5">
            {fireResources.length > 0 ? fireResources.map((r) => (
              <div key={r.id} className="flex items-center gap-2 bg-gray-900/50 rounded-lg p-2">
                <div className={`w-1.5 h-1.5 rounded-full ${
                  r.status === 'deployed' ? 'bg-green-500' :
                  r.status === 'standby' ? 'bg-yellow-500' :
                  r.status === 'transit' ? 'bg-blue-500' : 'bg-red-500'
                }`}></div>
                <span className="text-gray-200 text-xs flex-1 truncate">{r.name}</span>
                <span className="text-gray-500 text-xs">{r.personnel}p</span>
              </div>
            )) : (
              <p className="text-gray-500 text-xs text-center py-2">No resources assigned</p>
            )}
          </div>
        </div>

        {/* Related Alerts */}
        {fireAlerts.length > 0 && (
          <div>
            <h3 className="text-white text-xs font-medium mb-2">Related Alerts</h3>
            <div className="space-y-1.5">
              {fireAlerts.map((a) => (
                <div key={a.id} className={`text-xs p-2 rounded-lg border-l-2 ${
                  a.type === 'critical' ? 'bg-red-500/5 border-red-500 text-red-300' :
                  a.type === 'warning' ? 'bg-yellow-500/5 border-yellow-500 text-yellow-300' :
                  'bg-blue-500/5 border-blue-500 text-blue-300'
                }`}>
                  {a.message}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Nearby Fires */}
        <div>
          <h3 className="text-white text-xs font-medium mb-2">Nearby Fires</h3>
          <div className="space-y-1.5">
            {nearbyFires.map((f) => (
              <button
                key={f.id}
                onClick={() => selectFire(f.id)}
                className="w-full flex items-center gap-2 bg-gray-900/50 hover:bg-gray-700/50 rounded-lg p-2 transition-colors text-left"
              >
                <div className={`w-2 h-2 rounded-full ${
                  f.severity === 'critical' ? 'bg-red-500' :
                  f.severity === 'high' ? 'bg-orange-500' :
                  f.severity === 'medium' ? 'bg-yellow-500' : 'bg-green-500'
                }`}></div>
                <span className="text-gray-200 text-xs flex-1 truncate">{f.name}</span>
                <span className="text-gray-500 text-xs">{f.distance.toFixed(1)}°</span>
              </button>
            ))}
          </div>
        </div>

        {/* Satellite Coverage */}
        {fireSatellites.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-white text-xs font-medium">Satellite Coverage</h3>
              <button
                onClick={() => setViewMode('geospatial')}
                className="text-purple-400 text-xs hover:text-purple-300"
              >
                View All →
              </button>
            </div>
            <div className="space-y-1.5">
              {fireSatellites.slice(0, 3).map((sat) => (
                <div key={sat.id} className="flex items-center gap-2 bg-gray-900/50 rounded-lg p-2">
                  <span className="text-sm">
                    {sat.type === 'thermal' ? '🔥' : sat.type === 'optical' ? '📷' : sat.type === 'sar' ? '📡' : '🌈'}
                  </span>
                  <div className="flex-1 min-w-0">
                    <div className="text-gray-200 text-xs truncate">{sat.name}</div>
                    <div className="text-gray-500 text-xs">{sat.hotspots} hotspots</div>
                  </div>
                  <span className={`text-xs px-1.5 py-0.5 rounded ${
                    sat.confidence === 'high' ? 'bg-green-500/10 text-green-400' :
                    sat.confidence === 'medium' ? 'bg-yellow-500/10 text-yellow-400' :
                    'bg-red-500/10 text-red-400'
                  }`}>
                    {sat.confidence}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Verified Nodes */}
        {fireVerifiedNodes.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-white text-xs font-medium">Verified Nodes</h3>
              <span className="text-green-400 text-xs">
                {fireVerifiedNodes.filter(n => n.status === 'online').length} online
              </span>
            </div>
            <div className="space-y-1.5">
              {fireVerifiedNodes.slice(0, 4).map((node) => (
                <div key={node.id} className="flex items-center gap-2 bg-gray-900/50 rounded-lg p-2">
                  <div className={`w-2 h-2 rounded-full ${
                    node.status === 'online' ? 'bg-green-500 animate-pulse' :
                    node.status === 'warning' ? 'bg-yellow-500' :
                    node.status === 'offline' ? 'bg-gray-500' : 'bg-red-500'
                  }`}></div>
                  <div className="flex-1 min-w-0">
                    <div className="text-gray-200 text-xs truncate">{node.name}</div>
                    <div className="text-gray-500 text-xs capitalize">{node.type.replace('-', ' ')}</div>
                  </div>
                  {node.verified && (
                    <svg className="w-3 h-3 text-green-400" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
                    </svg>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
