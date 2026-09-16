import { AppProvider, useApp } from './context';
import { ErrorBoundary } from './components/ErrorBoundary';
import LocationWidget from './components/LocationWidget';
import WeatherWidget from './components/WeatherWidget';
import FireAlerts from './components/FireAlerts';

function Dashboard() {
  const { fires, allResources, satellites, verifiedNodes, selectFire } = useApp();

  return (
    <div className="min-h-screen bg-gray-950 text-white p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="bg-gray-900 border border-gray-700 rounded-xl p-6">
          <h1 className="text-3xl font-bold text-orange-400 mb-2">
            🔥 Firecycle Command Center
          </h1>
          <p className="text-gray-400">Las Hurdes, Cáceres, Extremadura</p>
        </div>

        {/* API Widgets */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <ErrorBoundary fallback={<div className="bg-red-900/20 border border-red-500 rounded-lg p-4 text-red-400 text-sm">Error en widget de ubicación</div>}>
            <LocationWidget />
          </ErrorBoundary>
          <ErrorBoundary fallback={<div className="bg-red-900/20 border border-red-500 rounded-lg p-4 text-red-400 text-sm">Error en widget de clima</div>}>
            <WeatherWidget />
          </ErrorBoundary>
        </div>

        {/* NASA FIRMS - Fire Alerts */}
        <ErrorBoundary fallback={<div className="bg-red-900/20 border border-red-500 rounded-lg p-4 text-red-400 text-sm">Error en widget de alertas de incendio</div>}>
          <FireAlerts />
        </ErrorBoundary>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-red-900/20 border border-red-500/50 rounded-xl p-4">
            <div className="text-red-400 text-sm mb-1">Incendios Activos</div>
            <div className="text-3xl font-bold text-white">{fires.length}</div>
          </div>
          <div className="bg-blue-900/20 border border-blue-500/50 rounded-xl p-4">
            <div className="text-blue-400 text-sm mb-1">Recursos</div>
            <div className="text-3xl font-bold text-white">{allResources.length}</div>
          </div>
          <div className="bg-purple-900/20 border border-purple-500/50 rounded-xl p-4">
            <div className="text-purple-400 text-sm mb-1">Satélites</div>
            <div className="text-3xl font-bold text-white">{satellites.length}</div>
          </div>
          <div className="bg-green-900/20 border border-green-500/50 rounded-xl p-4">
            <div className="text-green-400 text-sm mb-1">Nodos Activos</div>
            <div className="text-3xl font-bold text-white">
              {verifiedNodes.filter(n => n.status === 'online').length}
            </div>
          </div>
        </div>

        {/* Fires List */}
        <div className="bg-gray-900 border border-gray-700 rounded-xl p-6">
          <h2 className="text-xl font-bold text-white mb-4">Incendios Activos</h2>
          <div className="space-y-3">
            {fires.map((fire) => (
              <div
                key={fire.id}
                onClick={() => selectFire(fire.id)}
                className="bg-gray-800/50 hover:bg-gray-800 border border-gray-700 rounded-lg p-4 cursor-pointer transition-colors"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-white font-semibold">{fire.name}</h3>
                    <p className="text-gray-400 text-sm">{fire.location}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    fire.severity === 'critical' ? 'bg-red-500/20 text-red-400' :
                    fire.severity === 'high' ? 'bg-orange-500/20 text-orange-400' :
                    fire.severity === 'medium' ? 'bg-yellow-500/20 text-yellow-400' :
                    'bg-green-500/20 text-green-400'
                  }`}>
                    {fire.severity.toUpperCase()}
                  </span>
                </div>
                <div className="mt-3 grid grid-cols-3 gap-4 text-sm">
                  <div>
                    <span className="text-gray-400">Hectáreas:</span>
                    <span className="text-white ml-2 font-medium">{fire.acres}</span>
                  </div>
                  <div>
                    <span className="text-gray-400">Controlado:</span>
                    <span className="text-white ml-2 font-medium">{fire.containment}%</span>
                  </div>
                  <div>
                    <span className="text-gray-400">Causa:</span>
                    <span className="text-white ml-2 font-medium">{fire.cause}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Info Box */}
        <div className="bg-blue-900/20 border border-blue-500/50 rounded-xl p-6">
          <h3 className="text-blue-400 font-bold mb-2">ℹ️ APIs Integradas</h3>
          <ul className="text-gray-300 text-sm space-y-1">
            <li>✅ <strong>IPStack</strong> - Geolocalización por IP (activo)</li>
            <li>✅ <strong>WeatherStack</strong> - Datos meteorológicos (activo)</li>
            <li>✅ <strong>NASA FIRMS</strong> - Detección de focos de incendio en tiempo real (activo)</li>
            <li>⏳ <strong>PositionStack</strong> - Geocoding (preparado para integrar)</li>
            <li>⏳ <strong>AviationStack</strong> - Datos de aviación (preparado para integrar)</li>
            <li>⏳ <strong>MediaStack</strong> - Noticias (preparado para integrar)</li>
            <li>⏳ <strong>CountryLayer</strong> - Información de países (preparado para integrar)</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

function AppContent() {
  return (
    <ErrorBoundary fallback={
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="bg-red-900/20 border border-red-500 rounded-lg p-8 text-center max-w-md">
          <h1 className="text-red-400 text-2xl font-bold mb-4">❌ Error Crítico</h1>
          <p className="text-red-300 mb-4">La aplicación no pudo inicializarse.</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded transition-colors"
          >
            Recargar Página
          </button>
        </div>
      </div>
    }>
      <AppProvider>
        <Dashboard />
      </AppProvider>
    </ErrorBoundary>
  );
}

export default function App() {
  return <AppContent />;
}
