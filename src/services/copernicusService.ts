// Copernicus Sentinel Hub Service
// Documentación: https://docs.sentinel-hub.com/api/latest/

interface CopernicusTokenResponse {
  access_token: string;
  expires_in: number;
  token_type: string;
}

interface CopernicusCatalogResponse {
  data: Array<{
    id: string;
    geometry: any;
    properties: {
      datetime: string;
      created: string;
      updated: string;
      collection: string;
    };
  }>;
}

interface CopernicusResponse<T> {
  success?: boolean;
  error?: {
    code: number;
    type: string;
    info: string;
  };
  data?: T;
}

// Cache para el token de acceso
let cachedToken: { token: string; expiresAt: number } | null = null;

// Timeout por defecto: 30 segundos (las imágenes pueden ser grandes)
const DEFAULT_TIMEOUT = 30000;

// Función helper para fetch con timeout
async function fetchWithTimeout(
  url: string,
  options: RequestInit = {},
  timeout: number = DEFAULT_TIMEOUT
): Promise<Response> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch(url, { ...options, signal: controller.signal });
    clearTimeout(timeoutId);
    return response;
  } catch (error) {
    clearTimeout(timeoutId);
    throw error;
  }
}

// Función helper para manejar errores
function handleApiError(error: unknown): CopernicusResponse<any>['error'] {
  if (error instanceof Error) {
    if (error.name === 'AbortError') {
      return {
        code: 408,
        type: 'TIMEOUT_ERROR',
        info: 'La petición a Copernicus tardó demasiado en responder'
      };
    }
    return {
      code: 500,
      type: 'NETWORK_ERROR',
      info: error.message || 'Error de red al conectar con Copernicus'
    };
  }
  return {
    code: 500,
    type: 'UNKNOWN_ERROR',
    info: 'Error desconocido al procesar datos de Copernicus'
  };
}

/**
 * Obtiene un token de acceso de Copernicus usando OAuth2
 */
async function getAccessToken(): Promise<CopernicusResponse<string>> {
  const clientId = import.meta.env.VITE_COPERNICUS_CLIENT_ID;
  const clientSecret = import.meta.env.VITE_COPERNICUS_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    return {
      error: {
        code: 401,
        type: 'MISSING_CREDENTIALS',
        info: 'Credenciales de Copernicus no configuradas. Añade VITE_COPERNICUS_CLIENT_ID y VITE_COPERNICUS_CLIENT_SECRET en .env'
      }
    };
  }

  // Si tenemos un token cacheado y aún es válido, lo usamos
  if (cachedToken && Date.now() < cachedToken.expiresAt) {
    return { success: true, data: cachedToken.token };
  }

  try {
    const response = await fetchWithTimeout(
      '/api/copernicus/oauth/token',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          grant_type: 'client_credentials',
          client_id: clientId,
          client_secret: clientSecret,
        }),
      }
    );

    if (!response.ok) {
      if (response.status === 401) {
        return {
          error: {
            code: 401,
            type: 'INVALID_CREDENTIALS',
            info: 'Credenciales de Copernicus inválidas. Verifica tu CLIENT_ID y CLIENT_SECRET'
          }
        };
      }
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const tokenData: CopernicusTokenResponse = await response.json();

    // Cacheamos el token (con 5 minutos de margen)
    cachedToken = {
      token: tokenData.access_token,
      expiresAt: Date.now() + (tokenData.expires_in - 300) * 1000,
    };

    return { success: true, data: tokenData.access_token };
  } catch (error) {
    return { error: handleApiError(error) };
  }
}

/**
 * Obtiene imágenes satelitales recientes de Sentinel-2 para una zona específica
 * @param lat - Latitud central
 * @param lon - Longitud central
 * @param days - Número de días hacia atrás para buscar imágenes
 */
export async function getSentinelImages(
  lat: number = 40.35,
  lon: number = -6.30,
  days: number = 7
): Promise<CopernicusResponse<CopernicusCatalogResponse['data']>> {
  const tokenResult = await getAccessToken();

  if (tokenResult.error) {
    return { error: tokenResult.error };
  }

  try {
    const fromDate = new Date();
    fromDate.setDate(fromDate.getDate() - days);

    const toDate = new Date();

    // Crear bounding box (aproximadamente 20km x 20km)
    const latOffset = 0.1;
    const lonOffset = 0.1;

    const bbox = [
      lon - lonOffset,
      lat - latOffset,
      lon + lonOffset,
      lat + latOffset,
    ];

    const response = await fetchWithTimeout(
      '/api/copernicus/api/v1/catalog/1.0.0/search',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${tokenResult.data}`,
        },
        body: JSON.stringify({
          collections: ['sentinel-2-l2a'],
          datetime: `${fromDate.toISOString()}/${toDate.toISOString()}`,
          bbox: bbox,
          limit: 10,
        }),
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const catalogData: CopernicusCatalogResponse = await response.json();

    return { success: true, data: catalogData.data };
  } catch (error) {
    return { error: handleApiError(error) };
  }
}

/**
 * Obtiene una imagen satelital de Sentinel-2 para una fecha específica
 * @param lat - Latitud central
 * @param lon - Longitud central
 * @param date - Fecha en formato YYYY-MM-DD
 * @param width - Ancho de la imagen en píxeles
 * @param height - Alto de la imagen en píxeles
 */
export async function getSentinelImage(
  lat: number = 40.35,
  lon: number = -6.30,
  date: string = new Date().toISOString().split('T')[0],
  width: number = 512,
  height: number = 512
): Promise<CopernicusResponse<string>> {
  const tokenResult = await getAccessToken();

  if (tokenResult.error) {
    return { error: tokenResult.error };
  }

  try {
    // Crear bounding box (aproximadamente 10km x 10km)
    const latOffset = 0.05;
    const lonOffset = 0.05;

    const bbox = [
      lon - lonOffset,
      lat - latOffset,
      lon + lonOffset,
      lat + latOffset,
    ];

    // Evalscript para obtener imagen RGB natural
    const evalscript = `
      //VERSION=3
      function setup() {
        return {
          input: ["B04", "B03", "B02"],
          output: { bands: 3 }
        };
      }
      function evaluatePixel(sample) {
        return [2.5 * sample.B04, 2.5 * sample.B03, 2.5 * sample.B02];
      }
    `;

    const response = await fetchWithTimeout(
      '/api/copernicus/api/v1/process',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${tokenResult.data}`,
        },
        body: JSON.stringify({
          input: {
            bounds: {
              bbox: bbox,
              properties: { crs: 'http://www.opengis.net/def/crs/EPSG/0/4326' },
            },
            data: [
              {
                type: 'byocCollection',
                dataFilter: {
                  mosaickingOrder: 'leastCC',
                },
              },
            ],
          },
          output: {
            width: width,
            height: height,
            responses: [
              {
                identifier: 'default',
                format: { type: 'image/jpeg' },
              },
            ],
          },
          evalscript: evalscript,
        }),
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    // Convertir la respuesta de imagen a base64
    const blob = await response.blob();
    const reader = new FileReader();
    
    return new Promise((resolve) => {
      reader.onloadend = () => {
        resolve({ success: true, data: reader.result as string });
      };
      reader.onerror = () => {
        resolve({
          error: {
            code: 500,
            type: 'PROCESSING_ERROR',
            info: 'Error al procesar la imagen satelital'
          }
        });
      };
      reader.readAsDataURL(blob);
    });
  } catch (error) {
    return { error: handleApiError(error) };
  }
}

/**
 * Obtiene imágenes recientes de Las Hurdes
 */
export async function getLasHurdesSentinelImages(days: number = 7): Promise<CopernicusResponse<CopernicusCatalogResponse['data']>> {
  return getSentinelImages(40.35, -6.30, days);
}
