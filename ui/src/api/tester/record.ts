import { IBPagerRes } from '@/types'
import { IBCaseRecord, IBCaseRecordQuery, IBCaseRecordStepsQuery, IBCaseStep } from '@/types/tester'
import request from '@/utils/request'
import { useTesterParams } from '@/hooks/useTesterParams'

/**
 * 测试用例运行记录
 */
export class RecordApi {
  /**
   * 基础URL
   * @private
   */
  private static get baseUrl() {
    const { projectId } = useTesterParams()
    return `/autotest/projects/${projectId}/run-record`
  }
  /**
   * 运行记录列表
   * @param params
   */
  static list(params: IBCaseRecordQuery) {
    const p = JSON.parse(JSON.stringify(params)) as Record<string, any>
    if (params.status === 'all') p.status = ''
    return request<IBPagerRes<IBCaseRecord>>({
      url: `${this.baseUrl}/list`,
      method: 'get',
      params: p
    })
  }

  /**
   * 停止运行测试用例
   * @param recordId
   */
  static stop(recordId: string) {
    return request<void>({
      url: `${this.baseUrl}/stop`,
      method: 'post',
      params: { recordId }
    })
  }

  /**
   * 获取记录详情
   * @param recordId
   */
  static detail(recordId: string) {
    return request<IBCaseRecord>({
      url: `${this.baseUrl}/${recordId}/detail`,
      method: 'get'
    })
  }

  /**
   * 获取记录步骤列表
   * @param params
   */
  static steps(params: IBCaseRecordStepsQuery) {
    return request<IBPagerRes<IBCaseStep>>({
      url: `/autotest/run-record-step/list`,
      method: 'get',
      params
    })
  }

  /**
   * 根据用例ID查询正在运行的记录
   * @param caseId
   */
  static runningRecord(caseId: string) {
    return request<IBCaseRecord>({
      url: `${this.baseUrl}/case/${caseId}`,
      method: 'get'
    })
  }
}
