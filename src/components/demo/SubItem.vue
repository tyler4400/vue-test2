<template>
	<label class="flex flex-col gap-1">
		<span class="text-sm text-gray-600">{{ label }}</span>
		<input
			v-bind="attrs"
			:value="value"
			:disabled="disabled"
			@input="handleInput"
			class="border px-2 py-1 rounded outline-none focus:ring-2 focus:ring-blue-500"
			:aria-label="ariaLabel"
			ref="inputEl"
		/>
	</label>
</template>

<script setup lang="ts">
import { ref, useAttrs, withDefaults, defineExpose, defineProps } from 'vue'

withDefaults(defineProps<{
	value?: string
	disabled?: boolean
	label?: string
	ariaLabel?: string
}>(), {
	value: '',
	disabled: false,
	label: 'SubItem',
	ariaLabel: 'subitem input'
})

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
/* 演示组件，样式保持最小化 */
</style>


