<template>
  <n-form ref="forgotPasswordFormRef" :model="forgotPasswordForm" :rules="forgotPasswordFormRules" :show-label="false">
    <n-form-item path="phoneEmail">
      <n-input
        v-model:value="forgotPasswordForm.phoneEmail"
        :placeholder="IBConfig.APP_CHINA ? $t('auth.username_placeholder') : $t('auth.email_placeholder')"
        clearable
      />
    </n-form-item>
    <n-form-item path="code">
      <n-input v-model:value="forgotPasswordForm.code" :maxlength="6" :placeholder="$t('auth.sms_placeholder')">
        <template #suffix>
          <n-button
            text
            type="primary"
            size="tiny"
            :loading="forgotPasswordSendCodeLoading"
            :disabled="forgotCountdown.time.value > 0"
            @click="handleSendForgotPasswordCode"
          >
            {{ forgotCountdown.time.value <= 0 ? $t('auth.send') : forgotCountdown.time.value + 's' }}
          </n-button>
        </template>
      </n-input>
    </n-form-item>
    <n-form-item path="newPassword">
      <n-input
        v-model:value="forgotPasswordForm.newPassword"
        type="password"
        show-password-on="click"
        :maxlength="20"
        :placeholder="$t('auth.password_placeholder')"
      />
    </n-form-item>
    <div class="btn-view">
      <n-button type="primary" :loading="resetPasswordLoading" class="login-btn" @click="handleResetPassword">
        {{ $t('auth.reset_password') }}
      </n-button>
    </div>
  </n-form>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import md5 from 'js-md5'
import { FormInst, FormRules } from 'naive-ui'
import { IBConfig } from '@/config'
import { regExp } from '@/utils'
import { useCountdown } from '@/hooks'
import { CaptchaApi, SecurityApi } from '@/api/user'
import { useLoginStore } from './useLoginStore'

const loginStore = useLoginStore()
// 忘记密码相关
const forgotPasswordForm = ref({ phoneEmail: '', code: '', newPassword: '' })
const forgotPasswordFormRef = ref<FormInst>()
const forgotPasswordFormRules: FormRules = {
  phoneEmail: [
    {
      key: 'phoneEmail',
      validator: (rule, value) => {
        if (!value) {
          return new Error(
            IBConfig.APP_CHINA ? window.$t('auth.username_placeholder') : window.$t('auth.email_placeholder')
          )
        }
        if (value.indexOf('@') !== -1) {
          if (!regExp.email.test(value)) {
            return new Error(window.$t('auth.email_format_error'))
          }
          return true
        } else if (/^\d+$/.test(value) && IBConfig.APP_CHINA) {
          if (!regExp.mobile.test(value)) {
            return new Error(window.$t('auth.mobile_format_error'))
          }
          return true
        } else {
          return new Error(
            IBConfig.APP_CHINA ? window.$t('auth.mobile_email_format_error') : window.$t('auth.email_format_error')
          )
        }
      },
      trigger: 'blur'
    }
  ],
  code: { required: true, message: window.$t('auth.code_placeholder'), trigger: 'input' },
  // TODO: 缺少安全强度校验
  newPassword: { required: true, message: window.$t('auth.password_placeholder'), trigger: 'input' }
}
const forgotCountdown = useCountdown()
const forgotPasswordSendCodeLoading = ref(false)
const handleSendForgotPasswordCode = async () => {
  try {
    await forgotPasswordFormRef.value?.validate(
      () => {},
      (rule) => rule.key === 'phoneEmail'
    )
  } catch (e) {
    return
  }
  forgotPasswordSendCodeLoading.value = true
  const val = forgotPasswordForm.value.phoneEmail
  try {
    if (val.indexOf('@') !== -1) {
      await CaptchaApi.sendEmailCode(val, 'FIND_PASSWORD')
      forgotCountdown.start(180)
    } else {
      await CaptchaApi.sendMobileCode(val, 'FIND_PASSWORD')
      forgotCountdown.start()
    }
    window.$message.success(window.$t('send_success'))
  } finally {
    forgotPasswordSendCodeLoading.value = false
  }
}
const resetPasswordLoading = ref(false)
const handleResetPassword = async () => {
  try {
    await forgotPasswordFormRef.value?.validate()
  } catch (e) {
    return window.$message.error(window.$t('form_error'))
  }
  try {
    resetPasswordLoading.value = true
    const { phoneEmail: account, code, newPassword } = forgotPasswordForm.value
    await SecurityApi.forgotPassword({ account, code, password: md5(newPassword) })
    window.$message.success(window.$t('auth.reset_success'))
    forgotPasswordForm.value = { phoneEmail: '', code: '', newPassword: '' }
    loginStore.tabActive = 'login-password'
  } finally {
    resetPasswordLoading.value = false
  }
}
</script>

<style scoped lang="scss"></style>
