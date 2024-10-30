<template>
  <n-modal
    v-model:show="showModal"
    :auto-focus="false"
    :mask-closable="false"
    :close-on-esc="false"
    :show-icon="false"
    :title="$t('wb.bind_wechat')"
    transform-origin="center"
    preset="dialog"
  >
    <div class="bind-wechat-modal">
      <div class="hr top"></div>
      <div class="qrcode-box">
        <IbWechatQRCode type="bind" :handle-bind="handleBind" />
      </div>
      <div class="qrcode-tip">{{ $t('wb.wechat_tip') }}</div>
      <div v-if="errorMsg" class="error-message">{{ errorMsg }}</div>
    </div>
  </n-modal>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { IBResponse } from '@/types'
import { useUserStore } from '@/store'
import IbWechatQRCode from '@/components/IbWechatQRCode.vue'

const userStore = useUserStore()
const showModal = ref(false)
const show = () => {
  showModal.value = true
}
const errorMsg = ref('')

const handleBind = async (res: IBResponse) => {
  const code = Number(res.code)
  if (code === 129) {
    errorMsg.value = window.$t('wb.wechat_bind_error_129')
    return false
  }
  if (code === 130) {
    errorMsg.value = window.$t('wb.wechat_bind_error_130')
    return false
  }
  if (res.data && res.data.userId) {
    errorMsg.value = ''
    window.$message.success(window.$t('wb.bind_success'))
    showModal.value = false
    userStore.getUserInfo().then()
    return true
  }
  return false
}

defineExpose({ show })
</script>

<style scoped lang="scss">
.bind-wechat-modal {
  width: 100%;
  .hr {
    width: calc(100% + 56px);
    height: 1px;
    margin-left: -28px;
    background-color: var(--divider-color);
    &.top {
      margin-bottom: 24px;
    }
    &.bottom {
      margin-top: 24px;
    }
  }
  .qrcode-box {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 250px;
    height: 250px;
    margin: 0 auto;
    background-color: #ffffff;
    box-shadow: 0 0 10px 0 rgba(211, 211, 211, 0.3);
    :deep(.qrcode-img) {
      width: 100%;
      height: 100%;
    }
  }
  .qrcode-tip {
    display: flex;
    justify-content: center;
    font-size: 14px;
    margin-top: 20px;
  }
  .error-message {
    display: flex;
    justify-content: center;
    color: var(--error-color);
    margin-top: 10px;
    font-size: 14px;
    line-height: normal;
    height: 22px;
  }
}
</style>
