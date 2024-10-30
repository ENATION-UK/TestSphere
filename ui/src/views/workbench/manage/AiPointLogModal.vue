<template>
  <n-modal
    v-model:show="showModal"
    :show-icon="false"
    :close-on-esc="false"
    :mask-closable="false"
    :auto-focus="false"
    transform-origin="center"
    preset="dialog"
    style="width: 650px"
  >
    <n-data-table :data="logs" :columns="columns" :pagination="logsPagination" style="padding-top: 30px" />
  </n-modal>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { DataTableColumns } from 'naive-ui'
import { IBPagerRes } from '@/types'
import { IBAiPointLog, IBAiPointLogQuery } from '@/types/workbench'
import { formatUnix } from '@/utils'
import { AiPointApi } from '@/api/workbench'

const showModal = ref(false)
const show = () => {
  showModal.value = true
  getLogs()
}
const logs = ref<IBAiPointLog[]>([])
const logsParams = ref<IBAiPointLogQuery>({ pageNo: 1, pageSize: 10 })
const logsLoading = ref(false)
const logsRes = ref<IBPagerRes>({ current: 0, pages: 0, records: [], size: 0, total: 0 })
const logsPagination = computed(() => ({
  page: logsParams.value.pageNo,
  pageSize: logsParams.value.pageSize,
  pageCount: logsRes.value.pages
}))
const getLogs = async () => {
  try {
    logsLoading.value = true
    const res = await AiPointApi.logs(logsParams.value)
    logs.value = res.records
  } finally {
    logsLoading.value = false
  }
}
const columns: DataTableColumns<IBAiPointLog> = [
  {
    title: window.$t('wb.ai_point'),
    key: 'aiPoint',
    align: 'center'
  },
  {
    title: window.$t('date'),
    key: 'createAt',
    align: 'center',
    render(rowData) {
      return formatUnix(rowData.createAt)
    }
  },
  {
    title: window.$t('remark'),
    key: 'reason',
    align: 'center'
  }
]

defineExpose({ show })
</script>

<style scoped lang="scss"></style>
