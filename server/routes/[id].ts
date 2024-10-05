import { Interval, TTL } from "@shared/consts"
import type { SourceResponse } from "@shared/types"
import { sources } from "@shared/data"
import { fallback, sourcesFn } from "#/sources"
import { Cache } from "#/cache"

export default defineEventHandler(async (event): Promise<SourceResponse> => {
  try {
    const id = getRouterParam(event, "id") as keyof typeof sourcesFn
    const query = getQuery(event)
    const latest = query.latest !== undefined && query.latest !== "false"

    if (!id || !sources[id]) throw new Error("Invalid source id")
    const db = useDatabase()
    const cacheStore = db ? new Cache(db) : undefined
    const now = Date.now()
    if (cacheStore) {
      // await cacheStore.init()
      const cache = await cacheStore.get(id)
      if (cache) {
        if (!latest && now - cache.updated < TTL) {
          return {
            status: "cache",
            data: {
              updatedTime: cache.updated,
              items: cache.data,
            },
          }
        } else if (latest) {
          let interval = Interval
          if ("interval" in sources[id]) interval = sources[id].interval as number
          if (now - cache.updated < interval) {
            return {
              status: "success",
              data: {
                updatedTime: now,
                items: cache.data,
              },
            }
          }
        }
      }
    }

    if (sourcesFn[id]) {
      const last = performance.now()
      const data = await sourcesFn[id]()
      console.log(`fetch: ${id}`, performance.now() - last)
      if (cacheStore) event.waitUntil(cacheStore.set(id, data))
      return {
        status: "success",
        data: {
          updatedTime: now,
          items: data,
        },
      }
    } else {
      const last = performance.now()
      const data = await fallback(id)
      console.log(`fetch: ${id}`, performance.now() - last)
      if (cacheStore) event.waitUntil(cacheStore.set(id, data))
      return {
        status: "success",
        data: {
          updatedTime: now,
          items: data,
        },
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
