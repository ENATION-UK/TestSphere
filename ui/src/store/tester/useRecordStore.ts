import { capitalize } from 'lodash-es'
import { defineStore } from 'pinia'
import { IBCaseStep } from '@/types/tester'
import { useTesterExt } from '@/hooks/useTesterExt'

interface RecordState {
  caseId: string
  recording: boolean
  steps: IBCaseStep[]
  startIndex: number
}

export const useRecordStore = defineStore('case/record', {
  state: (): RecordState => ({
    caseId: '',
    recording: false,
    steps: [],
    startIndex: 0
  }),
  actions: {
    // 开始录制用例
    start(caseId: string, url: string, params = {}, startIndex = 0) {
      if (url.indexOf('http') !== 0) {
        url = `https://${url}`
      }
      chrome.runtime.sendMessage(useTesterExt().extId, { recordCaseStep: true, url, ...params }, () => {
        window.addEventListener('message', this.onMessageListener)
        this.caseId = caseId
        this.startIndex = startIndex + this.steps.length
        this.recording = true
      })
    },
    stop() {
      if (!this.recording) return
      chrome.runtime.sendMessage(useTesterExt().extId, { stopRecordCaseStep: true })
    },
    onMessageListener(e: MessageEvent) {
      if (!e.data.ibTest || !e.data.recordEvent) return
      const { event, events } = e.data
      if (!event || !events) return
      if (event.type === 'UI_STOP_RECORD') {
        this.recording = false
        this.removeListener()
        return
      }
      const { value, text } = event
      let name = ''
      if (event.type === 'OPEN_URL') {
        name = 'open'
      } else {
        name = event.type.replace(/UI_|TAB_/, '')
      }
      const step = {
        id: event.id,
        name: `${capitalize(name)} ${text || value || ''}`,
        actionType: event.type,
        actionTarget: event.selector,
        locator: event.locator,
        actionValue: value,
        stepType: 'step'
      } as IBCaseStep
      const lastEvent = this.steps[this.steps.length - 1]
      if (lastEvent && lastEvent.actionType === event.type) {
        if (event.type === 'TAB_CLOSE') {
          //
        } else if (lastEvent.actionTarget === event.selector) {
          this.steps.pop()
        }
      }
      this.steps.push(step as IBCaseStep)
    },
    removeListener() {
      window.removeEventListener('message', this.onMessageListener)
    },
    /**
     * 更新步骤数据
     * @param id
     * @param data
     */
    updateStep(id: string, data: Partial<IBCaseStep>) {
      const step = this.steps.find((item) => item.id === id)!
      for (const k in data) {
        step[k] = data[k]
      }
    },
    /**
     * 删除步骤
     * @param id
     */
    async deleteStep(id: string) {
      const index = this.steps.findIndex((item) => item.id === id)
      if (index === -1) return
      this.steps.splice(index, 1)
    },
    /**
     * 清空所有步骤
     */
    clearSteps() {
      this.recording = false
      this.steps = []
      this.startIndex = 0
    }
  }
})
