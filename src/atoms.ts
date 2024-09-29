import { atom } from "jotai"
import type { SectionID, SourceID } from "@shared/types"
import { metadata, sourceList } from "@shared/data"
import { atomWithLocalStorage } from "./utils/atom"

export const focusSourcesAtom = atomWithLocalStorage<SourceID[]>("focusSources", [], (stored) => {
  return stored.filter(item => item in sourceList)
})

const currentSectionIDAtom = atom<SectionID>("focus")

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
}, (_, set, update: SectionID) => {
  set(currentSectionIDAtom, update)
})
