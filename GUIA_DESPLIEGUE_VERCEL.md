# 🚀 Guía de Despliegue en Vercel

## ✅ Preparación del Proyecto

### 1. Archivos Configurados

- ✅ `.gitignore` - Excluye `.env` y archivos sensibles
- ✅ `vercel.json` - Configuración de rutas y variables de entorno
- ✅ Funciones serverless en `api/` - Proxy para APIs externas
- ✅ `src/utils/apiUrls.ts` - URLs adaptativas para desarrollo/producción

### 2. Estructura de Archivos

```
firecycle-command-center/
├── api/                          # Funciones serverless
│   ├── apilayer/
│   │   └── [...path].ts         # Proxy para APILayer
│   ├── nasa-firms/
│   │   └── [...path].ts         # Proxy para NASA FIRMS
│   └── copernicus/
│       ├── oauth/
│       │   └── token.ts         # OAuth para Copernicus
│       └── [...path].ts         # Proxy para Copernicus
├── src/
│   ├── services/                 # Servicios de API
│   │   ├── apiLayerService.ts
│   │   ├── nasaService.ts
│   │   └── copernicusService.ts
│   └── utils/
│       └── apiUrls.ts           # URLs adaptativas
├── .env                          # Variables locales (NO subir)
├── .env.example                  # Plantilla de variables
├── vercel.json                   # Configuración de Vercel
└── package.json
```

---

## 🔑 Configuración de Variables de Entorno

### Opción 1: Usando Vercel CLI (Recomendado)

1. **Instalar Vercel CLI** (si no lo tienes):
   ```bash
   npm install -g vercel
   ```

2. **Iniciar sesión en Vercel**:
   ```bash
   vercel login
   ```

3. **Añadir variables de entorno**:
   ```bash
   # APILayer
   vercel env add VITE_IPSTACK_API_KEY
   vercel env add VITE_POSITIONSTACK_API_KEY
   vercel env add VITE_WEATHERSTACK_API_KEY
   vercel env add VITE_AVIATIONSTACK_API_KEY
   vercel env add VITE_MEDIASTACK_API_KEY
   vercel env add VITE_COUNTRYLAYER_API_KEY
   
   # NASA FIRMS
   vercel env add VITE_NASA_FIRMS_MAP_KEY
   
   # Copernicus
   vercel env add VITE_COPERNICUS_CLIENT_ID
   vercel env add VITE_COPERNICUS_CLIENT_SECRET
   
   # Mapbox
   vercel env add VITE_MAPBOX_ACCESS_TOKEN
   ```

4. **Seleccionar entorno** (development, preview, production) para cada variable

### Opción 2: Usando el Dashboard de Vercel

1. Ve a [vercel.com](https://vercel.com)
2. Selecciona tu proyecto
3. Ve a **Settings** → **Environment Variables**
4. Añade cada variable:
   - **VITE_IPSTACK_API_KEY**
   - **VITE_POSITIONSTACK_API_KEY**
   - **VITE_WEATHERSTACK_API_KEY**
   - **VITE_AVIATIONSTACK_API_KEY**
   - **VITE_MEDIASTACK_API_KEY**
   - **VITE_COUNTRYLAYER_API_KEY**
   - **VITE_NASA_FIRMS_MAP_KEY**
   - **VITE_COPERNICUS_CLIENT_ID**
   - **VITE_COPERNICUS_CLIENT_SECRET**
   - **VITE_MAPBOX_ACCESS_TOKEN**

---

## 🚀 Despliegue

### Despliegue de Prueba (Preview)

```bash
# Desplegar a preview
vercel

# Sigue las instrucciones interactivas
```

### Despliegue a Producción

```bash
# Desplegar a producción
vercel --prod
```

### Despliegue Automático desde GitHub

1. **Conectar repositorio**:
   - Ve a [vercel.com/new](https://vercel.com/new)
   - Importa tu repositorio de GitHub
   - Vercel detectará automáticamente la configuración

2. **Configurar variables**:
   - Añade todas las variables de entorno en el dashboard
   - Selecciona los entornos (Production, Preview, Development)

3. **Desplegar**:
   - Cada push a `main` desplegará automáticamente a producción
   - Cada PR creará un despliegue de preview

---

## 🔧 Configuración de vercel.json

### Rutas de API

```json
{
  "routes": [
    {
      "src": "/api/apilayer/(.*)",
      "dest": "/api/apilayer/$1"
    },
    {
      "src": "/api/nasa-firms/(.*)",
      "dest": "/api/nasa-firms/$1"
    },
    {
      "src": "/api/copernicus/(.*)",
      "dest": "/api/copernicus/$1"
    },
    {
      "src": "/(.*)",
      "dest": "/index.html"
    }
  ]
}
```

### Funciones Serverless

Las funciones en `api/` actúan como proxy para evitar problemas de CORS:

- **`api/apilayer/[...path].ts`** - Proxy para todas las APIs de APILayer
- **`api/nasa-firms/[...path].ts`** - Proxy para NASA FIRMS
- **`api/copernicus/oauth/token.ts`** - OAuth para Copernicus
- **`api/copernicus/[...path].ts`** - Proxy para Copernicus

### Variables de Entorno

```json
{
  "env": {
    "VITE_IPSTACK_API_KEY": "@ipstack-api-key",
    "VITE_WEATHERSTACK_API_KEY": "@weatherstack-api-key",
    ...
  }
}
```

**Nota**: Los `@` indican que son secrets de Vercel. Debes crearlos en el dashboard o con CLI.

---

## 🧪 Pruebas Locales

### Simular Producción Localmente

```bash
# Instalar Vercel CLI
npm install -g vercel

# Ejecutar localmente con funciones serverless
vercel dev
```

Esto simulará el entorno de producción, incluyendo las funciones serverless.

### Verificar Funciones Serverless

```bash
# Probar función de APILayer
curl http://localhost:3000/api/apilayer/ipstack/check?access_key=TU_KEY

# Probar función de NASA FIRMS
curl http://localhost:3000/api/nasa-firms/area/csv/TU_KEY/VIIRS_SNPP_NRT/...

# Probar función de Copernicus
curl -X POST http://localhost:3000/api/copernicus/oauth/token \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "grant_type=client_credentials&client_id=ID&client_secret=SECRET"
```

---

## 🐛 Solución de Problemas

### Error: "API key not configured"

**Causa**: Las variables de entorno no están configuradas en Vercel

**Solución**:
1. Ve al dashboard de Vercel
2. Settings → Environment Variables
3. Añade todas las variables necesarias
4. Redeploy: `vercel --prod`

### Error: "CORS policy"

**Causa**: Las funciones serverless no están funcionando correctamente

**Solución**:
1. Verifica que `vercel.json` está configurado correctamente
2. Verifica que las funciones en `api/` existen
3. Revisa los logs en Vercel: `vercel logs`

### Error: "404 Not Found" en rutas de API

**Causa**: Las rutas no están configuradas correctamente

**Solución**:
1. Verifica `vercel.json`
2. Asegúrate de que las funciones están en las rutas correctas
3. Redeploy después de cambios

### Error: "Function execution timeout"

**Causa**: Las funciones serverless tardan demasiado

**Solución**:
1. Aumenta el timeout en `vercel.json`:
   ```json
   {
     "functions": {
       "api/**/*.ts": {
         "maxDuration": 30
       }
     }
   }
   ```

### Error: "Bundle too large"

**Causa**: El bundle es demasiado grande (Mapbox GL JS)

**Solución**:
1. Implementa code splitting
2. Usa lazy loading para Mapbox
3. Aumenta el límite en `vercel.json`:
   ```json
   {
     "build": {
       "env": {
         "CHUNK_SIZE_WARNING_LIMIT": "2000"
       }
     }
   }
   ```

---

## 📊 Monitoreo y Logs

### Ver Logs en Tiempo Real

```bash
# Logs de producción
vercel logs --prod

# Logs de un despliegue específico
vercel logs <deployment-url>
```

### Métricas

Ve al dashboard de Vercel para ver:
- Uso de funciones serverless
- Tiempos de respuesta
- Errores
- Ancho de banda

---

## 🔒 Seguridad

### Mejores Prácticas

1. **Nunca subas `.env` al repositorio**
   - Ya está en `.gitignore` ✅

2. **Usa secrets de Vercel**
   - Las API keys deben estar en Environment Variables
   - No las hardcodees en el código

3. **Limita el uso de funciones serverless**
   - Implementa rate limiting si es necesario
   - Monitorea el uso para evitar costos inesperados

4. **Valida las peticiones**
   - Las funciones serverless ya validan métodos HTTP
   - Considera añadir validación adicional si es necesario

---

## 📝 Checklist de Despliegue

### Antes de Desplegar

- [ ] Todas las variables de entorno están en `.env.example`
- [ ] `.env` está en `.gitignore`
- [ ] `vercel.json` está configurado correctamente
- [ ] Las funciones serverless están en `api/`
- [ ] El proyecto compila sin errores: `npm run build`
- [ ] Las pruebas locales funcionan: `vercel dev`

### Durante el Despliegue

- [ ] Variables de entorno configuradas en Vercel
- [ ] Despliegue de prueba exitoso: `vercel`
- [ ] Todas las APIs funcionan correctamente
- [ ] No hay errores en los logs

### Después del Despliegue

- [ ] Despliegue a producción: `vercel --prod`
- [ ] Verificar que todo funciona en producción
- [ ] Configurar dominio personalizado (opcional)
- [ ] Configurar monitoreo y alertas

---

## 🎯 Comandos Útiles

```bash
# Desplegar a preview
vercel

# Desplegar a producción
vercel --prod

# Ver logs
vercel logs

# Listar despliegues
vercel ls

# Eliminar despliegue
vercel rm <deployment-url>

# Inspeccionar despliegue
vercel inspect

# Pull configuración de producción
vercel env pull
```

---

## 📚 Recursos Adicionales

- **Vercel Documentation**: https://vercel.com/docs
- **Serverless Functions**: https://vercel.com/docs/functions
- **Environment Variables**: https://vercel.com/docs/environment-variables
- **CLI Reference**: https://vercel.com/docs/cli

---

**¡Listo para desplegar!** El proyecto está completamente configurado para Vercel con funciones serverless que actúan como proxy para todas las APIs externas.
