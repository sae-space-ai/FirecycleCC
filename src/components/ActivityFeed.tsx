import { useState, useEffect } from 'react';
import { useApp } from '../context';

interface ActivityEvent {
  id: string;
  type: 'fire_update' | 'resource_move' | 'alert' | 'containment' | 'weather' | 'evacuation';
  message: string;
  timestamp: Date;
  fireId?: string;
  resourceId?: string;
}

const generateInitialEvents = (): ActivityEvent[] => {
  const now = new Date();
  return [
    {
      id: 'e1',
      type: 'fire_update',
      message: 'Sierra Blaze expanded 200 acres in last hour',
      timestamp: new Date(now.getTime() - 1000 * 60 * 2),
      fireId: 'FIRE-001',
    },
    {
      id: 'e2',
      type: 'resource_move',
      message: 'Engine 304 dispatched to Redwood Flats',
      timestamp: new Date(now.getTime() - 1000 * 60 * 5),
      resourceId: 'R-008',
      fireId: 'FIRE-006',
    },
    {
      id: 'e3',
      type: 'containment',
      message: 'Canyon Rim Fire containment reached 90%',
      timestamp: new Date(now.getTime() - 1000 * 60 * 12),
      fireId: 'FIRE-005',
    },
    {
      id: 'e4',
      type: 'evacuation',
      message: 'Evacuation orders issued for Thunder Peak area',
      timestamp: new Date(now.getTime() - 1000 * 60 * 18),
      fireId: 'FIRE-004',
    },
    {
      id: 'e5',
      type: 'weather',
      message: 'Red flag warning issued for Northern California',
      timestamp: new Date(now.getTime() - 1000 * 60 * 25),
    },
    {
      id: 'e6',
      type: 'alert',
      message: 'Hotshot Team Alpha deployed to Sierra Blaze',
      timestamp: new Date(now.getTime() - 1000 * 60 * 32),
      resourceId: 'R-001',
      fireId: 'FIRE-001',
    },
    {
      id: 'e7',
      type: 'resource_move',
      message: 'Air Tanker 14 refueled and back in service',
      timestamp: new Date(now.getTime() - 1000 * 60 * 40),
      resourceId: 'R-009',
    },
    {
      id: 'e8',
      type: 'fire_update',
      message: 'Eagle Ridge Fire status changed to Containment',
      timestamp: new Date(now.getTime() - 1000 * 60 * 48),
      fireId: 'FIRE-002',
    },
  ];
};

export default function ActivityFeed() {
  const { selectFire } = useApp();
  const [events] = useState<ActivityEvent[]>(generateInitialEvents);
  const [filter, setFilter] = useState<string>('all');

  const filteredEvents = filter === 'all'
    ? events
    : events.filter(e => e.type === filter);

  const getEventIcon = (type: string) => {
    switch (type) {
      case 'fire_update':
        return (
          <div className="w-7 h-7 bg-red-500/20 rounded-full flex items-center justify-center flex-shrink-0">
            <svg className="w-3.5 h-3.5 text-red-400" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2C8.5 7 4 10 4 14.5C4 18.64 7.58 22 12 22C16.42 22 20 18.64 20 14.5C20 10 15.5 7 12 2Z"/>
            </svg>
          </div>
        );
      case 'resource_move':
        return (
          <div className="w-7 h-7 bg-blue-500/20 rounded-full flex items-center justify-center flex-shrink-0">
            <svg className="w-3.5 h-3.5 text-blue-400" fill="currentColor" viewBox="0 0 24 24">
              <path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.21.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99z"/>
            </svg>
          </div>
        );
      case 'containment':
        return (
          <div className="w-7 h-7 bg-green-500/20 rounded-full flex items-center justify-center flex-shrink-0">
            <svg className="w-3.5 h-3.5 text-green-400" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
            </svg>
          </div>
        );
      case 'evacuation':
        return (
          <div className="w-7 h-7 bg-purple-500/20 rounded-full flex items-center justify-center flex-shrink-0">
            <svg className="w-3.5 h-3.5 text-purple-400" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2L1 21h22L12 2zm0 3.99L19.53 19H4.47L12 5.99z"/>
            </svg>
          </div>
        );
      case 'weather':
        return (
          <div className="w-7 h-7 bg-cyan-500/20 rounded-full flex items-center justify-center flex-shrink-0">
            <svg className="w-3.5 h-3.5 text-cyan-400" fill="currentColor" viewBox="0 0 24 24">
              <path d="M6.76 4.84l-1.8-1.79-1.41 1.41 1.79 1.79 1.42-1.41zM4 10.5H1v2h3v-2z"/>
            </svg>
          </div>
        );
      default:
        return (
          <div className="w-7 h-7 bg-yellow-500/20 rounded-full flex items-center justify-center flex-shrink-0">
            <svg className="w-3.5 h-3.5 text-yellow-400" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.89 2 2 2zm6-6v-5c0-3.07-1.64-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.63 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z"/>
            </svg>
          </div>
        );
    }
  };

  const formatTime = (date: Date) => {
    const diff = Math.floor((Date.now() - date.getTime()) / 1000);
    if (diff < 60) return `${diff}s ago`;
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    return `${Math.floor(diff / 3600)}h ago`;
  };

  return (
    <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700 overflow-hidden h-full flex flex-col">
      <div className="px-4 py-3 border-b border-gray-700 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <svg className="w-4 h-4 text-cyan-400" fill="currentColor" viewBox="0 0 24 24">
            <path d="M13 3c-4.97 0-9 4.03-9 9H1l3.89 3.89.07.14L9 12H6c0-3.87 3.13-7 7-7s7 3.13 7 7-3.13 7-7 7c-1.93 0-3.68-.79-4.94-2.06l-1.42 1.42C8.27 19.99 10.51 21 13 21c4.97 0 9-4.03 9-9s-4.03-9-9-9zm-1 5v5l4.28 2.54.72-1.21-3.5-2.08V8H12z"/>
          </svg>
          <span className="text-white font-medium text-sm">Activity Feed</span>
          <span className="text-xs text-gray-400">Live</span>
          <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span>
        </div>
      </div>

      {/* Filter tabs */}
      <div className="px-3 py-2 border-b border-gray-700/50 flex gap-1 overflow-x-auto">
        {[
          { key: 'all', label: 'All' },
          { key: 'fire_update', label: 'Fires' },
          { key: 'resource_move', label: 'Resources' },
          { key: 'containment', label: 'Progress' },
          { key: 'evacuation', label: 'Evac' },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setFilter(tab.key)}
            className={`text-xs px-2.5 py-1 rounded-full whitespace-nowrap transition-colors ${
              filter === tab.key
                ? 'bg-orange-500/20 text-orange-400 border border-orange-500/50'
                : 'bg-gray-700/50 text-gray-400 hover:text-white border border-transparent'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Events list */}
      <div className="flex-1 overflow-y-auto p-3">
        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-3.5 top-0 bottom-0 w-px bg-gray-700"></div>

          <div className="space-y-3">
            {filteredEvents.map((event) => (
              <div
                key={event.id}
                className={`relative flex items-start gap-3 pl-0 cursor-pointer group ${
                  event.fireId ? 'hover:bg-gray-900/30' : ''
                } rounded-lg p-2 -mx-2 transition-colors`}
                onClick={() => event.fireId && selectFire(event.fireId)}
              >
                {getEventIcon(event.type)}
                <div className="flex-1 min-w-0 pt-0.5">
                  <p className="text-gray-200 text-xs leading-relaxed">{event.message}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-gray-500 text-xs">{formatTime(event.timestamp)}</span>
                    {event.fireId && (
                      <span className="text-orange-400/60 text-xs opacity-0 group-hover:opacity-100 transition-opacity">
                        → View fire
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
