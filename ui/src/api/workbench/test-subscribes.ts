import { IBSubscribeTypeAt } from '@/types/workbench'
import request from '@/utils/request'

/**
 * 订阅相关API
 */
export class TestSubscribesApi {
  /**
   * 创建订阅
   */
  static create(subscribeType: IBSubscribeTypeAt) {
    return request<string>({
      url: `/platform/v2/subscribes/autotest/create`,
      method: 'post',
      params: { subscribeType }
    })
  }

  /**
   * 更新订阅
   * @param subscribeType
   */
  static update(subscribeType: IBSubscribeTypeAt) {
    return request<string>({
      url: `/platform/v2/subscribes/autotest/update`,
      method: 'post',
      params: { subscribeType }
    })
  }
}
