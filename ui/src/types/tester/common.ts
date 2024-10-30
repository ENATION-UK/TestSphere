export interface IBTesterSocketMessage<MT = string, T = Record<string, any>> {
  userId: string
  runRecordId: string
  messageType: MT
  data: T
}

export const IBTesterStatusMap = {
  all: 'all',
  pending: 'tester.wait_test',
  queued: 'tester.queued',
  running: 'tester.running',
  success: 'tester.test_passed',
  failed: 'tester.test_failed',
  error: 'tester.run_error',
  completed: 'completed',
  terminated: 'tester.terminated',
  starting: 'starting'
}
export type IBTesterStatus = keyof typeof IBTesterStatusMap

export const IBTesterStatusMapOptions = Object.keys(IBTesterStatusMap)
  .filter((key) => !['pending', 'completed', 'starting'].includes(key))
  .map((key) => ({
    label: window.$t(IBTesterStatusMap[key]),
    value: key
  }))
