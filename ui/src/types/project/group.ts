import { IBBase } from './base'

/**
 * 分组
 */
export class IBGroup extends IBBase {
  // ID
  id!: string
  // 分组名称
  name!: string
  // 项目ID
  projectId!: string
  // 项目分支名称
  branchName!: string
  // 分组排序序号
  sequence!: number

  constructor(group?: Partial<IBGroup>) {
    super()
    this.updateValues(group)
  }

  /**
   * 更新内部值
   * @param group
   */
  updateValues(group?: Partial<IBGroup>) {
    if (group) {
      Object.keys(group).forEach((key) => {
        this[key] = group[key]
      })
    }
  }
}

/**
 * 分组
 */
export type IBGroupActiveType = 'demand' | 'table' | 'tables' | 'diagram' | null
