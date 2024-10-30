import { IBOrder, IBOrderPriceDetail, IBOrderPriceParams } from '@/types/workbench'
import request from '@/utils/request'

/**
 * 订单相关接口
 */
export class OrderApi {
  /**
   * 订单列表
   */
  static list() {
    return request<IBOrder[]>({
      url: `/platform/v2/order/list`,
      method: 'get'
    })
  }

  /**
   * 计算订单价格
   * @param params
   */
  static computedPrice(params: IBOrderPriceParams) {
    return request<IBOrderPriceDetail>({
      url: `/platform/v2/order/price`,
      method: 'get',
      params
    })
  }

  /**
   * 计算席位价格
   * @param seatQuantity
   */
  static computedSeatPrice(seatQuantity: number) {
    return request<IBOrderPriceDetail>({
      url: `/platform/v2/order/seat-only/price`,
      method: 'get',
      params: { seatQuantity }
    })
  }

  /**
   * 创建订单
   * @param params
   */
  static createOrder(params: IBOrderPriceParams) {
    return request<string>({
      url: `/platform/v2/order`,
      method: 'post',
      params
    })
  }

  /**
   * 创建席位订单
   * @param seatQuantity
   */
  static createSeatOrder(seatQuantity: number) {
    return request<string>({
      url: `/platform/v2/order/seat-only`,
      method: 'post',
      params: { seatQuantity }
    })
  }

  /**
   * 获取订单详情
   * @param orderId
   */
  static detail(orderId: string) {
    return request<IBOrder>({
      url: `/platform/v2/order/${orderId}/detail`,
      method: 'get'
    })
  }

  /**
   * 订单支付
   * @param orderId
   * @param paymentMethodId
   */
  static pay(orderId: string, paymentMethodId: string) {
    return request<string>({
      url: `/platform/v2/order/${orderId}/pay`,
      method: 'get',
      params: { paymentMethodId }
    })
  }
}
