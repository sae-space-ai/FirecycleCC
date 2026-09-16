import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';
import { fireIncidents, resources, alerts, weatherData, stats, satelliteData, geospatialLayers, verifiedNodes, territories, type FireIncident, type Resource, type Alert, type WeatherData, type SatelliteData, type GeospatialLayer, type VerifiedNode, type Territory } from './data';

type ViewMode = 'dashboard' | 'map' | 'resources' | 'analytics' | 'geospatial';

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
  satellites: SatelliteData[];
  geoLayers: GeospatialLayer[];
  verifiedNodes: VerifiedNode[];

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

  // Global search
  globalSearchOpen: boolean;
  setGlobalSearchOpen: (open: boolean) => void;

  // Geospatial actions
  toggleGeoLayer: (id: string) => void;
  setGeoLayerOpacity: (id: string, opacity: number) => void;

  // Derived geospatial
  fireSatellites: SatelliteData[];
  fireVerifiedNodes: VerifiedNode[];
  activeGeoLayers: GeospatialLayer[];

  // Territory search
  allTerritories: Territory[];
  mapCenter: { lat: number; lng: number } | null;
  setMapCenter: (coords: { lat: number; lng: number } | null) => void;
  searchTerritory: (query: string) => Territory[];
  searchByCoordinates: (lat: number, lng: number, radiusKm?: number) => {
    territories: Territory[];
    fires: FireIncident[];
    nodes: VerifiedNode[];
  };
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
  const [globalSearchOpen, setGlobalSearchOpen] = useState(false);
  const [localGeoLayers, setLocalGeoLayers] = useState(geospatialLayers);
  const [mapCenter, setMapCenter] = useState<{ lat: number; lng: number } | null>({ lat: 40.35, lng: -6.25 });

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

  const toggleGeoLayer = useCallback((id: string) => {
    setLocalGeoLayers(prev => prev.map(l =>
      l.id === id ? { ...l, active: !l.active } : l
    ));
  }, []);

  const setGeoLayerOpacity = useCallback((id: string, opacity: number) => {
    setLocalGeoLayers(prev => prev.map(l =>
      l.id === id ? { ...l, opacity } : l
    ));
  }, []);

  // Derived geospatial data
  const fireSatellites = selectedFireId
    ? satelliteData.filter(s => s.fireId === selectedFireId)
    : [];

  const fireVerifiedNodes = selectedFireId
    ? verifiedNodes.filter(n => n.fireId === selectedFireId)
    : [];

  const activeGeoLayers = localGeoLayers.filter(l => l.active);

  // Territory search functions
  const searchTerritory = useCallback((query: string): Territory[] => {
    if (!query.trim()) return [];
    const q = query.toLowerCase().trim();
    
    // Check if it's a coordinate search (format: "lat, lng" or "lat,lng")
    const coordMatch = q.match(/^(-?\d+\.?\d*)\s*,\s*(-?\d+\.?\d*)$/);
    if (coordMatch) {
      // For coordinate search, return empty and let searchByCoordinates handle it
      return [];
    }
    
    return territories.filter(t =>
      t.name.toLowerCase().includes(q) ||
      t.state.toLowerCase().includes(q) ||
      t.type.toLowerCase().includes(q) ||
      (t.description && t.description.toLowerCase().includes(q))
    );
  }, []);

  const searchByCoordinates = useCallback((lat: number, lng: number, radiusKm: number = 100) => {
    // Haversine formula for distance calculation
    const getDistanceKm = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
      const R = 6371; // Earth's radius in km
      const dLat = (lat2 - lat1) * Math.PI / 180;
      const dLon = (lon2 - lon1) * Math.PI / 180;
      const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
                Math.sin(dLon / 2) * Math.sin(dLon / 2);
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      return R * c;
    };

    const nearbyTerritories = territories
      .map(t => ({ ...t, distance: getDistanceKm(lat, lng, t.lat, t.lng) }))
      .filter(t => t.distance <= radiusKm)
      .sort((a, b) => a.distance - b.distance);

    const nearbyFires = fireIncidents
      .map(f => ({ ...f, distance: getDistanceKm(lat, lng, f.lat, f.lng) }))
      .filter(f => f.distance <= radiusKm)
      .sort((a, b) => a.distance - b.distance);

    const nearbyNodes = verifiedNodes
      .map(n => ({ ...n, distance: getDistanceKm(lat, lng, n.lat, n.lng) }))
      .filter(n => n.distance <= radiusKm)
      .sort((a, b) => a.distance - b.distance);

    return {
      territories: nearbyTerritories,
      fires: nearbyFires,
      nodes: nearbyNodes,
    };
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
      globalSearchOpen, setGlobalSearchOpen,
      satellites: satelliteData,
      geoLayers: localGeoLayers,
      verifiedNodes: verifiedNodes,
      toggleGeoLayer,
      setGeoLayerOpacity,
      fireSatellites,
      fireVerifiedNodes,
      activeGeoLayers,
      allTerritories: territories,
      mapCenter,
      setMapCenter,
      searchTerritory,
      searchByCoordinates,
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
