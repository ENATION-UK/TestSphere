<template>
  <slot></slot>
  <n-modal
    v-model:show="showAuthModal"
    :show-icon="false"
    :mask-closable="false"
    :close-on-esc="false"
    :auto-focus="false"
    transform-origin="center"
    preset="dialog"
    style="width: 425px"
  >
    <div class="login-modal">
      <div class="title-login">登录账号</div>
      <div class="form-login">
        <n-form ref="loginFormRef" :model="loginForm" :rules="loginFormRules">
          <n-form-item path="username">
            <n-input v-model:value="loginForm.username" placeholder="输入账号" />
          </n-form-item>
          <n-form-item path="password">
            <n-input v-model:value="loginForm.password" placeholder="输入密码" type="password" show-password-toggle />
          </n-form-item>
          <n-form-item>
            <n-button type="info" class="login-btn" :loading="loginLoading" @click="handleLogin">登录</n-button>
          </n-form-item>
        </n-form>
      </div>
    </div>
  </n-modal>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { FormInst, FormRules } from 'naive-ui'
import { useUserStore } from '@/store'

const userStore = useUserStore()
const showAuthModal = ref(false)
const loginForm = ref({
  username: 'user1',
  password: '1234qwer'
})
const loginFormRef = ref<FormInst>()
const loginFormRules: FormRules = {
  username: { required: true, message: '请填写账号', trigger: 'input' },
  password: { required: true, message: '请填写密码', trigger: 'input' }
}
const loginLoading = ref(false)
const handleLogin = async () => {
  try {
    await loginFormRef.value?.validate()
  } catch (e) {
    window.$message.error(window.$t('form_error'))
    return false
  }
  const { username, password } = loginForm.value
  loginLoading.value = true
  try {
    await userStore.login(username, password)
    showAuthModal.value = false
  } finally {
    loginLoading.value = false
  }
}

watch(
  () => userStore.isLogin,
  (newVal) => {
    if (newVal || showAuthModal.value) return
    showAuthModal.value = true
  },
  { immediate: true }
)
</script>

<style scoped lang="scss">
.login-modal {
  background-color: #ffffff;
  .title-login {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 32px;
    font-size: 20px;
    font-weight: bold;
  }
  .form-login {
    .login-btn {
      width: 100%;
    }
  }
}
</style>
