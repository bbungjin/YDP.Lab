/// <reference types="vite/client" />
interface ImportMetaEnv {
  readonly VITE_API_BASE_URL?: string
  readonly VITE_API_PROXY_TARGET?: string
  readonly VITE_USE_MOCK?: 'true' | 'false'
}
interface ImportMeta {
  readonly env: ImportMetaEnv & { DEV?: boolean }
}
