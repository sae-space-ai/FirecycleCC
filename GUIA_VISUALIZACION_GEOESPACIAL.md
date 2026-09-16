# 🗺️ Visualización Geoespacial Avanzada - Guía Completa

## ✅ Estado Actual

El Firecycle Command Center ahora cuenta con **visualización geoespacial avanzada** integrada:

### 1. Mapa 3D del Terreno (Mapbox GL JS)
- ✅ **Estado**: Activo y funcionando
- ✅ **Características**: 
  - Terreno 3D con exageración del relieve
  - Capa de Hillshade (sombreado de colinas)
  - Estilo satelital de alta resolución
  - Marcadores interactivos de incendios y nodos
  - Popups con información detallada
  - Controles de navegación y pantalla completa
  - Botón para alternar entre 3D y 2D
- ✅ **Fallback**: Mapa 2D de respaldo si falla la carga

### 2. Widget de Índice de Vegetación (NDVI)
- ✅ **Estado**: Activo y funcionando
- ✅ **Características**:
  - Cálculo de NDVI (Normalized Difference Vegetation Index)
  - Barra de progreso visual con código de colores
  - Clasificación automática del estado de vegetación
  - Estadísticas detalladas (min, max, stDev, coverage)
  - Botón de actualización manual
  - Actualización automática cada 10 minutos
- ✅ **Rangos NDVI**:
  - 0.0 - 0.2: Zona árida/quemada (Peligro Alto) 🔴
  - 0.2 - 0.5: Vegetación dispersa (Peligro Medio) 🟠
  - 0.5 - 1.0: Vegetación densa y sana (Peligro Bajo) 🟢

---

## 🔑 Configuración de API Keys

### Paso 1: Copiar archivo .env

```bash
cp .env.example .env
```

### Paso 2: Obtener API Keys

#### Mapbox GL JS
1. Ve a [https://account.mapbox.com/](https://account.mapbox.com/)
2. Regístrate o inicia sesión
3. Ve a "Account" → "Tokens"
4. Crea un nuevo token o usa el token público por defecto
5. Copia el token (empieza con `pk.`)

**Plan Gratuito Mapbox:**
- 50,000 cargas de mapa/mes
- 100,000 solicitudes de API/mes
- Suficiente para desarrollo y uso moderado

#### Copernicus Sentinel Hub (para NDVI)
1. Ve a [https://dataspace.copernicus.eu/](https://dataspace.copernicus.eu/)
2. Regístrate y crea una aplicación
3. Obtén tu **Client ID** y **Client Secret**

### Paso 3: Configurar .env

```env
# Mapbox GL JS
VITE_MAPBOX_ACCESS_TOKEN=pk.eyJ1IjoiZXhhbXBsZSIsImEiOiJjaz...

# Copernicus Sentinel Hub
VITE_COPERNICUS_CLIENT_ID=tu_client_id_aqui
VITE_COPERNICUS_CLIENT_SECRET=tu_client_secret_aqui
```

### Paso 4: Reiniciar servidor

```bash
npm run dev
```

---

## 🎨 Características del Mapa 3D

### Terreno 3D
- **Exageración del relieve**: 1.5x (configurable)
- **Inclinación inicial**: 60°
- **Rotación inicial**: -17.6°
- **Zoom inicial**: 11

### Capa de Hillshade
- **Exageración**: 0.5
- **Color de sombra**: Negro
- **Color de highlight**: Blanco
- **Color de acento**: Gris

### Marcadores Interactivos

#### Incendios
- 🔴 **Crítico**: Rojo con animación de pulso
- 🟠 **Alto**: Naranja
- 🟡 **Medio**: Amarillo
- 🟢 **Bajo**: Verde

**Popup muestra**:
- Nombre del incendio
- Ubicación
- Hectáreas afectadas
- Porcentaje de control
- Severidad

#### Nodos Veraces
- 🟢 **Online**: Verde con animación de pulso
- 🟡 **Warning**: Amarillo
- 🔴 **Offline**: No se muestra

**Popup muestra**:
- Nombre del nodo
- Tipo (estación meteorológica, sensor, cámara, drone, etc.)
- Estado
- Coordenadas GPS

### Controles
- **Navegación**: Zoom, rotación, inclinación
- **Pantalla completa**: Botón en esquina superior derecha
- **Escala**: Barra de escala en esquina inferior izquierda
- **Alternar 3D/2D**: Botón en esquina superior izquierda

---

## 🌿 Widget de Vegetación (NDVI)

### ¿Qué es el NDVI?

El **Índice de Vegetación de Diferencia Normalizada** (NDVI) es un indicador cuantitativo de la salud y densidad de la vegetación, calculado a partir de imágenes satelitales.

**Fórmula:**
```
NDVI = (NIR - Red) / (NIR + Red)
```

Donde:
- **NIR** (Banda B08): Near Infrared - refleja fuertemente en vegetación sana
- **Red** (Banda B04): Red - es absorbida por la clorofila

### Rangos de NDVI

| Valor | Significado | Color | Riesgo |
|-------|-------------|-------|--------|
| -1.0 a 0.0 | Agua, nieve, nubes, suelo desnudo | - | - |
| 0.0 a 0.2 | Zona árida, suelo desnudo, quemada | 🔴 Rojo | Alto |
| 0.2 a 0.4 | Vegetación dispersa, arbustos | 🟠 Naranja | Medio |
| 0.4 a 0.6 | Vegetación moderada | 🟡 Amarillo | Bajo |
| 0.6 a 0.8 | Vegetación densa | 🟢 Verde claro | Muy Bajo |
| 0.8 a 1.0 | Bosque muy denso, selva | 🟢 Verde oscuro | Mínimo |

### Datos Mostrados

- **Valor NDVI promedio**: Número de 0 a 1
- **Barra de progreso**: Visualización gráfica del valor
- **Estado**: Clasificación automática (Árida/Dispersa/Densa)
- **Descripción**: Explicación del estado
- **Rango**: Valores mínimo y máximo del área
- **Cobertura**: Porcentaje de píxeles válidos
- **Fecha de actualización**: Timestamp de los datos

### Actualización

- **Automática**: Cada 10 minutos
- **Manual**: Botón de actualización en el widget
- **Fuente**: Sentinel-2 L2A (Copernicus)

---

## 🛡️ Manejo de Errores Robusto

### Mapa 3D

**Fallback automático:**
- Si el token no está configurado → Mensaje claro
- Si la carga falla → Mapa 2D de respaldo
- Si hay errores de red → Mensaje de error con botón "Reintentar"

**Error Boundary:**
- Aísla fallos del mapa del resto de la aplicación
- Muestra mensaje de error específico
- No afecta a otros componentes

### Widget NDVI

**Estados manejados:**
- 🔄 **Cargando**: Spinner animado
- ❌ **Error**: Mensaje claro + botón "Reintentar"
- ✅ **Éxito**: Datos formateados con clasificación

**Bloque finally:**
```typescript
try {
  setIsLoading(true);
  // Llamada a API
} catch (err) {
  setError(errorMessage);
} finally {
  // SIEMPRE se ejecuta
  setIsLoading(false);
}
```

✅ **Nunca se queda cargando infinitamente**

---

## 📊 Comparativa de Tecnologías

| Característica | Mapa 2D (SVG) | Mapa 3D (Mapbox) |
|----------------|---------------|------------------|
| **Peso** | ~50KB | ~2MB |
| **Terreno** | No | Sí (3D real) |
| **Hillshade** | No | Sí |
| **Satelital** | No | Sí (alta resolución) |
| **Interactividad** | Básica | Avanzada |
| **Offline** | Sí | No (requiere token) |
| **Coste** | Gratis | Freemium (50K mapas/mes) |
| **Rendimiento** | Excelente | Bueno |

---

## 🔧 Arquitectura Técnica

### Mapa 3D

**Componente**: `MapboxMap.tsx`
- Inicialización de Mapbox GL JS
- Configuración de terreno 3D
- Capa de hillshade
- Marcadores dinámicos
- Popups interactivos
- Fallback a 2D

**Proxies de Vite**: No necesarios (Mapbox maneja CORS internamente)

### Widget NDVI

**Servicio**: `copernicusService.ts`
- Función `getNDVI(lat, lon, radiusKm)`
- Función `getLasHurdesNDVI()`
- Autenticación OAuth2 con cache de tokens
- Cálculo de NDVI con evalscript personalizado

**Componente**: `VegetationWidget.tsx`
- Visualización del valor NDVI
- Barra de progreso con código de colores
- Clasificación automática
- Estadísticas detalladas
- Botón de actualización

---

## 🐛 Solución de Problemas

### Mapa 3D no carga

**Error**: "Token de Mapbox no configurado"

**Solución**:
```bash
# Verificar .env
cat .env | grep MAPBOX

# Editar si es necesario
nano .env
# Añadir: VITE_MAPBOX_ACCESS_TOKEN=pk.eyJ1IjoiZXhhbXBsZSIsImEiOiJjaz...

# Reiniciar servidor
npm run dev
```

### Mapa 3D muestra error de carga

**Error**: "Error al cargar el mapa 3D"

**Causas posibles**:
1. Token inválido o expirado
2. Límite de peticiones alcanzado
3. Problemas de conexión

**Solución**:
1. Verifica tu token en [https://account.mapbox.com/](https://account.mapbox.com/)
2. Revisa el uso de tu cuenta
3. El fallback 2D se activará automáticamente

### Widget NDVI muestra error

**Error**: "Error al obtener datos de NDVI"

**Causas posibles**:
1. Credenciales de Copernicus no configuradas
2. Cobertura de nubes en la zona
3. No hay imágenes recientes disponibles

**Solución**:
1. Verifica las credenciales de Copernicus en `.env`
2. Espera a que haya imágenes más recientes
3. Usa el botón "Reintentar"

### Bundle muy grande

**Warning**: "Some chunks are larger than 500 kB"

**Causa**: Mapbox GL JS es una librería pesada (~2MB)

**Soluciones**:
1. **Code splitting**: Cargar Mapbox solo cuando sea necesario
2. **Lazy loading**: Importar dinámicamente el componente
3. **Aumentar límite**: Modificar `build.chunkSizeWarningLimit` en vite.config.ts

**Ejemplo de lazy loading**:
```typescript
const MapboxMap = lazy(() => import('./components/MapboxMap'));
```

---

## 📚 Documentación Adicional

- **Mapbox GL JS**: https://docs.mapbox.com/mapbox-gl-js/api/
- **Sentinel Hub**: https://docs.sentinel-hub.com/api/latest/
- **NDVI**: https://en.wikipedia.org/wiki/Normalized_difference_vegetation_index
- **GUIA_COPERNICUS.md**: Guía detallada de Copernicus
- **GUIA_NASA_FIRMS.md**: Guía detallada de NASA FIRMS

---

## ✅ Checklist de Verificación

### Configuración
- [ ] Token de Mapbox obtenido y configurado en `.env`
- [ ] Credenciales de Copernicus configuradas en `.env`
- [ ] Servidor reiniciado después de configurar `.env`

### Mapa 3D
- [ ] Mapa 3D carga correctamente
- [ ] Terreno 3D visible con relieve
- [ ] Hillshade visible
- [ ] Marcadores de incendios aparecen
- [ ] Marcadores de nodos aparecen
- [ ] Popups funcionan al hacer click
- [ ] Botón 3D/2D funciona
- [ ] Fallback 2D funciona si falla el 3D

### Widget NDVI
- [ ] Widget carga correctamente
- [ ] Valor NDVI se muestra
- [ ] Barra de progreso funciona
- [ ] Clasificación automática correcta
- [ ] Botón de actualización funciona
- [ ] Estadísticas se muestran
- [ ] No hay errores en la consola (F12)

---

## 🚀 Próximos Pasos

Con la visualización geoespacial avanzada funcionando, puedes:

1. **Optimizar el bundle**
   - Implementar code splitting para Mapbox
   - Lazy loading de componentes pesados
   - Tree shaking de dependencias no usadas

2. **Añadir más capas**
   - Capa de viento en tiempo real
   - Capa de temperatura
   - Capa de humedad del suelo
   - Capa de riesgo de incendio

3. **Análisis avanzado**
   - Comparación temporal de NDVI
   - Detección de cambios en vegetación
   - Predicción de propagación de incendios
   - Análisis de impacto ambiental

4. **Interactividad**
   - Herramientas de medición
   - Dibujo de áreas de interés
   - Exportación de datos
   - Generación de reportes

5. **Más satélites**
   - Sentinel-1 (SAR) para todo clima
   - Landsat para mayor resolución temporal
   - MODIS para mayor frecuencia

---

**¡Sistema completo!** La visualización geoespacial avanzada está completamente integrada y operativa con mapa 3D del terreno y widget de índice de vegetación NDVI.
