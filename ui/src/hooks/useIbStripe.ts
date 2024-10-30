import { loadStripe, Stripe, StripeElementLocale } from '@stripe/stripe-js'
import { IBConfig } from '@/config'
import { i18n } from '@/lang'

let stripe: Stripe | null = null

/**
 * 这个只能单独导入<br>
 * 不能放到index中导出<br>
 * 不然会自动加载，浪费页面加载性能
 */
export function useIbStripe() {
  const load = async () => {
    if (IBConfig.APP_CHINA) return null
    if (stripe) return stripe
    stripe = await loadStripe(IBConfig.STRIPE_KEY, { locale: i18n.global.locale.value as StripeElementLocale })
    return stripe
  }

  return {
    loadStripe: load
  }
}
