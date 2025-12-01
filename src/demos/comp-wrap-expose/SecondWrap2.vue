<script setup lang="ts">
import FancyInput from '../../components/input'
import { h, useTemplateRef, onMounted } from 'vue'

const inputRef = useTemplateRef('inputRef')

defineExpose(
  new Proxy(
    {},
    {
      get(taget, key) {
        return inputRef.value?.[key]
      },
      has(target, key) {
        return key in inputRef.value
      },
    },
  ),
)
</script>

<template>
  <div>
    <h3>暴露组件实例-中级</h3>
    <p>使用代理. 这个方法也并不是完美， 后续还有类型推导版本</p>
    <component :is="h(FancyInput, $attrs, $slots)" ref="inputRef" />
  </div>
</template>

<style scoped></style>
