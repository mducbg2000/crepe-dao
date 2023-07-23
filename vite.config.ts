/// <reference types="vitest" />
/// <reference types="vite/client" />
import suidPlugin from "@suid/vite-plugin";

import { defineConfig } from "vite";
import { nodePolyfills } from "vite-plugin-node-polyfills";
import solidPlugin from "vite-plugin-solid";
// https://vitejs.dev/config/
export default defineConfig(() => ({
  plugins: [
    nodePolyfills({
      exclude: ["fs"],
      globals: {
        Buffer: true,
        global: true,
        process: true,
      },
      protocolImports: true,
    }),
    suidPlugin(),
    solidPlugin(),
  ],
  build: {
    commonjsOptions: {
      transformMixedEsModules: true,
    },
  }
}));
