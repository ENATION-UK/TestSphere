import { IBPaymentMethod } from '@/types/workbench'
import request from '@/utils/request'

/**
 * 支付方式相关接口
 */
export class PaymentMethodApi {
  /**
   * 支付方式列表
   */
  static list() {
    return request<IBPaymentMethod[]>({
      url: `/platform/v2/payment-method/list`,
      method: 'get'
    })
  }

  /**
   * 添加支付方式
   * @param paymentMethodId
   */
  static add(paymentMethodId: string) {
    return request<void>({
      url: `/platform/v2/payment-method/attach`,
      method: 'post',
      params: { paymentMethodId }
    })
  }

  /**
   * 删除支付方式
   * @param id
   */
  static delete(id: string) {
    return request<void>({
      url: `/platform/v2/payment-method/${id}/delete`,
      method: 'post'
    })
  }

  /**
   * 更新支付方式
   * @param id
   * @param data
   */
  static update(id: string, data: Partial<IBPaymentMethod>) {
    return request<void>({
      url: `/platform/v2/payment-method/${id}/update`,
      method: 'post',
      data
    })
  }

  /**
   * 支付方式详情
   * @param paymentMethodId
   */
  static detail(paymentMethodId: string) {
    return request<IBPaymentMethod>({
      url: `/platform/v2/payment-method/${paymentMethodId}/detail`,
      method: 'get'
    })
  }
}
