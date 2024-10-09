import type { Metadata } from "./types"

export const sectionIds = ["focus", "realtime", "china", "world", "tech", "code"] as const

export const metadata: Metadata = {
  focus: {
    name: "关注",
    sources: [],
  },
  realtime: {
    name: "实时",
    sources: ["weibo", "douyin", "zhihu", "toutiao", "wallstreetcn", "ithome", "36kr"],
  },
  china: {
    name: "国内",
    sources: ["toutiao", "zhihu", "cankaoxiaoxi"],
  },
  world: {
    name: "国际",
    sources: ["sputniknewscn", "zaobao"],
  },
  code: {
    name: "代码",
    sources: ["v2ex"],
  },
  tech: {
    name: "科技",
    sources: ["ithome", "coolapk", "36kr-quick"],
  },
}
