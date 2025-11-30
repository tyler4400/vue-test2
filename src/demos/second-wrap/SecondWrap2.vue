<script setup lang="ts">
import FancyInput from '../../components/input'
import { h } from 'vue'
</script>

<template>
  <div>
    <h3>二次封装-中级</h3>
    <p>使用component.is 就简单很多，但依然缺失类型推到</p>
    <component :is="h(FancyInput, $attrs, $slots)" />
  </div>
</template>

<style scoped></style>
