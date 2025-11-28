<template>
  <section class="home">
    <header class="home__header">
      <h1 class="home__title">Demo 索引</h1>
      <input
        v-model="keyword"
        type="text"
        placeholder="搜索标题 / 关键词…"
        aria-label="search demos"
        class="home__search"
      />
    </header>

    <section v-for="(items, group) in grouped" :key="group" class="home__group">
      <h2 class="home__group-title">{{ group || '未分组' }}</h2>
      <ul class="home__grid">
        <li v-for="meta in items" :key="meta.folder" class="card">
          <RouterLink :to="`/demos/${meta.routerPath}`" class="card__title" :aria-label="`go to ${meta.title}`">
            {{ meta.title }}
          </RouterLink>
          <p v-if="meta.description" class="card__desc">{{ meta.description }}</p>
          <div v-if="meta.keywords?.length" class="card__tags">
            <span v-for="k in meta.keywords" :key="k" class="tag">{{ k }}</span>
          </div>
        </li>
      </ul>
    </section>
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
.home {
  padding: 16px;
  text-align: left;
}
.home__header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}
.home__title {
  font-size: 28px;
  font-weight: 800;
  letter-spacing: 1px;
  color: #222;
}
.home__search {
  width: 320px;
  max-width: 50vw;
  padding: 8px 12px;
  border: 1px solid #d0d0d0;
  border-radius: 8px;
  outline: none;
  background: #fff;
  color: #222;
}
.home__search:focus {
  border-color: #3b82f6;
  box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.15);
}
.home__group {
  margin-top: 8px;
}
.home__group-title {
  font-size: 16px;
  font-weight: 700;
  color: #222;
  margin: 8px 0 10px;
}
.home__grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 12px;
  list-style: none;
  padding: 0;
  margin: 0;
}
.card {
  border: 1px solid #e0e0e0;
  border-radius: 10px;
  padding: 12px;
  background: #fff;
}
.card__title {
  color: #2563eb;
  font-weight: 700;
  text-decoration: none;
  display: inline-block;
  text-align: left;
}
.card__title:hover {
  text-decoration: underline;
}
.card__desc {
  margin-top: 6px;
  font-size: 12px;
  line-height: 1.5;
  color: #666;
}
.card__tags {
  margin-top: 8px;
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}
.tag {
  font-size: 10px;
  padding: 2px 6px;
  border: 1px solid #e0e0e0;
  border-radius: 999px;
  color: #555;
  background: #f8f8f8;
}
@media (prefers-color-scheme: dark) {
  .home {
    color: #e9e9e9;
  }
  .home__title {
    color: #fafafa;
  }
  .home__search {
    background: #1f1f1f;
    color: #e9e9e9;
    border-color: #3a3a3a;
  }
  .card {
    background: #141414;
    border-color: #2a2a2a;
  }
  .card__desc {
    color: #a1a1a1;
  }
  .tag {
    background: #1e1e1e;
    border-color: #333;
    color: #bdbdbd;
  }
}
</style>
