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

function DashboardView() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 h-[calc(100vh-220px)]">
      {/* Left Panel - Incidents */}
      <div className="lg:col-span-3 overflow-hidden">
        <IncidentsList />
      </div>

      {/* Center - Map */}
      <div className="lg:col-span-6 overflow-hidden">
        <MapView />
      </div>

      {/* Right Panel - Alerts & Resources */}
      <div className="lg:col-span-3 flex flex-col gap-4 overflow-hidden">
        <div className="flex-shrink-0">
          <WeatherPanel />
        </div>
        <div className="flex-1 overflow-hidden flex flex-col">
          <AlertsPanel />
        </div>
      </div>
    </div>
  );
}

function MapViewPage() {
  return (
    <div className="h-[calc(100vh-220px)]">
      <MapView />
    </div>
  );
}

function ResourcesView() {
  return (
    <div className="h-[calc(100vh-220px)]">
      <ResourcesPanel />
    </div>
  );
}

function AppContent() {
  const { viewMode } = useApp();

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
      </main>

      {/* Footer Status Bar */}
      <footer className="bg-gray-900 border-t border-gray-700 px-6 py-2 flex items-center justify-between text-xs text-gray-400">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
            System Online
          </span>
          <span>|</span>
          <span>Region: West Coast</span>
          <span>|</span>
          <span>Last Sync: Just now</span>
        </div>
        <div className="flex items-center gap-4">
          <span>Firecycle v2.4.1</span>
          <span>|</span>
          <span>© 2026 Firecycle Systems</span>
        </div>
      </footer>

      {/* Notification Toast */}
      <NotificationToast />
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
