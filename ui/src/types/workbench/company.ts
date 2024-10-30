import { IBSubscribeTypeAt, IBSubscribeTypeDb } from '@/types/workbench/subscribe'

/**
 * 企业
 */
export interface IBCompany {
  // 企业id
  companyId: string
  // 企业名称
  companyName: string
  // 企业LOGO
  logo: string
  // 联系人
  contactsName: string
  // 联系电话
  tel: string
  // 地址
  address: string
  // 行业
  industry: string
  // 分享码
  invitationCode: string
  // 规模
  scale: string
  // 总席位数
  seatTotal: number
  // 已用席位数
  seatUsed: number
  // AI点
  aiPoint: number
  // AI点已使用
  aiPointUsed: number
  // 订阅开始时间
  effectiveTime: string | number | null
  // 订阅到期时间
  expiryTime: string | number | null
  // 创建时间
  createTime: string | number
  // 数据库设计订阅类型
  subscribeTypeDb: IBSubscribeTypeDb
  // 自动化测试订阅类型
  subscribeTypeAt: IBSubscribeTypeAt
  // 订阅ID
  subscriptionId?: string
  // 订阅状态
  subscriptionStatus: 'canceled' | null
  // 表限制总数
  tableTotal: number
  // 表已用数量
  tableUsed: number
  // 最大并行数(自动化测试)
  maxConcurrent: number
  // 每月最大运行次数(自动化测试)
  maxCountMonthly: number
  // 剩余每月最大运行次数(自动化测试)
  remainCountMonthly: number
  // 当月已运行总次数(自动化测试)
  runTotalMonthly: number
  // 个人在当前企业中，拥有的产品权限
  productAuthorities?: string[]
}
