import { defineStore } from 'pinia'
import { IBPagerRes } from '@/types'
import { IBCaseRecord, IBCaseRecordQuery, IBCaseTask } from '@/types/tester'
import { RecordApi } from '@/api/tester'

interface TaskState {
  task: IBCaseTask | null
  loading: boolean
  params: IBCaseRecordQuery
  recordRes: IBPagerRes<IBCaseRecord>
}

export const useTaskStore = defineStore('case/task', {
  state: (): TaskState => ({
    task: null,
    loading: false,
    params: { taskId: '', pageNo: 1, pageSize: 10, status: 'all' },
    recordRes: { pages: 0, current: 1, size: 10, total: 0, records: [] }
  }),
  actions: {
    /**
     * 获取任务记录列表
     */
    async getRecordList() {
      this.loading = true
      this.params.taskId = this.task?.taskId
      try {
        this.recordRes = await RecordApi.list(this.params)
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
      this.getRecordList()
    },
    /**
     * 更改任务状态，从socket来的
     * @param data
     */
    changeTaskBySocket(data: IBCaseTask) {
      if (!data || data.taskId !== this.task?.taskId) return
      this.task = data
    },
    /**
     * 更改任务记录
     * @param data
     */
    changeRecordBySocket(data: IBCaseRecord) {
      if (!data || data.taskId !== this.task?.taskId) return
      const index = this.recordRes.records.findIndex((item) => item.id === data.id)
      if (index === -1) return
      this.recordRes.records[index] = data
    }
  },
  getters: {
    records: (state): IBCaseRecord[] => state.recordRes.records,
    pagination: (state) => ({
      page: state.recordRes.current,
      pageSize: state.recordRes.size,
      pageCount: state.recordRes.pages,
      itemCount: state.recordRes.total
    })
  }
})
