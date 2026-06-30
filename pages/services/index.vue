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
          <NuxtLink
            v-for="service in servicesList"
            :key="service.id"
            :to="`/services/${service.slug}`"
            class="bg-white p-8 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 block"
          >
            <div class="w-14 h-14 bg-esp-blue/10 flex items-center justify-center mb-6">
              <svg class="w-7 h-7 text-esp-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24" v-html="serviceIcons[service.icon]"></svg>
            </div>
            <h3 class="font-rounded text-xl font-semibold mb-3 text-esp-black">{{ service.title }}</h3>
            <p class="text-esp-black/70 mb-5 leading-relaxed">{{ service.desc }}</p>
            <ul class="space-y-2 text-sm text-esp-black/60 mb-4">
              <li v-for="point in service.points" :key="point" class="flex gap-2">
                <span class="text-esp-green font-bold">✓</span>
                <span>{{ point }}</span>
              </li>
            </ul>
            <span class="text-esp-blue text-sm font-medium">Подробнее об услуге →</span>
          </NuxtLink>
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
    <section class="relative section-padding text-white text-center overflow-hidden" style="background: linear-gradient(135deg, #002366 0%, #006039 100%)">
      <DottedSurface />
      <div class="container-custom max-w-4xl relative z-10">
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
import { servicesList, serviceIcons } from '~/composables/useServices'

useHead({
  title: 'Услуги ESP | Проектирование, пусконаладка, поддержка очистных сооружений',
  meta: [
    {
      name: 'description',
      content: 'Услуги EcoServiceProject: консультация, проектирование BIM, поставка оборудования, монтаж, пусконаладка, техническое обслуживание, 24/7 поддержка.'
    }
  ]
})

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
