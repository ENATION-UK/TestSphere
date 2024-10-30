import { cloneDeep } from 'lodash-es'
import { defineStore } from 'pinia'
import { IBCase, IBCaseStep } from '@/types/tester'
import { useCaseStepStore } from '@/store/tester/useCaseStepStore'
import { useRunCaseStore } from '@/store/tester/useRunCaseStore'
import { useTesterProjectStore } from '@/store/tester/useTesterProjectStore'
import { CaseApi, StepApi } from '@/api/tester'

interface CaseState {
  loading: boolean
  case: IBCase | null
  stepsLoading: boolean
  steps: IBCaseStep[]
  notFound: boolean
}

export const useCaseStore = defineStore('case', {
  state: (): CaseState => ({
    loading: false,
    case: null,
    stepsLoading: false,
    steps: [],
    notFound: false
  }),
  actions: {
    /**
     * 获取用例详情
     * @param caseId
     */
    async getCase(caseId: string): Promise<IBCase> {
      this.loading = true
      try {
        const c = await CaseApi.detail(caseId)
        this.case = cloneDeep(c)
        return cloneDeep(c)
      } catch (e) {
        if (e.code === 'NOT_FOUND_ERROR') {
          this.notFound = true
          return Promise.reject()
        }
        window.$dialog.error(e.message)
        return Promise.reject()
      } finally {
        this.loading = false
      }
    },
    /**
     * 更新用例
     * @param caseId
     * @param ibCase
     */
    async updateCase(caseId: string, ibCase: Partial<IBCase>) {
      await CaseApi.update(caseId, ibCase)
      await this.getCase(caseId)
    },
    /**
     * 获取用例所有步骤
     */
    async getSteps(): Promise<IBCaseStep[]> {
      this.stepsLoading = true
      try {
        const steps = await StepApi.listForRun()
        this.steps = steps.map((item) => {
          item.lastRunStatus = undefined
          item.failScreenshot = undefined
          item.failReason = undefined
          return item
        })
        return cloneDeep(this.steps)
      } finally {
        this.stepsLoading = false
      }
    },
    /**
     * 删除步骤
     * @param stepId
     */
    async deleteStep(stepId: string) {
      await window.$confirm(window.$t('tester.del_step_confirm'), { type: 'warning' }, async () => {
        await StepApi.delete(stepId)
        const index = this.steps.findIndex((item) => item.id === stepId)
        if (index !== -1) {
          this.steps.splice(index, 1)
        }
        const stepStore = useCaseStepStore()
        if (stepStore.step?.id === stepId) {
          stepStore.resetForm()
        }
      })
    },
    /**
     * 清空所有步骤
     */
    async clearSteps() {
      await StepApi.clearAll(this.case!.id)
      this.steps = []
    },
    /**
     * 添加空步骤
     * @param prevStepId
     */
    async addEmptyStep(prevStepId?: string) {
      const step = {} as IBCaseStep
      step.name = window.$t('tester.new_step')
      step.stepType = 'step'
      step.actionType = 'UI_INPUT'
      step.actionValue = ''
      step.prevStepId = prevStepId
      step.testCaseId = this.case!.id
      await StepApi.add(step)
      await this.getSteps()
    },
    /**
     * 更新步骤
     * @param step
     */
    updateStep(step?: IBCaseStep) {
      if (!step) return
      const index = this.steps.findIndex((item) => item.id === step.id)
      if (index !== -1) {
        this.steps.splice(index, 1, cloneDeep(step))
      }
    },
    /**
     * 更新步骤locator
     * @param stepId
     * @param newLocator
     * @param newActionTarget
     */
    async updateStepLocator(stepId: string, newLocator: string, newActionTarget: string) {
      let step = findStep(this.steps, stepId)
      if (!step) return
      const data: Record<string, any> = {}
      data.locator = newLocator
      data.actionTarget = newActionTarget
      await StepApi.update(stepId, data)
      const res = await StepApi.detail(stepId)
      step.selector = res.selector
      step.actionTarget = res.actionTarget
      useRunCaseStore().updateStep(step)
    }
  },
  getters: {
    // 基础URL
    baseUrl(state): string {
      return state.case?.baseUrl || useTesterProjectStore().project?.baseUrl || ''
    },
    // 分辨率
    resolution(state): string {
      let resolution = ''
      const projectStore = useTesterProjectStore()
      let pw = projectStore.project?.screenWidth
      let ph = projectStore.project?.screenHeight
      if (pw && ph) {
        resolution = `${pw}x${ph}`
      }
      if (!state.case) return resolution
      const { screenWidth: cw, screenHeight: ch } = state.case!
      if (cw && ch) {
        resolution = `${cw}x${ch}`
      }
      return resolution
    }
  }
})

function findStep(steps: IBCaseStep[], stepId: string): IBCaseStep | null {
  for (let i = 0; i < steps.length; i++) {
    if (steps[i].id === stepId) return steps[i]
    const { childSteps } = steps[i]
    if (Array.isArray(childSteps)) {
      const s = findStep(steps[i].childSteps!, stepId)
      if (s) return s
    }
  }
  return null
}
