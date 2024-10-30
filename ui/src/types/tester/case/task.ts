import { IBPagerReq, IBTimeRange } from '@/types'
import { IBTesterStatusMap } from '@/types/tester'

export interface IBCaseTask {
  caseCount: number
  completeTime: string | null
  createTime: string
  creator: string
  failureCount: number
  projectId: string
  status: IBCaseTaskStatus
  successCount: number
  taskId: string
  taskName: string
  stat: IBCaseTaskStat
}

export type IBCaseTaskStatus = keyof typeof IBTesterStatusMap

export type IBCaseTaskQuery = IBPagerReq & IBTimeRange & { status?: IBCaseTaskStatus; keyword?: string }

export type IBCaseTaskStatType = 'allCount' | 'completedCount' | 'queuedCount' | 'runningCount'
/**
 * 任务运行状态数量统计
 */
export type IBCaseTaskStat = { taskId?: string } & {
  [k in IBCaseTaskStatType]: number
}
