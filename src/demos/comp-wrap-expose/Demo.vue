<template>
  <section class="p-4 flex flex-col gap-4">
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
      <template #prefix>
        <div class="text-sm text-gray-500">prefix</div>
      </template>
      <template #suffix>
        <div class="text-sm text-gray-500">suffix</div>
      </template>
    </SecondWrap>
    <button @click="handleClick">聚焦输入框</button>

    <SecondWrap2
      ref="wrapRef2"
      v-model="inputValue2"
      :disabled="disabled"
      placeholder="请输入内容"
      title="演示输入"
      data-track-id="demo-input"
      aria-label="二次封装输入"
      @change="handleChange"
    >
      <template #prefix>
        <div class="text-sm text-gray-500">prefix</div>
      </template>
      <template #suffix>
        <div class="text-sm text-gray-500">suffix</div>
      </template>
    </SecondWrap2>
    <button @click="handleClick2">聚焦输入框</button>
  </section>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import SecondWrap from './SecondWrap.vue'
import SecondWrap2 from './SecondWrap2.vue'

const inputValue = ref('') // 受控数据
const inputValue2 = ref('') // 受控数据
const disabled = ref(false)

const handleChange = (v: string) => {
  // 演示：可监听 change 事件
  console.log('SecondWrap change:', v)
}

const wrapRef = ref<{ focus: () => void } | null>(null)
const handleClick = () => {
  wrapRef.value?.ref.focus()
}

const wrapRef2 = ref<{ focus: () => void } | null>(null)
const handleClick2 = () => {
  wrapRef2.value?.ref.focus()
}
</script>
