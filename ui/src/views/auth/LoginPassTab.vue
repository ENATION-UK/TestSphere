<template>
  <n-form
    ref="passFormRef"
    :model="passForm"
    :rules="passFormRules"
    :show-label="false"
    @keyup.enter="handlePasswordLogin"
  >
    <n-form-item path="username">
      <n-input
        v-model:value="passForm.username"
        :placeholder="IBConfig.APP_CHINA ? $t('auth.username_placeholder') : $t('auth.email_placeholder')"
        clearable
      />
    </n-form-item>
    <n-form-item path="password">
      <n-input
        v-model:value="passForm.password"
        :placeholder="$t('auth.password_placeholder')"
        type="password"
        show-password-on="click"
        clearable
      />
    </n-form-item>
    <div class="btn-view">
      <n-button type="primary" :loading="passLoginLoading" class="login-btn" @click="handlePasswordLogin">
        {{ $t('auth.login') }}
      </n-button>
    </div>
    <div class="other-view">
      <n-button v-if="IBConfig.APP_CHINA" text type="primary" size="tiny" @click="loginStore.tabActive = 'login-sms'">
        {{ $t('auth.sms_login') }}
      </n-button>
      <div class="register-box">
        <span class="no-account">{{ $t('auth.no_account') }}</span>
        <n-button
          text
          type="primary"
          size="tiny"
          @click="loginStore.tabActive = IBConfig.APP_CHINA ? 'register-sms' : 'register-email'"
        >
          {{ $t('auth.register') }}
        </n-button>
      </div>
      <n-button text size="tiny" class="forgot-password" @click="loginStore.tabActive = 'forgot-password'">
        {{ $t('auth.forgot_password') }}
      </n-button>
    </div>
  </n-form>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import md5 from 'js-md5'
import { FormInst, FormRules } from 'naive-ui'
import { IBConfig } from '@/config'
import { mobileAndEmail } from '@/utils/form-validators'
import { useUserStore } from '@/store'
import { AuthApi } from '@/api/user'
import { useLoginStore } from './useLoginStore'

const userStore = useUserStore()
const loginStore = useLoginStore()
// 账号密码登录
const passForm = ref({ username: '', password: '' })
const passFormRules: FormRules = {
  username: { validator: mobileAndEmail, trigger: 'input' },
  password: { required: true, message: window.$t('auth.password_placeholder'), trigger: 'input' }
}
const passFormRef = ref<FormInst>()
const passLoginLoading = ref(false)
const handlePasswordLogin = async () => {
  try {
    await passFormRef.value?.validate()
  } catch (e) {
    return window.$message.error(window.$t('form_error'))
  }
  try {
    passLoginLoading.value = true
    const { username, password } = passForm.value
    const res = await AuthApi.login({ username, password: md5(password) })
    await userStore.login(res)
    await loginStore.handleLoginSuccess()
  } finally {
    passLoginLoading.value = false
  }
}
</script>

<style scoped lang="scss"></style>
