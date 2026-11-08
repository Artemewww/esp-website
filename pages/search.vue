<template>
  <div class="ap sr">
    <section class="ap-sec ap-sec--first">
      <div class="ap-wrap">
        <span class="ap-eyebrow">Поиск по сайту</span>
        <h1 class="ap-title">Поиск по проектам, оборудованию и технологиям</h1>

        <div class="sr-field">
          <svg class="sr-ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.6" aria-hidden="true"><circle cx="11" cy="11" r="7" /><path d="M20 20l-3.5-3.5" /></svg>
          <input
            v-model="query"
            type="text"
            placeholder="Например: флотация, лидар, ОРЛ, Минский водоканал..."
            class="ap-input sr-input"
            aria-label="Поиск по сайту"
          />
          <button v-if="query" type="button" class="sr-clear" aria-label="Очистить" @click="query = ''">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.6" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18" /></svg>
          </button>
        </div>

        <div class="sr-tags">
          <span>Популярные запросы:</span>
          <button type="button" class="ap-link" @click="query = 'флотация'">#флотация</button>
          <button type="button" class="ap-link" @click="query = 'лидар'">#лидар</button>
          <button type="button" class="ap-link" @click="query = 'ОРЛ'">#ОРЛ</button>
          <button type="button" class="ap-link" @click="query = 'КНС'">#КНС</button>
        </div>

        <div class="ap-tabs" role="tablist" aria-label="Разделы">
          <button
            v-for="tab in tabs"
            :key="tab.id"
            type="button"
            role="tab"
            :aria-selected="activeTab === tab.id"
            class="ap-tab"
            :class="{ 'is-on': activeTab === tab.id }"
            @click="activeTab = tab.id"
          >
            {{ tab.label }} ({{ tab.id === 'all' ? matchingTab.length : searchIndex.filter(r => r.type === tab.id && matchesQuery(r)).length }})
          </button>
        </div>

        <div class="sr-list">
          <NuxtLink
            v-for="(item, idx) in filteredAll"
            :key="idx"
            :to="item.link"
            class="ap-card"
          >
            <div class="sr-top">
              <span class="ap-pill">{{ item.category }}</span>
              <span v-if="item.meta" class="ap-small">{{ item.meta }}</span>
            </div>
            <h3 class="ap-h3">{{ item.title }}</h3>
            <p class="ap-text">{{ item.desc }}</p>
          </NuxtLink>

          <div v-if="filteredAll.length === 0" class="ap-card sr-empty">
            <p class="ap-h3">Ничего не найдено по запросу «{{ query }}»</p>
            <p class="ap-text">Попробуйте изменить формулировку или воспользуйтесь хэштегами выше.</p>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { equipmentList } from '~/composables/useEquipment'
import { projectsList } from '~/composables/useProjects'
import { servicesList } from '~/composables/useServices'
import { articlesList } from '~/composables/useArticles'
const articles = useEditableList('articles', articlesList)
import { technologiesList } from '~/composables/useTechnologies'

useHead({
  title: 'Поиск | ESP',
  meta: [{ name: 'description', content: 'Поиск по проектам, оборудованию, услугам и технологиям ESP.' }]
})

const query = ref('')
const activeTab = ref('all')

const tabs = [
  { id: 'all', label: 'Все' },
  { id: 'projects', label: 'Проекты' },
  { id: 'equipment', label: 'Оборудование' },
  { id: 'services', label: 'Услуги' },
  { id: 'technologies', label: 'Технологии' },
  { id: 'articles', label: 'Статьи' }
]

const searchIndex = [
  ...equipmentList.map(e => ({
    type: 'equipment',
    title: e.name,
    desc: e.desc,
    category: 'Оборудование',
    meta: e.capacity,
    link: `/equipment/${e.slug}`,
    haystack: `${e.name} ${e.desc} ${e.longDesc || ''} ${e.category} ${e.application || ''}`.toLowerCase()
  })),
  ...projectsList.map(p => ({
    type: 'projects',
    title: p.name,
    desc: p.desc,
    category: 'Проекты',
    meta: `${p.location} · ${p.capacity}`,
    link: `/projects/${p.slug}`,
    haystack: `${p.name} ${p.desc} ${p.longDesc || ''} ${p.location} ${(p.tags || []).join(' ')}`.toLowerCase()
  })),
  ...servicesList.map(s => ({
    type: 'services',
    title: s.title,
    desc: s.desc,
    category: 'Услуги',
    meta: '',
    link: `/services/${s.slug}`,
    haystack: `${s.title} ${s.desc} ${s.longDesc || ''} ${(s.points || []).join(' ')}`.toLowerCase()
  })),
  ...technologiesList.filter(t => !t.hidden).map(t => ({
    type: 'technologies',
    title: t.title,
    desc: t.desc,
    category: 'Технологии',
    meta: '',
    link: `/technologies/${t.slug}`,
    haystack: `${t.title} ${t.desc}`.toLowerCase()
  })),
  ...articles.value.map(a => ({
    type: 'articles',
    title: a.title,
    desc: a.excerpt,
    category: 'Статьи',
    meta: a.date,
    link: `/articles/${a.slug}`,
    haystack: `${a.title} ${a.excerpt} ${a.category || ''}`.toLowerCase()
  }))
]

const matchesQuery = (item) => {
  const q = query.value.trim().toLowerCase()
  if (!q) return true
  return item.haystack.includes(q)
}

const matchingTab = computed(() => searchIndex.filter(matchesQuery))

const filteredAll = computed(() => {
  return searchIndex.filter(r => {
    if (activeTab.value !== 'all' && r.type !== activeTab.value) return false
    return matchesQuery(r)
  })
})
</script>

<style scoped>
.sr { min-height: 100vh; }
.sr-field { position: relative; max-width: 42rem; margin-top: 2rem; }
.sr-input { padding-left: 2.9rem; padding-right: 2.9rem; font-size: 17px; border-radius: 14px; }
.sr-ico { position: absolute; left: 1rem; top: 50%; width: 20px; height: 20px; transform: translateY(-50%); color: var(--ap-muted); pointer-events: none; }
.sr-clear { position: absolute; right: 0.75rem; top: 50%; display: grid; place-items: center; width: 28px; height: 28px; transform: translateY(-50%); border-radius: 999px; color: var(--ap-muted); background: rgba(0, 0, 0, 0.05); }
.sr-clear svg { width: 14px; height: 14px; }
.sr-clear:hover { color: var(--ap-ink); }
.sr-tags { display: flex; flex-wrap: wrap; align-items: baseline; gap: 0.4rem 0.9rem; margin-top: 1rem; font-size: 14px; color: var(--ap-muted); }
.sr-list { display: grid; gap: 1rem; max-width: 56rem; margin-top: 2rem; }
.sr-top { display: flex; justify-content: space-between; align-items: center; gap: 1rem; flex-wrap: wrap; }
.sr-empty { text-align: center; align-items: center; padding: 3rem 1.75rem; }
</style>
