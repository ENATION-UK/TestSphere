import { IBPagerReq } from '@/types'

/**
 * AI点日志
 */
export interface IBAiPointLog {
  id: string
  aiPoint: number
  companyId: string
  completionTokens: number
  createAt: string
  finishReason: string
  promptTokens: number
  reason: string
  userId: string
  username: string
}

/**
 * AI点日志查询参数
 */
export interface IBAiPointLogQuery extends IBPagerReq {
  startTime?: string
  endTime?: string
}
