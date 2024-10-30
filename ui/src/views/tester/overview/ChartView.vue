<template>
  <n-spin :show="caseRunTotalLoading || failedRecordsLoading">
    <div class="chart-view">
      <div class="chart-box">
        <div class="tit">
          {{ $t('tester.remote_run') }}({{ $t('tester.total_of_times', { num: caseRunTotal?.runTotal || 0 }) }})
        </div>
        <div class="chart-container"></div>
      </div>
      <div class="record-box">
        <div class="top-record">
          <n-select v-model:value="lastDay" :options="lastDayOptions" size="small" />
        </div>
        <div class="list-record">
          <div class="tit">
            {{ $t('tester.failed_remote_run') }}（{{ caseRunTotal?.failedTotal || 0 }} {{ $t('tester.times') }}）
          </div>
          <div class="records">
            <div v-for="item in failedRecords" :key="item.id" class="record-item">
              <div class="record-info">
                <router-link :to="{ name: 'testerHistoryDetail', params: { historyId: item.id } }" class="case-name">
                  <n-ellipsis>{{ item.testCaseName }}</n-ellipsis>
                </router-link>
                <div class="error-text">
                  <n-performant-ellipsis line-clamp="3">
                    {{ item.failReason }}
                    <template #tooltip>
                      <div style="max-width: 500px">{{ item.failReason }}</div>
                    </template>
                  </n-performant-ellipsis>
                </div>
              </div>
              <div class="run-time">{{ formatUnix(item.runTime) }}</div>
            </div>
            <n-empty v-if="failedRecords.length === 0" class="records-empty" />
          </div>
          <router-link :to="{ name: 'testerHistory' }" class="more-btn underline">{{ $t('view_more') }}>></router-link>
        </div>
      </div>
    </div>
  </n-spin>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import dayjs from 'dayjs'
import { PieChart } from 'echarts/charts'
import { LegendComponent, TooltipComponent } from 'echarts/components'
import * as echarts from 'echarts/core'
import { LabelLayout } from 'echarts/features'
import { CanvasRenderer } from 'echarts/renderers'
import { IBCaseRecord, IBCaseStat } from '@/types/tester'
import { formatUnix } from '@/utils'
import { useTesterParams } from '@/hooks/useTesterParams'
import { RecordApi, StatsApi } from '@/api/tester'

const router = useRouter()
const lastDayOptions = [
  { label: window.$t('today'), value: 0 },
  { label: window.$t('tester.last_3_days'), value: 3 },
  { label: window.$t('tester.last_7_days'), value: 7 },
  { label: window.$t('tester.last_30_days'), value: 30 }
]
const caseRunTotal = ref<IBCaseStat>()
const failedRecords = ref<IBCaseRecord[]>([])
const lastDayToUnix = (day: number) => {
  if (day === 0) return dayjs().startOf('day').unix().toString()
  return dayjs().startOf('day').subtract(day, 'day').unix().toString()
}
const lastDay = ref(0)
const beginDate = ref(lastDayToUnix(lastDay.value))
const caseRunTotalLoading = ref(false)
const getCaseRunTotal = async () => {
  caseRunTotalLoading.value = true
  try {
    const res = await StatsApi.statSum({ beginDate: beginDate.value })
    if (res) {
      caseRunTotal.value = res
    } else {
      caseRunTotal.value = undefined
    }
  } finally {
    caseRunTotalLoading.value = false
    renderChart()
  }
}
const failedRecordsLoading = ref(false)
const getFailedRecords = async () => {
  failedRecordsLoading.value = true
  try {
    const res = await RecordApi.list({
      pageNo: 1,
      pageSize: 3,
      status: 'failed',
      beginTime: beginDate.value
    })
    failedRecords.value = res.records
  } finally {
    failedRecordsLoading.value = false
  }
}

watch(
  () => lastDay.value,
  (newVal) => {
    beginDate.value = lastDayToUnix(newVal)
    getCaseRunTotal()
    getFailedRecords()
  },
  { immediate: true }
)

const viewMoreRecord = () => {
  const { projectId } = useTesterParams()
  router.push({ name: 'testerHistory', params: { id: projectId } })
}

echarts.use([TooltipComponent, LegendComponent, PieChart, CanvasRenderer, LabelLayout])

const renderChart = () => {
  const chartDom = document.querySelector('.chart-container') as HTMLElement
  if (!chartDom) return
  let myChart = echarts.init(chartDom)
  const successTotal = caseRunTotal.value?.successTotal || 0
  const failedTotal = caseRunTotal.value?.failedTotal || 0
  const option = {
    tooltip: { trigger: 'item', formatter: '{b} : {c} ({d}%)' },
    legend: { bottom: '0%', left: 'center' },
    color: ['#18a058', '#d03050'],
    series: [
      {
        type: 'pie',
        radius: ['50%', '70%'],
        avoidLabelOverlap: false,
        itemStyle: {
          borderRadius: 10,
          borderColor: '#fff',
          borderWidth: 2
        },
        label: { position: 'outer', formatter: `{b} \n {c}` },
        emphasis: { label: false },
        labelLine: { show: true },
        data: [
          { value: successTotal, name: window.$t('passed') },
          { value: failedTotal, name: window.$t('failed') }
        ]
      }
    ]
  }
  myChart.setOption(option)
}
</script>

<style scoped lang="scss">
.chart-view {
  display: flex;
  padding: 24px;
  width: 100%;
  min-height: 300px;
  margin-top: 24px;
  box-shadow: var(--box-shadow-2);
  transition: all 0.2s var(--bezier);
  &:hover {
    box-shadow: var(--box-shadow-3);
  }
}
.chart-box {
  display: flex;
  flex-direction: column;
  align-items: center;
  flex: 3;
  flex-shrink: 0;
  .tit {
    margin-top: 12px;
  }
  .chart-container {
    width: 400px;
    height: 300px;
    margin-top: 20px;
  }
}
.record-box {
  display: flex;
  flex-direction: column;
  flex: 4;
  padding-right: 24px;
  .top-record {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    :deep(.n-select) {
      width: 160px;
    }
  }
  .list-record {
    padding-top: 24px;
    padding-left: 24px;
    .tit {
      font-size: 14px;
      margin-bottom: 24px;
    }
    .record-item {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 12px 24px;
      background-color: #f7f7fa;
      border-radius: 2px;
      & + .record-item {
        margin-top: 20px;
      }
      .record-info {
        max-width: 300px;
      }
      .case-name {
        color: var(--text-color-1);
        cursor: pointer;
        &:hover :deep(.n-ellipsis) {
          text-decoration: underline;
        }
      }
      .error-text {
        color: var(--error-color);
        font-size: 12px;
        margin-top: 12px;
      }
      .run-time {
        color: var(--text-color-3);
        flex-shrink: 0;
        margin-left: 24px;
      }
    }
    .more-btn {
      display: block;
      margin-top: 24px;
      font-size: 12px;
    }
    .records-empty {
      margin: 58px 0;
    }
  }
}
</style>
