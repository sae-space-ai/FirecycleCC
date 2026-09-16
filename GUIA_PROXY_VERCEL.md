# 🚀 Configuración de Proxy para Vercel

## 📋 Resumen de Cambios

Se ha implementado un **proxy universal** para evitar problemas de CORS al desplegar en Vercel. El proxy actúa como intermediario entre el frontend y las APIs externas.

### Arquitectura

```
┌─────────────┐
│  Frontend   │
│  (React)    │
└──────┬──────┘
       │
       │ /api/proxy?target=...
       │
       ▼
┌─────────────┐
│   Vercel    │
│   Proxy     │
│  (Serverless)│
└──────┬──────┘
       │
       │ Petición directa (sin CORS)
       │
       ▼
┌─────────────┐
│  APIs       │
│  Externas   │
│  (APILayer, │
│   NASA,     │
│   Copernicus)│
└─────────────┘
```

## 🔧 Archivos Modificados

### 1. `api/proxy.js` (Nuevo)
Proxy universal que:
- Recibe el parámetro `target` con la URL completa de la API destino
- Valida que el dominio esté en la lista blanca (seguridad)
- Hace la petición desde el servidor (evita CORS)
- Devuelve la respuesta al frontend
- Soporta GET y POST
- Maneja JSON, CSV e imágenes

### 2. `src/utils/apiUrls.ts` (Actualizado)
- Añadida función `proxyUrl()` que envuelve URLs en producción
- En desarrollo: usa URLs directas (Vite proxy)
- En producción: usa `/api/proxy?target=...`

### 3. `src/services/apiLayerService.ts` (Actualizado)
- Todas las funciones ahora usan `proxyUrl()` en producción
- Funciona tanto en desarrollo como en producción

### 4. `src/services/nasaService.ts` (Actualizado)
- Usa `proxyUrl()` para peticiones a NASA FIRMS

### 5. `src/services/copernicusService.ts` (Actualizado)
- Usa `proxyUrl()` para OAuth y peticiones a Copernicus

### 6. `vercel.json` (Actualizado)
- Rewrites para `/api/proxy`
- Headers CORS para todas las rutas `/api/*`
- Configuración de memoria y duración para el proxy

## 🎯 Cómo Funciona

### En Desarrollo (localhost)

```javascript
// Frontend hace:
fetch('/api/ipstack/check?access_key=xxx')

// Vite proxy redirige a:
http://api.ipstack.com/check?access_key=xxx
```

### En Producción (Vercel)

```javascript
// Frontend hace:
fetch('/api/proxy?target=https://api.ipstack.com/check?access_key=xxx')

// Vercel proxy.js hace:
fetch('https://api.ipstack.com/check?access_key=xxx')

// Devuelve la respuesta al frontend
```

## 🔒 Seguridad

El proxy incluye una **lista blanca de dominios** permitidos:

```javascript
const allowedDomains = [
  'api.ipstack.com',
  'api.positionstack.com',
  'api.weatherstack.com',
  'api.aviationstack.com',
  'api.mediastack.com',
  'api.countrylayer.com',
  'firms.modaps.eosdis.nasa.gov',
  'sh.dataspace.copernicus.eu',
  'identity.dataspace.copernicus.eu',
];
```

Si intentas acceder a un dominio no permitido, recibirás un error 403.

## 🚀 Despliegue en Vercel

### 1. Configurar Variables de Entorno

En el dashboard de Vercel, añade todas las variables de entorno:

```bash
# APILayer
VITE_IPSTACK_API_KEY=xxx
VITE_POSITIONSTACK_API_KEY=xxx
VITE_WEATHERSTACK_API_KEY=xxx
VITE_AVIATIONSTACK_API_KEY=xxx
VITE_MEDIASTACK_API_KEY=xxx
VITE_COUNTRYLAYER_API_KEY=xxx

# NASA FIRMS
VITE_NASA_FIRMS_MAP_KEY=xxx

# Copernicus
VITE_COPERNICUS_CLIENT_ID=xxx
VITE_COPERNICUS_CLIENT_SECRET=xxx

# Mapbox
VITE_MAPBOX_ACCESS_TOKEN=xxx
```

### 2. Desplegar

```bash
# Instalar Vercel CLI si no lo tienes
npm i -g vercel

# Desplegar
vercel --prod
```

### 3. Verificar

Después del despliegue, verifica que las APIs funcionan:

1. Abre la aplicación en Vercel
2. Los widgets deberían mostrar datos reales
3. Revisa la consola del navegador - no debe haber errores de CORS

## 🧪 Testing Local

Para probar el proxy localmente antes de desplegar:

```bash
# Instalar Vercel CLI
npm i -g vercel

# Ejecutar con funciones serverless
vercel dev
```

Esto simula el entorno de Vercel localmente, incluyendo el proxy.

## 🐛 Troubleshooting

### Error: "Domain not allowed"

**Causa**: Estás intentando acceder a un dominio que no está en la lista blanca.

**Solución**: Añade el dominio a `allowedDomains` en `api/proxy.js` y redespliega.

### Error: "Missing target parameter"

**Causa**: La URL no incluye el parámetro `target`.

**Solución**: Verifica que estás usando `proxyUrl()` correctamente en los servicios.

### Error: "Invalid target URL"

**Causa**: La URL proporcionada no es válida.

**Solución**: Verifica que la URL esté correctamente formada y codificada.

### APIs no funcionan en producción pero sí en desarrollo

**Causa**: Las variables de entorno no están configuradas en Vercel.

**Solución**: 
1. Ve al dashboard de Vercel
2. Settings → Environment Variables
3. Añade todas las variables necesarias
4. Redespliega

### Error de CORS persiste

**Causa**: El proxy no se está ejecutando correctamente.

**Solución**:
1. Verifica que `vercel.json` está configurado correctamente
2. Revisa los logs en Vercel: `vercel logs`
3. Asegúrate de que `api/proxy.js` existe y es accesible

## 📊 Configuración del Proxy

### Memoria y Timeout

En `vercel.json`:

```json
{
  "functions": {
    "api/proxy.js": {
      "memory": 1024,
      "maxDuration": 30
    }
  }
}
```

- **memory**: 1024 MB (suficiente para la mayoría de peticiones)
- **maxDuration**: 30 segundos (timeout para APIs lentas)

### Headers CORS

El proxy añade automáticamente headers CORS:

```
Access-Control-Allow-Origin: *
Access-Control-Allow-Methods: GET, POST, OPTIONS
Access-Control-Allow-Headers: Content-Type, Authorization
```

## 🔄 Flujo de Datos

### Ejemplo: Widget de Clima

1. **Frontend** llama a `getCurrentWeather('Las Hurdes')`
2. **Servicio** construye URL: `https://api.weatherstack.com/current?access_key=xxx&query=Las Hurdes`
3. **En producción**, `proxyUrl()` envuelve: `/api/proxy?target=https://...`
4. **Frontend** hace fetch a `/api/proxy?target=...`
5. **Vercel proxy.js** recibe la petición
6. **Proxy** valida el dominio y hace fetch a la URL original
7. **API externa** responde con datos del clima
8. **Proxy** devuelve la respuesta al frontend
9. **Widget** muestra los datos

## 📝 Notas Importantes

1. **Variables de entorno**: Las API keys deben estar en Vercel, no en el código
2. **Lista blanca**: Añade nuevos dominios a `allowedDomains` si es necesario
3. **Logs**: Usa `vercel logs` para debuggear problemas
4. **Cache**: El proxy no cachea respuestas (cada petición va a la API)
5. **Rate limiting**: Las APIs externas tienen sus propios límites

## 🎓 Recursos

- [Vercel Serverless Functions](https://vercel.com/docs/functions)
- [Vercel Environment Variables](https://vercel.com/docs/environment-variables)
- [CORS Explained](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS)

---

**Estado**: ✅ Implementado y probado
**Última actualización**: 2026-01-XX
