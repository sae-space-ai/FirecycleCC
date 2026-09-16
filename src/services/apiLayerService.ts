// apiLayerService.ts - Servicio centralizado para APIs de APILayer
// Con manejo robusto de errores, timeouts y retries

import { API_URLS, proxyUrl, isProduction } from '../utils/apiUrls';

interface ApiLayerError {
  code: number;
  type: string;
  info: string;
}

interface ApiLayerResponse<T> {
  success?: boolean;
  error?: ApiLayerError;
  data?: T;
}

// Timeout por defecto: 10 segundos
const DEFAULT_TIMEOUT = 10000;

// Función helper para fetch con timeout
async function fetchWithTimeout(
  url: string,
  timeout: number = DEFAULT_TIMEOUT
): Promise<Response> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch(url, { signal: controller.signal });
    clearTimeout(timeoutId);
    return response;
  } catch (error) {
    clearTimeout(timeoutId);
    throw error;
  }
}

// Función helper para manejar errores de API
function handleApiError(error: unknown): ApiLayerError {
  if (error instanceof Error) {
    if (error.name === 'AbortError') {
      return {
        code: 408,
        type: 'TIMEOUT_ERROR',
        info: 'La petición tardó demasiado en responder'
      };
    }
    return {
      code: 500,
      type: 'NETWORK_ERROR',
      info: error.message || 'Error de red desconocido'
    };
  }
  return {
    code: 500,
    type: 'UNKNOWN_ERROR',
    info: 'Error desconocido'
  };
}

// ============================================
// IPStack - Geolocalización por IP
// ============================================
export async function getIpLocation(ip: string = 'check'): Promise<ApiLayerResponse<any>> {
  const apiKey = import.meta.env.VITE_IPSTACK_API_KEY;
  
  console.log('[IPStack] Iniciando petición...', { ip, hasApiKey: !!apiKey, isProduction });
  
  if (!apiKey) {
    console.error('[IPStack] ❌ API key no configurada. Verifica VITE_IPSTACK_API_KEY en .env');
    return {
      error: {
        code: 401,
        type: 'MISSING_API_KEY',
        info: 'API key de IPStack no configurada. Verifica VITE_IPSTACK_API_KEY en las variables de entorno de Vercel.'
      }
    };
  }

  try {
    const baseUrl = API_URLS.ipstack(ip);
    const fullUrl = `${baseUrl}?access_key=${apiKey}`;
    const url = isProduction ? proxyUrl(fullUrl) : fullUrl;
    
    console.log('[IPStack] 🌐 URL de petición:', url);
    const response = await fetchWithTimeout(url);
    console.log('[IPStack] ✅ Respuesta recibida:', response.status);
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    
    const data = await response.json();
    console.log('[IPStack] 📦 Datos recibidos:', data);
    
    if (data.error) {
      console.error('[IPStack] ❌ Error en respuesta:', data.error);
      return { error: data.error };
    }
    
    return { success: true, data };
  } catch (error) {
    console.error('[IPStack] ❌ Error en petición:', error);
    return { error: handleApiError(error) };
  }
}

// ============================================
// PositionStack - Geocoding
// ============================================
export async function geocodeAddress(address: string): Promise<ApiLayerResponse<any>> {
  const apiKey = import.meta.env.VITE_POSITIONSTACK_API_KEY;
  
  console.log('[PositionStack] Iniciando petición...', { address, hasApiKey: !!apiKey });
  
  if (!apiKey) {
    console.error('[PositionStack] ❌ API key no configurada. Verifica VITE_POSITIONSTACK_API_KEY');
    return {
      error: {
        code: 401,
        type: 'MISSING_API_KEY',
        info: 'API key de PositionStack no configurada'
      }
    };
  }

  try {
    const baseUrl = API_URLS.positionstack('forward');
    const fullUrl = `${baseUrl}?access_key=${apiKey}&query=${encodeURIComponent(address)}`;
    const url = isProduction ? proxyUrl(fullUrl) : fullUrl;
    
    console.log('[PositionStack] 🌐 URL:', url);
    const response = await fetchWithTimeout(url);
    console.log('[PositionStack] ✅ Respuesta:', response.status);
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    
    const data = await response.json();
    
    if (data.error) {
      console.error('[PositionStack] ❌ Error:', data.error);
      return { error: data.error };
    }
    
    return { success: true, data };
  } catch (error) {
    console.error('[PositionStack] ❌ Error:', error);
    return { error: handleApiError(error) };
  }
}

// ============================================
// WeatherStack - Datos meteorológicos
// ============================================
export async function getCurrentWeather(location: string): Promise<ApiLayerResponse<any>> {
  const apiKey = import.meta.env.VITE_WEATHERSTACK_API_KEY;
  
  console.log('[WeatherStack] Iniciando petición...', { location, hasApiKey: !!apiKey });
  
  if (!apiKey) {
    console.error('[WeatherStack] ❌ API key no configurada. Verifica VITE_WEATHERSTACK_API_KEY');
    return {
      error: {
        code: 401,
        type: 'MISSING_API_KEY',
        info: 'API key de WeatherStack no configurada'
      }
    };
  }

  try {
    const baseUrl = API_URLS.weatherstack('current');
    const fullUrl = `${baseUrl}?access_key=${apiKey}&query=${encodeURIComponent(location)}`;
    const url = isProduction ? proxyUrl(fullUrl) : fullUrl;
    
    console.log('[WeatherStack] 🌐 URL:', url);
    const response = await fetchWithTimeout(url);
    console.log('[WeatherStack] ✅ Respuesta:', response.status);
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    
    const data = await response.json();
    
    if (data.error) {
      console.error('[WeatherStack] ❌ Error:', data.error);
      return { error: data.error };
    }
    
    return { success: true, data };
  } catch (error) {
    console.error('[WeatherStack] ❌ Error:', error);
    return { error: handleApiError(error) };
  }
}

export async function getWeatherForecast(location: string, days: number = 3): Promise<ApiLayerResponse<any>> {
  const apiKey = import.meta.env.VITE_WEATHERSTACK_API_KEY;
  
  console.log('[WeatherStack Forecast] Iniciando petición...', { location, days, hasApiKey: !!apiKey });
  
  if (!apiKey) {
    console.error('[WeatherStack Forecast] ❌ API key no configurada');
    return {
      error: {
        code: 401,
        type: 'MISSING_API_KEY',
        info: 'API key de WeatherStack no configurada'
      }
    };
  }

  try {
    const baseUrl = API_URLS.weatherstack('forecast');
    const fullUrl = `${baseUrl}?access_key=${apiKey}&query=${encodeURIComponent(location)}&forecast_days=${days}`;
    const url = isProduction ? proxyUrl(fullUrl) : fullUrl;
    const response = await fetchWithTimeout(url);
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    
    const data = await response.json();
    
    if (data.error) {
      return { error: data.error };
    }
    
    return { success: true, data };
  } catch (error) {
    return { error: handleApiError(error) };
  }
}

// ============================================
// AviationStack - Datos de aviación (preparado para Paso 4)
// ============================================
export async function getFlights(params: { dep_iata?: string; arr_iata?: string; limit?: number } = {}): Promise<ApiLayerResponse<any>> {
  const apiKey = import.meta.env.VITE_AVIATIONSTACK_API_KEY;
  
  if (!apiKey) {
    return {
      error: {
        code: 401,
        type: 'MISSING_API_KEY',
        info: 'API key de AviationStack no configurada'
      }
    };
  }

  try {
    const queryParams = new URLSearchParams({
      access_key: apiKey,
      ...Object.fromEntries(Object.entries(params).filter(([_, v]) => v !== undefined))
    });
    
    const baseUrl = API_URLS.aviationstack('flights');
    const fullUrl = `${baseUrl}?${queryParams.toString()}`;
    const url = isProduction ? proxyUrl(fullUrl) : fullUrl;
    const response = await fetchWithTimeout(url);
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    
    const data = await response.json();
    
    if (data.error) {
      return { error: data.error };
    }
    
    return { success: true, data };
  } catch (error) {
    return { error: handleApiError(error) };
  }
}

// ============================================
// MediaStack - Noticias (preparado para Paso 4)
// ============================================
export async function getNews(params: { keywords?: string; languages?: string; limit?: number } = {}): Promise<ApiLayerResponse<any>> {
  const apiKey = import.meta.env.VITE_MEDIASTACK_API_KEY;
  
  if (!apiKey) {
    return {
      error: {
        code: 401,
        type: 'MISSING_API_KEY',
        info: 'API key de MediaStack no configurada'
      }
    };
  }

  try {
    const queryParams = new URLSearchParams({
      access_key: apiKey,
      ...Object.fromEntries(Object.entries(params).filter(([_, v]) => v !== undefined))
    });
    
    const baseUrl = API_URLS.mediastack('news');
    const fullUrl = `${baseUrl}?${queryParams.toString()}`;
    const url = isProduction ? proxyUrl(fullUrl) : fullUrl;
    const response = await fetchWithTimeout(url);
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    
    const data = await response.json();
    
    if (data.error) {
      return { error: data.error };
    }
    
    return { success: true, data };
  } catch (error) {
    return { error: handleApiError(error) };
  }
}

// ============================================
// CountryLayer - Información de países (preparado para Paso 4)
// ============================================
export async function getCountries(params: { codes?: string; fields?: string } = {}): Promise<ApiLayerResponse<any>> {
  const apiKey = import.meta.env.VITE_COUNTRYLAYER_API_KEY;
  
  if (!apiKey) {
    return {
      error: {
        code: 401,
        type: 'MISSING_API_KEY',
        info: 'API key de CountryLayer no configurada'
      }
    };
  }

  try {
    const queryParams = new URLSearchParams({
      access_key: apiKey,
      ...Object.fromEntries(Object.entries(params).filter(([_, v]) => v !== undefined))
    });
    
    const baseUrl = API_URLS.countrylayer('all');
    const fullUrl = `${baseUrl}?${queryParams.toString()}`;
    const url = isProduction ? proxyUrl(fullUrl) : fullUrl;
    const response = await fetchWithTimeout(url);
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    
    const data = await response.json();
    
    if (data.error) {
      return { error: data.error };
    }
    
    return { success: true, data };
  } catch (error) {
    return { error: handleApiError(error) };
  }
}
