<template>
  <n-modal
    v-model:show="showModal"
    :mask-closable="false"
    :close-on-esc="false"
    :show-icon="false"
    :auto-focus="false"
    transform-origin="center"
    preset="dialog"
    style="width: 400px; padding: 0"
  >
    <div class="receive-invite-modal">
      <ib-logo width="150" type="left-right" />
      <n-avatar class="avatar">{{ inviteStore.shareData?.companyName?.substring(0, 1) }}</n-avatar>
      <div class="invite-name">
        <n-ellipsis style="max-width: 80px">{{ inviteStore.shareData?.userName }}</n-ellipsis>
        {{ $t('auth.invite_u_join_company') }}
      </div>
      <div class="company-name">
        <n-ellipsis style="max-width: 260px">
          {{ inviteStore.shareData?.companyName }}
        </n-ellipsis>
      </div>
      <n-button type="info" size="large" :loading="joinLoading" class="join-btn" @click="onJoinNow">
        {{ $t('wb.manage.join_now') }}
      </n-button>
    </div>
  </n-modal>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useInviteStore } from '@/store/workbench'
import { useJoinTeamSuccess } from '@/hooks'
import IbLogo from '@/components/IbLogo.vue'

const showModal = ref(false)
const show = () => {
  showModal.value = true
}
const inviteStore = useInviteStore()
const joinLoading = ref(false)
const onJoinNow = async () => {
  try {
    joinLoading.value = true
    await inviteStore.bindUser()
    showModal.value = false
    useJoinTeamSuccess(inviteStore.shareData!.companyId)
  } finally {
    joinLoading.value = false
  }
}

defineExpose({ show })
</script>

<style scoped lang="scss">
.receive-invite-modal {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 24px;
  .avatar {
    font-size: 28px;
    font-weight: bold;
    color: #ffffff;
    background-color: #4d83f8;
    width: 55px;
    height: 55px;
    border-radius: 8px;
    margin-top: 24px;
  }
  .invite-name {
    font-size: 12px;
    margin-top: 12px;
  }
  .company-name {
    font-size: 20px;
    margin-top: 6px;
  }
  .join-btn {
    margin-top: 24px;
    width: 300px;
    border-radius: 4px;
    :deep(.n-button__content) {
      font-size: 16px;
      font-weight: bold;
    }
  }
}
</style>
