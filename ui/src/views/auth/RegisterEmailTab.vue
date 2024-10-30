<template>
  <n-form
    v-if="loginStore.registerStep === 1"
    ref="emailRegisterFormRef"
    :model="emailRegisterForm"
    :rules="emailRegisterFormRules"
    :show-label="false"
  >
    <n-form-item path="email">
      <n-input v-model:value="emailRegisterForm.email" :placeholder="$t('auth.email_placeholder')" />
    </n-form-item>
    <n-form-item path="password">
      <n-input
        v-model:value="emailRegisterForm.password"
        :placeholder="$t('auth.password_placeholder')"
        type="password"
        show-password-on="click"
      />
    </n-form-item>
    <div class="btn-view">
      <n-button type="primary" class="login-btn" @click="handleEmailRegisterNextStep">
        {{ $t('auth.register') }}
      </n-button>
    </div>
    <div class="other-view">
      <n-button
        v-if="IBConfig.APP_CHINA"
        text
        type="primary"
        size="tiny"
        @click="loginStore.tabActive = 'register-sms'"
      >
        {{ $t('auth.sms_register') }}
      </n-button>
      <div class="register-box">
        <span class="no-account">{{ $t('auth.has_account') }}</span>
        <n-button
          text
          type="primary"
          size="tiny"
          @click="loginStore.tabActive = IBConfig.APP_CHINA ? 'login-sms' : 'login-password'"
        >
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
  <n-form
    v-if="loginStore.registerStep === 2"
    ref="emailRegisterCodeFormRef"
    :model="emailRegisterCodeForm"
    :rules="emailRegisterCodeFormRules"
    :show-label="false"
  >
    <n-form-item path="code">
      <n-input v-model:value="emailRegisterCodeForm.code" :maxlength="6" :placeholder="$t('auth.code_placeholder')">
        <template #suffix>
          <n-button
            text
            type="primary"
            size="tiny"
            :loading="emailRegisterSendCodeLoading"
            :disabled="emailCountdown.time.value > 0"
            @click="handleSendEmailCode"
          >
            {{ emailCountdown.time.value <= 0 ? $t('auth.send') : emailCountdown.time.value + 's' }}
          </n-button>
        </template>
      </n-input>
    </n-form-item>
  </n-form>
  <div v-if="loginStore.registerStep === 2" class="btn-view">
    <n-button type="primary" :loading="emailRegisterConfirmLoading" class="login-btn" @click="handleRegisterByEmail">
      {{ $t('auth.confirm') }}
    </n-button>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import md5 from 'js-md5'
import { FormInst, FormRules } from 'naive-ui'
import { IBConfig } from '@/config'
import { regExp } from '@/utils'
import { useUserStore } from '@/store'
import { useCountdown } from '@/hooks'
import { AuthApi, CaptchaApi } from '@/api/user'
import { useLoginStore } from './useLoginStore'

const userStore = useUserStore()
const loginStore = useLoginStore()
// 邮箱注册相关
const emailRegisterForm = ref({ email: '', password: '' })
const emailRegisterFormRef = ref<FormInst>()
const emailRegisterFormRules: FormRules = {
  email: [
    {
      key: 'email',
      validator: async (rule, value) => {
        if (!value) return Promise.reject(Error(window.$t('auth.email_placeholder')))
        if (!regExp.email.test(value)) return Promise.reject(Error(window.$t('auth.email_format_error')))
        try {
          await AuthApi.checkEmailExist(value)
          return Promise.resolve()
        } catch (e) {
          return Promise.reject(Error(e.message))
        }
      },
      trigger: 'input'
    }
  ],
  password: { required: true, message: window.$t('auth.password_placeholder'), trigger: 'blur' }
}
const handleEmailRegisterNextStep = async () => {
  try {
    await emailRegisterFormRef.value?.validate()
  } catch (e) {
    return window.$message.error(window.$t('form_error'))
  }
  if (!loginStore.readAndAgree) {
    return window.$message.error(window.$t('auth.please_read_and_agree'))
  }
  loginStore.registerStep = 2
  setTimeout(handleSendEmailCode, 500)
}
const emailRegisterSendCodeLoading = ref(false)
const emailCountdown = useCountdown()
const handleSendEmailCode = async () => {
  try {
    await emailRegisterFormRef.value?.validate(
      () => {},
      (rule) => rule.key === 'email'
    )
  } catch (e) {
    return
  }
  const email = emailRegisterForm.value.email
  try {
    emailRegisterSendCodeLoading.value = true
    await CaptchaApi.sendEmailCode(email, 'REGISTER_EMAIL')
    window.$message.success(window.$t('send_success'))
    emailCountdown.start(180)
  } finally {
    emailRegisterSendCodeLoading.value = false
  }
}
const emailRegisterCodeForm = ref({ code: '' })
const emailRegisterCodeFormRef = ref<FormInst>()
const emailRegisterCodeFormRules: FormRules = {
  code: { required: true, message: window.$t('auth.code_placeholder'), trigger: 'blur' }
}
const emailRegisterConfirmLoading = ref(false)
const handleRegisterByEmail = async () => {
  try {
    await emailRegisterFormRef.value?.validate()
    await emailRegisterCodeFormRef.value?.validate()
  } catch (e) {
    return
  }
  try {
    emailRegisterConfirmLoading.value = true
    const { email, password } = emailRegisterForm.value
    const { code } = emailRegisterCodeForm.value
    const invitationCode = loginStore.getInvitationCode()
    const res = await AuthApi.registerByEmail({ email, code, password: md5(password), invitationCode })
    await userStore.login(res)
    window.$message.success(window.$t('auth.register_success'))
    await loginStore.handleLoginSuccess()
  } finally {
    emailRegisterConfirmLoading.value = false
  }
}
</script>

<style scoped lang="scss"></style>
