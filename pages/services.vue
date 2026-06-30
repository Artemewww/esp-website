<template>
  <div>
    <!-- Hero -->
    <section class="section-padding bg-white">
      <div class="container-custom">
        <span class="inline-block px-4 py-1.5 rounded-full bg-esp-blue/10 text-esp-blue text-sm font-medium mb-4 font-inter">
          Полный спектр услуг
        </span>
        <h1 class="font-rounded text-5xl md:text-6xl mb-6 text-esp-black">
          Услуги ESP
        </h1>
        <p class="text-xl text-esp-black/80 max-w-3xl mb-8">
          От консультации до пусконаладки: полный цикл обслуживания систем очистки воды. Гарантия качества и 24/7 поддержка.
        </p>
      </div>
    </section>

    <!-- Services Grid -->
    <section class="section-padding bg-esp-gray">
      <div class="container-custom">
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div v-for="service in services" :key="service.id" class="bg-white p-8 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
            <div class="w-14 h-14 bg-esp-blue/10 flex items-center justify-center mb-6">
              <svg class="w-7 h-7 text-esp-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24" v-html="icons[service.icon]"></svg>
            </div>
            <h3 class="font-rounded text-xl font-semibold mb-3 text-esp-black">{{ service.title }}</h3>
            <p class="text-esp-black/70 mb-5 leading-relaxed">{{ service.desc }}</p>
            <ul class="space-y-2 text-sm text-esp-black/60">
              <li v-for="point in service.points" :key="point" class="flex gap-2">
                <span class="text-esp-green font-bold">✓</span>
                <span>{{ point }}</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>

    <!-- Process -->
    <section class="section-padding bg-white">
      <div class="container-custom">
        <div class="text-center mb-14">
          <h2 class="font-rounded text-3xl md:text-4xl mb-4 text-esp-black">Процесс сотрудничества</h2>
          <p class="text-lg text-esp-black/70 max-w-2xl mx-auto">
            От первого звонка до успешной эксплуатации: структурированный процесс работы с клиентами ESP
          </p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div v-for="(step, i) in processSteps" :key="i" class="relative">
            <div class="text-center">
              <div class="w-16 h-16 mx-auto mb-4 bg-esp-blue text-white rounded-full flex items-center justify-center font-rounded font-bold text-2xl">
                {{ i + 1 }}
              </div>
              <h3 class="font-rounded text-lg font-semibold mb-2 text-esp-black">{{ step.title }}</h3>
              <p class="text-esp-black/60 text-sm">{{ step.desc }}</p>
            </div>
            <div v-if="i < 3" class="hidden md:block absolute top-8 left-[60%] w-[40%] h-0.5 bg-esp-blue/20"></div>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA -->
    <section class="section-padding text-white text-center" style="background: linear-gradient(135deg, #002366 0%, #006039 100%)">
      <div class="container-custom max-w-4xl">
        <h2 class="font-rounded text-3xl md:text-4xl mb-6">Обсудите вашу задачу с инженером ESP</h2>
        <p class="text-lg mb-10 text-white/90 max-w-2xl mx-auto">
          Консультация совершенно бесплатна. Профессиональная оценка объекта и рекомендации по оптимизации.
        </p>
        <NuxtLink to="/contacts#contact-form" class="border-2 border-white text-white px-8 py-4 font-medium hover:bg-white hover:text-esp-blue transition inline-block">
          Запросить консультацию
        </NuxtLink>
      </div>
    </section>
  </div>
</template>

<script setup>
useHead({
  title: 'Услуги ESP | Проектирование, пусконаладка, поддержка очистных сооружений',
  meta: [
    {
      name: 'description',
      content: 'Услуги EcoServiceProject: консультация, проектирование BIM, поставка оборудования, монтаж, пусконаладка, техническое обслуживание, 24/7 поддержка.'
    }
  ]
})

const icons = {
  design: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 11h.01M12 11h.01M15 11h.01M4 7h16M4 11h4m-4 4h4"/>',
  networks: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 3v4M15 3v4M9 17v4M15 17v4M3 9h4M17 9h4M3 15h4M17 15h4M9 9h6v6H9z"/>',
  treatment: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 2C8 6 5 9.5 5 14a7 7 0 0014 0c0-4.5-3-8-7-12z"/>',
  production: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 21h18M5 21V9l5-4 5 4v12M9 21v-6h4v6M5 9l-2 2m18-2l2 2"/>',
  installation: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>',
  start: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/>',
  service: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 4a7 7 0 00-7 7c0 1.5.45 2.89 1.22 4.05L4 19l4-1.2A6.96 6.96 0 0011 18a7 7 0 000-14z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.5 6.5L19 2l1.5 1.5L16 8"/>',
  repair: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 4.5h2l.5 2.1a6.5 6.5 0 011.9 1.1l2-.8 1 1.7-1.6 1.4a6.5 6.5 0 010 2.2l1.6 1.4-1 1.7-2-.8a6.5 6.5 0 01-1.9 1.1L13 19.5h-2l-.5-2.1a6.5 6.5 0 01-1.9-1.1l-2 .8-1-1.7 1.6-1.4a6.5 6.5 0 010-2.2L5.6 10.4l1-1.7 2 .8a6.5 6.5 0 011.9-1.1L11 4.5z"/><circle cx="12" cy="12" r="2.5" stroke-width="2"/>',
  support: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8a9 9 0 0118 0M3 8v8a2 2 0 002 2h1v-7H4a1 1 0 00-1 1zM21 8v8a2 2 0 01-2 2h-1v-7h2a1 1 0 011 1z"/>'
}

const services = [
  {
    id: 1,
    icon: 'design',
    title: 'Проектирование инженерных сетей',
    desc: 'Проектирование инженерных сетей, систем водоснабжения и канализации для жилых, коммерческих и промышленных объектов.',
    points: ['Сети водоснабжения и канализации', 'Согласование с инстанциями', 'Рабочая документация', 'Авторский надзор']
  },
  {
    id: 2,
    icon: 'treatment',
    title: 'Проектирование очистных сооружений',
    desc: 'Полное 3D и BIM-проектирование очистных сооружений с использованием LiDAR-сканирования для максимальной точности.',
    points: ['LiDAR-сканирование объекта', '3D-модель в Revit', 'Выявление коллизий на стадии проекта', 'Гидравлические расчёты']
  },
  {
    id: 3,
    icon: 'networks',
    title: 'Строительное и архитектурное проектирование',
    desc: 'Проектирование зданий и сооружений для размещения очистного и насосного оборудования.',
    points: ['Архитектурные решения', 'Конструктивные разделы', 'Генплан и благоустройство', 'Экспертиза проекта']
  },
  {
    id: 4,
    icon: 'production',
    title: 'Производство очистных сооружений',
    desc: 'Собственное производство (Экомашины) — изготовление флотаторов, КНС, реакторов и ОРЛ-установок под заказ.',
    points: ['100% контроль качества', 'Полипропиленовые ёмкости и изделия', 'Изготовление по индивидуальным размерам', '5 лет гарантии']
  },
  {
    id: 5,
    icon: 'installation',
    title: 'Монтаж очистных сооружений',
    desc: 'Монтаж очистных сооружений, канализации и инженерных систем «под ключ» силами собственных бригад.',
    points: ['Монтаж под ключ', 'Сварочные и земляные работы', 'Электромонтаж и автоматизация', 'Сдача объекта заказчику']
  },
  {
    id: 6,
    icon: 'start',
    title: 'Пусконаладочные работы',
    desc: 'Полный цикл пусконаладочных работ: запуск оборудования, настройка автоматики, вывод на проектные параметры.',
    points: ['Запуск и настройка', 'Вывод на проектные параметры', 'Обучение операторов', 'Протоколы испытаний']
  },
  {
    id: 7,
    icon: 'service',
    title: 'Сервисное обслуживание',
    desc: 'Сервисное обслуживание очистных сооружений: плановые осмотры, замена расходных материалов, диагностика.',
    points: ['Плановое ТО', 'Замена фильтров и загрузки', 'Диагностика и анализ воды', 'Сервисные контракты']
  },
  {
    id: 8,
    icon: 'repair',
    title: 'Ремонт и реконструкция',
    desc: 'Ремонт и реконструкция очистных сооружений любой сложности, включая объекты сторонних производителей.',
    points: ['Капитальный ремонт', 'Реконструкция с расширением', 'Замена изношенных узлов', 'Модернизация автоматики']
  },
  {
    id: 9,
    icon: 'support',
    title: '24/7 Техническая поддержка',
    desc: 'Круглосуточная горячая линия с гарантированным временем отклика 4 часа для срочных проблем.',
    points: ['Быстрая диагностика', 'Удалённая поддержка', 'SLA 4 часа', 'Выезд инженера']
  }
]

const processSteps = [
  {
    title: 'Консультация',
    desc: 'Первичная встреча, анализ задачи и оценка объекта'
  },
  {
    title: 'Проектирование',
    desc: '3D-модель, калькуляция, согласование технического решения'
  },
  {
    title: 'Реализация',
    desc: 'Поставка оборудования, монтаж и пусконаладка'
  },
  {
    title: 'Поддержка',
    desc: 'Техническое обслуживание, мониторинг, гарантийное обслуживание'
  }
]
</script>
