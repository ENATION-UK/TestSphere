import { cloneDeep } from 'lodash-es'
import { defineStore } from 'pinia'
import { IBCaseStep } from '@/types/tester'
import { useRecordStore } from '@/store/tester/useRecordStore'
import { useRunCaseStore } from '@/store/tester/useRunCaseStore'
import { StepApi } from '@/api/tester'
import { isRecordStep } from '@/views/tester/case/helper'
import { useCaseStore } from './useCaseStore'

interface CaseStepState {
  step: IBCaseStep | null
  stepForm: IBCaseStep
}

const emptyForm = {
  id: '',
  name: '',
  actionType: '',
  actionValue: '',
  actionTarget: '',
  stepType: 'step'
}

export const useCaseStepStore = defineStore('case/step', {
  state: (): CaseStepState => ({
    step: null,
    stepForm: cloneDeep(emptyForm) as IBCaseStep
  }),
  actions: {
    /**
     * 设置表单
     * @param step
     */
    setForm(step: IBCaseStep) {
      this.step = step
      this.stepForm = cloneDeep(step)
    },
    /**
     * 重置表单
     */
    resetForm() {
      this.step = null
      this.stepForm = cloneDeep(emptyForm) as IBCaseStep
    },
    /**
     * 保存表单
     */
    async saveStepForm() {
      const stepId = this.step!.id
      // 如果是录制的步骤，直接在本地修改
      if (isRecordStep(stepId)) {
        useRecordStore().updateStep(stepId, cloneDeep(this.stepForm))
        this.step = cloneDeep(this.stepForm as IBCaseStep)
        return
      }
      await StepApi.update(this.step!.id, this.stepForm)
      this.step = cloneDeep(this.stepForm as IBCaseStep)
      useCaseStore().updateStep(this.step)
      useRunCaseStore().updateStep(this.step)
    }
  }
})
