import { TTL } from "@shared/consts"
import type { CacheInfo } from "@shared/types"
import type { Database } from "db0"

export class Cache {
  private db
  constructor(db: Database) {
    this.db = db
  }

  async init() {
    await this.db.prepare(`
      CREATE TABLE IF NOT EXISTS cache (
        id TEXT PRIMARY KEY,
        data TEXT,
        updated INTEGER,
        expires INTEGER
      );
    `).run()
  }

  async set(key: string, value: any) {
    const now = Date.now()
    return await this.db.prepare(
      `INSERT OR REPLACE INTO cache (id, data, updated, expires) VALUES (?, ?, ?, ?)`,
    ).run(key, JSON.stringify(value), now, now + TTL)
  }

  async get(key: string): Promise<CacheInfo> {
    const row: any = await this.db.prepare(`SELECT id, data, updated, expires FROM cache WHERE id = ?`).get(key)
    return row
      ? {
          ...row,
          data: JSON.parse(row.data),
        }
      : undefined
  }

  async delete(key: string) {
    return await this.db.prepare(`DELETE FROM cache WHERE id = ?`).run(key)
  }
}
