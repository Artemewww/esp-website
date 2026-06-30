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
    <section class="section-padding bg-esp-gray">
      <div class="container-custom">
        <div class="text-center mb-14">
          <h2 class="font-rounded text-3xl md:text-4xl mb-4 text-esp-black">Скачайте документацию</h2>
          <p class="text-lg text-esp-black/70 max-w-2xl mx-auto">
            Вся техническая документация в свободном доступе
          </p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div v-for="doc in documents" :key="doc.id" class="bg-white p-6 hover:shadow-lg transition-all">
            <div class="text-4xl mb-4">{{ doc.icon }}</div>
            <h3 class="font-rounded font-semibold text-esp-black mb-2">{{ doc.title }}</h3>
            <p class="text-esp-black/60 text-sm mb-4">{{ doc.desc }}</p>
            <div class="flex items-center justify-between">
              <span class="text-xs text-esp-black/40">{{ doc.size }}</span>
              <button class="px-4 py-2 bg-esp-blue text-white text-sm hover:bg-esp-blue/90 transition">
                Скачать
              </button>
            </div>
          </div>
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
    <section class="section-padding bg-esp-black text-white">
      <div class="container-custom">
        <div class="text-center mb-14">
          <h2 class="font-rounded text-3xl md:text-4xl mb-4">Онлайн-инструменты</h2>
          <p class="text-white/70 max-w-2xl mx-auto">
            Используйте готовые калькуляторы и генераторы для подбора оборудования
          </p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div v-for="tool in tools" :key="tool.id" class="bg-white/5 border border-white/10 p-8 hover:bg-white/10 transition">
            <div class="text-5xl mb-4">{{ tool.icon }}</div>
            <h3 class="font-rounded text-xl font-semibold mb-3">{{ tool.title }}</h3>
            <p class="text-white/70 text-sm mb-6">{{ tool.desc }}</p>
            <button class="px-6 py-3 bg-esp-green text-white font-medium hover:bg-esp-green/90 transition">
              Открыть инструмент
            </button>
          </div>
        </div>
      </div>
    </section>

    <!-- FAQ -->
    <section class="section-padding bg-white">
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
  {
    id: 1,
    icon: '📄',
    title: 'Каталог оборудования ESP',
    desc: 'Полный каталог всех серий оборудования с техническими характеристиками',
    size: '2.5 MB PDF'
  },
  {
    id: 2,
    icon: '📋',
    title: 'Руководство проектировщика',
    desc: 'Методика расчёта и проектирования систем очистки коммунальных и промышленных стоков',
    size: '1.8 MB PDF'
  },
  {
    id: 3,
    icon: '🔧',
    title: 'Руководство по монтажу',
    desc: 'Пошаговая инструкция монтажа и пусконаладки оборудования ESP',
    size: '1.2 MB PDF'
  },
  {
    id: 4,
    icon: '📊',
    title: 'Гидравлические расчёты',
    desc: 'Методики расчёта гидравлического сопротивления и потребляемой мощности',
    size: '0.8 MB PDF'
  },
  {
    id: 5,
    icon: '🧪',
    title: 'Рекомендации по анализу',
    desc: 'Параметры воды, методика забора проб, интерпретация результатов',
    size: '1.1 MB PDF'
  },
  {
    id: 6,
    icon: '⚠️',
    title: 'Техническая безопасность',
    desc: 'Требования безопасности при работе и обслуживании оборудования',
    size: '0.6 MB PDF'
  }
]

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
    icon: '🧮',
    title: 'Калькулятор подбора',
    desc: 'Автоматический подбор оборудования по параметрам воды и производительности'
  },
  {
    id: 2,
    icon: '📑',
    title: 'Генератор спецификаций',
    desc: 'Создание готовой спецификации в Excel или PDF для вашей системы'
  },
  {
    id: 3,
    icon: '🏗️',
    title: 'BIM-конструктор',
    desc: 'Скачайте BIM-модели для Revit и AutoCAD и встройте в свой проект'
  },
  {
    id: 4,
    icon: '⚡',
    title: 'Калькулятор мощности',
    desc: 'Расчёт энергопотребления и выбор электрооборудования'
  }
]

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
