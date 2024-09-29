import type { NewsItem, SourceInfo } from "@shared/types"

// 榜单数据
export interface ListItem extends NewsItem { }

// 路由数据
export interface RouterData extends SourceInfo { }

// 请求类型
export interface Get {
  url: string
  headers?: Record<string, string | string[]>
  params?: Record<string, string | number>
  timeout?: number
  noCache?: boolean
  ttl?: number
  originaInfo?: boolean
}

export interface Post {
  url: string
  headers?: Record<string, string | string[]>
  body?: string | object | import("node:buffer").Buffer | undefined
  timeout?: number
  noCache?: boolean
  ttl?: number
  originaInfo?: boolean
}

export interface Web {
  url: string
  timeout?: number
  noCache?: boolean
  ttl?: number
  userAgent?: string
}

// 参数类型
export interface Options {
  [key: string]: string | number | undefined
}
