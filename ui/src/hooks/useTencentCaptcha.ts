import { IBConfig } from '@/config'

export function useTencentCaptcha() {
  // 如果不是国内，不需要校验
  if (!IBConfig.APP_CHINA) {
    return { captcha: () => Promise.resolve({}) }
  }
  const loadScript = (): Promise<void> => {
    return new Promise((resolve, reject) => {
      if (document.getElementById('tencent-captcha-script')) {
        return resolve()
      }
      const script = document.createElement('script')
      script.type = 'text/javascript'
      script.src = `https://turing.captcha.qcloud.com/TCaptcha.js`
      script.id = 'tencent-captcha-script'
      document.body.appendChild(script)
      script.onload = () => resolve()
    })
  }

  loadScript().then()

  const captcha = (): Promise<Record<string, any>> => {
    return new Promise((resolve, reject) => {
      loadScript().then(() => {
        // @ts-ignore
        const captcha = new window.TencentCaptcha(
          IBConfig.TENCENT_CAPTCHA_APP_ID,
          (res) => {
            if (res.ret === 0) {
              resolve({ randstr: res.randstr, ticket: res.ticket })
            } else {
              window.$message.error(window.$t('cancel_validation'))
              reject()
            }
          },
          {}
        )
        captcha.show()
      })
    })
  }

  return { captcha }
}
