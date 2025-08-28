import type { AppConfig } from "../types";

declare global {
  interface Window {
    __APP_CONFIG__?: Partial<AppConfig>;
  }
}

const DEFAULTS: AppConfig = {
  dataBasePath: import.meta.env.VITE_DATA_BASE_PATH || "/data",
};

export function getConfig(): AppConfig {
  const runtime = (typeof window !== "undefined" && window.__APP_CONFIG__) || {};
  return { ...DEFAULTS, ...runtime } as AppConfig;
}

