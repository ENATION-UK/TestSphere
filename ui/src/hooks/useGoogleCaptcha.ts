import { IBConfig } from '@/config'

export function useGoogleCaptcha() {
  // 如果是国内，不需要校验
  if (IBConfig.APP_CHINA) {
    return { captcha: () => Promise.resolve({}) }
  }
  const loadScript = (): Promise<void> => {
    return new Promise((resolve, reject) => {
      if (document.getElementById('google-captcha-script')) {
        return resolve()
      }
      const script = document.createElement('script')
      script.type = 'text/javascript'
      script.src = `https://www.google.com/recaptcha/api.js?render=${IBConfig.GOOGLE_CAPTCHA_KEY}`
      script.id = 'google-captcha-script'
      document.body.appendChild(script)
      script.onload = () => resolve()
    })
  }
  loadScript()

  const captcha = (): Promise<string> => {
    return new Promise((resolve, reject) => {
      loadScript().then(() => {
        // @ts-ignore
        grecaptcha.ready(() => {
          // @ts-ignore
          grecaptcha
            .execute(IBConfig.GOOGLE_CAPTCHA_KEY, { action: 'submit' })
            .then((token: string) => {
              resolve(token)
            })
            .catch((reason: string) => {
              reject(reason)
            })
        })
      })
    })
  }

  return {
    captcha
  }
}
