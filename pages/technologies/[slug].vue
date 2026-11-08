<template>
  <div v-if="tech" class="ap">
    <!-- Шапка: крошки, надзаголовок, крупный заголовок, ключевые показатели -->
    <section class="ap-sec ap-sec--first">
      <div class="ap-wrap">
        <Breadcrumb class="ts-crumbs" :items="[{ label: 'Технологии', to: '/technologies' }, { label: tech.shortTitle }]" />
        <span class="ap-eyebrow">Технология очистки</span>
        <h1 class="ap-title">{{ tech.title }}</h1>
        <p class="ap-lede">{{ tech.desc }}</p>
        <div class="ap-actions">
          <NuxtLink to="/contacts#contact-form" class="ap-btn">Запросить расчёт</NuxtLink>
          <button type="button" class="ap-btn ap-btn--ghost" @click="downloadModal = true">
            Скачать тех. паспорт
          </button>
        </div>
        <ul class="ap-grid ap-grid--4 ts-badges">
          <li v-for="b in tech.badges" :key="b.label" class="ap-card">
            <ApIcon :name="b.icon" class="ts-badge-ico" />
            <span class="ap-small">{{ b.label }}</span>
            <b class="ts-badge-val">{{ b.value }}</b>
          </li>
        </ul>
      </div>
    </section>

    <!-- Steps -->
    <section class="ap-sec ap-sec--white">
      <div class="ap-wrap">
        <span class="ap-eyebrow">Как это работает</span>
        <h2 class="ap-h2">5 шагов очистки высокой степени надёжности</h2>
        <ol class="ap-grid ts-steps">
          <li v-for="(step, i) in tech.steps" :key="i" class="ap-card">
            <span class="ts-num">{{ i + 1 }}</span>
            <h3 class="ts-step-title">{{ step.title }}</h3>
            <p class="ap-small">{{ step.desc }}</p>
          </li>
        </ol>
      </div>
    </section>

    <!-- Specs -->
    <section class="ap-sec">
      <div class="ap-wrap ap-wrap--narrow">
        <h2 class="ap-h2">Технические характеристики</h2>
        <div class="ap-rows">
          <div v-for="(spec, i) in tech.specs" :key="i" class="ap-row">
            <span class="ap-text">{{ spec.label }}</span>
            <b class="ts-spec-val">{{ spec.value }}</b>
          </div>
        </div>
      </div>
    </section>

    <!-- Equipment used -->
    <section v-if="relatedEquipment.length" class="ap-sec ap-sec--white">
      <div class="ap-wrap">
        <h2 class="ap-h2">Оборудование для этой технологии</h2>
        <div class="ap-grid ap-grid--3">
          <NuxtLink
            v-for="eq in relatedEquipment"
            :key="eq.slug"
            :to="`/equipment/${eq.slug}`"
            class="ap-card ap-card--media"
          >
            <div class="ts-eq-tile">
              <img :src="eq.image" :alt="eq.name" loading="lazy" class="ts-eq-img" />
            </div>
            <div class="ap-card-body">
              <h3 class="ap-h3">{{ eq.name }}</h3>
              <span class="ap-card-foot ap-link">Смотреть оборудование ›</span>
            </div>
          </NuxtLink>
        </div>
      </div>
    </section>

    <!-- Related cases -->
    <section v-if="relatedProjects.length" class="ap-sec">
      <div class="ap-wrap">
        <h2 class="ap-h2">Реализованные кейсы</h2>
        <div class="ap-grid ap-grid--2">
          <NuxtLink
            v-for="p in relatedProjects"
            :key="p.slug"
            :to="`/projects/${p.slug}`"
            class="ap-card"
          >
            <h3 class="ap-h3">{{ p.name }}</h3>
            <p class="ap-text">{{ p.location }}</p>
            <div class="ap-card-foot"><span class="ap-pill">{{ p.result }}</span></div>
          </NuxtLink>
        </div>
      </div>
    </section>

    <!-- Other technologies -->
    <section class="ap-sec ap-sec--white">
      <div class="ap-wrap">
        <div class="ap-head">
          <h2 class="ap-h2">Другие технологии</h2>
          <NuxtLink to="/technologies" class="ap-link">Все технологии ›</NuxtLink>
        </div>
        <div class="ap-grid ap-grid--4">
          <NuxtLink
            v-for="t in otherTechnologies"
            :key="t.slug"
            :to="`/technologies/${t.slug}`"
            class="ap-card"
          >
            <h3 class="ap-h3">{{ t.shortTitle }}</h3>
            <span class="ap-card-foot ap-link">Подробнее ›</span>
          </NuxtLink>
        </div>
      </div>
    </section>

    <!-- CTA -->
    <section class="ap-sec ap-cta">
      <div class="ap-wrap">
        <h2 class="ap-h2">Запросить технологический аудит</h2>
        <p class="ap-lede">
          Оставьте параметры вашего объекта. Инженерный совет ESP подготовит 3D-схему сопряжений и предельную смету в течение 48 часов.
        </p>
        <div class="ap-actions">
          <NuxtLink to="/contacts#contact-form" class="ap-btn">Запустить технический запрос</NuxtLink>
          <button type="button" class="ap-link ts-linkbtn" @click="downloadModal = true">Скачать тех. паспорт ›</button>
        </div>
      </div>
    </section>

    <!-- Download modal -->
    <div v-if="downloadModal" class="ts-modal">
      <div class="ts-modal-bg" @click="downloadModal = false"></div>
      <div class="ap-form ts-modal-box">
        <button type="button" class="ts-modal-close" aria-label="Закрыть" @click="downloadModal = false">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><path stroke-linecap="round" d="M6 18L18 6M6 6l12 12" /></svg>
        </button>
        <div v-if="!sent">
          <h3 class="ap-h3">Скачать технический паспорт</h3>
          <p class="ap-text ts-modal-text">Оставьте e-mail — пришлём PDF с полными характеристиками технологии «{{ tech.shortTitle }}».</p>
          <form class="ts-modal-form" @submit.prevent="requestPdf">
            <input v-model="pdfForm.email" name="email" autocomplete="email" required type="email" placeholder="E-mail" class="ap-input" />
            <LeadConsent v-model="pdfForm.consent" />
            <p v-if="pdfLead.error.value" role="alert" style="font-size:13px;color:#b42318;margin:0">{{ pdfLead.error.value }}</p>
            <button type="submit" class="ap-btn ap-btn--block" :disabled="pdfLead.sending.value">{{ pdfLead.sending.value ? 'Отправка...' : 'Получить PDF' }}</button>
          </form>
        </div>
        <div v-else class="ap-center">
          <h3 class="ap-h3">Отправлено</h3>
          <p class="ap-text ts-modal-text">Технический паспорт придёт на почту в течение нескольких минут.</p>
        </div>
      </div>
    </div>
  </div>
  <div v-else class="ap">
    <section class="ap-sec ap-sec--first ap-center">
      <div class="ap-wrap">
        <p class="ap-lede">Технология не найдена.</p>
        <div class="ap-actions"><NuxtLink to="/technologies" class="ap-link">Вернуться к технологиям ›</NuxtLink></div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import { technologiesList } from '~/composables/useTechnologies'
import { equipmentList } from '~/composables/useEquipment'
import { projectsList } from '~/composables/useProjects'

const route = useRoute()
// Мембранные технологии сняты со страницы «Технологии» по просьбе заказчика.
const HIDDEN = ['membrane-filtration']
const visibleTech = technologiesList.filter(t => !HIDDEN.includes(t.slug))
const tech = computed(() => visibleTech.find(t => t.slug === route.params.slug))

if (!tech.value) {
  throw createError({ statusCode: 404, statusMessage: 'Технология не найдена', fatal: true })
}

const relatedEquipment = computed(() => {
  if (!tech.value?.equipmentSlugs?.length) return []
  return equipmentList.filter(e => tech.value.equipmentSlugs.includes(e.slug))
})

const relatedProjects = computed(() => {
  if (!tech.value?.relatedProjects?.length) return []
  return projectsList.filter(p => tech.value.relatedProjects.includes(p.slug))
})

const otherTechnologies = computed(() => visibleTech.filter(t => t.slug !== route.params.slug))

const downloadModal = ref(false)
const sent = ref(false)
// Запрос паспорта — тоже заявка: отдел продаж видит, кто и чем интересуется.
const pdfForm = ref({ email: '', consent: false })
const pdfLead = useLead('technology-pdf')
const requestPdf = async (e) => {
  sent.value = await pdfLead.send({ ...pdfForm.value, subject: tech.value?.shortTitle || '' }, [], e)
}

useHead(() => ({
  title: tech.value ? `${tech.value.title} | Технологии ESP` : 'Технология не найдена | ESP',
  meta: [
    { name: 'description', content: tech.value ? `${tech.value.desc} Технические характеристики, применяемое оборудование, реализованные кейсы ESP.` : '' }
  ]
}))
</script>

<style scoped>
.ap-cta .ap-actions { justify-content: center; }
.ts-crumbs { margin-bottom: 1.75rem; }
.ts-badges { list-style: none; padding: 0; }
.ts-badges .ap-card { gap: 0.3rem; padding: 1.4rem 1.5rem; }
.ts-badges :deep(.ts-badge-ico) { width: 22px; height: 22px; color: var(--ap-blue); margin-bottom: 0.4rem; }
.ts-badge-val { font-size: 1.15rem; font-weight: 600; letter-spacing: -0.01em; }

.ts-steps { grid-template-columns: repeat(5, minmax(0, 1fr)); list-style: none; padding: 0; }
.ts-num { width: 2rem; height: 2rem; display: grid; place-items: center; margin-bottom: 0.6rem; border-radius: 50%; background: var(--ap-blue); color: #fff; font-size: 14px; font-weight: 600; }
.ts-step-title { font-weight: 600; font-size: 1.02rem; line-height: 1.3; }

.ts-spec-val { text-align: right; }

.ts-eq-tile { display: grid; place-items: center; aspect-ratio: 4 / 3; background: #fff; }
.ts-eq-img { width: 80%; height: 80%; object-fit: contain; mix-blend-mode: multiply; }

.ts-linkbtn { background: none; padding: 0; }

.ts-modal { position: fixed; inset: 0; z-index: 50; display: flex; align-items: center; justify-content: center; padding: 1rem; }
.ts-modal-bg { position: absolute; inset: 0; background: rgba(0, 0, 0, 0.45); }
.ts-modal-box { position: relative; width: 100%; max-width: 28rem; box-shadow: 0 24px 64px rgba(0, 0, 0, 0.18); }
.ts-modal-close { position: absolute; top: 1rem; right: 1rem; width: 32px; height: 32px; display: grid; place-items: center; border-radius: 50%; background: #e8e8ed; color: var(--ap-ink); }
.ts-modal-close svg { width: 16px; height: 16px; }
.ts-modal-text { margin: 0.5rem 0 1.25rem; }
.ts-modal-form { display: grid; gap: 0.9rem; }

@media (max-width: 1023px) {
  .ts-steps { grid-template-columns: repeat(2, minmax(0, 1fr)); }
}
@media (max-width: 767px) {
  .ts-steps { grid-template-columns: 1fr; }
  .ts-badges { grid-template-columns: 1fr 1fr; }
}
</style>
