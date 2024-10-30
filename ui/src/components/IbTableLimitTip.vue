<template>
  <div v-if="errorMsg && showTip" class="ib-table-limit">
    <n-icon :component="ErrorCircle12Filled" />
    {{ errorMsg }}
    <n-button v-if="!userStore.aliYunUser" type="primary" text size="tiny" @click="handleUpgrade">
      {{ $t('upgrade') }}
    </n-button>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import ErrorCircle12Filled from '@vicons/fluent/ErrorCircle12Filled'
import { IBTableLimitError } from '@/types/project'
import { IBConfig } from '@/config'
import { useUserStore } from '@/store'
import { useCompanyStore } from '@/store/workbench'
import { useIbModal, useSubscriptionDbModal } from '@/hooks'

const props = defineProps<{
  data: IBTableLimitError | string
}>()

const userStore = useUserStore()
const errorMsg = computed(() => {
  if (!props.data) return ''
  if (typeof props.data === 'string') return props.data
  const { max, current, tryCount } = props.data
  return (
    window.$t('tables.table_max_error_tip', { max, current }) +
    ' ' +
    window.$t('tables.table_max_error_tip_try_count', { tryCount })
  )
})

const handleUpgrade = () => {
  if (IBConfig.APP_CHINA) {
    useIbModal().buyPlanModalRef.value?.show({ modal: true })
  } else {
    useSubscriptionDbModal()
  }
}

const companyStore = useCompanyStore()
const showTip = ref(true)
watch(
  () => companyStore.company,
  (newVal) => {
    if (!newVal) return
    if (typeof props.data === 'string') return
    if (newVal.tableTotal > props.data.max) {
      showTip.value = false
    }
  },
  { deep: true }
)
</script>

<style scoped lang="scss">
.ib-table-limit {
  color: var(--error-color);
  font-size: 12px;
  :deep(.n-icon) {
    top: 2px;
    margin-right: 2px;
  }
}
</style>
