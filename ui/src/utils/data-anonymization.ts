/**
 * 手机号码脱敏
 * @param mobile
 */
export const mobile = (mobile: string): string => {
  if (!mobile) return ''
  return mobile.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2')
}
/**
 * 邮箱地址脱敏
 * @param email
 */
export const email = (email: string): string => {
  return email.replace(/(?<=.{2}).(?=[^@]*?@)/g, '*')
}
