/// <reference types="astro/client" />
interface ImportMetaEnv {
  readonly MICROCMS_SERVICE_DOMAIN: string;
  readonly MICROCMS_API_KEY: string;
  readonly MICROCMS_DRAFT_KEY?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
