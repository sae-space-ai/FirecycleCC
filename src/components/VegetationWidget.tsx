import { useState, useEffect } from 'react';
import { getLasHurdesNDVI, type NDVIResponse } from '../services/copernicusService';

export default function VegetationWidget() {
  const [ndviData, setNdviData] = useState<NDVIResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchNDVI();
  }, []);

  const fetchNDVI = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const result = await getLasHurdesNDVI();

      if (result.error) {
        throw new Error(result.error.info || 'Error al obtener datos de NDVI');
      }

      if (result.data) {
        setNdviData(result.data);
      } else {
        throw new Error('No se recibieron datos de NDVI');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido al obtener NDVI';
      setError(errorMessage);
      console.error('VegetationWidget Error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const getVegetationStatus = (ndvi: number) => {
    if (ndvi < 0.2) {
      return {
        label: 'Zona Árida/Quemada',
        color: 'text-red-400',
        bgColor: 'bg-red-500/20',
        borderColor: 'border-red-500/30',
        risk: 'Peligro Alto',
        description: 'Vegetación muy escasa o inexistente',
      };
    } else if (ndvi < 0.5) {
      return {
        label: 'Vegetación Dispersa',
        color: 'text-orange-400',
        bgColor: 'bg-orange-500/20',
        borderColor: 'border-orange-500/30',
        risk: 'Peligro Medio',
        description: 'Arbustos y vegetación dispersa',
      };
    } else {
      return {
        label: 'Vegetación Densa',
        color: 'text-green-400',
        bgColor: 'bg-green-500/20',
        borderColor: 'border-green-500/30',
        risk: 'Peligro Bajo',
        description: 'Vegetación densa y saludable',
      };
    }
  };

  if (isLoading) {
    return (
      <div className="bg-gradient-to-br from-green-900/40 to-green-800/20 border border-green-500/30 rounded-xl p-4 backdrop-blur-sm">
        <div className="flex items-center gap-2 mb-3">
          <svg className="w-5 h-5 text-green-400 animate-spin" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <span className="text-green-300 text-sm font-medium">Analizando vegetación...</span>
        </div>
        <div className="space-y-2">
          <div className="h-4 bg-green-700/30 rounded animate-pulse"></div>
          <div className="h-4 bg-green-700/30 rounded animate-pulse w-3/4"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-gradient-to-br from-gray-900/80 to-gray-800/60 border border-gray-600/30 rounded-xl p-4 backdrop-blur-sm">
        <div className="flex items-start gap-3">
          <svg className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
          </svg>
          <div className="flex-1">
            <h3 className="text-gray-300 font-semibold text-sm mb-1">Error al obtener NDVI</h3>
            <p className="text-gray-400 text-xs mb-2">{error}</p>
            <button
              onClick={fetchNDVI}
              className="text-xs bg-gray-700 hover:bg-gray-600 text-gray-300 px-3 py-1 rounded transition-colors"
            >
              Reintentar
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!ndviData) {
    return null;
  }

  const status = getVegetationStatus(ndviData.mean);
  const percentage = Math.max(0, Math.min(100, ndviData.mean * 100));

  return (
    <div className="bg-gradient-to-br from-green-900/40 to-green-800/20 border border-green-500/30 rounded-xl p-4 backdrop-blur-sm">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <svg className="w-5 h-5 text-green-400" fill="currentColor" viewBox="0 0 24 24">
            <path d="M17 8C8 10 5.9 16.17 3.82 21.34l1.89.66.95-2.3c.48.17.98.3 1.34.3C19 20 22 3 22 3c-1 2-8 2.25-13 3.25S2 11.5 2 13.5s1.75 3.75 1.75 3.75C7 8 17 8 17 8z"/>
          </svg>
          <h3 className="text-green-300 font-semibold text-sm">Índice de Vegetación (NDVI)</h3>
        </div>
        <button
          onClick={fetchNDVI}
          className="text-green-400 hover:text-green-300 transition-colors"
          title="Actualizar datos"
        >
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
            <path d="M17.65 6.35C16.2 4.9 14.21 4 12 4c-4.42 0-7.99 3.58-7.99 8s3.57 8 7.99 8c3.73 0 6.84-2.55 7.73-6h-2.08c-.82 2.33-3.04 4-5.65 4-3.31 0-6-2.69-6-6s2.69-6 6-6c1.66 0 3.14.69 4.22 1.78L13 11h7V4l-2.35 2.35z"/>
          </svg>
        </button>
      </div>

      <div className="mb-4">
        <div className="flex items-baseline justify-between mb-2">
          <span className="text-3xl font-bold text-white">{ndviData.mean.toFixed(2)}</span>
          <span className={`text-xs px-2 py-1 rounded-full border ${status.bgColor} ${status.color} ${status.borderColor}`}>
            {status.risk}
          </span>
        </div>
        
        <div className="relative w-full h-3 bg-gray-700 rounded-full overflow-hidden">
          <div 
            className={`absolute top-0 left-0 h-full transition-all duration-500 ${
              ndviData.mean < 0.2 ? 'bg-red-500' :
              ndviData.mean < 0.5 ? 'bg-orange-500' :
              'bg-green-500'
            }`}
            style={{ width: `${percentage}%` }}
          />
        </div>
        
        <div className="flex justify-between text-xs text-gray-400 mt-1">
          <span>0.0</span>
          <span>0.5</span>
          <span>1.0</span>
        </div>
      </div>

      <div className="space-y-2 text-xs">
        <div className="flex items-start gap-2">
          <span className="text-green-200/70 font-medium min-w-[100px]">Estado:</span>
          <span className={`font-medium ${status.color}`}>{status.label}</span>
        </div>
        <div className="flex items-start gap-2">
          <span className="text-green-200/70 font-medium min-w-[100px]">Descripción:</span>
          <span className="text-gray-300">{status.description}</span>
        </div>
        <div className="flex items-start gap-2">
          <span className="text-green-200/70 font-medium min-w-[100px]">Rango:</span>
          <span className="text-gray-300">{ndviData.min.toFixed(2)} - {ndviData.max.toFixed(2)}</span>
        </div>
        <div className="flex items-start gap-2">
          <span className="text-green-200/70 font-medium min-w-[100px]">Cobertura:</span>
          <span className="text-gray-300">{ndviData.coverage.toFixed(1)}%</span>
        </div>
      </div>

      <div className="mt-3 pt-3 border-t border-green-500/20">
        <p className="text-green-200/50 text-xs">
          Datos: Sentinel-2 L2A (Copernicus)
        </p>
        {ndviData.timestamp && (
          <p className="text-green-200/50 text-xs mt-1">
            Actualizado: {new Date(ndviData.timestamp).toLocaleDateString('es-ES')}
          </p>
        )}
      </div>
    </div>
  );
}
