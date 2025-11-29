<template>
  <label class="field">
    <span class="field__label">{{ label }}</span>
    <input
      v-bind="attrs"
      :value="value"
      :disabled="disabled"
      @input="handleInput"
      class="field__input"
      :aria-label="ariaLabel"
      ref="inputEl"
    />
  </label>
</template>

<script setup lang="ts">
import { ref, useAttrs, withDefaults, defineExpose, defineProps } from 'vue'

withDefaults(
  defineProps<{
    value?: string
    disabled?: boolean
    label?: string
    ariaLabel?: string
  }>(),
  {
    value: '',
    disabled: false,
    label: 'SubItem',
    ariaLabel: 'subitem input',
  },
)

const emit = defineEmits<{
  (e: 'input', v: string): void
}>()

const attrs = useAttrs()

const inputEl = ref<HTMLInputElement | null>(null)

const handleInput = (e: Event) => {
  const target = e.target as HTMLInputElement | null
  if (!target) return
  emit('input', target.value)
}

const focus = () => {
  inputEl.value?.focus()
}

defineExpose({ focus })
</script>

<style scoped>
.field {
  display: flex;
  flex-direction: column;
  gap: 6px;
}
.field__label {
  font-size: 12px;
  color: var(--color-text-muted);
}
.field__input {
  padding: 8px 10px;
  border: 1px solid var(--color-input-border);
  border-radius: 6px;
  outline: none;
  background: var(--color-input-bg);
  color: var(--color-input-text);
}
.field__input:focus {
  border-color: var(--color-focus-border);
  box-shadow: var(--shadow-focus-ring);
}
</style>
