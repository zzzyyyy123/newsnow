import type { NewsItem } from "@shared/types"
import { load } from "cheerio"
import { $fetch } from "ofetch"

export default defineSource(async () => {
  const url = "https://www.36kr.com/newsflashes"
  const response = await $fetch(url)
  const $ = load(response)
  const news: NewsItem[] = []
  const $items = $(".news-list-item")
  $items.each((_, el) => {
    const $el = $(el)
    const $a = $el.find("a")
    const url = $a.attr("href")
    const title = $a.text()
    const relativeDate = $el.find(".time")
    if (url && title && relativeDate) {
      news.push({
        url,
        title,
        id: url,
        extra: {
          date: parseRelativeDate(relativeDate.text()),
        },
      })
    }
  })

  return news.slice(0, 20)
})
