import type { PrimitiveAtom } from "jotai"
import { atom } from "jotai"

export function atomWithLocalStorage<T>(
  key: string,
  initialValue: T | (() => T),
  initFn?: ((stored: T) => T),
): PrimitiveAtom<T> {
  const getInitialValue = () => {
    const item = localStorage.getItem(key)
    try {
      if (item !== null) {
        const stored = JSON.parse(item)
        if (initFn) return initFn(stored)
        return stored
      }
    } catch {
      //
    }
    if (initialValue instanceof Function) return initialValue()
    else return initialValue
  }
  const baseAtom = atom(getInitialValue())
  const derivedAtom = atom(
    get => get(baseAtom),
    (get, set, update) => {
      const nextValue
        = typeof update === "function" ? update(get(baseAtom)) : update
      set(baseAtom, nextValue)
      localStorage.setItem(key, JSON.stringify(nextValue))
    },
  )
  return derivedAtom
}
