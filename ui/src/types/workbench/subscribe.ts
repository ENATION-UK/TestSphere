import { IBProductType } from '@/types'

/**
 * 订阅
 */
export interface IBSubscription {
  id: string
  companyId: string
  effectiveTime: number
  expiryTime: number
  planDuration: string
  productType: IBProductType
  seatQuantity: number
  subscribeCost: number
  subscribeType: IBSubscribeType
  subscriptionId: string
  subscriptionStatus: string
}

/**
 * 数据库设计订阅类型
 */
export const IBSubscribeTypeDbMap = {
  FREE: 'wb.subscribe_type_free',
  PERSONAL: 'wb.subscribe_type_personal',
  PERSONAL_MONTHLY: 'wb.subscribe_type_personal_monthly',
  PERSONAL_YEARLY: 'wb.subscribe_type_personal_yearly',
  TEAM: 'wb.subscribe_type_team',
  TEAM_MONTHLY: 'wb.subscribe_type_team_monthly',
  TEAM_YEARLY: 'wb.subscribe_type_team_yearly'
}
export type IBSubscribeTypeDb = keyof typeof IBSubscribeTypeDbMap

/**
 * 自动化测试订阅类型
 */
export const IBSubscribeTypeAtMap = {
  FREE: 'wb.subscribe_type_free',
  PROFESSIONAL: 'wb.subscribe_type_professional',
  PRO_MONTHLY: 'wb.subscribe_type_pro_monthly',
  PRO_YEARLY: 'wb.subscribe_type_pro_yearly',
  ADVANCED: 'wb.subscribe_type_advanced',
  ADVANCED_MONTHLY: 'wb.subscribe_type_advanced_monthly',
  ADVANCED_YEARLY: 'wb.subscribe_type_advanced_yearly'
}
export type IBSubscribeTypeAt = keyof typeof IBSubscribeTypeAtMap

/**
 * 订阅类型
 */
export type IBSubscribeType = IBSubscribeTypeDb | IBSubscribeTypeAt

/**
 * 合并后的订阅方案
 */
export type IBMergeSubscribeType = 'TEAM' | 'PERSONAL' | IBSubscribeTypeAt
export const IBMergeSubscribeTypeMap = { ...IBSubscribeTypeDbMap, ...IBSubscribeTypeAtMap }
