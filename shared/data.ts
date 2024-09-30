import type { Metadata } from "./types"

export const sectionIds = ["focus", "social", "china", "world", "digital"] as const

export const sources = {
  "36kr": {
    name: "36氪",
    home: "https://36kr.com",
  },
  "douyin": {
    name: "抖音",
    home: "https://www.douyin.com",
  },
  "hupu": {
    name: "虎扑",
    home: "https://hupu.com",
  },
  "zhihu": {
    name: "知乎",
    home: "https://www.zhihu.com",
  },
  "weibo": {
    name: "微博",
    home: "https://weibo.com",
  },
  "tieba": {
    name: "百度贴吧",
    home: "https://tieba.baidu.com",
  },
  "zaobao": {
    name: "联合早报",
    home: "https://www.zaobao.com",
  },
  "thepaper": {
    name: "澎湃新闻",
    home: "https://www.thepaper.cn",
  },
  "toutiao": {
    name: "今日头条",
    home: "https://www.toutiao.com",
  },
  "cankaoxiaoxi": {
    name: "参考消息",
    home: "http://www.cankaoxiaoxi.com",
  },
  "peopledaily": {
    name: "人民日报",
    home: "http://paper.people.com.cn",
  },
} as const satisfies Record<string, {
  name: string
  home: string
}>

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
