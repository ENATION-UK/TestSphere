import { IBPagerReq } from '@/types'

/**
 * 发票
 */
export interface IBInvoices {
  // ID
  id: string
  // 发票号
  invoiceNumber: string
  // 发票pdf地址
  invoicePdf: string
  // 发票金额
  paymentAmount: string
  // 支付时间
  paymentTime: string
}

/**
 * 发票查询参数
 */
export interface IBInvoicesQuery extends IBPagerReq {
  // 开始时间
  startTime?: string | number
  // 结束时间
  endTime?: string | number
}
