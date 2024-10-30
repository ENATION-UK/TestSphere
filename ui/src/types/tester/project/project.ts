import { snowflake } from '@/utils'

/**
 * 自动化测试项目
 */
export class IBTesterProject {
  id: string
  name: string
  userId?: string
  companyId?: string
  createTime?: string
  baseUrl: string
  screenWidth?: number
  screenHeight?: number

  constructor(project?: IBTesterProject) {
    this.id = project?.id || snowflake.generate()
    this.name = project?.name || 'newProject'
    this.userId = project?.userId
    this.companyId = project?.companyId
    this.createTime = project?.createTime
    this.baseUrl = project?.baseUrl || ''
    this.screenWidth = project?.screenWidth
    this.screenHeight = project?.screenHeight
  }
}
