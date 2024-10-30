<template>
  <n-modal
    v-model:show="showModal"
    :title="user?.hasPassword ? $t('wb.change_password') : $t('wb.set_password')"
    :close-on-esc="false"
    :mask-closable="false"
    :show-icon="false"
    :auto-focus="false"
    :loading="submitLoading"
    :negative-text="$t('cancel')"
    :positive-text="$t('save')"
    :positive-button-props="{ disabled: !code || !password }"
    @positive-click="submit"
    transform-origin="center"
    preset="dialog"
    style="width: 480px"
  >
    <div class="modal-hr top"></div>
    <div class="code-validation-modal">
      <div class="label">
        <i18n-t keypath="wb.change_password_label">
          <span class="account">{{ sensitiveAccount }}</span>
        </i18n-t>
      </div>
      <div class="code-input">
        <n-input
          ref="codeInputRef"
          v-model:value="code"
          :maxlength="6"
          :placeholder="$t('wb.valid_code_placeholder')"
        />
        <n-button :loading="codeSendLoading" :disabled="codeCountDown.time.value > 0" @click="sendCode">
          {{ codeCountDown.time.value <= 0 ? $t('wb.send_valid_code') : codeCountDown.time.value + 's' }}
        </n-button>
      </div>
      <n-input
        v-model:value="password"
        :maxlength="20"
        :placeholder="$t('auth.password_placeholder')"
        type="password"
        show-password-on="click"
        class="password-input"
      />
    </div>
    <div class="modal-hr bottom"></div>
  </n-modal>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import md5 from 'js-md5'
import { InputInst } from 'naive-ui'
import { IBConfig } from '@/config'
import { DataAnonymization } from '@/utils'
import { useUserStore } from '@/store'
import { useCountdown, useGoogleCaptcha, useTencentCaptcha } from '@/hooks'
import { CaptchaApi, SecurityApi } from '@/api/user'

const showModal = ref(false)
const show = () => {
  showModal.value = true
}
const userStore = useUserStore()
const user = computed(() => userStore.user)
const account = computed(() => {
  return IBConfig.APP_CHINA ? user.value?.mobile : user.value?.email
})
const sensitiveAccount = computed(() => {
  const acc = account.value
  if (!acc) return ''
  return IBConfig.APP_CHINA ? DataAnonymization.mobile(acc) : DataAnonymization.email(acc)
})

const codeInputRef = ref<InputInst>()
const code = ref('')
const password = ref('')
const codeCountDown = useCountdown()
const codeSendLoading = ref(false)
const tencentCaptcha = useTencentCaptcha()
const googleCaptcha = useGoogleCaptcha()
const sendCode = async () => {
  if (codeSendLoading.value) return
  let params: Record<string, any> = {}
  if (IBConfig.APP_CHINA) {
    params = await tencentCaptcha.captcha()
  } else {
    params.token = await googleCaptcha.captcha()
  }
  codeSendLoading.value = true
  try {
    IBConfig.APP_CHINA
      ? await CaptchaApi.sendMobileCode(user.value!.mobile, 'REST_PASSWORD', params)
      : await CaptchaApi.sendEmailCode(user.value!.email, 'REST_PASSWORD', params)
    codeCountDown.start(60)
    window.$message.success(window.$t('send_success'))
    codeInputRef.value?.focus()
  } finally {
    codeSendLoading.value = false
  }
}
const submitLoading = ref(false)
const submit = async () => {
  try {
    submitLoading.value = true
    const params = { account: account.value!, password: md5(password.value!), code: code.value! }
    await SecurityApi.setPassword(params)
    await userStore.getUserInfo()
    window.$message.success(window.$t('wb.change_password_success'))
    showModal.value = false
  } finally {
    submitLoading.value = false
  }
}

defineExpose({ show })
</script>

<style scoped lang="scss">
.code-validation-modal {
  .label {
    font-size: 16px;
    line-height: 20px;
    margin-bottom: 16px;
    .account {
      color: #2d72d2;
    }
  }
  .code-input {
    display: flex;
    align-items: center;
    :deep(.n-button) {
      margin-left: 20px;
    }
  }
  .password-input {
    margin-top: 16px;
  }
}
</style>
