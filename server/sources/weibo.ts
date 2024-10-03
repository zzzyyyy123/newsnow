import type { OResponse } from "@shared/types"
import { $fetch } from "ofetch"

interface Res {
  ok: number // 1 is ok
  data: {
    realtime:
    {
      num: number // 看上去是个 id
      emoticon: string
      icon?: string // 热，新 icon url
      icon_width: number
      icon_height: number
      note: string
      small_icon_desc: string
      icon_desc?: string // 如果是 荐 ,就是广告
      topic_flag: number
      icon_desc_color: string
      flag: number
      word_scheme: string
      small_icon_desc_color: string
      realpos: number
      label_name: string
      word: string // 热搜词
      rank: number
    }[]
  }
}

export async function weibo(): Promise<OResponse> {
  const url = "https://weibo.com/ajax/side/hotSearch"
  const res: Res = await $fetch(url)
  if (!res.ok || res.data.realtime.length === 0) throw new Error("Cannot fetch data")
  return {
    status: "success",
    data: {
      name: "微博热搜",
      updateTime: Date.now(),
      type: "热搜",
      items: res.data.realtime.filter(k => !k.icon_desc || k.icon_desc !== "荐").map((k) => {
        const keyword = k.word_scheme ? k.word_scheme : `#${k.word}#`
        return {
          id: k.num,
          title: k.word,
          extra: {
            icon: k.icon,
          },
          url: `https://s.weibo.com/weibo?q=${encodeURIComponent(keyword)}`,
          mobileUrl: `https://m.weibo.cn/search?containerid=231522type%3D1%26q%3D${encodeURIComponent(keyword)}&_T_WM=16922097837&v_p=42`,
        }
      }),
    },
  }
}
