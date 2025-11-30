<template>
  <!--
    外层容器：负责整体布局和边框样式
    - wrapperClass 负责组件自身的基础样式（大小、禁用态等）
    - attrsClass / attrsStyle 来自外部传入的 class / style
  -->
  <div :class="[wrapperClass, attrsClass]" :style="attrsStyle" :data-disabled="props.disabled || undefined">
    <!-- 前缀插槽：常用于放图标或文字前缀 -->
    <span v-if="$slots.prefix" class="fancy-input__prefix">
      <slot name="prefix" />
    </span>

    <!--
      真实 input 元素：
      - 所有与可访问性相关的属性（如 aria-*）通过 inputAttrs 透传
      - 值采用受控方式，由 displayValue 统一管理
    -->
    <input
      ref="inputElementRef"
      class="fancy-input__control"
      :type="computedInputType"
      :value="displayValue"
      :placeholder="props.placeholder"
      :disabled="props.disabled"
      :readonly="props.readonly"
      :autocomplete="props.autocomplete"
      :autofocus="props.autofocus"
      :form="props.form"
      v-bind="inputAttrs"
      @input="handleInput"
      @change="handleChange"
      @focus="handleFocus"
      @blur="handleBlur"
    />

    <!-- 清除按钮：在允许清除且有值时展示 -->
    <button
      v-if="props.clearable && !props.disabled && hasValue"
      type="button"
      class="fancy-input__clear"
      aria-label="清除输入内容"
      @click="handleClear"
    >
      ✕
    </button>

    <!-- 密码可见性切换按钮：仅在 type=password 且 showPassword 时展示 -->
    <button
      v-if="isPasswordToggleVisible"
      type="button"
      class="fancy-input__password-toggle"
      :aria-pressed="isPasswordVisible ? 'true' : 'false'"
      aria-label="切换密码可见性"
      @click="handleTogglePasswordVisible"
    >
      {{ isPasswordVisible ? '隐藏' : '显示' }}
    </button>

    <!-- 后缀插槽：常用于放图标或单位等 -->
    <span v-if="$slots.suffix" class="fancy-input__suffix">
      <slot name="suffix" />
    </span>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, useAttrs, watch } from 'vue'
import type { StyleValue } from 'vue'
import type { InputEmits, InputInstance, InputProps, InputSlots, InputValue } from './types'

// 禁用默认的属性继承行为，改为手动控制根元素与 input 上的属性分发
defineOptions({
  inheritAttrs: false,
})

// 声明对外暴露的插槽类型，方便在 TS / 模板中获得完善的提示
defineSlots<InputSlots>()

// 使用 withDefaults 为部分 props 提供默认值
const props = withDefaults(defineProps<InputProps>(), {
  type: 'text',
  size: 'large',
  disabled: false,
  clearable: false,
  showPassword: false,
  placeholder: '',
  readonly: false,
  autocomplete: 'off',
  autofocus: false,
})

const emit = defineEmits<InputEmits>()

// 真实的输入元素引用，便于在清除或切换密码可见性后重新聚焦
const inputElementRef = ref<HTMLInputElement | HTMLTextAreaElement | null>(null)

// 内部受控值，默认与外部的 modalValue 同步
const innerValue = ref<InputValue>(props.modalValue ?? '')

// 监听外部 modalValue 的变化，保持内部状态同步
watch(
  () => props.modalValue,
  nextValue => {
    if (nextValue === undefined || nextValue === null) {
      innerValue.value = ''
      return
    }
    innerValue.value = nextValue
  },
)

// 将原始字符串根据当前 type 转换为合适的值类型（text 使用 string，number 尝试转为 number）
const parseValue = (raw: string): InputValue => {
  if (props.type === 'number') {
    const numeric = Number(raw)
    if (Number.isNaN(numeric)) {
      // 若无法解析为合法数字，则退回到原始字符串，避免产生 NaN
      return raw
    }
    return numeric
  }

  return raw
}

// 对外展示 / 绑定到 input 上的值统一转换为字符串
const displayValue = computed(() => {
  if (innerValue.value === undefined || innerValue.value === null) {
    return ''
  }
  return String(innerValue.value)
})

// 当前是否存在非空值，用于控制清除按钮的显示
const hasValue = computed(() => displayValue.value.length > 0)

// 密码可见性状态，仅在 type=password 且 showPassword 为 true 时生效
const isPasswordVisible = ref(false)

// 是否需要展示密码可见性切换按钮
const isPasswordToggleVisible = computed(() => props.type === 'password' && props.showPassword && !props.disabled)

// 根据当前配置计算真正作用在 input 上的 type
const computedInputType = computed(() => {
  if (props.type === 'password' && props.showPassword) {
    return isPasswordVisible.value ? 'text' : 'password'
  }
  return props.type ?? 'text'
})

// 外层容器的基础样式 class 组合
const wrapperClass = computed(() => {
  return [
    'fancy-input',
    props.size === 'small' ? 'fancy-input--small' : 'fancy-input--large',
    props.disabled ? 'fancy-input--disabled' : '',
  ].filter(Boolean) as string[]
})

// 处理从父组件透传下来的属性：
// - class / style 作用到外层容器
// - 其余（如 aria-*、id 等）透传到真实 input 元素，以获得更好的可访问性
const attrs = useAttrs()

// 外部 class：限制为 Vue 支持的几种 class 形式，避免 unknown 影响模板类型检查
const attrsClass = computed(() => {
  return attrs.class as string | string[] | Record<string, boolean> | undefined
})

// 外部 style：显式标注为 StyleValue，避免 unknown 与 HTMLAttributes 冲突
const attrsStyle = computed<StyleValue | undefined>(() => {
  return attrs.style as StyleValue | undefined
})

// 其余属性（如 aria-* / id 等）透传到 input 元素
const inputAttrs = computed(() => {
  const { class: _class, style: _style, type: _type, value: _value, ...rest } = attrs
  return rest
})

// 处理 input 的 input 事件：值变化即时触发
const handleInput = (event: Event) => {
  const target = event.target as HTMLInputElement | HTMLTextAreaElement | null
  if (!target) {
    return
  }

  const nextValue = parseValue(target.value)
  innerValue.value = nextValue

  emit('update:modalValue', nextValue)
  emit('input', nextValue)
}

// 处理 change 事件：当值变化并失去焦点时触发
const handleChange = (event: Event) => {
  const target = event.target as HTMLInputElement | HTMLTextAreaElement | null
  if (!target) {
    return
  }

  const nextValue = parseValue(target.value)
  emit('change', nextValue)
}

// 处理 focus / blur，原样透传事件对象
const handleFocus = (event: FocusEvent) => {
  emit('focus', event)
}

const handleBlur = (event: FocusEvent) => {
  emit('blur', event)
}

// 处理清除：重置为 ''，并统一触发 update:modalValue / input / change / clear
const handleClear = () => {
  if (props.disabled || props.readonly) {
    return
  }

  innerValue.value = ''

  emit('update:modalValue', '')
  emit('input', '')
  emit('change', '')
  emit('clear')

  if (inputElementRef.value) {
    inputElementRef.value.focus()
  }
}

// 切换密码可见性，并保持焦点在输入框上
const handleTogglePasswordVisible = () => {
  if (!isPasswordToggleVisible.value) {
    return
  }

  isPasswordVisible.value = !isPasswordVisible.value

  if (inputElementRef.value) {
    inputElementRef.value.focus()
  }
}

// 向外暴露实例，便于父组件通过模板 ref 访问真实输入元素
defineExpose<InputInstance>({
  get ref() {
    return inputElementRef.value
  },
})
</script>
