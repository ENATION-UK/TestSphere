import { cloneDeep } from 'lodash-es'
import { defineStore } from 'pinia'
import { IBPagerRes } from '@/types'
import { IBCaseTask, IBCaseTaskQuery } from '@/types/tester'
import { TaskApi } from '@/api/tester'

interface TasksState {
  loading: boolean
  params: Required<IBCaseTaskQuery>
  dateRange: [number, number] | null
  taskRes: IBPagerRes<IBCaseTask>
}

export const useTasksStore = defineStore('case/tasks', {
  state: (): TasksState => ({
    loading: false,
    params: { pageNo: 1, pageSize: 10, status: 'all', keyword: '', beginTime: '', endTime: '' },
    dateRange: null,
    taskRes: { pages: 0, current: 1, size: 10, total: 0, records: [] }
  }),
  actions: {
    /**
     * 获取任务列表
     */
    async getTaskList() {
      const params = cloneDeep(this.params) as IBCaseTaskQuery
      if (this.dateRange && this.dateRange[0]) {
        params.beginTime = String((this.dateRange[0] / 1000).toFixed(0))
      } else {
        delete params.beginTime
      }
      if (this.dateRange && this.dateRange[1]) {
        params.endTime = String((this.dateRange[1] / 1000 + 86400).toFixed(0))
      } else {
        delete params.endTime
      }
      if (this.params.status === 'all') {
        delete params.status
      }
      if (!this.params.keyword) delete params.keyword
      this.loading = true
      try {
        this.taskRes = await TaskApi.list(params)
      } finally {
        this.loading = false
      }
    },
    /**
     * 切换当前页
     * @param page
     */
    onPageChange(page: number) {
      this.params.pageNo = page
      this.getTaskList()
    },
    // 搜索
    async onSearch() {
      this.params.pageNo = 1
      await this.getTaskList()
    },
    /**
     * 停止一个任务
     * @param task
     */
    stopTask(task: IBCaseTask) {
      return TaskApi.stop(task.taskId)
    },
    /**
     * 更改任务状态，从socket来的
     * @param data
     */
    changeStatusBySocket(data: IBCaseTask) {
      const task = this.taskRes.records.find((item) => item.taskId === data.taskId)
      if (!task) return
      task.status = data.status
      task.successCount = data.successCount
      task.failureCount = data.failureCount
    }
  },
  getters: {
    tasks: (state): IBCaseTask[] => state.taskRes.records,
    pagination: (state) => ({
      page: state.taskRes.current,
      pageSize: state.taskRes.size,
      pageCount: state.taskRes.pages,
      itemCount: state.taskRes.total
    })
  }
})
