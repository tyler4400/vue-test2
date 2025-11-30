// 输入组件统一出口：导出组件、类型，并引入样式文件

import type { App } from 'vue'
import FancyInputVue from './FancyInput.vue'
import './input.css'

export * from './types'

export const FancyInput = FancyInputVue

// 可选的全局注册方法，供按需安装使用
export const installFancyInput = (app: App) => {
  app.component('FancyInput', FancyInputVue)
}

export default FancyInputVue
