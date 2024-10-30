<template>
  <n-modal
    v-model:show="showModal"
    :show-icon="false"
    :mask-closable="false"
    :close-on-esc="false"
    :auto-focus="false"
    @close="deleteHash"
    transform-origin="center"
    preset="dialog"
    style="width: 450px"
  >
    <div class="bind-device-modal">
      <div class="bind-title">{{ $t('wb.device.bind_title') }}</div>
      <div class="bind-tips">
        {{ $t('wb.device.bind_tips') }}
        <n-button text type="info" class="help-btn" @click="toHelp">
          {{ $t('help') }}
          <n-icon size="14" :component="HelpCircleSharp"></n-icon>
        </n-button>
      </div>
      <n-input
        v-model:value="bindCode"
        clearable
        :placeholder="$t('wb.device.bind_input_placeholder')"
        class="bind-input"
      />
      <n-button type="success" :loading="bindLoading" :disabled="!bindCode" @click="confirmBind" class="bind-btn">
        {{ $t('wb.device.bind_btn') }}
      </n-button>
    </div>
  </n-modal>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import HelpCircleSharp from '@vicons/ionicons5/HelpCircleSharp'
import { IBConfig } from '@/config'
import { useDeviceStore } from '@/store/workbench'
import { DevicesApi } from '@/api/workbench'

const deviceStore = useDeviceStore()
const showModal = ref(false)
const bindCode = ref('')
const bindLoading = ref(false)
const confirmBind = async () => {
  try {
    bindLoading.value = true
    await DevicesApi.binding(bindCode.value)
    await window.$sleep(1000)
    deviceStore.getDevices().then()
    showModal.value = false
    deleteHash()
  } finally {
    bindLoading.value = false
  }
}

const toHelp = () => {
  let url = IBConfig.APP_WEBSITE
  url += `/docs/db-design/code/connected-device`
  window.open(url, '_blank')
}

const deleteHash = () => {
  window.location.hash = ''
}

const show = () => {
  bindCode.value = ''
  showModal.value = true
}
defineExpose({ show })
</script>

<style scoped lang="scss">
.bind-device-modal {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  .bind-title {
    font-size: 16px;
    font-weight: bold;
    margin-bottom: 20px;
  }
  .bind-tips {
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 14px;
    margin-bottom: 24px;
    .help-btn {
      margin-left: 10px;
      text-decoration: underline;
    }
  }
  .bind-input {
    text-align: center;
    margin-bottom: 24px;
  }
  .bind-btn {
    width: 200px;
  }
}
</style>
