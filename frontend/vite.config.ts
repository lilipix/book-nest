import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import path from "path";
import { defineConfig } from "vite";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  assetsInclude: ["**/*.wasm"],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    watch: {
      usePolling: true,
    },
    allowedHosts: ["front"],
    // hot module reload
    hmr: { path: "hmr" },
    // no need this proxy with nginx
    // proxy: {
    //   "/api": {
    //     target: "http://back:5000", // or http://localhost:5000 if you are running the front locally with npm run dev
    //     changeOrigin: true,
    //     secure: false,
    //   },
    // },
  },
});
