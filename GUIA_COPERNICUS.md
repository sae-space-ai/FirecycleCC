# 🛰️ Copernicus Sentinel Hub - Guía de Integración

## ✅ Estado Actual

La API de **Copernicus Sentinel Hub** está integrada y funcionando con manejo robusto de errores.

### Características implementadas:
- ✅ Obtención de imágenes satelitales Sentinel-2 L2A
- ✅ Autenticación OAuth2 con cache de tokens
- ✅ Búsqueda de imágenes por área y fecha
- ✅ Manejo de estados de carga con animaciones
- ✅ Manejo de errores con mensajes visibles
- ✅ Bloques `finally` que SIEMPRE apagan `isLoading`
- ✅ Error Boundaries para aislamiento de fallos
- ✅ Actualización automática cada 10 minutos

---

## 🔑 Paso 1: Obtener Credenciales de Copernicus

### 1.1 Registrarse en Copernicus Data Space

1. Ve a [https://dataspace.copernicus.eu/](https://dataspace.copernicus.eu/)
2. Haz clic en "Register" o "Sign Up"
3. Completa el formulario de registro
4. Verifica tu email
5. Accede a tu panel de control

### 1.2 Crear una Aplicación

1. Inicia sesión en tu cuenta
2. Ve a "Account" → "Applications" o "Dashboard"
3. Haz clic en "Create new application" o "Register application"
4. Completa los datos:
   - **Application Name**: Firecycle Command Center
   - **Description**: Sistema de monitoreo de incendios forestales
   - **Redirect URI**: http://localhost:5173 (para desarrollo)
5. Guarda la aplicación

### 1.3 Obtener Credenciales

Después de crear la aplicación, obtendrás:
- **Client ID** (cadena alfanumérica)
- **Client Secret** (cadena más larga)

**IMPORTANTE:** Guarda estas credenciales en un lugar seguro. No las compartas.

---

## 🔧 Paso 2: Configurar Variables de Entorno

### 2.1 Editar archivo .env

Abre tu archivo `.env` y añade:

```env
VITE_COPERNICUS_CLIENT_ID=tu_client_id_aqui
VITE_COPERNICUS_CLIENT_SECRET=tu_client_secret_aqui
```

### 2.2 Ejemplo completo de .env

```env
# APILayer API Keys
VITE_IPSTACK_API_KEY=tu_ipstack_key_aqui
VITE_WEATHERSTACK_API_KEY=tu_weatherstack_key_aqui

# NASA FIRMS API Key
VITE_NASA_FIRMS_MAP_KEY=tu_map_key_aqui

# Copernicus Sentinel Hub API
VITE_COPERNICUS_CLIENT_ID=abc123def456ghi789
VITE_COPERNICUS_CLIENT_SECRET=xyz987uvw654rst321opq098
```

---

## 🔄 Paso 3: Reiniciar el Servidor

Después de configurar las credenciales:

```bash
# Detener el servidor (Ctrl+C)
# Luego ejecutar:
npm run dev
```

---

## 🧪 Paso 4: Probar el Widget

### Qué verás:

1. **Widget de Imágenes Satelitales** (debajo del widget de alertas de incendio)

2. **Si hay imágenes disponibles:**
   - Lista de imágenes Sentinel-2 de los últimos 7 días
   - Fecha y hora de cada imagen
   - ID único de la imagen
   - Colección (sentinel-2-l2a)
   - Última actualización

3. **Si NO hay imágenes disponibles:**
   - Mensaje: "Sin Imágenes Recientes"
   - "No hay imágenes Sentinel-2 disponibles para Las Hurdes en los últimos 7 días"
   - Última actualización

4. **Si hay error:**
   - Mensaje claro del error
   - Botón "Reintentar"

---

## 📊 Información Técnica

### Área de Monitoreo

- **Centro:** Las Hurdes (40.35°N, -6.30°E)
- **Bounding Box:** Aproximadamente 20km x 20km
- **Período:** Últimos 7 días

### Satélite Usado

- **Sentinel-2 L2A** (Level-2A - corregido atmosféricamente)
- Resolución espacial: 10m (bandas RGB)
- Revisita: Cada 5 días (con 2 satélites)

### Autenticación

- **OAuth2 Client Credentials Flow**
- Token cacheado automáticamente
- Renovación automática antes de expirar
- Margen de seguridad: 5 minutos antes de expiración

### Actualización Automática

- El widget se actualiza automáticamente cada **10 minutos**
- Muestra la hora de la última actualización

### Datos Mostrados

| Campo | Descripción |
|-------|-------------|
| **Fecha** | Fecha de captura de la imagen |
| **Hora** | Hora de captura (UTC) |
| **ID** | Identificador único de la imagen |
| **Colección** | Tipo de producto (sentinel-2-l2a) |

---

## 🐛 Solución de Problemas

### Error: "Credenciales de Copernicus no configuradas"

**Causa:** Las variables `VITE_COPERNICUS_CLIENT_ID` o `VITE_COPERNICUS_CLIENT_SECRET` no están en el archivo `.env`

**Solución:**
```bash
# Verificar que .env existe
ls -la .env

# Editar y añadir las credenciales
nano .env
# Añadir:
# VITE_COPERNICUS_CLIENT_ID=tu_client_id_aqui
# VITE_COPERNICUS_CLIENT_SECRET=tu_client_secret_aqui

# Reiniciar servidor
npm run dev
```

### Error: "Credenciales de Copernicus inválidas"

**Causa:** Las credenciales son incorrectas o la aplicación no está activa

**Solución:**
1. Ve a [https://dataspace.copernicus.eu/](https://dataspace.copernicus.eu/)
2. Verifica que tu aplicación esté activa
3. Regenera las credenciales si es necesario
4. Actualiza el archivo `.env`

### Error: "TIMEOUT_ERROR"

**Causa:** Copernicus está lento o hay problemas de conexión

**Solución:**
- Espera unos minutos e intenta de nuevo
- El timeout está configurado a 30 segundos
- Verifica tu conexión a internet

### Error: "No se recibieron imágenes satelitales"

**Causa:** La API respondió pero sin datos (puede ser normal si hay mucha nubosidad)

**Solución:**
- Si ves "Sin Imágenes Recientes", todo está funcionando correctamente
- Sentinel-2 puede tener gaps por nubosidad
- Intenta aumentar el período de búsqueda (modificar `days` en el código)

### El widget se queda cargando infinitamente

**Causa:** Muy raro, pero posible si hay un problema con el bloque `finally`

**Solución:**
1. Abre la consola del navegador (F12)
2. Busca errores en la pestaña "Console"
3. Comparte los errores para diagnóstico

---

## 📝 Notas Importantes

### Limitaciones del Plan Gratuito

- **Sin límite de peticiones** para uso no comercial
- **Imágenes de los últimos 30 días** (catálogo completo)
- **Resolución completa** (10m para bandas RGB)
- **Procesamiento en el servidor** (no descarga de imágenes completas)

### Diferencia entre Niveles de Producto

- **L1C** (Level-1C): Datos sin corregir atmosféricamente
- **L2A** (Level-2A): Corregido atmosféricamente (el que usamos)
  - Mejor para análisis de superficie
  - Elimina efectos de la atmósfera
  - Más preciso para detección de cambios

### Cobertura de Nubes

- Sentinel-2 puede tener gaps por nubosidad
- En zonas como Las Hurdes, puede haber días sin imágenes claras
- El widget muestra todas las imágenes disponibles, incluso con nubes
- Para análisis sin nubes, considera usar SAR (Sentinel-1)

### Evaluscript Personalizado

El servicio usa un evalscript personalizado para obtener imágenes RGB naturales:
```javascript
function setup() {
  return {
    input: ["B04", "B03", "B02"], // Red, Green, Blue
    output: { bands: 3 }
  };
}
function evaluatePixel(sample) {
  return [2.5 * sample.B04, 2.5 * sample.B03, 2.5 * sample.B02];
}
```

Puedes modificar este script para obtener diferentes combinaciones de bandas:
- **Falso color infrarrojo**: `["B08", "B04", "B03"]`
- **NDVI**: Requiere cálculo personalizado
- **Detección de incendios**: `["B12", "B11", "B04"]`

---

## 🔗 Enlaces Útiles

- **Copernicus Data Space:** https://dataspace.copernicus.eu/
- **Sentinel Hub Documentation:** https://docs.sentinel-hub.com/api/latest/
- **Sentinel-2 Mission:** https://sentinel.eo.esa.int/web/sentinel/missions/sentinel-2
- **EO Browser (Visualizador):** https://apps.sentinel-hub.com/eo-browser/
- **API Playground:** https://docs.sentinel-hub.com/api/latest/examples/

---

## ✅ Checklist de Verificación

- [ ] Cuenta de Copernicus creada
- [ ] Aplicación registrada con Client ID y Client Secret
- [ ] Variables `VITE_COPERNICUS_CLIENT_ID` y `VITE_COPERNICUS_CLIENT_SECRET` añadidas a `.env`
- [ ] Servidor reiniciado después de configurar `.env`
- [ ] Widget de imágenes satelitales muestra datos o "Sin Imágenes Recientes"
- [ ] No hay errores en la consola del navegador (F12)
- [ ] El widget se actualiza automáticamente cada 10 minutos

---

## 🚀 Próximos Pasos

Una vez que Copernicus funcione correctamente, puedes:

1. **Mostrar imágenes en el mapa** - Integrar imágenes como capas en el mapa SVG
2. **Comparación temporal** - Mostrar imágenes antes/después de incendios
3. **Análisis de NDVI** - Detectar vegetación afectada por incendios
4. **Detección de cambios** - Comparar imágenes de diferentes fechas
5. **Descarga de imágenes** - Permitir descargar imágenes completas
6. **Más satélites** - Integrar Sentinel-1 (SAR) para todo clima

---

**¿Todo funciona?** ¡Perfecto! El sistema de imágenes satelitales de Copernicus está completamente integrado y operativo.
