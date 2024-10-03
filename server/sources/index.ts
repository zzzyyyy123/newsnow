import { peopledaily } from "./peopledaily"
import { weibo } from "./weibo"
import { zaobao } from "./zaobao"

export { fallback } from "./fallback"

export const sources = {
  peopledaily,
  weibo,
  zaobao: () => zaobao("中国聚焦"),
}
