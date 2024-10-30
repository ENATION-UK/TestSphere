import { defineAsyncComponent, h } from 'vue'

const SubscriptionTester = defineAsyncComponent(() => import('@/views/workbench/manage/bills/SubscriptionTester.vue'))
export function useSubscriptionAtModal() {
  const dialog = window.$dialog.create({
    title: window.$t('pages.billsSubscription'),
    showIcon: false,
    maskClosable: false,
    closeOnEsc: false,
    autoFocus: false,
    content: () => h(SubscriptionTester, { modal: true, dialog }),
    transformOrigin: 'center',
    style: `width: 1200px; max-height: 85vh; overflow: auto;`
  })
}
