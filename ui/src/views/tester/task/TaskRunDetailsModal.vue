<template>
  <n-modal
    v-model:show="showModal"
    :mask-closable="false"
    :close-on-esc="false"
    :show-icon="false"
    :auto-focus="false"
    preset="dialog"
    transform-origin="center"
    style="width: 900px"
  >
    <div v-if="taskStore.task" class="task-run-details">
      <div class="status-bar">
        <div class="status-tabs">
          <div
            v-for="item in statusOptions"
            :key="item.key"
            class="item-tab"
            :class="{ active: taskStore.params.status === item.key }"
            @click="handleChangeStatus(item)"
          >
            {{ item.label }}({{ taskStore.task!.stat[item.statKey] }})
          </div>
        </div>
        <div class="refresh-box">
          <IbSpinLoading v-if="taskStore.loading" />
          <n-button v-else text @click="taskStore.getRecordList">
            <n-icon size="20"><RefreshRound /></n-icon>
          </n-button>
        </div>
      </div>
      <div class="case-list">
        <n-spin :show="taskStore.loading">
          <n-data-table
            remote
            :data="taskStore.records"
            :columns="caseColumns"
            :pagination="taskStore.pagination"
            :single-line="false"
            :min-height="taskStore.records.length === 0 ? 474 : 520"
            @update:page="taskStore.onPageChange"
          />
        </n-spin>
      </div>
    </div>
  </n-modal>
</template>

<script setup lang="ts">
import { h, ref } from 'vue'
import { useRouter } from 'vue-router'
import RefreshRound from '@vicons/material/RefreshRound'
import { cloneDeep } from 'lodash-es'
import { NButton, NProgress, NTag } from 'naive-ui'
import { IBCaseRecord, IBCaseTask, IBCaseTaskStatType, IBTesterStatusMap } from '@/types/tester'
import { formatSeconds, formatUnix } from '@/utils'
import { useTaskStore } from '@/store/tester'
import IbSpinLoading from '@/components/IbSpinLoading.vue'
import { formatTesterStatus } from '../helpers'

const taskStore = useTaskStore()
const showModal = ref(false)
const router = useRouter()
const statusOptions: Array<{ label: string; key: string; statKey: IBCaseTaskStatType }> = [
  { label: window.$t('all'), key: 'all', statKey: 'allCount' },
  { label: window.$t(IBTesterStatusMap['running']), key: 'running', statKey: 'runningCount' },
  { label: window.$t(IBTesterStatusMap['queued']), key: 'queued', statKey: 'queuedCount' },
  { label: window.$t(IBTesterStatusMap['completed']), key: 'completed', statKey: 'completedCount' }
]
const getProgress = (row: IBCaseRecord) => {
  const { status, stepCount, successStepCount } = row
  if (['success', 'failed'].includes(status)) return 100
  if (!stepCount || !successStepCount) return 0
  return Number(((row.successStepCount * 100) / row.stepCount).toFixed(2))
}
const getProgressStatus = (row: IBCaseRecord) => {
  const { status } = row
  if (status === 'error') return 'error'
  if (status === 'failed') return 'error'
  if (status === 'terminated') return 'warning'
  if (status === 'success') return 'success'
  return 'default'
}
const onHistoryDetail = (row: IBCaseRecord) => {
  showModal.value = false
  router.push({ name: 'testerHistoryDetail', params: { historyId: row.id } })
}
const caseColumns = [
  {
    title: window.$t('tester.case_name'),
    key: 'testCaseName',
    align: 'left',
    width: 250,
    render: (row) =>
      h(
        'span',
        { text: true, class: 'link-btn underline', onClick: () => onHistoryDetail(row) },
        { default: () => row.testCaseName }
      )
  },
  {
    title: window.$t('tester.start_time'),
    key: 'createdAt',
    align: 'center',
    render: (row) => formatUnix(row.createdAt, '')
  },
  {
    title: window.$t('tester.run_duration'),
    key: 'duration',
    align: 'center',
    render: (row) => formatSeconds(row.duration)
  },
  {
    title: window.$t('tester.run_status'),
    key: 'status',
    align: 'center',
    render: (row: IBCaseRecord) => {
      const { status } = row
      let btnType
      if (status === 'running') {
        btnType = 'primary'
      } else if (status === 'queued') {
        btnType = 'info'
      } else if (status === 'success' || status === 'completed') {
        btnType = 'success'
      } else if (status === 'failed') {
        btnType = 'error'
      } else if (status === 'error') {
        btnType = 'error'
      }
      return h(
        NTag,
        { type: btnType, size: 'small', bordered: false },
        { default: () => formatTesterStatus(row.status) }
      )
    }
  },
  {
    title: window.$t('tester.run_progress'),
    key: 'progress',
    align: 'center',
    width: 200,
    render: (row: IBCaseRecord) =>
      h(NProgress, {
        percentage: getProgress(row),
        type: 'line',
        processing: row.status === 'running',
        status: getProgressStatus(row),
        indicatorPlacement: 'inside'
      })
  }
]
const handleChangeStatus = (item) => {
  taskStore.params.pageNo = 1
  taskStore.params.status = item.key
  taskStore.getRecordList()
}
const show = (task: IBCaseTask) => {
  task = cloneDeep(task)
  if (!task.stat) {
    task.stat = { allCount: 0, completedCount: 0, queuedCount: 0, runningCount: 0 }
  }
  taskStore.task = task
  taskStore.params.status = 'all'
  taskStore.getRecordList()
  showModal.value = true
}

defineExpose({ show })
</script>

<style scoped lang="scss">
.task-run-details {
  width: 100%;
  min-height: 300px;
  padding-top: 20px;
  .status-bar {
    display: flex;
    align-items: center;
  }
  .status-tabs {
    display: flex;
    align-items: center;
    width: fit-content;
    border: 1px solid var(--primary-color);
    border-radius: 6px;
    .item-tab {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 100px;
      height: 35px;
      cursor: pointer;
      transition: all 0.2s var(--bezier);
      &.active {
        color: #fff;
        background-color: var(--primary-color);
      }
      & + .item-tab {
        border-left: 1px solid var(--primary-color);
      }
    }
  }
  .refresh-box {
    display: flex;
    align-items: center;
    margin-left: 20px;
  }
  .case-list {
    margin-top: 25px;
  }
}
</style>
