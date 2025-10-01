import { defineConfig } from "vite";
import { resolve } from 'path';

const host = process.env.TAURI_DEV_HOST;

    // https://vite.dev/config/
export default defineConfig(async () => {
  return {
    clearScreen: false,
    server: {
      port: 1420,
      strictPort: true,
      host: host || false,
      hmr: host
        ? {
            protocol: "ws",
            host,
            port: 1421,
          }
        : undefined,
      watch: {
        ignored: ["**/src-tauri/**"],
      },
    },
    publicDir: "public",
    build: {
      cssCodeSplit: false,
      rollupOptions: {
        input: {
          main: resolve(__dirname, 'index.html')
        }
      }
    }
  };
});