import { IBPagerRes } from '@/types'
import { ProjectListQuery } from '@/types/project'
import { IBTesterProject } from '@/types/tester'
import request from '@/utils/request'

/**
 * 项目相关API
 */
export class TesterProjectApi {
  // 基础URL
  static baseUrl = '/autotest/projects'
  /**
   * 获取项目列表
   * @param params
   */
  static async projects(params: ProjectListQuery) {
    return request<IBPagerRes<IBTesterProject>>({
      url: this.baseUrl,
      method: 'get',
      params
    })
  }

  /**
   * 获取项目详情
   * @param projectId
   */
  static detail(projectId: string) {
    return request<IBTesterProject>({
      url: `${this.baseUrl}/${projectId}`,
      method: 'get'
    })
  }

  /**
   * 创建项目
   * @param project
   */
  static create(project: Partial<IBTesterProject>) {
    return request<IBTesterProject>({
      url: this.baseUrl,
      method: 'post',
      showMessage: false,
      data: project
    })
  }

  /**
   * 删除项目
   * @param projectId
   */
  static delete(projectId: string) {
    return request<void>({
      url: `${this.baseUrl}/${projectId}`,
      method: 'delete'
    })
  }

  /**
   * 更新项目
   * @param projectId
   * @param project
   */
  static update(projectId: string, project: Partial<IBTesterProject>) {
    return request<IBTesterProject>({
      url: `${this.baseUrl}/${projectId}`,
      method: 'put',
      showMessage: false,
      data: project
    })
  }
}
