<template>
  <div class="bg-white">
    <section class="py-6 border-b border-esp-gray">
      <div class="container-custom">
        <Breadcrumb :items="[{ label: 'О компании', to: '/about' }, { label: 'Отзывы клиентов' }]" />
      </div>
    </section>

    <section class="section-padding bg-white">
      <div class="container-custom">
        <span class="inline-block px-4 py-1.5 rounded-full bg-esp-blue/10 text-esp-blue text-sm font-medium mb-4 font-inter">
          Социальное доказательство
        </span>
        <h1 class="font-rounded text-4xl md:text-5xl mb-6 text-esp-black">Отзывы клиентов ESP</h1>
        <p class="text-xl text-esp-black/70 max-w-3xl mb-14">
          Реальные слова людей, которые доверили нам очистку своих объектов — от муниципальных водоканалов до частных производств.
        </p>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div v-for="r in reviewsList" :key="r.id" class="bg-esp-gray p-6 flex flex-col">
            <div class="flex items-center gap-4 mb-4">
              <img :src="r.photo" :alt="r.name" class="w-14 h-14 rounded-full object-cover flex-shrink-0" />
              <div>
                <h3 class="font-rounded font-semibold text-esp-black text-sm leading-tight">{{ r.name }}</h3>
                <p class="text-esp-black/50 text-xs">{{ r.role }}</p>
              </div>
            </div>
            <div class="text-esp-blue text-sm mb-3">{{ '★'.repeat(r.rating) }}</div>
            <p class="text-esp-black/70 text-sm leading-relaxed italic flex-1">«{{ r.quote }}»</p>
            <NuxtLink :to="`/projects/${r.projectSlug}`" class="text-esp-blue text-sm font-medium mt-5 hover:underline">
              Смотреть проект →
            </NuxtLink>
          </div>
        </div>
      </div>
    </section>

    <section class="section-padding text-white text-center" style="background: linear-gradient(135deg, #002366 0%, #000f33 100%)">
      <div class="container-custom max-w-3xl">
        <h2 class="font-rounded text-2xl md:text-3xl mb-4">Станьте следующей историей успеха</h2>
        <p class="text-white/90 mb-8">Расскажите о вашем объекте — инженер ESP подготовит решение и оценку в течение 48 часов.</p>
        <NuxtLink to="/contacts#contact-form" class="border-2 border-white text-white px-8 py-4 font-medium hover:bg-white hover:text-esp-blue transition inline-block">
          Обсудить проект
        </NuxtLink>
      </div>
    </section>
  </div>
</template>

<script setup>
import { reviewsList } from '~/composables/useReviews'

useHead({
  title: 'Отзывы клиентов | ESP',
  meta: [
    { name: 'description', content: 'Отзывы клиентов EcoServiceProject: водоканалы, агрохолдинги, промышленные предприятия о работе с ESP.' }
  ]
})
</script>
