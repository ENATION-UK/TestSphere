<template>
  <div v-if="!extension.installed" class="ext-warning">
    <n-icon class="icon-info">
      <Info24Filled />
    </n-icon>
    <span>{{ $t('tester.no_install_extension') }}</span>
    <n-button text size="tiny" type="info" @click="extension.showExtNotInstalledModal">
      {{ $t('tester.install_extension') }}
    </n-button>
  </div>
</template>

<script setup lang="ts">
import Info24Filled from '@vicons/fluent/Info24Filled'
import { useTesterExt } from '@/hooks/useTesterExt'

const extension = useTesterExt()
</script>

<style scoped lang="scss">
.ext-warning {
  display: flex;
  align-items: center;
  flex-shrink: 0;
  color: #994a05;
  background-color: #ffeac2;
  border-radius: 6px;
  padding: 4px 12px;
  margin-right: 12px;
  :deep(.n-icon) {
    margin-right: 6px;
  }
  :deep(.n-button) {
    text-decoration: underline;
    margin-left: 6px;
  }
}
</style>
