<template>
  <n-form ref="smsFormRef" :model="smsForm" :rules="smsFormRules" :show-label="false">
    <n-form-item path="mobile">
      <n-input
        v-model:value="smsForm.mobile"
        :maxlength="11"
        :placeholder="$t('auth.mobile_placeholder')"
        @keyup.enter="handleSendSmsCode"
      />
    </n-form-item>
    <n-form-item path="code">
      <n-input
        v-model:value="smsForm.code"
        :maxlength="6"
        :placeholder="$t('auth.sms_placeholder')"
        @keyup.enter="handleSmsLogin"
      >
        <template #suffix>
          <n-button
            text
            size="tiny"
            type="primary"
            :loading="sendSmsCodeLoading"
            :disabled="smsCountdown.time.value > 0"
            @click="handleSendSmsCode"
          >
            {{ smsCountdown.time.value <= 0 ? $t('auth.send') : smsCountdown.time.value + 's' }}
          </n-button>
        </template>
      </n-input>
    </n-form-item>
  </n-form>
  <div class="btn-view">
    <n-button type="primary" :loading="smsLoginLoading" class="login-btn" @click="handleSmsLogin">
      {{ $t('auth.login') }}
    </n-button>
  </div>
  <div class="other-view">
    <n-button text type="primary" size="tiny" @click="loginStore.tabActive = 'login-password'">
      {{ $t('auth.password_login') }}
    </n-button>
    <div class="register-box">
      <span class="no-account">{{ $t('auth.no_account') }}</span>
      <n-button text type="primary" size="tiny" @click="loginStore.tabActive = 'register-sms'">
        {{ $t('auth.register') }}
      </n-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { FormInst, FormRules } from 'naive-ui'
import { regExp } from '@/utils'
import { useUserStore } from '@/store'
import { useCountdown, useTencentCaptcha } from '@/hooks'
import { AuthApi, CaptchaApi } from '@/api/user'
import { useLoginStore } from './useLoginStore'

const userStore = useUserStore()
const loginStore = useLoginStore()
// 手机短信登录
const smsForm = ref({ mobile: '', code: '' })
const smsFormRules: FormRules = {
  mobile: [
    {
      key: 'mobile',
      validator: (rule, value) => {
        if (!value) return new Error(window.$t('auth.mobile_placeholder'))
        if (!regExp.mobile.test(value)) return new Error(window.$t('auth.mobile_format_error'))
        return true
      },
      trigger: 'input'
    }
  ],
  code: { required: true, message: window.$t('auth.code_placeholder'), trigger: 'input' }
}
const smsFormRef = ref<FormInst>()
const sendSmsCodeLoading = ref(false)
const smsCountdown = useCountdown()
const tencentCaptcha = useTencentCaptcha()
const handleSendSmsCode = async () => {
  try {
    await smsFormRef.value?.validate(
      () => {},
      (rule) => rule.key === 'mobile'
    )
  } catch (e) {
    return false
  }
  const params = await tencentCaptcha.captcha()
  try {
    sendSmsCodeLoading.value = true
    const { mobile } = smsForm.value
    await CaptchaApi.sendMobileCode(mobile, 'LOGIN', params)
    window.$message.success(window.$t('send_success'))
    smsCountdown.start()
  } catch (e) {
    if (e && e.message) {
      //
    } else {
      window.$message.error(window.$t('auth.send_error'))
    }
  } finally {
    sendSmsCodeLoading.value = false
  }
}
const smsLoginLoading = ref(false)
const handleSmsLogin = async () => {
  try {
    await smsFormRef.value?.validate()
  } catch (e) {
    return window.$message.error(window.$t('form_error'))
  }
  try {
    smsLoginLoading.value = true
    const { mobile, code } = smsForm.value
    const res = await AuthApi.loginByMobile({ mobile, code })
    await userStore.login(res)
    await loginStore.handleLoginSuccess()
  } finally {
    smsLoginLoading.value = false
  }
}
</script>

<style scoped lang="scss"></style>
