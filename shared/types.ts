import type { colors } from "unocss/preset-mini"
import type { columnIds } from "./metadata"
import type { originSources } from "./sources"

export type Color = Exclude<keyof typeof colors, "current" | "inherit" | "transparent" | "black" | "white">

type ConstSources = typeof originSources
type MainSourceID = keyof(ConstSources)

export type SourceID = {
  [Key in MainSourceID]: ConstSources[Key] extends { active?: false } ? never :
    ConstSources[Key] extends { sub?: infer SubSource } ? {
    // @ts-expect-error >_<
      [SubKey in keyof SubSource ]: SubSource[SubKey] extends { active?: false } ? never : `${Key}-${SubKey}`
    }[keyof SubSource] | Key : Key;
}[MainSourceID]

export type ColumnID = (typeof columnIds)[number]
export type Metadata = Record<ColumnID, Column>

export interface OriginSource {
  name: string
  title?: string
  /**
   * 刷新的间隔时间，复用缓存
   */
  interval?: number
  type?: "hottest" | "realtime"
  /**
   * @default true
   */
  active?: boolean
  home: string
  color?: Color
  sub?: Record<string, {
    title: string
    type?: "hottest" | "realtime"
    active?: boolean
    interval?: number
  }>
}

export interface Source {
  name: string
  title?: string
  type?: "hottest" | "realtime"
  color: Color
  active: boolean
  interval: number
  redirect?: SourceID
}

export interface Column {
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
