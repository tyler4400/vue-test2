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
  color: #666;
}
.field__input {
  padding: 8px 10px;
  border: 1px solid #d0d0d0;
  border-radius: 6px;
  outline: none;
  background: #fff;
  color: #222;
}
.field__input:focus {
  border-color: #3b82f6;
  box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.15);
}
@media (prefers-color-scheme: dark) {
  .field__label {
    color: #aaa;
  }
  .field__input {
    background: #1f1f1f;
    border-color: #3a3a3a;
    color: #e9e9e9;
  }
  .field__input:focus {
    border-color: #60a5fa;
    box-shadow: 0 0 0 2px rgba(96, 165, 250, 0.25);
  }
}
</style>
