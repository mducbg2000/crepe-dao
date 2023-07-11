/* eslint-disable import/no-extraneous-dependencies */
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
  test: {
    environment: "happy-dom",
  },
  build: {
    commonjsOptions: {
      transformMixedEsModules: true,
    },
  },
}));
