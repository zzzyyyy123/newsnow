import { relativeTime } from "@shared/utils"
import { useEffect, useState } from "react"

export function useRelativeTime(timestamp: string | number) {
  const [time, setTime] = useState<string>()

  useEffect(() => {
    const t = relativeTime(timestamp)
    if (t) setTime(t)
    const interval = setInterval(() => {
      setTime(relativeTime(timestamp))
    }, 60 * 1000)
    return () => clearInterval(interval)
  }, [timestamp])

  return time
}
