export interface IBUser {
  userId: string
  username: string
  nickname: string
  email: string
  mobile: string
  face: string
  registerTime: string
  // 是否设置过姓名
  perfectNickName: 0 | 1
  // 项目个数
  projectNumber: string
  companyId: string
  wxUnionId: string
  // 是否已设置密码
  hasPassword: boolean
  // 阿里云市场用户Uid
  aliUid?: string
}

export interface IBUserPage {
  userId: string
  companyId: string
  email: string
  face: string
  mobile: string
  nickname: string
  role: string
  productAuthorities: string
}

/**
 * 用户角色
 */
export const IBUserRoleMap = {
  ADMIN: 'wb.manage.role_admin',
  USER: 'wb.manage.role_user'
}
export type IBUserRole = keyof typeof IBUserRoleMap
