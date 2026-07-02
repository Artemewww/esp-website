<template>
  <div v-if="vacancy" class="bg-white">
    <section class="py-6 border-b border-esp-gray">
      <div class="container-custom">
        <Breadcrumb :items="[{ label: 'Команда', to: '/team' }, { label: vacancy.title }]" />
      </div>
    </section>

    <!-- Hero -->
    <section class="section-padding bg-esp-gray">
      <div class="container-custom">
        <span class="inline-block px-4 py-1.5 rounded-full bg-esp-green/10 text-esp-green text-sm font-medium mb-4 font-inter">
          Открытая вакансия
        </span>
        <h1 class="font-rounded text-3xl md:text-5xl mb-8 text-esp-black">{{ vacancy.title }}</h1>

        <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div class="bg-white p-4">
            <span class="text-xs text-esp-black/40 uppercase">Локация</span>
            <p class="font-medium text-esp-black">{{ vacancy.location }}</p>
          </div>
          <div class="bg-white p-4">
            <span class="text-xs text-esp-black/40 uppercase">Уровень</span>
            <p class="font-medium text-esp-black">{{ vacancy.level }}</p>
          </div>
          <div class="bg-white p-4">
            <span class="text-xs text-esp-black/40 uppercase">Зарплата</span>
            <p class="font-medium text-esp-green">{{ vacancy.salary }}</p>
          </div>
          <div class="bg-white p-4">
            <span class="text-xs text-esp-black/40 uppercase">Занятость</span>
            <p class="font-medium text-esp-black">{{ vacancy.type }}</p>
          </div>
        </div>

        <a href="#apply" class="btn-primary inline-block mt-8">Откликнуться на вакансию</a>
      </div>
    </section>

    <!-- Mission -->
    <section class="section-padding bg-white">
      <div class="container-custom max-w-3xl border-l-4 border-esp-blue pl-6">
        <span class="text-xs uppercase text-esp-blue font-semibold">Ваш вызов в ESP</span>
        <p class="text-lg text-esp-black/80 mt-2 leading-relaxed">{{ vacancy.mission }}</p>
      </div>
    </section>

    <!-- Tasks & requirements -->
    <section class="section-padding bg-esp-gray">
      <div class="container-custom grid lg:grid-cols-2 gap-10">
        <div class="bg-white p-8">
          <h3 class="font-rounded text-xl font-semibold mb-6 text-esp-black">Ключевые задачи</h3>
          <div class="space-y-4">
            <div v-for="(t, i) in vacancy.tasks" :key="i" class="flex gap-3">
              <span class="w-6 h-6 rounded-full bg-esp-green text-white flex items-center justify-center text-xs font-bold flex-shrink-0">{{ i + 1 }}</span>
              <p class="text-esp-black/80 text-sm">{{ t }}</p>
            </div>
          </div>
        </div>

        <div class="bg-white p-8">
          <h3 class="font-rounded text-xl font-semibold mb-6 text-esp-black">Что мы ждём от вас</h3>
          <div class="space-y-4">
            <div v-for="(r, i) in vacancy.requirements" :key="i" class="border border-esp-gray p-4">
              <h4 class="font-semibold text-esp-black text-sm mb-1">{{ r.title }}</h4>
              <p class="text-esp-black/60 text-xs leading-relaxed">{{ r.desc }}</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Apply form -->
    <section id="apply" class="section-padding text-white" style="background: linear-gradient(135deg, #002366 0%, #000f33 100%)">
      <div class="container-custom max-w-2xl">
        <h2 class="font-rounded text-3xl mb-2">Готовы создавать экосистемы вместе?</h2>
        <p class="text-white/80 mb-8">Прикрепите резюме или ссылку на портфолио — HR-команда ответит в течение 48 часов.</p>

        <div v-if="sent" class="bg-white/10 border border-white/30 p-8 text-center">
          <p>Отклик отправлен. Мы свяжемся с вами в ближайшее время.</p>
        </div>
        <form v-else @submit.prevent="sent = true" class="bg-white text-esp-black p-8 space-y-4">
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <input required placeholder="ФИО" class="border border-esp-black/20 p-3 bg-esp-gray font-inter" />
            <input required type="email" placeholder="E-mail" class="border border-esp-black/20 p-3 bg-esp-gray font-inter" />
          </div>
          <input placeholder="Ссылка на портфолио / LinkedIn" class="w-full border border-esp-black/20 p-3 bg-esp-gray font-inter" />
          <textarea rows="3" placeholder="Сопроводительное письмо" class="w-full border border-esp-black/20 p-3 bg-esp-gray font-inter"></textarea>
          <button type="submit" class="btn-primary w-full justify-center">Отправить резюме</button>
        </form>
      </div>
    </section>
  </div>
  <div v-else class="section-padding text-center">
    <p class="text-esp-black/60">Вакансия не найдена.</p>
    <NuxtLink to="/team" class="text-esp-blue hover:underline">К списку вакансий</NuxtLink>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import { vacanciesList } from '~/composables/useVacancies'

const route = useRoute()
const vacancy = computed(() => vacanciesList.find(v => v.slug === route.params.slug))
const sent = ref(false)

useHead(() => ({
  title: vacancy.value ? `${vacancy.value.title} | Карьера в ESP` : 'Вакансия не найдена | ESP',
  meta: [{ name: 'description', content: vacancy.value?.mission || '' }],
  link: [{ rel: 'canonical', href: vacancy.value ? `https://ecoservisproekt.com/team/vacancies/${vacancy.value.slug}` : '' }]
}))
</script>
