import type { NewsItem, SourceID } from "@shared/types"
import weibo from "./weibo"
import zaobao from "./zaobao"

export const sourcesFn = {
  "peopledaily": defineRSSSource("https://feedx.net/rss/people.xml", {
    hiddenDate: true,
  }),
  weibo,
  "douyin": defineFallbackSource("douyin"),
  zaobao,
  "toutiao": defineFallbackSource("toutiao"),
  "wallstreetcn": defineRSSHubSource("/wallstreetcn/live"),
  "36kr-quick": defineRSSHubSource("/36kr/newsflashes"),
  // "36kr": kr,
} as Record<SourceID, () => Promise<NewsItem[]>>
