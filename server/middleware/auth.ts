import process from "node:process"
import jwt from "jsonwebtoken"

export default defineEventHandler((event) => {
  const token = getCookie(event, "jwt")
  if (token && process.env.JWT_SECRET) {
    try {
      const { id: userID, exp } = jwt.verify(token, process.env.JWT_SECRET) as { id: string, exp: number }
      if (Date.now() < exp * 1000) {
        event.context.user = userID
      }
    } catch {
      logger.error("JWT verification failed")
    }
  }
})
