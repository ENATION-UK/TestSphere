import { IBProductType } from '@/types'
import { IBMergeSubscribeType } from '@/types/workbench/subscribe'

/**
 * 订单
 */
export interface IBOrder {
  // 订单ID
  id: string
  // 公司ID
  companyId: string
  // 方案类型
  planType: IBMergeSubscribeType
  // 产品类型
  productType: IBProductType
  // 方案时长
  planDuration: IBOrderPlanDuration
  // 购买的AI点数
  aiPoints: number
  // 购买的席位数
  seatQuantity: number
  // 订单总价
  totalPrice: number
  // 订单日期
  orderDate: number
  // 订单状态
  orderStatus: IBOrderStatus
  // 订单类型
  orderType: IBOrderType
  // 支付时间
  paidTime: string
  // 三方支付流水号
  paymentNo: string
  // 支付方式
  paymentMethod: IBOrderPaymentMethod
}

/**
 * 订单类型
 */
export const IBOrderTypeMap = {
  plan: 'wb.orders.order_type_plan',
  point: 'wb.orders.order_type_point',
  seat: 'wb.orders.order_type_seat'
}
export type IBOrderType = keyof typeof IBOrderTypeMap

/**
 * 订单状态Map
 */
export const IBOrderStatusMap = {
  pending: 'wb.orders.order_status_pending',
  paid: 'wb.orders.order_status_paid',
  invoiced: 'wb.orders.order_status_invoiced'
}
export type IBOrderStatus = keyof typeof IBOrderStatusMap

/**
 * 订单支付方式
 */
export const IBOrderPaymentMethodMap = {
  wechatPayment: 'wb.orders.wechat_pay',
  alipayPayment: 'wb.orders.alipay',
  CPAA: 'wb.orders.public_pay1'
}
export type IBOrderPaymentMethod = keyof typeof IBOrderPaymentMethodMap

/**
 * 订单计划类型
 */
export const IBOrderPlanTypeMap = {
  TEAM: 'wb.version_team',
  PERSONAL: 'wb.version_personal'
}
export type IBOrderPlanType = keyof typeof IBOrderPlanTypeMap

/**
 * 订单计划时长<br>
 * mark: towYear可能是单词拼错了
 */
export const IBOrderPlanDurationMap = {
  oneMonth: 'wb.orders.one_month',
  twoMonth: 'wb.orders.two_month',
  threeMonth: 'wb.orders.three_month',
  fourMonth: 'wb.orders.four_month',
  fiveMonth: 'wb.orders.five_month',
  sixMonth: 'wb.orders.six_month',
  sevenMonth: 'wb.orders.seven_month',
  eightMonth: 'wb.orders.eight_month',
  nineMonth: 'wb.orders.nine_month',
  tenMonth: 'wb.orders.ten_month',
  elevenMonth: 'wb.orders.eleven_month',
  oneYear: 'wb.orders.one_year',
  towYear: 'wb.orders.tow_year',
  threeYear: 'wb.orders.three_year',
  fourYear: 'wb.orders.four_year',
  fiveYear: 'wb.orders.five_year'
}
export type IBOrderPlanDuration = keyof typeof IBOrderPlanDurationMap

/**
 * 计算订单价格参数
 */
export interface IBOrderPriceParams {
  duration: 'oneYear' | 'towYear' | 'threeYear'
  plan: IBMergeSubscribeType
  seatQuantity: number
  productType: IBProductType
}

/**
 * 订单计算金额详情
 */
export interface IBOrderPriceDetail {
  // 当前订阅剩余天数折算可低金额
  amountRemaining: number
  // 当前订阅剩余天数
  dayRemaining: number
  // 最终需要支付金额
  finalPrice: number
  // 当前订阅剩余月数
  monthRemaining: number
  // 当前订阅已支付金额
  planCost: number
  // 当前订阅剩余年数
  yearRemaining: number
}
