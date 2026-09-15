import { useApp } from '../context';

export default function CommunicationsPanel() {
  const { allResources, fires, selectFire, setViewMode } = useApp();

  // Group resources by assigned fire
  const fireGroups = fires.map(fire => ({
    fire,
    resources: allResources.filter(r => r.assignedTo === fire.id),
    totalPersonnel: allResources
      .filter(r => r.assignedTo === fire.id)
      .reduce((sum, r) => sum + r.personnel, 0),
  })).filter(g => g.resources.length > 0);

  const unassigned = allResources.filter(r => !r.assignedTo);

  return (
    <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700 overflow-hidden h-full flex flex-col">
      <div className="px-4 py-3 border-b border-gray-700 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <svg className="w-4 h-4 text-purple-400" fill="currentColor" viewBox="0 0 24 24">
            <path d="M20 2H4c-1.1 0-1.99.9-1.99 2L2 22l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zM6 9h12v2H6V9zm8 5H6v-2h8v2zm4-6H6V6h12v2z"/>
          </svg>
          <span className="text-white font-medium text-sm">Communications</span>
        </div>
        <span className="text-xs text-gray-500">{fireGroups.length} channels</span>
      </div>

      <div className="flex-1 overflow-y-auto p-3 space-y-3">
        {/* Fire Communication Channels */}
        {fireGroups.map(({ fire, resources, totalPersonnel }) => (
          <div
            key={fire.id}
            className="bg-gray-900/50 rounded-lg border border-gray-700/50 overflow-hidden"
          >
            {/* Channel header */}
            <button
              onClick={() => { selectFire(fire.id); setViewMode('dashboard'); }}
              className="w-full px-3 py-2 flex items-center justify-between hover:bg-gray-700/30 transition-colors text-left"
            >
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${
                  fire.severity === 'critical' ? 'bg-red-500 animate-pulse' :
                  fire.severity === 'high' ? 'bg-orange-500' :
                  fire.severity === 'medium' ? 'bg-yellow-500' : 'bg-green-500'
                }`}></div>
                <div>
                  <span className="text-white text-xs font-medium">#{fire.name.replace(/\s+/g, '-').toLowerCase()}</span>
                  <div className="text-gray-500 text-xs">{resources.length} units • {totalPersonnel} pers.</div>
                </div>
              </div>
              <span className="text-orange-400 text-xs opacity-0 hover:opacity-100 transition-opacity">→</span>
            </button>

            {/* Messages simulation */}
            <div className="px-3 pb-2 space-y-1.5">
              {resources.slice(0, 2).map((r) => (
                <div key={r.id} className="flex items-start gap-2 text-xs">
                  <span className="text-blue-400 font-medium whitespace-nowrap">{r.name.split(' ').slice(0, 2).join(' ')}:</span>
                  <span className="text-gray-300">
                    {r.status === 'deployed' ? 'On scene, operations ongoing.' :
                     r.status === 'transit' ? 'En route to location.' :
                     'Standing by for assignment.'}
                  </span>
                </div>
              ))}
              <div className="flex items-start gap-2 text-xs">
                <span className="text-orange-400 font-medium">INCIDENT CMD:</span>
                <span className="text-gray-300">
                  {fire.status}
                </span>
              </div>
            </div>
          </div>
        ))}

        {/* Unassigned / General Channel */}
        {unassigned.length > 0 && (
          <div className="bg-gray-900/50 rounded-lg border border-gray-700/50 overflow-hidden">
            <div className="px-3 py-2 flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-gray-500"></div>
              <span className="text-white text-xs font-medium">#general-standby</span>
              <span className="text-gray-500 text-xs ml-auto">{unassigned.length} units</span>
            </div>
            <div className="px-3 pb-2 space-y-1.5">
              {unassigned.slice(0, 2).map((r) => (
                <div key={r.id} className="flex items-start gap-2 text-xs">
                  <span className="text-blue-400 font-medium whitespace-nowrap">{r.name.split(' ').slice(0, 2).join(' ')}:</span>
                  <span className="text-gray-300">
                    {r.status === 'standby' ? 'Ready for dispatch.' :
                     r.status === 'maintenance' ? 'Under maintenance.' : 'Awaiting orders.'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
