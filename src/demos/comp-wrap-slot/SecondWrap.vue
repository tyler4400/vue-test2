<script setup lang="ts">
import FancyInput from '../../components/input'
</script>

<template>
  <div>
    <h3>二次封装-初级</h3>
    <p>这个方式别扭且麻烦，只传递了插槽和属性。但丢失了类型，不知道原组件的prop类型提示。</p>
    <FancyInput v-bind="$attrs">
      <template v-for="(_, slotKey) in $slots" v-slot:[slotKey]="slotProps" :key="slotKey">
        <slot :name="slotKey" v-bind="slotProps" />
      </template>
    </FancyInput>
  </div>
</template>

<style scoped></style>
