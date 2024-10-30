<template>
  <n-space align="center" justify="center" :wrap-item="false">
    <n-tooltip>
      <template #trigger>
        <n-icon @click="emit('handle-menu', 'run')">
          <PlayCircle24Regular />
        </n-icon>
      </template>
      {{ $t('tester.run_case') }}
    </n-tooltip>
    <n-tooltip>
      <template #trigger>
        <n-icon @click="emit('handle-menu', 'history')">
          <History24Regular />
        </n-icon>
      </template>
      {{ $t('tester.view_run_history') }}
    </n-tooltip>
    <n-dropdown trigger="hover" :options="menuOptions" @select="handleSelect">
      <n-icon color="#333333">
        <MoreHorizontal20Regular />
      </n-icon>
    </n-dropdown>
  </n-space>
</template>

<script setup lang="ts">
import History24Regular from '@vicons/fluent/History24Regular'
import MoreHorizontal20Regular from '@vicons/fluent/MoreHorizontal20Regular'
import PlayCircle24Regular from '@vicons/fluent/PlayCircle24Regular'
import Menus from '@/utils/menus'

const emit = defineEmits<{
  (e: 'handle-menu', key: string)
}>()

const menuOptions = [Menus.edit, Menus.copy, Menus.del]
const handleSelect = (key: string) => emit('handle-menu', key)
</script>

<style scoped lang="scss">
:deep(.n-icon) {
  line-height: normal;
  cursor: pointer;
  font-size: 24px;
  color: #7c46f2;
}
</style>
