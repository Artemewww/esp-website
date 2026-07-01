<template>
  <div>
    <!-- Hero -->
    <section class="section-padding bg-white">
      <div class="container-custom">
        <span class="inline-block px-4 py-1.5 rounded-full bg-esp-lidar/10 text-esp-blue text-sm font-medium mb-4 font-inter">
          Библиотека знаний
        </span>
        <h1 class="font-rounded text-5xl md:text-6xl mb-6 text-esp-black">
          Ресурсы и документы
        </h1>
        <p class="text-xl text-esp-black/80 max-w-3xl mb-8">
          Техническая документация, ГОСТы, стандарты качества, инструкции, калькуляторы и полезные материалы для проектировщиков.
        </p>
      </div>
    </section>

    <!-- Downloads Section -->
    <section id="library" class="section-padding bg-esp-gray">
      <div class="container-custom">
        <div class="mb-10">
          <span class="inline-block px-4 py-1.5 rounded-full bg-esp-blue/10 text-esp-blue text-sm font-medium mb-4 font-inter">
            Библиотека проектировщика
          </span>
          <h2 class="font-rounded text-3xl md:text-4xl mb-3 text-esp-black">Центр технической документации и BIM-активов</h2>
          <p class="text-esp-black/50 text-xs font-inter uppercase tracking-wide">Опросные листы · Инструкции по монтажу · BIM/CAD файлы по запросу · ISO 9001</p>
        </div>

        <div class="relative max-w-2xl mb-6">
          <svg class="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-esp-black/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
          </svg>
          <input
            v-model="docSearch"
            type="search"
            placeholder="Найти паспорт, опросный лист, инструкцию..."
            class="w-full pl-12 pr-4 py-4 border border-esp-gray focus:border-esp-blue outline-none transition font-inter text-esp-black"
          />
        </div>

        <div class="flex flex-wrap gap-3 mb-8">
          <button
            v-for="cat in docCategories"
            :key="cat"
            @click="activeDocCategory = cat"
            class="px-5 py-2 text-sm font-medium transition-colors"
            :class="activeDocCategory === cat ? 'bg-esp-black text-white' : 'bg-white text-esp-black hover:bg-esp-black/10'"
          >{{ cat }}</button>
        </div>

        <div class="bg-white divide-y divide-esp-gray">
          <a
            v-for="doc in filteredDocuments"
            :key="doc.id"
            :href="doc.href"
            target="_blank"
            rel="noopener"
            class="flex items-center gap-4 px-5 py-4 hover:bg-esp-gray/50 transition-colors"
          >
            <div class="w-9 h-9 bg-esp-blue/10 flex items-center justify-center flex-shrink-0">
              <svg class="w-5 h-5 text-esp-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
              </svg>
            </div>
            <h3 class="font-medium text-esp-black text-sm flex-1 leading-snug">{{ doc.title }}</h3>
            <span class="text-xs text-esp-black/40 flex-shrink-0">{{ doc.category }}</span>
            <span class="text-esp-blue text-sm font-medium flex-shrink-0 whitespace-nowrap">Скачать →</span>
          </a>
          <p v-if="!filteredDocuments.length" class="px-5 py-8 text-center text-esp-black/50 text-sm">Документы не найдены</p>
        </div>
      </div>
    </section>

    <!-- Standards & Certifications -->
    <section class="section-padding bg-white">
      <div class="container-custom">
        <div class="text-center mb-14">
          <h2 class="font-rounded text-3xl md:text-4xl mb-4 text-esp-black">Стандарты и сертификации</h2>
          <p class="text-lg text-esp-black/70 max-w-2xl mx-auto">
            Все системы ESP разработаны в соответствии с международными стандартами
          </p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div v-for="std in standards" :key="std.id" class="border-l-4 border-esp-green p-6 bg-esp-gray">
            <h3 class="font-rounded font-semibold text-esp-black mb-2">{{ std.title }}</h3>
            <p class="text-esp-black/70 text-sm mb-3">{{ std.desc }}</p>
            <p class="text-xs text-esp-black/50">{{ std.details }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Tools -->
    <section id="calculator" class="section-padding bg-esp-black text-white">
      <div class="container-custom">
        <div class="text-center mb-14">
          <h2 class="font-rounded text-3xl md:text-4xl mb-4">Онлайн-инструменты</h2>
          <p class="text-white/70 max-w-2xl mx-auto">
            Используйте готовые калькуляторы и генераторы для подбора оборудования
          </p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div v-for="tool in tools" :key="tool.id" class="bg-white/5 border border-white/10 p-8 hover:bg-white/10 transition">
            <div class="w-12 h-12 bg-white/10 flex items-center justify-center mb-5">
              <svg class="w-6 h-6 text-esp-green" fill="none" stroke="currentColor" viewBox="0 0 24 24" v-html="tool.icon"></svg>
            </div>
            <h3 class="font-rounded text-xl font-semibold mb-3">{{ tool.title }}</h3>
            <p class="text-white/70 text-sm mb-6">{{ tool.desc }}</p>
            <button @click="toolModalOpen = tool.id" class="px-6 py-3 bg-esp-green text-white font-medium hover:bg-esp-green/90 transition">
              Открыть инструмент
            </button>
          </div>
        </div>
      </div>
    </section>

    <!-- Subscribe -->
    <section id="subscribe" class="py-12 bg-esp-gray">
      <div class="container-custom flex flex-col md:flex-row items-center justify-between gap-6">
        <div>
          <h2 class="font-rounded text-xl font-semibold text-esp-black mb-1">Подписка на новости и блог ESP</h2>
          <p class="text-esp-black/60 text-sm" id="blog">Статьи об отрасли, новые проекты, технологии — раз в месяц на вашу почту</p>
        </div>
        <form @submit.prevent="subscribed = true" class="flex w-full md:w-auto gap-2">
          <input v-if="!subscribed" v-model="subscribeEmail" required type="email" placeholder="Ваш e-mail" class="flex-1 md:w-64 px-4 py-3 border border-esp-gray focus:border-esp-blue outline-none font-inter" />
          <button v-if="!subscribed" type="submit" class="px-6 py-3 bg-esp-blue text-white font-medium hover:bg-esp-blue/90 transition whitespace-nowrap">Подписаться</button>
          <span v-else class="px-4 py-3 text-esp-green font-medium">✓ Вы подписаны</span>
        </form>
      </div>
    </section>

    <!-- Tool Modal -->
    <div v-if="toolModalOpen" class="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div class="absolute inset-0 bg-esp-black/60" @click="toolModalOpen = null"></div>
      <div class="relative bg-white max-w-md w-full p-8 shadow-2xl text-center">
        <button @click="toolModalOpen = null" class="absolute top-4 right-4 text-esp-black/50 hover:text-esp-black">✕</button>
        <h3 class="font-rounded text-xl font-semibold mb-2 text-esp-black">{{ tools.find(t => t.id === toolModalOpen)?.title }}</h3>
        <p class="text-esp-black/60 text-sm mb-6">Полная версия инструмента доступна на странице «Оборудование». Откройте каталог, чтобы рассчитать и подобрать оборудование под ваш объект.</p>
        <NuxtLink to="/equipment#tools" class="btn-primary inline-block" @click="toolModalOpen = null">Перейти в каталог оборудования</NuxtLink>
      </div>
    </div>

    <!-- FAQ -->
    <section id="faq" class="section-padding bg-white">
      <div class="container-custom max-w-3xl">
        <div class="text-center mb-14">
          <h2 class="font-rounded text-3xl md:text-4xl mb-4 text-esp-black">Частые вопросы</h2>
          <p class="text-lg text-esp-black/70">
            Ответы на самые распространённые вопросы о системах очистки воды
          </p>
        </div>

        <div class="space-y-4">
          <details v-for="(faq, i) in faqs" :key="i" class="group border-b border-esp-gray pb-4">
            <summary class="flex justify-between items-center cursor-pointer font-rounded font-semibold text-esp-black hover:text-esp-green transition">
              {{ faq.q }}
              <svg class="w-5 h-5 transition-transform group-open:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
              </svg>
            </summary>
            <p class="text-esp-black/70 text-sm mt-3">{{ faq.a }}</p>
          </details>
        </div>
      </div>
    </section>

    <!-- CTA -->
    <section class="section-padding text-white text-center" style="background: linear-gradient(135deg, #002366 0%, #006039 100%)">
      <div class="container-custom max-w-4xl">
        <h2 class="font-rounded text-3xl md:text-4xl mb-6">Не нашли нужную информацию?</h2>
        <p class="text-lg mb-10 text-white/90 max-w-2xl mx-auto">
          Обратитесь к нашему техническому отделу. Мы подготовим для вас любые документы и расчеты.
        </p>
        <NuxtLink to="/contacts" class="border-2 border-white text-white px-8 py-4 font-medium hover:bg-white hover:text-esp-blue transition inline-block">
          Связаться с техническим отделом
        </NuxtLink>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

useHead({
  title: 'Ресурсы ESP | Документация, стандарты, калькуляторы, ГОСТы',
  meta: [
    {
      name: 'description',
      content: 'Ресурсы EcoServiceProject: техническая документация, ГОСТы, стандарты ISO, каталоги оборудования, калькуляторы подбора, BIM-библиотека для скачивания.'
    }
  ]
})

const documents = [
  { id: 1, title: 'Станции очистки сточных вод типа ДС — файл для скачивания', href: 'https://ecoservisproekt.com/upload/iblock/fa4/fa470f4784a902a2497d9c3d20ceafae.pdf', category: 'Паспорта' },
  { id: 2, title: 'Станции очистки сточных вод типа ДС — опросный лист', href: 'https://ecoservisproekt.com/upload/iblock/1f2/1f2236add9dda924caa0cebd06733a35.pdf', category: 'Паспорта' },
  { id: 3, title: 'Станции очистки сточных вод типа ВС — файл для скачивания', href: 'https://ecoservisproekt.com/upload/iblock/a06/a061e1daeaf55d5ae573298ef562d82c.pdf', category: 'Паспорта' },
  { id: 4, title: 'Схема расположения модулей ВС35 – ВС500 (план, разрез)', href: 'https://ecoservisproekt.com/upload/iblock/7e9/7e96bd3d6de7594a5b95e849b8cc4469.pdf', category: 'Чертежи' },
  { id: 5, title: 'Станции очистки сточных вод типа ВС — опросный лист', href: 'https://ecoservisproekt.com/upload/iblock/b84/b8402ea060eb48ae840aa2e043212706.pdf', category: 'Паспорта' },
  { id: 6, title: 'Установки очистки ливневых вод ОРЛ и ОРЛ-С — файл для скачивания', href: 'https://ecoservisproekt.com/upload/iblock/71e/71eaf61d2da5c0c8a5e504f96385aa06.pdf', category: 'Паспорта' },
  { id: 7, title: 'Установки очистки ливневых вод ОРЛ и ОРЛ-С — опросный лист', href: 'https://ecoservisproekt.com/upload/iblock/d8d/d8d878ce4255616ba670cdc18e9b8c79.pdf', category: 'Паспорта' },
  { id: 8, title: 'Инструкция по монтажу сооружений ОРЛ-С (ORL-S)', href: 'https://ecoservisproekt.com/upload/iblock/163/163a856ebd36e70508390588f7528e26.pdf', category: 'Инструкции' },
  { id: 9, title: 'Ленточный сборник нефтепродуктов «ОРОЛ» — файл для скачивания', href: 'https://ecoservisproekt.com/upload/iblock/358/358e8ff637e475f5b81db26760013238.pdf', category: 'Паспорта' },
  { id: 10, title: 'Канализационные насосные станции «Кватро» — опросный лист', href: 'https://ecoservisproekt.com/upload/iblock/7a8/7a85fdc0fe74dc79c58fad66cec53b6d.pdf', category: 'Паспорта' },
  { id: 11, title: 'Гравитационные жироуловители ЛТ — опросный лист', href: 'https://ecoservisproekt.com/upload/iblock/780/780841fce67fac581a46b3fc0258d43c.pdf', category: 'Паспорта' },
  { id: 12, title: 'Ультразвуковые расходомеры MQU 99-S,C — инструкция пользователя', href: 'https://ecoservisproekt.com/upload/iblock/ae9/ae9e8e0d0ebf6f1bd1f9c0933a94dcd2.pdf', category: 'Инструкции' },
  { id: 13, title: 'Нефтесорбент «Фиброил» — техническое описание', href: 'https://ecoservisproekt.com/upload/iblock/f41/f419806311d0091701082e0513e379b8.pdf', category: 'Паспорта' },
  { id: 14, title: 'Воздуходувки «KUBÍČEK» — каталог технических параметров', href: 'https://ecoservisproekt.com/upload/iblock/ad5/ad50902872d1e88bf1e9efbe2397b84a.pdf', category: 'Паспорта' },
  { id: 15, title: 'Воздуходувки «KUBÍČEK» — инструкция по эксплуатации', href: 'https://ecoservisproekt.com/upload/iblock/080/0807434930d265ea7aa853da2fe54f39.pdf', category: 'Инструкции' },
  { id: 16, title: 'Воздуходувки «KUBÍČEK» — сервисная книга', href: 'https://ecoservisproekt.com/upload/iblock/207/2071e0d08d8d9faab13eca7299a2faf2.pdf', category: 'Инструкции' }
]

const docCategories = ['Любой доступ', 'BIM (.RFA, .IFC)', 'Чертежи', 'Инструкции', 'Паспорта']
const activeDocCategory = ref('Любой доступ')
const docSearch = ref('')

const filteredDocuments = computed(() => {
  let r = documents
  if (activeDocCategory.value !== 'Любой доступ') {
    r = r.filter(d => d.category === activeDocCategory.value || (activeDocCategory.value.startsWith('BIM') && d.category === 'BIM'))
  }
  if (docSearch.value.trim()) {
    const q = docSearch.value.toLowerCase()
    r = r.filter(d => d.title.toLowerCase().includes(q))
  }
  return r
})

const standards = [
  {
    id: 1,
    title: 'ISO 9001:2015',
    desc: 'Система управления качеством',
    details: 'Сертификат подтверждает соответствие всех процессов ESP международным стандартам качества'
  },
  {
    id: 2,
    title: 'ISO 14001:2015',
    desc: 'Экологический менеджмент',
    details: 'Подтверждение экологической ответственности и соответствия методов производства требованиям охраны природы'
  },
  {
    id: 3,
    title: 'ГОСТ РБ EN 12566-3',
    desc: 'Малые системы очистки сточных вод',
    details: 'Требования и методы испытания локальных сооружений для отдельных объектов'
  },
  {
    id: 4,
    title: 'СНиП 3.05.04',
    desc: 'Наружные сети и сооружения водоснабжения и канализации',
    details: 'Нормы проектирования и строительства систем водоснабжения и водоотведения'
  }
]

const tools = [
  {
    id: 1,
    icon: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 11h.01M12 11h.01M15 11h.01M4 7h16M4 11h4m-4 4h4"/>',
    title: 'Калькулятор подбора',
    desc: 'Автоматический подбор оборудования по параметрам воды и производительности'
  },
  {
    id: 2,
    icon: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>',
    title: 'Генератор спецификаций',
    desc: 'Создание готовой спецификации в Excel или PDF для вашей системы'
  },
  {
    id: 3,
    icon: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/>',
    title: 'BIM-конструктор',
    desc: 'Скачайте BIM-модели для Revit и AutoCAD и встройте в свой проект'
  },
  {
    id: 4,
    icon: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/>',
    title: 'Калькулятор мощности',
    desc: 'Расчёт энергопотребления и выбор электрооборудования'
  }
]

const toolModalOpen = ref(null)
const subscribeEmail = ref('')
const subscribed = ref(false)

const faqs = [
  {
    q: 'Какой размер системы оптимален для моего объекта?',
    a: 'Размер зависит от количества людей, производства и качества входящей воды. Рекомендуем провести техническую консультацию для точного подбора.'
  },
  {
    q: 'Гарантия на оборудование — как долго?',
    a: 'Все системы ESP поставляются с 5-летней гарантией. Дополнительно можно расширить до 7-10 лет и подписать сервисный контракт.'
  },
  {
    q: 'Есть ли готовые BIM-модели?',
    a: 'Да, все оборудование ESP имеет готовые параметризованные модели для Revit и AutoCAD. Скачайте их из нашей BIM-библиотеки.'
  },
  {
    q: 'Какие расходные материалы нужны?',
    a: 'Основные: фильтрующие загрузки, реагенты, УФ-лампы. Полный перечень для конкретной системы найдёте в документации оборудования.'
  },
  {
    q: 'Есть ли услуга техническая поддержка?',
    a: 'Да, доступна 24/7 горячая линия с гарантированным откликом 4 часа. Включает диагностику, удалённую помощь и выезды инженера.'
  }
]
</script>
