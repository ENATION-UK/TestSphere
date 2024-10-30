import { defineAsyncComponent, h, toRaw } from 'vue'
import Folder from '@vicons/ionicons5/Folder'
import FolderOpenOutline from '@vicons/ionicons5/FolderOpenOutline'
import { NIcon, SelectOption, TreeOption } from 'naive-ui'
import { IBCase, IBCaseGroup, IBCaseStep } from '@/types/tester'
import { useCasesStore, useRecordStore } from '@/store/tester'

export const updatePrefixWithExpand = (
  _keys: Array<string | number>,
  _option: Array<TreeOption | null>,
  meta: {
    node: TreeOption | null
    action: 'expand' | 'collapse' | 'filter'
  }
) => {
  useCasesStore().caseExpandedKeys = _keys as string[]
  if (!meta.node) return
  if (meta.action === 'expand') {
    meta.node.prefix = () => h(NIcon, null, { default: () => h(FolderOpenOutline) })
  } else if (meta.action === 'collapse') {
    meta.node.prefix = () => h(NIcon, null, { default: () => h(Folder) })
  }
}

export const groupAll = {
  key: 'all',
  label: window.$t('all'),
  prefix: () => h(NIcon, null, { default: () => h(Folder) })
}
export const mapGroupTree = (items?: IBCaseGroup[]): TreeOption[] => {
  if (!items || !items.length) return []
  return items.map((item) => {
    return {
      key: item.id,
      label: item.name,
      prefix: () => h(NIcon, null, { default: () => h(Folder) }),
      group: item,
      children: mapGroupTree(item.children)
    }
  })
}

export const formatCaseStepForRun = (steps: Record<string, any>[]) => {
  steps = toRaw(steps)
  return steps.map((item) => {
    item.type = item.actionType
    item.params = {
      xpath: item.actionTarget,
      value: item.actionValue
    }
    return item
  })
}

// 步骤类型
export const stepTypes: SelectOption[] = [
  { label: window.$t('tester.step'), value: 'step' },
  { label: window.$t('tester.case'), value: 'test_case' },
  { label: window.$t('tester.variable'), value: 'variable' },
  { label: window.$t('tester.validate'), value: 'check' }
]

// 操作类型
export const actionTypes: SelectOption[] = [
  { label: window.$t('tester.click_ele'), value: 'UI_CLICK' },
  { label: window.$t('tester.input_text'), value: 'UI_INPUT' },
  { label: window.$t('tester.exe_js'), value: 'JAVASCRIPT' },
  { label: window.$t('tester.open_url'), value: 'OPEN_URL' },
  { label: window.$t('tester.browser_storage'), value: 'BROWSER_STORAGE' },
  { label: window.$t('tester.mouse_hover'), value: 'UI_HOVER' },
  { label: window.$t('tester.keyboard_enter'), value: 'UI_KEY' },
  { label: window.$t('tester.ele_scroll'), value: 'UI_SCROLL' },
  // { label: window.$t('tester.file_upload'), value: 'UI_FILE' },
  { label: window.$t('tester.select'), value: 'UI_SELECT' },
  { label: window.$t('tester.other_change'), value: 'UI_CHANGE' },
  { label: window.$t('tester.close_tab'), value: 'TAB_CLOSE' }
]

// 数据纯纯类型
export const storageTypes: SelectOption[] = [
  { label: 'cookie', value: 'Cookie' },
  { label: 'localStorage', value: 'LocalStorage' },
  { label: 'sessionStorage', value: 'SessionStorage' }
]

// 变量类型
export const variableTypes: SelectOption[] = [
  { label: window.$t('tester.datetime'), value: 'DateTime' },
  { label: window.$t('tester.random'), value: 'Random' },
  { label: window.$t('tester.javascript'), value: 'Javascript' }
]

// 校验类型
export const validateTypes: SelectOption[] = [
  { label: window.$t('tester.text_visible'), value: 'TextVisible' },
  { label: window.$t('tester.ele_visible'), value: 'ElementVisible' },
  { label: window.$t('tester.ele_attr_contrast'), value: 'ElementAttribute' }
]

// 时间格式
export const dateFormatterTypes: SelectOption[] = [
  { label: window.$t('tester.timestamp_ms'), value: 'timestamp(ms)' },
  { label: window.$t('tester.timestamp_s'), value: 'timestamp(s)' },
  { label: 'YYYY', value: 'YYYY' },
  { label: 'YYYY-MM', value: 'yyyy-MM' },
  { label: 'YYYY-MM-DD', value: 'YYYY-MM-DD' },
  { label: 'YYYY-MM-DD HH', value: 'YYYY-MM-DD HH' },
  { label: 'YYYY-MM-DD HH:mm', value: 'YYYY-MM-DD HH:mm' },
  { label: 'YYYY-MM-DD HH:mm:ss', value: 'YYYY-MM-DD HH:mm:ss' }
]

// 时间差值类型
export const differenceTypes: SelectOption[] = [
  { label: window.$t('tester.milliseconds'), value: 'ms' },
  { label: window.$t('tester.seconds'), value: 's' },
  { label: window.$t('tester.minutes'), value: 'm' },
  { label: window.$t('tester.hours'), value: 'h' },
  { label: window.$t('tester.day'), value: 'd' },
  { label: window.$t('tester.week'), value: 'w' },
  { label: window.$t('tester.month'), value: 'M' },
  { label: window.$t('tester.year'), value: 'y' }
]

// 随机类型
export const randomTypes: SelectOption[] = [
  { label: window.$t('tester.var_random_email'), value: 'email' },
  { label: window.$t('tester.phone'), value: 'phone' },
  { label: window.$t('tester.number_only'), value: 'number' },
  { label: window.$t('tester.letters_only'), value: 'letter' },
  { label: window.$t('tester.strings'), value: 'string' }
]

// 获取最大步骤数
export const getMaxStepNumber = (steps: IBCaseStep[]): number => {
  return Math.max(...steps.map((item) => item.stepNumber))
}

// 是否是录制步骤
export const isRecordStep = (stepId: string) => {
  return !!useRecordStore().steps.find((item) => item.id === stepId)
}

// 是否为打开浏览器步骤
export const isOpenBrowser = (stepList: IBCaseStep[], index: number) => {
  return stepList.findIndex((s) => s.actionType === 'OPEN_URL') === index
}

/**
 * 远程运行次数到达限制
 * @param e
 */
export const runCaseCountLimit = (e: { code: string; message: string }) => {
  if (!['MONTHLY_LIMIT_ERROR', 'CONCURRENT_LIMIT_ERROR', 'REQUIRE_HIGHER_PLAN'].includes(e.code)) {
    if (e.message) window.$dialog.error(e.message)
    return
  }
  const title =
    e.code === 'REQUIRE_HIGHER_PLAN' ? window.$t('tester.please_upgrade_plan') : window.$t('tester.run_count_limit')
  const CaseRunLimitModal = defineAsyncComponent(() => import('./CaseRunLimitModal.vue'))
  const dialog = window.$dialog.create({
    title,
    type: 'warning',
    autoFocus: false,
    maskClosable: false,
    closeOnEsc: false,
    transformOrigin: 'center',
    negativeText: '',
    style: 'width: 420px',
    content: () => h(CaseRunLimitModal, { data: e, dialog })
  })
}

/**
 * ActionLabel
 * @param actionType
 */
export const getActionLabel = (actionType: string) => {
  switch (actionType) {
    case 'UI_INPUT':
      return window.$t('tester.input_val')
    case 'UI_SELECT':
      return window.$t('tester.select_val')
    case 'OPEN_URL':
      return window.$t('tester.url')
    case 'BROWSER_STORAGE':
      return window.$t('tester.browser_storage')
    case 'UI_SCROLL':
      return window.$t('tester.location_x_y')
    case 'STEP_CHECK':
      return window.$t('tester.assert')
    case 'JAVASCRIPT':
      return window.$t('tester.script_val')
    default:
      return window.$t('tester.step_action_value')
  }
}

/**
 * 查看用例运行历史
 * @param c
 */
export const viewCaseHistoryModal = (c: IBCase) => {
  const CaseHistoryModal = defineAsyncComponent(() => import('./CaseHistoryModal.vue'))
  const dialog = window.$dialog.create({
    title: window.$t('tester.view_run_history'),
    type: 'warning',
    autoFocus: false,
    showIcon: false,
    transformOrigin: 'center',
    negativeText: '',
    style: 'width: 800px',
    content: () => h(CaseHistoryModal, { case: c, dialog })
  })
}
