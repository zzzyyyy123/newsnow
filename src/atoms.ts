import { atom } from "jotai"
import type { SectionID, SourceID } from "@shared/types"
import { metadata, sources } from "@shared/data"
import { atomWithLocalStorage } from "./hooks/atomWithLocalStorage"

export const focusSourcesAtom = atomWithLocalStorage<SourceID[]>("focusSources", [], (stored) => {
  return stored.filter(item => item in sources)
})

function initRefetchSource() {
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

export const refetchSourceAtom = atom(initRefetchSource())

export const currentSectionIDAtom = atom<SectionID>("focus")

export const currentSectionAtom = atom((get) => {
  const id = get(currentSectionIDAtom)
  if (id === "focus") {
    return {
      id,
      ...metadata[id],
      sourceList: get(focusSourcesAtom),
    }
  }
  return {
    id,
    ...metadata[id],
  }
})
