import type { NewsItem, SourceInfo } from "@shared/types"

export function defineSource(source: () => Promise<NewsItem[]>): () => Promise<SourceInfo> {
  return async () => ({
    updatedTime: Date.now(),
    items: await source(),
  })
}

export function defineRSSSource(url: string): () => Promise<SourceInfo> {
  return async () => {
    const source = await rss2json(url)
    if (!source?.items.length) throw new Error("Cannot fetch data")
    return {
      updatedTime: source.updatedTime ?? Date.now(),
      items: source.items.slice(0, 20).map(item => ({
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
