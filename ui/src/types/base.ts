import type { AxiosRequestConfig } from 'axios'

export interface IBRequestConfig extends AxiosRequestConfig {
  mock?: boolean
  json?: boolean
  rawRes?: boolean
  showMessage?: boolean
}

// 响应体
export interface IBResponse<T = any> {
  code: string | number
  message: string | null
  success: boolean
  data: T
}

// 分页
export interface IBPagerReq {
  pageNo: number
  pageSize: number
}

// 分页响应
export interface IBPagerRes<T = any> {
  // 当前页
  current?: number
  // 分页大小
  size?: number
  // 数据总条数
  total?: number
  // 总页数
  pages: number
  // 记录
  records: T[]
}

/**
 * 时间区间
 */
export interface IBTimeRange {
  beginTime?: string
  endTime?: string
}

/**
 * 选项
 */
export interface IBSelectOption<T = any> {
  label: string
  value: T
}

/**
 * 选项集合
 */
export type IBSelectOptions<T = any> = IBSelectOption<T>[]
