<template>
  <div class="invite-details">
    <n-data-table
      :data="recordRes.records"
      :columns="recordColumns"
      :row-key="(row) => row.id"
      :pagination="recordPagination"
    />
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { DataTableColumns } from 'naive-ui'
import { IBPagerReq, IBPagerRes } from '@/types'
import { IBInviteRegRecord } from '@/types/workbench'
import { formatUnix } from '@/utils/utils'
import { CompanyApi } from '@/api/workbench/company'

const recordParams = ref<IBPagerReq>({ pageNo: 0, pageSize: 20 })
const recordRes = ref<IBPagerRes<IBInviteRegRecord>>({ current: 0, pages: 0, records: [], size: 0, total: 0 })
const recordPagination = computed(() => ({
  page: recordParams.value.pageNo,
  pageSize: recordParams.value.pageSize,
  pageCount: recordRes.value.pages
}))
const recordColumns: DataTableColumns<IBInviteRegRecord> = [
  {
    title: window.$t('wb.nickname'),
    key: 'inviteeName'
  },
  {
    title: window.$t('wb.invite_time'),
    key: 'createdAt',
    render(row) {
      return formatUnix(row.createdAt)
    }
  },
  {
    title: window.$t('remark'),
    key: 'remark'
  }
]

const recordLoading = ref(false)
const getInviteRegRecords = async () => {
  recordLoading.value = true
  try {
    recordRes.value = await CompanyApi.inviteRegRecords(recordParams.value)
  } finally {
    recordLoading.value = false
  }
}
onMounted(() => getInviteRegRecords())
</script>

<style scoped lang="scss">
.invite-details {
  width: 100%;
  height: 100%;
  background: #ffffff;
  padding: 24px;
}
</style>
