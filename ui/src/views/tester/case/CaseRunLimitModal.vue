<template>
  <div v-if="data.code === 'MONTHLY_LIMIT_ERROR'" class="case-run-limit">
    <p>
      <i18n-t keypath="tester.run_count_limit_monthly_1">
        <span>{{ version }}</span>
        <span class="bold">{{ data.data.max }}</span>
        <br />
        <span class="bold">{{ data.data.ran }}</span>
        <span class="bold">{{ data.data.max - data.data.ran }}</span>
        <br />
        <span class="bold">{{ data.data.caseCount }}</span>
      </i18n-t>
    </p>
    <i18n-t keypath="tester.run_count_limit_monthly_2">
      <n-button text type="primary" class="opt-btn" @click="handleUpgradeVersion">{{ $t('upgrade_version') }}</n-button>
      <n-button text type="primary" class="opt-btn" @click="handleInviteFriends">{{ $t('invite_friends') }}</n-button>
    </i18n-t>
  </div>
  <div v-else-if="data.code === 'CONCURRENT_LIMIT_ERROR'" class="case-run-limit">
    <p>
      <i18n-t keypath="tester.run_count_limit_concurrency_1">
        <span>{{ version }}</span>
        <span class="bold">{{ concurrencyLimit }}</span>
      </i18n-t>
    </p>
    <i18n-t keypath="tester.run_count_limit_concurrency_2">
      <n-button text type="primary" class="opt-btn" @click="handleUpgradeVersion">{{ $t('upgrade_version') }}</n-button>
      <n-button text type="primary" class="opt-btn" @click="handleInviteFriends">{{ $t('invite_friends') }}</n-button>
    </i18n-t>
  </div>
  <div v-else-if="data.code === 'REQUIRE_HIGHER_PLAN'" class="case-run-limit">
    <p>
      <i18n-t keypath="tester.run_count_limit_monthly_3">
        <span>{{ version }}</span>
      </i18n-t>
    </p>
    <div class="upgrade-btn">
      <n-button color="#7c46f2" size="small" @click="handleUpgradeVersion">{{ $t('upgrade_version') }}</n-button>
    </div>
  </div>
  <div v-else class="case-run-limit">
    <p>{{ data.message }}</p>
    <n-button text type="primary" class="opt-btn" @click="handleUpgradeVersion">{{ $t('upgrade_version') }}</n-button>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { DialogReactive } from 'naive-ui'
import { IBSubscribeTypeAtMap } from '@/types/workbench'
import { useCompanyStore } from '@/store/workbench'
import { useInviteFriendsModalModal, useTesterBuyConsultModal } from '@/hooks'

const props = defineProps<{
  data: { code: string; message: string; data?: { max: number; ran: number; caseCount: number } }
  dialog?: DialogReactive
}>()
const companyStore = useCompanyStore()
const version = computed(() => {
  const ver = companyStore.subscriptionAt?.subscribeType || 'FREE'
  return window.$t(IBSubscribeTypeAtMap[ver])
})
const concurrencyLimit = computed(() => companyStore.company?.maxConcurrent || 0)

const handleUpgradeVersion = () => {
  useTesterBuyConsultModal()
}
const handleInviteFriends = () => {
  useInviteFriendsModalModal()
}
</script>

<style scoped lang="scss">
.case-run-limit {
  padding-left: 28px;
  padding-top: 10px;
  line-height: 38px;
  p {
    line-height: normal;
  }
  .bold {
    color: var(--warning-color);
    font-weight: bold;
  }
}
.opt-btn {
  text-decoration: underline;
  margin: 0 2px;
  &:hover {
    text-decoration: none;
  }
}
.upgrade-btn {
  display: flex;
  justify-content: flex-end;
  margin-top: 24px;
}
</style>
