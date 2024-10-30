import { IBPagerReq, IBPagerRes } from '@/types'
import { IBCaseStep } from '@/types/tester'
import request from '@/utils/request'
import { useTesterParams } from '@/hooks/useTesterParams'

/**
 * 测试用例步骤相关API
 */
export class StepApi {
  /**
   * 基础URL
   * @private
   */
  private static get baseUrl() {
    const { projectId, caseId } = useTesterParams()
    return `/autotest/projects/${projectId}/test-case/${caseId}/steps`
  }

  /**
   * 添加测试用例步骤
   * @param data
   */
  static add(data: Partial<IBCaseStep>) {
    return request<void>({
      url: `${this.baseUrl}/add`,
      method: 'post',
      json: true,
      data
    })
  }

  /**
   * 批量添加测试用例步骤
   * @param data
   * @param caseId
   * @param prevStepId
   */
  static batchAdd(data: Array<Partial<IBCaseStep>>, caseId: string, prevStepId?: string) {
    return request<void>({
      url: `${this.baseUrl}/batch-add`,
      method: 'post',
      json: true,
      data,
      params: { caseId, prevStepId }
    })
  }

  /**
   * 删除测试用例步骤
   * @param id
   */
  static delete(id: string) {
    return request<void>({
      url: `${this.baseUrl}/delete/${id}`,
      method: 'post'
    })
  }

  /**
   * 清空所有步骤
   */
  static clearAll(caseId: string) {
    return request<void>({
      url: `${this.baseUrl}/empty`,
      method: 'post',
      params: { caseId }
    })
  }

  /**
   * 获取测试用例步骤详情
   * @param id
   */
  static detail(id: string) {
    return request<IBCaseStep>({
      url: `${this.baseUrl}/get/${id}`,
      method: 'get'
    })
  }

  /**
   * 更新步骤
   * @param id
   * @param data
   */
  static update(id: string, data: Partial<IBCaseStep>) {
    return request({
      url: `${this.baseUrl}/update/${id}`,
      method: 'post',
      json: true,
      data
    })
  }

  /**
   * 测试用例步骤列表
   * @param params
   */
  static steps(params: IBPagerReq & { keyword?: string; status?: string }) {
    return request<IBPagerRes<IBCaseStep>>({
      url: `${this.baseUrl}/list`,
      method: 'get',
      params
    })
  }

  /**
   * 获取测试用例所有步骤
   */
  static allSteps() {
    return request<IBCaseStep[]>({
      url: `${this.baseUrl}/list-all`,
      method: 'get'
    })
  }

  /**
   * 获取运行所需要的所有步骤
   */
  static listForRun() {
    return request<IBCaseStep[]>({
      url: `${this.baseUrl}/list-for-run`,
      method: 'get'
    })
  }
}
