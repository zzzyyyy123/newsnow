interface Res {
  data: {
    items: {
      uri: string
      id: number
      title?: string
      content_text: string
      display_time: number
    }[]
  }
}

// https://github.com/DIYgod/RSSHub/blob/master/lib/routes/wallstreetcn/live.ts
export default defineSource(async () => {
  const category = "global"
  const apiRootUrl = "https://api-one.wallstcn.com"
  const apiUrl = `${apiRootUrl}/apiv1/content/lives?channel=${category}-channel&limit=30`

  const res: Res = await $fetch(apiUrl)
  if (!res?.data?.items || res.data.items.length === 0) throw new Error("Cannot fetch data")
  return res.data.items
    .slice(0, 20)
    .map((k) => {
      return {
        id: k.id,
        title: k.title || k.content_text,
        extra: {
          date: new Date(k.display_time * 1000).getTime(),
        },
        url: k.uri,
      }
    })
})
