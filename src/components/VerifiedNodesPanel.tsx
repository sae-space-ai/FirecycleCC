import { useApp } from '../context';

export default function VerifiedNodesPanel() {
  const { verifiedNodes, selectedFireId, selectFire } = useApp();

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online': return 'bg-green-500';
      case 'offline': return 'bg-gray-500';
      case 'warning': return 'bg-yellow-500';
      case 'critical': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'online': return 'Online';
      case 'offline': return 'Offline';
      case 'warning': return 'Warning';
      case 'critical': return 'Critical';
      default: return status;
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'weather-station': return '🌡️';
      case 'iot-sensor': return '📡';
      case 'camera': return '📹';
      case 'drone': return '🚁';
      case 'ground-crew': return '👥';
      case 'satellite-uplink': return '🛰️';
      default: return '📍';
    }
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    return `${Math.floor(diffMins / 60)}h ago`;
  };

  const onlineCount = verifiedNodes.filter(n => n.status === 'online').length;
  const totalCount = verifiedNodes.length;

  return (
    <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700 overflow-hidden h-full flex flex-col">
      <div className="px-4 py-3 border-b border-gray-700 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <svg className="w-4 h-4 text-green-400" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
          </svg>
          <span className="text-white font-medium text-sm">Verified Nodes</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-400">{onlineCount}/{totalCount} online</span>
          <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-3 space-y-2">
        {verifiedNodes.map((node) => (
          <div
            key={node.id}
            onClick={() => node.fireId && selectFire(node.fireId)}
            className={`bg-gray-900/50 rounded-lg p-3 border transition-all cursor-pointer group ${
              selectedFireId === node.fireId
                ? 'border-green-500/50 bg-green-500/5'
                : 'border-gray-700/50 hover:border-gray-600'
            }`}
          >
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className="text-lg">{getTypeIcon(node.type)}</span>
                <div>
                  <h4 className="text-white text-sm font-medium">{node.name}</h4>
                  <p className="text-gray-400 text-xs capitalize">{node.type.replace('-', ' ')}</p>
                </div>
              </div>
              <div className="flex items-center gap-1.5">
                <div className={`w-2 h-2 rounded-full ${getStatusColor(node.status)} ${
                  node.status === 'online' ? 'animate-pulse' : ''
                }`}></div>
                <span className={`text-xs ${
                  node.status === 'online' ? 'text-green-400' :
                  node.status === 'warning' ? 'text-yellow-400' :
                  node.status === 'critical' ? 'text-red-400' :
                  'text-gray-400'
                }`}>
                  {getStatusLabel(node.status)}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs mb-2">
              <div>
                <span className="text-gray-400 block">Location</span>
                <span className="text-white font-mono text-xs">
                  {node.lat.toFixed(2)}°, {node.lng.toFixed(2)}°
                </span>
              </div>
              <div>
                <span className="text-gray-400 block">Last Reading</span>
                <span className="text-white font-medium">{formatTime(node.lastReading)}</span>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs pt-2 border-t border-gray-700/50">
              <div className="flex items-center gap-1">
                <span className="text-gray-400">Data:</span>
                <span className="text-cyan-400 font-mono">{node.dataStream}</span>
              </div>
              {node.verified && (
                <span className="text-green-400 flex items-center gap-1">
                  <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
                  </svg>
                  Verified
                </span>
              )}
            </div>

            {node.fireId && (
              <div className="mt-2 flex items-center gap-1 text-xs text-green-400 opacity-0 group-hover:opacity-100 transition-opacity">
                <span>→ View associated fire</span>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
