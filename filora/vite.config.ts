// vite.config.js

import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],

  // Naye changes yahan hain
  server: {
    // 1. Host ko true karna zaroori hai taa-ke network requests allow hon
    host: true,

    // 2. filora.local ko allowedHosts mein shamil karna
    allowedHosts: ["filora.local"],

    // 3. HMR (Optional but often useful with custom domains)
    hmr: {
      // HMR socket ko bhi filora.local se connect karna
      host: "filora.local",
      protocol: "ws",
    },
  },
});
