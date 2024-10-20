import type { SourceID } from "@shared/types"
import defu from "defu"
import type { FallbackResponse, RSSHubOption, RSSHubInfo as RSSHubResponse, SourceGetter, SourceOption } from "#/types"

type X = SourceGetter | Partial<Record<SourceID, SourceGetter>>
export function defineSource<T extends X>(source: T): T {
  return source
}

export function defineFallbackSource(id: SourceID, option?: SourceOption): SourceGetter {
  return async () => {
    const url = `https://smzdk.top/api/${id}/new`
    const res: FallbackResponse = await $fetch(url)
    if (res.code !== 200 || !res.data) throw new Error(res.message)
    return res.data.map(item => ({
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

export function defineRSSSource(url: string, option?: SourceOption): SourceGetter {
  return async () => {
    const data = await rss2json(url)
    if (!data?.items.length) throw new Error("Cannot fetch data")
    return data.items.map(item => ({
      title: item.title,
      url: item.link,
      id: item.link,
      extra: {
        date: !option?.hiddenDate && item.created,
      },
    }))
  }
}

export function defineRSSHubSource(route: string, RSSHubOptions?: RSSHubOption, sourceOption?: SourceOption): SourceGetter {
  return async () => {
    // "https://rsshub.pseudoyu.com"
    const RSSHubBase = "https://rsshub.rssforever.com"
    const url = new URL(route, RSSHubBase)
    url.searchParams.set("format", "json")
    RSSHubOptions = defu<RSSHubOption, RSSHubOption[]>(RSSHubOptions, {
      sorted: true,
    })

    Object.entries(RSSHubOptions).forEach(([key, value]) => {
      url.searchParams.set(key, value.toString())
    })
    const data: RSSHubResponse = await $fetch(url)
    return data.items.map(item => ({
      title: item.title,
      url: item.url,
      id: item.id ?? item.url,
      extra: {
        date: !sourceOption?.hiddenDate && item.date_published,
      },
    }))
  }
}
