import { cloneDeep } from 'lodash-es'
import { defineStore } from 'pinia'
import { IBPagerRes } from '@/types'
import { IBCase, IBCaseGroup, IBCaseQuery } from '@/types/tester'
import { CaseApi, GroupApi } from '@/api/tester'

interface CasesState {
  groupLoading: boolean
  groupTree: IBCaseGroup[]
  groupIdSnMapping: Record<string, string>
  params: Required<IBCaseQuery>
  caseLoading: boolean
  caseRes: IBPagerRes<IBCase>
  caseExpandedKeys: string[]
  treeSelectedKeys: string[]
}

export const useCasesStore = defineStore('cases', {
  state: (): CasesState => ({
    groupLoading: false,
    groupTree: [],
    groupIdSnMapping: {},
    params: {
      pageNo: 1,
      pageSize: 10,
      groupId: '',
      keyword: '',
      status: 'all'
    },
    caseLoading: false,
    caseRes: {
      current: 0,
      pages: 0,
      records: [],
      size: 0,
      total: 0
    },
    caseExpandedKeys: [],
    treeSelectedKeys: ['all']
  }),
  actions: {
    // 获取用例分组树
    async getGroupTree(): Promise<IBCaseGroup[] | undefined> {
      this.groupLoading = true
      try {
        const res = await GroupApi.tree()
        this.groupTree = res
        this.groupIdSnMapping = getGroupIdSnMapping(res)
        return res
      } finally {
        this.groupLoading = false
      }
    },
    // 获取用例列表
    async getCaseList() {
      const params = cloneDeep(this.params)
      if (params.groupId === 'all') params.groupId = ''
      if (params.status === 'all') params.status = ''
      this.caseLoading = true
      try {
        this.caseRes = await CaseApi.list(params)
      } finally {
        this.caseLoading = false
      }
    },
    // 页数发生变化
    onPageChange(page: number) {
      this.params.pageNo = page
      this.getCaseList()
    },
    // 状态发生变化
    onStatusChange() {
      this.params.pageNo = 1
      this.getCaseList()
    }
  },
  getters: {
    records: (state): IBCase[] => state.caseRes.records,
    pagination: (state) => ({
      page: state.caseRes.current,
      pageSize: state.caseRes.size,
      pageCount: state.caseRes.pages,
      itemCount: state.caseRes.total
    })
  }
})

function getGroupIdSnMapping(groups: IBCaseGroup[]) {
  const map: Record<string, string> = {}
  getMapping(groups)

  function getMapping(children: IBCaseGroup[]) {
    if (!Array.isArray(children)) return
    children.forEach((item) => {
      map[item.id] = item.sn
      if (item.children) getMapping(item.children)
    })
  }

  return map
}
