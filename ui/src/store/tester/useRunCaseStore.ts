import { cloneDeep } from 'lodash-es'
import { defineStore } from 'pinia'
import { IBCase, IBCaseRecord, IBCaseRecordStatus, IBCaseRunMode, IBCaseStep, IBTesterStatus } from '@/types/tester'
import { useCaseStore } from '@/store/tester/useCaseStore'
import { useTesterExt } from '@/hooks/useTesterExt'
import { RecordApi } from '@/api/tester'

interface RunCaseState {
  record: IBCaseRecord | null
  statusMap: Record<string, IBTesterStatus | undefined>
  case?: IBCase
  runMode: IBCaseRunMode
}

const runTimeMap = {}

export const useRunCaseStore = defineStore('case/run', {
  persist: { paths: ['runMode'] },
  state: (): RunCaseState => ({
    record: null,
    statusMap: {},
    case: undefined,
    runMode: 'local'
  }),
  actions: {
    // 运行测试用例
    async runCase(params: { recordId: string; steps: IBCaseStep[]; remote: boolean }) {
      this.case!.lastRunStatus = 'starting'
      window.addEventListener('message', this.listenerMessage.bind(this))
      let steps = cloneDeep(params.steps)
      steps = steps.map((item, index) => {
        item.lastRunStatus = undefined
        this.statusMap[item.id] = index === 0 ? 'running' : undefined
        return item
      })
      this.record = { id: params.recordId, status: 'running', steps } as IBCaseRecord

      if (params.remote) return
      // 本地运行
      this.runSteps(params.recordId, steps)
    },
    async runSteps(recordId: string, steps: IBCaseStep[], isChild = false) {
      for (let i = 0; i < steps.length; i++) {
        const step = steps[i]
        step.lastRunStatus = 'running'
        this.statusMap[step.id] = 'running'
        if (step.stepType === 'test_case' && Array.isArray(step.childSteps)) {
          try {
            // 如果是子用例并且有执行条件，先运行执行条件
            if (step.runOnCondition === 1 && step.runCondition) {
              const conditionJson: Record<string, any> = JSON.parse(step.runCondition)
              conditionJson.action = 'RUN_STEP'
              conditionJson.stepType = 'check'
              conditionJson.actionValue = JSON.stringify({
                check_type: conditionJson.check_type,
                attr_name: conditionJson.attr_name,
                attr_value: conditionJson.attr_value
              })
              const s = conditionJson as IBCaseStep
              s.id = step.id
              await this.runStep(s, recordId, false, true)
            }
            await this.runSteps(recordId, step.childSteps, true)
            this.changeStepStatus(recordId, step.id, { status: 'success' })
          } catch (e) {
            if (typeof e === 'object' && e.condition) {
              // 如果是子用例执行条件，标记成功，并不return
              this.changeStepStatus(recordId, step.id, { status: 'success' })
            } else {
              this.changeStepStatus(recordId, step.id, { status: 'failed', failReason: e })
              return
            }
          }
        } else {
          try {
            await this.runStep(step, recordId, isChild)
          } catch (e) {
            this.changeStepStatus(recordId, step.id, { status: 'failed', failReason: e })
            this.changeRecordStatus(recordId, 'terminated')
            return Promise.reject(e)
          }
        }
      }
      if (isChild) return
      chrome.runtime.sendMessage(useTesterExt().extId, { action: 'STOP_RUN_STEP' }, () => {
        this.changeRecordStatus(recordId, 'completed')
      })
    },
    async runStep(step: IBCaseStep, recordId: string, isChild = false, isCondition = false): Promise<void> {
      const runTimeKey = `${recordId}|${step.id}`
      runTimeMap[runTimeKey] = Date.now()
      return new Promise((resolve, reject) => {
        const params = cloneDeep(step) as Record<string, any>
        if (params.actionType === 'OPEN_URL') {
          params.screenWidth = this.case?.screenWidth
          params.screenHeight = this.case?.screenHeight
        }
        chrome.runtime.sendMessage(useTesterExt().extId, { action: 'RUN_STEP', recordId, ...params }, (response) => {
          if (response && typeof response === 'object') {
            const { status, failReason, newLocator, newActionTarget } = response
            if (status === 'failed') {
              if (isCondition) return reject({ condition: true })
              reject(failReason)
              return
            }
            if (status === 'success' && newLocator && newActionTarget) {
              useCaseStore().updateStepLocator(step.id, newLocator, newActionTarget)
            }
          }
          if (isChild) return resolve()
          this.changeStepStatus(recordId, step.id, response) ? resolve() : reject(response)
        })
      })
    },
    async stopRun(recordId: string) {
      chrome.runtime.sendMessage(useTesterExt().extId, { action: 'STOP_RUN_STEP' }, () => {
        this.changeRecordStatus(recordId, 'terminated')
        window.$message.success(window.$t('tester.stopped_run'))
      })
    },
    // 获取用例正在运行的最近一条记录
    async getRunningRecord() {
      if (!this.case) return
      const record = await RecordApi.runningRecord(this.case.id)
      if (!record) return
      const recordSteps = Array.isArray(record.steps) ? cloneDeep(record.steps) : []
      const { steps } = useCaseStore()
      const caseSteps = Array.isArray(steps) ? cloneDeep(steps) : []
      record.steps = caseSteps.map((item) => {
        const step = recordSteps.find((s) => s.id === item.id)
        return step || item
      })
      record.steps.forEach((item, index) => {
        this.statusMap[item.id] = index === 0 && recordSteps.length === 0 ? 'running' : item.lastRunStatus
      })
      this.record = record
      this.case.lastRunStatus = record.status
    },
    // 改变记录的状态
    changeRecordStatus(recordId: string, status: IBCaseRecordStatus) {
      if (this.record?.id !== recordId) return
      if (status !== 'running') {
        window.removeEventListener('message', this.listenerMessage.bind(this))
      }
      this.case!.lastRunStatus = status
      if (this.record.status === 'terminated') return
      this.record.status = status
      if (['terminated', 'error', 'failed', 'completed'].includes(status)) {
        Object.keys(this.statusMap).forEach((key) => {
          if (this.statusMap[key] === 'running') {
            this.statusMap[key] = undefined
          }
        })
      }
    },
    changeStepStatus(recordId: string, stepId: string, params: Record<string, any>) {
      if (this.record?.id !== recordId) return
      if (['completed', 'terminated'].includes(this.record.status)) return
      const s = this.record.steps?.find((item) => item.id === stepId)
      if (!s || !params) return
      this.statusMap[stepId] = params.status
      s.lastRunStatus = params.status
      s.failReason = params.failReason
      s.failScreenshot = params.failScreenshot
      if (params.status === 'failed') {
        this.changeRecordStatus(recordId, 'failed')
      }
      return params.status !== 'failed'
    },
    listenerMessage(ev: MessageEvent) {
      if (!ev.data.ibTest || ev.data.action !== 'windowClosed') return
      const { recordId } = ev.data
      if (this.record?.id !== recordId) return
      this.changeRecordStatus(recordId, 'terminated')
    },
    // 更新步骤
    updateStep(step?: IBCaseStep) {
      if (!step) return
      const index = this.steps.findIndex((item) => item.id === step.id)
      if (index !== -1) {
        this.record!.steps?.splice(index, 1, cloneDeep(step))
      }
    }
  },
  getters: {
    steps(state): IBCaseStep[] {
      return state.record?.steps || []
    }
  }
})
