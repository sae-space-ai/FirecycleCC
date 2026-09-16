// Utilidad para determinar el entorno y construir URLs de API

export const isDevelopment = import.meta.env.DEV;
export const isProduction = import.meta.env.PROD;

/**
 * Construye la URL base para las APIs según el entorno
 * En desarrollo: usa el proxy de Vite
 * En producción: usa las funciones serverless de Vercel
 */
export const getApiBaseUrl = (service: string): string => {
  if (isDevelopment) {
    // En desarrollo, usar el proxy de Vite
    return `/api/${service}`;
  } else {
    // En producción, usar las funciones serverless de Vercel
    return `/api/${service}`;
  }
};

/**
 * URLs específicas para cada servicio
 */
export const API_URLS = {
  // APILayer services
  ipstack: (endpoint: string = 'check') => `${getApiBaseUrl('apilayer')}/ipstack/${endpoint}`,
  weatherstack: (endpoint: string = 'current') => `${getApiBaseUrl('apilayer')}/weatherstack/${endpoint}`,
  positionstack: (endpoint: string = 'forward') => `${getApiBaseUrl('apilayer')}/positionstack/${endpoint}`,
  aviationstack: (endpoint: string = 'flights') => `${getApiBaseUrl('apilayer')}/aviationstack/${endpoint}`,
  mediastack: (endpoint: string = 'news') => `${getApiBaseUrl('apilayer')}/mediastack/${endpoint}`,
  countrylayer: (endpoint: string = 'all') => `${getApiBaseUrl('apilayer')}/countrylayer/${endpoint}`,
  
  // NASA FIRMS
  nasaFirms: (path: string) => `${getApiBaseUrl('nasa-firms')}/${path}`,
  
  // Copernicus
  copernicusOAuth: () => `${getApiBaseUrl('copernicus')}/oauth/token`,
  copernicus: (path: string) => `${getApiBaseUrl('copernicus')}/${path}`,
} as const;
