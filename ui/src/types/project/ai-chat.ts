import { IBPagerReq } from '@/types'
import { IBTableColumn } from '@/types/project/table'

/**
 * AI聊天记录
 */
export interface IBAiChatRecord {
  id: string
  companyId: string
  createdAt: number
  projectId: string
  status: string
  title: string
  userId: string
  messages: IBAiChatMessage[]
}

/**
 * AI聊天记录请求参数
 */
export interface IBAiChatRecordParams extends IBPagerReq {
  keyword: string
  partnerId?: IBAiChatPartnerId
}

/**
 * AI聊天消息
 */
export interface IBAiChatMessage {
  chatId: string
  content: string
  createdAt: number
  id: string
  role: string
}

export type IBAiChatTableJsonOperationType = 'new' | 'drop' | 'alter' | 'rename'
export type IBAiChatTableJsonObjectType = 'table' | 'column' | 'foreignKey'

export interface IBAiChatTableJsonItem<CT = IBTableColumn[]> {
  // 名称
  name: string
  // 描述
  description?: string
  // 此项类型
  objectType: IBAiChatTableJsonObjectType
  // 此项操作类型
  operationType: IBAiChatTableJsonOperationType
  // 字段列表
  columns?: CT
  // 表名称
  tableName?: string
  // 引用表名
  refTable?: string
  // 引用表字段列表
  refColumns?: string[]
}

/**
 * 聊天提示词类型
 */
export type IBAiChatPartnerId = 'dbModelingPartner' | 'erdModelingPartner'
