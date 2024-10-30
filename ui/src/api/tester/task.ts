import { IBPagerRes } from '@/types'
import { IBCaseTask, IBCaseTaskQuery } from '@/types/tester'
import request from '@/utils/request'
import { useTesterParams } from '@/hooks/useTesterParams'

/**
 * 任务相关API
 */
export class TaskApi {
  private static get baseUrl() {
    const { projectId } = useTesterParams()
    return `/autotest/projects/${projectId}/task`
  }

  /**
   * 任务列表
   */
  static list(params: IBCaseTaskQuery) {
    return request<IBPagerRes<IBCaseTask>>({
      url: `${this.baseUrl}/list`,
      method: 'get',
      params
    })
  }

  /**
   * 停止运行任务
   * @param taskId
   */
  static stop(taskId: string) {
    return request<void>({
      url: `${this.baseUrl}/stop/${taskId}`,
      method: 'post'
    })
  }
}
