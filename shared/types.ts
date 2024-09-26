import type { sections } from "./data"

export interface Section {
  name: string
  id: string
}

export type SectionId = (typeof sections)[number]["id"]
