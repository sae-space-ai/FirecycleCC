# 🛰️ APIs Geoespaciales - Guía Completa

## ✅ Estado Actual del Sistema

El Firecycle Command Center ahora cuenta con **dos APIs geoespaciales en tiempo real** integradas:

### 1. NASA FIRMS (Fire Information for Resource Management System)
- ✅ **Estado**: Activo y funcionando
- ✅ **Función**: Detección de focos de incendio activos
- ✅ **Satélite**: VIIRS SNPP (resolución 375m)
- ✅ **Actualización**: Cada 5 minutos
- ✅ **Cobertura**: Las Hurdes (radio 50km)

### 2. Copernicus Sentinel Hub
- ✅ **Estado**: Activo y funcionando
- ✅ **Función**: Imágenes satelitales Sentinel-2 L2A
- ✅ **Satélite**: Sentinel-2 (resolución 10m)
- ✅ **Actualización**: Cada 10 minutos
- ✅ **Cobertura**: Las Hurdes (últimos 7 días)

---

## 🔑 Configuración de API Keys

### Paso 1: Copiar archivo .env

```bash
cp .env.example .env
```

### Paso 2: Obtener API Keys

#### NASA FIRMS
1. Ve a [https://firms.modaps.eosdis.nasa.gov/api/](https://firms.modaps.eosdis.nasa.gov/api/)
2. Regístrate y obtén tu **MAP_KEY**
3. Es una cadena alfanumérica única

#### Copernicus Sentinel Hub
1. Ve a [https://dataspace.copernicus.eu/](https://dataspace.copernicus.eu/)
2. Regístrate y crea una aplicación
3. Obtén tu **Client ID** y **Client Secret**

### Paso 3: Configurar .env

```env
# NASA FIRMS
VITE_NASA_FIRMS_MAP_KEY=tu_map_key_aqui

# Copernicus Sentinel Hub
VITE_COPERNICUS_CLIENT_ID=tu_client_id_aqui
VITE_COPERNICUS_CLIENT_SECRET=tu_client_secret_aqui
```

### Paso 4: Reiniciar servidor

```bash
npm run dev
```

---

## 📊 Widgets en el Dashboard

### Widget de Alertas de Incendio (NASA FIRMS)

**Ubicación**: Debajo de los widgets de ubicación y clima

**Muestra**:
- ✅ Lista de focos detectados en las últimas 24 horas
- ✅ Fecha y hora de detección
- ✅ Nivel de confianza (Alta/Normal/Baja)
- ✅ Temperatura de brillo (Kelvin)
- ✅ FRP - Fire Radiative Power (MW)
- ✅ Coordenadas GPS
- ✅ Satélite e instrumento usado
- ✅ Última actualización

**Estados**:
- 🔄 **Cargando**: Spinner animado
- ❌ **Error**: Mensaje claro + botón "Reintentar"
- ✅ **Sin focos**: Mensaje verde "Zona Segura"
- 🔥 **Focos detectados**: Lista detallada de alertas

**Actualización**: Automática cada 5 minutos

---

### Widget de Imágenes Satelitales (Copernicus)

**Ubicación**: Debajo del widget de alertas de incendio

**Muestra**:
- ✅ Lista de imágenes Sentinel-2 de los últimos 7 días
- ✅ Fecha y hora de captura
- ✅ ID único de la imagen
- ✅ Colección (sentinel-2-l2a)
- ✅ Última actualización

**Estados**:
- 🔄 **Cargando**: Spinner animado
- ❌ **Error**: Mensaje claro + botón "Reintentar"
- 📷 **Sin imágenes**: Mensaje "Sin Imágenes Recientes"
- 🛰️ **Imágenes disponibles**: Lista detallada

**Actualización**: Automática cada 10 minutos

---

## 🛡️ Manejo de Errores Robusto

Ambos widgets implementan el mismo patrón robusto:

```typescript
try {
  setIsLoading(true);
  setError(null);
  
  // Llamada a la API
  const result = await apiCall();
  
  if (result.error) {
    throw new Error(result.error.info);
  }
  
  // Procesar datos exitosos
  setData(result.data);
  
} catch (err) {
  // Capturar y mostrar error
  setError(err.message);
  
} finally {
  // SIEMPRE se ejecuta
  setIsLoading(false);
}
```

### Características:
- ✅ **Nunca se queda cargando infinitamente**
- ✅ **Muestra errores claros al usuario**
- ✅ **Botón "Reintentar" en caso de error**
- ✅ **Error Boundary para aislamiento de fallos**
- ✅ **Logs detallados en consola**

---

## 🔧 Arquitectura Técnica

### Proxies de Vite

Configurados en `vite.config.ts` para evitar errores CORS:

```typescript
'/api/nasa-firms': {
  target: 'https://firms.modaps.eosdis.nasa.gov',
  changeOrigin: true,
  rewrite: (path) => path.replace(/^\/api\/nasa-firms/, '')
},
'/api/copernicus': {
  target: 'https://sh.dataspace.copernicus.eu',
  changeOrigin: true,
  rewrite: (path) => path.replace(/^\/api\/copernicus/, '')
}
```

### Servicios

#### `src/services/nasaService.ts`
- Función `getActiveFires(lat, lon, radiusKm, days)`
- Parseo de datos CSV de NASA FIRMS
- Cálculo automático de bounding box
- Timeout: 15 segundos

#### `src/services/copernicusService.ts`
- Función `getSentinelImages(lat, lon, days)`
- Autenticación OAuth2 con cache de tokens
- Búsqueda de imágenes por área y fecha
- Timeout: 30 segundos

### Componentes

#### `src/components/FireAlerts.tsx`
- Muestra alertas de incendio de NASA FIRMS
- Actualización automática cada 5 minutos
- Manejo completo de estados

#### `src/components/SatelliteImagery.tsx`
- Muestra imágenes satelitales de Copernicus
- Actualización automática cada 10 minutos
- Manejo completo de estados

---

## 📈 Comparativa de APIs

| Característica | NASA FIRMS | Copernicus |
|----------------|------------|------------|
| **Propósito** | Detección de incendios | Imágenes satelitales |
| **Satélite** | VIIRS SNPP | Sentinel-2 |
| **Resolución** | 375m | 10m |
| **Actualización** | ~3 horas | ~5 días |
| **Cobertura** | Global | Global |
| **Datos** | Focos activos | Imágenes RGB |
| **Formato** | CSV | JSON/GeoTIFF |
| **Coste** | Gratuito | Gratuito |
| **Límite** | Sin límite | Sin límite |
| **Actualización widget** | 5 minutos | 10 minutos |

---

## 🎯 Casos de Uso Integrados

### 1. Monitoreo de Incendios en Tiempo Real
- NASA FIRMS detecta focos activos
- Copernicus proporciona contexto visual
- Combinación para análisis completo

### 2. Análisis Post-Incendio
- Comparar imágenes antes/después
- Evaluar extensión del daño
- Planificar restauración

### 3. Prevención y Detección Temprana
- Detección automática de nuevos focos
- Alertas en tiempo real
- Verificación con imágenes satelitales

### 4. Seguimiento de Evolución
- Monitoreo de propagación
- Análisis de intensidad (FRP)
- Documentación con imágenes

---

## 🐛 Solución de Problemas Comunes

### Problema: Widgets se quedan cargando

**Causa**: Bloque `finally` no se ejecuta (muy raro)

**Solución**:
1. Abre consola del navegador (F12)
2. Busca errores en "Console"
3. Comparte los errores para diagnóstico

### Problema: "API key no configurada"

**Causa**: Variables de entorno no están en `.env`

**Solución**:
```bash
# Verificar .env
cat .env

# Editar si es necesario
nano .env

# Reiniciar servidor
npm run dev
```

### Problema: "Credenciales inválidas"

**Causa**: API keys incorrectas o expiradas

**Solución**:
1. Verifica las credenciales en los portales de cada API
2. Regenera las keys si es necesario
3. Actualiza `.env` y reinicia

### Problema: "TIMEOUT_ERROR"

**Causa**: APIs lentas o problemas de conexión

**Solución**:
- Espera unos minutos
- Verifica tu conexión a internet
- Los timeouts están configurados (15s NASA, 30s Copernicus)

---

## 📚 Documentación Adicional

- **GUIA_NASA_FIRMS.md** - Guía detallada de NASA FIRMS
- **GUIA_COPERNICUS.md** - Guía detallada de Copernicus
- **GUIA_APIS.md** - Guía de APIs de APILayer

---

## 🔗 Enlaces Útiles

### NASA FIRMS
- Portal: https://firms.modaps.eosdis.nasa.gov/
- API: https://firms.modaps.eosdis.nasa.gov/api/
- Mapa: https://firms.modaps.eosdis.nasa.gov/map/

### Copernicus
- Portal: https://dataspace.copernicus.eu/
- Documentación: https://docs.sentinel-hub.com/api/latest/
- EO Browser: https://apps.sentinel-hub.com/eo-browser/

### Sentinel-2
- Misión: https://sentinel.eo.esa.int/web/sentinel/missions/sentinel-2
- Especificaciones: https://sentinel.eo.esa.int/web/sentinel/user-guides/sentinel-2-msi

---

## ✅ Checklist Final

### Configuración
- [ ] Archivo `.env` creado con todas las API keys
- [ ] NASA FIRMS MAP_KEY configurada
- [ ] Copernicus CLIENT_ID configurado
- [ ] Copernicus CLIENT_SECRET configurado
- [ ] Servidor reiniciado después de configurar `.env`

### Funcionalidad
- [ ] Widget de alertas de incendio muestra datos o "Zona Segura"
- [ ] Widget de imágenes satelitales muestra datos o "Sin Imágenes Recientes"
- [ ] Ambos widgets se actualizan automáticamente
- [ ] No hay errores en la consola del navegador (F12)
- [ ] Los estados de carga desaparecen correctamente

### Errores
- [ ] Los errores muestran mensajes claros
- [ ] Los botones "Reintentar" funcionan
- [ ] Los Error Boundaries aíslan fallos
- [ ] Los logs en consola son informativos

---

## 🚀 Próximos Pasos

Con ambas APIs geoespaciales funcionando, puedes:

1. **Integrar en el mapa SVG**
   - Mostrar marcadores de incendios en el mapa
   - Superponer imágenes satelitales como capas
   - Añadir controles de visibilidad

2. **Añadir notificaciones**
   - Alertas sonoras cuando se detecten nuevos incendios
   - Notificaciones push en el navegador
   - Emails automáticos para incendios críticos

3. **Análisis avanzado**
   - Comparación temporal de imágenes
   - Cálculo de NDVI para vegetación
   - Detección de cambios automática

4. **Historial y reportes**
   - Base de datos de incendios detectados
   - Generación de reportes PDF
   - Estadísticas históricas

5. **Más satélites**
   - Sentinel-1 (SAR) para todo clima
   - MODIS para mayor frecuencia
   - Landsat para mayor resolución

---

**¡Sistema completo!** Ambas APIs geoespaciales están integradas y funcionando con manejo robusto de errores.
