import { SelectOption } from 'naive-ui'
import { snowflake } from '@/utils'
import { IBBase } from './base'

/**
 * 表
 */
export class IBTable extends IBBase {
  // 表ID
  id!: string
  // 表名称
  name!: string
  // 分组ID
  groupId!: string
  // 项目ID
  projectId!: string
  // 描述
  description?: string
  // 字段列表
  columns?: IBTableColumn[]
  // 索引列表
  indexInfos?: IBTableIndex[]
  // 外键列表
  foreignKeys?: IBTableForeignKey[]

  constructor(table?: Partial<IBTable>) {
    super(table)
    this.id = table?.id || snowflake.generate()
    this.name = table?.name || ''
    this.groupId = table?.groupId || ''
    this.projectId = table?.projectId || ''
    this.description = table?.description || ''
    this.columns = table?.columns || []
    this.indexInfos = table?.indexInfos
    this.foreignKeys = table?.foreignKeys
  }
}

/**
 * 表字段
 */
export class IBTableColumn extends IBBase {
  // Id
  id!: string
  // 名称
  name!: string
  // 表ID
  tableId!: string
  // 类型
  dataType!: string
  // 是否是主键
  isPrimaryKey!: boolean
  // 是否自增(仅MySQL)
  isAutoIncrement?: boolean
  // 是否是唯一
  isUnique!: boolean
  // 默认值
  defaultVal?: string
  // 是否可以为空
  isNullable!: boolean
  // 长度
  length?: number
  // 精度
  precision?: number
  // 注释
  description!: string
  // 序号排列
  sequence!: number
  // 字符集(仅MySQL)
  characterSet?: string
  // 排序规则(仅MySQL)
  collation?: string
  // 是否是二进制
  binary?: boolean
  // 是否无符号
  unsigned?: boolean
  // 是否零填充
  zerofill?: boolean
  // 在图中是否可见
  visibleInDiagram? = true

  constructor(column?: Partial<IBTableColumn>, tableId?: string) {
    super(column)
    this.id = column?.id || snowflake.generate()
    this.name = column?.name || 'newColumn'
    this.tableId = column?.tableId || tableId || snowflake.generate()
    this.dataType = column?.dataType || ''
    this.isPrimaryKey = column?.isPrimaryKey === undefined ? false : column?.isPrimaryKey
    this.isUnique = column?.isUnique === undefined ? true : column?.isUnique
    this.defaultVal = column?.defaultVal || ''
    this.isNullable = column?.isNullable === undefined ? true : column?.isNullable
    this.length = column?.length
    this.precision = column?.precision
    this.description = column?.description || 'description'
    this.sequence = column?.sequence || 0
    this.visibleInDiagram = column?.visibleInDiagram === undefined ? true : column?.visibleInDiagram
  }
}

/**
 * 表字段key
 */
export type IBTableColumnKeys = keyof IBTableColumn

/**
 * 表设计响应
 */
export interface DesignTableRes {
  doing: boolean
  tableName: string
  tableFields: IBTableColumn[]
  tableAiString: string
  data: any
}

// 表索引类型
const tableIndexTypeOptions = [
  { label: 'FULLTEXT', value: 'FULLTEXT' },
  { label: 'NORMAL', value: 'NORMAL' },
  { label: 'UNIQUE', value: 'UNIQUE' },
  { label: 'SPATIAL', value: 'SPATIAL' }
] as const
export const IBTableIndexTypeOptions = <SelectOption[]>(<unknown>tableIndexTypeOptions)
export type IBTableIndexType = (typeof tableIndexTypeOptions)[number]['value']

// 表索引方式
const tableIndexUsingTypeOptions = [
  { label: 'BTREE', value: 'BTREE' },
  { label: 'HASH', value: 'HASH' }
] as const
export const IBTableIndexUsingTypeOptions = <SelectOption[]>(<unknown>tableIndexUsingTypeOptions)
export type IBTableIndexUsingType = (typeof tableIndexUsingTypeOptions)[number]['value']

/**
 * 表索引
 */
export class IBTableIndex {
  // 主键ID
  id?: string
  // 所属表ID
  tableId!: string
  // 索引名称
  name!: string
  // 索引类型
  type?: IBTableIndexType
  // 索引方式
  usingType?: IBTableIndexUsingType
  // 是否已删除
  deleted?: boolean
  // 表索引列列表
  columnList?: IBTableIndexColumn[]

  constructor(tableId: string) {
    this.id = snowflake.generate()
    this.tableId = tableId
    this.name = ''
    this.type = undefined
    this.usingType = undefined
    this.deleted = false
    this.columnList = []
  }
}

/**
 * 表索引列
 */
export class IBTableIndexColumn {
  // 主键ID
  id?: string
  // 所属索引的ID
  indexId?: string
  // 列ID
  columnId!: string
  // 列名称，同索引所属的表
  columnName?: string
  // 指定要包含在索引中的字符数（MySQL支持，仅可变长度的数据类型）
  columnLength?: number
  // 索引排序方式，可为空，如：
  sortOrder?: 'ASC' | 'DESC'
  // 列的序号
  sequence!: number
  // 是否已删除，逻辑删除标识
  deleted?: boolean

  /**
   * 新建表索引列
   * @param indexId 表索引ID
   */
  constructor(indexId?: string) {
    this.id = snowflake.generate()
    this.indexId = indexId
  }
}

/**
 * 表外键
 */
export class IBTableForeignKey {
  // 主键ID
  id?: string
  // 外键名称，可为空。如：fk_role_id
  name?: string
  // 所属表ID
  tableId!: string
  // 所属表名
  tableName?: string
  // 关联的父表ID
  refTableId?: string
  // 关联的父表表名
  refTableName?: string
  // 更新行时外键子表的级联操作
  onUpdate?: IBTableForeignKeHook
  // 删除行时外键子表的级联操作
  onDelete?: IBTableForeignKeHook
  // 是否已删除，逻辑删除标识
  deleted?: boolean
  // 子表的外键列集合
  columns?: IBTableForeignKeyColumn[]
  // 子表的外键列ID集合(非服务器数据，本地转换给选项用)
  columnsIds?: string[]
  // 父(关联)表的外键列集合
  refColumns?: IBTableForeignKeyColumn[]
  // 父(关联)表的外键列ID集合(非服务器数据，本地转换给选项用)
  refColumnsIds?: string[]

  constructor(tableId: string) {
    this.id = snowflake.generate()
    this.tableId = tableId
  }
}

// 表外键操作钩子
const tableForeignKeyHookOptions = [
  { label: 'CASCADE', value: 'CASCADE' },
  { label: 'NO ACTION', value: 'NO ACTION' },
  { label: 'RESTRICT', value: 'RESTRICT' },
  { label: 'SET NULL', value: 'SET NULL' }
] as const
export const IBTableForeignKeyHookOptions = <SelectOption[]>(<unknown>tableForeignKeyHookOptions)
export type IBTableForeignKeHook = (typeof tableForeignKeyHookOptions)[number]['value']

/**
 * 表外键列集合
 */
export class IBTableForeignKeyColumn {
  // 主键ID
  id?: string
  // 所属外键ID
  foreignKeyId?: string
  // 是否为被引用(父)表的列
  isReferenced?: boolean
  // 外键列ID
  columnId!: string
  // 外键列名称
  columnName?: string
  // 外键列的序号
  sequence!: number
  // 是否已删除，逻辑删除标识
  deleted?: boolean
}

/**
 * 表创建最大限制错误
 */
export interface IBTableLimitError {
  current: number
  max: number
  tryCount: number
}
