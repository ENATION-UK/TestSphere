import { IBPagerReq } from '@/types'
import { IBCaseStep, IBTesterStatusMap } from '@/types/tester'

/**
 * 用例运行记录状态
 */
export type IBCaseRecordStatus = keyof typeof IBTesterStatusMap

/**
 * 测试用例运行记录
 */
export interface IBCaseRecord {
  id: string
  // 任务ID
  taskId: string
  // 用例ID
  testCaseId: string
  // 测试用例名称
  testCaseName: string
  // 分组ID
  groupId: string
  // 运行状态
  status: IBCaseRecordStatus
  // 失败步骤ID
  failStepId: string
  // 失败步骤序号
  failStepNumber: number
  // 失败原因
  failReason: string
  // 失败截图
  failScreenshot: string
  // 执行时间
  runTime: string
  // 执行的用户名
  runUser: string
  // 运行时长，秒数
  duration: number
  // 步骤总数
  stepCount: number
  // 成功的步骤总数
  successStepCount: number
  // 记录中携带的步骤集合
  steps?: IBCaseStep[]
}

/**
 * 测试用例运行记录查询参数
 */
export interface IBCaseRecordQuery extends IBPagerReq {
  groupId?: string
  keyword?: string
  status?: IBCaseRecordStatus
  beginTime?: string
  endTime?: string
  taskId?: string
  caseId?: string
}

/**
 * 测试用例运行记录步骤详情查询参数
 */
export interface IBCaseRecordStepsQuery extends IBPagerReq {
  recordId: string
  keyword?: string
  status?: string
}
