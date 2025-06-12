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
    proxy: {
      "/api": {
        target: "http://localhost:8080",
        changeOrigin: true,
        secure: false
      },
      "/socket.io": {
        target: "http://localhost:8080",
        ws: true
      }
    }
  },
  build: {
    target: "esnext"          
  },
  assetsInclude: ["**/*.wasm"]
});
