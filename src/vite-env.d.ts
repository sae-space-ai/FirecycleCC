/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_IPSTACK_API_KEY: string
  readonly VITE_POSITIONSTACK_API_KEY: string
  readonly VITE_WEATHERSTACK_API_KEY: string
  readonly VITE_AVIATIONSTACK_API_KEY: string
  readonly VITE_MEDIASTACK_API_KEY: string
  readonly VITE_COUNTRYLAYER_API_KEY: string
  readonly VITE_NASA_FIRMS_MAP_KEY: string
  readonly VITE_COPERNICUS_CLIENT_ID: string
  readonly VITE_COPERNICUS_CLIENT_SECRET: string
  readonly VITE_MAPBOX_ACCESS_TOKEN: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
