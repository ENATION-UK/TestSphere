<template>
  <div class="wechat-login-view">
    <IbWechatQRCode type="login" :handle-login="handleLogin" />
    <div class="tip-view">
      {{ $t('auth.follow_wechat') }}
      <n-button text type="primary" size="tiny" @click="loginStore.openPrivacyPolicy">
        {{ $t('auth.privacy_policy') }}
      </n-button>
    </div>
    <div class="other-view">
      <n-button text type="primary" size="tiny" @click="loginStore.tabActive = 'login-password'">
        {{ $t('auth.account_login') }}
      </n-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { IBResponse } from '@/types'
import { useUserStore } from '@/store'
import IbWechatQRCode from '@/components/IbWechatQRCode.vue'
import { useLoginStore } from './useLoginStore'

const userStore = useUserStore()
const loginStore = useLoginStore()

// 扫码登录
const handleLogin = async (res: IBResponse) => {
  if (Number(res.code) === 109) {
    loginStore.tabActive = 'bind-mobile'
    return true
  }
  if (res.data && res.data.accessToken) {
    await userStore.login(res.data)
    await loginStore.handleLoginSuccess()
    return true
  }
  return false
}
</script>

<style scoped lang="scss">
.wechat-login-view {
  display: flex;
  flex-direction: column;
  .qrcode-view {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    .qrcode-img {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 220px;
      height: 220px;
    }
    .exp-box {
      position: absolute;
      top: 0;
      left: 0;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      width: 100%;
      height: 100%;
      background-color: rgba(255, 255, 255, 0.9);
      .text {
        color: #19191a;
        font-size: 20px;
        font-weight: bold;
      }
      .refresh-btn {
        width: 150px;
        height: 40px;
        margin-top: 24px;
        border-radius: 5px;
      }
    }
  }
  .tip-view {
    margin-top: 4px;
    padding: 0 24px;
  }
  .other-view {
    display: flex;
    justify-content: center;
    margin-top: 16px;
    margin-bottom: 16px;
  }
}
</style>
