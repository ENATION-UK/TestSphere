import { IBPagerRes } from '@/types'
import { IBInvoices, IBInvoicesQuery } from '@/types/workbench'
import request from '@/utils/request'

/**
 * 发票相关API
 */
export class InvoicesApi {
  /**
   * 发票列表
   * @param params
   */
  static list(params: IBInvoicesQuery) {
    return request<IBPagerRes<IBInvoices>>({
      url: `/platform/v2/invoices/list`,
      method: 'get',
      params
    })
  }
}
