import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';
import { fireIncidents, resources, alerts, weatherData, stats, type FireIncident, type Resource, type Alert, type WeatherData } from './data';

type ViewMode = 'dashboard' | 'map' | 'resources' | 'analytics';

interface AppState {
  // View
  viewMode: ViewMode;
  setViewMode: (mode: ViewMode) => void;

  // Fire selection
  selectedFireId: string | null;
  setSelectedFireId: (id: string | null) => void;
  hoveredFireId: string | null;
  setHoveredFireId: (id: string | null) => void;

  // Data
  fires: FireIncident[];
  allResources: Resource[];
  allAlerts: Alert[];
  weather: WeatherData;
  globalStats: typeof stats;

  // Derived
  selectedFire: FireIncident | null;
  fireResources: Resource[];
  fireAlerts: Alert[];

  // Actions
  selectFire: (id: string | null) => void;
  dismissAlert: (id: string) => void;
  toggleResourceStatus: (id: string) => void;
  filterSeverity: string | null;
  setFilterSeverity: (s: string | null) => void;
  filterResourceStatus: string | null;
  setFilterResourceStatus: (s: string | null) => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;

  // Notifications
  notifications: Notification[];
  addNotification: (n: Omit<Notification, 'id' | 'timestamp'>) => void;
  dismissNotification: (id: string) => void;
}

interface Notification {
  id: string;
  type: 'success' | 'error' | 'info' | 'warning';
  message: string;
  timestamp: string;
}

const AppContext = createContext<AppState | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [viewMode, setViewMode] = useState<ViewMode>('dashboard');
  const [selectedFireId, setSelectedFireId] = useState<string | null>(null);
  const [hoveredFireId, setHoveredFireId] = useState<string | null>(null);
  const [filterSeverity, setFilterSeverity] = useState<string | null>(null);
  const [filterResourceStatus, setFilterResourceStatus] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [localAlerts, setLocalAlerts] = useState(alerts);
  const [localResources, setLocalResources] = useState(resources);

  const selectedFire = selectedFireId ? fireIncidents.find(f => f.id === selectedFireId) ?? null : null;

  const fireResources = selectedFireId
    ? localResources.filter(r => r.assignedTo === selectedFireId)
    : [];

  const fireAlerts = selectedFireId
    ? localAlerts.filter(a => a.fireId === selectedFireId)
    : [];

  const selectFire = useCallback((id: string | null) => {
    setSelectedFireId(id);
    if (id) {
      setViewMode('dashboard');
    }
  }, []);

  const dismissAlert = useCallback((id: string) => {
    setLocalAlerts(prev => prev.filter(a => a.id !== id));
    setNotifications(prev => [{
      id: `notif-${Date.now()}`,
      type: 'info',
      message: 'Alert dismissed',
      timestamp: new Date().toISOString(),
    }, ...prev]);
  }, []);

  const toggleResourceStatus = useCallback((id: string) => {
    setLocalResources(prev => prev.map(r => {
      if (r.id !== id) return r;
      const nextStatus = r.status === 'deployed' ? 'standby' :
                         r.status === 'standby' ? 'deployed' : r.status;
      return { ...r, status: nextStatus };
    }));
    const resource = localResources.find(r => r.id === id);
    if (resource) {
      setNotifications(prev => [{
        id: `notif-${Date.now()}`,
        type: 'success',
        message: `${resource.name} status updated`,
        timestamp: new Date().toISOString(),
      }, ...prev]);
    }
  }, [localResources]);

  const addNotification = useCallback((n: Omit<Notification, 'id' | 'timestamp'>) => {
    setNotifications(prev => [{
      ...n,
      id: `notif-${Date.now()}-${Math.random()}`,
      timestamp: new Date().toISOString(),
    }, ...prev].slice(0, 20));
  }, []);

  const dismissNotification = useCallback((id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  }, []);

  // Compute dynamic stats
  const activeFires = fireIncidents.length;
  const totalAcres = fireIncidents.reduce((sum, f) => sum + f.acres, 0);
  const personnelDeployed = localResources
    .filter(r => r.status === 'deployed')
    .reduce((sum, r) => sum + r.personnel, 0);
  const resourcesDeployed = localResources.filter(r => r.status === 'deployed').length;
  const avgContainment = Math.round(
    fireIncidents.reduce((sum, f) => sum + f.containment, 0) / fireIncidents.length
  );
  const evacuations = fireIncidents.filter(f => f.severity === 'critical').length;

  const globalStats = {
    activeFires,
    totalAcres,
    personnelDeployed,
    resourcesDeployed,
    avgContainment,
    evacuations,
  };

  return (
    <AppContext.Provider value={{
      viewMode, setViewMode,
      selectedFireId, setSelectedFireId,
      hoveredFireId, setHoveredFireId,
      fires: fireIncidents,
      allResources: localResources,
      allAlerts: localAlerts,
      weather: weatherData,
      globalStats,
      selectedFire,
      fireResources,
      fireAlerts,
      selectFire,
      dismissAlert,
      toggleResourceStatus,
      filterSeverity, setFilterSeverity,
      filterResourceStatus, setFilterResourceStatus,
      searchQuery, setSearchQuery,
      notifications, addNotification, dismissNotification,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
