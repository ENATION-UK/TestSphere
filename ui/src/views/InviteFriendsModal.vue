<template>
  <div class="invite-friends">
    <div class="title">{{ $t('wb.invited_friends_title') }}</div>
    <div class="subtitle">{{ $t('wb.invited_friends_subtitle') }}</div>
    <ul class="ul">
      <li class="li">{{ $t('wb.invited_friends_runs') }}</li>
      <li class="li">{{ $t('wb.invited_friends_ai_point') }}</li>
    </ul>
    <div class="tip">{{ $t('wb.invited_friends_tip') }}</div>
    <div class="copy-tip">{{ $t('wb.invited_friends_copy_tip') }}</div>
    <div class="copy-box">
      <n-input ref="inputRef" size="medium" :value="inviteUrl" class="link-input" />
      <n-button type="primary" color="#7f56da" class="copy-btn" @click="handleCopy">
        <template #icon>
          <n-icon><Copy24Regular /></n-icon>
        </template>
        {{ $t('context_menus.copy') }}
      </n-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import Copy24Regular from '@vicons/fluent/Copy24Regular'
import { useClipboard } from '@vueuse/core'
import { DialogReactive, InputInst } from 'naive-ui'
import { IBConfig } from '@/config'
import { useCompanyStore } from '@/store/workbench'

defineProps<{
  dialog?: DialogReactive
}>()

const showModal = ref(false)
const show = () => {
  showModal.value = true
}
const inputRef = ref<InputInst>()
const inviteUrl = computed(() => {
  let url = IBConfig.APP_DOMAIN
  url += `?invitationCode=${useCompanyStore().company?.invitationCode}`
  return url
})

const handleCopy = async () => {
  inputRef.value?.focus()
  inputRef.value?.select()
  const { copy } = useClipboard({ legacy: true })
  await copy(inviteUrl.value)
  window.$message.success(window.$t('context_menus.copy_success'))
}

defineExpose({
  show
})
</script>

<style scoped lang="scss">
.invite-friends {
  .title {
    font-size: 16px;
    font-weight: bold;
  }
  .subtitle {
    font-size: 14px;
    margin-top: 10px;
  }
  .ul {
    margin-top: 10px;
    .li {
      list-style: disc;
    }
  }
  .tip {
    margin-top: 10px;
  }
  .copy-tip {
    margin-top: 12px;
    font-size: 16px;
    font-weight: bold;
  }
  .copy-box {
    display: flex;
    align-items: center;
    margin-top: 6px;
    .link-input {
      border-radius: 10px;
    }
    .copy-btn {
      margin-left: 10px;
      border-radius: 10px;
    }
  }
}
</style>
