import { useApp } from '../context';

export default function EvacuationPanel() {
  const { fires, selectFire, setViewMode } = useApp();

  // Critical and high severity fires that might need evacuation
  const evacuationFires = fires
    .filter(f => f.severity === 'critical' || f.severity === 'high')
    .sort((a, b) => {
      const severityOrder = { critical: 0, high: 1 };
      return (severityOrder[a.severity as keyof typeof severityOrder] || 2) -
             (severityOrder[b.severity as keyof typeof severityOrder] || 2);
    });

  const getEvacuationStatus = (fire: typeof fires[0]) => {
    if (fire.severity === 'critical' && fire.containment < 50) {
      return { status: 'active', label: 'Evacuation Active', color: 'text-red-400 bg-red-500/10 border-red-500/30' };
    }
    if (fire.severity === 'critical' || (fire.severity === 'high' && fire.containment < 40)) {
      return { status: 'ready', label: 'Prep to Evacuate', color: 'text-yellow-400 bg-yellow-500/10 border-yellow-500/30' };
    }
    return { status: 'monitor', label: 'Monitoring', color: 'text-blue-400 bg-blue-500/10 border-blue-500/30' };
  };

  return (
    <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700 overflow-hidden h-full flex flex-col">
      <div className="px-4 py-3 border-b border-gray-700 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <svg className="w-4 h-4 text-purple-400" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2L1 21h22L12 2zm0 3.99L19.53 19H4.47L12 5.99zM11 16h2v2h-2v-2zm0-6h2v4h-2v-4z"/>
          </svg>
          <span className="text-white font-medium text-sm">Evacuation Zones</span>
        </div>
        <span className="bg-purple-500/20 text-purple-400 text-xs px-2 py-0.5 rounded-full">
          {evacuationFires.filter(f => getEvacuationStatus(f).status === 'active').length} active
        </span>
      </div>

      <div className="flex-1 overflow-y-auto p-3 space-y-2">
        {evacuationFires.length === 0 ? (
          <div className="text-center py-8 text-gray-500 text-sm">
            No evacuation zones active
          </div>
        ) : (
          evacuationFires.map((fire) => {
            const evac = getEvacuationStatus(fire);
            return (
              <div
                key={fire.id}
                onClick={() => { selectFire(fire.id); setViewMode('dashboard'); }}
                className="bg-gray-900/50 rounded-lg border border-gray-700/50 p-3 cursor-pointer hover:border-gray-600 transition-all group"
              >
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h4 className="text-white text-sm font-medium group-hover:text-purple-300 transition-colors">
                      {fire.name}
                    </h4>
                    <p className="text-gray-400 text-xs">{fire.location}</p>
                  </div>
                  <span className={`text-xs px-2 py-0.5 rounded-full border ${evac.color}`}>
                    {evac.label}
                  </span>
                </div>

                {/* Risk indicators */}
                <div className="grid grid-cols-3 gap-2 mt-2">
                  <div className="text-center">
                    <div className="text-white text-sm font-bold">{fire.acres.toLocaleString()}</div>
                    <div className="text-gray-500 text-xs">Acres</div>
                  </div>
                  <div className="text-center">
                    <div className="text-white text-sm font-bold">{fire.containment}%</div>
                    <div className="text-gray-500 text-xs">Contained</div>
                  </div>
                  <div className="text-center">
                    <div className="text-white text-sm font-bold">{fire.crews + fire.engines}</div>
                    <div className="text-gray-500 text-xs">Units</div>
                  </div>
                </div>

                {/* Risk bar */}
                <div className="mt-2">
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="text-gray-400">Threat Level</span>
                    <span className={
                      fire.severity === 'critical' ? 'text-red-400' : 'text-orange-400'
                    }>
                      {fire.severity === 'critical' ? 'SEVERE' : 'HIGH'}
                    </span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-1.5">
                    <div
                      className={`h-1.5 rounded-full ${
                        fire.severity === 'critical' ? 'bg-red-500' : 'bg-orange-500'
                      }`}
                      style={{ width: `${100 - fire.containment}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
