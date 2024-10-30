import { IBUserRole } from '@/types/user'

/**
 * 邀请数据
 */
export interface IBInviteData {
  linkData: string
  seatTotal: number
  seatUsed: number
}

/**
 * 邀请分享数据
 */
export interface IBShareData {
  companyId: string
  companyName: string
  effectiveTime: string
  userName: string
}

/**
 * 邀请记录
 */
export interface IBInviteRecord {
  // id
  id: string
  // 邀请人ID
  inviterId: string
  // 邀请人姓名
  inviterName: string
  // 邀请人企业
  inviterCompany: string
  // 被邀请人
  inviteeName: string
  // 被邀请人账号
  inviteeAccount: string
  // 被邀请人角色
  inviteeRole: string
  // 状态
  status: IBInviteStatus
  // 创建时间
  createTime: string
}

/**
 * 邀请状态
 */
export type IBInviteStatus = 'INVITER' | 'AGREE' | 'REFUSE' | 'ALL'
export type IBInviteStatusQuery = IBInviteStatus | 'ALL'

/**
 * 团队邀请记录
 */
export interface IBTeamInviteRecord {
  id: string
  createTime: number
  inviteeAccount: string
  inviteeName: string
  inviteeRole: IBUserRole
  inviterCompany: string
  inviterId: string
  inviterName: string
  status: IBInviteStatus
}

/**
 * 邀请注册记录
 */
export interface IBInviteRegRecord {
  id: string
  code: string
  createdAt: number
  invitee: string
  inviteeCompanyId: string
  inviteeName: string
  invitorCompanyId: string
  remark: string
}
