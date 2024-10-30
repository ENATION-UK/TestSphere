import FingerprintJS from '@fingerprintjs/fingerprintjs'
import md5 from 'js-md5'
import { IBAiChatMessage, IBAiChatRecord } from '@/types/project'
import { IBConfig } from '@/config'
import request from '@/utils/request'

/**
 * 免费体验AI相关接口
 */
export class TrialAiChatApi {
  private static baseUrl() {
    return `/db-designer/v2/ai/chats/free-trial`
  }
  private static async headers() {
    const fpPromise = await FingerprintJS.load()
    const { visitorId } = await fpPromise.get()
    return {
      fp: visitorId,
      token: md5(visitorId + IBConfig.FP_SECRET)
    }
  }

  /**
   * 聊天消息列表
   */
  static async messages(chatId: string) {
    // 如果 chatId 不为空，构建包含 chatId 的路径，否则使用默认路径
    const url = chatId ? `${this.baseUrl()}/messages/coze?chatId=${chatId}` : `${this.baseUrl()}/messages`
    const headers = await this.headers()
    return request<IBAiChatMessage[]>({
      url: url,
      method: 'get',
      headers
    })
  }

  /**
   * 发送消息
   * @param message
   */
  static async sendMessage(message: string) {
    const headers = await this.headers()
    return request<IBAiChatMessage[]>({
      url: `${this.baseUrl()}/messages`,
      method: 'post',
      data: { message },
      headers
    })
  }

  /**
   * 聊天内容推送
   * @param messageId
   */
  static async liveSSE(messageId: string): Promise<EventSource> {
    let url = `${IBConfig.APP_API}${this.baseUrl()}/messages/${messageId}/live`
    const headers = await this.headers()
    url += `?fp=${headers.fp}&token=${headers.token}`
    return new EventSource(url)
  }

  /**
   * 登录后关联聊天
   */
  static async claim() {
    const headers = await this.headers()
    return request<IBAiChatRecord>({
      url: `${this.baseUrl()}/claim`,
      method: 'post',
      headers
    })
  }
}
