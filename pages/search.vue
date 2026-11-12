<template>
  <div class="sr">
    <section class="sr-hero">
      <div class="dj-wrap">
        <span class="dj-eyebrow">Поиск по сайту</span>
        <h1 class="dj-h1 sr-title">Поиск по проектам, оборудованию и технологиям</h1>

        <div class="sr-field">
          <svg class="sr-ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" aria-hidden="true"><circle cx="11" cy="11" r="7" /><path d="M20 20l-3.5-3.5" /></svg>
          <input
            v-model="query"
            type="search"
            placeholder="Например: флотация, лидар, ОРЛ, Минский водоканал"
            class="sr-input"
            aria-label="Поиск по сайту"
          />
          <button v-if="query" type="button" class="sr-clear" aria-label="Очистить" @click="query = ''">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18" /></svg>
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
            :class="{ 'sr-item--thumb': item.img || item.icon || item.brand }"
          >
            <span v-if="item.img || item.icon || item.brand" class="sr-thumb" :class="{ 'sr-thumb--contain': item.contain || !item.img }" aria-hidden="true">
              <img v-if="item.img" :src="item.img" alt="" loading="lazy" decoding="async" />
              <EquipBrand v-else-if="item.brand" :item="item.brand" compact />
              <ApIcon v-else :name="item.icon" class="sr-thumb__ico" />
            </span>
            <div class="sr-top">
              <span class="sr-cat">{{ item.category }}</span>
              <span v-if="item.meta" class="sr-meta">{{ item.meta }}</span>
            </div>
            <h3 class="sr-h">{{ item.title }}</h3>
            <p class="sr-text">{{ item.desc }}</p>
            <span class="dj-more sr-more">Подробнее</span>
          </NuxtLink>

          <div v-if="filteredAll.length === 0" class="sr-empty">
            <p class="sr-h">Ничего не найдено по запросу «{{ query }}»</p>
            <p class="sr-text">Попробуйте изменить формулировку или воспользуйтесь популярными запросами выше.</p>
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
import { servicesList, serviceGlyphs } from '~/composables/useServices'
import { cutSrc } from '~/composables/useEquipCut'
import { articlesList } from '~/composables/useArticles'
const articles = useEditableList('articles', articlesList)
import { technologiesList } from '~/composables/useTechnologies'

useHead({
  title: 'Поиск | ESP',
  meta: [{ name: 'description', content: 'Поиск по проектам, оборудованию, услугам и технологиям ESP.' }]
})

const query = ref('')
const activeTab = ref('all')

const tabs = [
  { id: 'all', label: 'Все' },
  { id: 'projects', label: 'Объекты' },
  { id: 'equipment', label: 'Оборудование' },
  { id: 'services', label: 'Услуги' },
  { id: 'technologies', label: 'Технологии' },
  { id: 'articles', label: 'Статьи' }
]

// computed: статьи приходят из useFetch позже setup — иначе сервер рендерит fallback,
// клиент — данные из payload (hydration mismatch).
const searchIndex = computed(() => [
  ...equipmentList.map(e => ({
    type: 'equipment',
    title: e.name,
    desc: e.desc,
    category: 'Оборудование',
    meta: e.capacity,
    link: `/equipment/${e.slug}`,
    img: cutSrc(e.image) || '', contain: true, brand: cutSrc(e.image) ? null : e,
    haystack: `${e.name} ${e.desc} ${e.longDesc || ''} ${e.category} ${e.application || ''}`.toLowerCase()
  })),
  ...projectsList.map(p => ({
    type: 'projects',
    title: p.name,
    desc: p.desc,
    category: 'Проекты',
    meta: `${p.location} · ${p.capacity}`,
    link: `/projects/${p.slug}`,
    img: p.poster || (p.gallery && p.gallery[0]) || '',
    haystack: `${p.name} ${p.desc} ${p.longDesc || ''} ${p.location} ${(p.tags || []).join(' ')}`.toLowerCase()
  })),
  ...servicesList.map(s => ({
    type: 'services',
    title: s.title,
    desc: s.desc,
    category: 'Услуги',
    meta: '',
    link: `/services/${s.slug}`,
    icon: serviceGlyphs[s.icon] || 'doc',
    haystack: `${s.title} ${s.desc} ${s.longDesc || ''} ${(s.points || []).join(' ')}`.toLowerCase()
  })),
  ...technologiesList.filter(t => !t.hidden).map(t => ({
    type: 'technologies',
    title: t.title,
    desc: t.desc,
    category: 'Технологии',
    meta: '',
    link: `/technologies/${t.slug}`,
    img: `/images/technologies/stage/${t.slug}.webp`,
    haystack: `${t.title} ${t.desc}`.toLowerCase()
  })),
  ...articles.value.map(a => ({
    type: 'articles',
    title: a.title,
    desc: a.excerpt,
    category: 'Статьи',
    meta: a.date,
    link: `/articles/${a.slug}`,
    img: (projectsList.find(p => p.slug === a.relatedProjectSlug) || {}).poster || '',
    haystack: `${a.title} ${a.excerpt} ${a.category || ''}`.toLowerCase()
  }))
])

const matchesQuery = (item) => {
  const q = query.value.trim().toLowerCase()
  if (!q) return true
  return item.haystack.includes(q)
}

const matchingTab = computed(() => searchIndex.value.filter(matchesQuery))

const filteredAll = computed(() => {
  return searchIndex.value.filter(r => {
    if (activeTab.value !== 'all' && r.type !== activeTab.value) return false
    return matchesQuery(r)
  })
})
</script>

<style scoped>
/* Apple Search: крупное поле со скруглением, «Быстрые ссылки», табы-подчёркивания, список результатов 21/25 */
.sr { min-height: 100vh; }
.sr-hero { padding: clamp(56px, 7vw, 96px) 0 clamp(24px, 3vw, 40px); }
.sr-title { max-width: 18ch; margin-top: 8px; font-size: clamp(32px, 4.2vw, 56px); line-height: 1.07; letter-spacing: -0.005em; }
.sr-field { position: relative; max-width: 46rem; margin-top: clamp(28px, 3.4vw, 44px); }
.sr-input { width: 100%; height: 60px; padding: 0 56px; border: 1px solid #D6D6D6; border-radius: var(--r-sm); background: #fff; font: inherit; font-size: 21px; letter-spacing: 0.011em; color: var(--dj-ink); transition: border-color 0.2s ease, box-shadow 0.2s ease; -webkit-appearance: none; appearance: none; }
.sr-input::placeholder { color: #8A8A8A; }
.sr-input::-webkit-search-cancel-button { display: none; }
.sr-input:focus { outline: none; border-color: #002366; box-shadow: var(--focus-ring); }
.sr-ico { position: absolute; left: 20px; top: 50%; width: 22px; height: 22px; transform: translateY(-50%); color: #8A8A8A; pointer-events: none; }
.sr-clear { position: absolute; right: 16px; top: 50%; display: grid; place-items: center; width: 26px; height: 26px; transform: translateY(-50%); border-radius: var(--r-pill); color: #fff; background: #8A8A8A; }
.sr-clear svg { width: 12px; height: 12px; stroke-width: 2.2; }
.sr-clear:hover { background: var(--dj-ink); }
.sr-tags { display: flex; flex-wrap: wrap; align-items: baseline; gap: 6px 18px; margin-top: 18px; font-size: 14px; letter-spacing: -0.016em; color: #5E5E5E; }
.sr-tag { font-size: 14px; color: #002366; }
.sr-tag:hover { text-decoration: underline; }
.sr-body { padding-bottom: clamp(72px, 8vw, 120px); }
.sr-chips { display: flex; gap: 28px; overflow-x: auto; border-bottom: 1px solid #D6D6D6; scrollbar-width: none; }
.sr-chips::-webkit-scrollbar { display: none; }
.sr-chip { flex-shrink: 0; display: inline-flex; align-items: baseline; gap: 6px; padding: 12px 0 13px; margin-bottom: -1px; border-bottom: 2px solid transparent; font-size: 17px; letter-spacing: -0.022em; color: #5E5E5E; transition: color 0.2s ease, border-color 0.2s ease; }
.sr-chip:hover { color: var(--dj-ink); }
.sr-chip.is-on { color: var(--dj-ink); border-bottom-color: var(--dj-ink); }
.sr-count { font-size: 12px; color: #8A8A8A; font-variant-numeric: tabular-nums; }
.sr-list { display: grid; max-width: 52rem; margin-top: 8px; }
.sr-item { display: block; padding: 28px 0; border-bottom: 1px solid #EDEDED; }
.sr-item:hover .sr-h { color: #002366; }
.sr-top { display: flex; align-items: baseline; gap: 10px; flex-wrap: wrap; }
.sr-cat { font-size: 12px; font-weight: 600; letter-spacing: -0.01em; color: #5E5E5E; }
.sr-meta { font-size: 12px; color: #8A8A8A; }
.sr-meta::before { content: '·'; margin-right: 10px; }
.sr-h { margin-top: 6px; font-size: 21px; line-height: 1.19; font-weight: 600; letter-spacing: 0.011em; color: var(--dj-ink); transition: color 0.2s ease; }
.sr-text { margin-top: 8px; font-size: 17px; line-height: 1.47; letter-spacing: -0.022em; color: var(--dj-ink); }
.sr-more { margin-top: 10px; font-size: 17px; color: #002366; }
.sr-empty { padding: 64px 0; text-align: center; }
.sr-empty .sr-text { color: #5E5E5E; }
@media (max-width: 734px) {
  .sr-input { height: 52px; font-size: 17px; padding: 0 48px; }
  .sr-ico { left: 16px; width: 20px; height: 20px; }
  .sr-chips { gap: 20px; }
  .sr-h { font-size: 19px; }
}
.sr-item--thumb { display: grid; grid-template-columns: 168px minmax(0, 1fr); column-gap: 24px; align-items: start; }
.sr-item--thumb > :not(.sr-thumb) { grid-column: 2; }
.sr-thumb { position: relative; grid-column: 1; grid-row: 1 / span 4; display: grid; place-items: center; width: 168px; aspect-ratio: 4 / 3; overflow: hidden; border-radius: var(--r-md); background: #EDEDED; }
.sr-thumb img { width: 100%; height: 100%; object-fit: cover; }
.sr-thumb--contain { background: #FAFAFA; }
.sr-thumb--contain img { object-fit: contain; padding: 8%; mix-blend-mode: multiply; }
.sr-thumb__ico { width: 44px; height: 44px; color: #002366; }
@media (max-width: 600px) {
  .sr-item--thumb { grid-template-columns: 96px minmax(0, 1fr); column-gap: 14px; }
  .sr-thumb { width: 96px; border-radius: var(--r-sm); }
  .sr-thumb__ico { width: 32px; height: 32px; }
}
</style>
