# 🚀 Integración de APIs de APILayer - Guía de Configuración

## ✅ Estado Actual

Las APIs de **IPStack** y **WeatherStack** están integradas y funcionando con manejo robusto de errores.

### Características implementadas:
- ✅ Proxy de Vite configurado para evitar errores CORS
- ✅ Servicio centralizado con manejo de timeouts (10s)
- ✅ Estados de carga con animaciones
- ✅ Manejo de errores con mensajes visibles
- ✅ Bloques `finally` que SIEMPRE apagan `isLoading`
- ✅ Error Boundaries para aislamiento de fallos

---

## 🔑 Paso 1: Configurar API Keys

### 1.1 Crear archivo .env

Copia el archivo `.env.example` a `.env`:

```bash
cp .env.example .env
```

### 1.2 Obtener tus API Keys

Ve a [https://apilayer.com/](https://apilayer.com/) y obtén tus keys:

1. **IPStack** (Geolocalización por IP)
   - Plan gratuito: 100 peticiones/mes
   - URL: https://ipstack.com/

2. **WeatherStack** (Datos meteorológicos)
   - Plan gratuito: 100 peticiones/mes
   - URL: https://weatherstack.com/

### 1.3 Editar .env

Abre el archivo `.env` y reemplaza las keys:

```env
VITE_IPSTACK_API_KEY=tu_ipstack_key_real_aqui
VITE_WEATHERSTACK_API_KEY=tu_weatherstack_key_real_aqui
```

**IMPORTANTE:** Las variables deben empezar con `VITE_` para que Vite las exponga al frontend.

---

## 🔄 Paso 2: Reiniciar el Servidor

Después de configurar las API keys, reinicia el servidor:

```bash
# Detener el servidor (Ctrl+C)
# Luego ejecutar:
npm run dev
```

---

## 🧪 Paso 3: Probar los Widgets

### Widget de Ubicación (IPStack)

1. Abre la aplicación en tu navegador
2. Deberías ver el widget **"Ubicación Actual"** en la parte superior
3. Verás:
   - Ciudad, región y país
   - Coordenadas GPS
   - Dirección IP
   - Bandera del país

### Widget de Clima (WeatherStack)

1. Debajo del widget de ubicación, verás **"Clima Actual"**
2. Muestra:
   - Temperatura actual
   - Descripción del clima
   - Humedad, viento, presión
   - Índice UV
   - Icono meteorológico

---

## 🐛 Solución de Problemas

### Error: "API key no configurada"

**Causa:** El archivo `.env` no existe o las keys están vacías.

**Solución:**
```bash
# Verificar que .env existe
ls -la .env

# Si no existe, crearlo
cp .env.example .env

# Editar y agregar tus keys
nano .env
```

### Error: "Error de red" o "TIMEOUT_ERROR"

**Causa:** Problema de conexión o el proxy no está funcionando.

**Solución:**
1. Verifica que el servidor de desarrollo esté corriendo
2. Revisa la consola del navegador (F12) para ver errores detallados
3. Verifica que las API keys sean válidas

### Error: "401 Unauthorized"

**Causa:** API key inválida o plan gratuito agotado.

**Solución:**
1. Ve a tu panel de APILayer
2. Verifica que tu plan esté activo
3. Genera una nueva API key si es necesario

### Los widgets se quedan cargando infinitamente

**Causa:** El bloque `finally` no se está ejecutando (muy raro).

**Solución:**
1. Abre la consola del navegador (F12)
2. Busca errores en la pestaña "Console"
3. Comparte los errores para diagnóstico

---

## 📊 Próximos Pasos (Paso 4)

Una vez que IPStack y WeatherStack funcionen correctamente, integraremos:

1. **PositionStack** - Geocoding (direcciones a coordenadas)
2. **AviationStack** - Datos de vuelos
3. **MediaStack** - Noticias en tiempo real
4. **CountryLayer** - Información de países

---

## 🔧 Arquitectura Técnica

### Proxy de Vite

El archivo `vite.config.ts` configura proxies para evitar CORS:

```typescript
'/api/ipstack': {
  target: 'http://api.ipstack.com',
  changeOrigin: true,
  rewrite: (path) => path.replace(/^\/api\/ipstack/, '')
}
```

Esto permite que las peticiones del frontend a `/api/ipstack/check` se redirijan a `http://api.ipstack.com/check`.

### Servicio Centralizado

`src/services/apiLayerService.ts` proporciona:
- Funciones tipadas para cada API
- Manejo de timeouts (10 segundos)
- Manejo centralizado de errores
- Retornos consistentes con `{ success, data, error }`

### Componentes con Estados

Cada widget tiene 3 estados:
1. **isLoading = true** → Muestra skeleton animado
2. **error != null** → Muestra mensaje de error con botón "Reintentar"
3. **data != null** → Muestra datos formateados

---

## 📝 Notas Importantes

1. **Plan Gratuito Limitado:** Las APIs gratuitas tienen límite de 100 peticiones/mes
2. **HTTPS Requerido:** WeatherStack requiere HTTPS en producción
3. **CORS Resuelto:** El proxy de Vite evita problemas de CORS en desarrollo
4. **Error Boundaries:** Si un widget falla, no afecta al resto de la aplicación

---

## ✅ Checklist de Verificación

- [ ] Archivo `.env` creado con API keys válidas
- [ ] Servidor reiniciado después de configurar `.env`
- [ ] Widget de ubicación muestra datos correctamente
- [ ] Widget de clima muestra datos correctamente
- [ ] No hay errores en la consola del navegador (F12)
- [ ] Los estados de carga desaparecen correctamente
- [ ] Los errores muestran mensajes claros (si las APIs fallan)

---

**¿Todo funciona?** ¡Perfecto! Ahora podemos integrar las otras 4 APIs en el Paso 4.
