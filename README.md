# Firecycle Command Center

Dashboard de gestión de incendios forestales en tiempo real con todos los nodos interconectados.

## 🚀 Deploy en Vercel (Recomendado)

### Opción 1: Deploy desde GitHub (Automático)

1. **Sube el proyecto a GitHub:**
   ```bash
   git init
   git add .
   git commit -m "Initial commit - Firecycle Command Center"
   git branch -M main
   git remote add origin https://github.com/TU_USUARIO/firecycle-command-center.git
   git push -u origin main
   ```

2. **Conecta con Vercel:**
   - Ve a [vercel.com](https://vercel.com)
   - Click en "Add New Project"
   - Selecciona tu repositorio de GitHub
   - Vercel detectará automáticamente que es Vite
   - Click en "Deploy"
   - ¡Listo! Tendrás tu URL pública en ~2 minutos

### Opción 2: Deploy con Vercel CLI

```bash
# Instala Vercel CLI
npm install -g vercel

# Deploy
vercel

# Deploy a producción
vercel --prod
```

## 🌐 Deploy en Netlify

### Opción 1: Deploy desde GitHub

1. Sube el proyecto a GitHub (ver pasos arriba)
2. Ve a [netlify.com](https://netlify.com)
3. Click en "Add new site" → "Import an existing project"
4. Selecciona GitHub y tu repositorio
5. Configura:
   - Build command: `npm run build`
   - Publish directory: `dist`
6. Click en "Deploy site"

### Opción 2: Deploy manual con Netlify CLI

```bash
# Instala Netlify CLI
npm install -g netlify-cli

# Build
npm run build

# Deploy
netlify deploy --prod --dir=dist
```

## 🛠️ Desarrollo Local

```bash
# Instalar dependencias
npm install

# Servidor de desarrollo
npm run dev

# Build para producción
npm run build
```

## 📋 Características

- ✅ Dashboard interactivo con mapa SVG
- ✅ Estado global con Context API
- ✅ Filtros conectados entre componentes
- ✅ Sistema de notificaciones
- ✅ Analytics y estadísticas
- ✅ Diseño responsive
- ✅ Tema oscuro profesional

## 🔧 Tecnologías

- React 18
- TypeScript
- Vite
- Tailwind CSS 4
- Context API para estado global
