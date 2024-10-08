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
        // interval 刷新间隔，对于缓存失效也要执行的。本质上表示本来内容更新就很慢，这个间隔内可能内容压根不会更新。
        // 默认 10 分钟，是低于 TTL 的，但部分 Source 的间隔会超过 TTL，甚至有的一天刷新一次。
        const interval = sources[id]?.interval ?? Interval
        if (now - cache.updated < interval) {
          return {
            status: "success",
            data: {
              updatedTime: now,
              items: cache.data,
            },
          }
        }
        // 而 TTL 缓存失效时间，在时间范围内，就算内容更新了也要用这个缓存。
        // 复用缓存是不会更新时间的。
        if (!latest && now - cache.updated < TTL) {
          return {
            status: "cache",
            data: {
              updatedTime: cache.updated,
              items: cache.data,
            },
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
