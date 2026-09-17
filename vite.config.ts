import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
  base: process.env.GITHUB_PAGES === "true" ? "/leeboardweb/" : "/",
  plugins: [react()],
  server: {
    port: 5173,
    strictPort: true,
  },
});
