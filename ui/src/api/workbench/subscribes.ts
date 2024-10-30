import { IBSubscribeTypeDb } from '@/types/workbench'
import request from '@/utils/request'

/**
 * 订阅相关API
 */
export class SubscribesApi {
  /**
   * 创建订阅
   */
  static create(subscribeTypeDb: IBSubscribeTypeDb, seatQuantity?: number) {
    return request<string>({
      url: `/platform/v2/subscribes/create`,
      method: 'post',
      params: { subscribeTypeDb, seatQuantity }
    })
  }

  /**
   * 更新订阅
   * @param subscribeTypeDb
   * @param seatQuantity
   */
  static update(subscribeTypeDb: IBSubscribeTypeDb, seatQuantity?: number) {
    return request<string>({
      url: `/platform/v2/subscribes/update`,
      method: 'post',
      params: { subscribeTypeDb, seatQuantity }
    })
  }
}
