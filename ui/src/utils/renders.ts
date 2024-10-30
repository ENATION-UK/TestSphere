import { Component, h } from 'vue'
import { NEllipsis, NIcon, SelectOption } from 'naive-ui'

/**
 * 渲染图标
 * @param icon
 * @param props
 */
export const renderIcon = (icon: Component, props?: Record<string, any>) => {
  return () => {
    return h(NIcon, props, { default: () => h(icon) })
  }
}

/**
 * 渲染选项Label，用于超长文字显示提示
 * @param option
 */
export const renderSelectLabel = (option: SelectOption) => {
  return h(NEllipsis, null, { default: () => option.label })
}
