import { createApp } from 'vue'
import { sleep } from '@/utils'
import { setupStore } from '@/store'
import { setupI18n } from '@/lang'
import { VueTitle } from '@/plugins'
import router from '@/router'
import App from './App.vue'

async function bootstrap() {
  const app = createApp(App)
  app.use(router)
  setupStore(app)
  setupI18n(app)
  app.use(VueTitle)
  window.$sleep = sleep
  if (typeof window !== 'undefined') {
    window.$IBAttaches = {
      clear: () => {
        window.$IBAttaches.dragging_data = undefined
        window.$IBAttaches.dragging_mark = undefined
        window.$IBAttaches.dragging_position = undefined
      }
    }
  }
  app.mount('#app')
}

void bootstrap()
