import { useApp } from '../context';

export default function ResourcesPanel() {
  const {
    allResources, toggleResourceStatus,
    selectedFireId, selectFire,
    filterResourceStatus, setFilterResourceStatus,
  } = useApp();

  const filteredResources = filterResourceStatus
    ? allResources.filter(r => r.status === filterResourceStatus)
    : allResources;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'deployed': return 'bg-green-500';
      case 'standby': return 'bg-yellow-500';
      case 'maintenance': return 'bg-red-500';
      case 'transit': return 'bg-blue-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'deployed': return 'Deployed';
      case 'standby': return 'Standby';
      case 'maintenance': return 'Maintenance';
      case 'transit': return 'In Transit';
      default: return status;
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'crew':
        return (
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
            <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5z"/>
          </svg>
        );
      case 'engine':
        return (
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
            <path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.21.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.5 16c-.83 0-1.5-.67-1.5-1.5S5.67 13 6.5 13s1.5.67 1.5 1.5S7.33 16 6.5 16zm11 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zM5 11l1.5-4.5h11L19 11H5z"/>
          </svg>
        );
      case 'aircraft':
      case 'helicopter':
        return (
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
            <path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z"/>
          </svg>
        );
      default:
        return null;
    }
  };

  const deployedCount = allResources.filter(r => r.status === 'deployed').length;
  const standbyCount = allResources.filter(r => r.status === 'standby').length;
  const maintenanceCount = allResources.filter(r => r.status === 'maintenance').length;
  const transitCount = allResources.filter(r => r.status === 'transit').length;

  return (
    <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700 overflow-hidden h-full flex flex-col">
      <div className="px-4 py-3 border-b border-gray-700 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <svg className="w-4 h-4 text-green-400" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
          </svg>
          <span className="text-white font-medium text-sm">Resource Status</span>
          {selectedFireId && (
            <span className="text-xs bg-orange-500/20 text-orange-400 px-2 py-0.5 rounded-full">
              Filtered by fire
            </span>
          )}
        </div>
      </div>

      {/* Status Summary - clickable filters */}
      <div className="px-4 py-3 border-b border-gray-700 grid grid-cols-4 gap-2">
        <button
          onClick={() => setFilterResourceStatus(filterResourceStatus === 'deployed' ? null : 'deployed')}
          className={`text-center rounded-lg p-1 transition-all ${
            filterResourceStatus === 'deployed' ? 'bg-green-500/10 ring-1 ring-green-500/50' : 'hover:bg-gray-700/50'
          }`}
        >
          <div className="text-green-400 font-bold text-lg">{deployedCount}</div>
          <div className="text-gray-400 text-xs">Deployed</div>
        </button>
        <button
          onClick={() => setFilterResourceStatus(filterResourceStatus === 'standby' ? null : 'standby')}
          className={`text-center rounded-lg p-1 transition-all ${
            filterResourceStatus === 'standby' ? 'bg-yellow-500/10 ring-1 ring-yellow-500/50' : 'hover:bg-gray-700/50'
          }`}
        >
          <div className="text-yellow-400 font-bold text-lg">{standbyCount}</div>
          <div className="text-gray-400 text-xs">Standby</div>
        </button>
        <button
          onClick={() => setFilterResourceStatus(filterResourceStatus === 'transit' ? null : 'transit')}
          className={`text-center rounded-lg p-1 transition-all ${
            filterResourceStatus === 'transit' ? 'bg-blue-500/10 ring-1 ring-blue-500/50' : 'hover:bg-gray-700/50'
          }`}
        >
          <div className="text-blue-400 font-bold text-lg">{transitCount}</div>
          <div className="text-gray-400 text-xs">Transit</div>
        </button>
        <button
          onClick={() => setFilterResourceStatus(filterResourceStatus === 'maintenance' ? null : 'maintenance')}
          className={`text-center rounded-lg p-1 transition-all ${
            filterResourceStatus === 'maintenance' ? 'bg-red-500/10 ring-1 ring-red-500/50' : 'hover:bg-gray-700/50'
          }`}
        >
          <div className="text-red-400 font-bold text-lg">{maintenanceCount}</div>
          <div className="text-gray-400 text-xs">Maint.</div>
        </button>
      </div>

      {/* Resource List */}
      <div className="flex-1 overflow-y-auto p-3 space-y-1.5">
        {filteredResources.map((resource) => (
          <div
            key={resource.id}
            className={`flex items-center gap-3 p-2.5 rounded-lg transition-all cursor-pointer group ${
              selectedFireId && resource.assignedTo === selectedFireId
                ? 'bg-orange-500/10 border border-orange-500/30'
                : 'hover:bg-gray-900/50 border border-transparent'
            }`}
          >
            <div className={`w-2 h-2 rounded-full ${getStatusColor(resource.status)} flex-shrink-0`}></div>
            <div className="text-gray-300 flex-shrink-0">
              {getTypeIcon(resource.type)}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-white text-xs font-medium truncate">{resource.name}</div>
              <div className="flex items-center gap-2">
                <span className="text-gray-500 text-xs">
                  {resource.personnel > 0 ? `${resource.personnel} pers.` : 'N/A'}
                </span>
                {resource.assignedTo && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      selectFire(resource.assignedTo);
                    }}
                    className="text-orange-400/60 text-xs hover:text-orange-400 transition-colors"
                  >
                    → {resource.assignedTo}
                  </button>
                )}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className={`text-xs px-1.5 py-0.5 rounded ${
                resource.status === 'deployed' ? 'bg-green-500/10 text-green-400' :
                resource.status === 'standby' ? 'bg-yellow-500/10 text-yellow-400' :
                resource.status === 'maintenance' ? 'bg-red-500/10 text-red-400' :
                'bg-blue-500/10 text-blue-400'
              }`}>
                {getStatusLabel(resource.status)}
              </span>
              {(resource.status === 'deployed' || resource.status === 'standby') && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleResourceStatus(resource.id);
                  }}
                  className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-white transition-all"
                  title="Toggle status"
                >
                  <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 4V1L8 5l4 4V6c3.31 0 6 2.69 6 6 0 1.01-.25 1.97-.7 2.8l1.46 1.46C19.54 15.03 20 13.57 20 12c0-4.42-3.58-8-8-8zm0 14c-3.31 0-6-2.69-6-6 0-1.01.25-1.97.7-2.8L5.24 7.74C4.46 8.97 4 10.43 4 12c0 4.42 3.58 8 8 8v3l4-4-4-4v3z"/>
                  </svg>
                </button>
              )}
            </div>
          </div>
        ))}
        {filteredResources.length === 0 && (
          <div className="text-center py-8 text-gray-500 text-sm">
            No resources match filter
          </div>
        )}
      </div>
    </div>
  );
}
