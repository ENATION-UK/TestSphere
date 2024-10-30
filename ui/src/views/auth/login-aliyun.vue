<template>
  <div class="aliyun-connect-view">
    <div class="status-box">
      <div class="icon-logo">
        <IbLogo width="65" />
      </div>
      <div class="line" />
      <div class="spin-box">
        <n-spin size="small" />
      </div>
      <div class="icon-logo">
        <n-icon size="75" :component="AliyunOutlined" />
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
import { useRoute, useRouter } from 'vue-router'
import AliyunOutlined from '@vicons/antd/AliyunOutlined'
import ErrorCircle12Filled from '@vicons/fluent/ErrorCircle12Filled'
import RefreshCircleOutline from '@vicons/ionicons5/RefreshCircleOutline'
import { NIcon } from 'naive-ui'
import { IBAliYunLoginQuery } from '@/types/user'
import { useUserStore } from '@/store'
import { AuthApi } from '@/api/user'
import IbLogo from '@/components/IbLogo.vue'

const route = useRoute()
const router = useRouter()
const errMessage = ref('')

const handleLogin = async () => {
  const params = route.query as unknown as IBAliYunLoginQuery
  if (!params || !params.token) return
  const res = await AuthApi.loginByAliYun(params)
  await useUserStore().login(res)
  router.replace('/')
}
onMounted(() => handleLogin())
</script>

<style scoped lang="scss">
.aliyun-connect-view {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100vw;
  height: 100vh;
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
