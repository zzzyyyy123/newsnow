import * as cheerio from "cheerio"
import type { NewsItem } from "@shared/types"

export default defineSource(async () => {
  const baseURL = "https://www.gelonghui.com"
  const html: any = await $fetch("https://www.gelonghui.com/news")
  const $ = cheerio.load(html)
  const $main = $(".article-content")
  const news: NewsItem[] = []
  $main.each((_, el) => {
    const a = $(el).find(".detail-right>a")
    // https://www.kzaobao.com/shiju/20241002/170659.html
    const url = a.attr("href")
    const title = a.find("h2").text()
    const info = $(el).find(".about-stocks").text()
    // 第三个 p
    const relatieveTime = $(el).find(".time > span:nth-child(3)").text()
    if (url && title && relatieveTime) {
      news.push({
        url: baseURL + url,
        title,
        id: url,
        extra: {
          date: parseRelativeDate(relatieveTime),
          info,
        },
      })
    }
  })
  return news.sort((m, n) => n.extra!.date > m.extra!.date ? 1 : -1)
})
