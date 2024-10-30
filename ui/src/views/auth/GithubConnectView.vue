<template>
  <div class="github-connect-view">
    <div class="status-box">
      <div class="icon-logo">
        <IbLogo width="65" />
      </div>
      <div class="line" />
      <div class="spin-box">
        <n-spin size="small" />
      </div>
      <div class="icon-logo">
        <n-icon size="75" :component="LogoGithub" />
      </div>
    </div>
    <div v-if="errMessage" class="bth-box">
      <div class="error-message">
        <n-icon :component="ErrorCircle12Filled" />
        {{ errMessage }}
      </div>
      <n-button type="primary" round @click="handleLogin">
        <template #icon>
          <n-icon :component="RefreshCircleOutline" />
        </template>
        {{ $t('auth.try_again') }}
      </n-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import ErrorCircle12Filled from '@vicons/fluent/ErrorCircle12Filled'
import LogoGithub from '@vicons/ionicons5/LogoGithub'
import RefreshCircleOutline from '@vicons/ionicons5/RefreshCircleOutline'
import { NIcon } from 'naive-ui'
import { useUserStore } from '@/store'
import { AuthApi } from '@/api/user'
import IbLogo from '@/components/IbLogo.vue'
import { useLoginStore } from './useLoginStore'

const route = useRoute()
const errMessage = ref('')

const handleLogin = async () => {
  const code = route.query.code as string
  if (!code) return
  const invitationCode = useLoginStore().getInvitationCode()
  const res = await AuthApi.loginByGithub(code, invitationCode)
  useUserStore().login(res)
}
onMounted(() => handleLogin())
</script>

<style scoped lang="scss">
.github-connect-view {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  .status-box {
    display: flex;
    align-items: center;
    justify-content: space-between;
    position: relative;
    width: 500px;
    .icon-logo {
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 2;
      width: 90px;
      height: 90px;
      background-color: #ffffff;
      border-radius: 50%;
      box-shadow: 0 0 10px rgba(211, 211, 211, 0.2);
    }
    .spin-box {
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 2;
      width: 40px;
      height: 40px;
      background-color: #ffffff;
      border-radius: 50%;
      box-shadow: 0 0 5px rgba(211, 211, 211, 0.1);
    }
    .line {
      position: absolute;
      z-index: 0;
      width: 100%;
      border-bottom: 1px dashed #cccccc;
    }
  }
  .error-message {
    display: flex;
    align-items: center;
    color: var(--error-color);
    margin-bottom: 20px;
    :deep(.n-icon) {
      margin-right: 5px;
    }
  }
  .bth-box {
    margin-top: 50px;
  }
}
</style>
