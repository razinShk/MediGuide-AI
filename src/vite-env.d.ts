/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly replicate_api_key?: string;
  readonly VITE_REPLICATE_API_KEY?: string;
  readonly VITE_FIREWORKS_API_KEY?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
