<template>
  <n-form ref="bindMobileFormRef" :model="bindMobileForm" :rules="bindMobileRules" :show-label="false">
    <n-form-item path="mobile">
      <n-input v-model:value="bindMobileForm.mobile" :maxlength="11" :placeholder="$t('auth.mobile_placeholder')" />
    </n-form-item>
    <n-form-item path="code">
      <n-input v-model:value="bindMobileForm.code" :placeholder="$t('auth.sms_placeholder')">
        <template #suffix>
          <n-button
            text
            type="primary"
            size="tiny"
            :loading="bindMobileSendCodeLoading"
            :disabled="bindMobileCountdown.time.value > 0"
            @click="handleSendBindMobileCode"
          >
            {{ bindMobileCountdown.time.value <= 0 ? $t('auth.send') : bindMobileCountdown.time.value + 's' }}
          </n-button>
        </template>
      </n-input>
    </n-form-item>
    <div class="btn-view">
      <n-space vertical>
        <n-button type="primary" :loading="bindMobileLoading" class="login-btn" @click="handleBindMobile">
          {{ $t('auth.bind_mobile') }}
        </n-button>
        <n-button
          v-if="skipEnable"
          type="default"
          :loading="skipLoading"
          class="login-btn"
          @click="handleSkipBindMobile"
        >
          {{ $t('auth.skip') }}
        </n-button>
      </n-space>
    </div>
  </n-form>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRoute } from 'vue-router'
import { FormInst, FormRules } from 'naive-ui'
import { IBConfig } from '@/config'
import { regExp } from '@/utils'
import { useUserStore } from '@/store'
import { useCountdown, useTencentCaptcha } from '@/hooks'
import { AuthApi, CaptchaApi } from '@/api/user'
import { useLoginStore } from './useLoginStore'

const route = useRoute()
const userStore = useUserStore()
const loginStore = useLoginStore()

// 微信扫码登录后，绑定手机相关
const bindMobileForm = ref({ mobile: '', code: '' })
const bindMobileFormRef = ref<FormInst>()
const bindMobileRules: FormRules = {
  mobile: [
    { key: 'mobile', required: true, message: window.$t('auth.mobile_placeholder'), trigger: 'blur' },
    {
      key: 'mobile',
      validator: (rule, value) => {
        if (!value) return true
        if (!regExp.mobile.test(value)) return new Error(window.$t('auth.mobile_format_error'))
        return true
      },
      trigger: 'blur'
    }
  ]
}
const bindMobileLoading = ref(false)
const bindMobileSendCodeLoading = ref(false)
const bindMobileCountdown = useCountdown()
const tencentCaptcha = useTencentCaptcha()
const handleSendBindMobileCode = async () => {
  try {
    await bindMobileFormRef.value?.validate(
      () => {},
      (rule) => rule.key === 'mobile'
    )
  } catch (e) {
    return false
  }
  const params = await tencentCaptcha.captcha()
  try {
    bindMobileLoading.value = true
    const { mobile } = bindMobileForm.value
    await CaptchaApi.sendMobileCode(mobile, 'BIND_MOBILE', params)
    window.$message.success(window.$t('send_success'))
    bindMobileCountdown.start()
  } finally {
    bindMobileLoading.value = false
  }
}
const handleBindMobile = async () => {
  try {
    await bindMobileFormRef.value?.validate()
  } catch (e) {
    return window.$message.error(window.$t('form_error'))
  }
  try {
    bindMobileLoading.value = true
    const { mobile, code } = bindMobileForm.value
    const res = await AuthApi.wechatLoginBindMobile(mobile, code)
    await userStore.login(res)
    await loginStore.handleLoginSuccess()
  } finally {
    bindMobileLoading.value = false
  }
}

// 微信扫码登录后，跳过绑定手机直接登录
// 如果通过落地页去自动化测试的，那么不能跳过
const skipEnable = computed(() => {
  if (!IBConfig.APP_CHINA) return true
  const redirect = route.query.redirect || ''
  return redirect.indexOf('/tester') === -1
})
const skipLoading = ref(false)
const handleSkipBindMobile = async () => {
  try {
    skipLoading.value = true
    const res = await AuthApi.wechatSkipBindMobile()
    await userStore.login(res)
    await loginStore.handleLoginSuccess()
  } finally {
    skipLoading.value = false
  }
}
</script>

<style scoped lang="scss"></style>
