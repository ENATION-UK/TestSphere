import { App, markRaw } from 'vue'
import { createPinia } from 'pinia'
import { createPersistedState } from 'pinia-plugin-persistedstate'
import router from '@/router'

export * from './useAppStore'
export * from './useGuideStore'
export * from './useUserStore'

const store = createPinia()
store.use(
  createPersistedState({
    key: (id) => `__persisted__${id}`
  })
)
store.use(({ store }) => {
  store.router = markRaw(router)
})

export function setupStore(app: App) {
  app.use(store)
}

export { store }
