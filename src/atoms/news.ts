import { atom } from "jotai"
import { sections } from "@shared/data"
import type { SectionId } from "@shared/types"

export const sectionsAtom = atom(sections)

export const activeSectionAtom = atom<SectionId>("focus")
