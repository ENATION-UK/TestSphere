import { App, Plugin } from 'vue'
import { RouteLocationNormalized, Router } from 'vue-router'
import { IBConfig } from '@/config'
import { i18n } from '@/lang'

const caches: Record<string, any> = {}
let appInst: App
export const VueTitle = {
  install: (app: App) => {
    appInst = app
    const $router = app.config.globalProperties.$router as Router
    $router.afterEach(() => {
      const { $route } = app.config.globalProperties
      setPageTitle($route)
    })
  }
} as Plugin

const getAppTitle = (route: RouteLocationNormalized) => {
  const dbDesignerKey = 'dbDesigner'
  const autoTesterKey = 'autoTester'
  if (/db-designer/.test(route.path)) {
    return i18n.global.t(dbDesignerKey)
  }
  if (/\/tester\//.test(route.path)) {
    return i18n.global.t(autoTesterKey)
  }
  return IBConfig.APP_TITLE
}

/**
 * 设置页面标题
 * @param title 标题
 * @param useSuffix
 */
export const setTitle = (title: string, useSuffix = true) => {
  const { $route } = appInst.config.globalProperties
  let tit = title
  if (useSuffix) {
    tit = `${title} - ${getAppTitle($route)}`
  }
  document.title = tit
  if (typeof $route.name === 'string') {
    caches[$route.name] = tit
  }
}

// 设置页面标题
function setPageTitle(route: RouteLocationNormalized) {
  if (!i18n.global.t) return
  for (let i = route.matched.length - 1; i >= 0; i--) {
    const name = route.matched[i].name as string
    if (caches[name]) {
      document.title = caches[name]
      return
    }
    if (!name) continue
    const key = `pages.${name}`
    const title = i18n.global.t(key)
    if (title !== key) {
      document.title = `${title} - ${getAppTitle(route)}`
      break
    }
  }
}
