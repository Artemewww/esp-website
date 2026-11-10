<template>
  <div class="sr">
    <section class="sr-hero">
      <div class="dj-wrap">
        <span class="dj-eyebrow">Поиск по сайту</span>
        <h1 class="dj-h1 sr-title">Поиск по проектам, оборудованию и технологиям</h1>

        <div class="sr-field">
          <svg class="sr-ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.6" aria-hidden="true"><circle cx="11" cy="11" r="7" /><path d="M20 20l-3.5-3.5" /></svg>
          <input
            v-model="query"
            type="search"
            placeholder="Например: флотация, лидар, ОРЛ, Минский водоканал..."
            class="sr-input"
            aria-label="Поиск по сайту"
          />
          <button v-if="query" type="button" class="sr-clear" aria-label="Очистить" @click="query = ''">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.6" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18" /></svg>
          </button>
        </div>

        <div class="sr-tags">
          <span>Популярные запросы:</span>
          <button type="button" class="sr-tag" @click="query = 'флотация'">#флотация</button>
          <button type="button" class="sr-tag" @click="query = 'лидар'">#лидар</button>
          <button type="button" class="sr-tag" @click="query = 'ОРЛ'">#ОРЛ</button>
          <button type="button" class="sr-tag" @click="query = 'КНС'">#КНС</button>
        </div>
      </div>
    </section>

    <section class="sr-body">
      <div class="dj-wrap">
        <div class="sr-chips" role="tablist" aria-label="Разделы">
          <button
            v-for="tab in tabs"
            :key="tab.id"
            type="button"
            role="tab"
            :aria-selected="activeTab === tab.id"
            class="sr-chip"
            :class="{ 'is-on': activeTab === tab.id }"
            @click="activeTab = tab.id"
          >
            {{ tab.label }} <span class="sr-count">{{ tab.id === 'all' ? matchingTab.length : searchIndex.filter(r => r.type === tab.id && matchesQuery(r)).length }}</span>
          </button>
        </div>

        <div class="sr-list" aria-live="polite">
          <NuxtLink
            v-for="(item, idx) in filteredAll"
            :key="idx"
            :to="item.link"
            class="sr-item"
          >
            <div class="sr-top">
              <span class="sr-cat">{{ item.category }}</span>
              <span v-if="item.meta" class="sr-meta">{{ item.meta }}</span>
            </div>
            <h3 class="sr-h">{{ item.title }}</h3>
            <p class="sr-text">{{ item.desc }}</p>
            <span class="dj-more sr-more">Открыть</span>
          </NuxtLink>

          <div v-if="filteredAll.length === 0" class="sr-empty">
            <p class="sr-h">Ничего не найдено по запросу «{{ query }}»</p>
            <p class="sr-text">Попробуйте изменить формулировку или воспользуйтесь хэштегами выше.</p>
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
.sr-hero { padding: clamp(48px, 7vw, 96px) 0 clamp(24px, 3vw, 36px); }
.sr-title { max-width: 18ch; margin-top: 10px; }
.sr-field { position: relative; max-width: 44rem; margin-top: clamp(24px, 3vw, 36px); }
.sr-input { width: 100%; height: 56px; padding: 0 52px; border: 0; border-radius: 0; background: var(--dj-soft); font: inherit; font-size: 17px; color: var(--dj-ink); box-shadow: inset 0 -2px 0 transparent; transition: box-shadow 0.2s ease, background 0.2s ease; -webkit-appearance: none; appearance: none; }
.sr-input::-webkit-search-cancel-button { display: none; }
.sr-input:focus { outline: none; background: #eceef1; box-shadow: inset 0 -2px 0 var(--dj-blue); }
.sr-ico { position: absolute; left: 18px; top: 50%; width: 20px; height: 20px; transform: translateY(-50%); color: var(--dj-muted); pointer-events: none; }
.sr-clear { position: absolute; right: 14px; top: 50%; display: grid; place-items: center; width: 28px; height: 28px; transform: translateY(-50%); border-radius: 999px; color: var(--dj-muted); background: rgba(0, 0, 0, 0.06); }
.sr-clear svg { width: 14px; height: 14px; }
.sr-clear:hover { color: var(--dj-ink); }
.sr-tags { display: flex; flex-wrap: wrap; align-items: baseline; gap: 6px 14px; margin-top: 14px; font-size: 14px; color: var(--dj-muted); }
.sr-tag { font-size: 14px; color: var(--dj-link); }
.sr-tag:hover { text-decoration: underline; }
.sr-body { padding-bottom: clamp(64px, 8vw, 104px); }
.sr-chips { display: flex; gap: 8px; overflow-x: auto; padding-bottom: 4px; scrollbar-width: none; }
.sr-chips::-webkit-scrollbar { display: none; }
.sr-chip { flex-shrink: 0; display: inline-flex; align-items: center; gap: 6px; height: 36px; padding: 0 16px; border-radius: 999px; background: var(--dj-soft); font-size: 14px; font-weight: 500; color: var(--dj-ink); transition: background 0.2s ease, color 0.2s ease; }
.sr-chip:hover { background: #e8eaed; }
.sr-chip.is-on { background: var(--dj-ink); color: #fff; }
.sr-count { font-size: 12px; opacity: 0.6; font-variant-numeric: tabular-nums; }
.sr-list { display: grid; max-width: 56rem; margin-top: 24px; border-top: 1px solid var(--dj-line); }
.sr-item { display: block; padding: 24px 0; border-bottom: 1px solid var(--dj-line); }
.sr-item:hover .sr-h { color: var(--dj-link); }
.sr-top { display: flex; justify-content: space-between; align-items: center; gap: 12px; flex-wrap: wrap; }
.sr-cat { font-size: 13px; font-weight: 500; color: var(--dj-blue); }
.sr-meta { font-size: 13px; color: var(--dj-muted); }
.sr-h { margin-top: 8px; font-size: clamp(19px, 1.8vw, 22px); line-height: 1.3; font-weight: 600; letter-spacing: -0.01em; color: var(--dj-ink); transition: color 0.2s ease; }
.sr-text { margin-top: 6px; font-size: 15px; line-height: 1.55; color: var(--dj-text); }
.sr-more { margin-top: 10px; font-size: 14px; }
.sr-empty { padding: 56px 0; text-align: center; }
</style>
