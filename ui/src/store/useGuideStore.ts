import { defineAsyncComponent, h, nextTick } from 'vue'
import { defineStore } from 'pinia'
import { IBGuide, IBGuideKey, IBGuideStep } from '@/types'

interface GuideState {
  // 当前导览
  currentGuide: IBGuide | undefined
  // 记录步骤的当前步骤数，-1为不再提示
  steps: Record<IBGuideKey, number>
  // 导览队列
  queue: IBGuideKey[]
  // 导览列表
  guides: IBGuide[]
  // 遮罩样式
  maskStyles: string
  // 弹窗样式
  popupStyles: string
  // ER图导览弹框
  diagramModal: boolean
}

export const useGuideStore = defineStore('guide', {
  persist: {
    paths: ['steps', 'diagramModal']
  },
  state: (): GuideState => ({
    currentGuide: undefined,
    steps: {},
    queue: [],
    guides: [],
    maskStyles: '',
    popupStyles: '',
    diagramModal: true
  }),
  actions: {
    // 添加导览
    addGuide(guide: IBGuide) {
      const { key } = guide
      // 如果有添加过，不再添加
      if (this.guides.find((item) => item.key === key)) return
      // 如果完成过导览，不再添加
      if (this.steps[key] === -1) return
      this.queue.push(key)
      this.guides.push(guide)
      this.steps[key] = 0
      if (!this.currentGuide) {
        this.nextGuide()
      }
    },
    // 下一步
    nextStep() {
      if (!this.currentGuide) return this.nextGuide()
      if (typeof this.currentStep?.afterShow === 'function') {
        typeof this.currentStep!.afterShow()
      }
      const key = this.currentGuide.key
      const step = this.steps[key]
      if (step === -1) return this.nextGuide()
      // 如果当前步骤是最后一步，关闭导览
      if (step === this.currentGuide.steps.length - 1) {
        this.close()
      } else {
        this.steps[key] += 1
        this.showGuide()
      }
    },
    // 下一个导览
    nextGuide() {
      const key = this.queue.shift()
      // 如果最后一个都没有了，重置一下样式，防止弹框漂移
      if (!key) {
        this.maskStyles = ''
        this.popupStyles = ''
        return
      }
      this.currentGuide = this.guides.find((guide) => guide.key === key)
      this.showGuide()
    },
    // 显示导览
    async showGuide() {
      if (!this.currentGuide) return
      const { currentStep } = this
      if (!currentStep) return
      const { selector, placement, offset } = currentStep
      if (typeof currentStep.beforeShow === 'function') {
        currentStep.beforeShow()
      }
      await nextTick()
      const rect = await waitRectReady(selector)
      const { width, height, x, y } = rect
      const gx = x + width / 2
      const gy = y + height / 2
      this.maskStyles = `background:radial-gradient(circle at ${gx}px ${gy}px, rgba(50, 50, 50, 0), rgba(80, 80, 80, 0.3), rgba(80, 80, 80, 0.5), rgba(80, 80, 80, 0.7), rgba(80, 80, 80, 0.8), rgba(80, 80, 80, 0.9))`
      const popupStyles: string[] = []
      let top = y
      let left = x
      switch (placement) {
        case 'bottom-start':
          left += width / 2
          left -= 26
          top += height
          top += 15
          break
        case 'bottom-end':
          left -= 390
          left += width
          left += 26
          top += height
          top += 15
          break
        case 'right-start':
          left += width
          left += 20
          top += height / 2
          top -= 26
          break
      }
      if (offset) {
        top += offset.y || 0
        left += offset.x || 0
      }

      popupStyles.push(`top:${top}px`)
      popupStyles.push(`left:${left}px`)
      this.popupStyles = popupStyles.join(';')
    },
    // 关闭导览
    close() {
      if (typeof this.currentStep?.afterShow === 'function') {
        typeof this.currentStep!.afterShow()
      }
      const key = this.currentGuide!.key
      this.currentGuide = undefined
      this.steps[key] = -1
      this.nextGuide()
    },

  },
  getters: {
    currentStep(state): IBGuideStep | undefined {
      if (!state.currentGuide) return
      const stepIndex = state.steps[state.currentGuide.key]
      return state.currentGuide.steps[stepIndex]
    },
    currentSteps(state): IBGuideStep[] {
      return state.currentGuide?.steps || []
    },
    onlyOneStep(state): boolean {
      if (!state.currentGuide) return false
      return state.currentGuide.steps.length === 1
    }
  }
})

let observer: MutationObserver | undefined = undefined
function waitRectReady(selector: string): Promise<DOMRect> {
  return new Promise((resolve) => {
    let eleList = document.querySelectorAll(selector)
    let len = eleList.length
    if (len > 0) {
      resolve(eleList.item(len - 1).getBoundingClientRect())
      return
    }
    if (observer) observer.disconnect()
    observer = new MutationObserver((_, observer) => {
      eleList = document.querySelectorAll(selector)
      len = eleList.length
      if (len > 0) {
        resolve(eleList.item(len - 1).getBoundingClientRect())
        observer.disconnect()
      }
    })
    observer.observe(<Element>document.querySelector('#app'), { childList: true, subtree: true })
  })
}
