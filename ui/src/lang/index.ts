import { App } from 'vue'
import { createI18n, I18nOptions } from 'vue-i18n'
import { IBConfig } from '@/config'

// 公共的语言模块
const modules = import.meta.glob('./*', { eager: true })
// 在页面里的语言模块
const viewModules = import.meta.glob('../views/**/locales/[[:lower:]][[:lower:]]-[[:upper:]][[:upper:]].ts', {
  eager: true
})

/**
 * 获取所有语言
 */
function getAllMessages(): I18nOptions['messages'] {
  let messages: I18nOptions['messages'] = {}
  getFileMessage(modules, messages)
  getFileMessage(viewModules, messages)
  return messages
}

/**
 * 获取文件内的语言
 * @param modules
 * @param messages
 */
function getFileMessage(modules: any, messages: Record<string, Object>): any {
  for (const path in modules) {
    const locale = path.replace(/(.*\/)*([^.]+).*/gi, '$2')
    const message = modules[path].default || {}
    messages[locale] = Object.assign({}, messages[locale] || {}, message)
  }
  return messages
}

/**
 * 创建i18n实例
 */
const createI18nInstance = () => {
  return createI18n({
    legacy: false,
    allowComposition: true,
    locale: IBConfig.APP_LOCALE || 'en-US',
    globalInjection: true,
    messages: getAllMessages()
  })
}

type IBI18n = ReturnType<typeof createI18nInstance>
let i18n: IBI18n

export function setupI18n(app: App) {
  i18n = createI18nInstance()
  app.use(i18n)
}

export { i18n, IBI18n }
