<template>
  <n-button
    v-if="showUpgrade && !isTester"
    type="primary"
    size="tiny"
    round
    @click="handleUpgrade"
    class="upgrade-btn linear-gradient-btn"
  >
    <template #icon>
      <n-icon size="18"><IconCrown /></n-icon>
    </template>
    {{ $t('upgrade_vip') }}
  </n-button>
  <div v-if="isTester" class="tester-upgrade" @click="handleUpgrade">
    <div class="ver-info">{{ verInfoText }}</div>
    <div class="used-info">
      <div class="used-count">{{ usedCountText }}</div>
      <n-progress :percentage="usedPercentage" :show-indicator="false" color="#7f56da" />
    </div>
    <div v-if="showUpgrade" class="upgrade">
      <n-icon><FlashOutline /></n-icon>
      {{ $t('upgrade') }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import FlashOutline from '@vicons/ionicons5/FlashOutline'
import IconCrown from '@vicons/tabler/Crown'
import { IBConfig } from '@/config'
import { useCompanyStore } from '@/store/workbench'
import { useIbModal, useSubscriptionAtModal, useSubscriptionDbModal, useTesterBuyConsultModal } from '@/hooks'

const companyStore = useCompanyStore()
const isTester = computed(() => location.href.includes('/tester'))
const showUpgrade = computed(() => {
  if (isTester.value) {
    return !companyStore.subscriptionAt?.subscribeType?.includes('ADVANCED')
  }
  return !companyStore.subscriptionDb?.subscribeType?.includes('TEAM')
})
const verInfoText = computed(() => {
  if (!companyStore.company) return 'Free'
  switch (companyStore.company.subscribeTypeAt) {
    case 'FREE':
      return 'Free'
    case 'PROFESSIONAL':
    case 'PRO_MONTHLY':
    case 'PRO_YEARLY':
      return 'Pro'
    case 'ADVANCED':
    case 'ADVANCED_MONTHLY':
    case 'ADVANCED_YEARLY':
      return 'Adv.'
    default:
      return 'Free'
  }
})
const maxCount = computed(() => {
  if (!companyStore.company) return 0
  return companyStore.company.maxCountMonthly
})
const runTotalTimes = computed(() => {
  if (!companyStore.company) return 0
  return companyStore.company.runTotalMonthly
})
const usedCountText = computed(() => {
  return window.$t('tester.runs_of_count', { used: runTotalTimes.value, total: maxCount.value })
})
const usedPercentage = computed(() => {
  if (!companyStore.company) return 0
  let p = parseInt(String((runTotalTimes.value / maxCount.value).toFixed(2) * 100))
  if (p > 100) p = 100
  return p
})
const handleUpgrade = () => {
  if (IBConfig.APP_CHINA) {
    if (isTester.value) {
      useTesterBuyConsultModal()
    } else {
      useIbModal().buyPlanModalRef.value?.show({ modal: true, type: 'dbdesign' })
    }
  } else {
    if (isTester.value) {
      useSubscriptionAtModal()
    } else {
      useSubscriptionDbModal()
    }
  }
}
</script>

<style scoped lang="scss">
.upgrade-btn {
  border: none !important;
  box-shadow: none !important;
  :deep(.n-base-wave),
  :deep(.n-button__border),
  :deep(.n-button__state-border) {
    display: none;
  }
}
.tester-upgrade {
  display: flex;
  align-items: center;
  height: 35px;
  border: 1px solid #bbbbbb;
  border-radius: 10px;
  padding-right: 4px;
  cursor: pointer;
  overflow: hidden;
  .ver-info {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;
    padding: 0 6px;
    color: #ffffff;
    font-size: 12px;
    text-transform: capitalize;
    background-color: #7f56da;
  }
  .used-info {
    display: flex;
    flex-direction: column;
    justify-content: center;
    height: 100%;
    font-size: 12px;
    font-weight: bold;
    padding: 0 6px;
  }
  .upgrade {
    display: flex;
    align-items: center;
    color: #2b09ff;
    font-size: 12px;
    font-weight: bold;
    padding-right: 6px;
    text-transform: capitalize;
  }
}
</style>
