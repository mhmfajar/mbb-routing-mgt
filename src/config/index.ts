export const config = {
  app: {
    name: "MBB Routing MGT",
    version: "0.0.0",
    env: import.meta.env.MODE,
    isDev: import.meta.env.DEV,
    isProd: import.meta.env.PROD,
  },
  api: {
    baseUrl: import.meta.env.VITE_API_BASE_URL || "/api",
    timeout: 10000,
  },
  routes: {
    home: "/",
    about: "/about",
  },
} as const;

export type Config = typeof config;
