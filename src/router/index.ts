import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'
import { demoRoutes } from '../demos/registry'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'home',
    component: () => import('../views/Home.vue'),
  },
  {
    path: '/demos',
    component: () => import('../layouts/DemosLayout.vue'),
    children: [{ path: '', redirect: '/' }, ...demoRoutes],
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

export default router
