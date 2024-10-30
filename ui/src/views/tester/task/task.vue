<template>
  <div class="task">
    <div class="search-bar">
      <n-button type="info" @click="onCreateTask">{{ $t('tester.create_task') }}</n-button>
      <div class="search-items">
        <div class="search-item">
          <div class="item-label">{{ $t('tester.time_range') }}:</div>
          <n-date-picker
            v-model:value="tasksStore.dateRange"
            type="daterange"
            clearable
            close-on-select
            :is-date-disabled="dateDisabled"
            class="date-picker"
          />
        </div>
        <div class="search-item">
          <div class="item-label">{{ $t('tester.run_status') }}:</div>
          <n-select v-model:value="tasksStore.params.status" :options="IBTesterStatusMapOptions" style="width: 130px" />
        </div>
        <div class="search-item">
          <n-input
            v-model:value="tasksStore.params.keyword"
            :maxlength="30"
            :placeholder="$t('search_placeholder')"
            @keyup.enter="tasksStore.onSearch"
            style="width: 220px"
          />
        </div>
        <n-button type="info" class="search-btn" @click="tasksStore.onSearch">{{ $t('search') }}</n-button>
      </div>
    </div>
    <n-spin :show="tasksStore.loading">
      <div class="task-list">
        <n-data-table
          remote
          :data="tasksStore.tasks"
          :columns="taskColumns"
          :pagination="tasksStore.pagination"
          :bordered="false"
          :single-line="false"
          :min-height="tasksStore.tasks.length === 0 ? 474 : 520"
          @update:page="tasksStore.onPageChange"
        />
      </div>
    </n-spin>
  </div>
  <CreateTaskModal ref="createTaskModalRef" />
  <TaskRunDetailsModal ref="taskRunDetailsModalRef" />
</template>

<script setup lang="ts">
import { defineAsyncComponent, h, onMounted, ref, watch } from 'vue'
import { NButton, NEllipsis } from 'naive-ui'
import { IBCaseTask, IBTesterStatusMapOptions } from '@/types/tester'
import { formatUnix } from '@/utils'
import { useTasksStore } from '@/store/tester/useTasksStore'
import { formatTesterStatus, getTesterStatusColor } from '@/views/tester/helpers'
import TaskOperation from './TaskOperation.vue'
import TaskRunDetailsModal from './TaskRunDetailsModal.vue'

const tasksStore = useTasksStore()
const taskRunDetailsModalRef = ref<InstanceType<typeof TaskRunDetailsModal>>()
const dateDisabled = (ts: number) => ts > Date.now()
const handleOpt = (type: string, row: IBCaseTask) => {
  switch (type) {
    case 'view':
      return handleViewTask(row)
    case 'stop':
      return handleStopTask(row)
  }
}
const taskColumns = [
  {
    title: window.$t('tester.task_name'),
    key: 'taskName',
    width: 300,
    render: (row: IBCaseTask) =>
      h(
        NEllipsis,
        { style: 'max-width: 276px', tooltip: { style: 'max-width: 400px' } },
        { default: () => row.taskName }
      )
  },
  {
    title: window.$t('tester.task_case_total'),
    render: (row: IBCaseTask) => `${row.successCount + row.failureCount}/${row.caseCount}`
  },
  { title: window.$t('tester.task_success_total'), key: 'successCount', align: 'center' },
  { title: window.$t('tester.task_failure_total'), key: 'failureCount', align: 'center' },
  {
    title: window.$t('tester.run_status'),
    key: 'status',
    align: 'center',
    width: 120,
    render: (row: IBCaseTask) =>
      h(
        'span',
        { style: { color: getTesterStatusColor(row.status) } },
        { default: () => formatTesterStatus(row.status) }
      )
  },
  {
    title: window.$t('tester.create_time'),
    key: 'createTime',
    align: 'center',
    render: (row: IBCaseTask) => formatUnix(row.createTime, '')
  },
  {
    title: window.$t('tester.complete_time'),
    key: 'completeTime',
    align: 'center',
    render: (row: IBCaseTask) => formatUnix(row.completeTime, '')
  },
  { title: window.$t('tester.task_creator'), key: 'creator', align: 'center' },
  {
    title: window.$t('operation'),
    key: 'operation',
    width: 120,
    align: 'center',
    render: (row: IBCaseTask) =>
      h(TaskOperation, {
        task: row,
        onHandleOpt: (type: string) => handleOpt(type, row)
      })
  }
]
const handleViewTask = (task: IBCaseTask) => {
  taskRunDetailsModalRef.value?.show(task)
}
const handleStopTask = async (task: IBCaseTask) => {
  await window.$confirm(window.$t('tester.confirm_stop_task'), { type: 'warning' }, async () => {
    await tasksStore.stopTask(task)
    window.$message.success(window.$t('stopped'))
  })
  tasksStore.getTaskList()
}
onMounted(() => tasksStore.getTaskList())
watch(
  () => tasksStore.dateRange,
  () => tasksStore.onSearch()
)
watch(
  () => tasksStore.params.status,
  () => tasksStore.onSearch()
)

const CreateTaskModal = defineAsyncComponent(() => import('./CreateTaskModal.vue'))
const createTaskModalRef = ref<InstanceType<typeof CreateTaskModal>>()
const onCreateTask = () => {
  createTaskModalRef.value?.show(tasksStore.onSearch)
}
</script>

<style scoped lang="scss">
.task {
  width: 100%;
  height: 100%;
}
.search-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  height: 100px;
  .search-items {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    height: 100%;
  }
  .search-item {
    display: flex;
    align-items: center;
    & + .search-item {
      margin-left: 20px;
    }
    .item-label {
      margin-right: 12px;
    }
  }
  .search-btn {
    min-width: 70px;
    margin-left: 20px;
  }
}
</style>
