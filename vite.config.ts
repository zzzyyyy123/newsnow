import process from "node:process"
import { join } from "node:path"
import { defineConfig } from "vite"
import react from "@vitejs/plugin-react-swc"
import nitro from "vite-plugin-with-nitro"
import { TanStackRouterVite } from "@tanstack/router-plugin/vite"
import tsconfigPath from "vite-tsconfig-paths"
import unocss from "unocss/vite"
import dotenv from "dotenv"
import type { VitePWAOptions } from "vite-plugin-pwa"
import { VitePWA } from "vite-plugin-pwa"
import { projectDir } from "./shared/dir"

dotenv.config({
  path: join(projectDir, ".env.server"),
})

const pwaOption: Partial<VitePWAOptions> = {
  includeAssets: ["icon.svg", "apple-touch-icon.png"],
  manifest: {
    name: "NewsNow",
    short_name: "NewsNow",
    description: "Elegant reading of real-time and hottest news",
    theme_color: "#F14D42",
    icons: [
      {
        src: "pwa-192x192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "pwa-512x512.png",
        sizes: "512x512",
        type: "image/png",
      },
      {
        src: "pwa-512x512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "pwa-512x512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  },
  devOptions: {
    enabled: process.env.SW_DEV === "true",
    type: "module",
    navigateFallback: "index.html",
  },

}

const nitroOption: Parameters<typeof nitro>[0] = {
  experimental: {
    database: true,
  },
  sourceMap: false,
  database: {
    default: {
      connector: "sqlite",
    },
  },
  preset: "node-server",
  alias: {
    "@shared": join(projectDir, "shared"),
    "#": join(projectDir, "server"),
  },
}

if (process.env.VERCEL) {
  nitroOption.preset = "vercel-edge"
  // You can use other online database, do it yourself. For more info: https://db0.unjs.io/connectors
  nitroOption.database = undefined
} else if (process.env.CF_PAGES) {
  nitroOption.preset = "cloudflare-pages"
  nitroOption.database = {
    default: {
      connector: "cloudflare-d1",
      options: {
        bindingName: "NEWSNOW_DB",
      },
    },
  }
} else if (process.env.BUN) {
  nitroOption.preset = "bun"
  nitroOption.database = {
    default: {
      connector: "bun-sqlite",
    },
  }
}

export default defineConfig({
  define: {
    __G_CLIENT_ID__: `"${process.env.G_CLIENT_ID}"`,
    __ENABLE_LOGIN__: ["JWT_SECRET", "G_CLIENT_ID", "G_CLIENT_SECRET"].every(k => process.env[k]),
  },
  plugins: [
    tsconfigPath(),
    TanStackRouterVite({
      autoCodeSplitting: true,
    }),
    unocss(),
    react(),
    VitePWA(pwaOption),
    nitro(nitroOption),
  ],
})
