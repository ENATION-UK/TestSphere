import { IBSyncStepInfoToIdeBody } from '@/types/project'
import { IBIDEPluginInfo, IBIDETableCodeSyncData } from '@/types/workbench'
import request from '@/utils/request'

/**
 * 设备相关API
 */
export class DevicesApi {
  /**
   *  获取已绑定设备列表
   */
  static bindings() {
    return request<IBIDEPluginInfo[]>({
      url: `/db-designer/v2/ide-plugins/bindings`,
      method: 'get'
    })
  }

  /**
   * 绑定设备
   * @param secret
   */
  static binding(secret: string) {
    return request<IBIDEPluginInfo>({
      url: `/db-designer/v2/ide-plugins/bindings`,
      method: 'post',
      data: { secret }
    })
  }

  /**
   * 取消绑定
   * @param secret
   */
  static unBinding(secret: string) {
    return request<void>({
      url: `/db-designer/v2/ide-plugins/bindings`,
      method: 'delete',
      data: { secret }
    })
  }

  /**
   * 推送结果给IDE
   * @param data
   */
  static pushResult(data: IBSyncStepInfoToIdeBody) {
    return request<void>({
      url: `/db-designer/v2/ide-plugins/push-requirement-result`,
      method: 'post',
      data
    })
  }

  /**
   * 推送表代码
   * @param data
   */
  static pushTableCode(data: IBIDETableCodeSyncData) {
    return request<void>({
      url: `/db-designer/v2/ide-plugins/push-table-crud-files`,
      method: 'post',
      data
    })
  }
}
