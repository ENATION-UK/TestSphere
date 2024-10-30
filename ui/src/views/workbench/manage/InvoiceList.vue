<template>
  <div class="bills">
    <div class="filter-box">
      <n-date-picker
        v-model:value="dateRange"
        type="daterange"
        clearable
        style="width: 300px"
        @update:value="handleDateChange"
      />
    </div>
    <div class="list-box">
      <n-spin :show="billsLoading">
        <n-data-table :bordered="false" :columns="columns" :data="bills" :pagination="pagination" />
      </n-spin>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, h, onMounted, ref } from 'vue'
import DocumentPdf20Regular from '@vicons/fluent/DocumentPdf20Regular'
import dayjs from 'dayjs'
import { DataTableColumns, NIcon } from 'naive-ui'
import { IBPagerRes } from '@/types'
import { IBInvoices, IBInvoicesQuery } from '@/types/workbench'
import { IBConfig } from '@/config'
import { InvoicesApi } from '@/api/workbench'

const bills = ref<IBInvoices[]>([])
const params = ref<IBInvoicesQuery>({
  pageNo: 1,
  pageSize: 10,
  startTime: '',
  endTime: ''
})
const dateRange = ref<[number, number]>()
const pageRes = ref<IBPagerRes>({ pages: 0, current: 0, records: [], size: 0, total: 0 })
const columns: DataTableColumns<IBInvoices> = [
  {
    title: window.$t('wb.manage.bills.invoices_money'),
    key: 'paymentAmount',
    align: 'center',
    render: (row: IBInvoices) => (IBConfig.APP_CHINA ? `￥${row.paymentAmount}` : `$${row.paymentAmount}`)
  },
  { title: window.$t('wb.manage.bills.invoices_number'), key: 'invoiceNumber', align: 'center' },
  {
    title: window.$t('wb.manage.bills.invoices_date'),
    key: 'paymentTime',
    align: 'center',
    render: (row: IBInvoices) => dayjs(Number(row.paymentTime) * 1000).format('YYYY-MM-DD')
  },
  {
    title: window.$t('wb.manage.bills.invoices_download'),
    key: 'invoicePdf',
    align: 'center',
    render: (row: IBInvoices) =>
      h(
        NIcon,
        {
          size: '25px',
          style: 'cursor: pointer;',
          onClick: () => {
            window.open(row.invoicePdf, '_blank')
          }
        },
        { default: () => h(DocumentPdf20Regular) }
      )
  }
]
const pagination = computed(() => {
  return {
    page: params.value.pageNo,
    pageSize: params.value.pageSize,
    pageCount: pageRes.value.pages
  }
})
const billsLoading = ref(false)
const getBills = async () => {
  try {
    billsLoading.value = true
    const res = await InvoicesApi.list(params.value)
    pageRes.value = res
    bills.value = res.records
  } finally {
    billsLoading.value = false
  }
}
const handleDateChange = () => {
  params.value.pageNo = 1
  if (dateRange.value) {
    params.value.startTime = parseInt(String(dateRange.value[0] / 1000))
    params.value.endTime = parseInt(String(dateRange.value[1] / 1000))
  } else {
    params.value.startTime = ''
    params.value.endTime = ''
  }

  getBills()
}

onMounted(() => getBills())
</script>

<style scoped lang="scss">
.bills {
  .filter-box {
    display: flex;
    justify-content: flex-end;
  }
  .list-box {
    margin-top: 24px;
  }
}
</style>
