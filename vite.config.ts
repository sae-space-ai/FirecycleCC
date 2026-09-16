import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api/ipstack': {
        target: 'http://api.ipstack.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/ipstack/, '')
      },
      '/api/positionstack': {
        target: 'http://api.positionstack.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/positionstack/, '')
      },
      '/api/weatherstack': {
        target: 'http://api.weatherstack.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/weatherstack/, '')
      },
      '/api/aviationstack': {
        target: 'https://api.aviationstack.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/aviationstack/, '')
      },
      '/api/mediastack': {
        target: 'https://api.mediastack.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/mediastack/, '')
      },
      '/api/countrylayer': {
        target: 'https://api.countrylayer.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/countrylayer/, '')
      },
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
    }
  }
})
