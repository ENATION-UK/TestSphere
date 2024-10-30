import { defineAsyncComponent, h } from 'vue'

const BillsPreferences = defineAsyncComponent(() => import('@/views/workbench/manage/bills/preferences.vue'))
export function useBillsPreferencesModal() {
  const dialog = window.$dialog.create({
    title: window.$t('pages.billsPreferences'),
    showIcon: false,
    maskClosable: false,
    closeOnEsc: false,
    autoFocus: false,
    content: () => h(BillsPreferences, { modal: true, dialog }),
    transformOrigin: 'center',
    style: `width: 900px; max-height: 85vh; overflow: auto;`
  })
}
