<template>
  <div class="case-history">
    <n-data-table
      remote
      :data="recordRes.records"
      :columns="columns"
      :single-line="true"
      :pagination="pagination"
      :min-height="520"
      @update:page="onPageChange"
      class="history-table"
    />
  </div>
</template>

<script setup lang="ts">
import { computed, h, onMounted, ref } from 'vue'
import { RouterLink } from 'vue-router'
import ErrorCircle24Filled from '@vicons/fluent/ErrorCircle24Filled'
import { DialogReactive, NIcon, NImage, NTooltip } from 'naive-ui'
import { IBPagerRes } from '@/types'
import { IBCase, IBCaseRecord, IBCaseRecordQuery } from '@/types/tester'
import { formatSeconds, formatUnix } from '@/utils'
import { RecordApi } from '@/api/tester'
import { formatTesterStatus, getTesterStatusColor } from '@/views/tester/helpers'

const props = defineProps<{
  case: IBCase
  dialog: DialogReactive
}>()

const columns = [
  {
    title: window.$t('tester.record_id'),
    key: 'id',
    width: 230,
    render: (row: IBCaseRecord) =>
      h(
        RouterLink,
        {
          to: { name: 'testerHistoryDetail', params: { historyId: row.id } },
          onClick: props.dialog.destroy,
          class: 'record-id'
        },
        { default: () => row.id }
      )
  },
  {
    title: window.$t('tester.start_time'),
    key: 'runTime',
    align: 'center',
    render: (row: IBCaseRecord) => formatUnix(row.runTime)
  },
  {
    title: window.$t('tester.run_duration'),
    key: 'duration',
    align: 'center',
    render: (row: IBCaseRecord) => formatSeconds(row.duration)
  },
  {
    title: window.$t('tester.step'),
    key: 'duration',
    align: 'center',
    width: 100,
    render: (row: IBCaseRecord) => `${row.successStepCount || 0}/${row.stepCount || 0}`
  },
  {
    title: window.$t('tester.run_status'),
    key: 'status',
    align: 'center',
    render: (row: IBCaseRecord) => {
      const statusSpan = h(
        'span',
        { style: { color: getTesterStatusColor(row.status) } },
        { default: () => formatTesterStatus(row.status) }
      )
      if (!row.failReason || !['failed', 'error'].includes(row.status)) return statusSpan
      const failedChild: any = [
        h('span', { style: { color: getTesterStatusColor(row.status) } }, { default: () => row.failReason })
      ]
      if (row.failScreenshot) {
        failedChild.push(
          h(
            NImage,
            { src: row.failScreenshot, previewSrc: row.failScreenshot, style: 'width: 100%; margin-top: 5px;' },
            null
          )
        )
      }
      return h(
        'div',
        {
          style: 'display: flex; align-items: center;'
        },
        [
          statusSpan,
          h(
            NTooltip,
            { trigger: 'click', placement: 'bottom', style: 'max-width: 500px;' },
            {
              trigger: () =>
                h(
                  NIcon,
                  { color: getTesterStatusColor(row.status), style: 'margin-left: 5px; cursor: pointer;' },
                  { default: () => h(ErrorCircle24Filled) }
                ),
              default: () => h('div', null, failedChild)
            }
          )
        ]
      )
    }
  }
]
const params = ref<IBCaseRecordQuery>({ pageNo: 1, pageSize: 10 })
const recordRes = ref<IBPagerRes<IBCaseRecord>>({ current: 1, size: 10, pages: 0, total: 0, records: [] })
const pagination = computed(() => ({
  page: recordRes.value.current,
  pageSize: recordRes.value.size,
  pageCount: recordRes.value.pages,
  itemCount: recordRes.value.total
}))
const loading = ref(false)
const getRecords = async () => {
  loading.value = true
  params.value.caseId = props.case.id
  try {
    recordRes.value = await RecordApi.list(params.value)
  } finally {
    loading.value = false
  }
}
const onPageChange = (page: number) => {
  params.value.pageNo = page
  getRecords()
}
onMounted(() => getRecords())
</script>

<style scoped lang="scss">
.case-history {
  min-height: 520px;
  .history-table {
    :deep(td) {
      padding-top: 1px;
      padding-bottom: 1px;
    }
    :deep(.record-id) {
      display: block;
      height: 100%;
      padding-top: 11px;
      padding-bottom: 11px;
      &:hover {
        text-decoration: underline;
      }
    }
  }
}
</style>
