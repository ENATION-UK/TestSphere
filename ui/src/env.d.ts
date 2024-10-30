/// <reference types="vite/client" />

declare module '*.vue' {
  import { DefineComponent } from 'vue'
  // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/ban-types
  const component: DefineComponent<{}, {}, any>
  export default component
}

interface ImportMetaEnv {
  readonly VITE_APP_CHINA: 'true' | 'false'
  readonly VITE_APP_API: string
  readonly VITE_APP_TITLE: string
  readonly VITE_APP_LOCALE: string
  readonly VITE_APP_ALIAS: string
  readonly VITE_APP_DOMAIN: string
  readonly VITE_APP_WEBSITE: string
  readonly VITE_GOOGLE_CLIENT_ID: string
  readonly VITE_GOOGLE_CAPTCHA_KEY: string
  readonly VITE_GITHUB_CLIENT_ID: string
  readonly VITE_STRIPE_KEY: string
  readonly VITE_TENCENT_CAPTCHA_APP_ID: string
  readonly VITE_FEEDBACK_URL: string
  readonly VITE_BBS_URL: string
  readonly VITE_DOCS_URL: string
  readonly VITE_WECHAT_GROUP_QRCODE_URL: string
  readonly VITE_FP_SECRET: string
  readonly VITE_HUBSPOT_ID: string
  readonly VITE_TESTER_EDGE_ID: string
  readonly VITE_TESTER_CHROME_ID: string
  readonly VITE_TESTER_SOCKET_API: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
