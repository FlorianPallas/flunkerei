/// <reference types="svelte" />
/// <reference types="vite/client" />

interface Window {
  readonly APP_BASE_URL: string;
  readonly APP_API_BASE_URL: string;
  readonly APP_LOCALE: string;
}

declare const __APP_VERSION__: string;
