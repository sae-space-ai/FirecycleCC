import { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { useApp } from '../context';

// Estilos CSS de Mapbox
// Nota: Los estilos se importan arriba

interface MapboxMapProps {
  className?: string;
}

export default function MapboxMap({ className = '' }: MapboxMapProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [mapError, setMapError] = useState<string | null>(null);
  const [is3DEnabled, setIs3DEnabled] = useState(true);
  
  const { 
    fires, 
    selectedFireId, 
    selectFire, 
    verifiedNodes,
    mapCenter,
    setMapCenter,
  } = useApp();

  useEffect(() => {
    if (!mapContainer.current) return;

    const accessToken = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN;
    
    if (!accessToken || accessToken === 'tu_mapbox_access_token_aqui') {
      setMapError('Token de Mapbox no configurado. Añade VITE_MAPBOX_ACCESS_TOKEN en .env');
      return;
    }

    // Configurar token de Mapbox
    mapboxgl.accessToken = accessToken;

    try {
      // Inicializar mapa 3D
      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: 'mapbox://styles/mapbox/satellite-streets-v12',
        center: [-6.30, 40.35], // Las Hurdes [lng, lat]
        zoom: 11,
        pitch: 60, // Inclinación para ver el terreno 3D
        bearing: -17.6, // Rotación
        antialias: true,
      });

      // Añadir controles de navegación
      map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');
      
      // Control de pantalla completa
      map.current.addControl(new mapboxgl.FullscreenControl(), 'top-right');

      // Escala
      map.current.addControl(new mapboxgl.ScaleControl(), 'bottom-left');

      // Cuando el mapa está listo
      map.current.on('load', () => {
        if (!map.current) return;

        // Añadir fuente de terreno 3D
        map.current.addSource('mapbox-dem', {
          type: 'raster-dem',
          url: 'mapbox://mapbox.mapbox-terrain-dem-v1',
          tileSize: 512,
          maxzoom: 14,
        });

        // Añadir terreno al mapa
        map.current.setTerrain({ 
          source: 'mapbox-dem', 
          exaggeration: 1.5 // Exageración del relieve
        });

        // Añadir capa de hillshade (sombreado de colinas)
        map.current.addLayer({
          id: 'hillshade-layer',
          type: 'hillshade',
          source: 'mapbox-dem',
          paint: {
            'hillshade-exaggeration': 0.5,
            'hillshade-shadow-color': '#000000',
            'hillshade-highlight-color': '#ffffff',
            'hillshade-accent-color': '#888888',
          },
        });

        // Añadir capa de cielo
        map.current.setFog({
          color: 'rgb(186, 210, 235)',
          'high-color': 'rgb(36, 92, 223)',
          'horizon-blend': 0.02,
          'space-color': 'rgb(11, 11, 25)',
          'star-intensity': 0.6,
        });

        // Añadir marcadores de incendios
        addFireMarkers();
        
        // Añadir marcadores de nodos veraces
        addNodeMarkers();
      });

      // Manejar errores del mapa
      map.current.on('error', (e) => {
        console.error('Mapbox error:', e);
        setMapError(`Error al cargar el mapa: ${e.error?.message || 'Error desconocido'}`);
      });

      // Manejar click en el mapa
      map.current.on('click', (e) => {
        const { lng, lat } = e.lngLat;
        console.log('Map clicked:', lat, lng);
      });

    } catch (error) {
      console.error('Error initializing Mapbox:', error);
      setMapError('Error al inicializar el mapa 3D. Mostrando mapa 2D de respaldo.');
    }

    // Cleanup
    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, []);

  // Función para añadir marcadores de incendios
  const addFireMarkers = () => {
    if (!map.current) return;

    fires.forEach((fire) => {
      // Crear elemento HTML para el marcador
      const el = document.createElement('div');
      el.className = 'fire-marker';
      el.style.width = '20px';
      el.style.height = '20px';
      el.style.borderRadius = '50%';
      el.style.backgroundColor = fire.severity === 'critical' ? '#ef4444' :
                                  fire.severity === 'high' ? '#f97316' :
                                  fire.severity === 'medium' ? '#eab308' : '#22c55e';
      el.style.border = '3px solid white';
      el.style.cursor = 'pointer';
      el.style.boxShadow = '0 0 10px rgba(0,0,0,0.5)';
      
      if (fire.severity === 'critical') {
        el.style.animation = 'pulse 2s infinite';
      }

      // Añadir popup con información
      const popup = new mapboxgl.Popup({ offset: 25 }).setHTML(`
        <div style="padding: 8px; min-width: 200px;">
          <h3 style="margin: 0 0 8px 0; font-size: 14px; font-weight: bold;">${fire.name}</h3>
          <p style="margin: 0 0 4px 0; font-size: 12px;"><strong>Ubicación:</strong> ${fire.location}</p>
          <p style="margin: 0 0 4px 0; font-size: 12px;"><strong>Hectáreas:</strong> ${fire.acres}</p>
          <p style="margin: 0 0 4px 0; font-size: 12px;"><strong>Controlado:</strong> ${fire.containment}%</p>
          <p style="margin: 0; font-size: 12px;"><strong>Severidad:</strong> <span style="color: ${
            fire.severity === 'critical' ? '#ef4444' :
            fire.severity === 'high' ? '#f97316' :
            fire.severity === 'medium' ? '#eab308' : '#22c55e'
          };">${fire.severity.toUpperCase()}</span></p>
        </div>
      `);

      // Crear marcador
      const marker = new mapboxgl.Marker(el)
        .setLngLat([fire.lng, fire.lat])
        .setPopup(popup)
        .addTo(map.current!);

      // Click en el marcador
      el.addEventListener('click', () => {
        selectFire(fire.id);
      });
    });
  };

  // Función para añadir marcadores de nodos veraces
  const addNodeMarkers = () => {
    if (!map.current) return;

    verifiedNodes.forEach((node) => {
      if (node.status === 'offline') return; // No mostrar nodos offline

      // Crear elemento HTML para el marcador
      const el = document.createElement('div');
      el.className = 'node-marker';
      el.style.width = '12px';
      el.style.height = '12px';
      el.style.borderRadius = '50%';
      el.style.backgroundColor = node.status === 'online' ? '#22c55e' :
                                  node.status === 'warning' ? '#eab308' : '#ef4444';
      el.style.border = '2px solid white';
      el.style.cursor = 'pointer';
      el.style.boxShadow = '0 0 5px rgba(0,0,0,0.5)';
      
      if (node.status === 'online') {
        el.style.animation = 'pulse 3s infinite';
      }

      // Añadir popup con información
      const popup = new mapboxgl.Popup({ offset: 25 }).setHTML(`
        <div style="padding: 8px; min-width: 180px;">
          <h3 style="margin: 0 0 8px 0; font-size: 14px; font-weight: bold;">${node.name}</h3>
          <p style="margin: 0 0 4px 0; font-size: 12px;"><strong>Tipo:</strong> ${node.type}</p>
          <p style="margin: 0 0 4px 0; font-size: 12px;"><strong>Estado:</strong> <span style="color: ${
            node.status === 'online' ? '#22c55e' :
            node.status === 'warning' ? '#eab308' : '#ef4444'
          };">${node.status.toUpperCase()}</span></p>
          <p style="margin: 0; font-size: 12px;"><strong>Coordenadas:</strong> ${node.lat.toFixed(4)}, ${node.lng.toFixed(4)}</p>
        </div>
      `);

      // Crear marcador
      new mapboxgl.Marker(el)
        .setLngLat([node.lng, node.lat])
        .setPopup(popup)
        .addTo(map.current!);
    });
  };

  // Actualizar vista cuando cambia mapCenter
  useEffect(() => {
    if (map.current && mapCenter) {
      map.current.flyTo({
        center: [mapCenter.lng, mapCenter.lat],
        zoom: 13,
        duration: 2000,
      });
    }
  }, [mapCenter]);

  // Función para alternar entre 3D y 2D
  const toggle3D = () => {
    if (!map.current) return;

    if (is3DEnabled) {
      map.current.setTerrain(null);
      map.current.setPitch(0);
      setIs3DEnabled(false);
    } else {
      map.current.setTerrain({ 
        source: 'mapbox-dem', 
        exaggeration: 1.5 
      });
      map.current.setPitch(60);
      setIs3DEnabled(true);
    }
  };

  // Si hay error, mostrar mapa 2D de respaldo
  if (mapError) {
    return (
      <div className={`relative ${className}`}>
        <div className="absolute inset-0 bg-gray-900 flex items-center justify-center z-10">
          <div className="text-center p-6">
            <svg className="w-16 h-16 text-gray-600 mx-auto mb-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
            </svg>
            <h3 className="text-gray-300 font-semibold mb-2">Mapa 3D no disponible</h3>
            <p className="text-gray-400 text-sm mb-4">{mapError}</p>
            <p className="text-gray-500 text-xs">
              Configura VITE_MAPBOX_ACCESS_TOKEN en .env para habilitar el mapa 3D
            </p>
          </div>
        </div>
        <div ref={mapContainer} className="w-full h-full" />
      </div>
    );
  }

  return (
    <div className={`relative ${className}`}>
      <div ref={mapContainer} className="w-full h-full" />
      
      {/* Botón para alternar 3D/2D */}
      <button
        onClick={toggle3D}
        className="absolute top-4 left-4 bg-gray-900/90 hover:bg-gray-800 text-white px-3 py-2 rounded-lg shadow-lg transition-colors z-10 flex items-center gap-2"
      >
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
          {is3DEnabled ? (
            <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
          ) : (
            <path d="M20.5 3l-.16.03L15 5.1 9 3 3.36 4.9c-.21.07-.36.25-.36.48V20.5c0 .28.22.5.5.5l.16-.03L9 18.9l6 2.1 5.64-1.9c.21-.07.36-.25.36-.48V3.5c0-.28-.22-.5-.5-.5zM15 19l-6-2.11V5l6 2.11V19z"/>
          )}
        </svg>
        <span className="text-sm">{is3DEnabled ? '3D' : '2D'}</span>
      </button>

      {/* Leyenda */}
      <div className="absolute bottom-4 right-4 bg-gray-900/90 backdrop-blur-sm rounded-lg p-3 shadow-lg z-10">
        <h4 className="text-white text-xs font-semibold mb-2">Leyenda</h4>
        <div className="space-y-1.5 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-red-500 border-2 border-white"></div>
            <span className="text-gray-300">Incendio Crítico</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-orange-500 border-2 border-white"></div>
            <span className="text-gray-300">Incendio Alto</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-yellow-500 border-2 border-white"></div>
            <span className="text-gray-300">Incendio Medio</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-green-500 border-2 border-white"></div>
            <span className="text-gray-300">Nodo Activo</span>
          </div>
        </div>
      </div>

      {/* CSS para animaciones */}
      <style>{`
        @keyframes pulse {
          0%, 100% {
            transform: scale(1);
            opacity: 1;
          }
          50% {
            transform: scale(1.2);
            opacity: 0.8;
          }
        }
        
        .mapboxgl-popup-content {
          background: rgba(17, 24, 39, 0.95);
          color: white;
          border-radius: 8px;
          padding: 0;
        }
        
        .mapboxgl-popup-tip {
          border-top-color: rgba(17, 24, 39, 0.95);
        }
      `}</style>
    </div>
  );
}
