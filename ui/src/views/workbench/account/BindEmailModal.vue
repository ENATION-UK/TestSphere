<template>
  <n-modal
    v-model:show="showModal"
    :title="title"
    :closable="false"
    :mask-closable="false"
    :close-on-esc="false"
    :show-icon="false"
    :loading="bindLoading"
    :negative-text="$t('cancel')"
    :positive-text="$t('confirm')"
    :positive-button-props="{ disabled: submitDisabled }"
    @positive-click="handlePositiveClick"
    transform-origin="center"
    preset="dialog"
    style="width: 480px"
  >
    <div class="modal-hr top"></div>
    <div class="bind-email-modal">
      <label class="label">{{ $t('wb.bind_email_label') }}</label>
      <n-input
        v-model:value="bindForm.email"
        autofocus
        clearable
        size="large"
        :status="errors.email ? 'error' : ''"
        :placeholder="$t('auth.email_placeholder')"
      />
      <div v-if="errors.email" class="error-message">{{ errors.email }}</div>
      <n-input-group class="code-box">
        <n-input
          v-model:value="bindForm.code"
          ref="codeInputRef"
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
    </div>
    <div class="modal-hr bottom"></div>
  </n-modal>
</template>

<script setup lang="ts">
import { computed, reactive, ref } from 'vue'
import md5 from 'js-md5'
import { cloneDeep } from 'lodash-es'
import { InputInst } from 'naive-ui'
import { IBConfig } from '@/config'
import { regExp } from '@/utils'
import { useUserStore } from '@/store'
import { useCountdown, useGoogleCaptcha, useTencentCaptcha } from '@/hooks'
import { CaptchaApi, UserApi } from '@/api/user'

const userStore = useUserStore()
const user = computed(() => userStore.user!)
const emptyForm = { email: '', code: '', password: '' }
const bindForm = ref(cloneDeep(emptyForm))
const errors = reactive({ email: '', code: '' })
const title = computed(() => (user.value.email ? window.$t('wb.change_email') : window.$t('wb.bind_email')))
const showPasswordInput = computed(() => {
  return !user.value.hasPassword && !user.value.email
})

const codeCountDown = useCountdown()
const codeSendLoading = ref(false)
const tencentCaptcha = useTencentCaptcha()
const googleCaptcha = useGoogleCaptcha()
const codeInputRef = ref<InputInst>()
const sendCode = async () => {
  if (codeSendLoading.value) return
  errors.email = ''
  const { email } = bindForm.value
  if (!email) {
    errors.email = window.$t('auth.email_placeholder')
    return
  }
  if (!regExp.email.test(email)) {
    errors.email = window.$t('auth.email_format_error')
    return
  }
  let params: Record<string, any> = {}
  if (IBConfig.APP_CHINA) {
    params = await tencentCaptcha.captcha()
  } else {
    params.token = await googleCaptcha.captcha()
  }
  codeSendLoading.value = true
  try {
    if (user.value.email) {
      await CaptchaApi.sendEmailCode(email, 'CHANGE_EMAIL', params)
    } else {
      await CaptchaApi.sendEmailCode(email, 'BIND_EMAIL', params)
    }
    codeInputRef.value?.focus()
    codeCountDown.start(60)
    window.$message.success(window.$t('send_success'))
  } finally {
    codeSendLoading.value = false
  }
}

const submitDisabled = computed(() => {
  const { email, code } = bindForm.value
  return !email || !code
})
const bindLoading = ref(false)
const handlePositiveClick = async () => {
  let { email, code, password } = bindForm.value
  if (!code) {
    errors.code = window.$t('auth.code_placeholder')
    return
  }
  bindLoading.value = true
  try {
    if (user.value.email) {
      await UserApi.updateEmail(email, code)
    } else {
      if (password) password = md5(password)
      await UserApi.bindEmail(email, code, password)
    }
    await userStore.getUserInfo()
    window.$message.success(window.$t('save_success'))
    showModal.value = false
  } finally {
    bindLoading.value = false
  }
}

const showModal = ref(false)
codeCountDown.end()
const show = () => {
  bindForm.value = cloneDeep(emptyForm)
  showModal.value = true
}

defineExpose({ show })
</script>

<style scoped lang="scss">
.bind-email-modal {
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
