/**
 * 用例分组
 */
export interface IBCaseGroup {
  id: string
  sn: string
  name: string
  parentId: string
  createTime: string
  projectId: string
  children: IBCaseGroup[]
  // 分组下用例总数
  caseCount: number
  // 分组下（包含子分组）用例总数
  deepCaseCount: number
}
