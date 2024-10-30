import { defineAsyncComponent, h } from 'vue'

const BuyConsultModal = defineAsyncComponent(() => import('@/views/tester/BuyConsultModal.vue'))

export function useTesterBuyConsultModal() {
  const styles = `
    width: 830px;
    max-height: 85vh;
    overflow: auto;
    --n-content-margin: 0;
  `
  const dialog = window.$dialog.create({
    title: '',
    showIcon: false,
    maskClosable: false,
    closeOnEsc: false,
    autoFocus: false,
    content: () => h(BuyConsultModal, { dialog }),
    transformOrigin: 'center',
    style: styles
  })
}
