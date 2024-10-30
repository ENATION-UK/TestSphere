import request from '@/utils/request'

/**
 * 安全相关API
 */
export class SecurityApi {
  /**
   * 刷新token
   * @param refreshToken
   */
  static refreshToken(refreshToken: string) {
    return request<string>({
      url: `/platform/v2/user/security/token`,
      method: 'post',
      params: { refreshToken }
    })
  }

  /**
   * 设置密码
   * @param data
   */
  static setPassword(data: { account: string; code: string; password: string }) {
    return request<void>({
      url: `/platform/v2/user/security/setting/password`,
      method: 'put',
      data
    })
  }

  /**
   * 忘记密码-重置密码
   * @param params
   */
  static forgotPassword(params: { account: string; code: string; password: string }) {
    return request<void>({
      url: `/platform/v2/user/passport/login/forget/password`,
      method: 'put',
      params
    })
  }
}
