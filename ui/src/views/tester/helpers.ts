import type { SelectOption } from 'naive-ui'
import { IBTesterStatus, IBTesterStatusMap } from '@/types/tester'

/**
 * 屏幕分辨率选项
 */
export const screenResolutionOptions: SelectOption[] = [
  { label: '1920x1080', value: '1920x1080' },
  { label: '1440x900', value: '1440x900' },
  { label: '1366x768', value: '1366x768' },
  { label: '1280x1024', value: '1280x1024' },
  { label: '1280x800', value: '1280x800' },
  { label: '1024x768', value: '1024x768' }
]

/**
 * 格式化测试用例状态
 * @param status
 * @param simple
 * @param place
 */
export const formatTesterStatus = (status: IBTesterStatus, simple?: boolean, place?: string): string => {
  if (!status && !place) return ''
  let key = status ? IBTesterStatusMap[status] : place
  if (simple) {
    if (key === 'tester.test_passed') key = 'passed'
    if (key === 'tester.test_failed') key = 'failed'
    if (key === 'tester.run_error') key = 'exception'
    if (key === 'tester.terminated') key = 'terminated'
  }
  return key ? window.$t(key) : ''
}

/**
 * 根据状态获取颜色
 * @param status
 */
export const getTesterStatusColor = (status: IBTesterStatus) => {
  if (!status) return ''
  switch (status) {
    case 'success':
      return '#6cb015'
    case 'running':
      return '#1b73f8'
    case 'queued':
      return '#e88210'
    case 'failed':
    case 'error':
      return '#e6000f'
    case 'terminated':
      return '#3a4250'
    default:
      return ''
  }
}
