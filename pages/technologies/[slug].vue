<template>
  <div v-if="tech" id="top" ref="root" class="dj ts">
    <!-- 1. Первый экран: название технологии крупно, под ним фирменная сцена технологии во всю ширину -->
    <AppleHero
      eyebrow="Технология очистки"
      :title="tech.title"
      :lede="tech.desc"
      :image="media.still"
      :alt="tech.shortTitle"
      :dark="false"
    >
      <NuxtLink to="/contacts#contact-form" class="ax-btn">Обсудить проект</NuxtLink>
      <button type="button" class="ax-link" @click="downloadModal = true">Скачать технический паспорт</button>
    </AppleHero>

    <AppleSubBar :title="tech.shortTitle" :links="subnavLinks" :cta="{ label: 'Обсудить проект', to: '/contacts#contact-form' }" />

    <div class="ax-wrap ts-crumbs">
      <Breadcrumb :items="[{ label: 'Технологии', to: '/technologies' }, { label: tech.shortTitle }]" />
    </div>

    <!-- 2. Ключевые показатели: бенто цифр -->
    <section id="overview" class="ts-anchor ts-overview" aria-label="Ключевые показатели">
      <AppleBento :items="badgeBento" />
    </section>

    <!-- 3. Как это работает: липкий кадр, справа пять шагов -->
    <!-- Реальная съёмка процесса на объекте (если ролик есть) -->
    <EquipWorkVideo :slug="route.params.slug" kind="stage" title="Процесс на реальном объекте" />

    <section id="steps" class="ax-sec ax-dark ts-anchor" aria-labelledby="steps-h">
      <div class="ax-wrap ax-head dj-reveal">
        <span class="ax-eyebrow">Как это работает</span>
        <h2 id="steps-h" class="ax-h2">Процесс очистки в 5 этапов</h2>
      </div>
      <AppleChapters dark :items="stepItems" :image="media.still" :video="media.video" />
    </section>

    <!-- 4. Технические характеристики -->
    <section id="specs" class="ax-sec ts-anchor" aria-labelledby="specs-h">
      <div class="ax-wrap">
        <h2 id="specs-h" class="ax-h2 dj-reveal">Технические характеристики</h2>
        <dl class="ts-specs">
          <div v-for="spec in tech.specs" :key="spec.label" class="dj-reveal">
            <dt>{{ spec.label }}</dt>
            <dd>{{ spec.value }}</dd>
          </div>
        </dl>
      </div>
    </section>

    <!-- 5. Оборудование: галерея «Главное» с предметными кадрами -->
    <div v-if="relatedEquipment.length" id="equipment" class="ts-anchor">
      <EquipNovRow title="Оборудование для этой технологии" :items="relatedEquipment" />
    </div>

    <!-- 6. Реализованные объекты: карусель карточек -->
    <section v-if="relatedProjects.length" id="cases" class="ax-sec ts-anchor" aria-labelledby="cases-h">
      <div class="ax-wrap ax-head dj-reveal">
        <h2 id="cases-h" class="ax-h2">Реализованные объекты</h2>
      </div>
      <AppleWhy :items="caseItems" />
    </section>

    <!-- 7. Другие технологии: блок сравнения -->
    <section class="ax-sec ax-light" aria-labelledby="other-h">
      <div class="ax-wrap ax-head ax-head--center dj-reveal">
        <h2 id="other-h" class="ax-h2">Другие технологии</h2>
        <div class="ax-actions"><NuxtLink to="/technologies" class="ax-link">Все технологии</NuxtLink></div>
      </div>
      <AppleCompare :columns="otherColumns" />
    </section>

    <!-- 8. Призыв -->
    <AppleCta
      tone="dark"
      title="Запросить технологический аудит"
      lede="Оставьте параметры вашего объекта. Инженеры ESP подготовят 3D-схему сопряжений и предварительную смету в течение 48 часов."
    >
      <NuxtLink to="/contacts#contact-form" class="ax-btn">Обсудить проект</NuxtLink>
      <button type="button" class="ax-link" @click="downloadModal = true">Скачать технический паспорт</button>
    </AppleCta>

    <!-- Окно «Скачать паспорт» -->
    <div v-if="downloadModal" class="ts-modal" role="dialog" aria-modal="true" aria-label="Скачать технический паспорт">
      <div class="ts-modal-bg" @click="downloadModal = false"></div>
      <div class="ts-modal-box">
        <button type="button" class="ts-modal-close" aria-label="Закрыть" @click="downloadModal = false">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><path stroke-linecap="round" d="M6 18L18 6M6 6l12 12" /></svg>
        </button>
        <div v-if="!sent">
          <h3 class="ax-h3">Скачать технический паспорт</h3>
          <p class="ts-modal-text">Оставьте e-mail — пришлём PDF с полными характеристиками технологии «{{ tech.shortTitle }}».</p>
          <form class="ts-modal-form" @submit.prevent="requestPdf">
            <input v-model="pdfForm.email" name="email" autocomplete="email" required type="email" placeholder="E-mail" class="ts-input" />
            <LeadConsent v-model="pdfForm.consent" />
            <p v-if="pdfLead.error.value" role="alert" class="ts-err">{{ pdfLead.error.value }}</p>
            <button type="submit" class="ax-btn ts-submit" :disabled="pdfLead.sending.value">{{ pdfLead.sending.value ? 'Отправка…' : 'Получить PDF' }}</button>
          </form>
        </div>
        <div v-else class="ts-sent">
          <h3 class="ax-h3">Отправлено</h3>
          <p class="ts-modal-text">Технический паспорт придёт на почту в течение нескольких минут.</p>
        </div>
      </div>
    </div>
  </div>
  <div v-else class="dj ts">
    <section class="ax-sec">
      <div class="ax-wrap ts-sent">
        <p class="ax-lede">Технология не найдена.</p>
        <div class="ax-actions ax-actions--center"><NuxtLink to="/technologies" class="ax-link">Вернуться к технологиям</NuxtLink></div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import { technologiesList } from '~/composables/useTechnologies'
import { equipmentList } from '~/composables/useEquipment'
import { projectsList } from '~/composables/useProjects'
import { useReveal } from '~/composables/useReveal'

const route = useRoute()
// Мембранные технологии сняты со страницы «Технологии» по просьбе заказчика.
const HIDDEN = ['membrane-filtration']
const visibleTech = technologiesList.filter(t => !HIDDEN.includes(t.slug))
const tech = computed(() => visibleTech.find(t => t.slug === route.params.slug))

if (!tech.value) {
  throw createError({ statusCode: 404, statusMessage: 'Технология не найдена', fatal: true })
}

// Реальные кадры с объектов ESP для каждой технологии
const MEDIA = {
  'mechanical-filtration': { video: '/videos/mosaic/esp_seg7_190826.mp4', poster: '/images/reel/esp_seg7_190826.jpg', still: '/images/technologies/stage/mechanical-filtration.webp' },
  'biological-treatment': { video: '/videos/hero/krichev_230926.mp4', poster: '/videos/hero/krichev_230926.jpg', still: '/images/technologies/stage/biological-treatment.webp' },
  'physiochemical-methods': { video: '/videos/mosaic/DJI_0715.mp4', poster: '/videos/hero/DJI_0715.jpg', still: '/images/technologies/stage/physiochemical-methods.webp' },
  'uv-disinfection': { video: '/videos/mosaic/hero-water.mp4', poster: '/videos/hero/hero-water.jpg', still: '/images/technologies/stage/uv-disinfection.webp' }
}
const mediaFor = (slug) => MEDIA[slug] || MEDIA['mechanical-filtration']
const media = computed(() => mediaFor(route.params.slug))

const relatedEquipment = computed(() => {
  if (!tech.value?.equipmentSlugs?.length) return []
  return equipmentList.filter(e => tech.value.equipmentSlugs.includes(e.slug))
})

const relatedProjects = computed(() => {
  if (!tech.value?.relatedProjects?.length) return []
  return projectsList.filter(p => tech.value.relatedProjects.includes(p.slug))
})

const otherTechnologies = computed(() => visibleTech.filter(t => t.slug !== route.params.slug))

const subnavLinks = computed(() => [
  { label: 'Обзор', href: '#overview' },
  { label: 'Как это работает', href: '#steps' },
  { label: 'Характеристики', href: '#specs' },
  ...(relatedEquipment.value.length ? [{ label: 'Оборудование', href: '#equipment' }] : []),
  ...(relatedProjects.value.length ? [{ label: 'Объекты', href: '#cases' }] : [])
])

const root = ref(null)
useReveal(root)

// ===== Раскладка по блокам страницы продукта apple.com =====
const badgeBento = computed(() => (tech.value?.badges || []).map((b, i) => ({
  size: i === 0 ? 'md' : (i === 1 ? 'md' : 'full'),
  value: b.value,
  label: b.label,
  tone: i === 0 ? 'ink' : ''
})))
const stepItems = computed(() => (tech.value?.steps || []).map((st, i) => ({
  kicker: String(i + 1).padStart(2, '0'),
  title: st.title,
  text: st.desc
})))
const caseItems = computed(() => relatedProjects.value.map((p) => ({
  title: p.name, text: p.location, meta: p.result, to: `/projects/${p.slug}`
})))
const otherColumns = computed(() => otherTechnologies.value.map((t) => ({
  title: t.shortTitle,
  image: `/images/technologies/stage/${t.slug}.webp`,
  to: `/technologies/${t.slug}`,
  cta: 'Подробнее',
  rows: (t.badges || []).map((b) => ({ value: b.value, label: b.label }))
})))

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

<style scoped src="../../components/apple/apple.css"></style>
<style scoped>
.ts { overflow-x: clip; background: #fff; }
.ts-anchor { scroll-margin-top: 116px; }
.ts-crumbs { padding-top: 18px; font-size: 12px; }
.ts-overview { padding: clamp(40px, 5vw, 72px) 0 clamp(80px, 10vw, 140px); }
.ts-overview :deep(.bn-tile) { background: #EDEDED; }
.ts-overview :deep(.bn--ink) { background: #002366 !important; }

/* Характеристики в стиле Tech Specs apple.com */
.ts-specs { margin: clamp(32px, 4vw, 56px) 0 0; border-top: 1px solid #D6D6D6; }
.ts-specs div { display: grid; grid-template-columns: minmax(0, 1fr) minmax(0, 2fr); gap: 24px; padding: 28px 0; border-bottom: 1px solid #D6D6D6; }
.ts-specs dt { font-size: 17px; line-height: 1.47; font-weight: 600; letter-spacing: -0.022em; color: #1A1A1A; }
.ts-specs dd { margin: 0; font-size: clamp(21px, 2vw, 28px); line-height: 1.14; font-weight: 400; letter-spacing: 0.007em; color: #1A1A1A; }

/* Окно */
.ts-modal { position: fixed; inset: 0; z-index: 120; display: flex; align-items: center; justify-content: center; padding: 16px; font-family: var(--dj-font); }
.ts-modal-bg { position: absolute; inset: 0; background: rgba(0, 0, 0, 0.48); backdrop-filter: blur(20px); -webkit-backdrop-filter: blur(20px); }
.ts-modal-box { position: relative; width: 100%; max-width: 460px; padding: 44px 36px 36px; border-radius: var(--r-lg); background: #fff; box-shadow: var(--sh-3); animation: ts-pop 0.4s cubic-bezier(0.16, 1, 0.3, 1) both; }
.ts-modal-close { position: absolute; top: 16px; right: 16px; width: 36px; height: 36px; display: grid; place-items: center; border-radius: 50%; background: #EDEDED; color: #1A1A1A; }
.ts-modal-close svg { width: 16px; height: 16px; }
.ts-modal-text { margin: 10px 0 22px; font-size: 17px; line-height: 1.47; letter-spacing: -0.022em; color: #5E5E5E; }
.ts-modal-form { display: grid; gap: 14px; }
.ts-input { height: 52px; padding: 0 16px; border: 1px solid #D6D6D6; border-radius: var(--r-sm); background: #fff; font-size: 17px; color: #1A1A1A; outline: none; transition: border-color 0.2s ease, box-shadow 0.2s ease; }
.ts-input:focus { border-color: #002366; box-shadow: var(--focus-ring); }
.ts-err { margin: 0; font-size: 14px; color: #e30000; }
.ts-submit { width: 100%; border: 0; }
.ts-submit:disabled { opacity: 0.6; }
.ts-sent { text-align: center; }
@keyframes ts-pop { from { opacity: 0; transform: translateY(12px) scale(0.98); } to { opacity: 1; transform: none; } }

@media (max-width: 734px) {
  .ts-specs div { grid-template-columns: 1fr; gap: 6px; }
  .ax-h2 { overflow-wrap: break-word; hyphens: auto; }
}
@media (prefers-reduced-motion: reduce) {
  .ts-modal-box { animation: none; }
}
</style>
