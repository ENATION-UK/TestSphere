/**
 *  代码语言偏好
 */
export interface IBCodeLangItem {
  // 项目ID
  projectId: string
  // 代码语言
  language: string
  // 是否选中
  checked: boolean
  // 框架列表
  frameworks?: IBCodeLangFrameworkItem[]
}

/**
 * 框架项
 */
export interface IBCodeLangFrameworkItem {
  // 框架名称
  name: string
  // 是否选中
  checked: boolean
}

/**
 * 项目数据库设置
 */
export interface IBDatabaseSetting {
  id?: string
  // 项目ID
  projectId?: string
  // 字符集
  characterSet?: string
  // 排序规则
  collation?: string
  // 数据库类型
  database: string
  // 表前缀
  tablePrefix?: string
}
