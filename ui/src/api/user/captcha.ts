import { IBSceneType } from '@/types/user'
import request from '@/utils/request'

/**
 * 验证码相关API
 */
export class CaptchaApi {
  /**
   * 发送手机验证码
   * @param mobile
   * @param scene
   * @param params
   */
  static sendMobileCode(mobile: string, scene: IBSceneType, params?: Record<string, any>) {
    return request<void>({
      url: `/platform/v2/user/captcha/mobile/${scene}`,
      method: 'post',
      params: { mobile, ...params }
    })
  }

  /**
   * 发送邮箱验证码
   * @param email
   * @param scene
   * @param params
   */
  static sendEmailCode(email: string, scene: IBSceneType, params?: Record<string, any>) {
    return request<void>({
      url: `/platform/v2/user/captcha/email/${scene}`,
      method: 'post',
      params: { email, ...params }
    })
  }

  /**
   * 校验验证码
   * @param account
   * @param scene
   * @param code
   */
  static checkCode(account: string, scene: IBSceneType, code: string) {
    return request<void>({
      url: `/platform/v2/user/security/check/code/${account}`,
      method: 'put',
      params: { scene, code }
    })
  }
}
