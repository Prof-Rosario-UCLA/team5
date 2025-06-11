import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: "autoUpdate",
      workbox: {
        globPatterns: ["**/*.{js,css,html,ico,png,svg,webmanifest}"],
        runtimeCaching: [
          {
            urlPattern: /\/api\/posts/,
            handler: "NetworkFirst",
            options: { cacheName: "posts-api" }
          }
        ],
        navigateFallback: "/index.html"
      },
      includeAssets: ["favicon.ico"]
    })
  ],
  server:{
    proxy:{
      "/api": "http://localhost:8080"
    }
  },
  assetsInclude: ["**/*.wasm"]
});
