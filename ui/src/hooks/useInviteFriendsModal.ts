import { defineAsyncComponent, h } from 'vue'

const InviteFriendsModal = defineAsyncComponent(() => import('@/views/InviteFriendsModal.vue'))

export function useInviteFriendsModalModal() {
  const styles = `
    width: 600px;
    max-height: 85vh;
  `
  const dialog = window.$dialog.create({
    title: '',
    showIcon: false,
    autoFocus: false,
    content: () => h(InviteFriendsModal, { dialog }),
    transformOrigin: 'center',
    style: styles
  })
}
