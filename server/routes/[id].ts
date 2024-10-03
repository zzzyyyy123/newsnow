import { defineEventHandler, getRouterParam } from "h3"
import { fallback, sources } from "#/sources"
// import { cache } from "#/cache"

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, "id") as keyof typeof sources
  // const { latest } = getQuery(event)
  // console.log(id, latest)
  if (!id) throw new Error("Invalid source id")
  // if (!latest) {
  //   const _ = cache.get(id)
  //   if (_) return _
  // }

  if (!sources[id]) {
    const _ = await fallback(id)
    // cache.set(id, _)
    return _
  } else {
    const _ = await sources[id]()
    // cache.set(id, _)
    return _
  }
})
