<script setup lang="ts">
import FancyInput from '../../components/input'
import { h, onMounted, useTemplateRef } from 'vue'

const inputRef = useTemplateRef('inputRef')

const obj = {}
onMounted(() => {
  Object.assign(obj, inputRef.value)
})
defineExpose(obj)
</script>

<template>
  <div>
    <h3>暴露组件实例-初级</h3>
    <p>这个方法可以实现， 当组件没有挂载或已经被卸载的时候就会有问题,拿不到实例。且没有类型提示</p>
    <component :is="h(FancyInput, $attrs, $slots)" ref="inputRef" />
  </div>
</template>

<style scoped></style>
