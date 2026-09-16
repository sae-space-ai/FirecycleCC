# 🛰️ NASA FIRMS - Guía de Integración

## ✅ Estado Actual

La API de **NASA FIRMS** (Fire Information for Resource Management System) está integrada y funcionando con manejo robusto de errores.

### Características implementadas:
- ✅ Detección de focos de incendio en tiempo real
- ✅ Monitoreo de Las Hurdes (40.35°N, -6.30°E) con radio de 50km
- ✅ Actualización automática cada 5 minutos
- ✅ Manejo de estados de carga con animaciones
- ✅ Manejo de errores con mensajes visibles
- ✅ Bloques `finally` que SIEMPRE apagan `isLoading`
- ✅ Error Boundaries para aislamiento de fallos
- ✅ Parseo de datos CSV de NASA FIRMS
- ✅ Uso de satélite VIIRS SNPP (alta resolución)

---

## 🔑 Paso 1: Obtener API Key de NASA FIRMS

### 1.1 Registrarse en NASA FIRMS

1. Ve a [https://firms.modaps.eosdis.nasa.gov/](https://firms.modaps.eosdis.nasa.gov/)
2. Haz clic en "Request an API Key" o "Register"
3. Completa el formulario de registro
4. Verifica tu email
5. Accede a tu panel de control

### 1.2 Obtener tu MAP_KEY

1. Inicia sesión en [https://firms.modaps.eosdis.nasa.gov/api/](https://firms.modaps.eosdis.nasa.gov/api/)
2. Busca tu **MAP_KEY** (es una cadena alfanumérica)
3. Cópiala (algo como: `a1b2c3d4e5f6g7h8i9j0`)

**IMPORTANTE:** La MAP_KEY es diferente a las API keys de APILayer.

---

## 🔧 Paso 2: Configurar Variable de Entorno

### 2.1 Editar archivo .env

Abre tu archivo `.env` y añade:

```env
VITE_NASA_FIRMS_MAP_KEY=tu_map_key_de_nasa_firms_aqui
```

### 2.2 Ejemplo completo de .env

```env
# APILayer API Keys
VITE_IPSTACK_API_KEY=tu_ipstack_key_aqui
VITE_WEATHERSTACK_API_KEY=tu_weatherstack_key_aqui

# NASA FIRMS API Key
VITE_NASA_FIRMS_MAP_KEY=a1b2c3d4e5f6g7h8i9j0
```

---

## 🔄 Paso 3: Reiniciar el Servidor

Después de configurar la API key:

```bash
# Detener el servidor (Ctrl+C)
# Luego ejecutar:
npm run dev
```

---

## 🧪 Paso 4: Probar el Widget

### Qué verás:

1. **Widget de Alertas de Incendio** (debajo de los widgets de ubicación y clima)

2. **Si hay focos detectados:**
   - Lista de focos con información detallada
   - Fecha y hora de detección
   - Nivel de confianza (Alta/Normal/Baja)
   - Temperatura de brillo (en Kelvin)
   - FRP (Fire Radiative Power en MW)
   - Coordenadas GPS
   - Satélite e instrumento usado

3. **Si NO hay focos detectados:**
   - Mensaje verde: "Zona Segura"
   - "Sin focos activos detectados en Las Hurdes"
   - Última actualización

4. **Si hay error:**
   - Mensaje claro del error
   - Botón "Reintentar"

---

## 📊 Información Técnica

### Área de Monitoreo

- **Centro:** Las Hurdes (40.35°N, -6.30°E)
- **Radio:** 50 km
- **Bounding Box:** Aproximadamente 100km x 100km

### Satélite Usado

- **VIIRS SNPP NRT** (Visible Infrared Imaging Radiometer Suite)
- Resolución espacial: 375m
- Actualización: Casi en tiempo real (NRT = Near Real-Time)

### Actualización Automática

- El widget se actualiza automáticamente cada **5 minutos**
- Muestra la hora de la última actualización

### Datos Mostrados

| Campo | Descripción |
|-------|-------------|
| **Fecha** | Fecha de detección (YYYY-MM-DD) |
| **Hora** | Hora de adquisición (HH:MM) |
| **Confianza** | Nivel de confianza de la detección |
| **Brillo** | Temperatura de brillo en Kelvin |
| **FRP** | Fire Radiative Power en Megavatios |
| **Coordenadas** | Latitud y longitud del foco |
| **Satélite** | Satélite que detectó el foco |
| **Instrumento** | Instrumento usado para la detección |

---

## 🐛 Solución de Problemas

### Error: "API key de NASA FIRMS no configurada"

**Causa:** La variable `VITE_NASA_FIRMS_MAP_KEY` no está en el archivo `.env`

**Solución:**
```bash
# Verificar que .env existe
ls -la .env

# Editar y añadir la key
nano .env
# Añadir: VITE_NASA_FIRMS_MAP_KEY=tu_key_aqui

# Reiniciar servidor
npm run dev
```

### Error: "API key de NASA FIRMS inválida"

**Causa:** La MAP_KEY es incorrecta o ha expirado

**Solución:**
1. Ve a [https://firms.modaps.eosdis.nasa.gov/api/](https://firms.modaps.eosdis.nasa.gov/api/)
2. Verifica tu MAP_KEY
3. Si es necesario, solicita una nueva

### Error: "TIMEOUT_ERROR"

**Causa:** NASA FIRMS está lento o hay problemas de conexión

**Solución:**
- Espera unos minutos e intenta de nuevo
- El timeout está configurado a 15 segundos
- Verifica tu conexión a internet

### Error: "No se recibieron datos de NASA FIRMS"

**Causa:** La API respondió pero sin datos (puede ser normal si no hay incendios)

**Solución:**
- Si ves "Zona Segura", todo está funcionando correctamente
- Si hay error, revisa la consola del navegador (F12)

### El widget se queda cargando infinitamente

**Causa:** Muy raro, pero posible si hay un problema con el bloque `finally`

**Solución:**
1. Abre la consola del navegador (F12)
2. Busca errores en la pestaña "Console"
3. Comparte los errores para diagnóstico

---

## 📝 Notas Importantes

### Limitaciones del Plan Gratuito

- **Sin límite de peticiones** (NASA FIRMS es gratuito para uso no comercial)
- **Datos casi en tiempo real** (retraso de ~3 horas desde la detección)
- **Cobertura global** (todo el planeta)

### Diferencia entre Confianzas

- **Alta (high):** Detección muy probable de incendio
- **Normal (nominal):** Detección probable, pero con menor certeza
- **Baja (low):** Posible falso positivo, verificar visualmente

### FRP (Fire Radiative Power)

- Mide la potencia radiante del fuego en Megavatios (MW)
- Valores más altos = incendios más intensos
- Típico: 10-100 MW para incendios forestales
- Extremo: >500 MW para incendios muy grandes

### Day/Night Flag

- **D:** Detección diurna (más precisa)
- **N:** Detección nocturna (menos precisa)

---

## 🔗 Enlaces Útiles

- **NASA FIRMS Main:** https://firms.modaps.eosdis.nasa.gov/
- **API Documentation:** https://firms.modasp.eosdis.nasa.gov/api/
- **Map Viewer:** https://firms.modaps.eosdis.nasa.gov/map/
- **Register for API Key:** https://firms.modaps.eosdis.nasa.gov/api/key/

---

## ✅ Checklist de Verificación

- [ ] API key de NASA FIRMS obtenida
- [ ] Variable `VITE_NASA_FIRMS_MAP_KEY` añadida a `.env`
- [ ] Servidor reiniciado después de configurar `.env`
- [ ] Widget de alertas de incendio muestra datos o "Zona Segura"
- [ ] No hay errores en la consola del navegador (F12)
- [ ] El widget se actualiza automáticamente cada 5 minutos

---

## 🚀 Próximos Pasos

Una vez que NASA FIRMS funcione correctamente, puedes:

1. **Ajustar el área de monitoreo** (modificar coordenadas o radio en `nasaService.ts`)
2. **Añadir más satélites** (MODIS, VIIRS NOAA-20)
3. **Integrar en el mapa** (mostrar marcadores de incendios en el mapa SVG)
4. **Añadir notificaciones** (alertas sonoras o visuales cuando se detecten incendios)
5. **Historial de incendios** (mostrar datos de los últimos 7 días)

---

**¿Todo funciona?** ¡Perfecto! El sistema de detección de incendios de NASA FIRMS está completamente integrado y operativo.
