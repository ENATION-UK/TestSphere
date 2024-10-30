import { cloneDeep } from 'lodash-es'
import { IBBase } from './base'

/**
 * 分支
 */
export class IBBranch extends IBBase {
  // 分支ID
  id!: string
  // 分支名称
  name!: string
  // 项目ID
  projectId!: string
  // 创建者ID
  creatorId!: string
  // 创建人
  creatorNickname!: string

  constructor(branch: Partial<IBBranch>) {
    super()
    this.updateValues(branch)
  }

  /**
   * 更新内部值
   * @param branch
   */
  updateValues(branch: Partial<IBBranch>) {
    branch = cloneDeep(branch)
    Object.keys(branch).forEach((key) => {
      this[key] = branch[key]
    })
  }
}
