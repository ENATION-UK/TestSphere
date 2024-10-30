/**
 * 支付方式
 */
export interface IBPaymentMethod {
  id: string
  billingAddressCity: string
  billingAddressCountry: string
  billingAddressLine1: string
  billingAddressLine2: string
  billingAddressPostalCode: string
  billingAddressState: string
  billingName: string
  cardBrand: string
  cardChecksAddressLine1Check: string
  cardChecksAddressPostalCodeCheck: string
  cardChecksCvcCheck: string
  cardCountry: string
  // 卡的有效期月数
  cardExpMonth: number
  // 卡的有效期年
  cardExpYear: number
  // 卡号最后四位数
  cardLast4: string
  // 卡号
  cardNumber: string
  cvc: string
}
