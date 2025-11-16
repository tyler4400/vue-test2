## 演示项目：Vue 组件二次封装（方法论示例）

- 技术：Vite + Vue 3 + TypeScript + Vue Router + ESLint 9（Flat）+ Prettier
- 目的：仅演示“二次封装”的方法与套路，不引入任何 UI 组件库与样式体系
- 引用教程：[bilibili 教程视频](https://www.bilibili.com/video/BV1bDe1z1Eyr/?vd_source=8490ae2460d3fec56789734a0e0139a4)

### 使用

```bash
pnpm install
pnpm dev
```

访问路由 `/`（默认即为此页），查看“Demo 索引”。点击任意条目进入对应 demo（如 `/demos/second-wrap`）。

### 目录结构（关键）

- `src/components/demo/SubItem.vue`：简单子项，暴露 `focus()`，用于承接透传属性与事件
- `src/components/demo/SecondWrap.vue`：二次封装示例骨架
  - 受控数据：`modelValue` + `update:modelValue` + `change`
  - 透传：`inheritAttrs: false` + 选择性 `v-bind="passThroughAttrs"`
  - 插槽：`header` / `default` / `footer`，并提供 slot props
  - 实例方法：`defineExpose({ focus })`
- `src/demos/`：所有 demo
  - `src/demos/second-wrap/Demo.vue`：迁移后的“二次封装方法论演示”
  - `src/demos/second-wrap/meta.ts`：该 demo 元信息（标题/分组/关键词）
  - `src/demos/types.ts`：Demo 元信息类型定义
  - `src/demos/registry.ts`：自动收集 `meta.ts` 并生成路由与索引数据
- `src/views/Home.vue`：首页索引（分组/搜索/跳转）
- `src/router/index.ts`：基础路由 + 自动注册的 demo 路由
- `vite.config.ts`：注册 Vue 插件

### 脚本

```bash
pnpm lint       # ESLint（Flat）
pnpm format     # Prettier
pnpm typecheck  # vue-tsc 类型检查
```

### 说明

本示例代码强调“方法论”，不包含可直接投产的组件。你可以以此为骨架，在真实项目中面向具体 UI 体系与交互要求进行扩展。
