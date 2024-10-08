import type { Metadata } from "./types"

export const sectionIds = ["focus", "social", "china", "world", "tech", "code"] as const

export const metadata: Metadata = {
  focus: {
    name: "关注",
    sources: [],
  },
  social: {
    name: "实时",
    sources: ["weibo", "douyin", "zhihu", "toutiao", "wallstreetcn", "ithome", "36kr"],
  },
  china: {
    name: "国内",
    sources: ["peopledaily", "toutiao", "zhihu"],
  },
  world: {
    name: "国外",
    sources: ["aljazeeracn", "sputniknewscn", "zaobao"],
  },
  code: {
    name: "代码",
    sources: ["v2ex"],
  },
  tech: {
    name: "科技",
    sources: ["ithome"],
  },
}
