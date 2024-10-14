import { metadata } from "@shared/metadata"
import { typeSafeObjectEntries, typeSafeObjectFromEntries } from "@shared/type.util"
import type { ColumnID, SourceID } from "@shared/types"
import type { PrimitiveAtom } from "jotai"
import { atom } from "jotai"
import { ofetch } from "ofetch"

function sync(nextValue: any) {
  if (__ENABLE_LOGIN__) {
    const jwt = localStorage.getItem("user_jwt")
    if (jwt) {
      ofetch("/me/sync", {
        method: "POST",
        body: { data: nextValue },
        headers: {
          Authorization: `Bearer ${localStorage.getItem("user_jwt")}`,
        },
      }).then(console.log).catch(e => console.error(e))
    }
  }
}

export function atomWithLocalStorage<T>(
  key: string,
  initialValue: T | (() => T),
  initFn?: ((stored: T) => T),
  storage?: (next: T) => void,
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
    (get, set, update: any) => {
      const nextValue = typeof update === "function" ? update(get(baseAtom)) : update
      set(baseAtom, nextValue)
      localStorage.setItem(key, JSON.stringify(nextValue))
      storage?.(nextValue)
    },
  )
  return derivedAtom
}

const initialSources = typeSafeObjectFromEntries(typeSafeObjectEntries(metadata).map(([id, val]) => [id, val.sources]))
export const localSourcesAtom = atomWithLocalStorage<Record<ColumnID, SourceID[]>>("localsources", initialSources, (stored) => {
  return typeSafeObjectFromEntries(typeSafeObjectEntries({
    ...initialSources,
    ...stored,
  }).filter(([id]) => initialSources[id]).map(([id, val]) => {
    if (id === "focus") return [id, val]
    const oldS = val.filter(k => initialSources[id].includes(k))
    const newS = initialSources[id].filter(k => !oldS.includes(k))
    return [id, [...oldS, ...newS]]
  }))
}, sync)
