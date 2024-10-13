import { Interval } from "./consts"
import { typeSafeObjectFromEntries } from "./type.util"
import type { OriginSource, Source, SourceID } from "./types"

const Time = {
  Test: 1,
  Realtime: 2 * 60 * 1000,
  Fast: 5 * 60 * 1000,
  Default: Interval, // 10min
  Common: 30 * 60 * 1000,
  Slow: 60 * 60 * 1000,
}

export const originSources = {
  "v2ex": {
    name: "V2EX",
    color: "slate",
    home: "https://v2ex.com/",
  },
  "coolapk": {
    name: "酷安",
    type: "hottest",
    color: "green",
    title: "今日最热",
    home: "https://coolapk.com",
  },
  "wallstreetcn": {
    name: "华尔街见闻",
    interval: Time.Fast,
    home: "https://wallstreetcn.com/",
    title: "快讯",
  },
  "sputniknewscn": {
    name: "卫星通讯社",
    color: "orange",
    home: "https://sputniknews.cn",
  },
  "cankaoxiaoxi": {
    name: "参考消息",
    color: "red",
    interval: Time.Common,
    home: "https://china.cankaoxiaoxi.com",
  },
  "36kr": {
    name: "36氪",
    home: "https://36kr.com",
    sub: {
      quick: {
        title: "快讯",
      },
    },
  },
  "douyin": {
    name: "抖音",
    type: "hottest",
    color: "gray",
    home: "https://www.douyin.com",
  },
  "hupu": {
    name: "虎扑",
    home: "https://hupu.com",
  },
  "zhihu": {
    name: "知乎",
    type: "hottest",
    home: "https://www.zhihu.com",
  },
  "weibo": {
    name: "微博",
    title: "实时热搜",
    type: "hottest",
    color: "red",
    interval: Time.Realtime,
    home: "https://weibo.com",
  },
  "tieba": {
    name: "百度贴吧",
    home: "https://tieba.baidu.com",
  },
  "zaobao": {
    name: "联合早报",
    interval: Time.Common,
    color: "red",
    home: "https://www.zaobao.com",
  },
  "thepaper": {
    name: "澎湃新闻",
    interval: Time.Common,
    home: "https://www.thepaper.cn",
  },
  "toutiao": {
    name: "今日头条",
    type: "hottest",
    color: "red",
    home: "https://www.toutiao.com",
  },
  "ithome": {
    name: "IT之家",
    color: "red",
    home: "https://www.ithome.com",
  },
} as const satisfies Record<string, OriginSource>

export const sources = genSources()
function genSources() {
  const _: [SourceID, Source][] = []

  Object.entries(originSources).forEach(([id, source]: [any, OriginSource]) => {
    if (source.sub && Object.keys(source.sub).length) {
      Object.entries(source.sub).forEach(([subId, subSource], i) => {
        if (i === 0) {
          _.push([id, {
            redirect: `${id}-${subId}`,
            name: source.name,
            type: source.type,
            color: source.color ?? "blue",
            interval: source.interval ?? Time.Default,
            ...subSource,
          }] as [any, Source])
        }
        _.push([`${id}-${subId}`, {
          name: source.name,
          type: source.type,
          color: source.color ?? "blue",
          interval: source.interval ?? Time.Default,
          ...subSource,
        }] as [any, Source])
      })
    } else {
      _.push([id, {
        name: source.name,
        type: source.type,
        color: source.color ?? "blue",
        interval: source.interval ?? Time.Default,
        title: source.title,
      }])
    }
  })

  return typeSafeObjectFromEntries(_)
}
