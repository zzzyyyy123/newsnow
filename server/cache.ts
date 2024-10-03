import { TTL } from "@shared/consts"
import type { CacheInfo } from "@shared/types"

export class Cache {
  private db
  constructor(db: any) {
    this.db = db
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS cache (
        id TEXT PRIMARY KEY,
        data TEXT,
        updated INTEGER,
        expires INTEGER
      );
    `)
  }

  async set(key: string, value: any) {
    const now = Date.now()
    return await this.db.prepare(
      `INSERT OR REPLACE INTO cache (id, data, updated, expires) VALUES (?, ?, ?, ?)`,
    ).run(key, JSON.stringify(value), now, now + TTL)
  }

  async get(key: string): Promise<CacheInfo> {
    const row = await this.db.prepare(`SELECT id, data, updated, expires FROM cache WHERE id = ?`).get(key)
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
