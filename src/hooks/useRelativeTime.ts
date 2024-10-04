import { relativeTime } from "@shared/utils"
import { atom, useAtomValue } from "jotai"
import { useEffect, useState } from "react"

/**
 * change every minute
 */
const timerAtom = atom(0)

timerAtom.onMount = (set) => {
  const timer = setInterval(() => {
    set(Date.now())
  }, 60 * 1000)
  return () => clearInterval(timer)
}

export function useRelativeTime(timestamp: string | number) {
  const [time, setTime] = useState<string>()
  const timer = useAtomValue(timerAtom)

  useEffect(() => {
    const t = relativeTime(timestamp)
    if (t) {
      setTime(t)
    }
  }, [timestamp, timer])

  return time
}
