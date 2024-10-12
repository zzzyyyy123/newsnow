import { atom } from "jotai"
import type { SectionID, SourceID } from "@shared/types"
import { metadata } from "@shared/data"
import { sources } from "@shared/sources"
import { typeSafeObjectEntries, typeSafeObjectFromEntries } from "@shared/type.util"
import { atomWithLocalStorage } from "./hooks/atomWithLocalStorage"

const initialSources = typeSafeObjectFromEntries(typeSafeObjectEntries(metadata).map(([id, val]) => [id, val.sources]))
export const localSourcesAtom = atomWithLocalStorage<Record<SectionID, SourceID[]>>("localsources", () => {
  return initialSources
}, (stored) => {
  return typeSafeObjectFromEntries(typeSafeObjectEntries({
    ...initialSources,
    ...stored,
  }).filter(([id]) => initialSources[id]).map(([id, val]) => {
    if (id === "focus") return [id, val]
    const oldS = val.filter(k => initialSources[id].includes(k))
    const newS = initialSources[id].filter(k => !oldS.includes(k))
    return [id, [...oldS, ...newS]]
  }))
})

export const focusSourcesAtom = atom((get) => {
  return get(localSourcesAtom).focus
}, (get, set, update: Update<SourceID[]>) => {
  const _ = update instanceof Function ? update(get(focusSourcesAtom)) : update
  set(localSourcesAtom, {
    ...get(localSourcesAtom),
    focus: _,
  })
})

function initRefetchSources() {
  let time = 0
  // useOnReload
  // 没有放在 useOnReload 里面, 可以避免初始化后再修改 refetchSourceAtom，导致多次请求 API
  const _ = localStorage.getItem("quitTime")
  const now = Date.now()
  const quitTime = _ ? Number(_) : 0
  if (!Number.isNaN(quitTime) && now - quitTime < 1000) {
    time = now
  }
  return Object.fromEntries(Object.keys(sources).map(k => [k, time])) as Record<SourceID, number>
}

export const refetchSourcesAtom = atom(initRefetchSources())

export const currentSectionIDAtom = atom<SectionID>("focus")

export const currentSectionAtom = atom((get) => {
  const id = get(currentSectionIDAtom)
  return get(localSourcesAtom)[id]
}, (get, set, update: Update<SourceID[]>) => {
  const _ = update instanceof Function ? update(get(currentSectionAtom)) : update
  set(localSourcesAtom, {
    ...get(localSourcesAtom),
    [get(currentSectionIDAtom)]: _,
  })
})

export type Update<T> = T | ((prev: T) => T)

export const goToTopAtom = atom({
  ok: false,
  fn: undefined as (() => void) | undefined,
})
