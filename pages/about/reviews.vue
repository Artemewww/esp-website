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
        <h1 class="font-rounded text-4xl md:text-5xl mb-6 text-esp-black">Отзывы клиентов</h1>
        <p class="text-xl text-esp-black/70 max-w-3xl mb-14">
          С ESP работают более 600 организаций по всей Беларуси — от муниципальных водоканалов и промышленных предприятий до монастырей и санаториев. Ниже — часть наших клиентов.
        </p>

        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-16">
          <div
            v-for="(org, i) in clientOrganizationsList"
            :key="i"
            class="bg-esp-gray p-5 flex items-center gap-3 hover:bg-esp-blue/10 transition-colors"
          >
            <span class="w-8 h-8 rounded-full bg-esp-blue text-white flex items-center justify-center text-xs font-bold flex-shrink-0">
              {{ org[0] }}
            </span>
            <span class="text-sm text-esp-black/80 leading-snug">{{ org }}</span>
          </div>
        </div>

        <!-- Leave a review form -->
        <div class="bg-esp-gray p-8 md:p-10 max-w-2xl">
          <h2 class="font-rounded text-2xl mb-2 text-esp-black">Оставить отзыв</h2>
          <p class="text-esp-black/60 mb-6">Работали с ESP? Поделитесь опытом — это поможет другим заказчикам.</p>

          <div v-if="sent" class="p-5 bg-esp-green/10 border border-esp-green text-esp-green text-center font-medium">
            Спасибо! Ваш отзыв отправлен на модерацию.
          </div>
          <form v-else @submit.prevent="sent = true" class="space-y-4">
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <input required placeholder="Ваше имя" class="border border-esp-black/20 p-3 bg-white font-inter" />
              <input required placeholder="Организация" class="border border-esp-black/20 p-3 bg-white font-inter" />
            </div>
            <input required type="email" placeholder="E-mail" class="w-full border border-esp-black/20 p-3 bg-white font-inter" />
            <textarea required rows="4" placeholder="Ваш отзыв о работе с ESP" class="w-full border border-esp-black/20 p-3 bg-white font-inter"></textarea>
            <button type="submit" class="btn-primary">Отправить отзыв</button>
          </form>
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
import { ref } from 'vue'
import { clientOrganizationsList } from '~/composables/useReviews'

const sent = ref(false)

useHead({
  title: 'Отзывы клиентов | ESP',
  meta: [
    { name: 'description', content: 'Более 600 организаций доверяют ЭкоСервисПроект: водоканалы, агрохолдинги, промышленные предприятия, учреждения.' }
  ]
})
</script>
