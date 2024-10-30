<template>
  <div class="history-container">
    <div class="tools-bar">
      <div class="filter-box"></div>
      <div class="search-box">
        <n-space>
          <n-select
            v-model:value="historyStore.params.status"
            :options="statusOptions"
            @clear="historyStore.onSearch"
            @update:value="historyStore.onStatusChange"
            style="width: 110px"
          />
          <n-date-picker
            v-model:value="historyStore.dateRange"
            type="daterange"
            clearable
            close-on-select
            :is-date-disabled="dateDisabled"
            @update:value="historyStore.getHistoryList"
            class="date-picker"
          />
          <n-input
            v-model:value="historyStore.params.keyword"
            clearable
            :placeholder="$t('tester.search_placeholder')"
            class="search-input"
            @keyup.enter="historyStore.onSearch"
          />
          <n-button type="info" @click="historyStore.onSearch">{{ $t('search') }}</n-button>
        </n-space>
      </div>
    </div>
    <n-spin :show="historyStore.loading">
      <n-data-table
        remote
        :data="historyStore.records"
        :columns="historyColumns"
        :single-line="true"
        :pagination="historyStore.pagination"
        :min-height="520"
        @update:page="historyStore.onPageChange"
        class="history-table"
      />
    </n-spin>
  </div>
</template>

<script setup lang="ts">
import { h, onMounted } from 'vue'
import { RouterLink, useRoute, useRouter } from 'vue-router'
import { NEllipsis } from 'naive-ui'
import { IBCaseRecord } from '@/types/tester'
import { formatSeconds, formatUnix } from '@/utils'
import { useHistoryStore } from '@/store/tester'
import { formatTesterStatus, getTesterStatusColor } from '../helpers'

const route = useRoute()
const router = useRouter()
const historyStore = useHistoryStore()
const statusOptions = [
  { label: window.$t('all'), value: 'all' },
  { label: window.$t('passed'), value: 'success' },
  { label: window.$t('failed'), value: 'failed' }
]
const historyColumns = [
  {
    title: window.$t('tester.case_name'),
    key: 'testCaseName',
    width: 600,
    render: (row: IBCaseRecord) =>
      h(
        RouterLink,
        { to: { name: 'testerHistoryDetail', params: { historyId: row.id } }, class: 'test-name' },
        {
          default: () =>
            h(
              NEllipsis,
              { style: 'max-width: 500px', tooltip: { style: 'max-width: 400px' } },
              {
                default: () => row.testCaseName
              }
            )
        }
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
    title: window.$t('tester.run_status'),
    key: 'status',
    align: 'center',
    render: (row: IBCaseRecord) =>
      h(
        'span',
        { style: { color: getTesterStatusColor(row.status) } },
        { default: () => formatTesterStatus(row.status) }
      )
  }
]
const dateDisabled = (ts: number) => ts > Date.now()
onMounted(() => historyStore.getHistoryList())
</script>

<style scoped lang="scss">
.history-container {
  width: 100%;
  height: 100%;
  box-sizing: border-box;
}
.tools-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 100px;
  .filter-box {
    display: flex;
    .date-picker {
      width: 300px;
    }
  }
  .search-box {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    height: 100%;
    .date-picker {
      width: 300px;
    }
    .search-input {
      width: 180px;
    }
  }
}
.history-table {
  :deep(td) {
    padding-top: 1px;
    padding-bottom: 1px;
  }
  :deep(.test-name) {
    display: block;
    height: 100%;
    padding-top: 11px;
    padding-bottom: 11px;
    &:hover .n-ellipsis {
      text-decoration: underline;
    }
  }
}
</style>
