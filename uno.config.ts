import { defineConfig, presetIcons, presetUno, transformerDirectives, transformerVariantGroup } from "unocss"

export default defineConfig({
  mergeSelectors: false,
  transformers: [transformerDirectives(), transformerVariantGroup()],
  presets: [
    presetUno(),
    presetIcons({
      scale: 1.2,
    }),
  ],
  rules: [],
  shortcuts: {
    "color-base": "color-neutral-800 dark:color-neutral-300",
    "bg-base": "bg-white dark:bg-[#1d1c1c]",
    "border-base": "border-gray-500/30",

    "bg-glass": "bg-white:75 dark:bg-[#1d1c1c]:75 backdrop-blur-5",
    "bg-code": "bg-gray5:5",
    "bg-hover": "bg-primary-400:5",

    "color-active": "color-primary-600 dark:color-primary-400",
    "border-active": "border-primary-600/25 dark:border-primary-400/25",
    "bg-active": "bg-primary-400:10",

    "btn-pure": "text-lg op50 hover:op75",
    "btn-action": "border border-base rounded flex gap-2 items-center px2 py1 op75 hover:op100 hover:bg-hover",
    "btn-action-sm": "btn-action text-sm",
    "btn-action-active": "color-active border-active! bg-active op100!",
    "skeleton": "bg-gray-400/10 rounded-md h-5 w-full animate-pulse",
  },
  theme: {
    colors: {
      primary: {
        DEFAULT: "#FDB022",
        50: "#FFFCF5",
        100: "#FFFAEB",
        200: "#FEF0C7",
        300: "#FEDF89",
        400: "#FEC84B",
        500: "#FDB022",
        600: "#F79009",
        700: "#DC6803",
        800: "#B54708",
        900: "#93370D",
        950: "#7A2E0E",
      },
    },
  },
})
