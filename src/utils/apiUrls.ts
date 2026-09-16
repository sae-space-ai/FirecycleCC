// Utilidad para determinar el entorno y construir URLs de API

export const isDevelopment = import.meta.env.DEV;
export const isProduction = import.meta.env.PROD;

/**
 * Envuelve una URL externa con el proxy de Vercel en producción
 * En desarrollo usa el proxy de Vite directamente
 */
export const proxyUrl = (targetUrl: string): string => {
  if (isProduction) {
    // En producción, usar el proxy universal de Vercel
    return `/api/proxy?target=${encodeURIComponent(targetUrl)}`;
  }
  // En desarrollo, devolver la URL original (Vite proxy la manejará)
  return targetUrl;
};

/**
 * Construye la URL base para las APIs según el entorno
 * En desarrollo: usa el proxy de Vite (/api/...)
 * En producción: usa el proxy universal (/api/proxy?target=...)
 */
export const getApiBaseUrl = (service: string): string => {
  if (isDevelopment) {
    // En desarrollo, usar el proxy de Vite
    return `/api/${service}`;
  } else {
    // En producción, usar el proxy universal
    return `/api/proxy`;
  }
};

/**
 * URLs específicas para cada servicio
 * En desarrollo: /api/ipstack/check
 * En producción: /api/proxy?target=https://api.ipstack.com/check
 */
export const API_URLS = {
  // APILayer services
  ipstack: (endpoint: string = 'check') => 
    isDevelopment 
      ? `/api/ipstack/${endpoint}`
      : `https://api.ipstack.com/${endpoint}`,
  
  weatherstack: (endpoint: string = 'current') => 
    isDevelopment 
      ? `/api/weatherstack/${endpoint}`
      : `https://api.weatherstack.com/${endpoint}`,
  
  positionstack: (endpoint: string = 'forward') => 
    isDevelopment 
      ? `/api/positionstack/${endpoint}`
      : `https://api.positionstack.com/${endpoint}`,
  
  aviationstack: (endpoint: string = 'flights') => 
    isDevelopment 
      ? `/api/aviationstack/${endpoint}`
      : `https://api.aviationstack.com/${endpoint}`,
  
  mediastack: (endpoint: string = 'news') => 
    isDevelopment 
      ? `/api/mediastack/${endpoint}`
      : `https://api.mediastack.com/${endpoint}`,
  
  countrylayer: (endpoint: string = 'all') => 
    isDevelopment 
      ? `/api/countrylayer/${endpoint}`
      : `https://api.countrylayer.com/${endpoint}`,
  
  // NASA FIRMS
  nasaFirms: (path: string) => 
    isDevelopment 
      ? `/api/nasa-firms/${path}`
      : `https://firms.modaps.eosdis.nasa.gov/api/${path}`,
  
  // Copernicus
  copernicusOAuth: () => 
    isDevelopment 
      ? `/api/copernicus/oauth/token`
      : `https://identity.dataspace.copernicus.eu/auth/realms/CDSE/protocol/openid-connect/token`,
  
  copernicus: (path: string) => 
    isDevelopment 
      ? `/api/copernicus/${path}`
      : `https://sh.dataspace.copernicus.eu/api/v1/${path}`,
} as const;
