/* eslint-disable import/no-extraneous-dependencies */
import suidPlugin from "@suid/vite-plugin";
import { visualizer } from "rollup-plugin-visualizer";
import { defineConfig, type PluginOption } from "vite";
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
    visualizer() as unknown as PluginOption,
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
