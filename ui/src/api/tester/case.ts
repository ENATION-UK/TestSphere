import { IBPagerRes } from '@/types'
import { IBCase, IBCaseQuery, IBCaseRunRes, IBCaseStat } from '@/types/tester'
import request from '@/utils/request'
import { useTesterParams } from '@/hooks/useTesterParams'

/**
 * 测试用例相关API
 */
export class CaseApi {
  /**
   * 基础URL
   * @private
   */
  private static get baseUrl() {
    const { projectId } = useTesterParams()
    return `/autotest/projects/${projectId}/test-case`
  }
  /**
   * 添加测试用例
   * @param data
   */
  static add(data: Partial<IBCase>) {
    return request<IBCase>({
      url: `${this.baseUrl}/add`,
      method: 'post',
      data
    })
  }

  /**
   * 更新测试用例
   * @param id
   * @param data
   */
  static update(id: string, data: Partial<IBCase>) {
    return request<IBCase>({
      url: `${this.baseUrl}/${id}/update`,
      method: 'put',
      json: true,
      data
    })
  }

  /**
   * 测试用例列表
   * @param params
   */
  static list(params: IBCaseQuery) {
    return request<IBPagerRes<IBCase>>({
      url: `${this.baseUrl}/list`,
      method: 'get',
      params
    })
  }

  /**
   * 运行测试用例
   * @param id
   */
  static run(id: string) {
    return request<IBCaseRunRes>({
      url: `${this.baseUrl}/${id}/run`,
      method: 'post',
      showMessage: false,
      params: { runAt: 'remote' }
    })
  }

  /**
   * 删除测试用例
   * @param id
   */
  static delete(id: string) {
    return request<void>({
      url: `${this.baseUrl}/${id}/delete`,
      method: 'delete'
    })
  }

  /**
   * 获取测试用例详情
   * @param id
   */
  static detail(id: string) {
    return request<IBCase>({
      url: `${this.baseUrl}/${id}/detail`,
      method: 'get',
      showMessage: false
    })
  }

  /**
   * 运行分组
   * @param groupId
   * @param taskName
   */
  static runGroup(groupId: string, taskName?: string) {
    return request({
      url: `${this.baseUrl}/run-by-group`,
      method: 'post',
      showMessage: false,
      params: { groupId, taskName }
    })
  }

  /**
   * 复制用例
   * @param caseId
   * @param name
   */
  static copy(caseId: string, name: string) {
    return request({
      url: `${this.baseUrl}/${caseId}/copy`,
      method: 'post',
      showMessage: false,
      params: { copyName: name }
    })
  }

  /**
   * 获取用例概览
   */
  static overview() {
    return request<IBCaseStat>({
      url: `${this.baseUrl}/overview`,
      method: 'get'
    })
  }
}
