import process from "node:process"
import { defineConfig } from "vite"
import react from "@vitejs/plugin-react-swc"
import nitro from "vite-plugin-with-nitro"
import { TanStackRouterVite } from "@tanstack/router-plugin/vite"
import tsconfigPath from "vite-tsconfig-paths"
import unocss from "unocss/vite"

export default defineConfig({
  resolve: {
    mainFields: ["module"],
  },
  plugins: [
    TanStackRouterVite({
      autoCodeSplitting: true,
    }),
    unocss(),
    tsconfigPath(),
    react(),
    nitro({ ssr: false }, {
      srcDir: "server",
      minify: false,
      preset: process.env.VERCEL ? "vercel-edge" : "node-server",
      experimental: {
        websocket: true,
      },
    }),
  ],
})
