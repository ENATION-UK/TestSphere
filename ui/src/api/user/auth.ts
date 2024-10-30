import { IBResponse } from '@/types/base'
import { IBAliYunLoginQuery, IBLoginRes, IBUser } from '@/types/user'
import request from '@/utils/request'

export class AuthApi {
  /**
   * 登录
   * @param params
   */
  static login(params: { username: string; password: string }) {
    return request<IBLoginRes>({
      url: `/platform/v2/user/passport/login`,
      method: 'post',
      params
    })
  }

  /**
   * 退出登录
   */
  static async logout() {
    await window.$sleep(1000)
    return request({
      url: `/v2/logout`,
      method: 'post'
    })
  }

  /**
   * 手机验证码登录
   * @param params
   */
  static loginByMobile(params: { mobile: string; code: string }) {
    const { mobile, code } = params
    return request<IBLoginRes>({
      url: `/platform/v2/user/passport/login/mobile/${mobile}`,
      method: 'post',
      params: { code }
    })
  }

  /**
   * Google登录
   * @param token
   * @param invitationCode
   */
  static loginByGoogle(token: string, invitationCode?: string) {
    return request<IBLoginRes>({
      url: `/platform/v2/user/passport/login/google/login`,
      method: 'post',
      params: { token, invitationCode }
    })
  }

  /**
   * Github登录
   * @param code
   * @param invitationCode
   */
  static loginByGithub(code: string, invitationCode?: string) {
    return request<IBLoginRes>({
      url: `/platform/v2/user/passport/login/github/login`,
      method: 'post',
      params: { code, invitationCode }
    })
  }

  /**
   * AliYun登录
   * @param params
   */
  static loginByAliYun(params: IBAliYunLoginQuery) {
    return request<IBLoginRes>({
      url: `/v2/user/passport/login/aliyun`,
      method: 'get',
      params
    })
  }

  /**
   * 发送邮箱注册验证码
   * @param email
   */
  static sendEmailRegisterCode(email: string) {
    return request<void>({
      url: `/platform/v2/user/passport/register/sendEmail/${email}`,
      method: 'post'
    })
  }

  /**
   * 手机注册
   * @param params
   */
  static registerByMobile(params: { mobile: string; code: string; invitationCode?: string }) {
    const { mobile, code, invitationCode } = params
    return request<IBLoginRes>({
      url: `/platform/v2/user/passport/register/mobile/${mobile}`,
      method: 'post',
      params: { code, invitationCode }
    })
  }

  /**
   * 检查邮箱是否存在
   */
  static checkEmailExist(email: string) {
    return request({
      url: `/platform/v2/user/passport/register/exist/email/${email}`,
      method: 'post',
      showMessage: false
    })
  }

  /**
   * 邮箱注册
   * @param params
   */
  static registerByEmail(params: { email: string; code: string; password: string; invitationCode?: string }) {
    const { email, code, password, invitationCode } = params
    return request<IBLoginRes>({
      url: `/platform/v2/user/passport/register/email/${email}`,
      method: 'post',
      params: { code, password, invitationCode }
    })
  }

  /**
   * 发送手机注册验证码
   * @param mobile
   */
  static sendMobilRegisterCode(mobile: string) {
    return request<void>({
      url: `/platform/v2/user/passport/register/sendMobile/${mobile}`,
      method: 'post'
    })
  }

  /**
   * 校验手机注册验证码
   * @param mobile
   * @param code
   */
  static checkMobileRegisterCode(mobile: string, code: string) {
    return request<void>({
      url: `/platform/v2/user/passport/register/checkMobileCode/${mobile}`,
      method: 'post'
    })
  }

  /**
   * 生成微信登录二维码
   */
  static getWechatLoginQrcodeUrl() {
    return request<string>({
      url: `/platform/v2/user/passport/login/qrcodeUrl`,
      method: 'get'
    })
  }

  /**
   * 等待微信用户扫码登录
   * @param invitationCode
   */
  static awaitWechatQrcodeScanForLogin(invitationCode?: string) {
    return request<IBResponse<IBLoginRes>>({
      url: `/platform/v2/user/passport/login/wechat/login`,
      method: 'post',
      rawRes: true,
      params: { invitationCode }
    })
  }

  /**
   * 等待微信用户扫码绑定
   */
  static awaitWechatQrcodeScanForBind() {
    return request<IBResponse<IBUser>>({
      url: `/platform/v2/user/security/wechat/bind`,
      method: 'post',
      rawRes: true
    })
  }

  /**
   * 微信扫码登录绑定手机号
   * @param mobile
   * @param code
   */
  static wechatLoginBindMobile(mobile: string, code: string) {
    return request<IBLoginRes>({
      url: `/platform/v2/user/passport/login/bind/mobile`,
      method: 'put',
      params: { mobile, code }
    })
  }

  /**
   * 微信登录,跳过绑定手机号
   */
  static wechatSkipBindMobile() {
    return request<IBLoginRes>({
      url: `/platform/v2/user/passport/login/skip`,
      method: 'post'
    })
  }
}
