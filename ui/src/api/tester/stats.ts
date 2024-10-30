import { IBCaseStat } from '@/types/tester'
import request from '@/utils/request'
import { useTesterParams } from '@/hooks/useTesterParams'

/**
 * 测试用例统计相关API
 */
export class StatsApi {
  // 基础URL
  private static get baseUrl() {
    const { projectId } = useTesterParams()
    return `/autotest/projects/${projectId}`
  }

  /**
   * 获取用例统计记录
   * @param params
   */
  static statRecords(params?: { beginDate?: string; endDate?: string }) {
    return request<IBCaseStat[]>({
      url: `${this.baseUrl}/test-case-stats`,
      method: 'get',
      showMessage: false,
      params
    })
  }

  /**
   * 获取汇总统计
   * @param params
   */
  static statSum(params?: { beginDate?: string; endDate?: string }) {
    return request<IBCaseStat>({
      url: `${this.baseUrl}/test-case-stats/sum`,
      method: 'get',
      showMessage: false,
      params
    })
  }
}
