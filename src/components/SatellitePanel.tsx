import { useApp } from '../context';

export default function SatellitePanel() {
  const { satellites, selectedFireId, selectFire } = useApp();

  const getConfidenceColor = (confidence: string) => {
    switch (confidence) {
      case 'high': return 'text-green-400 bg-green-500/10 border-green-500/30';
      case 'medium': return 'text-yellow-400 bg-yellow-500/10 border-yellow-500/30';
      case 'low': return 'text-red-400 bg-red-500/10 border-red-500/30';
      default: return 'text-gray-400 bg-gray-500/10 border-gray-500/30';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'thermal': return '🔥';
      case 'optical': return '📷';
      case 'sar': return '📡';
      case 'multispectral': return '🌈';
      default: return '🛰️';
    }
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false });
  };

  const totalHotspots = satellites.reduce((sum, s) => sum + s.hotspots, 0);

  return (
    <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700 overflow-hidden h-full flex flex-col">
      <div className="px-4 py-3 border-b border-gray-700 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <svg className="w-4 h-4 text-purple-400" fill="currentColor" viewBox="0 0 24 24">
            <path d="M21 3H3c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h18c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H3V5h18v14zM5 15h14v3H5z"/>
          </svg>
          <span className="text-white font-medium text-sm">Satellite Intelligence</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-400">{satellites.length} active</span>
          <span className="text-xs bg-purple-500/20 text-purple-400 px-2 py-0.5 rounded-full">
            {totalHotspots} hotspots
          </span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-3 space-y-2">
        {satellites.map((sat) => (
          <div
            key={sat.id}
            onClick={() => sat.fireId && selectFire(sat.fireId)}
            className={`bg-gray-900/50 rounded-lg p-3 border transition-all cursor-pointer group ${
              selectedFireId === sat.fireId
                ? 'border-purple-500/50 bg-purple-500/5'
                : 'border-gray-700/50 hover:border-gray-600'
            }`}
          >
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className="text-lg">{getTypeIcon(sat.type)}</span>
                <div>
                  <h4 className="text-white text-sm font-medium">{sat.name}</h4>
                  <p className="text-gray-400 text-xs">{sat.provider}</p>
                </div>
              </div>
              <span className={`text-xs px-2 py-0.5 rounded-full border ${getConfidenceColor(sat.confidence)}`}>
                {sat.confidence}
              </span>
            </div>

            <div className="grid grid-cols-3 gap-2 text-xs mb-2">
              <div>
                <span className="text-gray-400 block">Resolution</span>
                <span className="text-white font-medium">{sat.resolution}</span>
              </div>
              <div>
                <span className="text-gray-400 block">Coverage</span>
                <span className="text-white font-medium">{sat.coverage}%</span>
              </div>
              <div>
                <span className="text-gray-400 block">Hotspots</span>
                <span className="text-orange-400 font-medium">{sat.hotspots}</span>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs text-gray-400 pt-2 border-t border-gray-700/50">
              <span>Last: {formatTime(sat.lastPass)}</span>
              <span>Next: {formatTime(sat.nextPass)}</span>
            </div>

            {sat.fireId && (
              <div className="mt-2 flex items-center gap-1 text-xs text-purple-400 opacity-0 group-hover:opacity-100 transition-opacity">
                <span>→ View associated fire</span>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
