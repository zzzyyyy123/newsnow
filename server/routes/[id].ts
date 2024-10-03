import { fallback, sources } from "#/sources"
import { Cache } from "#/cache"

export default defineEventHandler(async (event) => {
  try {
    const id = getRouterParam(event, "id") as keyof typeof sources
    const query = getQuery(event)
    const latest = query.latest !== undefined && query.latest !== "false"

    if (!id) throw new Error("Invalid source id")
    const db = useDatabase()
    const cacheStore = db ? new Cache(db) : undefined
    if (cacheStore) {
      await cacheStore.init()
      const cache = await cacheStore.get(id)
      if (cache) {
        if (!latest && cache.expires > Date.now()) {
          return {
            status: "cache",
            data: cache.data,
          }
        } else if (latest && Date.now() - cache.updated < 60 * 1000) {
          return {
            status: "success",
            data: cache.data,
          }
        }
      }
    }

    if (!sources[id]) {
      const data = await fallback(id)
      if (cacheStore) await cacheStore.set(id, data)
      return {
        status: "success",
        data,
      }
    } else {
      const data = await sources[id]()
      if (cacheStore) await cacheStore.set(id, data)
      return {
        status: "success",
        data,
      }
    }
  } catch (e: any) {
    console.error(e)
    return {
      status: "error",
      message: e.message ?? e,
    }
  }
})
