<template>
  <div class="layout">
    <header v-if="!hideHeader" class="layout__header">
      <button type="button" class="layout__back" @click="handleBack" aria-label="返回索引页" tabindex="0">
        ← 返回
      </button>
      <h1 class="layout__title">{{ currentTitle }}</h1>
    </header>
    <main class="layout__body">
      <router-view />
    </main>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()

const currentTitle = computed(() => {
  const record = route.matched.at(-1)
  return ((record?.meta as any)?.title as string) || 'Demo'
})

const hideHeader = computed(() => {
  const record = route.matched.at(-1)
  return Boolean((record?.meta as any)?.hideLayoutHeader)
})

const handleBack = () => {
  router.push('/')
}
</script>

<style scoped>
.layout {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}
.layout__header {
  height: 56px;
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 0 16px;
  border-bottom: 1px solid #e5e5e5;
  background: #fff;
}
.layout__back {
  border: 1px solid #d0d0d0;
  background: #fff;
  border-radius: 8px;
  padding: 6px 10px;
  cursor: pointer;
}
.layout__title {
  font-size: 18px;
  font-weight: 800;
  margin: 0;
}
.layout__body {
  padding: 16px;
}
@media (prefers-color-scheme: dark) {
  .layout__header {
    background: #141414;
    border-color: #2a2a2a;
  }
  .layout__back {
    background: #1f1f1f;
    color: #e9e9e9;
    border-color: #3a3a3a;
  }
}
</style>
