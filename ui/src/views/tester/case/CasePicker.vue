<template>
  <n-modal
    v-model:show="showModal"
    :closable="false"
    :show-icon="false"
    :close-on-esc="false"
    :mask-closable="false"
    :positive-text="$t('confirm')"
    :negative-text="$t('cancel')"
    preset="dialog"
    style="width: 800px"
    @negative-click="handleNegativeClick"
    @positive-click="handlePositiveClick"
  >
    <div class="tools-bar">
      <div class="filter-box">
        <n-tree-select
          v-model:value="params.groupId"
          :options="casesStore.groupTree"
          key-field="id"
          label-field="name"
          show-path
          clearable
          :placeholder="$t('tester.case_group_placeholder')"
          style="width: 200px"
          @update:value="getCaseList(1)"
        />
      </div>
      <div class="search-box">
        <n-input
          v-model:value="params.keyword"
          :placeholder="$t('tester.search_keyword')"
          clearable
          @keyup.enter="getCaseList(1)"
          style="width: 200px"
        />
      </div>
    </div>
    <div class="case-list">
      <n-data-table
        v-model:checked-row-keys="checkedRowKeys"
        remote
        :data="cases"
        :columns="columns"
        :loading="listLoading"
        :pagination="pagination"
        :row-key="(row) => row.id"
        :row-props="rowProps"
        @update:page="getCaseList"
      />
    </div>
    <div class="case-pager"></div>
  </n-modal>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import dayjs from 'dayjs'
import { DataTableColumns } from 'naive-ui'
import { IBPagerRes } from '@/types'
import { IBCase, IBCaseQuery } from '@/types/tester'
import { useCasesStore } from '@/store/tester'
import { CaseApi } from '@/api/tester/case'

interface Options {
  caseId?: string
  limit?: number
}

const casesStore = useCasesStore()
const showModal = ref(false)
const promise = { resolve: (value?: any): void => {}, reject: (e?: any): void => {} }
let options = {} as Options
const show = (opts?: Options) => {
  options = opts || {}
  return new Promise((resolve, reject) => {
    promise.resolve = resolve
    promise.reject = reject
    showModal.value = true
    checkedRowKeys.value = []
    if (!casesStore.groupTree.length) {
      casesStore.getGroupTree()
    }
  })
}
const params = ref<IBCaseQuery>({
  pageNo: 1,
  pageSize: 10,
  keyword: '',
  groupId: ''
})
const caseList = ref<IBCase[]>([])
const cases = computed(() => {
  if (!options.caseId) return caseList.value
  return caseList.value.filter((item) => item.id !== options.caseId)
})
const pageRes = ref<IBPagerRes>({ current: 0, records: [], size: 0, total: 0, pages: 0 })
const listLoading = ref(false)
const getCaseList = async (pageNo: number) => {
  try {
    listLoading.value = true
    params.value.pageNo = pageNo
    const res = await CaseApi.list(params.value)
    pageRes.value = res
    caseList.value = res.records
  } finally {
    listLoading.value = false
  }
}
onMounted(() => getCaseList(1))
const handleNegativeClick = () => {
  promise.reject()
}
const pagination = computed(() => ({
  page: params.value.pageNo,
  pageSize: params.value.pageSize,
  pageCount: pageRes.value.pages
}))
const checkedRowKeys = ref<string[]>([])
const handlePositiveClick = () => {
  const caseId = checkedRowKeys.value[0]
  if (!caseId) {
    window.$message.error(window.$t('tester.select_case_placeholder'))
    return false
  }
  const c = caseList.value.find((item) => item.id === caseId)
  promise.resolve(c)
}
const rowProps = (rowData: IBCase, rowIndex: number) => {
  return {
    onClick(e: MouseEvent) {
      checkedRowKeys.value = [rowData.id]
      e.preventDefault()
    }
  }
}
const columns: DataTableColumns<IBCase> = [
  { type: 'selection', multiple: false },
  { title: window.$t('tester.name'), key: 'name' },
  {
    title: window.$t('tester.create_time'),
    key: 'createTime',
    render: (rowData: IBCase) => dayjs(rowData.createTime).format('YYYY-MM-DD HH:mm:ss')
  }
]

defineExpose({ show })
</script>

<style scoped lang="scss">
.tools-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 50px;
  box-sizing: border-box;
  .filter-box,
  .search-box {
    width: 50%;
  }
  .search-box {
    display: flex;
    justify-content: flex-end;
  }
}
.case-list {
  margin-top: 12px;
}
:deep(.n-data-table-table) {
  .n-data-table-tr {
    cursor: pointer;
  }
}
</style>
