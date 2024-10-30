import { IBPagerRes } from '@/types'
import { IBAiPointLog, IBAiPointLogQuery } from '@/types/workbench'
import request from '@/utils/request'

/**
 * AI点相关API
 */
export class AiPointApi {
  /**
   * AI点日志
   * @param params
   */
  static logs(params: IBAiPointLogQuery) {
    return request<IBPagerRes<IBAiPointLog>>({
      url: `/db-designer/v2/ai/logs`,
      method: 'get',
      params
    })
  }

  /**
   * AI点购买-国内版
   * @param quantity
   */
  static buyChina(quantity: number) {
    return request<string>({
      url: `/platform/v2/ai-point/cn/buy`,
      method: 'post',
      params: { quantity }
    })
  }

  /**
   * AI点购买-国际版
   * @param quantity
   */
  static buyGlobal(quantity: number) {
    return request<string>({
      url: `/platform/v2/ai-point/global/buy`,
      method: 'post',
      params: { quantity }
    })
  }
}
