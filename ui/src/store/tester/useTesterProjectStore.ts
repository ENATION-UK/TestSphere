import { cloneDeep } from 'lodash-es'
import { defineStore } from 'pinia'
import { IBTesterProject } from '@/types/tester'
import { TesterProjectApi } from '@/api/tester'

interface ProjectState {
  project: IBTesterProject | null
}

export const useTesterProjectStore = defineStore('tester/project', {
  state: (): ProjectState => ({
    project: null
  }),
  actions: {
    async getProject(projectId: string): Promise<IBTesterProject> {
      const project = await TesterProjectApi.detail(projectId)
      this.project = cloneDeep(project)
      return cloneDeep(project)
    }
  },
  getters: {
    // 分辨率
    resolutionText(state): string {
      if (!state.project) return ''
      const { screenWidth, screenHeight } = state.project
      if (!screenWidth || !screenHeight) return window.$t('not_configured')
      return `${screenWidth}x${screenHeight}`
    }
  }
})
