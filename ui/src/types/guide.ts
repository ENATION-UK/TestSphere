export type IBGuideKey = string

export interface IBGuide {
  key: IBGuideKey
  steps: IBGuideStep[]
}

export interface IBGuideStep {
  // 标题
  title: string
  // 内容
  content: string
  // 元素定位
  selector: string
  // 偏移量
  offset?: { x?: number; y?: number }
  // popup显示位置
  placement:
    | 'top-start'
    | 'top'
    | 'top-end'
    | 'right-start'
    | 'right'
    | 'right-end'
    | 'bottom-start'
    | 'bottom'
    | 'bottom-end'
    | 'left-start'
    | 'left'
    | 'left-end'
  // 图片列表
  images?: any[]
  // 提示
  tip?: string
  // 提示链接
  tipUrl?: string
  // 执行钩子
  beforeShow?: () => void
  afterShow?: () => void
}
