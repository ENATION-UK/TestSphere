import { defineStore } from 'pinia'
import { IBCompany, IBSubscription } from '@/types/workbench'
import { useUserStore } from '@/store'
import { CompanyApi } from '@/api/workbench'

interface CompanyState {
  company?: IBCompany
  companies?: IBCompany[]
  subscriptions: IBSubscription[]
}

export const useCompanyStore = defineStore('workbench/company', {
  state: (): CompanyState => ({
    company: undefined,
    companies: [],
    subscriptions: []
  }),
  actions: {
    /**
     * 获取当前企业信息
     */
    async getCompanyInfo() {
      const company = await CompanyApi.detail()
      if (company && !company.companyName) {
        const user = useUserStore().user
        company.companyName = window.$t('wb.manage.enterprise.xxx_default_team', { name: user?.nickname })
      }
      this.company = company
    },
    /**
     * 获取用户参与的企业列表
     */
    async getCompanies() {
      const companies = await CompanyApi.companies()
      const user = useUserStore().user
      this.companies = companies.map((item) => {
        if (!item.companyName && item.companyId === user?.companyId) {
          item.companyName = window.$t('wb.manage.enterprise.xxx_default_team', { name: user.nickname })
        }
        return item
      })
    },
    /**
     * 切换当前企业
     * @param companyId
     */
    async changeCompany(companyId: string) {
      const res = await CompanyApi.change(companyId)
      await useUserStore().login(res)
    },
    /**
     * 获取当前企业订阅集合
     */
    async getSubscriptions() {
      this.subscriptions = await CompanyApi.subscriptions()
    }
  },
  getters: {
    // 数据库设计订阅信息
    subscriptionDb(state): IBSubscription | undefined {
      return state.subscriptions.find((item) => item.productType === 'dbdesign')
    },
    // 自动化测试订阅信息
    subscriptionAt(state): IBSubscription | undefined {
      return state.subscriptions.find((item) => item.productType === 'autotest')
    },
    // 是否有数据库设计权限
    hasDbDesignAuth(state): boolean {
      if (!state.company) return false
      const { productAuthorities } = state.company
      if (!Array.isArray(productAuthorities)) return false
      return productAuthorities.includes('dbdesign')
    }
  }
})
