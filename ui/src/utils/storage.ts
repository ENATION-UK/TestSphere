/**
 * 设置储存项目
 * @param key
 * @param value
 * @param options
 */
export const setItem = (key: string, value: any, options?: Record<string, any>): void => {
  if (value === undefined || value === null) return
  let expires = options?.expires || ''
  if (typeof expires === 'number') {
    expires = new Date().getTime() + expires * 86400 * 1000
  } else if (typeof expires === 'object') {
    expires = expires.getTime()
  }
  value = JSON.stringify({ expires, data: value })
  return localStorage.setItem(key, value)
}

/**
 * 获取储存项目
 * @param key
 */
export const getItem = (key: string): any => {
  let objectStr: string | null = ''
  if (key === 'accessToken') {
    objectStr = localStorage.getItem('__persisted__user')
  } else {
    objectStr = localStorage.getItem(key)
  }
  if (!objectStr) return ''
  const object: Record<string, any> = JSON.parse(objectStr)
  if (key === 'accessToken') {
    if (!object.token) return ''
    return object.token.accessToken
  }
  const expires = object.expires
  if (typeof expires === 'number' && expires <= Date.now()) {
    localStorage.removeItem(key)
    return ''
  }
  return object.data
}

/**
 * 移除储存项目
 * @param key
 */
export const removeItem = (key: string): void => {
  return localStorage.removeItem(key)
}

/**
 * 清空所有储存项目
 */
export const clearAll = () => {
  return localStorage.clear()
}

/**
 * 储存项目Keys
 */
export const Keys = {
  user: 'user',
  accessToken: 'accessToken',
  expires: 'expires',
  lang: 'lang',
  syncIdeaModal: 'syncIdeaModal',
  guideStep: 'guideStep'
}

export default {
  setItem,
  getItem,
  removeItem,
  clearAll,
  Keys
}
