<template>
  <section class="p-4 flex flex-col gap-4">
    <h1 class="text-2xl font-bold">Demo 索引</h1>

    <div class="flex items-center gap-2">
      <input
        v-model="keyword"
        type="text"
        placeholder="搜索标题 / 关键词..."
        aria-label="search demos"
        class="border rounded px-3 py-2 w-full max-w-md outline-none focus:ring-2 focus:ring-blue-500"
      />
    </div>

    <div v-for="(items, group) in grouped" :key="group" class="flex flex-col gap-2">
      <h2 class="text-lg font-semibold">{{ group || '未分组' }}</h2>
      <ul class="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
        <li v-for="meta in items" :key="meta.slug" class="border rounded p-3 hover:shadow-sm">
          <RouterLink
            :to="`/demos/${meta.slug}`"
            class="text-blue-600 hover:underline"
            :aria-label="`go to ${meta.title}`"
          >
            {{ meta.title }}
          </RouterLink>
          <p v-if="meta.description" class="text-xs text-gray-500 mt-1">{{ meta.description }}</p>
          <div v-if="meta.keywords?.length" class="mt-2 flex flex-wrap gap-1">
            <span
              v-for="k in meta.keywords"
              :key="k"
              class="text-[10px] bg-gray-100 border rounded px-1 py-0.5 text-gray-600"
            >
              {{ k }}
            </span>
          </div>
        </li>
      </ul>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { demoList } from '../demos/registry'

const keyword = ref('')

const normalized = computed(() => {
  const q = keyword.value.trim().toLowerCase()
  if (!q) return demoList
  return demoList.filter(d => {
    const inTitle = d.title.toLowerCase().includes(q)
    const inDesc = (d.description ?? '').toLowerCase().includes(q)
    const inKw = (d.keywords ?? []).some(k => k.toLowerCase().includes(q))
    return inTitle || inDesc || inKw
  })
})

const grouped = computed(() => {
  const map: Record<string, typeof demoList> = {}
  for (const d of normalized.value) {
    const g = d.group ?? ''
    if (!map[g]) map[g] = []
    map[g].push(d)
  }
  return map
})
</script>

<style scoped>
/* 简单索引页，不引入 UI 库 */
</style>
