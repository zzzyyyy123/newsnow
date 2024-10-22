import process from "node:process"
import { Cache } from "#/database/cache"

export function useCache() {
  try {
    const db = useDatabase()
    if (db && process.env.NODE_ENV === "production") return new Cache(db)
  } catch (e) {
    logger.error("failed to init database ", e)
  }
}
