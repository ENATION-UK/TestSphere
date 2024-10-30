<template>
  <div class="status-box" :style="`--status-color: ${getTesterStatusColor(row.lastRunStatus)}`">
    <div class="status" :class="row.lastRunStatus">{{ formatTesterStatus(row.lastRunStatus, true) }}</div>
  </div>
</template>

<script setup lang="ts">
import { IBCase } from '@/types/tester'
import { formatTesterStatus, getTesterStatusColor } from '../../helpers'

const props = defineProps<{
  row: IBCase
}>()
</script>

<style scoped lang="scss">
.status-box {
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  .status {
    font-size: 12px;
    min-width: 90px;
    padding: 2px 6px;
    color: var(--status-color);
    border-radius: 99999px;
    &.success,
    &.completed {
      background-color: #e1faea;
    }
    &.running {
      background-color: #e7f2ff;
    }
    &.failed,
    &.error {
      background-color: #fcdadb;
    }
    &.terminated,
    &.pending {
      background-color: #e0e0e0;
    }
    &.queued {
      background-color: #f8e7cf;
    }
  }
}
</style>
