import { IBPagerRes } from '@/types/base'
import { IBUser, IBUserPage } from '@/types/user'
import request from '@/utils/request'

/**
 * 用户相关API
 */
export class UserApi {
  /**
   * 基础URL
   */
  static baseUrl() {
    return `/platform/v2/user`
  }

  /**
   * 获取当前已登录用户信息
   */
  static info() {
    return request<IBUser>({
      url: this.baseUrl(),
      method: 'get'
    })
  }

  /**
   * 企业成员列表
   */
  static members(params: { key?: string; pageNo: number; pageSize: number }) {
    return request<IBPagerRes<IBUserPage>>({
      url: `${this.baseUrl()}/list`,
      method: 'get',
      params
    })
  }

  /**
   * 检查账号是否存在
   * @param account
   */
  static checkExist(account: string) {
    return request<boolean>({
      url: `${this.baseUrl()}/exist/${account}`,
      method: 'get'
    })
  }

  /**
   * 更新用户姓名
   * @param name
   */
  static updateName(name: string) {
    return request<void>({
      url: `${this.baseUrl()}/security/set/name`,
      method: 'put',
      params: { name }
    })
  }

  /**
   * 绑定手机号
   * @param mobile
   * @param code
   * @param password
   */
  static bindMobile(mobile: string, code: string, password?: string) {
    return request<void>({
      url: `${this.baseUrl()}/security/bind/mobile/${mobile}`,
      method: 'put',
      params: { code, password }
    })
  }

  /**
   * 修改手机号
   * @param mobile
   * @param code
   */
  static updateMobile(mobile: string, code: string) {
    return request<void>({
      url: `${this.baseUrl()}/security/change/mobile/${mobile}`,
      method: 'put',
      params: { code }
    })
  }

  /**
   * 绑定邮箱
   * @param email
   * @param code
   * @param password
   */
  static bindEmail(email: string, code: string, password?: string) {
    return request<void>({
      url: `${this.baseUrl()}/security/bind/email/${email}`,
      method: 'put',
      params: { code, password }
    })
  }

  /**
   * 修改邮箱
   * @param email
   * @param code
   */
  static updateEmail(email: string, code: string) {
    return request<void>({
      url: `${this.baseUrl()}/security/change/email/${email}`,
      method: 'put',
      params: { code }
    })
  }
}
