<template>
  <div class="report">
    <div class="date-card">
      <n-select v-model:value="lastDay" :options="lastDayOptions" />
    </div>
    <div class="report-card">
      <div class="left-info">
        <div class="tit">{{ $t('tester.passed_test_runs') }}</div>
        <div class="percentage">{{ passRate }}%</div>
      </div>
      <div class="center-hr"></div>
      <div class="right-chart">
        <div class="chart-view passed-chart-view"></div>
      </div>
    </div>
    <div class="report-card">
      <div class="left-info">
        <div class="tit">{{ $t('tester.total_number_of_runs') }}</div>
        <div class="percentage">{{ runTotal }}</div>
      </div>
      <div class="center-hr"></div>
      <div class="right-chart">
        <div class="chart-view running-chart-view"></div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, nextTick, onMounted, ref, watch } from 'vue'
import dayjs from 'dayjs'
import { BarChart, LineChart } from 'echarts/charts'
import { GridComponent, LegendComponent, TooltipComponent } from 'echarts/components'
import * as echarts from 'echarts/core'
import { UniversalTransition } from 'echarts/features'
import { CanvasRenderer } from 'echarts/renderers'
import { SelectOption } from 'naive-ui'
import { IBCaseStat } from '@/types/tester'
import { CaseApi, StatsApi } from '@/api/tester'

const caseStat = ref<IBCaseStat>()
const caseStats = ref<IBCaseStat[]>([])

const getCaseStat = async () => {
  const res = await CaseApi.overview()
  if (!res) return
  caseStat.value = res
}
onMounted(() => getCaseStat())

const runTotal = computed(() => {
  if (caseStats.value.length === 0) return 0
  let total = 0
  caseStats.value.forEach((item) => (total += item.runTotal))
  return total
})
const caseRunTotal = computed(() => {
  if (caseStats.value.length === 0) return 0
  let total = 0
  caseStats.value.forEach((item) => (total += item.caseRunTotal))
  return total
})
const caseSuccessTotal = computed(() => {
  if (caseStats.value.length === 0) return 0
  let total = 0
  caseStats.value.forEach((item) => (total += item.caseSuccessTotal))
  return total
})
const passRate = computed(() => {
  if (caseRunTotal.value === 0 || caseSuccessTotal.value === 0) return 0
  return ((caseSuccessTotal.value / caseRunTotal.value) * 100).toFixed(2)
})

const lastDay = ref(7)
const lastDayOptions: SelectOption[] = [
  { label: window.$t('today'), value: 0 },
  { label: window.$t('yesterday'), value: 1 },
  { label: window.$t('tester.last_7_days'), value: 7 },
  { label: window.$t('tester.last_30_days'), value: 30 }
]
const lastDayToUnix = (day: number) => {
  if (day === 0) return dayjs().startOf('day').unix().toString()
  if (day === 1) return String(dayjs().startOf('day').unix() - 86400)
  return dayjs()
    .startOf('day')
    .subtract(day - 1, 'day')
    .unix()
    .toString()
}
const beginDate = ref(lastDayToUnix(lastDay.value))
const totalLoading = ref(false)
const getRunCaseTotal = async () => {
  totalLoading.value = true
  try {
    if (lastDay.value === 1) {
      const endDate = String(dayjs().startOf('day').unix() - 1)
      caseStats.value = await StatsApi.statRecords({ beginDate: beginDate.value, endDate })
    } else {
      caseStats.value = await StatsApi.statRecords({ beginDate: beginDate.value })
    }
    const totals = makeChartDates()
    renderPassedChart(totals)
    renderRunningChart(totals)
  } finally {
    totalLoading.value = false
  }
}
const makeChartDates = () => {
  if (lastDay.value <= 1) {
    if (caseStats.value[0]) return caseStats.value
    const date = lastDay.value === 0 ? dayjs() : dayjs().subtract(1, 'day')
    const stat = {
      caseRunTotal: 0,
      caseSuccessTotal: 0,
      caseFailedTotal: 0,
      statDate: date.format('YYYY-MM-DD').toString()
    } as IBCaseStat
    return [stat]
  }
  const statTotals: IBCaseStat[] = []
  let lastStat = {} as IBCaseStat
  for (let i = 1; i < lastDay.value + 1; i++) {
    const date = dayjs()
      .subtract(lastDay.value - i, 'day')
      .format('YYYY-MM-DD')
    let total = caseStats.value.find((item) => item.statDate === date)
    if (total) {
      lastStat = total
      statTotals.push(total)
    } else {
      statTotals.push({
        caseUnrunTotal: 0,
        failedTotal: 0,
        runTotal: 0,
        successTotal: 0,
        caseTotal: lastStat.caseTotal || 0,
        companyId: '',
        projectId: '',
        statDate: date,
        caseRunTotal: 0,
        caseSuccessTotal: 0,
        caseFailedTotal: 0
      })
    }
  }
  return statTotals
}

echarts.use([
  GridComponent,
  TooltipComponent,
  LegendComponent,
  BarChart,
  LineChart,
  CanvasRenderer,
  UniversalTransition
])
const renderPassedChart = async (totals: IBCaseStat[]) => {
  await nextTick()
  const chartEle = document.querySelector('.passed-chart-view') as HTMLElement
  if (!chartEle) return
  const chart = echarts.init(chartEle)
  const seriesData = totals.map((item) => {
    if (item.caseRunTotal === 0) return 0
    return Number(((item.caseSuccessTotal * 100) / item.caseRunTotal).toFixed(2))
  })
  let maxPassed = Math.max(...seriesData)
  maxPassed = maxPassed >= 95 ? 100 : maxPassed + 5
  chart.setOption({
    grid: { left: 50, top: 10, right: 10, bottom: 30 },
    xAxis: {
      type: 'category',
      boundaryGap: ['5%', '5%'],
      data: totals.map((item) => item.statDate.substring(5)),
      axisLine: { lineStyle: { type: 'dashed' } }
    },
    yAxis: {
      type: 'value',
      min: 0,
      max: maxPassed,
      interval: Number((maxPassed / 5).toFixed(2)),
      axisLabel: {
        formatter: (value: number) => {
          if (value === 0) return ''
          return value + '%'
        }
      }
    },
    series: [
      {
        type: 'line',
        smooth: true,
        lineStyle: { width: 0 },
        symbol: 'circle',
        symbolSize: 10,
        itemStyle: {
          color: '#32b5a0',
          borderColor: '#fff',
          borderWidth: 2
        },
        areaStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: '#8de9b8' },
            { offset: 1, color: '#32b5a0' }
          ])
        },
        data: seriesData
      }
    ],
    tooltip: {
      trigger: 'axis',
      formatter: (params: Record<string, any>) => {
        const p = params[0]
        let html = `${p.axisValueLabel}<br>`
        html += `${p.value}% ${window.$t('SUCCESS')}`
        const total = totals[p.dataIndex]
        if (!total) return html
        html += `<br>${total.caseSuccessTotal || 0}/${total.caseRunTotal || 0} ${window.$t('tester.test_passed')}`
        return html
      }
    }
  })
}
const renderRunningChart = async (totals: IBCaseStat[]) => {
  await nextTick()
  const chartEle = document.querySelector('.running-chart-view') as HTMLElement
  if (!chartEle) return
  const chart = echarts.init(chartEle)
  chart.setOption({
    grid: { left: 50, top: 30, right: 10, bottom: 30 },
    tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
    legend: { data: [window.$t('tester.test_total'), window.$t('tester.run_case_total')] },
    xAxis: {
      type: 'category',
      boundaryGap: ['10%', '10%'],
      data: totals.map((item) => item.statDate.substring(5)),
      axisLine: { lineStyle: { type: 'dashed' } }
    },
    yAxis: { type: 'value' },
    series: [
      {
        name: window.$t('tester.test_total'),
        type: 'bar',
        barGap: '-100%',
        stack: '总量',
        data: totals.map((item) => item.caseTotal),
        itemStyle: { color: '#dae3ff', borderRadius: [4, 4, 0, 0] }
      },
      {
        name: window.$t('tester.run_case_total'),
        type: 'bar',
        stack: '分量',
        data: totals.map((item) => item.caseRunTotal),
        itemStyle: { color: '#5b79ff', borderRadius: [4, 4, 0, 0] }
      }
    ]
  })
}

watch(
  () => lastDay.value,
  (newVal) => {
    beginDate.value = lastDayToUnix(newVal)
    getRunCaseTotal()
  },
  { immediate: true }
)
</script>

<style scoped lang="scss">
.report {
  display: flex;
  flex-direction: column;
  width: 100%;
  padding: 15px;
}
.date-card {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  height: 44px;
  :deep(.n-select) {
    width: 200px;
  }
}
.report-card {
  display: flex;
  width: 100%;
  border: 1px solid #d8dae5;
  padding: 14px;
  border-radius: 5px;
  margin-top: 10px;
  & + .report-card {
    margin-top: 24px;
  }
  .left-info {
    display: flex;
    justify-content: center;
    flex-direction: column;
    flex-shrink: 0;
    min-width: 220px;
    color: #313131;
    font-weight: 700;
    text-align: center;
    padding-left: 19px;
    .tit {
      font-size: 12px;
      letter-spacing: 1px;
      line-height: 15px;
      margin-bottom: 14px;
      text-transform: uppercase;
    }
    .percentage {
      font-size: 50px;
      font-weight: 700;
      line-height: 40px;
      margin-bottom: 11px;
    }
    .sub {
      text-wrap: wrap;
      font-size: 12px;
      line-height: 20px;
    }
    .hr {
      border-color: transparent;
      border-top: 1px solid #d8dae5;
      display: block;
      margin: 10px 0;
      width: 100%;
    }
    .sub-percentage {
      align-items: center;
      color: #858791;
      display: flex;
      font-weight: 900;
      justify-content: center;
    }
    .sub-text {
      color: #858791;
      font-size: 12px;
      line-height: 20px;
      margin-top: 7px;
    }
  }
  .center-hr {
    flex-shrink: 0;
    background-color: #d8dae5;
    margin-left: 33px;
    margin-right: 33px;
    width: 1px;
  }
  .right-chart {
    flex: 1;
    .chart-view {
      width: 100%;
      height: 100%;
      min-height: 200px;
    }
  }
}
</style>
