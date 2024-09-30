import { defineEventHandler, getQuery, getRouterParam, sendProxy } from "h3"

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, "id")
  const { latest } = getQuery(event)
  // https://api-hot.efefee.cn/weibo?cache=false
  // https://smzdk.top/api/${id}/new
  if (latest !== undefined) return await sendProxy(event, `https://api-hot.efefee.cn/${id}?cache=false`)
  return await sendProxy(event, `https://api-hot.efefee.cn/${id}?cache=true`)
})
