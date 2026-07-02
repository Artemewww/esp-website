<template>
  <div class="bg-esp-gray min-h-screen">
    <section class="section-padding bg-white border-b border-esp-gray">
      <div class="container-custom">
        <span class="inline-block px-4 py-1.5 rounded-full bg-esp-blue/10 text-esp-blue text-sm font-medium mb-4 font-inter">
          Поиск по сайту
        </span>
        <h1 class="font-rounded text-3xl md:text-4xl mb-6 text-esp-black">Поиск по проектам, оборудованию и технологиям</h1>

        <div class="relative max-w-2xl">
          <input
            v-model="query"
            type="text"
            placeholder="Например: флотация, лидар, ОРЛ, Минский водоканал..."
            class="w-full px-5 py-4 pl-12 border-2 border-esp-black bg-esp-gray font-inter focus:outline-none focus:border-esp-blue"
          />
          <span class="absolute left-4 top-1/2 -translate-y-1/2 text-esp-black/40">🔍</span>
          <button v-if="query" @click="query = ''" class="absolute right-4 top-1/2 -translate-y-1/2 text-esp-black/40 hover:text-esp-black">✕</button>
        </div>

        <div class="mt-4 flex flex-wrap gap-2 text-sm text-esp-black/60">
          <span>Популярные запросы:</span>
          <button @click="query = 'флотация'" class="text-esp-blue font-medium hover:underline">#флотация</button>
          <button @click="query = 'лидар'" class="text-esp-blue font-medium hover:underline">#лидар</button>
          <button @click="query = 'ОРЛ'" class="text-esp-blue font-medium hover:underline">#ОРЛ</button>
          <button @click="query = 'КНС'" class="text-esp-blue font-medium hover:underline">#КНС</button>
        </div>
      </div>
    </section>

    <section class="container-custom py-12">
      <div class="flex flex-wrap gap-2 mb-8 bg-white border border-esp-gray p-1 w-fit">
        <button
          v-for="tab in tabs"
          :key="tab.id"
          @click="activeTab = tab.id"
          class="px-4 py-2 text-sm font-medium transition"
          :class="activeTab === tab.id ? 'bg-esp-black text-white' : 'text-esp-black/70 hover:bg-esp-gray'"
        >
          {{ tab.label }} ({{ tab.id === 'all' ? matchingTab.length : searchIndex.filter(r => r.type === tab.id && matchesQuery(r)).length }})
        </button>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div class="lg:col-span-9 lg:col-start-1 space-y-4">
          <NuxtLink
            v-for="(item, idx) in filteredAll"
            :key="idx"
            :to="item.link"
            class="block bg-white border border-esp-gray p-6 hover:border-esp-blue transition-colors"
          >
            <div class="flex justify-between items-start gap-4 mb-2">
              <span class="text-xs uppercase bg-esp-gray text-esp-black/60 px-2 py-0.5 font-medium">{{ item.category }}</span>
              <span v-if="item.meta" class="text-xs text-esp-green font-medium">{{ item.meta }}</span>
            </div>
            <h3 class="font-rounded font-semibold text-lg text-esp-black mb-1">{{ item.title }}</h3>
            <p class="text-esp-black/70 text-sm leading-relaxed">{{ item.desc }}</p>
          </NuxtLink>

          <div v-if="filteredAll.length === 0" class="bg-white border border-dashed border-esp-black/30 p-12 text-center">
            <p class="text-esp-black font-medium mb-1">Ничего не найдено по запросу «{{ query }}»</p>
            <p class="text-esp-black/50 text-sm">Попробуйте изменить формулировку или воспользуйтесь хэштегами выше.</p>
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
  ...technologiesList.map(t => ({
    type: 'technologies',
    title: t.title,
    desc: t.desc,
    category: 'Технологии',
    meta: '',
    link: `/technologies/${t.slug}`,
    haystack: `${t.title} ${t.desc}`.toLowerCase()
  })),
  ...articlesList.map(a => ({
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
