import { IBCaseGroup } from '@/types/tester'
import request from '@/utils/request'
import { useTesterParams } from '@/hooks/useTesterParams'

/**
 * 测试用例分组相关API
 */
export class GroupApi {
  /**
   * 基础URL
   * @private
   */
  private static get baseUrl() {
    const { projectId } = useTesterParams()
    return `/autotest/projects/${projectId}/test-group`
  }

  /**
   * 获取测试用例分组树
   */
  static tree() {
    return request<IBCaseGroup[]>({
      url: `${this.baseUrl}/tree`,
      method: 'get'
    })
  }

  /**
   * 添加测试用例分组
   * @param data
   */
  static add(data: Partial<IBCaseGroup>) {
    return request<IBCaseGroup>({
      url: `${this.baseUrl}/add`,
      method: 'post',
      json: true,
      data
    })
  }

  /**
   * 删除测试用例分组
   * @param id
   */
  static delete(id: string) {
    return request<void>({
      url: `${this.baseUrl}/delete/${id}`,
      method: 'post',
      showMessage: false
    })
  }

  /**
   * 获取测试用例分组详情
   * @param id
   */
  static detail(id: string) {
    return request<IBCaseGroup>({
      url: `${this.baseUrl}/get/${id}`,
      method: 'get'
    })
  }

  /**
   * 更新测试用例分组
   * @param id
   * @param data
   */
  static update(id: string, data: Partial<IBCaseGroup>) {
    return request<IBCaseGroup>({
      url: `${this.baseUrl}/update/${id}`,
      method: 'post',
      json: true,
      data
    })
  }

  /**
   * 获取分组下的用例数
   * @param groupId
   */
  static caseCount(groupId: string) {
    return request<number>({
      url: `${this.baseUrl}/caseCount`,
      method: 'get',
      params: { groupId }
    })
  }
}
