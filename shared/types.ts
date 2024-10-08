import type { sectionIds } from "./data"
import type { originSources } from "./sources"

type ConstSources = typeof originSources
type MainSourceID = keyof(ConstSources)

export type SourceID = {
  [Key in MainSourceID]: ConstSources[Key] extends { sub?: infer SubType } ? keyof {
    // @ts-expect-error >_<
    [K in keyof SubType as `${Key}-${K}` ]: never
  } | Key : Key;
}[MainSourceID]

export type SectionID = (typeof sectionIds)[number]
export type Metadata = Record<SectionID, Section>

export interface OriginSource {
  name: string
  title?: string
  /**
   * 刷新的间隔时间，复用缓存
   */
  interval?: number
  home: string
  sub?: Record<string, {
    title: string
    interval?: number
  }>
}

export interface Source {
  name: string
  title?: string
  interval?: number
  redirect?: SourceID
}

export interface Section {
  name: string
  sources: SourceID[]
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
  id: MainSourceID
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
