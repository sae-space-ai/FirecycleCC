// NASA FIRMS Service - Fire Information for Resource Management System
// Documentación: https://firms.modasp.eosdis.nasa.gov/api/

import { API_URLS, proxyUrl, isProduction } from '../utils/apiUrls';

interface NASAFIRMSResponse {
  success?: boolean;
  error?: {
    code: number;
    type: string;
    info: string;
  };
  data?: NASAFireAlert[];
}

export interface NASAFireAlert {
  latitude: number;
  longitude: number;
  brightness: number;
  confidence: 'low' | 'nominal' | 'high';
  acq_date: string; // YYYY-MM-DD
  acq_time: string; // HHMM
  satellite: string;
  instrument: string;
  frp: number; // Fire Radiative Power
  daynight: 'D' | 'N';
  type: number;
}

// Timeout por defecto: 15 segundos (NASA puede ser lento)
const DEFAULT_TIMEOUT = 15000;

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

// Función helper para manejar errores
function handleApiError(error: unknown): NASAFIRMSResponse['error'] {
  if (error instanceof Error) {
    if (error.name === 'AbortError') {
      return {
        code: 408,
        type: 'TIMEOUT_ERROR',
        info: 'La petición a NASA FIRMS tardó demasiado en responder'
      };
    }
    return {
      code: 500,
      type: 'NETWORK_ERROR',
      info: error.message || 'Error de red al conectar con NASA FIRMS'
    };
  }
  return {
    code: 500,
    type: 'UNKNOWN_ERROR',
    info: 'Error desconocido al procesar datos de NASA FIRMS'
  };
}

// Función para parsear CSV de NASA FIRMS
function parseFIRMSCSV(csvText: string): NASAFireAlert[] {
  const lines = csvText.trim().split('\n');
  
  if (lines.length < 2) {
    return [];
  }

  // Primera línea es el header
  const headers = lines[0].split(',');
  
  // Encontrar índices de columnas importantes
  const latitudeIdx = headers.indexOf('latitude');
  const longitudeIdx = headers.indexOf('longitude');
  const brightnessIdx = headers.indexOf('brightness');
  const confidenceIdx = headers.indexOf('confidence');
  const acqDateIdx = headers.indexOf('acq_date');
  const acqTimeIdx = headers.indexOf('acq_time');
  const satelliteIdx = headers.indexOf('satellite');
  const instrumentIdx = headers.indexOf('instrument');
  const frpIdx = headers.indexOf('frp');
  const daynightIdx = headers.indexOf('daynight');
  const typeIdx = headers.indexOf('type');

  const alerts: NASAFireAlert[] = [];

  // Procesar cada línea de datos
  for (let i = 1; i < lines.length; i++) {
    const values = lines[i].split(',');
    
    if (values.length < headers.length) continue;

    const confidenceValue = values[confidenceIdx];
    let confidence: 'low' | 'nominal' | 'high' = 'nominal';
    
    if (confidenceValue === 'l' || confidenceValue === 'low') {
      confidence = 'low';
    } else if (confidenceValue === 'h' || confidenceValue === 'high') {
      confidence = 'high';
    }

    alerts.push({
      latitude: parseFloat(values[latitudeIdx]),
      longitude: parseFloat(values[longitudeIdx]),
      brightness: parseFloat(values[brightnessIdx]),
      confidence: confidence,
      acq_date: values[acqDateIdx],
      acq_time: values[acqTimeIdx],
      satellite: values[satelliteIdx],
      instrument: values[instrumentIdx],
      frp: parseFloat(values[frpIdx]),
      daynight: values[daynightIdx] as 'D' | 'N',
      type: parseInt(values[typeIdx])
    });
  }

  return alerts;
}

/**
 * Obtiene focos de incendio activos en un área específica
 * @param lat - Latitud central del área
 * @param lon - Longitud central del área
 * @param radiusKm - Radio en kilómetros (default: 50km)
 * @param days - Número de días hacia atrás (default: 1 = solo hoy)
 */
export async function getActiveFires(
  lat: number = 40.35,
  lon: number = -6.30,
  radiusKm: number = 50,
  days: number = 1
): Promise<NASAFIRMSResponse> {
  const apiKey = import.meta.env.VITE_NASA_FIRMS_MAP_KEY;
  
  if (!apiKey) {
    return {
      error: {
        code: 401,
        type: 'MISSING_API_KEY',
        info: 'API key de NASA FIRMS no configurada. Añade VITE_NASA_FIRMS_MAP_KEY en .env'
      }
    };
  }

  try {
    // Calcular bounding box alrededor del punto central
    // Aproximadamente 1 grado de latitud = 111 km
    // 1 grado de longitud varía según la latitud
    const latOffset = radiusKm / 111;
    const lonOffset = radiusKm / (111 * Math.cos(lat * Math.PI / 180));

    const lat1 = lat - latOffset;
    const lon1 = lon - lonOffset;
    const lat2 = lat + latOffset;
    const lon2 = lon + lonOffset;

    // Formato de coordenadas para NASA FIRMS: "lon1,lat1/lon2,lat2/lon3,lat3/lon4,lat4"
    const coordinates = `${lon1},${lat1}/${lon2},${lat1}/${lon2},${lat2}/${lon1},${lat2}`;

    // Usar VIIRS_SNPP_NRT (más reciente y preciso)
    const source = 'VIIRS_SNPP_NRT';
    
    const baseUrl = API_URLS.nasaFirms(`area/csv/${apiKey}/${source}/${coordinates}/${days}`);
    const url = isProduction ? proxyUrl(baseUrl) : baseUrl;

    const response = await fetchWithTimeout(url);
    
    if (!response.ok) {
      if (response.status === 401) {
        return {
          error: {
            code: 401,
            type: 'INVALID_API_KEY',
            info: 'API key de NASA FIRMS inválida. Verifica tu clave en https://firms.modaps.eosdis.nasa.gov/api/'
          }
        };
      }
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    
    const csvText = await response.text();
    
    // Si la respuesta está vacía o solo tiene el header, no hay incendios
    if (!csvText.trim() || csvText.trim().split('\n').length < 2) {
      return { success: true, data: [] };
    }
    
    const alerts = parseFIRMSCSV(csvText);
    
    return { success: true, data: alerts };
  } catch (error) {
    return { error: handleApiError(error) };
  }
}

/**
 * Obtiene focos de incendio para Las Hurdes específicamente
 */
export async function getLasHurdesFires(days: number = 1): Promise<NASAFIRMSResponse> {
  return getActiveFires(40.35, -6.30, 50, days);
}
