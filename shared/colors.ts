import { colors as c } from "unocss/preset-mini"
import { typeSafeObjectKeys } from "./type.util"

export const colors = typeSafeObjectKeys(c)

export type Color = Exclude<typeof colors[number], "current" | "inherit" | "transparent" | "black" | "white">
