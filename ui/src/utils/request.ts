import axios from 'axios'
import { IBRequestConfig, IBResponse } from '@/types/base'
import { IBConfig } from '@/config'
import Storage from '@/utils/storage'
import { useAppStoreWithout, useUserStoreWithout } from '@/store'
import router from '@/router'

const service = axios.create({
  timeout: 0,
  baseURL: IBConfig.APP_API
})

service.interceptors.request.use((config) => {
  const accessToken = Storage.getItem(Storage.Keys.accessToken) as string
  if (accessToken && config.url!.indexOf('/security/token') === -1) {
    config.headers['Authorization'] = `Bearer ${accessToken}`
  }
  const uuid = useAppStoreWithout().uuid
  if (uuid) {
    config.headers['uuid'] = uuid
  }
  if (!config.params) {
    config.params = {}
  }
  config.params['_t'] = Date.now()
  return config
})

service.interceptors.response.use(
  async (res) => {
    const resData: string | Record<string, any> = res.data
    // 如果返回数据是字符串，可能有别的特殊用处，直接返回
    if (typeof resData === 'string') return res

    const config = res.config as IBRequestConfig

    let { message, success, code } = resData as IBResponse

    // 通常的成功
    if (success) {
      const codeNum = Number(code)
      if (codeNum === 0 || !isNaN(codeNum)) return res.data
    }

    // 配置中showMessage不为false，并有错误消息，弹出错误消息
    if (config.showMessage !== false && message) {
      window.$dialog.error(message)
    }
    return Promise.reject(res.data)
  },
  async (err) => {
    const { status, data, config } = err.response
    if (status === 401 && data) {
      const userStore = useUserStoreWithout()
      if (!userStore.isLogin) return
      // Token失效
      if (data.code === 'INVALID_ACCESS_TOKEN_ERROR') {
        if (config.url!.indexOf('/security/token') === -1) {
          try {
            await checkToken()
            return service(config)
          } catch (e) {
            userStore.$reset()
            return Promise.reject(data)
          }
        }
        return
      }
      // 其它设备登录
      if (data.code === 'TOKEN_OVERWRITE_ERROR') {
        if (userStore.isLogin) {
          window.$confirm(
            window.$t('login_from_other_device_confirm'),
            {
              type: 'error',
              negativeText: undefined
            },
            () => {
              router.push({ name: 'login' })
            }
          )
        }
        userStore.$reset()
        return Promise.reject(err)
      }
    }
    if (config.showMessage !== false && err.message) {
      window.$dialog.error(err.message)
    }
    return Promise.reject(err)
  }
)

async function request<T>(config: IBRequestConfig) {
  if (!config.headers) {
    config.headers = {}
  }
  if (config.mock) {
    config.baseURL = ''
  }
  if (config.json === true) {
    config.headers['Content-Type'] = 'application/json'
    if (typeof config.data === 'object') {
      config.data = JSON.stringify(config.data)
    }
  }
  try {
    const res = await service(config)
    if (typeof res !== 'object') return res
    if (config.rawRes === true) {
      return res as T
    } else {
      return res.data as T
    }
  } catch (e) {
    return Promise.reject(e)
  }
}

async function checkToken(): Promise<undefined | string> {
  return useUserStoreWithout().refreshToken()
}

export default request
