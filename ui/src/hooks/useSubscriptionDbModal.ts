import { defineAsyncComponent, h } from 'vue'

const SubscriptionDesign = defineAsyncComponent(() => import('@/views/workbench/manage/bills/SubscriptionDesign.vue'))
export function useSubscriptionDbModal() {
  const dialog = window.$dialog.create({
    title: window.$t('pages.billsSubscription'),
    showIcon: false,
    maskClosable: false,
    closeOnEsc: false,
    autoFocus: false,
    content: () => h(SubscriptionDesign, { modal: true, dialog }),
    transformOrigin: 'center',
    style: `width: 1200px; max-height: 85vh; overflow: auto;`
  })
}
