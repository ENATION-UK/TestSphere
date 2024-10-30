<template>
  <n-space align="center" justify="center">
    <n-button type="primary" size="large" text :focusable="false" @click="emit('handle-opt', 'view')">
      <n-icon><EyeOutline /></n-icon>
    </n-button>
    <n-button
      type="warning"
      size="large"
      text
      :disabled="task.status !== 'running'"
      :focusable="false"
      @click="emit('handle-opt', 'stop')"
    >
      <n-icon><StopCircleOutline /></n-icon>
    </n-button>
  </n-space>
</template>

<script setup lang="ts">
import EyeOutline from '@vicons/ionicons5/EyeOutline'
import StopCircleOutline from '@vicons/ionicons5/StopCircleOutline'
import TrashOutline from '@vicons/ionicons5/TrashOutline'
import { IBCaseTask } from '@/types/tester'

const props = defineProps<{
  task: IBCaseTask
}>()

const emit = defineEmits<{
  (e: 'handle-opt', value: string)
}>()
</script>

<style scoped lang="scss"></style>
