import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import runtimeErrorOverlay from "@replit/vite-plugin-runtime-error-modal";

export default defineConfig({
  plugins: [
    react(),
    runtimeErrorOverlay(),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "@assets": path.resolve(__dirname, "../attached_assets"),
    },
  },
  server: {
    port: 5000,
    host: "0.0.0.0",
    allowedHosts: [
      "13a5a8c4-38d7-41bb-876e-232311fff4de-00-xs0coajggmlx.riker.replit.dev",
      ".replit.dev",
      ".repl.co"
    ],
  },
});