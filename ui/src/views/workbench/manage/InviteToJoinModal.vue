<template>
  <n-modal
    v-model:show="showModal"
    :close-on-esc="false"
    :mask-closable="false"
    :show-icon="false"
    :auto-focus="false"
    preset="dialog"
    style="width: 710px"
  >
    <div class="invite-title">{{ $t('wb.orders.invite_members') }}</div>
    <div class="invite-tip">
      <i18n-t keypath="wb.orders.invite_tip">
        <span style="color: #0872f8">7</span>
      </i18n-t>
    </div>
    <div class="invite-link">
      <n-input ref="linkInputRef" :value="shareLink" class="link">{{ shareLink }}</n-input>
      <n-button class="copy-btn" type="info" @click="handleCopyLink">{{ $t('copy_link') }}</n-button>
    </div>
    <div class="link-exp">
      {{ $t('wb.orders.link_exp_time') }}{{ formatUnix(validityTime) }}
      <n-button text type="info" :loading="resetLoading" @click="handleResetLink">
        <n-icon size="12">
          <icon-refresh />
        </n-icon>
        {{ $t('wb.orders.reset') }}
      </n-button>
    </div>
    <div class="members-total">
      <div class="number">
        {{ $t('wb.orders.member_total') }}
        <span class="num">{{ shareData?.seatUsed }}/{{ shareData?.seatTotal }}</span>
      </div>
      <n-button @click="handleAddMemberSeats">{{ $t('wb.orders.add_member_seats') }}</n-button>
    </div>
  </n-modal>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import IconRefresh from '@vicons/ionicons5/Refresh'
import { useClipboard } from '@vueuse/core'
import { decode } from 'js-base64'
import { InputInst } from 'naive-ui'
import { IBInviteData } from '@/types/workbench'
import { IBConfig } from '@/config'
import { formatUnix } from '@/utils'
import { useCompanyStore } from '@/store/workbench'
import { useIbModal, useInviteAccessDeniedModal } from '@/hooks'
import { InviteApi } from '@/api/workbench'

const companyStore = useCompanyStore()
const shareData = ref<IBInviteData>()
const linkInputRef = ref<InputInst>()
const shareLink = computed(() => {
  return `${IBConfig.APP_DOMAIN}#share=${shareData.value?.linkData}`
})
const validityTime = computed(() => {
  if (!shareData.value) return ''
  const linkData = decode(shareData.value!.linkData)
  return linkData.split('time:')[1]
})
const router = useRouter()
const handleAddMemberSeats = () => {
  showModal.value = false
  if (companyStore.company?.subscribeTypeDb.indexOf('TEAM') !== 0) {
    useInviteAccessDeniedModal(window.$t('wb.manage.enterprise.add_seats_db'))
    return
  }
  if (IBConfig.APP_CHINA) {
    useIbModal().buySeatsModalRef.value?.show()
  } else {
    router.push({ name: 'billsSubscription' })
  }
}
const resetLoading = ref(false)
const handleResetLink = async () => {
  try {
    resetLoading.value = true
    shareData.value = await InviteApi.resetShareData()
    window.$message.success(window.$t('wb.orders.reset_success'))
  } finally {
    resetLoading.value = false
  }
}
const handleCopyLink = async () => {
  try {
    linkInputRef.value?.focus()
    linkInputRef.value?.select()
    const { copy } = useClipboard({ legacy: true })
    await copy(shareLink.value)
    window.$message.success(window.$t('context_menus.copy_success'))
  } catch (e) {
    return window.$message.error(window.$t('context_menus.copy_error'))
  }
}

const showModal = ref(false)
const show = (data: IBInviteData) => {
  shareData.value = data
  showModal.value = true
}

defineExpose({ show })
</script>

<style scoped lang="scss">
.invite-title {
  color: var(--text-color-1);
  font-size: 20px;
  font-weight: bold;
  border-bottom: 1px solid var(--border-color);
  padding-bottom: 12px;
}
.invite-tip {
  margin-top: 18px;
  font-size: 14px;
}
.invite-link {
  display: flex;
  align-items: center;
  margin-top: 24px;
  .link {
    padding: 10px 12px;
    background-color: #eeeeee;
    border-radius: 4px;
    overflow: hidden;
    word-break: break-all;
  }
  :deep(.copy-btn) {
    width: 90px;
    height: 38px;
    margin-left: 12px;
  }
}
.link-exp {
  display: flex;
  align-items: center;
  font-size: 12px !important;
  height: 40px;
  :deep(.n-button) {
    font-size: 12px !important;
    margin-left: 12px;
    .n-icon {
      margin-right: 2px;
    }
  }
}
.members-total {
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-top: 1px solid var(--border-color);
  padding-top: 24px;
  .number {
    display: flex;
    align-items: center;
    .num {
      color: #e2433d;
      font-size: 14px;
      font-weight: bold;
      margin-left: 10px;
      letter-spacing: 3px;
    }
  }
}
</style>
