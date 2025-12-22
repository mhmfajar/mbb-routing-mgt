import { resolve } from "node:path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import UnoCSS from "unocss/vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [UnoCSS(), react()],
  resolve: {
    alias: {
      "~/": `${resolve(__dirname, "src")}/`,
    },
  },
  server: {
    proxy: {
      // Proxy /executive/* requests to qosmo.telkom.co.id
      // Example: /executive/api/core/core.php -> https://qosmo.telkom.co.id/executive/api/core/core.php
      "/executive": {
        target: "https://qosmo.telkom.co.id",
        changeOrigin: true,
        secure: true,
      },
      // Proxy /api/* requests to qosmo.telkom.co.id
      // Example: /api/mbb-routing-mgt/ctiGateway -> https://qosmo.telkom.co.id/api/mbb-routing-mgt/ctiGateway
      "/api": {
        target: "https://qosmo.telkom.co.id",
        changeOrigin: true,
        secure: true,
      },
    },
  },
});
