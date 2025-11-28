import type { RouteRecordRaw } from 'vue-router'
import type { DemoMeta, Meta } from './types'

// 读取所有 meta（eager），用于生成索引与路由
const metaModules: Record<string, DemoMeta> = import.meta.glob('./**/meta.ts', { eager: true, import: 'default' })
console.log('demoMeta配置', metaModules)

function handleKey(key: string) {
  return 'second-wrap'
}

export const demoList: Meta[] = Object.entries(metaModules)
  .map(([key, meta]) => {
    const folder = handleKey(key)
    const routerPath = meta.routerPath ?? folder
    return {
      ...meta,
      folder,
      routerPath,
      disabled: meta.disabled ?? false,
    } as Meta
  })
  .filter(meta => !meta.disabled)
  .sort((a, b) => {
    const ga = a.group ?? ''
    const gb = b.group ?? ''
    if (ga !== gb) return ga.localeCompare(gb)
    const oa = a.order ?? 0
    const ob = b.order ?? 0
    if (oa !== ob) return oa - ob
    return a.title.localeCompare(b.title)
  })

// 读取所有 Demo.vue（lazy），用于路由懒加载
const viewModules = import.meta.glob('./**/index.ts')
console.log('所有demo模块：', viewModules)

export const demoRoutes: RouteRecordRaw[] = demoList.map(meta => {
  const key = `./second-wrap/index.ts`
  const loader = (viewModules as Record<string, any>)[key]
  return {
    path: `${meta.routerPath}`,
    name: meta.folder,
    component: loader as RouteRecordRaw['component'],
    meta,
  } as RouteRecordRaw
})
console.log('registry.ts--demoRoutes: ', demoRoutes)
