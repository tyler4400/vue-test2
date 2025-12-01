// 输入组件相关类型定义，集中在此文件统一导出，避免在组件内部直接声明类型。

export type InputSize = 'large' | 'small'

export type InputValue = string | number

// 对外暴露的 props 接口
export interface InputProps {
  type?: string
  modalValue?: InputValue
  size?: InputSize
  disabled?: boolean
  // 是否可以清除输入内容
  clearable?: boolean
  showPassword?: boolean
  placeholder?: string
  readonly?: boolean
  autocomplete?: string
  autofocus?: boolean
  form?: string
}

// 对外暴露的 emits 接口
export interface InputEmits {
  (e: 'update:modalValue', value: InputValue): void
  // input 事件：值有变化就触发
  (e: 'input', value: InputValue): void
  // change 事件：值变化并失去焦点时触发
  (e: 'change', value: InputValue): void
  (e: 'focus', value: FocusEvent): void
  (e: 'blur', value: FocusEvent): void
  (e: 'clear'): void
}

// 对外暴露的实例类型，用于父组件通过 ref 访问真实的输入元素
export interface InputInstance {
  ref: HTMLInputElement | HTMLTextAreaElement | null
}

// 对外暴露的插槽类型，方便在 TS 中获得良好的提示与约束
export interface InputSlots {
  // 前缀插槽，一般用于图标或说明文字
  prefix?: () => unknown
  // 后缀插槽，一般用于图标、单位或操作区域
  suffix?: () => unknown
}
