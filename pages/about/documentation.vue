<template>
  <div class="dc">
    <div class="dj-wrap dc-crumb"><Breadcrumb :items="[{ label: 'О компании', to: '/about' }, { label: 'Нормативная документация' }]" /></div>
    <DjPageHero
      eyebrow="Справочная база"
      title="Нормативная документация"
      lede="СанПиНы, СНиПы, ТКП и постановления Республики Беларусь в области водоснабжения, канализации и охраны водных ресурсов, которыми ESP руководствуется при проектировании."
    />

    <section class="dc-sec">
      <div class="dj-wrap">
        <div class="dc-search">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.6" aria-hidden="true"><circle cx="11" cy="11" r="7" /><path d="M20 20l-3.5-3.5" /></svg>
          <input
            v-model="search"
            type="search"
            placeholder="Найти документ по названию или категории..."
            aria-label="Поиск документа"
            class="dc-input"
          />
        </div>

        <div class="dc-tabs" role="tablist" aria-label="Категории документов">
          <button
            v-for="cat in categories"
            :key="cat"
            type="button"
            role="tab"
            :aria-selected="activeCategory === cat"
            class="dc-tab"
            :class="{ 'is-on': activeCategory === cat }"
            @click="activeCategory = cat"
          >{{ cat }}</button>
        </div>

        <div class="dc-rows">
          <a
            v-for="doc in filteredDocs"
            :key="doc.id"
            :href="doc.href"
            target="_blank"
            rel="noopener"
            class="dc-row"
          >
            <span class="dc-thumb"><ApIcon name="doc" class="dc-ico" /><i>PDF</i></span>
            <div class="dc-main">
              <h3 class="dc-title">{{ doc.title }}</h3>
              <p class="dc-desc">{{ doc.desc }}</p>
              <span class="dc-meta">{{ doc.category }} · {{ doc.size }}</span>
            </div>
            <span class="dj-more dc-more">Смотреть PDF</span>
          </a>
          <p v-if="!filteredDocs.length" class="dc-empty">Документы не найдены</p>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { normativeDocuments } from '~/composables/useNormativeDocuments'

const search = ref('')
const documents = useEditableList('documents', normativeDocuments)
const categories = computed(() => ['Все', ...new Set(documents.value.map(d => d.category))])
const activeCategory = ref('Все')

const filteredDocs = computed(() => {
  let r = documents.value
  if (activeCategory.value !== 'Все') r = r.filter(d => d.category === activeCategory.value)
  if (search.value.trim()) {
    const q = search.value.toLowerCase()
    r = r.filter(d => d.title.toLowerCase().includes(q) || d.category.toLowerCase().includes(q))
  }
  return r
})

useHead({
  title: 'Нормативная документация | ESP',
  meta: [
    { name: 'description', content: 'СанПиНы, СНиПы, ТКП и постановления РБ в области водоснабжения и канализации, используемые ЭкоСервисПроект.' }
  ]
})
</script>

<style scoped>
.dc-crumb { padding-top: 20px; }
.dc-sec { padding: 0 0 clamp(64px, 8vw, 104px); }
.dc-search { position: relative; max-width: 640px; margin: 0 auto; }
.dc-search svg { position: absolute; left: 16px; top: 50%; width: 20px; height: 20px; transform: translateY(-50%); color: var(--dj-muted); pointer-events: none; }
.dc-input { width: 100%; height: 52px; padding: 0 18px 0 46px; border: 1px solid var(--dj-line); border-radius: 12px; font-size: 16px; color: var(--dj-ink); background: #fff; transition: border-color .2s ease; }
.dc-input:focus { outline: none; border-color: var(--dj-link); }
.dc-tabs { display: flex; justify-content: center; flex-wrap: wrap; gap: 8px; margin-top: 20px; }
.dc-tab { flex: 0 0 auto; height: 36px; padding: 0 18px; border-radius: 999px; font-size: 14px; color: var(--dj-ink); background: var(--dj-soft); transition: background-color .25s ease, color .25s ease; }
.dc-tab:hover { background: #e8eaed; }
.dc-tab.is-on { background: var(--dj-ink); color: #fff; }
.dc-rows { display: grid; gap: 12px; margin-top: 40px; }
.dc-row { display: flex; align-items: center; gap: 24px; padding: 16px 24px 16px 16px; background: var(--dj-soft); color: var(--dj-ink); transition: background-color .25s ease; }
.dc-row:hover { background: #eceef1; }
.dc-row:hover .dc-title { color: var(--dj-link); }
.dc-thumb { position: relative; flex-shrink: 0; display: grid; place-items: center; width: 64px; aspect-ratio: 3 / 4; background: #fff; box-shadow: 0 4px 12px rgba(0, 0, 0, .06); }
.dc-thumb i { position: absolute; left: 0; bottom: 6px; width: 100%; text-align: center; font-style: normal; font-size: 10px; font-weight: 600; letter-spacing: .06em; color: var(--dj-muted); }
.dc-ico { width: 24px; height: 24px; margin-bottom: 10px; color: var(--dj-blue); }
.dc-main { flex: 1; min-width: 0; display: grid; gap: 4px; }
.dc-title { font-size: 16px; font-weight: 600; line-height: 1.35; transition: color 0.2s ease; }
.dc-desc { font-size: 14px; line-height: 1.5; color: var(--dj-text); }
.dc-meta { font-size: 13px; color: var(--dj-muted); }
.dc-more { flex-shrink: 0; }
.dc-empty { padding: 32px 0; text-align: center; font-size: 15px; color: var(--dj-muted); }
@media (max-width: 767px) {
  .dc-tabs { justify-content: flex-start; flex-wrap: nowrap; overflow-x: auto; scrollbar-width: none; }
  .dc-tabs::-webkit-scrollbar { display: none; }
  .dc-row { flex-wrap: wrap; align-items: flex-start; gap: 12px 16px; padding: 16px; }
  .dc-thumb { width: 48px; }
  .dc-main { flex-basis: calc(100% - 64px); }
  .dc-more { margin-left: 64px; }
}
</style>
