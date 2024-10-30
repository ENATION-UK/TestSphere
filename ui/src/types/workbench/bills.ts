/**
 * 账单设置
 */
export interface IBBillsPreferences {
  billAddress: IBBillsAddress
  email: string
  tax: {
    taxId: string
    taxType: string
  }
}

/**
 * 账单设置详情
 */
export interface IBBillsPreferencesDetail {
  city: string
  country: string
  email: string
  name: string
  postcode: string
  stateProvince: string
  streetLine1: string
  streetLine2: string
  taxId: string
  taxIdType: string
}

/**
 * 账单地址
 */
export interface IBBillsAddress {
  address: {
    city: string
    country: string
    line1: string
    line2: string | null
    postalCode: string
    state: string
  }
  name: string
}
