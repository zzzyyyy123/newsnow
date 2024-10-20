import type { SourceID } from "@shared/types"
import weibo from "./weibo"
import zaobao from "./zaobao"
import v2ex from "./v2ex"
import ithome from "./ithome"
import zhihu from "./zhihu"
import cankaoxiaoxi from "./cankaoxiaoxi"
import coolapk from "./coolapk"
import sputniknewscn from "./sputniknewscn"
import kr36 from "./36kr"
import wallstreetcn from "./wallstreetcn"
import douyin from "./douyin"
import toutiao from "./toutiao"
import type { SourceGetter } from "#/types"

export const sourcesGetters = {
  weibo,
  zaobao,
  ...v2ex,
  ithome,
  zhihu,
  coolapk,
  cankaoxiaoxi,
  sputniknewscn,
  wallstreetcn,
  douyin,
  toutiao,
  ...kr36,
} as Record<SourceID, SourceGetter>
