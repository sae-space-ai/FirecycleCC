import { useState, useEffect } from 'react';
import { getIpLocation } from '../services/apiLayerService';

interface LocationData {
  ip: string;
  country_name: string;
  region_name: string;
  city: string;
  latitude: number;
  longitude: number;
  location?: {
    country_flag?: string;
  };
}

export default function LocationWidget() {
  const [location, setLocation] = useState<LocationData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLocation = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const result = await getIpLocation('check');

        if (result.error) {
          throw new Error(result.error.info || 'Error al obtener ubicación');
        }

        if (result.data) {
          setLocation(result.data);
        } else {
          throw new Error('No se recibieron datos de ubicación');
        }
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Error desconocido al obtener ubicación';
        setError(errorMessage);
        console.error('LocationWidget Error:', err);
      } finally {
        // SIEMPRE se ejecuta, tanto si hay éxito como si hay error
        setIsLoading(false);
      }
    };

    fetchLocation();
  }, []);

  // Estado de carga
  if (isLoading) {
    return (
      <div className="bg-gradient-to-br from-blue-900/40 to-blue-800/20 border border-blue-500/30 rounded-xl p-4">
        <div className="flex items-center gap-2 mb-3">
          <svg className="w-5 h-5 text-blue-400 animate-spin" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <span className="text-blue-300 text-sm font-medium">Obteniendo ubicación...</span>
        </div>
        <div className="space-y-2">
          <div className="h-4 bg-blue-700/30 rounded animate-pulse"></div>
          <div className="h-4 bg-blue-700/30 rounded animate-pulse w-3/4"></div>
        </div>
      </div>
    );
  }

  // Estado de error
  if (error) {
    return (
      <div className="bg-gradient-to-br from-red-900/40 to-red-800/20 border border-red-500/30 rounded-xl p-4">
        <div className="flex items-start gap-3">
          <svg className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
          </svg>
          <div className="flex-1">
            <h3 className="text-red-300 font-semibold text-sm mb-1">Error de Ubicación</h3>
            <p className="text-red-200/80 text-xs">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-2 text-xs bg-red-500/20 hover:bg-red-500/30 text-red-300 px-3 py-1 rounded transition-colors"
            >
              Reintentar
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Estado de éxito
  if (!location) {
    return null;
  }

  return (
    <div className="bg-gradient-to-br from-blue-900/40 to-blue-800/20 border border-blue-500/30 rounded-xl p-4">
      <div className="flex items-center gap-2 mb-3">
        <svg className="w-5 h-5 text-blue-400" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
        </svg>
        <h3 className="text-blue-300 font-semibold text-sm">Ubicación Actual</h3>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-blue-200/70 text-xs">Ciudad:</span>
          <span className="text-white text-sm font-medium">{location.city || 'N/A'}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-blue-200/70 text-xs">Región:</span>
          <span className="text-white text-sm font-medium">{location.region_name || 'N/A'}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-blue-200/70 text-xs">País:</span>
          <span className="text-white text-sm font-medium">{location.country_name || 'N/A'}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-blue-200/70 text-xs">Coordenadas:</span>
          <span className="text-white text-xs font-mono">
            {location.latitude?.toFixed(4)}, {location.longitude?.toFixed(4)}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-blue-200/70 text-xs">IP:</span>
          <span className="text-white text-xs font-mono">{location.ip}</span>
        </div>
      </div>

      <div className="mt-3 pt-3 border-t border-blue-500/20">
        <p className="text-blue-200/50 text-xs">
          Datos proporcionados por IPStack API
        </p>
      </div>
    </div>
  );
}
