import { IBBillsPreferences, IBBillsPreferencesDetail } from '@/types/workbench'
import request from '@/utils/request'

/**
 * Bills相关API
 */
export class BillsApi {
  /**
   * 保存账单配置
   */
  static savePreferences(data: IBBillsPreferences) {
    return request<void>({
      url: `/platform/v2/billing-preferences/save`,
      method: 'post',
      data
    })
  }

  /**
   * 获取当前账单配置
   */
  static preferencesDetail() {
    return request<IBBillsPreferencesDetail | null>({
      url: `/platform/v2/billing-preferences/detail`,
      method: 'get'
    })
  }
}
