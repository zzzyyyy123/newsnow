import type { Database } from "db0"
import type { UserInfo } from "#/types"

export class UserTable {
  private db
  constructor(db: Database) {
    this.db = db
  }

  async init() {
    await this.db.prepare(`
      CREATE TABLE IF NOT EXISTS user (
        id TEXT PRIMARY KEY,
        email TEXT,
        data TEXT,
        type TEXT,
        created INTEGER,
        updated INTEGER
      );
    `).run()
    logger.success(`init user table`)
  }

  async addUser(id: string, email: string, type: "github") {
    const u = await this.getUser(id)
    const now = Date.now()
    if (!u) {
      await this.db.prepare(`INSERT INTO user (id, email, data, type, created, updated) VALUES (?, ?, ?, ?, ?, ?)`)
        .run(id, email, "", type, now, now)
      logger.success(`add user ${id}`)
    } else if (u.email !== email && u.type !== type) {
      await this.db.prepare(`REPLACE INTO user (id, email, updated) VALUES (?, ?, ?)`).run(id, email, now)
      logger.success(`update user ${id} email`)
    } else {
      logger.info(`user ${id} already exists`)
    }
  }

  async getUser(id: string) {
    return (await this.db.prepare(`SELECT id, email, data, created, updated FROM user WHERE id = ?`).get(id)) as UserInfo
  }

  async setData(key: string, value: string) {
    const now = Date.now()
    const state = await this.db.prepare(
      `REPLACE INTO user (id, data, updated) VALUES (?, ?, ?)`,
    ).run(key, JSON.stringify(value), now)
    if (!state.success) throw new Error(`set user ${key} data failed`)
    logger.success(`set ${key} cache`)
  }

  async getData(id: string) {
    const row: any = await this.db.prepare(`SELECT data, update FROM user WHERE id = ?`).get(id)
    if (!row || !row.data) throw new Error(`user ${id} not found`)
    logger.success(`get ${id} data`)
    return row.data as {
      data: string
      updated: number
    }
  }

  async deleteUser(key: string) {
    const state = await this.db.prepare(`DELETE FROM user WHERE id = ?`).run(key)
    if (!state.success) throw new Error(`delete user ${key} failed`)
    logger.success(`delete user ${key}`)
  }
}
