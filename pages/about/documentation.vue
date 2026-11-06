<template>
  <div class="ap">
    <section class="ap-sec ap-sec--first">
      <div class="ap-wrap">
        <Breadcrumb :items="[{ label: 'О компании', to: '/about' }, { label: 'Нормативная документация' }]" />
        <span class="ap-eyebrow dc-eyebrow">Справочная база</span>
        <h1 class="ap-title">Нормативная документация</h1>
        <p class="ap-lede">
          СанПиНы, СНиПы, ТКП и постановления Республики Беларусь в области водоснабжения, канализации и охраны водных ресурсов, которыми ESP руководствуется при проектировании.
        </p>

        <div class="dc-search">
          <input
            v-model="search"
            type="search"
            placeholder="Найти документ по названию или категории..."
            aria-label="Поиск документа"
            class="ap-input"
          />
        </div>

        <div class="ap-tabs" role="tablist" aria-label="Категории документов">
          <button
            v-for="cat in categories"
            :key="cat"
            type="button"
            role="tab"
            :aria-selected="activeCategory === cat"
            class="ap-tab"
            :class="{ 'is-on': activeCategory === cat }"
            @click="activeCategory = cat"
          >{{ cat }}</button>
        </div>

        <div class="ap-rows">
          <a
            v-for="doc in filteredDocs"
            :key="doc.id"
            :href="doc.href"
            target="_blank"
            rel="noopener"
            class="ap-row dc-row"
          >
            <svg class="dc-ico" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.6" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
            </svg>
            <div class="dc-main">
              <h3 class="dc-title">{{ doc.title }}</h3>
              <p class="ap-small">{{ doc.desc }}</p>
            </div>
            <span class="ap-small dc-meta">{{ doc.category }} · {{ doc.size }}</span>
            <span class="ap-link">Смотреть PDF ›</span>
          </a>
          <p v-if="!filteredDocs.length" class="ap-text dc-empty">Документы не найдены</p>
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
.dc-eyebrow { margin-top: 1.5rem; }
.dc-search { max-width: 42rem; margin-top: 2rem; }
.dc-row { flex-wrap: nowrap; justify-content: flex-start; gap: 1rem; color: var(--ap-ink); }
.dc-row:hover .dc-title { color: var(--ap-link); }
.dc-ico { width: 24px; height: 24px; flex-shrink: 0; color: var(--ap-blue); }
.dc-main { flex: 1; min-width: 0; }
.dc-title { font-size: 15px; font-weight: 600; line-height: 1.35; transition: color 0.2s ease; }
.dc-meta { flex-shrink: 0; }
.dc-empty { padding: 2rem 0; text-align: center; }
@media (max-width: 767px) {
  .dc-row { flex-wrap: wrap; }
  .dc-ico { display: none; }
  .dc-main { flex-basis: 100%; }
  .dc-meta { display: none; }
}
</style>
