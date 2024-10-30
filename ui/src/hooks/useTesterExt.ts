import { defineAsyncComponent, h } from 'vue'

export function useTesterExt() {
  return {
    get extId() {
      return document.getElementById('__AUTO_TESTER_EXT_INSTALLED__')?.getAttribute('data-ext-id')
    },
    get installed() {
      return !!document.getElementById('__AUTO_TESTER_EXT_INSTALLED__')
    },
    showExtNotInstalledModal() {
      const ExtNoInstalledModal = defineAsyncComponent(() => import('@/views/tester/ExtNoInstalledModal.vue'))
      window.$dialog.create({
        title: '',
        showIcon: false,
        autoFocus: false,
        maskClosable: false,
        closeOnEsc: false,
        transformOrigin: 'center',
        style: 'width: 530px;',
        content: () => h(ExtNoInstalledModal)
      })
    },
    checker() {
      if (this.installed) return true
      this.showExtNotInstalledModal()
      return false
    }
  }
}
