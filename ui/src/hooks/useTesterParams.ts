import { reactive } from 'vue'

const params = reactive<Record<'projectId' | 'caseId', string>>({
  projectId: '',
  caseId: ''
})

// @ts-ignore
window.$testerParams = params

export function useTesterParams() {
  let projectId = ''
  let caseId = ''
  const href = window.location.href
  const ps = href.match(/tester\/projects\/(.*?)\//)
  if (ps && ps[1]) projectId = ps[1]
  const gs = href.match(/\/case\/(.+)/)
  if (gs && gs[1]) caseId = gs[1]
  params.projectId = projectId
  params.caseId = caseId
  return params
}
