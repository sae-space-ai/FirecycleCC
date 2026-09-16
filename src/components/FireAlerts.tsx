import { useState, useEffect } from 'react';
import { getLasHurdesFires, type NASAFireAlert } from '../services/nasaService';

export default function FireAlerts() {
  const [alerts, setAlerts] = useState<NASAFireAlert[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdate, setLastUpdate] = useState<string>('');

  useEffect(() => {
    const fetchFires = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const result = await getLasHurdesFires(1);

        if (result.error) {
          throw new Error(result.error.info || 'Error al obtener datos de NASA FIRMS');
        }

        if (result.data) {
          setAlerts(result.data);
          setLastUpdate(new Date().toLocaleTimeString('es-ES', { 
            hour: '2-digit', 
            minute: '2-digit' 
          }));
        } else {
          throw new Error('No se recibieron datos de NASA FIRMS');
        }
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Error desconocido al obtener datos de incendios';
        setError(errorMessage);
        console.error('FireAlerts Error:', err);
      } finally {
        // SIEMPRE se ejecuta, tanto si hay éxito como si hay error
        setIsLoading(false);
      }
    };

    fetchFires();

    // Actualizar cada 5 minutos
    const interval = setInterval(fetchFires, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  const getConfidenceColor = (confidence: string) => {
    switch (confidence) {
      case 'high': return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'nominal': return 'bg-orange-500/20 text-orange-400 border-orange-500/30';
      case 'low': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const getConfidenceLabel = (confidence: string) => {
    switch (confidence) {
      case 'high': return 'Alta';
      case 'nominal': return 'Normal';
      case 'low': return 'Baja';
      default: return confidence;
    }
  };

  const formatTime = (acqTime: string) => {
    if (!acqTime || acqTime.length !== 4) return 'N/A';
    return `${acqTime.substring(0, 2)}:${acqTime.substring(2, 4)}`;
  };

  // Estado de carga
  if (isLoading) {
    return (
      <div className="bg-gradient-to-br from-red-900/40 to-red-800/20 border border-red-500/30 rounded-xl p-4 backdrop-blur-sm">
        <div className="flex items-center gap-2 mb-3">
          <svg className="w-5 h-5 text-red-400 animate-spin" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <span className="text-red-300 text-sm font-medium">Detectando focos de incendio...</span>
        </div>
        <div className="space-y-2">
          <div className="h-4 bg-red-700/30 rounded animate-pulse"></div>
          <div className="h-4 bg-red-700/30 rounded animate-pulse w-3/4"></div>
        </div>
      </div>
    );
  }

  // Estado de error
  if (error) {
    return (
      <div className="bg-gradient-to-br from-gray-900/80 to-gray-800/60 border border-gray-600/30 rounded-xl p-4 backdrop-blur-sm">
        <div className="flex items-start gap-3">
          <svg className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
          </svg>
          <div className="flex-1">
            <h3 className="text-gray-300 font-semibold text-sm mb-1">NASA FIRMS no disponible</h3>
            <p className="text-gray-400 text-xs mb-2">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="text-xs bg-gray-700 hover:bg-gray-600 text-gray-300 px-3 py-1 rounded transition-colors"
            >
              Reintentar
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Sin focos detectados
  if (alerts.length === 0) {
    return (
      <div className="bg-gradient-to-br from-green-900/40 to-green-800/20 border border-green-500/30 rounded-xl p-4 backdrop-blur-sm">
        <div className="flex items-center gap-2 mb-2">
          <svg className="w-5 h-5 text-green-400" fill="currentColor" viewBox="0 0 24 24">
            <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
          </svg>
          <h3 className="text-green-300 font-semibold text-sm">Zona Segura</h3>
        </div>
        <p className="text-green-200/80 text-xs mb-2">
          Sin focos activos detectados en Las Hurdes
        </p>
        {lastUpdate && (
          <p className="text-green-200/50 text-xs">
            Última actualización: {lastUpdate}
          </p>
        )}
      </div>
    );
  }

  // Focos detectados
  return (
    <div className="bg-gradient-to-br from-red-900/40 to-red-800/20 border border-red-500/30 rounded-xl p-4 backdrop-blur-sm">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <svg className="w-5 h-5 text-red-400 animate-pulse" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2C8.5 7 4 10 4 14.5C4 18.64 7.58 22 12 22C16.42 22 20 18.64 20 14.5C20 10 15.5 7 12 2Z"/>
          </svg>
          <h3 className="text-red-300 font-semibold text-sm">
            Alertas de Incendio
          </h3>
        </div>
        <span className="bg-red-500/20 text-red-400 text-xs px-2 py-0.5 rounded-full border border-red-500/30">
          {alerts.length} {alerts.length === 1 ? 'foco' : 'focos'}
        </span>
      </div>

      <div className="space-y-2 max-h-64 overflow-y-auto">
        {alerts.map((alert, index) => (
          <div
            key={index}
            className="bg-red-950/30 border border-red-500/20 rounded-lg p-3"
          >
            <div className="flex items-start justify-between mb-2">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-white text-xs font-medium">
                    {alert.satellite} - {alert.instrument}
                  </span>
                  <span className={`text-xs px-2 py-0.5 rounded-full border ${getConfidenceColor(alert.confidence)}`}>
                    {getConfidenceLabel(alert.confidence)}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <span className="text-red-200/70">Fecha:</span>
                    <span className="text-white ml-1">{alert.acq_date}</span>
                  </div>
                  <div>
                    <span className="text-red-200/70">Hora:</span>
                    <span className="text-white ml-1">{formatTime(alert.acq_time)}</span>
                  </div>
                  <div>
                    <span className="text-red-200/70">Brillo:</span>
                    <span className="text-white ml-1">{alert.brightness.toFixed(1)}K</span>
                  </div>
                  <div>
                    <span className="text-red-200/70">FRP:</span>
                    <span className="text-white ml-1">{alert.frp.toFixed(1)}MW</span>
                  </div>
                </div>
                <div className="mt-1 text-xs text-red-200/50">
                  📍 {alert.latitude.toFixed(4)}, {alert.longitude.toFixed(4)}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {lastUpdate && (
        <div className="mt-3 pt-3 border-t border-red-500/20">
          <p className="text-red-200/50 text-xs">
            Última actualización: {lastUpdate}
          </p>
          <p className="text-red-200/50 text-xs mt-1">
            Datos: NASA FIRMS (VIIRS SNPP)
          </p>
        </div>
      )}
    </div>
  );
}
