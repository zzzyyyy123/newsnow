import type { SourceID, SourceInfo } from "@shared/types"
import peopledaily from "./peopledaily"
import weibo from "./weibo"
import zaobao from "./zaobao"
import krQ from "./36kr-quick"
import wallstreetcn from "./wallstreetcn"
// import kr from "./36kr"

export { fallback } from "./fallback"

export const sources = {
  peopledaily,
  weibo,
  zaobao,
  wallstreetcn,
  "36kr-quick": krQ,
  // "36kr": kr,
} as Record<SourceID, () => Promise<SourceInfo>>
