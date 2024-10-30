<template>
  <n-button v-if="url" :href="url" type="primary" size="tiny" text tag="a" target="_blank">
    <template #icon>
      <n-icon size="18"><DocumentText20Regular /></n-icon>
    </template>
    {{ $t('docs') }}
  </n-button>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import DocumentText20Regular from '@vicons/fluent/DocumentText20Regular'
import { IBConfig } from '@/config'

const props = defineProps<{
  docUrl: string
}>()

const url = computed(() => {
  const { DOCS_URL } = IBConfig
  if (!DOCS_URL || !props.docUrl) return ''
  return DOCS_URL + props.docUrl
})
</script>

<style scoped lang="scss"></style>
