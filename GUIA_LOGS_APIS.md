# 🔧 Diagnóstico y Logs de APIs

## ✅ Cambios Realizados

Se han añadido **logs detallados** a todos los servicios de API para diagnosticar problemas de conexión en Vercel.

### 📝 Archivos Modificados

1. **`src/services/apiLayerService.ts`**
   - ✅ Logs en `getIpLocation()` (IPStack)
   - ✅ Logs en `geocodeAddress()` (PositionStack)
   - ✅ Logs en `getCurrentWeather()` (WeatherStack)
   - ✅ Logs en `getWeatherForecast()` (WeatherStack)
   - ✅ Logs en `getFlights()` (AviationStack)
   - ✅ Logs en `getNews()` (MediaStack)
   - ✅ Logs en `getCountries()` (CountryLayer)

2. **`src/services/nasaService.ts`**
   - ✅ Logs en `getActiveFires()` (NASA FIRMS)

3. **`src/services/copernicusService.ts`**
   - ✅ Logs en `getAccessToken()` (OAuth)
   - ✅ Logs en `getSentinelImages()` (Sentinel-2)
   - ✅ Logs en `getNDVI()` (NDVI)

4. **`src/utils/diagnoseAPIs.ts`** (NUEVO)
   - ✅ Herramienta de diagnóstico en consola
   - ✅ Verificación de variables de entorno
   - ✅ Pruebas rápidas de APIs

5. **`src/App.tsx`**
   - ✅ Importación automática de diagnoseAPIs

---

## 🎯 Cómo Usar los Logs

### En la Consola del Navegador

Abre la consola del navegador (F12) y verás logs como:

```
[IPStack] Iniciando petición... { ip: 'check', hasApiKey: true, isProduction: true }
[IPStack] 🌐 URL: /api/proxy?target=https%3A%2F%2Fapi.ipstack.com%2Fcheck%3Faccess_key%3D...
[IPStack] ✅ Respuesta recibida: 200
[IPStack] 📦 Datos recibidos: { ip: '8.8.8.8', country_name: 'United States', ... }
```

### Logs de Error

Si hay un error, verás:

```
[IPStack] ❌ API key no configurada. Verifica VITE_IPSTACK_API_KEY en las variables de entorno de Vercel
```

O:

```
[IPStack] ❌ Error en petición: TypeError: Failed to fetch
```

---

## 🔍 Herramienta de Diagnóstico

### En la Consola del Navegador

Ejecuta:

```javascript
diagnoseAPIs()
```

Esto mostrará:

```
🔍 === DIAGNÓSTICO DE APIs ===

🌐 Entorno:
  - import.meta.env.DEV: false
  - import.meta.env.PROD: true
  - import.meta.env.MODE: production

🔑 Variables de Entorno:
  - VITE_IPSTACK_API_KEY: ✅ Configurada
  - VITE_WEATHERSTACK_API_KEY: ❌ NO CONFIGURADA
  - VITE_NASA_FIRMS_MAP_KEY: ✅ Configurada
  ...

📋 Instrucciones:
  1. Si ves "❌ NO CONFIGURADA", añade la variable en Vercel:
     - Ve a tu proyecto en Vercel
     - Settings → Environment Variables
     - Añade la variable y redespliega
```

### Prueba Rápida de APIs

Ejecuta:

```javascript
await testAPIs()
```

Esto probará las APIs directamente y mostrará si funcionan.

---

## 🚨 Problemas Comunes y Soluciones

### 1. "API key no configurada"

**Síntoma:**
```
[IPStack] ❌ API key no configurada. Verifica VITE_IPSTACK_API_KEY
```

**Solución:**
1. Ve a Vercel → Settings → Environment Variables
2. Añade `VITE_IPSTACK_API_KEY` con tu API key
3. **IMPORTANTE:** Selecciona los 3 entornos (Production, Preview, Development)
4. Redespliega: `vercel --prod`

### 2. "Failed to fetch" o "Network Error"

**Síntoma:**
```
[IPStack] ❌ Error en petición: TypeError: Failed to fetch
```

**Causas posibles:**
- El proxy de Vercel no está funcionando
- La API externa está caída
- Problemas de CORS

**Solución:**
1. Verifica que `api/proxy.js` existe en tu repositorio
2. Verifica que `vercel.json` está configurado correctamente
3. Revisa los logs de Vercel: `vercel logs`
4. Prueba acceder directamente a la API desde el navegador

### 3. "Domain not allowed"

**Síntoma:**
```
[Proxy] ❌ Domain not allowed: api.example.com
```

**Solución:**
Añade el dominio a la lista blanca en `api/proxy.js`:

```javascript
const allowedDomains = [
  'api.ipstack.com',
  'api.weatherstack.com',
  // Añade tu dominio aquí
  'api.example.com',
];
```

### 4. Las peticiones no aparecen en Network

**Síntoma:**
No ves peticiones a `/api/proxy` en la pestaña Network

**Causa:**
Las funciones no se están ejecutando porque falta la API key

**Solución:**
1. Ejecuta `diagnoseAPIs()` en la consola
2. Verifica que todas las API keys están configuradas
3. Recarga la página

---

## 📊 Flujo de Ejecución

### En Desarrollo (localhost)

```
1. Componente monta → useEffect se ejecuta
2. Llama a getIpLocation('check')
3. console.log muestra: "[IPStack] Iniciando petición..."
4. Construye URL: "/api/ipstack/check?access_key=..."
5. Vite proxy redirige a: "http://api.ipstack.com/check?access_key=..."
6. API responde con datos
7. console.log muestra: "[IPStack] ✅ Respuesta recibida: 200"
8. Componente actualiza estado con los datos
```

### En Producción (Vercel)

```
1. Componente monta → useEffect se ejecuta
2. Llama a getIpLocation('check')
3. console.log muestra: "[IPStack] Iniciando petición..."
4. Construye URL: "/api/proxy?target=https://api.ipstack.com/check?access_key=..."
5. Vercel ejecuta api/proxy.js
6. Proxy valida dominio y hace fetch a la API externa
7. API responde con datos
8. Proxy devuelve datos al frontend
9. console.log muestra: "[IPStack] ✅ Respuesta recibida: 200"
10. Componente actualiza estado con los datos
```

---

## 🎯 Próximos Pasos

### 1. Desplegar los Cambios

```bash
# Commit y push
git add .
git commit -m "Add detailed API logging for debugging"
git push origin main

# Vercel desplegará automáticamente
```

### 2. Verificar en Vercel

1. Abre tu aplicación en Vercel
2. Abre la consola del navegador (F12)
3. Verás los logs de todas las APIs
4. Si hay errores, verás mensajes claros

### 3. Diagnosticar Problemas

Si las APIs no funcionan:

```javascript
// En la consola del navegador
diagnoseAPIs()  // Ver estado de variables
await testAPIs()  // Probar APIs directamente
```

### 4. Configurar Variables Faltantes

Si ves "❌ NO CONFIGURADA":

1. Ve a Vercel → Settings → Environment Variables
2. Añade la variable:
   - Name: `VITE_WEATHERSTACK_API_KEY`
   - Value: `tu_api_key_aqui`
   - Environment: ✅ Production, ✅ Preview, ✅ Development
3. Click "Save"
4. Redespliega: `vercel --prod`

---

## 📝 Ejemplo de Logs Completos

### Éxito

```
[IPStack] Iniciando petición... { ip: 'check', hasApiKey: true, isProduction: true }
[IPStack] 🌐 URL: /api/proxy?target=https%3A%2F%2Fapi.ipstack.com%2Fcheck%3Faccess_key%3Dabc123
[IPStack] ✅ Respuesta recibida: 200
[IPStack] 📦 Datos recibidos: { ip: '8.8.8.8', country_name: 'United States', city: 'Mountain View', ... }

[WeatherStack] Iniciando petición... { location: 'Las Hurdes, Spain', hasApiKey: true }
[WeatherStack] 🌐 URL: /api/proxy?target=https%3A%2F%2Fapi.weatherstack.com%2Fcurrent%3Faccess_key%3Dxyz789%26query%3DLas%2520Hurdes%252C%2520Spain
[WeatherStack] ✅ Respuesta: 200
[WeatherStack] 📦 Datos: { location: { name: 'Las Hurdes' }, current: { temperature: 25, ... } }

[NASA FIRMS] Iniciando petición... { lat: 40.35, lon: -6.3, radiusKm: 50, days: 1, hasApiKey: true, isProduction: true }
[NASA FIRMS] 🌐 URL: /api/proxy?target=https%3A%2F%2Ffirms.modaps.eosdis.nasa.gov%2Fapi%2Farea%2Fcsv%2F...
[NASA FIRMS] ✅ Respuesta: 200
[NASA FIRMS] 📦 CSV recibido, longitud: 1234
[NASA FIRMS] 🔥 Incendios parseados: 3
```

### Error (API Key Faltante)

```
[IPStack] Iniciando petición... { ip: 'check', hasApiKey: false, isProduction: true }
[IPStack] ❌ API key no configurada. Verifica VITE_IPSTACK_API_KEY en las variables de entorno de Vercel
```

### Error (Red)

```
[WeatherStack] Iniciando petición... { location: 'Las Hurdes, Spain', hasApiKey: true }
[WeatherStack] 🌐 URL: /api/proxy?target=...
[WeatherStack] ❌ Error: TypeError: Failed to fetch
```

---

## 🎓 Recursos

- [Vercel Logs](https://vercel.com/docs/concepts/deployments/logs)
- [Vercel Environment Variables](https://vercel.com/docs/concepts/projects/environment-variables)
- [Browser Console](https://developer.chrome.com/docs/devtools/console/)

---

**Última actualización:** 2026-01-XX
**Estado:** ✅ Logs añadidos y probados
