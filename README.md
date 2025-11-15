## 演示项目：Vue 组件二次封装（方法论示例）

- 技术：Vite + Vue 3 + TypeScript + Vue Router + ESLint 9（Flat）+ Prettier
- 目的：仅演示“二次封装”的方法与套路，不引入任何 UI 组件库与样式体系
- 引用教程：[bilibili 教程视频](https://www.bilibili.com/video/BV1bDe1z1Eyr/?vd_source=8490ae2460d3fec56789734a0e0139a4)

### 使用

```bash
pnpm install
pnpm dev
```

访问路由 `/`（默认即为此页），查看 `DemoSecondWrap` 页面。

### 目录结构（关键）

- `src/components/demo/SubItem.vue`：简单子项，暴露 `focus()`，用于承接透传属性与事件
- `src/components/demo/SecondWrap.vue`：二次封装示例骨架
  - 受控数据：`modelValue` + `update:modelValue` + `change`
  - 透传：`inheritAttrs: false` + 选择性 `v-bind="passThroughAttrs"`
  - 插槽：`header` / `default` / `footer`，并提供 slot props
  - 实例方法：`defineExpose({ focus })`
- `src/views/DemoSecondWrap.vue`：演示页面（v-model、插槽、命令式聚焦）
- `src/router/index.ts`：基础路由
- `vite.config.ts`：注册 Vue 插件

### 脚本

```bash
pnpm lint       # ESLint（Flat）
pnpm format     # Prettier
pnpm typecheck  # vue-tsc 类型检查
```

### 说明

本示例代码强调“方法论”，不包含可直接投产的组件。你可以以此为骨架，在真实项目中面向具体 UI 体系与交互要求进行扩展。 


