<template>
  <div class="bg-esp-gray min-h-screen">
    <section class="section-padding bg-white border-b border-esp-gray">
      <div class="container-custom">
        <span class="inline-block px-4 py-1.5 rounded-full bg-esp-blue/10 text-esp-blue text-sm font-medium mb-4 font-inter">
          Интеллектуальный навигатор
        </span>
        <h1 class="font-rounded text-3xl md:text-4xl mb-6 text-esp-black">Поиск по проектам и технологиям</h1>

        <div class="relative max-w-2xl">
          <input
            v-model="query"
            type="text"
            placeholder="Например: 5м просвет, мембраны, лидар..."
            class="w-full px-5 py-4 pl-12 border-2 border-esp-black bg-esp-gray font-inter focus:outline-none focus:border-esp-blue"
          />
          <span class="absolute left-4 top-1/2 -translate-y-1/2 text-esp-black/40">🔍</span>
          <button v-if="query" @click="query = ''" class="absolute right-4 top-1/2 -translate-y-1/2 text-esp-black/40 hover:text-esp-black">✕</button>
        </div>

        <div class="mt-4 flex flex-wrap gap-2 text-sm text-esp-black/60">
          <span>Популярные запросы:</span>
          <button @click="query = '5м просвет'" class="text-esp-blue font-medium hover:underline">#5м просвет</button>
          <button @click="query = 'мембраны'" class="text-esp-blue font-medium hover:underline">#мембраны</button>
          <button @click="query = 'лидар'" class="text-esp-blue font-medium hover:underline">#лидар</button>
        </div>
      </div>
    </section>

    <section v-if="query.toLowerCase().includes('5м')" class="container-custom pt-8">
      <div class="bg-gradient-to-r from-esp-green/10 to-esp-blue/10 border-2 border-esp-black p-6">
        <div class="flex items-center gap-2 mb-3 text-esp-green font-semibold text-sm uppercase font-inter">
          ✨ ESP Smart Answer
        </div>
        <p class="text-esp-black/80 leading-relaxed">
          Кристальный просвет очищенной воды в 5 метров достигается за счёт синергии мембранной ультрафильтрации (поры 0.01–0.02 мкм блокируют любые взвеси) и частотно-регулируемой аэрационной оксигенации. Подробнее — в разделе «Технологии».
        </p>
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
          {{ tab.label }} ({{ tab.id === 'all' ? filteredAll.length : results.filter(r => r.type === tab.id).length }})
        </button>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div class="lg:col-span-3 bg-white border border-esp-gray p-5 space-y-5">
          <span class="text-xs uppercase font-semibold text-esp-black/40 block pb-2 border-b border-esp-gray">Фильтры</span>
          <div>
            <label class="block text-xs font-semibold text-esp-black uppercase mb-2">Раздел</label>
            <select v-model="sector" class="w-full bg-esp-gray border border-esp-black/20 text-sm p-2.5 outline-none">
              <option value="all">Все разделы</option>
              <option value="projects">Проекты</option>
              <option value="equipment">Оборудование</option>
              <option value="services">Услуги</option>
            </select>
          </div>
        </div>

        <div class="lg:col-span-9 space-y-4">
          <div
            v-for="(item, idx) in filteredAll"
            :key="idx"
            class="bg-white border border-esp-gray p-6 hover:border-esp-blue transition-colors"
          >
            <div class="flex justify-between items-start gap-4 mb-2">
              <span class="text-xs uppercase bg-esp-gray text-esp-black/60 px-2 py-0.5 font-medium">{{ item.category }}</span>
              <span class="text-xs text-esp-green font-medium">{{ item.meta }}</span>
            </div>
            <h3 class="font-rounded font-semibold text-lg text-esp-black mb-1">{{ item.title }}</h3>
            <p class="text-esp-black/70 text-sm leading-relaxed" v-html="item.desc"></p>
          </div>

          <div v-if="filteredAll.length === 0" class="bg-white border border-dashed border-esp-black/30 p-12 text-center">
            <p class="text-esp-black font-medium mb-1">Ничего не найдено по данному запросу</p>
            <p class="text-esp-black/50 text-sm">Попробуйте изменить формулировку или воспользуйтесь хэштегами выше.</p>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

useHead({
  title: 'Поиск | ESP',
  meta: [{ name: 'description', content: 'Интеллектуальный поиск по проектам, оборудованию и технологиям ESP.' }]
})

const query = ref('')
const sector = ref('all')
const activeTab = ref('all')

const tabs = [
  { id: 'all', label: 'Все' },
  { id: 'projects', label: 'Проекты' },
  { id: 'equipment', label: 'Оборудование' },
  { id: 'services', label: 'Услуги' }
]

const results = [
  {
    type: 'projects',
    title: 'Очистные сооружения Минского водоканала',
    desc: 'Многоэтапный биореактор MBR очистки воды с выводом мутности до <mark>5 метров</mark> прозрачности.',
    category: 'Проекты',
    meta: '25 000 м³/сут · Revit BIM'
  },
  {
    type: 'equipment',
    title: 'ESP-Membrane-Pro X200',
    desc: 'Ультрафильтрационные модули для удаления бактериологических угроз и снижения <mark>мутности</mark>.',
    category: 'Оборудование',
    meta: '5 лет гарантии · PVDF'
  },
  {
    type: 'services',
    title: 'Лидарное интерактивное 3D-сканирование',
    desc: 'Лазерный замер с точностью облака точек до <mark>миллиметра</mark> перед BIM-проектированием.',
    category: 'Услуги',
    meta: 'SLA 48 часов · PDF-чертёж'
  }
]

const filteredAll = computed(() => {
  return results.filter(r => {
    if (activeTab.value !== 'all' && r.type !== activeTab.value) return false
    if (sector.value !== 'all' && r.type !== sector.value) return false
    const q = query.value.toLowerCase()
    if (!q) return true
    return r.title.toLowerCase().includes(q) || r.desc.toLowerCase().includes(q)
  })
})
</script>
