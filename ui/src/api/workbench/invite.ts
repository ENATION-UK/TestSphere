import { IBPagerReq, IBPagerRes } from '@/types/base'
import { IBInviteData, IBInviteRecord, IBInviteStatusQuery, IBShareData, IBTeamInviteRecord } from '@/types/workbench'
import request from '@/utils/request'

/**
 * 邀请相关API
 */
export class InviteApi {
  /**
   * 邀请会员
   * @param params
   */
  static async inviteMember(params: { inviteeRole: string; inviteeAccount: string; invitee: string }) {
    return request({
      url: `/platform/v2/user/invite`,
      method: 'post',
      params
    })
  }

  /**
   * 获取分享数据
   */
  static async shareData() {
    return request<IBInviteData>({
      url: `/platform/v2/user/invite/link`,
      method: 'get'
    })
  }

  /**
   * 重置分享数据
   */
  static async resetShareData() {
    return request<IBInviteData>({
      url: `/platform/v2/user/invite/reset/link`,
      method: 'get'
    })
  }

  /**
   * 获取邀请会员列表
   */
  static async invitedMembers(params: IBPagerReq & { status?: IBInviteStatusQuery }) {
    return request<IBPagerRes<IBInviteRecord>>({
      url: `/platform/v2/user/invite/list`,
      method: 'get',
      params
    })
  }

  /**
   * 根据分享链接获取分享信息
   * @param base64
   */
  static async getShareData(base64: string) {
    return request<IBShareData>({
      url: `/platform/v2/user/invite/share`,
      method: 'post',
      params: { share: base64 }
    })
  }

  /**
   * 绑定邀请
   */
  static async bindUser(base64: string) {
    return request<void>({
      url: `/platform/v2/user/invite/bind`,
      method: 'post',
      params: { share: base64 }
    })
  }

  /**
   * 获取被邀请列表
   * @param params
   */
  static inviteesList(params: IBPagerReq & { status: 'INVITER' | 'AGREE' | 'REFUSE' | string }) {
    return request<IBPagerRes<IBTeamInviteRecord>>({
      url: `/platform/v2/user/invite/invitee/list`,
      method: 'get',
      params
    })
  }

  /**
   * 处理被邀请
   * @param id
   * @param result
   */
  static auditInvitees(id: string, result: 'AGREE' | 'REFUSE') {
    return request({
      url: `/platform/v2/user/invite/audit/${id}`,
      method: 'put',
      params: { result }
    })
  }
}
