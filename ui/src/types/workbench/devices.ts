/**
 * IDE插件连接信息
 */
export interface IBIDEPluginInfo {
  id: string
  reconnectionSecret: string
  displayName: string
  ideName: string
  ideType: string
  ideVersion: string
  ipAddress: string
  status: 'ONLINE' | 'CONNECTING' | 'OFFLINE'
}

/**
 * 推送到设备的表CRUD代码数据
 */
export interface IBIDETableCodeSyncData {
  // 表ID
  tableId: string
  // 是否推全部文件
  allFiles: boolean
  // 设备ID
  pluginId: string
  // 模糊的文件/目录名
  fuzzyFilename: IBConditional
  // 语言
  language?: IBConditional
  // 推送至IDE的路径
  basePath: string
}

type IBConditional = IBIDETableCodeSyncData['allFiles'] extends true ? string : string | undefined
