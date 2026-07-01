<template>
  <div>
    <!-- Hero -->
    <section class="section-padding bg-white">
      <div class="container-custom">
        <span class="inline-block px-4 py-1.5 rounded-full bg-esp-blue/10 text-esp-blue text-sm font-medium mb-4 font-inter">
          Доказательство результата
        </span>
        <h1 class="font-rounded text-5xl md:text-6xl mb-6 text-esp-black">
          Реализованные проекты
        </h1>
        <p class="text-xl text-esp-black/80 max-w-3xl mb-8">
          Глубокое погружение в масштаб и чистоту. От идеи до кристального просвета 5м — каждый проект подтверждает «Эталон ESP».
        </p>

        <!-- Search -->
        <div class="relative max-w-2xl">
          <svg class="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-esp-black/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
          </svg>
          <input
            v-model="searchQuery"
            type="search"
            placeholder="Найти по отрасли, региону или технологии..."
            class="w-full pl-12 pr-4 py-4 border border-esp-gray hover:border-esp-blue focus:border-esp-blue focus:ring-2 focus:ring-esp-blue/20 outline-none transition font-inter text-esp-black"
          />
        </div>
      </div>
    </section>

    <!-- Stats -->
    <section class="py-12 bg-white border-y border-esp-gray">
      <div class="container-custom">
        <div class="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div>
            <div class="text-4xl md:text-5xl font-rounded font-bold text-esp-blue mb-2">150+</div>
            <p class="text-esp-black/60 text-sm">Реализованных проектов за 25 лет</p>
          </div>
          <div>
            <div class="text-4xl md:text-5xl font-rounded font-bold text-esp-blue mb-2">3</div>
            <p class="text-esp-black/60 text-sm">Страны присутствия</p>
          </div>
          <div>
            <div class="text-4xl md:text-5xl font-rounded font-bold text-esp-blue mb-2">30 000</div>
            <p class="text-esp-black/60 text-sm">Элементов под контролем</p>
          </div>
          <div>
            <div class="text-4xl md:text-5xl font-rounded font-bold text-esp-blue mb-2">0</div>
            <p class="text-esp-black/60 text-sm">Аварийных сбоев</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Map: География проектов -->
    <section id="map" class="section-padding bg-white">
      <div class="container-custom">
        <div class="text-center mb-12">
          <span class="inline-block px-4 py-1.5 rounded-full bg-esp-green/10 text-esp-green text-sm font-medium mb-4 font-inter">
            География проектов
          </span>
          <h2 class="font-rounded text-3xl md:text-4xl mb-4 text-esp-black">Проекты ESP на карте Беларуси</h2>
          <p class="text-lg text-esp-black/70 max-w-2xl mx-auto">
            Кликните на точку, чтобы открыть карточку проекта. Полный список — {{ projectsList.length }} объектов из портфолио ESP.
          </p>
        </div>

        <!-- Real interactive map with clickable placemarks (Leaflet) -->
        <div class="relative w-full bg-esp-gray border border-esp-gray mb-10 overflow-hidden">
          <ClientOnly>
            <ProjectsMap :points="mapPoints" class="w-full aspect-[4/3] md:aspect-[16/9]" />
            <template #fallback>
              <div class="w-full aspect-[4/3] md:aspect-[16/9] flex items-center justify-center text-esp-black/40 text-sm">
                Загрузка карты…
              </div>
            </template>
          </ClientOnly>
          <div class="absolute bottom-3 left-3 bg-esp-black text-white px-3 py-1.5 text-xs font-inter pointer-events-none z-[400]">
            12 объектов · клик по точке открывает проект
          </div>
        </div>

        <!-- Segmented by region -->
        <div class="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-3 mb-12">
          <button
            v-for="region in regions"
            :key="region.name"
            @click="activeRegion = region.name"
            class="px-4 py-3 text-sm font-medium transition-colors text-center"
            :class="activeRegion === region.name ? 'bg-esp-green text-white' : 'bg-esp-gray text-esp-black hover:bg-esp-green/10'"
          >
            {{ region.name }}
            <span class="block text-xs opacity-70">{{ region.count }} {{ region.count === 1 ? 'объект' : 'объектов' }}</span>
          </button>
        </div>

        <!-- Metrics: было / стало -->
        <div id="metrics" class="mb-12" style="scroll-margin-top: 100px;">
          <div class="text-center mb-10">
            <span class="inline-block px-4 py-1.5 rounded-full bg-esp-blue/10 text-esp-blue text-sm font-medium mb-4 font-inter">
              Доказательство результата
            </span>
            <h2 class="font-rounded text-3xl md:text-4xl mb-4 text-esp-black">Метрики: было / стало</h2>
            <p class="text-lg text-esp-black/70 max-w-2xl mx-auto">Реальные показатели очистки на объектах ESP до и после внедрения</p>
          </div>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            <NuxtLink
              v-for="proj in metricsShowcase"
              :key="proj.slug"
              :to="`/projects/${proj.slug}`"
              class="bg-esp-gray p-6 hover:shadow-lg transition-all duration-300 block"
            >
              <h3 class="font-rounded font-semibold text-esp-black text-sm mb-4">{{ proj.name }}</h3>
              <div class="flex items-center justify-between text-sm mb-2">
                <span class="text-red-500 font-medium">До: {{ proj.beforeValue }}</span>
                <span class="text-esp-black/30">→</span>
                <span class="text-esp-green font-medium">После: {{ proj.afterValue }}</span>
              </div>
              <span class="text-esp-blue text-xs font-medium">Открыть кейс →</span>
            </NuxtLink>
          </div>
        </div>

        <!-- Key objects table -->
        <div id="cases" class="overflow-x-auto" style="scroll-margin-top: 100px;">
          <table class="w-full text-sm border border-esp-gray">
            <thead>
              <tr class="bg-esp-black text-white text-left">
                <th class="p-4 font-rounded font-medium">Объект</th>
                <th class="p-4 font-rounded font-medium">Оборудование</th>
                <th class="p-4 font-rounded font-medium">Локация</th>
                <th class="p-4 font-rounded font-medium"></th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="proj in filteredByRegion" :key="proj.slug" class="border-t border-esp-gray hover:bg-esp-gray/50 transition">
                <td class="p-4 text-esp-black font-medium align-top">{{ proj.name }}</td>
                <td class="p-4 text-esp-black/70 align-top">
                  <NuxtLink
                    v-for="(eqSlug, i) in proj.equipmentSlugs"
                    :key="eqSlug"
                    :to="`/equipment/${eqSlug}`"
                    class="text-esp-blue hover:underline"
                  >{{ equipmentName(eqSlug) }}<span v-if="i < proj.equipmentSlugs.length - 1">, </span></NuxtLink>
                </td>
                <td class="p-4 text-esp-black/70 align-top">{{ proj.location }}</td>
                <td class="p-4 align-top">
                  <NuxtLink :to="`/projects/${proj.slug}`" class="text-esp-blue text-sm font-medium hover:underline whitespace-nowrap">Подробнее →</NuxtLink>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </section>

    <!-- Filters -->
    <section class="bg-white border-b border-esp-gray sticky top-0 z-10">
      <div class="container-custom">
        <div class="flex flex-wrap gap-3 py-5 items-center justify-between">
          <div class="flex flex-wrap gap-3">
            <button
              v-for="category in categories"
              :key="category"
              @click="activeCategory = category"
              class="px-5 py-2 font-medium transition-colors text-sm"
              :class="activeCategory === category
                ? 'bg-esp-black text-white'
                : 'bg-esp-gray text-esp-black hover:bg-esp-black/10'"
            >
              {{ category }}
            </button>
          </div>
          <div class="flex items-center gap-4">
            <span class="text-esp-black/50 text-sm font-inter hidden sm:inline">Найдено: {{ filteredProjects.length }} проектов</span>
            <div class="flex border border-esp-gray">
              <a href="#grid-view" class="px-3 py-2 bg-esp-black text-white" title="Список / сетка">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/>
                </svg>
              </a>
              <a href="#map" class="px-3 py-2 bg-white text-esp-black hover:bg-esp-gray transition" title="Карта">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"/>
                </svg>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Projects Grid -->
    <div id="grid-view"></div>
    <section class="section-padding bg-esp-gray">
      <div class="container-custom">
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <NuxtLink
            v-for="project in filteredProjects"
            :key="project.id"
            :to="`/projects/${project.slug}`"
            class="bg-white overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 block"
          >
            <div class="h-56 bg-gradient-to-br from-esp-blue/20 via-esp-black to-esp-blue/40 flex items-center justify-center relative">
              <div class="absolute inset-0 bg-esp-black/40 flex items-center justify-center">
                <span class="text-white/30 text-5xl font-rounded font-bold">ESP</span>
              </div>
              <span class="absolute top-4 left-4 px-3 py-1 bg-esp-green text-white text-xs font-medium">
                {{ project.category }}
              </span>
              <span class="absolute top-4 right-4 px-3 py-1 bg-white/10 backdrop-blur text-white text-xs font-inter">
                {{ project.year }}
              </span>
            </div>
            <div class="p-6">
              <h3 class="font-rounded text-xl mb-2 text-esp-black">{{ project.name }}</h3>
              <p class="text-esp-black/60 text-sm mb-1 font-inter">{{ project.location }}</p>
              <p class="text-esp-black/70 text-sm mb-4">{{ project.desc }}</p>
              <div class="flex items-center justify-between border-t border-esp-gray pt-4 mb-3">
                <span class="text-esp-green font-semibold text-sm">{{ project.result }}</span>
                <div class="flex flex-wrap gap-1">
                  <span v-for="tag in project.tags" :key="tag" class="px-2 py-0.5 bg-esp-gray text-esp-black/60 text-xs font-inter">{{ tag }}</span>
                </div>
              </div>
              <div class="flex flex-wrap gap-1">
                <span
                  v-for="eqSlug in project.equipmentSlugs"
                  :key="eqSlug"
                  class="px-2 py-0.5 bg-esp-blue/10 text-esp-blue text-xs font-inter"
                >{{ equipmentName(eqSlug) }}</span>
              </div>
            </div>
          </NuxtLink>
        </div>

        <!-- Empty state -->
        <div v-if="filteredProjects.length === 0" class="text-center py-20">
          <p class="text-esp-black/50 text-lg font-inter">Проекты по заданным критериям не найдены</p>
          <button @click="resetFilters" class="mt-4 text-esp-blue hover:text-esp-green font-medium transition-colors">Сбросить фильтры</button>
        </div>
      </div>
    </section>

    <!-- CTA -->
    <section class="section-padding text-white text-center" style="background: linear-gradient(135deg, #002366 0%, #000f33 100%)">
      <div class="container-custom max-w-4xl">
        <h2 class="font-rounded text-3xl md:text-4xl mb-6">Хотите такой же результат на вашем объекте?</h2>
        <p class="text-lg mb-10 text-white/90 max-w-2xl mx-auto">
          Главный инженер ESP проведёт технический аудит и подготовит индивидуальное решение для вашего объекта
        </p>
        <div class="flex flex-wrap justify-center gap-4">
          <NuxtLink to="/contacts#contact-form" class="border-2 border-white text-white px-8 py-4 font-medium hover:bg-white hover:text-esp-blue transition">
            Заказать технический аудит
          </NuxtLink>
          <NuxtLink to="/contacts" class="border-2 border-white text-white px-8 py-4 font-medium hover:bg-white hover:text-esp-blue transition">
            Скачать кейсы PDF
          </NuxtLink>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { projectsList } from '~/composables/useProjects'
import { equipmentList } from '~/composables/useEquipment'
import { useProjectGeo } from '~/composables/useProjectGeo'

useHead({
  title: 'Проекты ESP | Очистные сооружения под ключ: кейсы, фото, результаты',
  meta: [
    {
      name: 'description',
      content: 'Реализованные проекты ESP: 150+ очистных сооружений в РБ и СНГ. Кристальный просвет 5м, 3D-проектирование, пусконаладка. Скачайте кейсы в PDF.'
    }
  ]
})

const equipmentName = (slug) => equipmentList.find(e => e.slug === slug)?.name || slug

// ===== Карта проектов: реальные координаты по всем объектам =====
const { mapPoints } = useProjectGeo()
const metricsShowcase = computed(() => projectsList.slice(0, 3))

const regionCounts = computed(() => {
  const counts = {}
  projectsList.forEach(p => { counts[p.region] = (counts[p.region] || 0) + 1 })
  return counts
})

const regions = computed(() => {
  const known = ['Минская обл.', 'Брестская обл.', 'Гродненская обл.', 'Могилёвская обл.', 'Витебская обл.', 'Гомельская обл.', 'За пределами РБ']
  const list = known
    .filter(r => regionCounts.value[r])
    .map(r => ({ name: r, count: regionCounts.value[r] }))
  return [{ name: 'Все регионы', count: projectsList.length }, ...list]
})
const activeRegion = ref('Все регионы')

const filteredByRegion = computed(() => {
  if (activeRegion.value === 'Все регионы') return projectsList
  return projectsList.filter(p => p.region === activeRegion.value)
})

const searchQuery = ref('')
const categories = ['Все', 'Промышленность', 'Коммунальное хозяйство', 'АПК', 'Логистика']
const activeCategory = ref('Все')

const filteredProjects = computed(() => {
  let result = projectsList
  if (activeCategory.value !== 'Все') {
    result = result.filter(p => p.category === activeCategory.value)
  }
  if (searchQuery.value.trim()) {
    const q = searchQuery.value.toLowerCase()
    result = result.filter(p =>
      p.name.toLowerCase().includes(q) ||
      p.location.toLowerCase().includes(q) ||
      p.desc.toLowerCase().includes(q) ||
      p.tags.some(t => t.toLowerCase().includes(q))
    )
  }
  return result
})

const resetFilters = () => {
  activeCategory.value = 'Все'
  searchQuery.value = ''
}
</script>
