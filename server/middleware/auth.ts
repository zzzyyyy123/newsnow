import process from "node:process"
import jwt from "@tsndr/cloudflare-worker-jwt"

export default defineEventHandler(async (event) => {
  const token = getCookie(event, "jwt")
  if (token && process.env.JWT_SECRET) {
    const v = await jwt.verify(token, process.env.JWT_SECRET) as { preload?: { id: string, exp: number } }
    if (v?.preload?.id) {
      event.context.user = v.preload.id
    } else {
      logger.error("JWT verification failed")
    }
  }
})
