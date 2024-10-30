/**
 * 步骤类型
 */
export type IBDemandStepType = 'analysis' | 'databaseModeling'

/**
 * 需求运行状态
 */
export type IBDemandStatus = 'RUNNING' | 'COMPLETED' | 'FAILED' | 'STOPPED'

/**
 * 步骤状态
 */
export type IBDemandStepStatus = IBDemandStatus | 'UNKNOWN'

/**
 * 需求
 */
export interface IBDemand {
  id: string
  // 公司ID
  companyId: string
  // 项目ID
  projectId: string
  // 需求标题
  title: string
  // 需求内容
  content: string
  // 需求状态
  status: IBDemandStatus
  // 当前步骤
  currentStep: IBDemandStepType
  // 创建时间
  createdAt: string
}

/**
 * 需求运行SEE消息
 */
export interface IBDemandRunMessage {
  requirementId: string
  currentStep: IBDemandStepType
  status: IBDemandStatus
}

export const IBBatchStatusMap = {
  COMPLETED: '',
  STARTING: '',
  STARTED: '',
  STOPPING: '',
  STOPPED: '',
  FAILED: '',
  ABANDONED: '',
  UNKNOWN: ''
} as const
export type IBBatchStatus = keyof typeof IBBatchStatusMap

/**
 * 需求步骤执行消息
 */
export interface IBDemandStepRunMessage {
  logContent: string
  logGroup:
    | 'analysis.result'
    | 'databaseModeling.result'
    | 'crudDevDetailDesign.result'
    | 'generateCode.result'
    | string
  pipelineExecutionId: string
  pipelineExecutionStatus: string | null
  projectId: string
  stepExecutionId: number
  stepExecutionStatus: IBBatchStatus
  stepId: IBDemandStepType
  type: 'STATUS'
}

/**
 * 同步步骤到IDE
 */
export interface IBSyncStepInfoToIdeBody {
  // 是否推步骤的所有日志
  allLogGroups: boolean
  // 步骤日志
  logGroups?: any[]
  // 插件ID
  pluginId: string
  // 需求ID
  requirementId: string
  // 步骤运行ID
  stepExecutionId: number
}
