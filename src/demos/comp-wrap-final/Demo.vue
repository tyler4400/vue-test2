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
      :clearable="true"
      aaa="123"
    >
      <template #prefix>
        <div class="text-sm text-gray-500">prefix</div>
      </template>
      <template #suffix>
        <div class="text-sm text-gray-500">suffix</div>
      </template>
    </SecondWrap>
    <button @click="handleClick">聚焦输入框</button>
    <button @click="() => (disabled = !disabled)">切换输入框disable</button>
    <p><a href="https://www.bilibili.com/video/BV1bDe1z1Eyr">教程视频链接 vue组件二次封装-究极版</a></p>
  </section>
</template>

<script setup lang="ts">
import { ref, useTemplateRef } from 'vue'
import SecondWrap from './SecondWrap.vue'
import type { InputValue } from '../../components/input'

const inputValue = ref('') // 受控数据
const disabled = ref(false)

const myRef = useTemplateRef('wrapRef') // 无需写useTemplateRef<type> vue自己推导类型
const handleClick = () => {
  myRef.value?.ref?.focus()
}

const handleChange = (v: InputValue) => {
  // 演示：可监听 change 事件
  console.log('SecondWrap change:', v)
}
</script>
