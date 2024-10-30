import { defineStore } from 'pinia'
import { IBShareData } from '@/types/workbench'
import { useUserStore } from '@/store'
import { useIbModal, useJoinTeamSuccess } from '@/hooks'
import { InviteApi } from '@/api/workbench'

interface InviteState {
  shareBase64?: string
  shareData?: IBShareData
}

export const useInviteStore = defineStore('workbench/invite', {
  state: (): InviteState => ({
    shareBase64: undefined,
    shareData: undefined
  }),
  actions: {
    async init() {
      const linkSplit = window.location.hash.split('#share=')
      if (!linkSplit || linkSplit.length !== 2) return
      const shareBase64 = linkSplit[1]
      this.shareBase64 = shareBase64
      this.shareData = await InviteApi.getShareData(shareBase64)
      window.location.hash = ''
      if (useUserStore().isLogin) {
        useIbModal().receiveInvitationModalRef.value?.show()
      }
    },
    async bindUser() {
      if (!this.shareBase64) return
      await InviteApi.bindUser(this.shareBase64)
      useJoinTeamSuccess(this.shareData!.companyId)
    }
  }
})
