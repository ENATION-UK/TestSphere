import { h } from 'vue'
import DataClass from '@vicons/carbon/DataClass'
import FlowLogsVpc from '@vicons/carbon/FlowLogsVpc'
import FunctionMath from '@vicons/carbon/FunctionMath'
import ModelAlt from '@vicons/carbon/ModelAlt'
import ParentChild from '@vicons/carbon/ParentChild'
import TableBuilt from '@vicons/carbon/TableBuilt'
import ObjectUngroupRegular from '@vicons/fa/ObjectUngroupRegular'
import ColumnEdit24Regular from '@vicons/fluent/ColumnEdit24Regular'
import Copy20Regular from '@vicons/fluent/Copy20Regular'
import Delete24Regular from '@vicons/fluent/Delete24Regular'
import Edit24Regular from '@vicons/fluent/Edit24Regular'
import Rename24Regular from '@vicons/fluent/Rename24Regular'
import TableAdd24Regular from '@vicons/fluent/TableAdd24Regular'
import CodeDownloadOutline from '@vicons/ionicons5/CodeDownloadOutline'
import RefreshOutline from '@vicons/ionicons5/RefreshOutline'
import TrashBinOutline from '@vicons/ionicons5/TrashBinOutline'
import { MenuOption as BaseMenuOption } from 'naive-ui'
import { renderIcon } from './renders'

export type MenuKey =
  | 'new_group'
  | 'new_model'
  | 'new_diagram'
  | 'add_to_diagram'
  | 'new_class'
  | 'new_table'
  | 'add_property'
  | 'add_function'
  | 'to_model'
  | 'to_table'
  | 'to_class'
  | 'to_crud'
  | 'delete_model'
  | 'delete_group'
  | 'delete_class'
  | 'delete_code'
  | 'delete_table'
  | 'divider'
  | 'rename'
  | 'edit'
  | 'copy'
  | 'delete'
  | 'delete_diagram'
  | 'delete_diagram_line'
  | 'edit_group'

export type MenuOption = { key: string } & BaseMenuOption

export const divider: MenuOption = { type: 'divider', key: 'divider' }
// 重命名
export const rename: MenuOption = {
  label: () => window.$t('context_menus.rename'),
  key: 'rename',
  icon: renderIcon(Rename24Regular)
}
// 修改
export const edit: MenuOption = {
  label: () => window.$t('context_menus.edit'),
  key: 'edit',
  icon: renderIcon(Edit24Regular)
}
// 复制
export const copy: MenuOption = {
  label: () => window.$t('context_menus.copy'),
  key: 'copy',
  icon: renderIcon(Copy20Regular)
}
// 删除
export const del: MenuOption = {
  label: () => h('span', { style: 'color: var(--error-color)' }, { default: () => window.$t('context_menus.delete') }),
  key: 'delete',
  icon: renderIcon(Delete24Regular, { color: 'var(--error-color)' })
}
// 刷新
export const refresh: MenuOption = {
  label: () => window.$t('context_menus.refresh'),
  key: 'refresh',
  icon: renderIcon(RefreshOutline)
}
// 新建模块
export const newModule: MenuOption = {
  label: () => window.$t('new_group'),
  key: 'new_group',
  icon: renderIcon(ObjectUngroupRegular)
}
// 新建模型
export const newModel: MenuOption = {
  label: () => window.$t('new_model'),
  key: 'new_model',
  icon: renderIcon(ModelAlt)
}
// 新建关系图
export const newDiagram: MenuOption = {
  label: () => window.$t('new_diagram'),
  key: 'new_diagram',
  icon: renderIcon(FlowLogsVpc)
}
// 新建类图
export const newClass: MenuOption = {
  label: () => window.$t('new_class'),
  key: 'new_class',
  icon: renderIcon(DataClass)
}
// 新建属性
export const addProperty: MenuOption = {
  label: () => window.$t('add_property'),
  key: 'add_property',
  icon: renderIcon(ParentChild)
}
// 添加方法
export const addFunction: MenuOption = {
  label: () => window.$t('add_function'),
  key: 'add_function',
  icon: renderIcon(FunctionMath)
}
// 删除模型
export const deleteModel: MenuOption = {
  label: () => window.$t('delete_model'),
  key: 'delete_model',
  icon: renderIcon(TrashBinOutline)
}
// 删除模块
export const deleteGroup: MenuOption = {
  label: () => window.$t('delete'),
  key: 'delete_group',
  icon: renderIcon(TrashBinOutline)
}
// 转类图
export const toClass: MenuOption = {
  label: () => window.$t('to_class'),
  key: 'to_class',
  icon: renderIcon(DataClass)
}
// 转表
export const toTable: MenuOption = {
  label: () => window.$t('to_table'),
  key: 'to_table',
  icon: renderIcon(TableBuilt)
}
// 转CRUD
export const toCRUD: MenuOption = {
  label: () => window.$t('to_crud'),
  key: 'to_crud',
  icon: renderIcon(CodeDownloadOutline)
}
// 添加到关系图
export const addToDiagram: MenuOption = {
  label: () => window.$t('add_to_diagram'),
  key: 'add_to_diagram',
  icon: renderIcon(ModelAlt)
}

// 删除关系图
export const deleteDiagram: MenuOption = {
  label: () => window.$t('delete_diagram'),
  key: 'delete_diagram',
  icon: renderIcon(Delete24Regular)
}

// 删除关系图连线
export const deleteDiagramLine: MenuOption = {
  label: () => window.$t('delete_diagram_line'),
  key: 'delete_diagram_line',
  icon: renderIcon(Delete24Regular)
}

// 新建表
export const newTable: MenuOption = {
  label: () => window.$t('tables.new_table'),
  key: 'new_table',
  icon: renderIcon(TableAdd24Regular)
}

// 新建表
export const newTableAi: MenuOption = {
  label: () => window.$t('tables.new_table') + '(AI)',
  key: 'new_table_ai',
  icon: renderIcon(TableAdd24Regular)
}

// 删除表
export const deleteTable: MenuOption = {
  label: () => window.$t('tables.delete_table'),
  key: 'delete_table',
  icon: renderIcon(Delete24Regular)
}

// 修改分组
export const editGroup: MenuOption = {
  label: () => window.$t('edit_group'),
  key: 'edit_group',
  icon: renderIcon(ColumnEdit24Regular)
}

export function showMenus(menus: MenuOption[], e: MouseEvent): Promise<MenuKey> {
  return new Promise((resolve, reject) => {
    window.$AppDropdown.options = menus
    window.$AppDropdown.select = (key) => {
      resolve(key)
    }
    window.$AppDropdown.handleContextMenu(e)
  })
}

export default {
  divider,
  rename,
  edit,
  copy,
  del,
  newModel,
  newDiagram,
  addToDiagram,
  deleteModel,
  newModule,
  deleteGroup,
  deleteDiagram,
  deleteDiagramLine,
  newClass,
  addProperty,
  addFunction,
  toClass,
  toTable,
  toCRUD,
  newTable,
  newTableAi,
  deleteTable,
  editGroup
}
