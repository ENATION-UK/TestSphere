<template>
  <n-button v-if="!IBConfig.APP_CHINA && showFeedback" type="primary" size="tiny" text @click="handleFeedback">
    <template #icon>
      <n-icon size="18"><ChatHelp20Regular /></n-icon>
    </template>
    {{ $t('feedback') }}
  </n-button>
  <n-dropdown
    v-if="IBConfig.APP_CHINA"
    trigger="hover"
    show-arrow
    :options="helpMenusOptions"
    @select="handleSelectHelpOption"
  >
    <n-button type="primary" size="tiny" text>
      <n-icon size="18"><ChatHelp20Regular /></n-icon>
      {{ $t('feedback_exchange') }}
    </n-button>
  </n-dropdown>
  <n-modal
    v-if="IBConfig.WECHAT_GROUP_QRCODE_URL"
    v-model:show="showWechatGroupModal"
    closable
    transform-origin="center"
  >
    <div class="wechat-group-qrcode-box">
      <img :src="IBConfig.WECHAT_GROUP_QRCODE_URL" alt="" class="wechat-group-qrcode" />
    </div>
  </n-modal>
</template>

<script setup lang="ts">
import { computed, h, ref } from 'vue'
import ChatHelp20Regular from '@vicons/fluent/ChatHelp20Regular'
import ChatbubblesOutline from '@vicons/ionicons5/ChatbubblesOutline'
import WechatFilled from '@vicons/material/WechatFilled'
import { NIcon } from 'naive-ui'
import { IBConfig } from '@/config'

const showWechatGroupModal = ref(false)
const showFeedback = computed(() => !!IBConfig.FEEDBACK_URL)
const helpMenusOptions = computed(() => {
  const options: any = []
  if (IBConfig.BBS_URL) {
    options.push({
      label: window.$t('online_exchange'),
      icon: () => h(NIcon, { color: 'rgb(134, 77, 248)' }, { default: () => h(ChatbubblesOutline) }),
      key: 'bbs'
    })
  }
  if (IBConfig.WECHAT_GROUP_QRCODE_URL) {
    options.push({
      label: window.$t('wechat_group'),
      icon: () => h(NIcon, { color: '#1aad19' }, { default: () => h(WechatFilled) }),
      key: 'wechat_group'
    })
  }
  return options
})
const handleSelectHelpOption = (key: string) => {
  switch (key) {
    case 'bbs':
      window.open(IBConfig.BBS_URL, '_blank')
      break
    case 'wechat_group':
      showWechatGroupModal.value = true
      break
  }
}
const handleFeedback = () => {
  window.open(IBConfig.FEEDBACK_URL, '_blank')
}
</script>

<style scoped lang="scss">
.wechat-group-qrcode-box {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 250px;
  height: 250px;
  border-radius: 8px;
  background-color: #ffffff;
  .wechat-group-qrcode {
    width: 200px;
    height: 200px;
    border: none;
    outline: none;
    border-radius: 4px;
  }
}
</style>
