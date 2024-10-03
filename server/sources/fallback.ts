import type { OResponse } from "@shared/types"
import { $fetch } from "ofetch"

export interface Res {
  code: number
  message: string
  name: string
  title: string
  subtitle: string
  total: number
  updateTime: string
  data: {
    title: string
    desc: string
    time?: string
    url: string
    mobileUrl: string
  }[]
}

export async function fallback(id: string): Promise<OResponse> {
  const res: Res = await $fetch(`https://smzdk.top/api/${id}/new`)
  if (res.code !== 200 || !res.data) throw new Error(res.message)
  return {
    status: "success",
    data: {
      name: res.title,
      type: res.subtitle,
      updateTime: res.updateTime,
      items: res.data.map(item => ({
        extra: {
          date: item.time,
        },
        id: item.url,
        title: item.title,
        url: item.url,
        mobileUrl: item.mobileUrl,
      })),
    },
  }
}
