// vite.config.js
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    host: "localhost", // ✅ sirf localhost par bind karega
    port: 5173, // optional, default port
    strictPort: true, // agar port busy ho to fail ho jaye
    hmr: {
      host: "localhost", // HMR bhi localhost use kare
      protocol: "ws",
    },
  },
});
