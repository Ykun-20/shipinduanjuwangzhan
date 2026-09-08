import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  base: "/shipinduanjuwangzhan/",
  build: {
    outDir: "dist/client",
  },
  optimizeDeps: {
    include: ["react", "react-dom/client"],
  },
  server: {
    host: "0.0.0.0",
    proxy: {
      "/cos-preview": {
        target: "https://yk-9527-1454067391.cos.ap-guangzhou.myqcloud.com",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/cos-preview/, ""),
      },
    },
    allowedHosts: ["terminal.local"],
    warmup: {
      clientFiles: ["./src/main.jsx"],
    },
  },
  plugins: [react()],
});
