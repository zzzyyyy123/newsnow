import type { CacheInfo, NewsItem } from "@shared/types"
import type { Database } from "db0"

export class Cache {
  private db
  constructor(db: Database) {
    this.db = db
  }

  async init() {
    const last = performance.now()
    await this.db.prepare(`
      CREATE TABLE IF NOT EXISTS cache (
        id TEXT PRIMARY KEY,
        updated INTEGER,
        data TEXT
      );
    `).run()
    console.log(`init: `, performance.now() - last)
  }

  async set(key: string, value: NewsItem[]) {
    const now = Date.now()
    const last = performance.now()
    await this.db.prepare(
      `INSERT OR REPLACE INTO cache (id, data, updated) VALUES (?, ?, ?)`,
    ).run(key, JSON.stringify(value), now)
    console.log(`set ${key}: `, performance.now() - last)
  }

  async get(key: string): Promise<CacheInfo> {
    const last = performance.now()
    const row: any = await this.db.prepare(`SELECT id, data, updated FROM cache WHERE id = ?`).get(key)
    const r = row
      ? {
          ...row,
          data: JSON.parse(row.data),
        }
      : undefined
    console.log(`get ${key}: `, performance.now() - last)
    return r
  }

  async delete(key: string) {
    return await this.db.prepare(`DELETE FROM cache WHERE id = ?`).run(key)
  }
}
