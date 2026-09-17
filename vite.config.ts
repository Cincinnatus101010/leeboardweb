import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
  base: process.env.GITHUB_PAGES === "true" ? "/skegweb/" : "/",
  plugins: [react()],
  server: {
    port: 5173,
    strictPort: true,
  },
});


export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    strictPort: true,
  },
});
