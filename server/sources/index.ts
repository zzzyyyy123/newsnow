import type { SourceID, SourceInfo } from "@shared/types"
import peopledaily from "./peopledaily"
import weibo from "./weibo"
import zaobao from "./zaobao"
import kr from "./36kr-quick"

export { fallback } from "./fallback"

export const sources = {
  peopledaily,
  weibo,
  zaobao,
  "36kr-quick": kr,
} as Record<SourceID, () => Promise<SourceInfo>>
