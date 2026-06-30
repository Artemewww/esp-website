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
    <section class="py-12 bg-esp-black text-white">
      <div class="container-custom">
        <div class="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div>
            <div class="text-4xl md:text-5xl font-rounded font-bold text-esp-green mb-2">150+</div>
            <p class="text-white/70 text-sm">Реализованных проектов</p>
          </div>
          <div>
            <div class="text-4xl md:text-5xl font-rounded font-bold text-esp-green mb-2">3</div>
            <p class="text-white/70 text-sm">Страны присутствия</p>
          </div>
          <div>
            <div class="text-4xl md:text-5xl font-rounded font-bold text-esp-green mb-2">30 000</div>
            <p class="text-white/70 text-sm">Элементов под контролем</p>
          </div>
          <div>
            <div class="text-4xl md:text-5xl font-rounded font-bold text-esp-green mb-2">0</div>
            <p class="text-white/70 text-sm">Аварийных сбоев</p>
          </div>
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
                ? 'bg-esp-blue text-white'
                : 'bg-esp-gray text-esp-black hover:bg-esp-blue/10'"
            >
              {{ category }}
            </button>
          </div>
          <span class="text-esp-black/50 text-sm font-inter">Найдено: {{ filteredProjects.length }} проектов</span>
        </div>
      </div>
    </section>

    <!-- Projects Grid -->
    <section class="section-padding bg-esp-gray">
      <div class="container-custom">
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div
            v-for="project in filteredProjects"
            :key="project.id"
            class="bg-white overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
          >
            <div class="h-56 bg-gradient-to-br from-esp-blue/20 via-esp-black to-esp-green/20 flex items-center justify-center relative">
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
              <div class="flex items-center justify-between border-t border-esp-gray pt-4">
                <span class="text-esp-green font-semibold text-sm">{{ project.result }}</span>
                <div class="flex flex-wrap gap-1">
                  <span v-for="tag in project.tags" :key="tag" class="px-2 py-0.5 bg-esp-gray text-esp-black/60 text-xs font-inter">{{ tag }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Empty state -->
        <div v-if="filteredProjects.length === 0" class="text-center py-20">
          <p class="text-esp-black/50 text-lg font-inter">Проекты по заданным критериям не найдены</p>
          <button @click="resetFilters" class="mt-4 text-esp-blue hover:text-esp-green font-medium transition-colors">Сбросить фильтры</button>
        </div>
      </div>
    </section>

    <!-- CTA -->
    <section class="section-padding text-white text-center" style="background: linear-gradient(135deg, #002366 0%, #006039 100%)">
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

useHead({
  title: 'Проекты ESP | Очистные сооружения под ключ: кейсы, фото, результаты',
  meta: [
    {
      name: 'description',
      content: 'Реализованные проекты ESP: 150+ очистных сооружений в РБ и СНГ. Кристальный просвет 5м, 3D-проектирование, пусконаладка. Скачайте кейсы в PDF.'
    }
  ]
})

const searchQuery = ref('')
const categories = ['Все', 'Промышленность', 'Коммунальное хозяйство', 'АПК', 'Логистика']
const activeCategory = ref('Все')

const projects = [
  {
    id: 1,
    name: 'Модернизация очистных сооружений Минского водоканала',
    location: 'Минск, Беларусь',
    desc: 'Комплексная реконструкция городской станции водоочистки. Внедрение BIM-проектирования и IoT-мониторинга.',
    result: 'Просвет 5м',
    category: 'Коммунальное хозяйство',
    year: '2024',
    tags: ['LiDAR', 'BIM', 'IoT']
  },
  {
    id: 2,
    name: 'Система очистки агрохолдинга «БелАгро»',
    location: 'Гродненская область',
    desc: 'Биологическая очистка производственных стоков свиноводческого комплекса с замкнутым циклом водопользования.',
    result: 'Экономия 40%',
    category: 'АПК',
    year: '2024',
    tags: ['Флотация', 'Биоочистка']
  },
  {
    id: 3,
    name: 'Промышленные стоки нефтеперерабатывающего завода',
    location: 'Россия, Москва',
    desc: 'Флотационная очистка нефтесодержащих стоков. Автоматизированные шкафы управления с SCADA-интеграцией.',
    result: '0 аварийных сбоев',
    category: 'Промышленность',
    year: '2023',
    tags: ['Флотация', 'SCADA', 'КНС']
  },
  {
    id: 4,
    name: 'Очистные сооружения молокозавода «Савушкин»',
    location: 'Брестская область',
    desc: 'Многоступенчатая очистка молочной сыворотки и производственных стоков с рециркуляцией воды.',
    result: 'Очистка 95%',
    category: 'АПК',
    year: '2023',
    tags: ['Мембраны', 'УФ', 'Флотация']
  },
  {
    id: 5,
    name: 'КНС для жилого квартала «Маяк»',
    location: 'Минск, Беларусь',
    desc: 'Автоматизированная канализационная насосная станция для жилого комплекса на 2500 квартир.',
    result: 'Автоматизация 100%',
    category: 'Коммунальное хозяйство',
    year: '2023',
    tags: ['КНС', 'Автоматизация']
  },
  {
    id: 6,
    name: 'Ливневые стоки логистического центра',
    location: 'Казахстан, Алматы',
    desc: 'Очистка поверхностных стоков с обширной территории логистического комплекса площадью 45 га.',
    result: '0 нарушений нормативов',
    category: 'Логистика',
    year: '2022',
    tags: ['ОРЛ', 'Ливневка']
  },
  {
    id: 7,
    name: 'Реконструкция КОС металлургического завода',
    location: 'Беларусь, Жлобин',
    desc: '3D-лидарное сканирование действующих сооружений и цифровой двойник для проектирования расширения.',
    result: 'Срок реализации 8 мес',
    category: 'Промышленность',
    year: '2022',
    tags: ['LiDAR', '3D', 'BIM']
  },
  {
    id: 8,
    name: 'Очистные сооружения птицефабрики «Дружба»',
    location: 'Минская область',
    desc: 'Биологическая очистка с денитрификацией и системой обеззараживания УФ-излучением.',
    result: 'Просвет воды 5м',
    category: 'АПК',
    year: '2021',
    tags: ['Биоочистка', 'УФ']
  },
  {
    id: 9,
    name: 'Городские очистные сооружения г. Барановичи',
    location: 'Барановичи, Беларусь',
    desc: 'Полный комплекс механической и биологической очистки хозяйственно-бытовых стоков.',
    result: 'Производительность 15 000 м³/сут',
    category: 'Коммунальное хозяйство',
    year: '2021',
    tags: ['Биоочистка', 'КНС', 'Фильтрация']
  }
]

const filteredProjects = computed(() => {
  let result = projects
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
