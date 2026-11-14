import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  base: process.env.GITHUB_ACTIONS ? "/AfterLife-/" : "/",
  plugins: [react()],
  build: {
    target: "es2020",
    chunkSizeWarningLimit: 1200,
  },
});
