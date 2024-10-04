import type { SourceInfo } from "@shared/types"

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

export async function fallback(id: string): Promise<SourceInfo> {
  const url = `https://smzdk.top/api/${id}/new`
  const res: Res = await $fetch(url)
  if (res.code !== 200 || !res.data) throw new Error(res.message)
  return {
    updatedTime: res.updateTime,
    items: res.data.map(item => ({
      extra: {
        date: item.time,
      },
      id: item.url,
      title: item.title,
      url: item.url,
      mobileUrl: item.mobileUrl,
    })),
  }
}
