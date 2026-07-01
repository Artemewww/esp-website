<template>
  <div class="bg-white">
    <section class="py-6 border-b border-esp-gray">
      <div class="container-custom">
        <Breadcrumb :items="[{ label: 'О компании', to: '/about' }, { label: 'Нормативная документация' }]" />
      </div>
    </section>

    <section class="section-padding bg-white">
      <div class="container-custom">
        <span class="inline-block px-4 py-1.5 rounded-full bg-esp-blue/10 text-esp-blue text-sm font-medium mb-4 font-inter">
          Справочная база
        </span>
        <h1 class="font-rounded text-4xl md:text-5xl mb-6 text-esp-black">Нормативная документация</h1>
        <p class="text-xl text-esp-black/70 max-w-3xl mb-10">
          СанПиНы, СНиПы, ТКП и постановления Республики Беларусь в области водоснабжения, канализации и охраны водных ресурсов, которыми ESP руководствуется при проектировании.
        </p>

        <div class="relative max-w-2xl mb-6">
          <input
            v-model="search"
            type="search"
            placeholder="Найти документ по названию или категории..."
            class="w-full px-4 py-4 border border-esp-gray focus:border-esp-blue outline-none font-inter"
          />
        </div>

        <div class="flex flex-wrap gap-2 mb-8">
          <button
            v-for="cat in categories"
            :key="cat"
            @click="activeCategory = cat"
            class="px-4 py-2 text-sm font-medium transition-colors"
            :class="activeCategory === cat ? 'bg-esp-black text-white' : 'bg-esp-gray text-esp-black hover:bg-esp-black/10'"
          >{{ cat }}</button>
        </div>

        <div class="bg-esp-gray divide-y divide-white">
          <div
            v-for="doc in filteredDocs"
            :key="doc.id"
            class="flex items-center gap-4 px-5 py-4"
          >
            <div class="w-9 h-9 bg-esp-blue/10 flex items-center justify-center flex-shrink-0">
              <svg class="w-5 h-5 text-esp-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
              </svg>
            </div>
            <div class="flex-1 min-w-0">
              <h3 class="font-medium text-esp-black text-sm">{{ doc.title }}</h3>
              <p class="text-esp-black/50 text-xs">{{ doc.desc }}</p>
            </div>
            <span class="text-xs text-esp-black/40 flex-shrink-0 hidden sm:block">{{ doc.category }} · {{ doc.size }}</span>
            <button @click="requestDoc(doc)" class="text-esp-blue text-sm font-medium flex-shrink-0 whitespace-nowrap">Запросить →</button>
          </div>
          <p v-if="!filteredDocs.length" class="px-5 py-8 text-center text-esp-black/50 text-sm">Документы не найдены</p>
        </div>
      </div>
    </section>

    <!-- Request modal -->
    <div v-if="modalOpen" class="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div class="absolute inset-0 bg-esp-black/60" @click="modalOpen = false"></div>
      <div class="relative bg-white max-w-md w-full p-8 shadow-2xl">
        <button @click="modalOpen = false" class="absolute top-4 right-4 text-esp-black/50 hover:text-esp-black">✕</button>
        <div v-if="!sent">
          <h3 class="font-rounded text-xl font-semibold mb-2 text-esp-black">Запросить документ</h3>
          <p class="text-esp-black/60 text-sm mb-6">Оставьте e-mail — пришлём «{{ activeDoc }}» в формате PDF.</p>
          <form @submit.prevent="sent = true" class="space-y-4">
            <input required type="email" placeholder="E-mail" class="w-full px-4 py-3 border border-esp-gray focus:border-esp-blue outline-none font-inter" />
            <button type="submit" class="w-full btn-primary">Отправить запрос</button>
          </form>
        </div>
        <div v-else class="text-center py-6">
          <h3 class="font-rounded text-xl font-semibold mb-2 text-esp-black">Отправлено</h3>
          <p class="text-esp-black/60 text-sm">Документ придёт на почту в течение рабочего дня.</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { normativeDocuments } from '~/composables/useNormativeDocuments'

const search = ref('')
const categories = computed(() => ['Все', ...new Set(normativeDocuments.map(d => d.category))])
const activeCategory = ref('Все')

const filteredDocs = computed(() => {
  let r = normativeDocuments
  if (activeCategory.value !== 'Все') r = r.filter(d => d.category === activeCategory.value)
  if (search.value.trim()) {
    const q = search.value.toLowerCase()
    r = r.filter(d => d.title.toLowerCase().includes(q) || d.category.toLowerCase().includes(q))
  }
  return r
})

const modalOpen = ref(false)
const sent = ref(false)
const activeDoc = ref('')
const requestDoc = (doc) => {
  activeDoc.value = doc.title
  sent.value = false
  modalOpen.value = true
}

useHead({
  title: 'Нормативная документация | ESP',
  meta: [
    { name: 'description', content: 'СанПиНы, СНиПы, ТКП и постановления РБ в области водоснабжения и канализации, используемые ЭкоСервисПроект.' }
  ]
})
</script>
