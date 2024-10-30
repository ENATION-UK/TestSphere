import { cloneDeep } from 'lodash-es'
import { defineStore } from 'pinia'
import { IBPagerRes } from '@/types'
import { IBCaseRecord, IBCaseRecordQuery } from '@/types/tester'
import { RecordApi } from '@/api/tester'

interface HistoryState {
  loading: boolean
  params: Omit<Required<IBCaseRecordQuery>, 'caseId' | 'groupId' | 'taskId' | 'beginTime' | 'endTime'>
  historyRes: IBPagerRes<IBCaseRecord>
  dateRange: [number, number] | null
}

export const useHistoryStore = defineStore('case/history', {
  state: (): HistoryState => ({
    loading: false,
    params: {
      pageNo: 1,
      pageSize: 10,
      keyword: '',
      status: 'all'
    },
    historyRes: {
      current: 0,
      pages: 0,
      records: [],
      size: 0,
      total: 0
    },
    dateRange: null
  }),
  actions: {
    // 获取运行历史列表
    async getHistoryList() {
      let params = cloneDeep(this.params) as IBCaseRecordQuery
      if (this.dateRange && this.dateRange[0]) {
        params.beginTime = String((this.dateRange[0] / 1000).toFixed(0))
      }
      if (this.dateRange && this.dateRange[1]) {
        params.endTime = String((this.dateRange[1] / 1000 + 86400).toFixed(0))
      }
      if (!params.keyword) delete params.keyword
      if (params.status === 'all') delete params.status
      this.loading = true
      try {
        this.historyRes = await RecordApi.list(params)
      } finally {
        this.loading = false
      }
    },
    // 页数发生变化
    onPageChange(page: number) {
      this.params.pageNo = page
      this.getHistoryList()
    },
    // 搜索
    onSearch() {
      this.params.pageNo = 1
      this.getHistoryList()
    },
    // 状态发生变化
    onStatusChange() {
      this.params.pageNo = 1
      this.getHistoryList()
    },
    // 重置参数
    resetParams() {
      this.params.pageNo = 1
      this.params.keyword = ''
      this.params.status = 'all'
    }
  },
  getters: {
    records: (state): IBCaseRecord[] => state.historyRes.records,
    pagination: (state) => ({
      page: state.historyRes.current,
      pageSize: state.historyRes.size,
      pageCount: state.historyRes.pages,
      itemCount: state.historyRes.total
    })
  }
})
