import process from "node:process"
import jwt from "@tsndr/cloudflare-worker-jwt"
import { UserTable } from "#/database/user"

export default defineEventHandler(async (event) => {
  ["JWT_SECRET", "G_CLIENT_ID", "G_CLIENT_SECRET"].forEach((k) => {
    if (!process.env[k]) throw new Error(`${k} is not defined`)
  })

  const db = useDatabase()
  const userTable = db ? new UserTable(db) : undefined
  if (!userTable) throw new Error("db is not defined")
  await userTable.init()
  const body = {
    client_id: process.env.G_CLIENT_ID,
    client_secret: process.env.G_CLIENT_SECRET,
    code: getQuery(event).code,
  }
  /**
   * 获取access_token
   * 接下来的操作都需要使用access_token
   */
  const response: {
    access_token: string
    token_type: string
    scope: string
  } = await $fetch(
    `https://github.com/login/oauth/access_token`,
    {
      method: "POST",
      body,
      headers: { accept: "application/json" },
    },
  )
  const token = response.access_token

  const userInfo: {
    id: number
    name: string
    avatar_url: string
  } = await $fetch(`https://api.github.com/user`, {
    headers: {
      Authorization: `token ${token}`,
    },
  })

  const emailinfo: {
    email: string
    primary: boolean
  }[] = await $fetch("https://api.github.com/user/emails", {
    headers: {
      Accept: "application/vnd.github+json",
      Authorization: `token ${token}`,
    },
  })

  const userID = String(userInfo.id)
  await userTable.addUser(userID, emailinfo.find(item => item.primary)?.email || "", "github")

  const jwtToken = await jwt.sign({
    id: userID,
    type: "github",
    // seconds
    exp: Math.floor(Date.now() / 1000 + 65 * 24 * 60 * 60),
  }, process.env.JWT_SECRET!)

  // seconds
  const maxAge = 60 * 24 * 60 * 60
  setCookie(event, "jwt", jwtToken, { maxAge })
  setCookie(event, "avatar", userInfo.avatar_url, { maxAge })
  setCookie(event, "name", userInfo.name, { maxAge })
  return sendRedirect(event, `/?login=github`)
})
