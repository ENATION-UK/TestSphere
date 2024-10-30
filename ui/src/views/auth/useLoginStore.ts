import { defineStore } from 'pinia'
import { IBConfig } from '@/config'
import { useInviteStore } from '@/store/workbench'

export const useLoginStore = defineStore('app/login', {
  state: () => ({
    tabActive: '',
    readAndAgree: false,
    registerStep: 1
  }),
  actions: {
    async handleLoginSuccess() {
      await useInviteStore().bindUser()
    },
    // 打开隐私政策页面
    openPrivacyPolicy() {
      window.open(`${IBConfig.APP_WEBSITE}/private-policy/`, '_blank')
    },
    // 获取邀请码
    getInvitationCode() {
      return new URLSearchParams(location.search).get('invitationCode') || undefined
    }
  }
})
