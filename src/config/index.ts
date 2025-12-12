export const config = {
  app: {
    name: import.meta.env.VITE_APP_NAME || "MBB Routing MGT",
    version: import.meta.env.VITE_APP_VERSION || "0.0.0",
    env: import.meta.env.MODE,
    isDev: import.meta.env.DEV,
    isProd: import.meta.env.PROD,
    enableDebug: import.meta.env.VITE_ENABLE_DEBUG === "true",
  },
  api: {
    baseUrl: import.meta.env.VITE_API_BASE_URL || "/api",
    timeout: Number(import.meta.env.VITE_API_TIMEOUT) || 10000,
  },
  mapbox: {
    accessToken: import.meta.env.VITE_MAPBOX_ACCESS_TOKEN || "",
  },
} as const;

export type Config = typeof config;
