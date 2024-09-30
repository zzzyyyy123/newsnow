import type { sectionIds, sources } from "./data"

export type SourceID = keyof(typeof sources)
export type SectionID = (typeof sectionIds)[number]
export type Metadata = Record<SectionID, Section>

export interface Section {
  name: string
  sourceList: SourceID[]
}

export interface NewsItem {
  title: string
  cover?: string
  author?: string
  desc?: string
  url: string
  timestamp?: number
  mobileUrl?: string
}

// 路由数据
export interface SourceInfo {
  name: string
  title: string
  type: string
  description?: string
  params?: Record<string, string | object>
  total: number
  link?: string
  updateTime: string
  data: NewsItem[]
}
