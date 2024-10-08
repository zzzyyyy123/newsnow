import { Interval, TTL } from "@shared/consts"
import type { SourceID, SourceResponse } from "@shared/types"
import { sources } from "@shared/sources"
import { sourcesFn } from "#/sources"
import { Cache } from "#/cache"

export default defineEventHandler(async (event): Promise<SourceResponse> => {
  try {
    let id = getRouterParam(event, "id") as SourceID
    const query = getQuery(event)
    const latest = query.latest !== undefined && query.latest !== "false"
    const isValid = (id: SourceID) => !id || !sources[id] || !sourcesFn[id]

    if (isValid(id)) {
      const redirectID = sources[id].redirect
      if (redirectID) id = redirectID
      if (isValid(id)) throw new Error("Invalid source id")
    }

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

    const data = await sourcesFn[id]()
    logger.success(`fetch ${id} latest`)
    if (cacheStore) event.waitUntil(cacheStore.set(id, data))
    return {
      status: "success",
      data: {
        updatedTime: now,
        items: data,
      },
    }
  } catch (e: any) {
    logger.error(e)
    return {
      status: "error",
      message: e.message ?? e,
    }
  }
})
