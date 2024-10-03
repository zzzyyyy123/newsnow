import process from "node:process"
import { fileURLToPath } from "node:url"
import nitroCloudflareBindings from "nitro-cloudflare-dev"
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
      modules: [nitroCloudflareBindings],
      experimental: {
        database: true,
      },
      database: {
        default: {
          connector: "cloudflare-d1",
          options: {
            bindingName: "CACHE_DB",
          },
        },
      },
      devDatabase: {
        default: {
          connector: "sqlite",
        },
      },
      alias: {
        "@shared": fileURLToPath(new URL("shared", import.meta.url)),
        "#": fileURLToPath(new URL("server", import.meta.url)),
      },
      preset: "cloudflare-pages",
    }),
  ],
})
