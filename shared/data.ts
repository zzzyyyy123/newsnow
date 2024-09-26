import type { Section } from "./types"

export const sections = [
  {
    name: "关注",
    id: "focus",
  },
  {
    name: "综合",
    id: "main",
  },
  {
    name: "国内",
    id: "china",
  },
  {
    name: "国外",
    id: "world",
  },
  {
    name: "数码",
    id: "digital",
  },
] as const satisfies Section[]
