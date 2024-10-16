import { Cache } from "#/database/cache"

export function useCache() {
  try {
    const db = useDatabase()
    if (db) return new Cache(db)
  } catch (e) {
    logger.error("failed to init database ", e)
  }
}
