import { defineAsyncComponent, h } from 'vue'

const InviteAccessDeniedModal = defineAsyncComponent(
  () => import('@/views/workbench/manage/InviteAccessDeniedModal.vue')
)

export function useInviteAccessDeniedModal(title?: string) {
  const dialog = window.$dialog.create({
    title: title || window.$t('wb.manage.invite_members'),
    content: () => h(InviteAccessDeniedModal, { title, dialog }),
    autoFocus: false,
    type: 'warning',
    transformOrigin: 'center',
    style: 'width: 400px'
  })
}
