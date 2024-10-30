<template>
  <n-form ref="smsRegisterFormRef" :model="smsRegisterForm" :rules="smsRegisterFormRules" :show-label="false">
    <n-form-item path="mobile">
      <n-input v-model:value="smsRegisterForm.mobile" :maxlength="11" :placeholder="$t('auth.mobile_placeholder')" />
    </n-form-item>
    <n-form-item path="code">
      <n-input v-model:value="smsRegisterForm.code" :maxlength="6" :placeholder="$t('auth.sms_placeholder')">
        <template #suffix>
          <n-button
            text
            type="primary"
            size="tiny"
            :loading="smsRegisterSendLoading"
            :disabled="smsRegisterCountdown.time.value > 0"
            @click="handleSendSmsRegisterCode"
          >
            {{ smsRegisterCountdown.time.value <= 0 ? $t('auth.send') : smsRegisterCountdown.time.value + 's' }}
          </n-button>
        </template>
      </n-input>
    </n-form-item>
    <div class="btn-view">
      <n-button type="primary" :loading="smsRegisterLoading" class="login-btn" @click="handleRegisterByMobile">
        {{ $t('auth.register') }}
      </n-button>
    </div>
    <div class="other-view">
      <n-button text type="primary" size="tiny" @click="loginStore.tabActive = 'register-email'">
        {{ $t('auth.email_register') }}
      </n-button>
      <div class="register-box">
        <span class="no-account">{{ $t('auth.has_account') }}</span>
        <n-button text type="primary" size="tiny" @click="loginStore.tabActive = 'login-sms'">
          {{ $t('auth.login') }}
        </n-button>
      </div>
      <div class="read-agree">
        <n-checkbox v-model:checked="loginStore.readAndAgree" size="small" />
        <span class="text" @click="loginStore.readAndAgree = !loginStore.readAndAgree">
          {{ $t('auth.read_and_agreed') }}
        </span>
        <n-button text type="primary" size="tiny" class="privacy-policy-btn" @click="loginStore.openPrivacyPolicy">
          {{ $t('auth.privacy_policy') }}
        </n-button>
      </div>
    </div>
  </n-form>
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
// 手机号注册相关
const smsRegisterForm = ref({ mobile: '', code: '' })
const smsRegisterFormRules: FormRules = {
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
  ]
}
const smsRegisterFormRef = ref<FormInst>()
const smsRegisterSendLoading = ref(false)
const smsRegisterCountdown = useCountdown()
const tencentCaptcha = useTencentCaptcha()
const handleSendSmsRegisterCode = async () => {
  try {
    await smsRegisterFormRef.value?.validate(
      () => {},
      (rule) => rule.key === 'mobile'
    )
  } catch (e) {
    return
  }
  const params = await tencentCaptcha.captcha()
  try {
    smsRegisterSendLoading.value = true
    const { mobile } = smsRegisterForm.value
    await CaptchaApi.sendMobileCode(mobile, 'REGISTER_MOBILE', params)
    window.$message.success(window.$t('send_success'))
    smsRegisterCountdown.start()
  } catch (e) {
    if (e && e.message) {
      // window.$message.error(e.message)
    } else {
      window.$message.error(window.$t('auth.send_error'))
    }
  } finally {
    smsRegisterSendLoading.value = false
  }
}
const smsRegisterLoading = ref(false)
const handleRegisterByMobile = async () => {
  try {
    await smsRegisterFormRef.value?.validate()
  } catch (e) {
    return window.$message.error(window.$t('form_error'))
  }
  if (!loginStore.readAndAgree) {
    return window.$message.error(window.$t('auth.please_read_and_agree'))
  }
  try {
    smsRegisterLoading.value = true
    const { mobile, code } = smsRegisterForm.value
    const invitationCode = loginStore.getInvitationCode()
    const res = await AuthApi.registerByMobile({ mobile, code, invitationCode })
    await userStore.login(res)
    window.$message.success(window.$t('auth.register_success'))
    await loginStore.handleLoginSuccess()
  } finally {
    smsRegisterLoading.value = false
  }
}
</script>

<style scoped lang="scss"></style>
