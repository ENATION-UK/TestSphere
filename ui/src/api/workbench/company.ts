import { IBPagerReq, IBPagerRes } from '@/types'
import { IBLoginRes, IBUserRole } from '@/types/user'
import { IBCompany, IBInviteRegRecord, IBSubscription } from '@/types/workbench'
import request from '@/utils/request'

/**
 * 企业相关API
 */
export class CompanyApi {
  // 基础URL
  static baseUrl = `/platform/v2/user/company`

  /**
   * 获取当前企业信息
   */
  static detail() {
    return request<IBCompany>({
      url: this.baseUrl,
      method: 'get'
    })
  }

  /**
   * 更新当前企业信息
   */
  static update(params: Partial<IBCompany>) {
    const { companyName, contactsName, industry, logo, scale, tel } = params
    return request<IBCompany>({
      url: this.baseUrl,
      method: 'put',
      params: { companyName, contactsName, industry, logo, scale, tel }
    })
  }

  /**
   * 获取用户的企业列表
   */
  static companies() {
    return request<IBCompany[]>({
      url: `${this.baseUrl}/list`,
      method: 'get'
    })
  }

  /**
   * 从企业移除用户
   * @param userId
   */
  static removeUser(userId: string) {
    return request({
      url: this.baseUrl,
      method: 'delete',
      params: { userId }
    })
  }

  /**
   * 更新团队用户角色
   * @param id
   * @param role
   */
  static updateUserRole(id: string, role: IBUserRole) {
    return request({
      url: `${this.baseUrl}/role/${id}`,
      method: 'post',
      params: { role }
    })
  }

  /**
   * 切换当前企业
   * @param companyId
   */
  static change(companyId: string) {
    return request<IBLoginRes>({
      url: `${this.baseUrl}/switch/${companyId}`,
      method: 'post'
    })
  }

  /**
   * 获取公司订阅集合
   */
  static subscriptions() {
    return request<IBSubscription[]>({
      url: `${this.baseUrl}/subscriptions`,
      method: 'get'
    })
  }

  /**
   * 更新企业用户产品权限
   * @param userId
   * @param productAuthorities
   */
  static updateUserProductAuths(userId: string, productAuthorities: string) {
    return request({
      url: `${this.baseUrl}/product-authorities`,
      method: 'put',
      data: { userId, productAuthorities }
    })
  }

  /**
   * 获取邀请注册记录
   */
  static inviteRegRecords(params: IBPagerReq) {
    return request<IBPagerRes<IBInviteRegRecord>>({
      url: `${this.baseUrl}/invite-reg-records`,
      method: 'get',
      params
    })
  }
}
