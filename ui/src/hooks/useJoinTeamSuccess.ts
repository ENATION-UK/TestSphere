import { useCompanyStore } from '@/store/workbench'

/**
 * 加入团队成功弹窗
 * @param companyId
 */
export function useJoinTeamSuccess(companyId: string) {
  const dialog = window.$dialog.success({
    title: window.$t('success'),
    autoFocus: false,
    content: window.$t('wb.manage.join_success'),
    positiveText: window.$t('confirm'),
    onPositiveClick: async () => {
      dialog.loading = true
      await useCompanyStore().changeCompany(companyId)
      dialog.loading = false
      window.location.hash = ''
      window.location.href = window.location.hash.split('#share')[0]
    },
    style: 'width: 380px'
  })
}
