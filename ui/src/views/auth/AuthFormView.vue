<template>
  <div class="auth-form-view">
    <slot name="header" />
    <div class="inner-form">
      <div class="form-title">
        <n-button v-if="showBack" quaternary size="small" @click="handleOnBack">
          <n-icon class="icon-back">
            <ios-arrow-back />
          </n-icon>
        </n-button>
        {{ title }}
      </div>
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import IosArrowBack from '@vicons/ionicons4/IosArrowBack'
import { useLoginStore } from './useLoginStore'

const loginStore = useLoginStore()
const handleOnBack = () => {
  if (loginStore.registerStep === 2) {
    loginStore.registerStep = 1
  } else if (loginStore.tabActive === 'forgot-password') {
    loginStore.tabActive = 'login-password'
  }
}
const showBack = computed(() => {
  if (loginStore.registerStep === 2) return true
  return ['forgot-password', 'bind-mobile'].includes(loginStore.tabActive)
})
const title = computed(() => {
  if (loginStore.registerStep === 2) {
    return window.$t('auth.email_register_step2_title')
  }
  const keys = {
    'bind-mobile': 'auth.bind_mobile',
    'forgot-password': 'auth.forgot_password',
    'login-wechat': 'auth.wechat_login',
    'login-sms': 'auth.sms_login',
    'login-password': 'auth.password_login',
    'register-sms': 'auth.sms_register',
    'register-email': 'auth.email_register'
  }
  return window.$t(keys[loginStore.tabActive])
})
</script>

<style scoped lang="scss">
.auth-form-view {
  width: 360px;
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: #fff;
  border: 1px solid rgba(19, 18, 43, 0.07);
  box-shadow: 0 22px 50px rgba(217, 224, 253, 0.36);
  border-radius: 10px;
  .inner-form {
    display: flex;
    flex-direction: column;
    justify-content: center;
    width: 296px;
    padding: 32px 0 16px;
  }
  .form-title {
    display: flex;
    align-items: center;
    position: relative;
    width: 296px;
    height: 28px;
    margin-bottom: 24px;
    font-size: 20px;
    line-height: 28px;
    font-weight: bold;
    :deep(.n-button) {
      padding: 0 6px;
      margin-right: 10px;
    }
    .icon-back {
      font-size: 20px;
    }
  }
}
</style>
