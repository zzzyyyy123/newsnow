import { defineConfig, presetIcons, presetUno, transformerDirectives, transformerVariantGroup } from "unocss"
import { colors } from "./shared/colors"

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
    "shadow-base": "shadow-[0px_2px_3px_-1px_rgba(0,0,0,0.1),0px_1px_0px_0px_rgba(25,28,33,0.02),0px_0px_0px_1px_rgba(25,28,33,0.08)] dark:shadow-[0px_2px_3px_-1px_rgba(0,0,0,0.1),0px_1px_0px_0px_rgba(25,28,33,0.02),0px_0px_0px_1px_rgba(25,28,33,0.08)]",

    // "bg-glass": "bg-white:75 dark:bg-[#1d1c1c]:75 backdrop-blur-5",
    "bg-code": "bg-gray5:5",
    "bg-hover": "bg-primary-400:5",

    "color-active": "color-primary-600 dark:color-primary-400",
    "border-active": "border-primary-600/25 dark:border-primary-400/25",
    "bg-active": "bg-primary-400:10",

    "btn-pure": "op50 hover:op75",
    "btn-action": "border border-base rounded flex gap-2 items-center px2 py1 op75 hover:op100 hover:bg-hover",
    "btn-action-active": "color-active border-active! bg-active op100!",
    "skeleton": "bg-gray-400/10 rounded-md h-5 w-full animate-pulse",
  },
  safelist: [
    ...colors.map(color => `bg-${color}`),
  ],
  extendTheme: (theme) => {
    // @ts-expect-error >_<
    theme.colors.primary = theme.colors.red
    return theme
  },
})
