import process from "node:process"
import { join } from "node:path"
import { defineConfig } from "vite"
import react from "@vitejs/plugin-react-swc"
import nitro from "vite-plugin-with-nitro"
import { TanStackRouterVite } from "@tanstack/router-plugin/vite"
import tsconfigPath from "vite-tsconfig-paths"
import unocss from "unocss/vite"
import dotenv from "dotenv"
import { projectDir } from "./shared/dir"

const isCF = process.env.CF_PAGES

dotenv.config({
  path: join(projectDir, ".env.server"),
})

export default defineConfig({
  define: {
    __G_CLIENT_ID__: `"${process.env.G_CLIENT_ID}"`,
    __ENABLE_LOGIN__: ["JWT_SECRET", "G_CLIENT_ID", "G_CLIENT_SECRET"].every(k => process.env[k]),
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
      experimental: {
        database: true,
      },
      database: {
        default: {
          connector: isCF ? "cloudflare-d1" : "sqlite",
          options: {
            bindingName: "NEWSNOW_DB",
          },
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
