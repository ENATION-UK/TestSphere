<template>
  <n-config-provider :locale="locale" :date-locale="dateLocale" :theme="theme" :theme-overrides="themeOverrides">
    <n-dialog-provider>
      <n-notification-provider>
        <n-message-provider>
          <IbAppContents />
          <IbAppDropdown />
          <IbGuidePopup />
          <ModalProvider />
          <slot></slot>
        </n-message-provider>
      </n-notification-provider>
    </n-dialog-provider>
  </n-config-provider>
</template>

<script setup lang="ts">
import { computed, nextTick, onMounted, ref, watchEffect } from 'vue'
import { useRoute } from 'vue-router'
import {
  darkTheme,
  dateEnUS,
  dateZhCN,
  enUS,
  NDialogProvider,
  NMessageProvider,
  NNotificationProvider,
  zhCN
} from 'naive-ui'
import { useAppStore, useUserStore } from '@/store'
import { useCompanyStore, useInviteStore } from '@/store/workbench'
import { useIbModal } from '@/hooks'
import themeOverrides from '@/styles/naive-ui-theme-overrides.json'
import IbAppContents from './IbAppContents.vue'
import IbAppDropdown from './IbAppDropdown.vue'
import IbGuidePopup from './IbGuidePopup.vue'

const route = useRoute()
const userStore = useUserStore()
const appStore = useAppStore()
const companyStore = useCompanyStore()
const inviteStore = useInviteStore()
const theme = ref()

const { ModalProvider } = useIbModal()
const locale = computed(() => (appStore.lang === 'zh-CN' ? zhCN : enUS))
const dateLocale = computed(() => (appStore.lang === 'zh-CN' ? dateZhCN : dateEnUS))

watchEffect(() => {
  const path = route.path
  const themeMode = appStore.themeMode
  const toggle = path.indexOf('/db-designer/projects/') === -1 ? false : themeMode === 'dark'
  theme.value = toggle ? darkTheme : undefined
  nextTick(() => {
    document.body.classList.toggle('dark', toggle)
  })
})

onMounted(() => {
  if (!appStore.uuid) {
    appStore.initUuid()
  }
  inviteStore.init()
  if (!userStore.isLogin) return
  userStore.getUserInfo()
  companyStore.getCompanies()
  companyStore.getSubscriptions()
})
</script>
