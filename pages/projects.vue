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

    <!-- Map: География проектов -->
    <section id="map" class="section-padding bg-white">
      <div class="container-custom">
        <div class="text-center mb-12">
          <span class="inline-block px-4 py-1.5 rounded-full bg-esp-green/10 text-esp-green text-sm font-medium mb-4 font-inter">
            География проектов
          </span>
          <h2 class="font-rounded text-3xl md:text-4xl mb-4 text-esp-black">300+ объектов по всей Беларуси</h2>
          <p class="text-lg text-esp-black/70 max-w-2xl mx-auto">
            От локальных очистных до промышленных комплексов — карта реализованных проектов ESP
          </p>
        </div>

        <div class="aspect-[16/7] w-full mb-12 border border-esp-gray overflow-hidden">
          <iframe
            src="https://yandex.ru/map-widget/v1/?ll=27.95%2C53.55&z=7"
            class="w-full h-full"
            frameborder="0"
            loading="lazy"
            title="Карта реализованных проектов ESP по Беларуси"
          ></iframe>
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
            <span class="block text-xs opacity-70">{{ region.count }} объектов</span>
          </button>
        </div>

        <!-- Key objects table -->
        <div class="overflow-x-auto">
          <table class="w-full text-sm border border-esp-gray">
            <thead>
              <tr class="bg-esp-black text-white text-left">
                <th class="p-4 font-rounded font-medium">Заказчик</th>
                <th class="p-4 font-rounded font-medium">Оборудование</th>
                <th class="p-4 font-rounded font-medium">Объект</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(obj, i) in filteredKeyObjects" :key="i" class="border-t border-esp-gray hover:bg-esp-gray/50 transition">
                <td class="p-4 text-esp-black font-medium align-top">{{ obj.customer }}</td>
                <td class="p-4 text-esp-black/70 align-top">{{ obj.equipment }}</td>
                <td class="p-4 text-esp-black/70 align-top">{{ obj.site }}</td>
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

// ===== Карта проектов: регионы и ключевые объекты (на основе реализованных объектов ESP) =====
const regions = [
  { name: 'Все регионы', count: 300 },
  { name: 'Минская обл.', count: 95 },
  { name: 'Брестская обл.', count: 58 },
  { name: 'Гродненская обл.', count: 47 },
  { name: 'Могилёвская обл.', count: 44 },
  { name: 'Витебская обл.', count: 38 },
  { name: 'Гомельская обл.', count: 18 }
]
const activeRegion = ref('Все регионы')

const keyObjects = [
  { customer: 'КУП «Петриковский райжилкомхоз»', equipment: 'Станция биологической очистки (2200 м³/сутки)', site: '«Канализация и очистные сооружения г. Петрикова»', region: 'Гомельская обл.' },
  { customer: 'СПК «Агрокомбинат Снов»', equipment: 'Станция очистки производственных сточных вод (1500 м³/сутки)', site: '«Станция биологической очистки сточных вод в д. Снов Несвижского района»', region: 'Минская обл.' },
  { customer: 'ОАО «Витебская бройлерная фабрика»', equipment: 'Станция полной биологической очистки (3000 м³/сутки)', site: '«Строительство очистных сооружений ОАО «Витебская бройлерная птицефабрика»', region: 'Витебская обл.' },
  { customer: 'РУП «Белоруснефть-Особино»', equipment: 'Станция полной биологической очистки (2400 м³/сутки)', site: '«Строительство очистных сооружений РУП «Белоруснефть – Особино»', region: 'Гомельская обл.' },
  { customer: 'КУПП «Городокское предприятие котельных и тепловых сетей»', equipment: 'Станция полной биологической очистки (1500 м³/сутки)', site: '«Реконструкция с расширением очистных сооружений г. Городка»', region: 'Витебская обл.' },
  { customer: 'ООО «Витконпродукт»', equipment: 'Очистные сооружения цеха по убою птицы (700 м³/сут.)', site: 'Компактные очистные с аэробной стабилизацией ила, г.п. Шумилино', region: 'Витебская обл.' },
  { customer: 'ООО «Белагротерминал»', equipment: 'Очистные сооружения маслоэкстракционного завода (МЭЗ)', site: 'Производственно-логистический комплекс в г. Сморгонь', region: 'Гродненская обл.' },
  { customer: 'ОАО «Комаровка»', equipment: 'Станция биологической очистки (680 м³/сутки)', site: 'Очистные сооружения птицефабрики при д. Приборово Брестского района', region: 'Брестская обл.' },
  { customer: 'КУП «УКС Мингорисполкома»', equipment: 'Станция полной биологической очистки «Роса» (215 м³/сутки)', site: 'Психоневрологический интернат №1, Минский р-н', region: 'Минская обл.' },
  { customer: 'РУП «Главное управление капстроительства» Управделами Президента РБ', equipment: 'Станция очистки ВС 500, ВС 75, илонакопитель, насосы, КНС, ОРЛ 15-С', site: 'Республиканский горнолыжный центр в д. Силичи Логойского р-на', region: 'Минская обл.' },
  { customer: 'ОАО «Гомельстекло»', equipment: 'Установка очистки ливневых вод ОРЛ 200-С', site: 'Сети канализации предприятия ОАО «Гомельстекло»', region: 'Гомельская обл.' },
  { customer: 'Островецкое РУП ЖКХ', equipment: 'Станция очистки сточных вод ВС 100', site: 'Локальные очистные и канализация в д. Кемелишки Островецкого р-на', region: 'Гродненская обл.' },
  { customer: 'Кричевское УКПП «Водоканал»', equipment: 'Биологические очистные сооружения ВС 250', site: 'Вынос очистных с прибрежной зоны р. Белянка, д. Бель Кричевского района', region: 'Могилёвская обл.' },
  { customer: 'Corporation China National Electric Engineering Co.', equipment: 'Станция ВС 400, КНС «Кватро-3», обеззараживание CHL', site: '«Строительство Витебской ГЭС на реке З.Двина» Польдер №1', region: 'Витебская обл.' },
  { customer: 'РУП «Гроднооблнефтепродукт»', equipment: 'Установка очистки ливневых вод ОРЛ 6-С', site: 'АЗС на 250 заправок в сутки', region: 'Гродненская обл.' },
  { customer: 'ОАО «Полесьежилстрой»', equipment: 'Станция очистки сточных вод ВС 500 с комплектующими', site: 'Брестский психоневрологический дом-интернат, район д. Волки', region: 'Брестская обл.' },
  { customer: 'УКС Минского р-на', equipment: 'Миниклар ДС 25', site: '5 одноквартирных жилых домов д. Городище Минского района', region: 'Минская обл.' },
  { customer: 'ОАО «Могилёвский мясокомбинат»', equipment: 'Очистные сооружения хозяйственно-бытовой канализации ВС 200', site: 'Свиноводческий комплекс на 24 тыс. голов в год, д. Перегон', region: 'Могилёвская обл.' }
]

const filteredKeyObjects = computed(() => {
  if (activeRegion.value === 'Все регионы') return keyObjects
  return keyObjects.filter(o => o.region === activeRegion.value)
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
