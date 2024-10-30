<template>
  <div class="result">
    <IbFullHeader :title="$t('wb.ai_point_buy_result')" />
    <div class="result-container">
      <n-result
        size="huge"
        :status="status === 'success' ? 'success' : '404'"
        :title="title"
        :description="description"
      >
        <template #footer>
          <n-button @click="handleBackWorkbench">{{ $t('wb.orders.back_workbench') }}</n-button>
        </template>
      </n-result>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import IbFullHeader from '@/components/IbFullHeader.vue'

const route = useRoute()
const router = useRouter()
const status = computed(() => route.query.status as string)
const title = computed(() => {
  if (status.value === 'success') {
    return window.$t('success')
  }
  return window.$t('cancelled')
})
const description = computed(() => {
  if (status.value === 'success') {
    return window.$t('wb.ai_point_buy_success')
  }
  return window.$t('wb.ai_point_buy_cancel')
})

const handleBackWorkbench = () => {
  window.location.href = router.resolve('/').href
}
</script>

<style scoped lang="scss">
.result {
  .result-container {
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 500px;
  }
}
</style>
