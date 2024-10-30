export interface IBToken {
  accessToken: string
  refreshToken: string
}

export interface IBLoginRes extends IBToken {
  face: string
  nickname: string
  uid: string
  username: string
  companyId: string
}

/**
 * 阿里云登录参数
 */
export interface IBAliYunLoginQuery {
  action: string
  instanceId: string
  timeStamp: string
  token: string
}
