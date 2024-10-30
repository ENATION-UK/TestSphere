import { IBConfig } from '@/config'
import * as regExp from './regExp'

/**
 * 手机号和邮箱校验
 * @param _
 * @param value
 */
export const mobileAndEmail = (_, value: any) => {
  if (IBConfig.APP_CHINA) {
    if (!value) return new Error(window.$t('auth.username_placeholder'))
    if (regExp.integer_and_zero.test(value) && value.length === 11) {
      if (!regExp.mobile.test(value)) {
        return new Error(window.$t('auth.mobile_format_error'))
      } else {
        return true
      }
    } else if (value.indexOf('@') !== -1) {
      if (!regExp.email.test(value)) {
        return new Error(window.$t('auth.email_format_error'))
      } else {
        return true
      }
    } else {
      return new Error(window.$t('auth.mobile_email_format_error'))
    }
  }
  if (!value) return new Error(window.$t('auth.email_placeholder'))
  if (!regExp.email.test(value)) return new Error(window.$t('auth.email_format_error'))
  return true
}
