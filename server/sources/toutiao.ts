interface Res {
  data?: {
    ClusterIdStr: string
    Title: string
    HotValue: string
    Image: {
      url: string
    }
  }[]
}

export default defineSource(async () => {
  const url = "https://www.toutiao.com/hot-event/hot-board/?origin=toutiao_pc"
  const res: Res = await $fetch(url)
  if (!res.data || res.data.length === 0) throw new Error("Cannot fetch data")
  return res.data
    .slice(0, 30)
    .map((k) => {
      return {
        id: k.ClusterIdStr,
        title: k.Title,
        extra: {
          info: k.HotValue,
        },
        url: `https://www.toutiao.com/trending/${k.ClusterIdStr}/`,
      }
    })
})
