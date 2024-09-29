import { defineEventHandler, getQuery, getRouterParam, sendProxy } from "h3"

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, "id")
  const { latest } = getQuery(event)
  if (latest !== undefined) return await sendProxy(event, `https://smzdk.top/api/${id}/new`)
  return await sendProxy(event, `https://smzdk.top/api/${id}/new`)
})
