import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import { IBConfig } from '@/config'
import EmptyRouterView from '@/views/EmptyRouterView.vue'
import { handleBeforeEach } from './beforeEach'
import testerRouters from './tester'

const baseUrl = import.meta.env.VITE_APP_ALIAS
const history = createWebHistory(baseUrl)

export const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'workbench',
    component: () => import('@/views/workbench/index.vue'),
    // redirect: { name: IBConfig.APP_CHINA ? 'dbDesigner' : 'tester' },
    children: [
      {
        path: 'projects',
        name: 'projects',
        redirect: { name: 'testerProjects' }
      },
      {
        path: 'tester',
        name: 'tester',
        redirect: '/tester/projects'
      },
      {
        path: 'tester/projects',
        name: 'testerProjects',
        component: () => import('@/views/tester/projects.vue')
      }

    ]
  },
  {
    path: '/login',
    name: 'passport',
    component: () => import('@/views/auth/index.vue'),
    redirect: '/login',
    children: [
      {
        path: '',
        name: 'login',
        component: () => import('@/views/auth/login.vue')
      }
    ]
  },
  ...testerRouters
]

const router = createRouter({ history, routes })
handleBeforeEach(router)

export default router
