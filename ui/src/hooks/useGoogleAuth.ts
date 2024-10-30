import { useI18n } from 'vue-i18n'
import { IBConfig } from '@/config'
import { useUserStore } from '@/store'
import { AuthApi } from '@/api/user'
import { useLoginStore } from '@/views/auth/useLoginStore'

export async function useGoogleAuth(loginCallback: () => void) {
  const clientId = IBConfig.GOOGLE_CLIENT_ID
  const { locale } = useI18n()
  const loadScript = async (): Promise<void> => {
    return new Promise((resolve, reject) => {
      if (document.getElementById('google-accounts-script')) {
        return resolve()
      }
      const script = document.createElement('script')
      script.type = 'text/javascript'
      script.src = `https://accounts.google.com/gsi/client?hl=${locale.value}`
      script.id = 'google-accounts-script'
      document.body.appendChild(script)
      script.onload = () => resolve()
    })
  }
  await loadScript()

  const handleCredentialResponse = async (response) => {
    try {
      const invitationCode = useLoginStore().getInvitationCode()
      const res = await AuthApi.loginByGoogle(response.credential, invitationCode)
      await useUserStore().login(res)
      loginCallback()
    } catch (e) {
      // console.log('e:: ', e)
    }
  }

  // @ts-ignore
  google.accounts.id.initialize({
    client_id: clientId,
    callback: handleCredentialResponse
  })
  // @ts-ignore
  google.accounts.id.renderButton(document.getElementById('google-login-btn'), {
    theme: 'outline',
    size: 'large',
    locale: locale.value,
    logo_alignment: 'center',
    width: IBConfig.GITHUB_CLIENT_ID ? undefined : 296
  })
}
