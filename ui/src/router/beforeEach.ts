import { Router } from 'vue-router'
import QS from 'qs'
import { useUserStore } from '@/store'
import { useCompanyStore } from '@/store/workbench'

export function handleBeforeEach(router: Router) {
  const whiteList: string[] = ['login', 'aliYunLogin', 'aiChat']
  router.beforeEach(async (to) => {
    // 白名单
    if (whiteList.includes(to.name as string)) return true
    const promises = [] as Promise<void>[]
    const userStore = useUserStore()
    const companyStore = useCompanyStore()
    if (!userStore.isLogin) {
      const urlSearch = new URLSearchParams(`?${QS.stringify(to.query)}`)
      urlSearch.delete('invitationCode')
      let url = `/login?redirect=${to.path}?${urlSearch.toString()}`
      if (to.query && to.query.invitationCode) {
        url += `&invitationCode=${to.query.invitationCode}`
      }
      return url
    }
    if (!companyStore.company) promises.push(companyStore.getCompanyInfo())
    if (!userStore.user) promises.push(userStore.getUserInfo())
    await Promise.all(promises)
    // 检查权限
    if (/db-designer/.test(to.path)) {
      if (!companyStore.hasDbDesignAuth) {
        return '/tester/projects'
      }
    }
  })
}
