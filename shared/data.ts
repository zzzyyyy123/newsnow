import type { Metadata } from "./types"

export const sectionIds = ["focus", "social", "china", "world", "digital"] as const

export const sources = {
  "36kr": {
    name: "36氪",
    type: "人气榜",
    interval: 10,
    home: "https://36kr.com",
  },
  "36kr-quick": {
    name: "36氪",
    type: "快讯",
    interval: 3,
    home: "https://36kr.com",
  },
  "douyin": {
    name: "抖音",
    interval: 1,
    home: "https://www.douyin.com",
  },
  "hupu": {
    name: "虎扑",
    home: "https://hupu.com",
  },
  "zhihu": {
    name: "知乎",
    interval: 10,
    home: "https://www.zhihu.com",
  },
  "weibo": {
    name: "微博",
    type: "实时热搜",
    interval: 1,
    home: "https://weibo.com",
  },
  "tieba": {
    name: "百度贴吧",
    interval: 2,
    home: "https://tieba.baidu.com",
  },
  "zaobao": {
    name: "联合早报",
    type: "实时新闻",
    interval: 10,
    home: "https://www.zaobao.com",
  },
  "thepaper": {
    name: "澎湃新闻",
    home: "https://www.thepaper.cn",
  },
  "toutiao": {
    name: "今日头条",
    interval: 2,
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
  type?: string
  /**
   * 分钟，刷新的间隔时间，复用缓存
   */
  interval?: number
  /**
   * 每天刷新一次
   */
  once?: number
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
    sourceList: ["peopledaily", "36kr", "toutiao", "36kr-quick"],
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
