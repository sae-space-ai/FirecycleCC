import { fireIncidents } from '../data';

export default function IncidentsList() {
  const sortedIncidents = [...fireIncidents].sort((a, b) => {
    const severityOrder = { critical: 0, high: 1, medium: 2, low: 3 };
    return severityOrder[a.severity] - severityOrder[b.severity];
  });

  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case 'critical':
        return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'high':
        return 'bg-orange-500/20 text-orange-400 border-orange-500/30';
      case 'medium':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'low':
        return 'bg-green-500/20 text-green-400 border-green-500/30';
      default:
        return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const getContainmentColor = (containment: number) => {
    if (containment >= 75) return 'bg-green-500';
    if (containment >= 50) return 'bg-yellow-500';
    if (containment >= 25) return 'bg-orange-500';
    return 'bg-red-500';
  };

  return (
    <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700 overflow-hidden h-full flex flex-col">
      <div className="px-4 py-3 border-b border-gray-700 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <svg className="w-4 h-4 text-red-400" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2C8.5 7 4 10 4 14.5C4 18.64 7.58 22 12 22C16.42 22 20 18.64 20 14.5C20 10 15.5 7 12 2Z"/>
          </svg>
          <span className="text-white font-medium text-sm">Active Incidents</span>
          <span className="bg-red-500/20 text-red-400 text-xs px-2 py-0.5 rounded-full">
            {fireIncidents.length}
          </span>
        </div>
        <button className="text-gray-400 hover:text-white transition-colors text-xs">
          View All →
        </button>
      </div>
      <div className="flex-1 overflow-y-auto p-3 space-y-2">
        {sortedIncidents.map((fire) => (
          <div
            key={fire.id}
            className="bg-gray-900/50 rounded-lg p-3 border border-gray-700/50 hover:border-gray-600 transition-all cursor-pointer group"
          >
            <div className="flex items-start justify-between mb-2">
              <div>
                <h4 className="text-white text-sm font-medium group-hover:text-orange-300 transition-colors">
                  {fire.name}
                </h4>
                <p className="text-gray-400 text-xs mt-0.5">{fire.location}</p>
              </div>
              <span className={`text-xs px-2 py-0.5 rounded-full border ${getSeverityBadge(fire.severity)}`}>
                {fire.severity}
              </span>
            </div>
            <div className="flex items-center gap-3 text-xs text-gray-400 mb-2">
              <span>{fire.acres.toLocaleString()} acres</span>
              <span>•</span>
              <span>{fire.cause}</span>
            </div>
            <div className="mb-2">
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="text-gray-400">Containment</span>
                <span className="text-gray-300 font-medium">{fire.containment}%</span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-1.5">
                <div
                  className={`h-1.5 rounded-full transition-all ${getContainmentColor(fire.containment)}`}
                  style={{ width: `${fire.containment}%` }}
                ></div>
              </div>
            </div>
            <div className="flex items-center gap-3 text-xs text-gray-400">
              <span className="flex items-center gap-1">
                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3z"/>
                </svg>
                {fire.crews} crews
              </span>
              <span className="flex items-center gap-1">
                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.21.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99z"/>
                </svg>
                {fire.engines} engines
              </span>
              {fire.aircraft > 0 && (
                <span className="flex items-center gap-1">
                  <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z"/>
                  </svg>
                  {fire.aircraft} air
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
