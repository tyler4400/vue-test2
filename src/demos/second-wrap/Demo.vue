<template>
  <section class="p-4 flex flex-col gap-4">
    <h1 class="text-xl font-bold">二次封装方法论演示</h1>

    <div class="flex items-center gap-2">
      <label class="flex items-center gap-2">
        <input type="checkbox" :checked="disabled" @change="handleToggleDisabled" aria-label="toggle disabled" />
        <span>禁用</span>
      </label>
      <button
        type="button"
        @click="handleFocus"
        @keydown.enter.prevent="handleFocus"
        @keydown.space.prevent="handleFocus"
        tabindex="0"
        aria-label="focus input"
        class="border px-2 py-1 rounded"
      >
        聚焦输入
      </button>
    </div>

    <SecondWrap
      ref="wrapRef"
      v-model="inputValue"
      :disabled="disabled"
      placeholder="请输入内容"
      title="演示输入"
      data-track-id="demo-input"
      aria-label="二次封装输入"
      @change="handleChange"
    >
      <template #header="{ value }">
        <div class="text-sm text-gray-500">当前值（header 插槽）: {{ value }}</div>
      </template>

      <template #default="{ setValue }">
        <div class="text-sm">
          默认插槽可拿到 slot props：
          <button type="button" @click="() => setValue('hello')" tabindex="0" aria-label="set hello" class="underline">
            设置为 'hello'
          </button>
        </div>
      </template>

      <template #footer="{ value }">
        <div class="text-sm text-gray-500">底部（footer 插槽）: 长度 {{ value.length }}</div>
      </template>
    </SecondWrap>

    <div class="text-sm">
      v-model 值：<code>{{ inputValue }}</code>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import SecondWrap from './SecondWrap.vue'

const inputValue = ref('') // 受控数据
const disabled = ref(false)

const wrapRef = ref<{ focus: () => void } | null>(null)
const handleFocus = () => wrapRef.value?.focus()

const handleToggleDisabled = (e: Event) => {
  const target = e.target as HTMLInputElement | null
  if (!target) return
  disabled.value = target.checked
}

const handleChange = (v: string) => {
  // 演示：可监听 change 事件
  console.log('SecondWrap change:', v)
}
</script>

<style scoped>
.p-4 {
  padding: 16px;
}
.text-xl {
  font-size: 20px;
}
.font-bold {
  font-weight: 700;
}
.flex {
  display: flex;
}
.flex-col {
  flex-direction: column;
}
.gap-4 {
  gap: 16px;
}
.items-center {
  align-items: center;
}
.gap-2 {
  gap: 8px;
}
button {
  padding: 6px 10px;
  border: 1px solid var(--bd-1, #d0d0d0);
  border-radius: 6px;
  background: var(--bg-btn, #fff);
  color: var(--fg-1, #222);
  cursor: pointer;
}
button:hover {
  background: #f7f7f7;
}
@media (prefers-color-scheme: dark) {
  button {
    background: #1f1f1f;
    color: #e9e9e9;
    border-color: #3a3a3a;
  }
  button:hover {
    background: #2a2a2a;
  }
}
</style>
