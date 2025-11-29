import type { RouteRecordSingleView } from 'vue-router'
import type { DemoMeta, Meta } from './types'

/**
 * 读取所有 meta（eager），用于生成索引与路由
 *
 * import.meta.glob
 * 只是一个 Vite 独有的功能而不是一个 Web 或 ES 标准
 *
 * const modules = import.meta.glob('./dir/*.js')
 * 会生成的代码
 * const modules = {
 *   './dir/bar.js': () => import('./dir/bar.js'),
 *   './dir/foo.js': () => import('./dir/foo.js')
 * }
 *
 * 加入eager选项：const modules = import.meta.glob('./dir/*.js', { eager: true })
 * import * as __vite_glob_0_0 from './dir/bar.js'
 * import * as __vite_glob_0_1 from './dir/foo.js'
 * const modules = {
 *   './dir/bar.js': __vite_glob_0_0,
 *   './dir/foo.js': __vite_glob_0_1
 * }
 */
const metaModules: Record<string, DemoMeta> = import.meta.glob('./**/meta.ts', { eager: true, import: 'default' })
console.log('demoMeta配置', metaModules)

/**
 * 从 import.meta.glob 生成的路径中提取目录名
 * 例如：'./second-wrap/meta.ts' -> 'second-wrap'
 */
const handleKey = (key: string): string => {
  // 使用正则匹配固定格式：./folderName/meta.ts
  // 若匹配成功则返回 folderName，未匹配时返回原始 key
  return key.replace(/^\.\/([^/]+)\/meta\.ts$/, '$1')
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
const viewModules = import.meta.glob('./**/index.ts') as Record<string, RouteRecordSingleView['component']>
console.log('所有demo模块：', viewModules)

export const demoRoutes: RouteRecordSingleView[] = demoList.map(meta => {
  const key = `./${meta.folder}/index.ts`
  const loader = viewModules[key]
  return {
    path: `${meta.routerPath}`,
    name: meta.folder,
    component: loader,
    meta,
  }
})
console.log('registry.ts--demoRoutes: ', demoRoutes)
