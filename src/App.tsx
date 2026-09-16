import { AppProvider, useApp } from './context';
import Header from './components/Header';
import StatsPanel from './components/StatsPanel';
import MapView from './components/MapView';
import IncidentsList from './components/IncidentsList';
import AlertsPanel from './components/AlertsPanel';
import WeatherPanel from './components/WeatherPanel';
import ResourcesPanel from './components/ResourcesPanel';
import AnalyticsView from './components/AnalyticsView';
import NotificationToast from './components/NotificationToast';
import FireDetailPanel from './components/FireDetailPanel';
import ActivityFeed from './components/ActivityFeed';
import GlobalSearch from './components/GlobalSearch';
import CommunicationsPanel from './components/CommunicationsPanel';
import EvacuationPanel from './components/EvacuationPanel';
import SatellitePanel from './components/SatellitePanel';
import GeospatialPanel from './components/GeospatialPanel';
import VerifiedNodesPanel from './components/VerifiedNodesPanel';
import TerritorySearch from './components/TerritorySearch';

function DashboardView() {
  const { selectedFireId } = useApp();

  // Layout changes based on whether a fire is selected
  if (selectedFireId) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 h-[calc(100vh-220px)]">
        {/* Left Panel - Incidents */}
        <div className="lg:col-span-2 overflow-hidden">
          <IncidentsList />
        </div>

        {/* Center - Map */}
        <div className="lg:col-span-5 overflow-hidden">
          <MapView />
        </div>

        {/* Middle Right - Fire Detail */}
        <div className="lg:col-span-2 overflow-hidden">
          <FireDetailPanel />
        </div>

        {/* Right Panel - Activity, Weather & Alerts */}
        <div className="lg:col-span-3 flex flex-col gap-3 overflow-hidden">
          <div className="flex-shrink-0">
            <WeatherPanel />
          </div>
          <div className="flex-1 overflow-hidden flex flex-col min-h-0">
            <AlertsPanel />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 h-[calc(100vh-220px)]">
      {/* Left Panel - Incidents & Evacuations */}
      <div className="lg:col-span-3 flex flex-col gap-3 overflow-hidden">
        <div className="flex-1 overflow-hidden min-h-0">
          <IncidentsList />
        </div>
        <div className="flex-shrink-0 max-h-[240px] overflow-hidden">
          <EvacuationPanel />
        </div>
      </div>

      {/* Center - Map */}
      <div className="lg:col-span-5 overflow-hidden">
        <MapView />
      </div>

      {/* Right Panel - Weather, Alerts & Communications */}
      <div className="lg:col-span-4 flex flex-col gap-3 overflow-hidden">
        <div className="flex-shrink-0">
          <WeatherPanel />
        </div>
        <div className="grid grid-cols-2 gap-3 flex-1 overflow-hidden min-h-0">
          <AlertsPanel />
          <CommunicationsPanel />
        </div>
      </div>
    </div>
  );
}

function MapViewPage() {
  const { selectedFireId } = useApp();

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 h-[calc(100vh-220px)]">
      {/* Full Map */}
      <div className={`${selectedFireId ? 'lg:col-span-9' : 'lg:col-span-12'} overflow-hidden`}>
        <MapView />
      </div>

      {/* Side panel when fire is selected */}
      {selectedFireId && (
        <div className="lg:col-span-3 flex flex-col gap-3 overflow-hidden">
          <FireDetailPanel />
          <div className="flex-1 overflow-hidden min-h-0">
            <ResourcesPanel />
          </div>
        </div>
      )}
    </div>
  );
}

function ResourcesView() {
  const { selectedFireId } = useApp();

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 h-[calc(100vh-220px)]">
      {/* Resources Panel */}
      <div className={`${selectedFireId ? 'lg:col-span-8' : 'lg:col-span-12'} overflow-hidden`}>
        <ResourcesPanel />
      </div>

      {/* Side panel when fire is selected */}
      {selectedFireId && (
        <div className="lg:col-span-4 flex flex-col gap-3 overflow-hidden">
          <FireDetailPanel />
          <div className="flex-1 overflow-hidden min-h-0">
            <CommunicationsPanel />
          </div>
        </div>
      )}
    </div>
  );
}

function GeospatialView() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 h-[calc(100vh-220px)]">
      {/* Map with geospatial layers */}
      <div className="lg:col-span-4 overflow-hidden">
        <MapView />
      </div>

      {/* Territory Search */}
      <div className="lg:col-span-3 overflow-hidden flex flex-col gap-3">
        <TerritorySearch />
        <div className="flex-1 overflow-hidden min-h-0">
          <SatellitePanel />
        </div>
      </div>

      {/* Geospatial Layers & Verified Nodes */}
      <div className="lg:col-span-5 flex flex-col gap-3 overflow-hidden">
        <div className="flex-1 overflow-hidden min-h-0">
          <GeospatialPanel />
        </div>
        <div className="flex-1 overflow-hidden min-h-0">
          <VerifiedNodesPanel />
        </div>
      </div>
    </div>
  );
}

function AppContent() {
  const { viewMode, satellites, verifiedNodes } = useApp();

  return (
    <div className="min-h-screen bg-gray-950 text-white flex flex-col">
      <Header />
      <main className="flex-1 p-4 space-y-4 overflow-hidden">
        {/* Stats Row */}
        <StatsPanel />

        {/* Main Content based on view mode */}
        {viewMode === 'dashboard' && <DashboardView />}
        {viewMode === 'map' && <MapViewPage />}
        {viewMode === 'resources' && <ResourcesView />}
        {viewMode === 'analytics' && <AnalyticsView />}
        {viewMode === 'geospatial' && <GeospatialView />}
      </main>

      {/* Footer Status Bar */}
      <footer className="bg-gray-900 border-t border-gray-700 px-6 py-2 flex items-center justify-between text-xs text-gray-400">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
            System Online
          </span>
          <span>|</span>
          <span>🛰️ {satellites.length} Satellites</span>
          <span>|</span>
          <span>📡 {verifiedNodes.filter(n => n.status === 'online').length} Nodes Active</span>
          <span>|</span>
          <span>Region: Las Hurdes, Cáceres</span>
        </div>
        <div className="flex items-center gap-4">
          <span>Firecycle v2.5.0</span>
          <span>|</span>
          <span>© 2026 Firecycle Systems</span>
        </div>
      </footer>

      {/* Notification Toast */}
      <NotificationToast />

      {/* Global Search (Command Palette) */}
      <GlobalSearch />
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
