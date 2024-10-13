import type { NewsItem, RSSHubInfo, SourceID } from "@shared/types"

export function defineSource(source: () => Promise<NewsItem[]>): () => Promise<NewsItem[]> {
  return source
}

interface SourceOption {
  // default: false
  hiddenDate?: boolean
}

interface FallbackRes {
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
export function defineFallbackSource(id: SourceID, option?: SourceOption): () => Promise<NewsItem[]> {
  return async () => {
    const url = `https://smzdk.top/api/${id}/new`
    const res: FallbackRes = await $fetch(url)
    if (res.code !== 200 || !res.data) throw new Error(res.message)
    return res.data.slice(0, 30).map(item => ({
      extra: {
        date: !option?.hiddenDate && item.time,
      },
      id: item.url,
      title: item.title,
      url: item.url,
      mobileUrl: item.mobileUrl,
    }))
  }
}

export function defineRSSSource(url: string, option?: SourceOption): () => Promise<NewsItem[]> {
  return async () => {
    const data = await rss2json(url)
    if (!data?.items.length) throw new Error("Cannot fetch data")
    return data.items.slice(0, 30).map(item => ({
      title: item.title,
      url: item.link,
      id: item.link,
      extra: {
        date: !option?.hiddenDate && item.created,
      },
    }))
  }
}

interface RSSHubOption {
  // default: true
  sorted?: boolean
  // default: 20
  limit?: number
}
export function defineRSSHubSource(route: string, RSSHubOptions?: RSSHubOption, sourceOption?: SourceOption): () => Promise<NewsItem[]> {
  return async () => {
    // "https://rsshub.pseudoyu.com"
    const RSSHubBase = "https://rsshub.rssforever.com"
    const url = new URL(route, RSSHubBase)
    url.searchParams.set("format", "json")
    const defaultRSSHubOption: RSSHubOption = {
      sorted: true,
      limit: 20,
    }
    Object.assign(defaultRSSHubOption, RSSHubOptions)
    Object.entries(defaultRSSHubOption).forEach(([key, value]) => {
      url.searchParams.set(key, value.toString())
    })
    const data: RSSHubInfo = await $fetch(url)
    return data.items.slice(0, 30).map(item => ({
      title: item.title,
      url: item.url,
      id: item.id ?? item.url,
      extra: {
        date: !sourceOption?.hiddenDate && item.date_published,
      },
    }))
  }
}
