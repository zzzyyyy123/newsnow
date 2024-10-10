import type { NewsItem, SourceID } from "@shared/types"
import weibo from "./weibo"
import zaobao from "./zaobao"
import v2ex from "./v2ex"
import ithome from "./ithome"
import zhihu from "./zhihu"
import cankaoxiaoxi from "./cankaoxiaoxi"
import coolapk from "./coolapk"
import sputniknewscn from "./sputniknewscn"
import kr from "./36kr"
import wallstreetcn from "./wallstreetcn"

export const sourcesFn = {
  weibo,
  zaobao,
  v2ex,
  ithome,
  zhihu,
  coolapk,
  cankaoxiaoxi,
  sputniknewscn,
  wallstreetcn,
  "douyin": defineFallbackSource("douyin"),
  "toutiao": defineFallbackSource("toutiao"),
  "36kr-quick": kr,
} as Record<SourceID, () => Promise<NewsItem[]>>
