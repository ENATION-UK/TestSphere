import { onMounted, onUnmounted } from 'vue'
import { onBeforeRouteLeave, onBeforeRouteUpdate } from 'vue-router'

interface UnsavedConfirmOptions {
  basis: () => boolean
  onSave: () => Promise<void>
  sleep?: number
  onCancel?: () => Promise<void>
}

export function useUnsavedConfirm(options: UnsavedConfirmOptions) {
  // 浏览器级别支持
  const windowBeforeunload = (event: BeforeUnloadEvent) => {
    if (!options.basis()) return
    event.preventDefault()
    event.returnValue = ''
  }
  onMounted(() => {
    window.addEventListener('beforeunload', windowBeforeunload)
  })
  onUnmounted(() => {
    window.removeEventListener('beforeunload', windowBeforeunload)
  })

  // Vue路由跳转支持
  const showConfirmSaveDialog = async () => {
    if (!options.basis()) return true
    try {
      await window.$confirm(
        window.$t('changed_save_tip'),
        {
          closable: true,
          negativeText: window.$t('no_save'),
          positiveText: window.$t('save')
        },
        async () => {
          const sleep = options.sleep === undefined ? 2000 : options.sleep
          await window.$sleep(sleep)
          if (typeof options.onSave === 'function') {
            await options.onSave()
          }
        }
      )
      return true
    } catch (e) {
      if (typeof options.onCancel === 'function') {
        await options.onCancel()
      }
      return e === 'cancel'
    }
  }
  onBeforeRouteUpdate(showConfirmSaveDialog)
  onBeforeRouteLeave(showConfirmSaveDialog)
}
