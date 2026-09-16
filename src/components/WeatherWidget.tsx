import { useState, useEffect } from 'react';
import { getCurrentWeather } from '../services/apiLayerService';

interface WeatherData {
  location: {
    name: string;
    country: string;
    lat: number;
    lon: number;
    localtime: string;
  };
  current: {
    temperature: number;
    weather_descriptions: string[];
    weather_icons: string[];
    humidity: number;
    wind_speed: number;
    wind_dir: string;
    pressure: number;
    uv_index: number;
    visibility: number;
    feelslike: number;
  };
}

export default function WeatherWidget() {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [location] = useState('Las Hurdes, Spain');

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const result = await getCurrentWeather(location);

        if (result.error) {
          throw new Error(result.error.info || 'Error al obtener datos meteorológicos');
        }

        if (result.data) {
          setWeather(result.data);
        } else {
          throw new Error('No se recibieron datos meteorológicos');
        }
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Error desconocido al obtener clima';
        setError(errorMessage);
        console.error('WeatherWidget Error:', err);
      } finally {
        // SIEMPRE se ejecuta, tanto si hay éxito como si hay error
        setIsLoading(false);
      }
    };

    fetchWeather();
  }, [location]);

  // Estado de carga
  if (isLoading) {
    return (
      <div className="bg-gradient-to-br from-cyan-900/40 to-cyan-800/20 border border-cyan-500/30 rounded-xl p-4">
        <div className="flex items-center gap-2 mb-3">
          <svg className="w-5 h-5 text-cyan-400 animate-spin" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <span className="text-cyan-300 text-sm font-medium">Cargando clima...</span>
        </div>
        <div className="space-y-2">
          <div className="h-4 bg-cyan-700/30 rounded animate-pulse"></div>
          <div className="h-4 bg-cyan-700/30 rounded animate-pulse w-3/4"></div>
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
            <h3 className="text-red-300 font-semibold text-sm mb-1">Error de Clima</h3>
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
  if (!weather) {
    return null;
  }

  return (
    <div className="bg-gradient-to-br from-cyan-900/40 to-cyan-800/20 border border-cyan-500/30 rounded-xl p-4">
      <div className="flex items-center gap-2 mb-3">
        <svg className="w-5 h-5 text-cyan-400" fill="currentColor" viewBox="0 0 24 24">
          <path d="M6.76 4.84l-1.8-1.79-1.41 1.41 1.79 1.79 1.42-1.41zM4 10.5H1v2h3v-2zm9-9.95h-2V3.5h2V.55zm7.45 3.91l-1.41-1.41-1.79 1.79 1.41 1.41 1.79-1.79zm-3.21 13.7l1.79 1.8 1.41-1.41-1.8-1.79-1.4 1.4zM20 10.5v2h3v-2h-3zm-8-5c-3.31 0-6 2.69-6 6s2.69 6 6 6 6-2.69 6-6-2.69-6-6-6z"/>
        </svg>
        <h3 className="text-cyan-300 font-semibold text-sm">Clima Actual</h3>
      </div>

      <div className="mb-3">
        <div className="flex items-center justify-between mb-2">
          <span className="text-cyan-200/70 text-xs">Ubicación:</span>
          <span className="text-white text-sm font-medium">{weather.location.name}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-cyan-200/70 text-xs">Hora local:</span>
          <span className="text-white text-xs">{weather.location.localtime}</span>
        </div>
      </div>

      <div className="bg-cyan-950/30 rounded-lg p-3 mb-3">
        <div className="flex items-center gap-3 mb-2">
          {weather.current.weather_icons[0] && (
            <img src={weather.current.weather_icons[0]} alt="Weather icon" className="w-12 h-12" />
          )}
          <div>
            <div className="text-3xl font-bold text-white">
              {weather.current.temperature}°C
            </div>
            <div className="text-cyan-200/70 text-xs">
              {weather.current.weather_descriptions[0]}
            </div>
          </div>
        </div>
        <div className="text-cyan-200/50 text-xs">
          Sensación térmica: {weather.current.feelslike}°C
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2 text-xs">
        <div className="bg-cyan-950/20 rounded p-2">
          <div className="text-cyan-200/70 mb-1">Humedad</div>
          <div className="text-white font-medium">{weather.current.humidity}%</div>
        </div>
        <div className="bg-cyan-950/20 rounded p-2">
          <div className="text-cyan-200/70 mb-1">Viento</div>
          <div className="text-white font-medium">{weather.current.wind_speed} km/h {weather.current.wind_dir}</div>
        </div>
        <div className="bg-cyan-950/20 rounded p-2">
          <div className="text-cyan-200/70 mb-1">Presión</div>
          <div className="text-white font-medium">{weather.current.pressure} mb</div>
        </div>
        <div className="bg-cyan-950/20 rounded p-2">
          <div className="text-cyan-200/70 mb-1">Índice UV</div>
          <div className="text-white font-medium">{weather.current.uv_index}</div>
        </div>
      </div>

      <div className="mt-3 pt-3 border-t border-cyan-500/20">
        <p className="text-cyan-200/50 text-xs">
          Datos proporcionados por WeatherStack API
        </p>
      </div>
    </div>
  );
}
