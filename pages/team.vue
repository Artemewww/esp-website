<template>
  <div>
    <!-- Hero -->
    <section class="section-padding bg-white">
      <div class="container-custom">
        <span class="inline-block px-4 py-1.5 rounded-full bg-esp-green/10 text-esp-green text-sm font-medium mb-4 font-inter">
          Синергия опыта
        </span>
        <h1 class="font-rounded text-5xl md:text-6xl mb-6 text-esp-black">
          Команда ESP
        </h1>
        <p class="text-xl text-esp-black/80 max-w-3xl mb-8">
          100+ инженеров и специалистов с опытом 25+ лет. Поколения знаний: от основателя к современным экспертам в очистке воды.
        </p>
      </div>
    </section>

    <!-- Team Stats -->
    <section class="py-12 bg-esp-black text-white">
      <div class="container-custom">
        <div class="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div>
            <div class="text-4xl md:text-5xl font-rounded font-bold text-esp-green mb-2">100+</div>
            <p class="text-white/70 text-sm">Специалистов</p>
          </div>
          <div>
            <div class="text-4xl md:text-5xl font-rounded font-bold text-esp-green mb-2">25+</div>
            <p class="text-white/70 text-sm">Лет опыта</p>
          </div>
          <div>
            <div class="text-4xl md:text-5xl font-rounded font-bold text-esp-green mb-2">150+</div>
            <p class="text-white/70 text-sm">Проектов реализовано</p>
          </div>
          <div>
            <div class="text-4xl md:text-5xl font-rounded font-bold text-esp-green mb-2">3</div>
            <p class="text-white/70 text-sm">Поколения инженеров</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Departments -->
    <section class="section-padding bg-esp-gray">
      <div class="container-custom">
        <div class="text-center mb-14">
          <h2 class="font-rounded text-3xl md:text-4xl mb-4 text-esp-black">Структура команды</h2>
          <p class="text-lg text-esp-black/70 max-w-2xl mx-auto">
            Каждый отдел ESP отвечает за экселленс в своей области
          </p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div v-for="dept in departments" :key="dept.id" class="bg-white p-8 hover:shadow-lg transition-all">
            <div class="text-5xl mb-4">{{ dept.icon }}</div>
            <h3 class="font-rounded text-xl font-semibold mb-2 text-esp-black">{{ dept.title }}</h3>
            <p class="text-esp-black/70 text-sm mb-4">{{ dept.desc }}</p>
            <p class="text-sm font-medium text-esp-green">{{ dept.team }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Culture -->
    <section class="section-padding bg-white">
      <div class="container-custom">
        <div class="lg:grid lg:grid-cols-2 lg:gap-12 lg:items-center">
          <div>
            <h2 class="font-rounded text-3xl md:text-4xl mb-6 text-esp-black">Культура ESP</h2>
            <div class="space-y-6">
              <div class="flex gap-4">
                <div class="text-3xl flex-shrink-0">🎯</div>
                <div>
                  <h4 class="font-rounded font-semibold text-esp-black mb-1">Совершенство в каждой детали</h4>
                  <p class="text-esp-black/70 text-sm">Мы не останавливаемся на "хорошо". Только "Эталон качества".</p>
                </div>
              </div>
              <div class="flex gap-4">
                <div class="text-3xl flex-shrink-0">🤝</div>
                <div>
                  <h4 class="font-rounded font-semibold text-esp-black mb-1">Партнёрство как образ жизни</h4>
                  <p class="text-esp-black/70 text-sm">Мы работаем вместе с клиентом, а не для клиента. Ваш успех — наш успех.</p>
                </div>
              </div>
              <div class="flex gap-4">
                <div class="text-3xl flex-shrink-0">💡</div>
                <div>
                  <h4 class="font-rounded font-semibold text-esp-black mb-1">Инновации как необходимость</h4>
                  <p class="text-esp-black/70 text-sm">LiDAR, 3D, IoT — мы в авангарде цифровизации индустрии.</p>
                </div>
              </div>
              <div class="flex gap-4">
                <div class="text-3xl flex-shrink-0">🌱</div>
                <div>
                  <h4 class="font-rounded font-semibold text-esp-black mb-1">Ответственность перед природой</h4>
                  <p class="text-esp-black/70 text-sm">Каждый проект — это забота о чистоте воды на Земле.</p>
                </div>
              </div>
            </div>
          </div>
          <div class="mt-12 lg:mt-0 bg-esp-gray p-12 rounded-lg">
            <p class="text-lg text-esp-black mb-6">
              "Мы строим бизнес на двух столпах: опыт отца-основателя и технологии сына. Результат — премиальный партнёр для систем очистки мирового уровня."
            </p>
            <div class="flex items-center gap-3">
              <div class="w-12 h-12 bg-esp-blue rounded-full flex items-center justify-center text-white font-bold">ЭС</div>
              <div>
                <p class="font-rounded font-semibold text-esp-black text-sm">Управляющий директор ESP</p>
                <p class="text-esp-black/60 text-xs">25 лет в отрасли очистки воды</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA -->
    <section class="section-padding text-white text-center" style="background: linear-gradient(135deg, #002366 0%, #006039 100%)">
      <div class="container-custom max-w-4xl">
        <h2 class="font-rounded text-3xl md:text-4xl mb-6">Присоединитесь к команде инноваторов</h2>
        <p class="text-lg mb-10 text-white/90 max-w-2xl mx-auto">
          ESP ищет талантливых инженеров, проектировщиков и специалистов, которые разделяют нашу страсть к совершенству.
        </p>
        <NuxtLink to="/contacts" class="border-2 border-white text-white px-8 py-4 font-medium hover:bg-white hover:text-esp-blue transition inline-block">
          Отправить резюме
        </NuxtLink>
      </div>
    </section>
  </div>
</template>

<script setup>
useHead({
  title: 'Команда ESP | 100+ инженеров с 25-летним опытом в очистке воды',
  meta: [
    {
      name: 'description',
      content: 'Команда EcoServiceProject: 100+ профессионалов, 25+ лет опыта, три поколения инженеров. Структура: проектирование, производство, инжиниринг, поддержка.'
    }
  ]
})

const departments = [
  {
    id: 1,
    icon: '🎨',
    title: 'Проектирование и Инжиниринг',
    desc: '3D-моделирование, BIM-разработка, LiDAR-сканирование, гидравлические расчеты',
    team: '25+ инженеров'
  },
  {
    id: 2,
    icon: '🏭',
    title: 'Производство',
    desc: 'Производство оборудования, контроль качества, сборка, испытания',
    team: '30+ производственников'
  },
  {
    id: 3,
    icon: '🔬',
    title: 'Лабораторные исследования',
    desc: 'Анализ качества воды, тестирование технологий, разработка инноваций',
    team: '10+ специалистов'
  },
  {
    id: 4,
    icon: '🚀',
    title: 'Монтаж и Пусконаладка',
    desc: 'Выезды на объекты, монтаж оборудования, обучение операторов',
    team: '20+ мастеров'
  },
  {
    id: 5,
    icon: '💼',
    title: 'Техническая Поддержка',
    desc: '24/7 горячая линия, консультации, диагностика, удалённая помощь',
    team: '15+ диспетчеров'
  },
  {
    id: 6,
    icon: '📊',
    title: 'Администрация и Управление',
    desc: 'Стратегия, финансы, логистика, управление проектами',
    team: '5+ менеджеров'
  }
]
</script>
