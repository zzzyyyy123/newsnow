import process from "node:process"
import { join } from "node:path"
import { defineConfig } from "vite"
import react from "@vitejs/plugin-react-swc"
import nitro from "vite-plugin-with-nitro"
import { TanStackRouterVite } from "@tanstack/router-plugin/vite"
import tsconfigPath from "vite-tsconfig-paths"
import unocss from "unocss/vite"
import { projectDir } from "./shared/dir"

const isCF = process.env.CF_PAGES

export default defineConfig({
  plugins: [
    TanStackRouterVite({
      autoCodeSplitting: true,
    }),
    unocss(),
    tsconfigPath(),
    react(),
    nitro({ ssr: false }, {
      srcDir: "server",
      experimental: {
        database: true,
      },
      database: {
        default: {
          connector: isCF ? "cloudflare-d1" : "libsql",
          options: {
            bindingName: "CACHE_DB",
          },
        },
      },
      devDatabase: {
        default: {
          connector: "libsql",
        },
      },
      alias: {
        "@shared": join(projectDir, "shared"),
        "#": join(projectDir, "server"),
      },
      preset: isCF ? "cloudflare-pages" : "node-server",
    }),
  ],
})
