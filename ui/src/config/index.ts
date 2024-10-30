import envChina from './env.china'
import envGlobal from './env.global'

type EnvChina = typeof envChina
type EnvGlobal = typeof envGlobal
type Envs = EnvChina & EnvGlobal

const APP_CHINA: string = import.meta.env.VITE_APP_CHINA
const APP_API: string = import.meta.env.VITE_APP_API
const APP_TITLE: string = import.meta.env.VITE_APP_TITLE
const APP_LOCALE: string = import.meta.env.VITE_APP_LOCALE
const APP_DOMAIN: string = import.meta.env.VITE_APP_DOMAIN
const APP_WEBSITE: string = import.meta.env.VITE_APP_WEBSITE
const GOOGLE_CLIENT_ID: string = import.meta.env.VITE_GOOGLE_CLIENT_ID
const GOOGLE_CAPTCHA_KEY: string = import.meta.env.VITE_GOOGLE_CAPTCHA_KEY
const GITHUB_CLIENT_ID: string = import.meta.env.VITE_GITHUB_CLIENT_ID
const STRIPE_KEY: string = import.meta.env.VITE_STRIPE_KEY
const TENCENT_CAPTCHA_APP_ID: string = import.meta.env.VITE_TENCENT_CAPTCHA_APP_ID
const FEEDBACK_URL: string = import.meta.env.VITE_FEEDBACK_URL
const BBS_URL: string = import.meta.env.VITE_BBS_URL
const WECHAT_GROUP_QRCODE_URL: string = import.meta.env.VITE_WECHAT_GROUP_QRCODE_URL
const DOCS_URL: string = import.meta.env.VITE_DOCS_URL
const FP_SECRET: string = import.meta.env.VITE_FP_SECRET
const TESTER_EDGE_ID: string = import.meta.env.VITE_TESTER_EDGE_ID || 'bgdkdhdcjdokpemlencjfapjinponeec'
const TESTER_CHROME_ID: string = import.meta.env.VITE_TESTER_CHROME_ID || 'klgdoebbgbophacnjacomphfgngmhblc'
const TESTER_SOCKET_API: string = import.meta.env.VITE_TESTER_SOCKET_API
const HUBSPOT_ID: string = import.meta.env.VITE_HUBSPOT_ID

const isChina = APP_CHINA === 'true'
const envs = (isChina ? envChina : envGlobal) as Envs
const testerExtId = /edg/.test(navigator.userAgent.toLowerCase()) ? TESTER_EDGE_ID : TESTER_CHROME_ID
export const IBConfig = {
  // 是否属于国内环境
  APP_CHINA: isChina,
  // 接口地址
  APP_API: APP_API || envs.APP_API,
  // 站点默认标题
  APP_TITLE: APP_TITLE || envs.APP_TITLE,
  // 站点域名
  APP_DOMAIN: APP_DOMAIN || envs.APP_DOMAIN,
  // 站点默认语言
  APP_LOCALE: APP_LOCALE || envs.APP_LOCALE,
  // 官方站点域名
  APP_WEBSITE: APP_WEBSITE || envs.APP_WEBSITE,
  // Google客户端ID
  GOOGLE_CLIENT_ID: GOOGLE_CLIENT_ID || envs.GOOGLE_CLIENT_ID,
  // Google验证码key
  GOOGLE_CAPTCHA_KEY: GOOGLE_CAPTCHA_KEY || envs.GOOGLE_CAPTCHA_KEY,
  // Github客户端ID
  GITHUB_CLIENT_ID: GITHUB_CLIENT_ID || envs.GITHUB_CLIENT_ID,
  // StripeKey
  STRIPE_KEY: STRIPE_KEY || envs.STRIPE_KEY,
  // 腾讯验证APP_ID
  TENCENT_CAPTCHA_APP_ID: TENCENT_CAPTCHA_APP_ID || envs.TENCENT_CAPTCHA_APP_ID,
  // 意见反馈链接
  FEEDBACK_URL: FEEDBACK_URL || envs.FEEDBACK_URL,
  // 社区链接
  BBS_URL: BBS_URL || envs.BBS_URL,
  // 微信群二维码链接
  WECHAT_GROUP_QRCODE_URL: WECHAT_GROUP_QRCODE_URL || envs.WECHAT_GROUP_QRCODE_URL,
  // 文档链接
  DOCS_URL: DOCS_URL || envs.DOCS_URL,
  // 用户指纹秘钥
  FP_SECRET: FP_SECRET || envs.FP_SECRET,
  // 自动化测试浏览器扩展ID
  TESTER_EXT_ID: testerExtId,
  // 自动化测试WebSocket接口地址
  TESTER_SOCKET_API: TESTER_SOCKET_API || envs.TESTER_SOCKET_API,
  // HUBSPOT_ID
  HUBSPOT_ID: HUBSPOT_ID || envs.HUBSPOT_ID
}
