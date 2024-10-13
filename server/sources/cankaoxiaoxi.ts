interface Res {
  list: {
    data: {
      id: string
      title: string
      // 北京时间
      url: string
      publishTime: string
    }
  }[]
}

export default defineSource(async () => {
  const res = await Promise.all(["zhongguo", "guandian", "gj"].map(k => $fetch(`https://china.cankaoxiaoxi.com/json/channel/${k}/list.json`) as Promise<Res>))
  if (!res?.[0]?.list?.length) throw new Error("Cannot fetch data")
  return res.map(k => k.list).flat().map(k => ({
    id: k.data.id,
    title: k.data.title,
    extra: {
      date: tranformToUTC(k.data.publishTime),
    },
    url: k.data.url,
  })).sort((m, n) => m.extra.date < n.extra.date ? 1 : -1).slice(0, 30)
})
