import type { sectionIds, sources } from "./data"

export type SourceID = keyof(typeof sources)
export type SectionID = (typeof sectionIds)[number]
export type Metadata = Record<SectionID, Section>

export interface Section {
  name: string
  sourceList: SourceID[]
}

export interface NewsItem {
  id: string | number // unique
  title: string
  url: string
  mobileUrl?: string
  extra?: Record<string, any>
}

// 路由数据
export interface SourceInfo {
  updatedTime: number | string
  items: NewsItem[]
}

export type SourceResponse = {
  status: "success" | "cache"
  data: SourceInfo
} | {
  status: "error"
  message?: string
}

export interface RSSInfo {
  title: string
  description: string
  link: string
  image: string
  updatedTime: string
  items: RSSItem[]
}
export interface RSSItem {
  title: string
  description: string
  link: string
  created?: string
}

export interface CacheInfo {
  id: SourceID
  data: NewsItem[]
  updated: number
}

export interface RSSHubInfo {
  title: string
  home_page_url: string
  description: string
  items: RSSHubItem[]
}

export interface RSSHubItem {
  id: string
  url: string
  title: string
  content_html: string
  date_published: string
}
