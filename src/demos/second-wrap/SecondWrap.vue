<template>
  <section class="wrap">
    <header v-if="$slots.header" class="wrap__header">
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

    <div class="wrap__slot">
      <slot :value="localValue" :disabled="disabled" :setValue="setValue" />
    </div>

    <footer v-if="$slots.footer" class="wrap__footer">
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
    ariaLabel: 'second wrap input',
  },
)

const emit = defineEmits<{
  (e: 'update:modelValue', v: string): void
  (e: 'change', v: string): void
}>()

const attrs = useAttrs()

// 演示：有选择地透传属性，避免“封死”
const passThroughAttrs = computed(() => {
  const { class: klass, style, placeholder, title, id, ...rest } = attrs as Record<string, any>
  const ariaAndDataEntries = Object.entries(rest).filter(([k]) => k.startsWith('aria-') || k.startsWith('data-'))
  return {
    class: klass,
    style,
    placeholder,
    title,
    id,
    ...Object.fromEntries(ariaAndDataEntries),
  }
})

const localValue = computed({
  get: () => props.modelValue,
  set: (v: string | undefined) => {
    if (props.disabled) return
    emit('update:modelValue', v ?? '')
    emit('change', v ?? '')
  },
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
.wrap {
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.wrap__header,
.wrap__footer {
  font-size: 12px;
  color: var(--color-text-muted);
}
.wrap__slot {
  font-size: 12px;
  color: var(--color-page-text);
}
</style>
