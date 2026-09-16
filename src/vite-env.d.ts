/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_IPSTACK_API_KEY: string
  readonly VITE_POSITIONSTACK_API_KEY: string
  readonly VITE_WEATHERSTACK_API_KEY: string
  readonly VITE_AVIATIONSTACK_API_KEY: string
  readonly VITE_MEDIASTACK_API_KEY: string
  readonly VITE_COUNTRYLAYER_API_KEY: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
