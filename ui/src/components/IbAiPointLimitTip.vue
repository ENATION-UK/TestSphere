<template>
  <div v-if="errorMsg && showTip" class="ib-ai-point-limit">
    <n-icon :component="ErrorCircle12Filled" class="icon-info" />
    <span v-if="showNum || userStore.aliYunUser">{{ errorMsg }}</span>
    <template v-else>
      <i18n-t keypath="ai_point_limit_error">
        <n-button type="primary" text size="tiny" @click="handleBuyAiPoint" class="buy-btn">
          {{ $t('here_btn') }}
        </n-button>
      </i18n-t>
      <span>{{ $t('or') }}</span>
      <n-button type="primary" text size="tiny" @click="handleInviteFriends" class="buy-btn">
        {{ $t('invite_friends') }}
      </n-button>
      {{ $t('earn_ai_point') }}
    </template>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import ErrorCircle12Filled from '@vicons/fluent/ErrorCircle12Filled'
import { IBAiPointLimitError } from '@/types/project'
import { useUserStore } from '@/store'
import { useCompanyStore } from '@/store/workbench'
import { useIbModal, useInviteFriendsModalModal } from '@/hooks'

const props = defineProps<{
  data: IBAiPointLimitError | string
  showNum?: boolean
}>()

const userStore = useUserStore()
const errorMsg = computed(() => {
  if (!props.data) return ''
  if (typeof props.data === 'string') return props.data
  const { requireAiPoints, remainingAiPoints } = props.data
  if (props.showNum) return window.$t('ai_point_limit_error_tip', { requireAiPoints, remainingAiPoints })
  return window.$t('ai_point_limit_error')
})

const handleBuyAiPoint = () => {
  useIbModal().buyAiPointModalRef.value?.show(true)
}

const handleInviteFriends = () => {
  useInviteFriendsModalModal()
}

const companyStore = useCompanyStore()
const showTip = ref(true)
watch(
  () => companyStore.company,
  (newVal) => {
    if (!newVal) return
    if (typeof props.data === 'string') return
    if (newVal.aiPoint > props.data.remainingAiPoints) {
      showTip.value = false
    }
  },
  { deep: true }
)
</script>

<style scoped lang="scss">
.ib-ai-point-limit {
  color: var(--error-color);
  font-size: 12px;
  white-space: nowrap;
  .icon-info {
    top: 2px;
    margin-right: 2px;
  }
  .buy-btn {
    // margin: 0 2px;
    text-decoration: underline;
  }
}
</style>
