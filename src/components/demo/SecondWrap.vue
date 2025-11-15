<template>
  <section class="flex flex-col gap-2">
    <header v-if="$slots.header">
      <slot name="header" :value="localValue" />
    </header>

    <SubItem
      ref="subRef"
      :value="localValue"
      :disabled="disabled"
      :aria-label="ariaLabel"
      v-bind="passThroughAttrs"
      @input="handleInput"
    />

    <slot :value="localValue" :disabled="disabled" :setValue="setValue" />

    <footer v-if="$slots.footer">
      <slot name="footer" :value="localValue" />
    </footer>
  </section>
</template>

<script setup lang="ts">
import { computed, defineOptions, useAttrs, withDefaults, ref } from 'vue'
import SubItem from './SubItem.vue'

defineOptions({ inheritAttrs: false })

const props = withDefaults(
  defineProps<{
    modelValue?: string
    disabled?: boolean
    ariaLabel?: string
  }>(),
  {
    modelValue: '',
    disabled: false,
    ariaLabel: 'second wrap input'
  }
)

const emit = defineEmits<{
  (e: 'update:modelValue', v: string): void
  (e: 'change', v: string): void
}>()

const attrs = useAttrs()

// 演示：有选择地透传属性，避免“封死”
const passThroughAttrs = computed(() => {
  const { class: klass, style, placeholder, title, id, ...rest } = attrs as Record<string, any>
  const ariaAndDataEntries = Object.entries(rest).filter(
    ([k]) => k.startsWith('aria-') || k.startsWith('data-')
  )
  return {
    class: klass,
    style,
    placeholder,
    title,
    id,
    ...Object.fromEntries(ariaAndDataEntries)
  }
})

const localValue = computed({
  get: () => props.modelValue,
  set: (v: string | undefined) => {
    if (props.disabled) return
    emit('update:modelValue', v ?? '')
    emit('change', v ?? '')
  }
})

const handleInput = (v: string) => {
  if (props.disabled) return
  localValue.value = v
}

const setValue = (v: string) => {
  if (props.disabled) return
  localValue.value = v
}

const subRef = ref<{ focus: () => void } | null>(null)
const focus = () => subRef.value?.focus()

defineExpose({ focus })
</script>

<style scoped>
/* 方法论演示，不做复杂样式 */
</style>
