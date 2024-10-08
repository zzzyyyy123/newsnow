import type { NewsItem, SourceID } from "@shared/types"
import weibo from "./weibo"
import zaobao from "./zaobao"
import v2ex from "./v2ex"
import ithome from "./ithome"
import zhihu from "./zhihu"
import cankaoxiaoxi from "./cankaoxiaoxi"
import coolapk from "./coolapk"
import sputniknewscn from "./sputniknewscn"

export const sourcesFn = {
  weibo,
  zaobao,
  v2ex,
  ithome,
  zhihu,
  coolapk,
  cankaoxiaoxi,
  sputniknewscn,
  "peopledaily": defineRSSSource("https://feedx.net/rss/people.xml", {
    hiddenDate: true,
  }),
  "douyin": defineFallbackSource("douyin"),
  "aljazeeracn": defineRSSSource("https://feedx.net/rss/aljazeera.xml"),
  "toutiao": defineFallbackSource("toutiao"),
  "wallstreetcn": defineRSSHubSource("/wallstreetcn/live"),
  "36kr-quick": defineRSSHubSource("/36kr/newsflashes"),
} as Record<SourceID, () => Promise<NewsItem[]>>
