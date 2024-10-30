<template>
  <n-modal
    v-model:show="showModal"
    :title="title"
    :closable="false"
    :mask-closable="false"
    :close-on-esc="false"
    :show-icon="false"
    :loading="checkLoading || bindLoading"
    :positive-button-props="{ disabled: submitDisabled }"
    :negative-text="$t('cancel')"
    :positive-text="$t('confirm')"
    @positive-click="handlePositiveClick"
    transform-origin="center"
    preset="dialog"
  >
    <div class="bind-mobile-modal">
      <div class="hr top"></div>
      <label class="label">{{ step === 1 ? $t('wb.change_mobile_label') : $t('wb.bind_mobile_label') }}</label>
      <n-input
        v-if="step === 1"
        :value="$t('wb.mobile_valid_tip', { mobile: concealMobile(user.mobile) })"
        disabled
        size="large"
        class="change-input"
      />
      <n-input
        v-else
        v-model:value="bindForm.mobile"
        autofocus
        clearable
        size="large"
        :status="errors.mobile ? 'error' : ''"
        :maxlength="11"
        :placeholder="$t('auth.mobile_placeholder')"
      />
      <div v-if="errors.mobile" class="error-message">{{ errors.mobile }}</div>
      <n-input-group class="code-box">
        <n-input
          v-model:value="bindForm.code"
          clearable
          size="large"
          :status="errors.code ? 'error' : ''"
          :maxlength="6"
          :placeholder="$t('auth.code_placeholder')"
        />
        <n-button
          :loading="codeSendLoading"
          :disabled="codeCountDown.time.value > 0"
          size="large"
          class="code-btn"
          @click="sendCode"
        >
          {{ codeCountDown.time.value <= 0 ? $t('wb.send_valid_code') : codeCountDown.time.value + 's' }}
        </n-button>
      </n-input-group>
      <div v-if="errors.code" class="error-message">{{ errors.code }}</div>
      <label v-if="showPasswordInput" class="label password">{{ $t('auth.password_placeholder') }}</label>
      <n-input
        v-if="showPasswordInput"
        v-model:value="bindForm.password"
        clearable
        size="large"
        type="password"
        show-password-on="click"
        :placeholder="$t('auth.password_placeholder')"
      />
      <div class="hr bottom"></div>
    </div>
  </n-modal>
</template>

<script setup lang="ts">
import { computed, reactive, ref } from 'vue'
import md5 from 'js-md5'
import { cloneDeep } from 'lodash-es'
import { regExp } from '@/utils'
import { mobile as concealMobile } from '@/utils/data-anonymization'
import { useUserStore } from '@/store'
import { useCountdown, useTencentCaptcha } from '@/hooks'
import { CaptchaApi, UserApi } from '@/api/user'

const userStore = useUserStore()
const user = computed(() => userStore.user!)
const emptyForm = { mobile: '', code: '', password: '' }
const bindForm = ref(cloneDeep(emptyForm))
const errors = reactive({ mobile: '', code: '' })
const step = ref(2)
const title = computed(() => {
  if (user.value.mobile) {
    if (step.value === 1) return window.$t('wb.identity_verification')
    if (step.value === 2) return window.$t('wb.change_mobile')
  }
  return window.$t('wb.bind_mobile')
})
const showPasswordInput = computed(() => {
  return !user.value.hasPassword && !user.value.mobile
})
const submitDisabled = computed(() => {
  const { mobile, code } = bindForm.value
  return !mobile || !code
})

// 倒计时相关
const codeCountDown = useCountdown()
const codeSendLoading = ref(false)
const tencentCaptcha = useTencentCaptcha()
const sendCode = async () => {
  if (codeSendLoading.value) return
  errors.mobile = ''
  const { mobile } = bindForm.value
  if (!mobile) {
    errors.mobile = window.$t('auth.mobile_placeholder')
    return
  }
  if (!regExp.mobile.test(mobile)) {
    errors.mobile = window.$t('auth.mobile_format_error')
    return
  }
  let params = await tencentCaptcha.captcha()
  codeSendLoading.value = true
  try {
    if (user.value.mobile) {
      await CaptchaApi.sendMobileCode(mobile, 'CHANGE_MOBILE', params)
    } else {
      await CaptchaApi.sendMobileCode(mobile, 'BIND_MOBILE', params)
    }
    codeCountDown.start(60)
    window.$message.success(window.$t('send_success'))
  } finally {
    codeSendLoading.value = false
  }
}

const checkLoading = ref(false)
const handleValidMobile = async () => {
  // 校验后再进行手机号更换
  checkLoading.value = true
  const { mobile, code } = bindForm.value
  try {
    // 校验
    await CaptchaApi.checkCode(mobile, 'CHANGE_MOBILE', code)
    bindForm.value.mobile = ''
    bindForm.value.code = ''
    codeCountDown.end()
    step.value = 2
  } finally {
    checkLoading.value = false
  }
}

const bindLoading = ref(false)
const handlePositiveClick = async () => {
  if (step.value === 1) {
    await handleValidMobile()
    return false
  }
  let { mobile, code, password } = bindForm.value
  if (!code) {
    errors.code = window.$t('auth.code_placeholder')
    return false
  }
  bindLoading.value = true
  try {
    if (user.value.mobile) {
      await UserApi.updateMobile(mobile, code)
    } else {
      if (password) password = md5(password)
      await UserApi.bindMobile(mobile, code, password)
    }
    await userStore.getUserInfo()
    window.$message.success(window.$t('save_success'))
  } finally {
    bindLoading.value = false
  }
}

const showModal = ref(false)
const show = () => {
  bindForm.value = cloneDeep(emptyForm)
  if (user.value.mobile) {
    step.value = 1
    bindForm.value.mobile = user.value.mobile
  }
  showModal.value = true
}

defineExpose({ show })
</script>

<style scoped lang="scss">
.bind-mobile-modal {
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
  .label {
    display: block;
    margin-bottom: 12px;
    &.password {
      margin-top: 24px;
    }
  }
  .error-message {
    color: var(--error-color);
    margin-top: 12px;
    line-height: normal;
  }
  .change-input {
    background-color: var(--input-color);
  }
  .code-box {
    margin-top: 12px;
    .code-btn {
      margin-left: 20px !important;
    }
  }
}
</style>
