import { AppProvider, useApp } from './context';
import { ErrorBoundary } from './components/ErrorBoundary';
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

  if (selectedFireId) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 h-[calc(100vh-220px)]">
        <div className="lg:col-span-2 overflow-hidden">
          <ErrorBoundary><IncidentsList /></ErrorBoundary>
        </div>
        <div className="lg:col-span-5 overflow-hidden">
          <ErrorBoundary><MapView /></ErrorBoundary>
        </div>
        <div className="lg:col-span-2 overflow-hidden">
          <ErrorBoundary><FireDetailPanel /></ErrorBoundary>
        </div>
        <div className="lg:col-span-3 flex flex-col gap-3 overflow-hidden">
          <div className="flex-shrink-0">
            <ErrorBoundary><WeatherPanel /></ErrorBoundary>
          </div>
          <div className="flex-1 overflow-hidden flex flex-col min-h-0">
            <ErrorBoundary><AlertsPanel /></ErrorBoundary>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 h-[calc(100vh-220px)]">
      <div className="lg:col-span-3 flex flex-col gap-3 overflow-hidden">
        <div className="flex-1 overflow-hidden min-h-0">
          <ErrorBoundary><IncidentsList /></ErrorBoundary>
        </div>
        <div className="flex-shrink-0 max-h-[240px] overflow-hidden">
          <ErrorBoundary><EvacuationPanel /></ErrorBoundary>
        </div>
      </div>
      <div className="lg:col-span-5 overflow-hidden">
        <ErrorBoundary><MapView /></ErrorBoundary>
      </div>
      <div className="lg:col-span-4 flex flex-col gap-3 overflow-hidden">
        <div className="flex-shrink-0">
          <ErrorBoundary><WeatherPanel /></ErrorBoundary>
        </div>
        <div className="grid grid-cols-2 gap-3 flex-1 overflow-hidden min-h-0">
          <ErrorBoundary><AlertsPanel /></ErrorBoundary>
          <ErrorBoundary><CommunicationsPanel /></ErrorBoundary>
        </div>
      </div>
    </div>
  );
}

function MapViewPage() {
  const { selectedFireId } = useApp();

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 h-[calc(100vh-220px)]">
      <div className={`${selectedFireId ? 'lg:col-span-9' : 'lg:col-span-12'} overflow-hidden`}>
        <ErrorBoundary><MapView /></ErrorBoundary>
      </div>
      {selectedFireId && (
        <div className="lg:col-span-3 flex flex-col gap-3 overflow-hidden">
          <ErrorBoundary><FireDetailPanel /></ErrorBoundary>
          <div className="flex-1 overflow-hidden min-h-0">
            <ErrorBoundary><ResourcesPanel /></ErrorBoundary>
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
      <div className={`${selectedFireId ? 'lg:col-span-8' : 'lg:col-span-12'} overflow-hidden`}>
        <ErrorBoundary><ResourcesPanel /></ErrorBoundary>
      </div>
      {selectedFireId && (
        <div className="lg:col-span-4 flex flex-col gap-3 overflow-hidden">
          <ErrorBoundary><FireDetailPanel /></ErrorBoundary>
          <div className="flex-1 overflow-hidden min-h-0">
            <ErrorBoundary><CommunicationsPanel /></ErrorBoundary>
          </div>
        </div>
      )}
    </div>
  );
}

function GeospatialView() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 h-[calc(100vh-220px)]">
      <div className="lg:col-span-4 overflow-hidden">
        <ErrorBoundary><MapView /></ErrorBoundary>
      </div>
      <div className="lg:col-span-3 overflow-hidden flex flex-col gap-3">
        <ErrorBoundary><TerritorySearch /></ErrorBoundary>
        <div className="flex-1 overflow-hidden min-h-0">
          <ErrorBoundary><SatellitePanel /></ErrorBoundary>
        </div>
      </div>
      <div className="lg:col-span-5 flex flex-col gap-3 overflow-hidden">
        <div className="flex-1 overflow-hidden min-h-0">
          <ErrorBoundary><GeospatialPanel /></ErrorBoundary>
        </div>
        <div className="flex-1 overflow-hidden min-h-0">
          <ErrorBoundary><VerifiedNodesPanel /></ErrorBoundary>
        </div>
      </div>
    </div>
  );
}

function AppContent() {
  const { viewMode, satellites, verifiedNodes } = useApp();

  return (
    <div className="min-h-screen bg-gray-950 text-white flex flex-col">
      <ErrorBoundary fallback={<div className="bg-gray-900 p-4 text-red-400">Error en Header</div>}>
        <Header />
      </ErrorBoundary>
      
      <main className="flex-1 p-4 space-y-4 overflow-hidden">
        <ErrorBoundary fallback={<div className="bg-gray-800 p-4 text-red-400">Error en Stats</div>}>
          <StatsPanel />
        </ErrorBoundary>

        {viewMode === 'dashboard' && <DashboardView />}
        {viewMode === 'map' && <MapViewPage />}
        {viewMode === 'resources' && <ResourcesView />}
        {viewMode === 'analytics' && <ErrorBoundary><AnalyticsView /></ErrorBoundary>}
        {viewMode === 'geospatial' && <GeospatialView />}
      </main>

      <footer className="bg-gray-900 border-t border-gray-700 px-6 py-2 flex items-center justify-between text-xs text-gray-400">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
            Sistema Online
          </span>
          <span>|</span>
          <span>🛰️ {satellites.length} Satélites</span>
          <span>|</span>
          <span>📡 {verifiedNodes.filter(n => n.status === 'online').length} Nodos Activos</span>
          <span>|</span>
          <span>Región: Las Hurdes, Cáceres</span>
        </div>
        <div className="flex items-center gap-4">
          <span>Firecycle v2.5.0</span>
          <span>|</span>
          <span>© 2026 Firecycle Systems</span>
        </div>
      </footer>

      <ErrorBoundary>
        <NotificationToast />
      </ErrorBoundary>

      <ErrorBoundary>
        <GlobalSearch />
      </ErrorBoundary>
    </div>
  );
}

export default function App() {
  return (
    <ErrorBoundary fallback={
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="bg-red-900/20 border border-red-500 rounded-lg p-8 text-center">
          <h1 className="text-red-400 text-2xl font-bold mb-4">Error Crítico</h1>
          <p className="text-red-300">La aplicación no pudo inicializarse.</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded transition-colors"
          >
            Recargar Página
          </button>
        </div>
      </div>
    }>
      <AppProvider>
        <AppContent />
      </AppProvider>
    </ErrorBoundary>
  );
}
