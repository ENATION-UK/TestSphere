import { defineStore } from 'pinia'
import { IBPagerRes } from '@/types'
import { ProjectListQuery } from '@/types/project'
import { IBTesterProject } from '@/types/tester'
import { TesterProjectApi } from '@/api/tester/project'

interface ProjectsState {
  // 参数
  params: ProjectListQuery
  // 加载状态
  loading: boolean
  // 响应
  res: IBPagerRes<IBTesterProject>
  // 显示youtube视频
  showYoutubeVideo: boolean
}

export const useTesterProjectsStore = defineStore('tester/projects', {
  persist: {
    paths: ['showYoutubeVideo']
  },
  state: (): ProjectsState => ({
    params: {
      pageNo: 1,
      pageSize: 999999,
      keyword: ''
    },
    loading: false,
    res: {
      pages: 0,
      records: []
    },
    showYoutubeVideo: true
  }),
  actions: {
    /**
     * 获取项目列表
     * @param params
     */
    async getProjects(params?: Partial<ProjectListQuery>) {
      this.params.pageNo = params?.pageNo || 1
      this.params.pageSize = params?.pageSize || 999999
      this.params.keyword = params?.keyword || ''
      try {
        this.loading = true
        this.res = await TesterProjectApi.projects(this.params)
      } finally {
        this.loading = false
      }
    },
    /**
     * 创建项目
     * @param project
     */
    async createProject(project: Partial<IBTesterProject>) {
      return TesterProjectApi.create(project)
    },
    /**
     * 删除项目
     * @param id
     */
    async deleteProject(id: string) {
      return TesterProjectApi.delete(id)
    },
    /**
     * 更新项目
     * @param id
     * @param name
     */
    async updateProject(id: string, name: string) {
      return TesterProjectApi.update(id, { name })
    }
  },
  getters: {
    // 项目列表
    projects(state) {
      return state.res.records
    }
  }
})
