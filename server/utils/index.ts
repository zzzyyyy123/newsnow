import { RSSHubBase } from "@shared/consts"
import type { NewsItem, RSSHubInfo, SourceInfo } from "@shared/types"

export function defineSource(source: () => Promise<NewsItem[]>): () => Promise<SourceInfo> {
  return async () => ({
    updatedTime: Date.now(),
    items: await source(),
  })
}

export function defineRSSSource(url: string): () => Promise<SourceInfo> {
  return async () => {
    const data = await rss2json(url)
    if (!data?.items.length) throw new Error("Cannot fetch data")
    return {
      updatedTime: data.updatedTime ?? Date.now(),
      items: data.items.slice(0, 20).map(item => ({
        title: item.title,
        url: item.link,
        id: item.link,
        extra: {
          date: item.created,
        },
      })),
    }
  }
}

interface Option {
  // default: true
  sorted?: boolean
  // default: 20
  limit?: number
}
export function defineRSSHubSource(route: string, option?: Option): () => Promise<SourceInfo> {
  return async () => {
    const url = new URL(route, RSSHubBase)
    url.searchParams.set("format", "json")
    const defaultOption: Option = {
      sorted: true,
      limit: 20,
    }
    Object.assign(defaultOption, option)
    Object.entries(defaultOption).forEach(([key, value]) => {
      url.searchParams.set(key, value.toString())
    })
    const data: RSSHubInfo = await $fetch(url)
    return {
      updatedTime: Date.now(),
      items: data.items.slice(0, 20).map(item => ({
        title: item.title,
        url: item.url,
        id: item.id ?? item.url,
        extra: {
          date: item.date_published,
        },
      })),
    }
  }
}
