import { SelectOption } from 'naive-ui'
import { IBPagerReq } from '@/types'
import { IBBase } from './base'

const projectTypeOptions = [
  { label: () => window.$t('personal'), value: 'personal' },
  { label: () => window.$t('company'), value: 'company' }
] as const
export const ProjectTypeOptions = projectTypeOptions as unknown as SelectOption[]
export type ProjectType = (typeof projectTypeOptions)[number]['value']

/**
 * 项目列表查询参数
 */
export interface ProjectListQuery extends IBPagerReq {
  keyword?: string
}

/**
 * 项目
 */
export class IBProject extends IBBase {
  // 项目ID
  id!: string
  // 项目名称
  name!: string
  // 所属者
  ownerId?: string
  // 描述
  description?: string
  // 项目类型
  type?: ProjectType

  constructor(project: Partial<IBProject>) {
    super()
    this.updateValues(project)
  }

  /**
   * 更新项目值
   * @param project
   */
  updateValues(project: Partial<IBProject>) {
    Object.keys(project).forEach((key) => {
      this[key] = project[key]
    })
  }
}

// 绘制区域类型
export type DrawType = 'model' | 'diagram' | 'table' | 'any'

// 工作台项目类型
export type WorkbenchProjectType = 'db-designer' | 'tester'

// 附加属性类型
const attachTypes = ['models', 'diagrams'] as const
export type AttachType = (typeof attachTypes)[number]

/**
 * AI点超出限制错误
 */
export interface IBAiPointLimitError {
  // 需要的AI点数
  requireAiPoints: number
  // 目前拥有的AI点数
  remainingAiPoints: number
}
