<template>
  <div class="ib-wechat-qrcode">
    <n-image v-if="wechatQrcodeUrl" :src="wechatQrcodeUrl" preview-disabled class="qrcode-img" />
    <div v-else class="qrcode-img">
      <n-spin v-if="!wechatQrcodeUrlLoadError" />
    </div>
    <div v-if="wechatQrcodeUrlLoadError || wechatQrcodeExpTime <= 0" class="exp-box">
      <div v-if="wechatQrcodeUrlLoadError" class="text">{{ $t('auth.qrcode_load_error') }}</div>
      <div v-else class="text">{{ $t('auth.qrcode_exp') }}</div>
      <n-button
        size="small"
        type="primary"
        :loading="wechatQrcodeUrlLoading"
        class="refresh-btn"
        @click="handleRefreshWechatQrcode"
      >
        {{ $t('auth.refresh') }}
      </n-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'
import { decode } from 'js-base64'
import { IBResponse } from '@/types'
import { AuthApi } from '@/api/user'
import { useLoginStore } from '@/views/auth/useLoginStore'

const props = defineProps<{
  type: 'login' | 'bind'
  handleLogin?: (res: IBResponse) => Promise<boolean>
  handleBind?: (res: IBResponse) => Promise<boolean>
}>()

const wechatQrcodeUrl = ref('')
const wechatQrcodeUrlLoadError = ref(false)
const wechatQrcodeUrlLoading = ref(false)
let wechatQrcodeUrlExpTimer: any = null
let wechatQrcodeExpTime = ref(60)
let awaitScanLoading = ref(false)
let wechatScanSuccess = ref(false)

// 倒计时
const wechatQrcodeExpCountdown = () => {
  if (wechatQrcodeExpTime.value > 0) {
    wechatQrcodeExpTime.value--
    if (!awaitScanLoading.value) {
      awaitWechatQrcodeScan()
    }
    wechatQrcodeUrlExpTimer = setTimeout(wechatQrcodeExpCountdown, 1000)
  } else {
    clearTimeout(wechatQrcodeUrlExpTimer)
  }
}

// 获取微信二维码URL
const getWechatQrcodeUrl = async () => {
  wechatQrcodeUrlLoadError.value = false
  wechatQrcodeUrlLoading.value = true
  try {
    const res = await AuthApi.getWechatLoginQrcodeUrl()
    wechatQrcodeUrl.value = decode(res)
  } catch (e) {
    wechatQrcodeUrlLoadError.value = true
    return Promise.reject()
  } finally {
    wechatQrcodeUrlLoading.value = false
  }
}

// 等待扫码（轮询）
const awaitWechatQrcodeScan = async () => {
  if (wechatScanSuccess.value) return
  awaitScanLoading.value = true
  try {
    if (props.type === 'login') {
      const invitationCode = useLoginStore().getInvitationCode()
      const res = await AuthApi.awaitWechatQrcodeScanForLogin(invitationCode)
      if (!(await props.handleLogin!(res))) return
    } else if (props.type === 'bind') {
      const res = await AuthApi.awaitWechatQrcodeScanForBind()
      if (!(await props.handleBind!(res))) return
    }
    clearTimeout(wechatQrcodeUrlExpTimer)
    wechatScanSuccess.value = true
  } finally {
    awaitScanLoading.value = false
  }
}

// 刷新二维码
const handleRefreshWechatQrcode = async () => {
  await getWechatQrcodeUrl()
  wechatQrcodeExpTime.value = 60
  wechatQrcodeExpCountdown()
}

onMounted(() => {
  wechatScanSuccess.value = false
  handleRefreshWechatQrcode()
})

onUnmounted(() => {
  clearTimeout(wechatQrcodeUrlExpTimer)
})
</script>

<style scoped lang="scss">
.ib-wechat-qrcode {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  .qrcode-img {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 220px;
    height: 220px;
  }
  .exp-box {
    position: absolute;
    top: 0;
    left: 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
    background-color: rgba(255, 255, 255, 0.9);
    .text {
      color: #19191a;
      font-size: 20px;
      font-weight: bold;
    }
    .refresh-btn {
      width: 150px;
      height: 40px;
      margin-top: 24px;
      border-radius: 5px;
    }
  }
}
</style>
