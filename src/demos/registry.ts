import type { RouteRecordRaw } from 'vue-router'
import type { DemoMeta } from './types'

// 读取所有 meta（eager），用于生成索引与路由
const metaModules = import.meta.glob('./**/meta.ts', { eager: true })
// 读取所有 Demo.vue（lazy），用于路由懒加载
const viewModules = import.meta.glob('./**/Demo.vue')

const isEnabled = (m: Partial<DemoMeta> | undefined) => m && m.enabled !== false

const demos: DemoMeta[] = Object.values(metaModules)
  .map(m => (m as any).default as DemoMeta)
  .filter(isEnabled)
  .sort((a, b) => {
    const ga = a.group ?? ''
    const gb = b.group ?? ''
    if (ga !== gb) return ga.localeCompare(gb)
    const oa = a.order ?? 0
    const ob = b.order ?? 0
    if (oa !== ob) return oa - ob
    return a.title.localeCompare(b.title)
  })

export const demoList: DemoMeta[] = demos

export const demoRoutes: RouteRecordRaw[] = demos.map(meta => {
  const key = `./${meta.slug}/Demo.vue`
  const loader = (viewModules as Record<string, any>)[key]
  return {
    path: `${meta.slug}`,
    name: meta.slug,
    component: loader,
    meta,
  }
})
