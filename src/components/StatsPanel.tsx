import { useApp } from '../context';

export default function StatsPanel() {
  const { globalStats, setViewMode, setFilterSeverity, satellites, verifiedNodes, activeGeoLayers } = useApp();

  const statCards = [
    {
      label: 'Active Fires',
      value: globalStats.activeFires,
      icon: (
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 2C8.5 7 4 10 4 14.5C4 18.64 7.58 22 12 22C16.42 22 20 18.64 20 14.5C20 10 15.5 7 12 2Z"/>
        </svg>
      ),
      color: 'text-red-400',
      bgColor: 'bg-red-500/10',
      borderColor: 'border-red-500/30',
      onClick: () => { setViewMode('map'); setFilterSeverity(null); },
    },
    {
      label: 'Total Acres',
      value: globalStats.totalAcres.toLocaleString(),
      icon: (
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
        </svg>
      ),
      color: 'text-orange-400',
      bgColor: 'bg-orange-500/10',
      borderColor: 'border-orange-500/30',
      onClick: () => setViewMode('analytics'),
    },
    {
      label: 'Personnel Deployed',
      value: globalStats.personnelDeployed,
      icon: (
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
          <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z"/>
        </svg>
      ),
      color: 'text-yellow-400',
      bgColor: 'bg-yellow-500/10',
      borderColor: 'border-yellow-500/30',
      onClick: () => setViewMode('resources'),
    },
    {
      label: 'Resources Active',
      value: globalStats.resourcesDeployed,
      icon: (
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
          <path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.21.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.5 16c-.83 0-1.5-.67-1.5-1.5S5.67 13 6.5 13s1.5.67 1.5 1.5S7.33 16 6.5 16zm11 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zM5 11l1.5-4.5h11L19 11H5z"/>
        </svg>
      ),
      color: 'text-blue-400',
      bgColor: 'bg-blue-500/10',
      borderColor: 'border-blue-500/30',
      onClick: () => setViewMode('resources'),
    },
    {
      label: 'Avg Containment',
      value: `${globalStats.avgContainment}%`,
      icon: (
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
        </svg>
      ),
      color: 'text-green-400',
      bgColor: 'bg-green-500/10',
      borderColor: 'border-green-500/30',
      onClick: () => setViewMode('analytics'),
    },
    {
      label: 'Evacuations',
      value: globalStats.evacuations,
      icon: (
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 2L1 21h22L12 2zm0 3.99L19.53 19H4.47L12 5.99zM11 16h2v2h-2v-2zm0-6h2v4h-2v-4z"/>
        </svg>
      ),
      color: 'text-purple-400',
      bgColor: 'bg-purple-500/10',
      borderColor: 'border-purple-500/30',
      onClick: () => setViewMode('map'),
    },
  ];

  const secondaryStats = [
    {
      label: 'Satellites',
      value: satellites.length,
      icon: '🛰️',
      color: 'text-purple-400',
      bgColor: 'bg-purple-500/10',
      borderColor: 'border-purple-500/30',
      onClick: () => setViewMode('geospatial' as any),
    },
    {
      label: 'Hotspots Detected',
      value: satellites.reduce((sum, s) => sum + s.hotspots, 0),
      icon: '🔥',
      color: 'text-orange-400',
      bgColor: 'bg-orange-500/10',
      borderColor: 'border-orange-500/30',
      onClick: () => setViewMode('geospatial' as any),
    },
    {
      label: 'Verified Nodes',
      value: verifiedNodes.filter(n => n.status === 'online').length,
      icon: '📡',
      color: 'text-green-400',
      bgColor: 'bg-green-500/10',
      borderColor: 'border-green-500/30',
      onClick: () => setViewMode('geospatial' as any),
    },
    {
      label: 'Geo Layers',
      value: activeGeoLayers.length,
      icon: '🗺️',
      color: 'text-cyan-400',
      bgColor: 'bg-cyan-500/10',
      borderColor: 'border-cyan-500/30',
      onClick: () => setViewMode('geospatial' as any),
    },
  ];

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {statCards.map((stat, index) => (
          <div
            key={index}
            onClick={stat.onClick}
            className={`bg-gray-800/50 backdrop-blur-sm rounded-xl p-4 border ${stat.borderColor} transition-all hover:scale-105 cursor-pointer hover:shadow-lg hover:shadow-black/20`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className={`${stat.color}`}>{stat.icon}</span>
              <span className={`${stat.bgColor} ${stat.color} text-xs font-medium px-2 py-0.5 rounded-full`}>
                {stat.label}
              </span>
            </div>
            <div className="text-2xl font-bold text-white mt-1">{stat.value}</div>
          </div>
        ))}
      </div>

      {/* Geospatial & Satellite Stats Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {secondaryStats.map((stat, index) => (
          <div
            key={index}
            onClick={stat.onClick}
            className={`bg-gray-800/30 backdrop-blur-sm rounded-lg p-3 border ${stat.borderColor} transition-all hover:scale-105 cursor-pointer hover:shadow-lg hover:shadow-black/20`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-lg">{stat.icon}</span>
                <div>
                  <div className={`text-lg font-bold ${stat.color}`}>{stat.value}</div>
                  <div className="text-gray-400 text-xs">{stat.label}</div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
