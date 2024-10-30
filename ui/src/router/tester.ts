import { RouteRecordRaw } from 'vue-router'

export default [
  {
    path: '/tester/projects/:id',
    name: 'testerProjectDetail',
    component: () => import('@/views/tester/index.vue'),
    redirect: { name: 'testerOverview' },
    children: [
      {
        path: 'overview',
        name: 'testerOverview',
        component: () => import('@/views/tester/overview/overview.vue')
      },
      {
        path: 'case',
        name: 'testerCase',
        component: () => import('@/views/tester/case/index.vue'),
        redirect: { name: 'testerCaseList' },
        children: [
          {
            path: '',
            name: 'testerCaseList',
            component: () => import('@/views/tester/case/list/list.vue')
          },
          {
            path: ':caseId',
            name: 'testerCaseDetail',
            component: () => import('@/views/tester/case/detail/detail.vue')
          }
        ]
      },
      {
        path: 'history',
        name: 'testerHistory',
        component: () => import('@/views/tester/history/index.vue'),
        redirect: { name: 'testerHistoryList' },
        children: [
          {
            path: '',
            name: 'testerHistoryList',
            component: () => import('@/views/tester/history/history.vue')
          },
          {
            path: ':historyId',
            name: 'testerHistoryDetail',
            component: () => import('@/views/tester/history/detail.vue')
          }
        ]
      },
      {
        path: 'task',
        name: 'testerTask',
        component: () => import('@/views/tester/task/task.vue')
      },
      {
        path: 'report',
        name: 'testerReport',
        component: () => import('@/views/tester/report/report.vue')
      },
      {
        path: 'settings',
        name: 'testerSettings',
        component: () => import('@/views/tester/settings/settings.vue')
      }
    ]
  }
] as RouteRecordRaw[]
