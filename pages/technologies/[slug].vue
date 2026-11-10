<template>
  <div v-if="tech" ref="root" class="dj ts">
    <!-- 1. Первый экран: ролик с объекта, название технологии по центру -->
    <DjPageHero
      eyebrow="Технология очистки"
      :title="tech.title"
      :lede="tech.desc"
      :video="media.video"
      :image="media.poster"
      :alt="tech.shortTitle"
    >
      <NuxtLink to="/contacts#contact-form" class="dj-btn dj-btn--white dj-btn--lg">Запросить расчёт</NuxtLink>
      <button type="button" class="dj-btn dj-btn--glass dj-btn--lg" @click="downloadModal = true">Скачать тех. паспорт</button>
    </DjPageHero>

    <DjSubnav :title="tech.shortTitle" :links="subnavLinks" :cta="{ label: 'Обсудить проект', to: '/contacts#contact-form' }" />

    <div class="dj-wrap ts-crumbs">
      <Breadcrumb :items="[{ label: 'Технологии', to: '/technologies' }, { label: tech.shortTitle }]" />
    </div>

    <!-- 2. Ключевые показатели: крупные тонкие значения -->
    <section id="overview" class="ts-anchor ts-overview" aria-label="Ключевые показатели">
      <div class="dj-wrap">
        <ul class="ts-badges">
          <li v-for="b in tech.badges" :key="b.label" class="dj-reveal">
            <ApIcon :name="b.icon" class="ts-badge-ico" />
            <b>{{ b.value }}</b>
            <span>{{ b.label }}</span>
          </li>
        </ul>
      </div>
    </section>

    <!-- 3. Как это работает: тёмный блок, кадр и пять шагов -->
    <section id="steps" class="dj-sec dj-sec--dark ts-anchor ts-steps-sec" aria-labelledby="steps-h">
      <div class="dj-wrap dj-center ts-head dj-reveal">
        <span class="dj-eyebrow">Как это работает</span>
        <h2 id="steps-h" class="dj-h2 ts-big">5 шагов очистки высокой степени надёжности</h2>
      </div>
      <div ref="band" class="ts-band dj-reveal">
        <img :src="media.still" :alt="tech.shortTitle" loading="lazy" decoding="async" :style="{ transform: `translate3d(0, ${shift}px, 0) scale(1.12)` }" />
      </div>
      <div class="dj-wrap">
        <ol class="ts-steps">
          <li v-for="(step, i) in tech.steps" :key="step.title" class="dj-reveal">
            <span class="ts-num">{{ String(i + 1).padStart(2, '0') }}</span>
            <h3>{{ step.title }}</h3>
            <p>{{ step.desc }}</p>
          </li>
        </ol>
      </div>
    </section>

    <!-- 4. Технические характеристики -->
    <section id="specs" class="dj-sec ts-anchor" aria-labelledby="specs-h">
      <div class="dj-wrap ts-narrow">
        <h2 id="specs-h" class="dj-h2 ts-big dj-center dj-reveal">Технические характеристики</h2>
        <dl class="ts-specs">
          <div v-for="spec in tech.specs" :key="spec.label" class="dj-reveal">
            <dt>{{ spec.label }}</dt>
            <dd>{{ spec.value }}</dd>
          </div>
        </dl>
      </div>
    </section>

    <!-- 5. Оборудование: предметные кадры на светлом градиенте -->
    <section v-if="relatedEquipment.length" id="equipment" class="ts-anchor ts-block" aria-labelledby="eq-h">
      <div class="dj-wrap dj-center ts-head dj-reveal">
        <h2 id="eq-h" class="dj-h2 ts-big">Оборудование для этой технологии</h2>
      </div>
      <div class="dj-tiles" :class="relatedEquipment.length > 1 ? 'dj-tiles--' + Math.min(relatedEquipment.length, 3) : 'ts-tiles--one'">
        <NuxtLink v-for="eq in relatedEquipment" :key="eq.slug" :to="`/equipment/${eq.slug}`" class="dj-tile ts-eq dj-reveal">
          <h3 class="dj-tile__title">{{ eq.name }}</h3>
          <span class="dj-links"><span class="dj-more">Смотреть оборудование</span></span>
          <span class="dj-tile__media dj-tile__media--contain"><img :src="eq.image" :alt="eq.name" loading="lazy" decoding="async" /></span>
        </NuxtLink>
      </div>
    </section>

    <!-- 6. Реализованные кейсы -->
    <section v-if="relatedProjects.length" id="cases" class="dj-sec ts-anchor" aria-labelledby="cases-h">
      <div class="dj-wrap">
        <h2 id="cases-h" class="dj-h2 ts-big dj-center ts-head dj-reveal">Реализованные кейсы</h2>
        <div class="ts-cases">
          <NuxtLink v-for="p in relatedProjects" :key="p.slug" :to="`/projects/${p.slug}`" class="ts-case dj-reveal">
            <h3 class="dj-h3">{{ p.name }}</h3>
            <p>{{ p.location }}</p>
            <span class="ts-case__res">{{ p.result }}</span>
            <span class="dj-more">Подробнее</span>
          </NuxtLink>
        </div>
      </div>
    </section>

    <!-- 7. Другие технологии -->
    <section class="ts-block ts-others" aria-labelledby="other-h">
      <div class="dj-wrap dj-center ts-head dj-reveal">
        <h2 id="other-h" class="dj-h2 ts-big">Другие технологии</h2>
        <div class="dj-links"><NuxtLink to="/technologies" class="dj-more">Все технологии</NuxtLink></div>
      </div>
      <div class="dj-tiles dj-tiles--3">
        <NuxtLink v-for="t in otherTechnologies" :key="t.slug" :to="`/technologies/${t.slug}`" class="dj-tile ts-other dj-reveal">
          <h3 class="dj-tile__title">{{ t.shortTitle }}</h3>
          <span class="dj-links"><span class="dj-more">Подробнее</span></span>
          <span class="dj-tile__media"><img :src="mediaFor(t.slug).poster" :alt="t.shortTitle" loading="lazy" decoding="async" /></span>
        </NuxtLink>
      </div>
    </section>

    <!-- 8. Призыв -->
    <section class="dj-sec dj-sec--dark dj-center ts-cta" aria-labelledby="cta-h">
      <div class="dj-wrap dj-reveal">
        <h2 id="cta-h" class="dj-h2 ts-big">Запросить технологический аудит</h2>
        <p class="dj-lede">
          Оставьте параметры вашего объекта. Инженерный совет ESP подготовит 3D-схему сопряжений и предельную смету в течение 48 часов.
        </p>
        <div class="dj-links ts-actions">
          <NuxtLink to="/contacts#contact-form" class="dj-btn dj-btn--white dj-btn--lg">Запустить технический запрос</NuxtLink>
          <button type="button" class="dj-more dj-more--light ts-linkbtn" @click="downloadModal = true">Скачать тех. паспорт</button>
        </div>
      </div>
    </section>

    <!-- Окно «Скачать паспорт» -->
    <div v-if="downloadModal" class="ts-modal" role="dialog" aria-modal="true" aria-label="Скачать технический паспорт">
      <div class="ts-modal-bg" @click="downloadModal = false"></div>
      <div class="ts-modal-box">
        <button type="button" class="ts-modal-close" aria-label="Закрыть" @click="downloadModal = false">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><path stroke-linecap="round" d="M6 18L18 6M6 6l12 12" /></svg>
        </button>
        <div v-if="!sent">
          <h3 class="dj-h3">Скачать технический паспорт</h3>
          <p class="ts-modal-text">Оставьте e-mail — пришлём PDF с полными характеристиками технологии «{{ tech.shortTitle }}».</p>
          <form class="ts-modal-form" @submit.prevent="requestPdf">
            <input v-model="pdfForm.email" name="email" autocomplete="email" required type="email" placeholder="E-mail" class="ts-input" />
            <LeadConsent v-model="pdfForm.consent" />
            <p v-if="pdfLead.error.value" role="alert" class="ts-err">{{ pdfLead.error.value }}</p>
            <button type="submit" class="dj-btn dj-btn--lg ts-submit" :disabled="pdfLead.sending.value">{{ pdfLead.sending.value ? 'Отправка...' : 'Получить PDF' }}</button>
          </form>
        </div>
        <div v-else class="dj-center">
          <h3 class="dj-h3">Отправлено</h3>
          <p class="ts-modal-text">Технический паспорт придёт на почту в течение нескольких минут.</p>
        </div>
      </div>
    </div>
  </div>
  <div v-else class="dj ts">
    <section class="dj-sec dj-center">
      <div class="dj-wrap">
        <p class="dj-lede">Технология не найдена.</p>
        <div class="dj-links"><NuxtLink to="/technologies" class="dj-more">Вернуться к технологиям</NuxtLink></div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { computed, ref, onMounted, onBeforeUnmount } from 'vue'
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
  'mechanical-filtration': { video: '/videos/mosaic/esp_seg7_190826.mp4', poster: '/images/reel/esp_seg7_190826.jpg', still: '/images/reel/esp_seg6_190826.jpg' },
  'biological-treatment': { video: '/videos/hero/krichev_230926.mp4', poster: '/videos/hero/krichev_230926.jpg', still: '/videos/hero/mstislavl_230926.jpg' },
  'physiochemical-methods': { video: '/videos/mosaic/DJI_0715.mp4', poster: '/videos/hero/DJI_0715.jpg', still: '/videos/hero/DJI_0470.jpg' },
  'uv-disinfection': { video: '/videos/mosaic/hero-water.mp4', poster: '/videos/hero/hero-water.jpg', still: '/images/team/crystal-water.png' }
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
  ...(relatedProjects.value.length ? [{ label: 'Кейсы', href: '#cases' }] : [])
])

const root = ref(null)
useReveal(root)

// Лёгкий параллакс широкого кадра в блоке «Как это работает»
const band = ref(null)
const shift = ref(0)
let raf = 0
const onScroll = () => {
  if (raf) return
  raf = requestAnimationFrame(() => {
    raf = 0
    const el = band.value
    if (!el) return
    const r = el.getBoundingClientRect()
    const vh = window.innerHeight
    if (r.bottom < 0 || r.top > vh) return
    shift.value = Math.round(((r.top + r.height / 2 - vh / 2) / (vh / 2 + r.height / 2)) * -36)
  })
}
onMounted(() => {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
  window.addEventListener('scroll', onScroll, { passive: true })
  onScroll()
})
onBeforeUnmount(() => {
  window.removeEventListener('scroll', onScroll)
  if (raf) cancelAnimationFrame(raf)
})

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
.ts { overflow-x: clip; }
.ts-anchor { scroll-margin-top: 116px; }
.ts-crumbs { padding-top: 18px; }
.ts-head { margin-bottom: clamp(28px, 4vw, 48px); }
.ts-big { margin-top: 6px; font-size: clamp(30px, 4.4vw, 54px); line-height: 1.07; letter-spacing: -0.03em; text-wrap: balance; }
.ts-block { padding-top: clamp(56px, 8vw, 104px); }
.ts-actions { margin-top: 30px; gap: 14px 26px; }

/* Показатели */
.ts-overview { padding: clamp(40px, 6vw, 80px) 0 clamp(56px, 7vw, 96px); }
.ts-badges { display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 32px 24px; margin: 0; padding: 0; list-style: none; text-align: center; }
.ts-badges li { display: flex; flex-direction: column; align-items: center; gap: 8px; padding: 0 8px; }
.ts-badges li + li { border-left: 1px solid var(--dj-line); }
.ts-badges :deep(.ts-badge-ico) { width: 26px; height: 26px; color: var(--dj-ink); stroke-width: 1.4; }
.ts-badges b { font-size: clamp(24px, 2.6vw, 36px); font-weight: 300; line-height: 1.15; letter-spacing: -0.02em; color: var(--dj-ink); text-wrap: balance; }
.ts-badges span { font-size: 14px; color: var(--dj-muted); }

/* Шаги */
.ts-steps-sec { padding-bottom: clamp(56px, 8vw, 104px); }
.ts-band { position: relative; height: clamp(300px, 42vw, 560px); margin: 0 12px; overflow: hidden; background: #15181c; }
.ts-band img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; will-change: transform; }
.ts-steps { display: grid; grid-template-columns: repeat(5, minmax(0, 1fr)); gap: 28px; margin: clamp(36px, 5vw, 64px) 0 0; padding: 0; list-style: none; }
.ts-steps li { display: flex; flex-direction: column; gap: 8px; padding-top: 18px; border-top: 1px solid rgba(255, 255, 255, 0.16); }
.ts-num { font-size: clamp(36px, 3.6vw, 52px); font-weight: 200; line-height: 1; letter-spacing: -0.03em; color: #fff; font-variant-numeric: tabular-nums; }
.ts-steps h3 { margin-top: 10px; font-size: 17px; font-weight: 600; line-height: 1.3; color: #fff; }
.ts-steps p { font-size: 14px; line-height: 1.55; color: rgba(255, 255, 255, 0.64); }

/* Характеристики */
.ts-narrow { max-width: 920px; }
.ts-specs { margin: clamp(28px, 4vw, 48px) 0 0; border-top: 1px solid var(--dj-ink); }
.ts-specs div { display: grid; grid-template-columns: minmax(0, 1fr) minmax(0, 1fr); gap: 24px; padding: 22px 0; border-bottom: 1px solid var(--dj-line); }
.ts-specs dt { font-size: 15px; color: var(--dj-muted); }
.ts-specs dd { margin: 0; font-size: clamp(17px, 1.6vw, 22px); font-weight: 400; color: var(--dj-ink); letter-spacing: -0.01em; }

/* Оборудование */
.ts-tiles--one { grid-template-columns: minmax(0, 1fr); max-width: 980px; margin: 0 auto; }
.ts-eq { min-height: clamp(420px, 40vw, 560px); }
.ts-eq .dj-tile__media { height: 66%; }

/* Кейсы */
.ts-cases { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 12px; }
.ts-case { display: flex; flex-direction: column; align-items: flex-start; gap: 10px; padding: clamp(28px, 3vw, 40px); background: var(--dj-soft); transition: background-color 0.3s ease; }
.ts-case:hover { background: #eceef1; }
.ts-case p { font-size: 15px; color: var(--dj-muted); }
.ts-case__res { margin-top: 6px; font-size: clamp(20px, 2vw, 26px); font-weight: 300; color: var(--dj-ink); letter-spacing: -0.01em; }

/* Другие технологии */
.ts-others { padding-bottom: 0; }
.ts-other { min-height: clamp(400px, 34vw, 520px); }
.ts-other .dj-tile__media { height: 64%; }

/* Призыв */
.ts-cta .dj-lede { margin-top: 14px; max-width: 56ch; }
.ts-linkbtn { background: none; padding: 0; cursor: pointer; }

/* Окно */
.ts-modal { position: fixed; inset: 0; z-index: 120; display: flex; align-items: center; justify-content: center; padding: 16px; font-family: var(--dj-font); }
.ts-modal-bg { position: absolute; inset: 0; background: rgba(0, 0, 0, 0.5); backdrop-filter: blur(4px); -webkit-backdrop-filter: blur(4px); }
.ts-modal-box { position: relative; width: 100%; max-width: 440px; padding: 36px 32px 32px; background: #fff; box-shadow: 0 24px 64px rgba(0, 0, 0, 0.2); animation: ts-pop 0.4s var(--dj-ease) both; }
.ts-modal-close { position: absolute; top: 14px; right: 14px; width: 32px; height: 32px; display: grid; place-items: center; border-radius: 50%; background: var(--dj-soft); color: var(--dj-ink); }
.ts-modal-close svg { width: 16px; height: 16px; }
.ts-modal-text { margin: 8px 0 20px; font-size: 15px; line-height: 1.55; color: var(--dj-muted); }
.ts-modal-form { display: grid; gap: 14px; }
.ts-input { height: 48px; padding: 0 16px; border: 1px solid #d2d5d9; background: #fff; font-size: 15px; color: var(--dj-ink); outline: none; transition: border-color 0.2s ease; }
.ts-input:focus { border-color: var(--dj-blue); }
.ts-err { margin: 0; font-size: 13px; color: #b42318; }
.ts-submit { width: 100%; }
.ts-submit:disabled { opacity: 0.6; }
@keyframes ts-pop { from { opacity: 0; transform: translateY(12px) scale(0.98); } to { opacity: 1; transform: none; } }

@media (max-width: 1023px) {
  .ts-steps { grid-template-columns: repeat(2, minmax(0, 1fr)); }
}
@media (max-width: 767px) {
  .ts-band { margin: 0 8px; }
  .ts-steps { grid-template-columns: 1fr; gap: 24px; }
  .ts-badges li + li { border-left: 0; border-top: 1px solid var(--dj-line); padding-top: 28px; }
  .ts-specs div { grid-template-columns: 1fr; gap: 4px; }
  .ts-cases { grid-template-columns: 1fr; }
  .ts-big { overflow-wrap: break-word; hyphens: auto; }
}
@media (prefers-reduced-motion: reduce) {
  .ts-band img { transform: none !important; }
  .ts-modal-box { animation: none; }
}
</style>
