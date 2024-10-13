import process from "node:process"
import { jwtVerify } from "jose"

export default defineEventHandler(async (event) => {
  const token = getCookie(event, "jwt")
  if (token && process.env.JWT_SECRET) {
    try {
      const { payload } = await jwtVerify(token, new TextEncoder().encode(process.env.JWT_SECRET)) as { payload?: { id: string, type: string } }
      if (payload?.id) {
        event.context.user = payload.id
      }
    } catch {
      logger.error("JWT verification failed")
    }
  }
})
