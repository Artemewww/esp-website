<template>
  <div class="ap">
    <section class="ap-sec ap-sec--first">
      <div class="ap-wrap">
        <Breadcrumb :items="[{ label: 'О компании', to: '/about' }, { label: 'Отзывы клиентов' }]" />
        <span class="ap-eyebrow rv-eyebrow">Социальное доказательство</span>
        <h1 class="ap-title">Отзывы клиентов</h1>
        <p class="ap-lede">
          С ESP работают более 600 организаций по всей Беларуси — от муниципальных водоканалов и промышленных предприятий до монастырей и санаториев. Ниже — часть наших клиентов.
        </p>

        <div class="ap-grid ap-grid--3 rv-grid">
          <div v-for="(org, i) in clientOrganizationsList" :key="i" class="ap-card rv-card">
            <span class="rv-mark" aria-hidden="true">{{ org[0] }}</span>
            <span class="rv-org">{{ org }}</span>
          </div>
        </div>
      </div>
    </section>

    <section class="ap-sec ap-sec--white">
      <div class="ap-wrap ap-wrap--narrow">
        <div class="ap-center">
          <h2 class="ap-h2">Оставить отзыв</h2>
          <p class="ap-lede">Работали с ESP? Поделитесь опытом — это поможет другим заказчикам.</p>
        </div>

        <div v-if="sent" class="ap-note-ok rv-form">
          Спасибо! Ваш отзыв отправлен на модерацию.
        </div>
        <form v-else class="ap-form rv-form" @submit.prevent="sent = true">
          <div class="ap-form-row">
            <input required placeholder="Ваше имя" aria-label="Ваше имя" class="ap-input" />
            <input required placeholder="Организация" aria-label="Организация" class="ap-input" />
          </div>
          <input required type="email" placeholder="E-mail" aria-label="E-mail" class="ap-input" />
          <textarea required rows="4" placeholder="Ваш отзыв о работе с ESP" aria-label="Ваш отзыв" class="ap-input"></textarea>
          <button type="submit" class="ap-btn ap-btn--block">Отправить отзыв</button>
        </form>
      </div>
    </section>

    <section class="ap-sec ap-cta">
      <div class="ap-wrap">
        <h2 class="ap-h2">Станьте следующей историей успеха</h2>
        <p class="ap-lede">Расскажите о вашем объекте — инженер ESP подготовит решение и оценку в течение 48 часов.</p>
        <div class="ap-actions">
          <NuxtLink to="/contacts#contact-form" class="ap-btn">Обсудить проект</NuxtLink>
        </div>
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

<style scoped>
.rv-eyebrow { margin-top: 1.5rem; }
.rv-grid { gap: 0.75rem; }
.rv-card { flex-direction: row; align-items: center; gap: 0.9rem; padding: 1.25rem 1.4rem; }
.rv-mark { display: grid; place-items: center; width: 36px; height: 36px; flex-shrink: 0; border-radius: 999px; background: rgba(0, 35, 102, 0.07); color: var(--ap-blue); font-size: 14px; font-weight: 700; }
.rv-org { font-size: 15px; line-height: 1.4; color: var(--ap-ink); }
.rv-form { margin-top: 2.5rem; }
</style>
