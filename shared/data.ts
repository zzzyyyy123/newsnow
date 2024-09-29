import type { Metadata } from "./types"

export const sectionIds = ["focus", "social", "china", "world", "digital"] as const

export const sourceList = {
  "36kr": "36氪",
  "douyin": "抖音",
  "hupu": "虎扑",
  "zhihu": "知乎",
  "weibo": "微博",
  "tieba": "贴吧",
  "zaobao": "联合早报",
  "thepaper": "澎湃新闻",
  "toutiao": "今日头条",
  "cankaoxiaoxi": "参考消息",
  "peopledaily": "人民日报",
} as const satisfies Record<string, string | false>

export const metadata: Metadata = {
  focus: {
    name: "关注",
    sourceList: [],
  },
  social: {
    name: "社交媒体",
    sourceList: ["douyin", "hupu", "tieba", "weibo"],
  },
  china: {
    name: "国内",
    sourceList: ["peopledaily", "36kr", "toutiao"],
  },
  world: {
    name: "国外",
    sourceList: ["zaobao"],
  },
  digital: {
    name: "数码",
    sourceList: ["36kr"],
  },
}
