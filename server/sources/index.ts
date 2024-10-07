import type { NewsItem, SourceID } from "@shared/types"
import weibo from "./weibo"
import zaobao from "./zaobao"
import v2ex from "./v2ex"
import ithome from "./ithome"

export const sourcesFn = {
  weibo,
  zaobao,
  v2ex,
  ithome,
  "peopledaily": defineRSSSource("https://feedx.net/rss/people.xml", {
    hiddenDate: true,
  }),
  "sputniknewscn": defineRSSHubSource("/sputniknews/news/chinese"),
  "douyin": defineFallbackSource("douyin"),
  "aljazeeracn": defineRSSSource("https://feedx.net/rss/aljazeera.xml"),
  "toutiao": defineFallbackSource("toutiao"),
  "wallstreetcn": defineRSSHubSource("/wallstreetcn/live"),
  "36kr-quick": defineRSSHubSource("/36kr/newsflashes"),
} as Record<SourceID, () => Promise<NewsItem[]>>
