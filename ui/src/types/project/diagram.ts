import { ViewportTransform } from '@vue-flow/core'
import { IBTable, IBTableColumn } from '@/types/project/table'
import { snowflake } from '@/utils'

export type IBDiagramContent = {
  lines?: IBDiagramLine[]
  tables?: IBDiagramTable[]
  flowOptions?: {
    viewport: ViewportTransform
    gridBackground?: boolean
  }
}

/**
 * 关系图
 */
export class IBDiagram {
  // 关系图ID
  id!: string
  // 关系图名称
  name!: string
  // 项目ID
  projectId!: string
  // 分支名称
  branchName!: string
  // 分组ID
  groupId!: string
  // 创建时间
  createTime!: number
  // 内容JSON
  contentJson?: IBDiagramContent

  constructor(diagram?: Partial<IBDiagram>) {
    this.id = diagram?.id || snowflake.generate()
    this.name = diagram?.name || snowflake.generate()
    this.groupId = diagram?.groupId || snowflake.generate()
    this.projectId = diagram?.projectId || snowflake.generate()
    this.branchName = diagram?.branchName || 'main'
    this.createTime = diagram?.createTime || Date.now()
    this.contentJson = diagram?.contentJson
  }
}

/**
 * 关系图中的表
 */
export class IBDiagramTable {
  // ID
  id!: string
  // 在画布中的X轴位置
  x!: number
  // 在画布中的Y轴位置
  y!: number
  // 在画布中的主题色
  theme!: string
  // 表数据
  table!: IBTable

  constructor(diagramTable?: Partial<IBDiagramTable>) {
    this.id = diagramTable?.id || snowflake.generate()
    this.x = diagramTable?.x || 0
    this.y = diagramTable?.y || 0
    if (diagramTable?.table) {
      this.table = diagramTable.table
    }
  }
}

/**
 * 关系图中的连线
 */
export class IBDiagramLine {
  // ID
  id!: string
  // 文本
  text?: string
  // 起点表
  fromTable?: string
  // 起点表位置
  fromTableHandle?: string | null
  // 终点表
  toTable?: string
  // 终点表位置
  toTableHandle?: string | null
  // 起点字段
  fromField?: string
  // 起点字段位置
  fromFieldHandle?: string | null
  // 终点字段
  toField?: string
  // 终点字段位置
  toFieldHandle?: string | null

  constructor(line?: Partial<IBDiagramLine>) {
    this.id = line?.id || snowflake.generate()
  }
}

/**
 * 图表字段的节点数据<br>
 * 添加了左右是否有线连接
 */
export type IBDiagramColumnNodeData = IBTableColumn & {
  leftConnected: boolean
  rightConnected: boolean
}

/**
 * 图表面板模式
 */
export type IBDiagramPanelMode = 'edit' | 'drag'

/**
 * 图表节点数据
 */
export interface IBDiagramNodeData {
  table: IBTable
  theme?: string
}

/**
 * AI聊天渲染表字段消息
 */
export interface IBAiChatTablesMessageItem {
  add: IBTable[]
  remove: string[]
  update: IBTable[]
}

/**
 * AI聊天渲染字段连线消息
 */
export interface IBAiChatLinesMessageItem {
  add: IBDiagramLine[]
  remove: string[]
  update: IBDiagramLine[]
}
