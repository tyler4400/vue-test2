<template>
  <section class="home">
    <header class="home__header">
      <h1 class="home__title">Demo 索引</h1>
      <!-- 主题切换按钮：用于切换明亮 / 暗黑模式 -->
      <button
        type="button"
        class="home__theme-toggle"
        @click="handleToggleTheme"
        :aria-pressed="currentTheme === 'dark'"
        aria-label="切换明亮或暗黑主题"
      >
        {{ currentTheme === 'light' ? '暗黑模式' : '明亮模式' }}
      </button>
    </header>

    <!-- 搜索框下移到标题下方 -->
    <div class="home__search-row">
      <input
        v-model="keyword"
        type="text"
        placeholder="搜索标题 / 关键词…"
        aria-label="search demos"
        class="home__search"
      />
    </div>

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
import { computed, onMounted, ref } from 'vue'
import { demoList } from '../demos/registry'

type UiTheme = 'light' | 'dark'
const THEME_STORAGE_KEY = 'demo-ui-theme'

// 搜索关键字
const keyword = ref('')

// 当前主题（明亮 / 暗黑）
const currentTheme = ref<UiTheme>('light')

// 将主题应用到 documentElement，并持久化到 localStorage
const applyTheme = (theme: UiTheme) => {
  if (typeof document === 'undefined') return
  const rootElement = document.documentElement
  rootElement.dataset.theme = theme

  if (typeof window !== 'undefined') {
    window.localStorage.setItem(THEME_STORAGE_KEY, theme)
  }
}

// 初始化主题：1) localStorage > 2) 系统偏好 > 3) 默认 light
const initTheme = (): UiTheme => {
  if (typeof window === 'undefined') return 'light'

  const stored = window.localStorage.getItem(THEME_STORAGE_KEY)
  if (stored === 'light' || stored === 'dark') {
    return stored
  }

  const prefersDark = window.matchMedia?.('(prefers-color-scheme: dark)').matches
  if (prefersDark) {
    return 'dark'
  }

  return 'light'
}

// 点击按钮切换当前主题
const handleToggleTheme = () => {
  const nextTheme: UiTheme = currentTheme.value === 'light' ? 'dark' : 'light'
  currentTheme.value = nextTheme
  applyTheme(nextTheme)
}

// 挂载时初始化主题
onMounted(() => {
  const initialTheme = initTheme()
  currentTheme.value = initialTheme
  applyTheme(initialTheme)
})

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
  color: var(--color-page-text);
  background-color: var(--color-page-bg);
}
.home__header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}
.home__title {
  font-size: 28px;
  font-weight: 800;
  letter-spacing: 1px;
  color: var(--color-heading);
}
.home__search-row {
  margin-bottom: 16px;
}
.home__search {
  width: 320px;
  max-width: 50vw;
  padding: 8px 12px;
  border: 1px solid var(--color-input-border);
  border-radius: 8px;
  outline: none;
  background: var(--color-input-bg);
  color: var(--color-input-text);
}
.home__search:focus {
  border-color: var(--color-focus-border);
  box-shadow: var(--shadow-focus-ring);
}
.home__theme-toggle {
  padding: 6px 10px;
  border-radius: 8px;
  border: 1px solid var(--color-surface-border);
  background: var(--color-surface-bg);
  color: var(--color-page-text);
  cursor: pointer;
}
.home__group {
  margin-top: 8px;
}
.home__group-title {
  font-size: 16px;
  font-weight: 700;
  color: var(--color-heading);
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
  border: 1px solid var(--color-surface-border);
  border-radius: 10px;
  padding: 12px;
  background: var(--color-surface-bg);
}
.card__title {
  color: var(--color-link);
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
  color: var(--color-text-muted);
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
  border: 1px solid var(--color-tag-border);
  border-radius: 999px;
  color: var(--color-page-text);
  background: var(--color-tag-bg);
}
</style>
