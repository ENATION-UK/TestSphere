import { defineStore } from 'pinia'
import { v4 as uuidV4 } from 'uuid'
import { IBConfig } from '@/config'
import { store } from '@/store/index'
import { i18n } from '@/lang'

interface AppState {
  themeMode: 'light' | 'dark'
  lang: string
  uuid: string
}

export const useAppStore = defineStore('app', {
  persist: { paths: ['uuid', 'themeMode'] },
  state: (): AppState => ({
    themeMode: 'light',
    lang: IBConfig.APP_LOCALE,
    uuid: ''
  }),
  actions: {
    /**
     * 初始化UUID
     */
    initUuid() {
      this.uuid = uuidV4()
    },
    /**
     * 改变主题
     * @param themeMode
     */
    changeThemeMode(themeMode?: 'light' | 'dark') {
      if (!themeMode) {
        themeMode = this.themeMode === 'light' ? 'dark' : 'light'
      }
      this.themeMode = themeMode
    },
    /**
     * 切换语言
     * @param lang
     */
    changeLang(lang?: string) {
      if (!lang) {
        lang = this.lang === 'zh-CN' ? 'en-US' : 'zh-CN'
      }
      i18n.global.locale.value = lang
      this.lang = lang
    }
  }
})

export const useAppStoreWithout = () => useAppStore(store)
