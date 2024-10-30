<template>
  <n-spin class="ib-spin-loading">
    <template #icon>
      <n-icon :component="IconLoader" :size="size || 18" />
    </template>
  </n-spin>
</template>

<script setup lang="ts">
import IconLoader from '@vicons/tabler/Loader'

defineProps<{
  size?: string | number
}>()
</script>

<style scoped lang="scss">
.ib-spin-loading {
  :deep(.n-spin) {
    width: auto;
    height: auto;
  }
}
</style>
