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

    <!-- Turnkey Process -->
    <section class="section-padding bg-white">
      <div class="container-custom">
        <span class="inline-block px-4 py-1.5 rounded-full bg-esp-blue/10 text-esp-blue text-sm font-medium mb-4 font-inter">
          Комплексный подход «под ключ»
        </span>
        <h2 class="font-rounded text-3xl md:text-4xl mb-4 text-esp-black">От замысла до кристальной воды</h2>
        <p class="text-lg text-esp-black/70 max-w-2xl mb-12">
          Мы не поставляем разрозненное оборудование. Мы проектируем, производим, монтируем и передаём работающую интеллектуальную экосистему с гарантией результата и последующим обучением персонала. 7 шагов проектирования и строительства вашего очистного комплекса.
        </p>

        <div class="space-y-3">
          <div v-for="(stage, i) in turnkeyStages" :key="stage.num" class="border border-esp-gray">
            <button
              @click="openStage = openStage === i ? null : i"
              class="w-full flex items-center gap-5 p-5 text-left hover:bg-esp-gray/50 transition"
            >
              <span class="font-rounded font-bold text-esp-blue text-lg w-10 flex-shrink-0">{{ stage.num }}</span>
              <div class="flex-1">
                <h3 class="font-rounded font-semibold text-esp-black">{{ stage.title }}</h3>
                <p class="text-esp-black/60 text-sm">{{ stage.desc }}</p>
              </div>
              <svg class="w-5 h-5 text-esp-black/40 flex-shrink-0 transition-transform" :class="{ 'rotate-180': openStage === i }" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/>
              </svg>
            </button>
            <div v-show="openStage === i" class="px-5 pb-5 pl-[3.75rem]">
              <ul class="space-y-2 mb-3">
                <li v-for="d in stage.details" :key="d" class="flex gap-2 text-sm text-esp-black/70">
                  <span class="text-esp-green font-bold">✓</span>
                  <span>{{ d }}</span>
                </li>
              </ul>
              <NuxtLink :to="`/services/process/${stage.slug}`" class="text-esp-blue text-sm font-medium hover:underline">
                Открыть страницу этапа →
              </NuxtLink>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA -->
    <section class="relative section-padding text-white text-center overflow-hidden" style="background: linear-gradient(135deg, #002366 0%, #000f33 100%)">
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
import { ref } from 'vue'
import { servicesList, serviceIcons } from '~/composables/useServices'
import { turnkeyStagesList } from '~/composables/useTurnkeyProcess'

useHead({
  title: 'Услуги ESP | Проектирование, пусконаладка, поддержка очистных сооружений',
  meta: [
    {
      name: 'description',
      content: 'Услуги EcoServiceProject: консультация, проектирование BIM, поставка оборудования, монтаж, пусконаладка, техническое обслуживание, 24/7 поддержка.'
    },
    { property: 'og:title', content: 'Услуги ESP | Проектирование, монтаж, пусконаладка' },
    { property: 'og:description', content: 'Полный цикл услуг «под ключ»: проектирование BIM, производство, монтаж, пусконаладка, сервис и ремонт очистных сооружений.' },
    { property: 'og:image', content: 'https://ecoservisproekt.com/images/team/team-collaboration.png' }
  ],
  link: [{ rel: 'canonical', href: 'https://ecoservisproekt.com/services' }]
})

const openStage = ref(null)
const turnkeyStages = turnkeyStagesList
</script>
