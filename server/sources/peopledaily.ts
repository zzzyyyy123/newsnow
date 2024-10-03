import type { OResponse, RSS2JSON } from "@shared/types"
import { rss2json } from "#/utils/rss2json"

export async function peopledaily(): Promise<OResponse> {
  const source = await rss2json("https://feedx.net/rss/people.xml")
  if (!source?.items.length) throw new Error("Cannot fetch data")
  return {
    status: "success",
    data: {
      name: "人民日报",
      type: "报纸",
      updateTime: Date.now(),
      items: source.items.slice(0, 30).map((item: RSS2JSON) => ({
        title: item.title,
        url: item.link,
        id: item.link,
      })),
    },
  }
}
