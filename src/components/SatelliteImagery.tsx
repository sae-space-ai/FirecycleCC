import { useState, useEffect } from 'react';
import { getLasHurdesSentinelImages } from '../services/copernicusService';

interface SentinelImage {
  id: string;
  datetime: string;
  collection: string;
}

export default function SatelliteImagery() {
  const [images, setImages] = useState<SentinelImage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdate, setLastUpdate] = useState<string>('');

  useEffect(() => {
    const fetchImages = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const result = await getLasHurdesSentinelImages(7);

        if (result.error) {
          throw new Error(result.error.info || 'Error al obtener imágenes satelitales');
        }

        if (result.data) {
          const formattedImages = result.data.map((img) => ({
            id: img.id,
            datetime: img.properties.datetime,
            collection: img.properties.collection,
          }));
          setImages(formattedImages);
          setLastUpdate(new Date().toLocaleTimeString('es-ES', { 
            hour: '2-digit', 
            minute: '2-digit' 
          }));
        } else {
          throw new Error('No se recibieron imágenes satelitales');
        }
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Error desconocido al obtener imágenes';
        setError(errorMessage);
        console.error('SatelliteImagery Error:', err);
      } finally {
        // SIEMPRE se ejecuta, tanto si hay éxito como si hay error
        setIsLoading(false);
      }
    };

    fetchImages();

    // Actualizar cada 10 minutos
    const interval = setInterval(fetchImages, 10 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  const formatDate = (datetime: string) => {
    const date = new Date(datetime);
    return date.toLocaleDateString('es-ES', { 
      day: '2-digit', 
      month: 'short', 
      year: 'numeric' 
    });
  };

  const formatTime = (datetime: string) => {
    const date = new Date(datetime);
    return date.toLocaleTimeString('es-ES', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  // Estado de carga
  if (isLoading) {
    return (
      <div className="bg-gradient-to-br from-purple-900/40 to-purple-800/20 border border-purple-500/30 rounded-xl p-4 backdrop-blur-sm">
        <div className="flex items-center gap-2 mb-3">
          <svg className="w-5 h-5 text-purple-400 animate-spin" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <span className="text-purple-300 text-sm font-medium">Cargando imágenes satelitales...</span>
        </div>
        <div className="space-y-2">
          <div className="h-4 bg-purple-700/30 rounded animate-pulse"></div>
          <div className="h-4 bg-purple-700/30 rounded animate-pulse w-3/4"></div>
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
            <h3 className="text-gray-300 font-semibold text-sm mb-1">Copernicus no disponible</h3>
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

  // Sin imágenes disponibles
  if (images.length === 0) {
    return (
      <div className="bg-gradient-to-br from-gray-900/80 to-gray-800/60 border border-gray-600/30 rounded-xl p-4 backdrop-blur-sm">
        <div className="flex items-center gap-2 mb-2">
          <svg className="w-5 h-5 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
            <path d="M21 3H3c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h18c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H3V5h18v14zM5 15h14v3H5z"/>
          </svg>
          <h3 className="text-gray-300 font-semibold text-sm">Sin Imágenes Recientes</h3>
        </div>
        <p className="text-gray-400 text-xs mb-2">
          No hay imágenes Sentinel-2 disponibles para Las Hurdes en los últimos 7 días
        </p>
        {lastUpdate && (
          <p className="text-gray-500 text-xs">
            Última actualización: {lastUpdate}
          </p>
        )}
      </div>
    );
  }

  // Imágenes disponibles
  return (
    <div className="bg-gradient-to-br from-purple-900/40 to-purple-800/20 border border-purple-500/30 rounded-xl p-4 backdrop-blur-sm">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <svg className="w-5 h-5 text-purple-400" fill="currentColor" viewBox="0 0 24 24">
            <path d="M21 3H3c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h18c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H3V5h18v14zM5 15h14v3H5z"/>
          </svg>
          <h3 className="text-purple-300 font-semibold text-sm">
            Imágenes Sentinel-2
          </h3>
        </div>
        <span className="bg-purple-500/20 text-purple-400 text-xs px-2 py-0.5 rounded-full border border-purple-500/30">
          {images.length} {images.length === 1 ? 'imagen' : 'imágenes'}
        </span>
      </div>

      <div className="space-y-2 max-h-64 overflow-y-auto">
        {images.map((image, index) => (
          <div
            key={image.id}
            className="bg-purple-950/30 border border-purple-500/20 rounded-lg p-3"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-white text-xs font-medium">
                    {formatDate(image.datetime)}
                  </span>
                  <span className="text-purple-300 text-xs">
                    {formatTime(image.datetime)}
                  </span>
                </div>
                <div className="text-xs text-purple-200/70">
                  ID: {image.id.substring(0, 20)}...
                </div>
                <div className="text-xs text-purple-200/50 mt-1">
                  Colección: {image.collection}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {lastUpdate && (
        <div className="mt-3 pt-3 border-t border-purple-500/20">
          <p className="text-purple-200/50 text-xs">
            Última actualización: {lastUpdate}
          </p>
          <p className="text-purple-200/50 text-xs mt-1">
            Datos: Copernicus Sentinel-2 L2A
          </p>
        </div>
      )}
    </div>
  );
}
