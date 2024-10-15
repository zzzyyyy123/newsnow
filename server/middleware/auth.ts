import process from "node:process"
import { jwtVerify } from "jose"

export default defineEventHandler(async (event) => {
  const url = getRequestURL(event)
  if (["JWT_SECRET", "G_CLIENT_ID", "G_CLIENT_SECRET"].find(k => !process.env[k])) {
    event.context.disabledLogin = true
    if (url.pathname.startsWith("/me")) throw createError({ statusCode: 506, message: "Server not configured" })
  } else {
    if (/^\/(?:me|s)\//.test(url.pathname)) {
      const token = getHeader(event, "Authorization")
      if (token && process.env.JWT_SECRET) {
        try {
          const { payload } = await jwtVerify(token.replace("Bearer ", ""), new TextEncoder().encode(process.env.JWT_SECRET)) as { payload?: { id: string, type: string } }
          if (payload?.id) {
            event.context.user = {
              id: payload.id,
              type: payload.type,
            }
          }
        } catch {
          if (url.pathname.startsWith("/me")) throw createError({ statusCode: 401, message: "JWT verification failed" })
          logger.warn("JWT verification failed")
        }
      }
    }
  }
})
