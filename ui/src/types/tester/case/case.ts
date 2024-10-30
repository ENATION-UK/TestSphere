import { IBPagerReq } from '@/types'
import { IBTesterStatus } from '@/types/tester'

/**
 * 用例
 */
export interface IBCase {
  id: string
  name: string
  userId: string
  groupId: string
  groupSn: string
  isRun: 0 | 1
  createTime: string
  oldSn?: string
  lastUpdateTime: string
  lastRunTime: string
  lastRunStatus: IBTesterStatus
  lastRunUser: string
  baseUrl?: string
  screenWidth?: number
  screenHeight?: number
}

/**
 * 测试用例查询参数
 */
export interface IBCaseQuery extends IBPagerReq {
  groupId?: string
  keyword?: string
  status?: IBTesterStatus | 'any_failed' | ''
}

/**
 * 测试用例步骤
 */
export interface IBCaseStep {
  id: string
  name: string
  testCaseId: string
  stepNumber: number
  runOnCondition: 0 | 1
  runCondition: string
  actionType: string
  actionTarget: string
  actionValue: string
  stepType: string
  valueType: string
  lastRunTime?: string
  lastRunStatus?: IBTesterStatus
  lastRunUser?: string
  failScreenshot?: string
  failReason?: string
  prevStepId?: string
  childSteps?: IBCaseStep[]
  selector: string[]
  locator?: string
}

// 用例运行返回值
export interface IBCaseRunRes {
  duration: number
  failReason?: string
  failScreenshot?: string
  failStepId?: string
  failStepNumber?: number
  groupId?: string
  id: string
  result?: string
  runTime: string
  runUser?: string
  testCaseId: string
}

/**
 * 用例运行模式
 */
export type IBCaseRunMode = 'local' | 'remote'
