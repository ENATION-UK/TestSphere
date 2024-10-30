import dayjs from 'dayjs'
import jwtDecode, { JwtPayload } from 'jwt-decode'
import { defineStore } from 'pinia'
import { IBLoginRes, IBToken, IBUser } from '@/types/user'
import { useCompanyStore } from '@/store/workbench'
import { AuthApi, SecurityApi, UserApi } from '@/api/user'
import { store, useAppStore } from './index'

interface UserState {
  user?: IBUser
  token?: IBToken
}

export const useUserStore = defineStore('user', {
  persist: true,
  state: (): UserState => ({
    user: undefined,
    token: undefined
  }),
  actions: {
    /**
     * 登录
     * @param data
     */
    async login(data: IBLoginRes) {
      const { accessToken, refreshToken } = data
      this.setToken({ accessToken, refreshToken })
      const companyStore = useCompanyStore()
      await Promise.all([companyStore.getCompanies()])
    },
    /**
     * 获取当前已登录用户信息
     */
    async getUserInfo() {
      this.user = await UserApi.info()
    },
    /**
     * 设置Token信息
     * @param token
     */
    setToken(token: IBToken | string) {
      if (typeof token === 'string') {
        token = JSON.parse(token) as Record<'accessToken' | 'refreshToken', string>
      }
      try {
        const exp = jwtDecode<JwtPayload>(token.refreshToken).exp!
        const date = dayjs(exp * 1000).toDate()
        let domain = window.location.hostname
        if (!/^(\d+)\.(\d+)\.(\d+)\.(\d+)$/.test(domain)) {
          domain = domain.split('.').slice(1).join('.')
        }
        document.cookie = `consoleLogin=1; expires=${date.toUTCString()}; domain=${domain}`
      } catch (e) {
        //
      }
      this.token = token
    },
    /**
     * 刷新Token
     */
    async refreshToken() {
      const refreshToken = this.token?.refreshToken
      if (!refreshToken) return
      try {
        const res = await SecurityApi.refreshToken(refreshToken)
        this.setToken(res)
      } catch (e) {
        return Promise.reject()
      }
    },
    /**
     * 退出登录
     */
    async logout() {
      await AuthApi.logout()
      useAppStore().initUuid()
      this.$reset()
      location.reload()
    }
  },
  getters: {
    isLogin(): boolean {
      if (!this.token) return false
      const now = Date.now() / 1000
      const decode = jwtDecode<JwtPayload>(this.token.accessToken)
      if (now < decode.exp!) {
        return true
      } else {
        this.user = undefined
        this.token = undefined
        return false
      }
    },
    aliYunUser(): boolean {
      return !!this.user?.aliUid
    },
    // 当前所在企业角色
    companyRole(state): 'USER' | 'ADMIN' | undefined {
      if (!state.token) return
      const payload = jwtDecode<JwtPayload & { role: 'USER' | 'ADMIN' }>(state.token.accessToken)
      return payload.role
    }
  }
})

export const useUserStoreWithout = () => useUserStore(store)

export type UserStore = ReturnType<typeof useUserStore>
