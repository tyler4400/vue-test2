export interface DemoMeta {
  routerPath?: string // 没有就以文件夹名称为路由
  title: string
  group?: string
  order?: number
  description?: string
  keywords?: string[]
  disabled?: boolean
  hideLayoutHeader?: boolean
}

export interface Meta extends DemoMeta {
  folder: string // 文件夹名称
  routerPath: string
}
