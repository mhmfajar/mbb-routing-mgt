export const config = {
  api: {
    baseUrl: import.meta.env.VITE_API_BASE_URL || "/api",
    timeout: Number(import.meta.env.VITE_API_TIMEOUT) || 10000,
  },
  mapbox: {
    accessToken: import.meta.env.VITE_MAPBOX_ACCESS_TOKEN || "",
  },
} as const;

export type Config = typeof config;
