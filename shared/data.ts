import type { Metadata } from "./types"

export const sectionIds = ["focus", "realtime", "hottest", "china", "world", "tech", "finance"] as const

export const metadata: Metadata = {
  focus: {
    name: "关注",
    sources: [],
  },
  realtime: {
    name: "实时",
    sources: ["weibo", "wallstreetcn", "ithome", "36kr", "zaobao"],
  },
  hottest: {
    name: "最热",
    sources: ["weibo", "douyin", "zhihu", "toutiao"],
  },
  china: {
    name: "国内",
    sources: ["weibo", "douyin", "toutiao", "zhihu"],
  },
  world: {
    name: "国际",
    sources: ["sputniknewscn", "zaobao", "cankaoxiaoxi"],
  },
  tech: {
    name: "科技",
    sources: ["ithome", "v2ex", "coolapk", "36kr-quick"],
  },
  finance: {
    name: "财经",
    sources: ["wallstreetcn", "36kr-quick"],
  },
}
