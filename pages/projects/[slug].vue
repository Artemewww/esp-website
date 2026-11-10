<template>
  <div v-if="project" ref="root" class="pd">
    <!-- Первый экран: съёмка объекта во весь экран, название сверху по центру -->
    <section class="pd-hero" :class="{ 'pd-hero--plain': !(project.video || heroImage) }">
      <div v-if="project.video || heroImage" class="pd-hero-media">
        <video
          v-if="project.video"
          :src="project.video"
          :poster="project.poster"
          autoplay
          muted
          loop
          playsinline
          preload="metadata"
        ></video>
        <img v-else :src="heroImage" :alt="project.name" fetchpriority="high" />
      </div>
      <div class="pd-hero-copy dj-wrap">
        <span v-if="project.badge || project.region" class="pd-hero-eyebrow">{{ project.badge || project.region }}</span>
        <h1 class="pd-hero-title">{{ project.name }}</h1>
        <p v-if="project.location && project.location !== project.name" class="pd-hero-loc">{{ project.location }}</p>
        <div class="pd-hero-act">
          <NuxtLink to="/contacts#contact-form" class="dj-btn" :class="project.video || heroImage ? 'dj-btn--glass' : ''">Обсудить похожий проект</NuxtLink>
        </div>
      </div>
    </section>

    <DjSubnav :title="subTitle" :links="subLinks" :cta="{ to: '/contacts#contact-form', label: 'Оставить заявку' }" />

    <!-- Описание и ключевые цифры крупным тонким шрифтом -->
    <section id="overview" class="dj-sec pd-anchor">
      <div class="dj-wrap">
        <div class="pd-crumbs">
          <Breadcrumb :items="[{ label: 'Проекты', to: '/projects' }, { label: project.name }]" />
        </div>
        <p v-if="project.longDesc || project.desc" class="pd-lede dj-reveal">
          {{ sw(project.longDesc || project.desc) }}
        </p>
        <ul v-if="keyStats.length" class="pd-stats" :style="{ '--n': Math.min(keyStats.length, 4) }">
          <li v-for="s in keyStats" :key="s.label" class="dj-reveal"><b :class="{ 'is-long': s.value.length > 14 }">{{ s.value }}</b><span>{{ s.label }}</span></li>
        </ul>
      </div>
    </section>

    <!-- Задача / Решение / Результат -->
    <section v-if="steps.length" class="dj-sec dj-sec--soft">
      <div class="dj-wrap dj-center dj-reveal">
        <span class="dj-eyebrow">Траектория модернизации</span>
        <h2 class="dj-h2 pd-h2">Путь трансформации сточных вод</h2>
      </div>
      <div class="dj-wrap dj-wrap--wide pd-steps">
        <div v-for="st in steps" :key="st.num" class="pd-step dj-reveal">
          <span class="pd-step__num">{{ st.num }}</span>
          <span class="pd-kicker">{{ st.kicker }}</span>
          <h3 class="pd-step__title">{{ st.title }}</h3>
          <p class="pd-step__text">{{ sw(st.text) }}</p>
        </div>
      </div>
    </section>

    <!-- Галерея: первый кадр во всю ширину, остальные парами -->
    <section v-if="project.gallery && project.gallery.length" id="gallery" class="pd-anchor pd-gal-sec">
      <div class="dj-wrap dj-center pd-head dj-reveal">
        <h2 class="dj-h2">Фото объекта и сборки модулей</h2>
      </div>
      <div class="pd-gallery" :class="{ 'pd-gallery--even': project.gallery.length % 2 === 0 }">
        <button
          v-for="(img, idx) in project.gallery"
          :key="idx"
          type="button"
          class="pd-shot dj-reveal"
          :aria-label="`Открыть фото ${idx + 1}`"
          @click="openLightbox(idx)"
        >
          <img :src="img" :alt="`${project.name} — фото ${idx + 1}`" loading="lazy" decoding="async" />
        </button>
      </div>
    </section>

    <!-- Технологический стек и оборудование -->
    <section v-if="project.techStack && project.techStack.length" id="stack" class="pd-anchor pd-stack">
      <div class="dj-wrap dj-center pd-head dj-reveal">
        <h2 class="dj-h2">Использованный технологический стек</h2>
        <div class="pd-pills">
          <span v-for="t in project.techStack" :key="t" class="pd-pill">{{ t }}</span>
        </div>
      </div>

      <template v-if="usedEquipment.length">
        <h3 class="dj-h3 dj-center pd-subhead dj-reveal">Применённое оборудование</h3>
        <div class="dj-tiles" :class="usedEquipment.length > 2 ? 'dj-tiles--3' : (usedEquipment.length === 2 ? 'dj-tiles--2' : '')">
          <NuxtLink
            v-for="eq in usedEquipment"
            :key="eq.slug"
            :to="`/equipment/${eq.slug}`"
            class="dj-tile pd-eq dj-reveal"
          >
            <h4 class="dj-tile__title pd-eq__title">{{ eq.name }}</h4>
            <p v-if="eq.capacity" class="dj-tile__sub">{{ eq.capacity }}</p>
            <span class="dj-links"><span class="dj-more">Смотреть оборудование</span></span>
            <span class="dj-tile__media dj-tile__media--contain"><img :src="eq.image" :alt="eq.name" loading="lazy" /></span>
          </NuxtLink>
        </div>
      </template>
    </section>

    <!-- Отзыв -->
    <section v-if="project.reviewName" class="dj-sec">
      <div class="dj-wrap">
        <figure class="pd-quote dj-reveal">
          <blockquote>{{ project.reviewQuote }}</blockquote>
          <figcaption>{{ project.reviewName }}</figcaption>
        </figure>
      </div>
    </section>

    <!-- Параметры проекта -->
    <section v-if="params.length" id="params" class="dj-sec pd-anchor">
      <div class="dj-wrap pd-params-wrap">
        <h2 class="dj-h2 dj-center dj-reveal">Параметры проекта</h2>
        <dl class="pd-params dj-reveal">
          <div v-for="row in params" :key="row.label" class="pd-param">
            <dt>{{ row.label }}</dt>
            <dd>{{ row.value }}</dd>
          </div>
        </dl>
      </div>
    </section>

    <!-- Другие проекты -->
    <section v-if="otherProjects.length" class="pd-others-sec">
      <div class="dj-wrap dj-center pd-head dj-reveal">
        <h2 class="dj-h2">Другие проекты</h2>
        <div class="dj-links"><NuxtLink to="/projects" class="dj-more">Все объекты</NuxtLink></div>
      </div>
      <div class="pd-others">
        <NuxtLink
          v-for="p in otherProjects"
          :key="p.slug"
          :to="`/projects/${p.slug}`"
          class="pd-other dj-reveal"
        >
          <span class="pd-other__media">
            <img v-if="p.poster || (p.gallery && p.gallery[0])" :src="p.poster || p.gallery[0]" :alt="p.name" loading="lazy" decoding="async" />
          </span>
          <span class="pd-other__copy">
            <b class="pd-other-title">{{ p.name }}</b>
            <span class="pd-other__meta">{{ [p.location, p.capacity].filter(Boolean).join(' · ') }}</span>
          </span>
        </NuxtLink>
      </div>
    </section>

    <!-- CTA: без сотрудника и должности, телефон общий — приёмная. -->
    <section class="dj-sec dj-center">
      <div class="dj-wrap dj-reveal">
        <h2 class="dj-h1">Обсудим похожий объект</h2>
        <p class="dj-lede pd-cta__lede">
          Расскажите о задаче — инженеры ESP изучат исходные данные и предложат решение под условия вашего объекта.
        </p>
        <div class="dj-links pd-cta__act">
          <NuxtLink to="/contacts#contact-form" class="dj-btn dj-btn--lg">Оставить заявку</NuxtLink>
          <a :href="`tel:${PHONE_TEL}`" class="dj-more tabular-nums">{{ PHONE }}</a>
        </div>
        <p class="pd-cta-note">Телефон приёмной ESP</p>
      </div>
    </section>

    <!-- Lightbox -->
    <div v-if="lightboxOpen" class="pd-lb" @click.self="lightboxOpen = false">
      <div class="pd-lb-box">
        <div class="pd-lb-bar">
          <span>{{ activePhotoIdx + 1 }} / {{ project.gallery.length }}</span>
          <button type="button" @click="lightboxOpen = false">Закрыть</button>
        </div>
        <button type="button" class="pd-lb-arrow pd-lb-arrow--l" aria-label="Предыдущее фото" @click="prevPhoto">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.6" aria-hidden="true"><path d="M14.5 6l-6 6 6 6" /></svg>
        </button>
        <img :src="project.gallery[activePhotoIdx]" :alt="`${project.name} — фото ${activePhotoIdx + 1}`" />
        <button type="button" class="pd-lb-arrow pd-lb-arrow--r" aria-label="Следующее фото" @click="nextPhoto">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.6" aria-hidden="true"><path d="M9.5 6l6 6-6 6" /></svg>
        </button>
      </div>
    </div>
  </div>
  <div v-else class="pd">
    <section class="dj-sec dj-center">
      <div class="dj-wrap">
        <p class="dj-lede">Проект не найден.</p>
        <NuxtLink to="/projects" class="dj-more">Вернуться к проектам</NuxtLink>
      </div>
    </section>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import { useProjects } from '~/composables/useProjects'
import { equipmentList } from '~/composables/useEquipment'
import { useReveal } from '~/composables/useReveal'

const route = useRoute()
const { projects, getBySlug } = useProjects()
const project = computed(() => getBySlug(route.params.slug))

// Объект, добавленный в админке, есть только в ответе сервера, а не в
// сборке. Прежде чем отдавать 404, дожидаемся свежего списка.
if (!project.value) {
  await refreshNuxtData('site-content-projects')
}

// Для несуществующих адресов — честный 404, а не пустая страница с кодом 200.
if (!project.value) {
  throw createError({ statusCode: 404, statusMessage: 'Проект не найден', fatal: true })
}

const root = ref(null)
useReveal(root)

const PHONE = '+375 (17) 238-11-41'
const PHONE_TEL = '+375172381141'

// «Стоки» в текстах из данных выводим как «сточные воды».
const sw = (s) => String(s || '')
  .replace(/стоков/g, 'сточных вод')
  .replace(/стоками/g, 'сточными водами')
  .replace(/стоках/g, 'сточных водах')
  .replace(/стоки/g, 'сточные воды')

const heroImage = computed(() => project.value?.poster || project.value?.gallery?.[0] || '')

const indicators = computed(() => {
  const p = project.value || {}
  return [
    { label: 'Объём сточных вод', value: String(p.volume || '').trim(), accent: 'border-esp-blue' },
    { label: 'Качество очистки', value: String(p.quality || '').trim(), accent: 'border-esp-green' }
  ].filter(m => m.value)
})

// Ключевые цифры под кадром: год, производительность и показатели из админки.
const keyStats = computed(() => {
  const p = project.value || {}
  return [
    { label: 'Год запуска', value: String(p.year || '').trim() },
    { label: 'Производительность', value: String(p.capacity || '').trim() },
    ...indicators.value.map(m => ({ label: m.label, value: m.value }))
  ].filter(s => s.value)
})

const steps = computed(() => [
  { num: '01', kicker: 'Задача', title: 'Исходная задача', text: project.value?.task, color: 'text-esp-black/60' },
  { num: '02', kicker: 'Решение', title: 'Внедрённое решение', text: project.value?.solution, color: 'text-esp-blue' },
  { num: '03', kicker: 'Результат', title: 'Результат', text: project.value?.resultText, color: 'text-esp-green' }
].filter(st => st.text))

const params = computed(() => {
  const p = project.value || {}
  return [
    { label: 'Категория', value: p.category },
    { label: 'Год', value: p.year },
    { label: 'Производительность', value: p.capacity },
    { label: 'Регион', value: p.region }
  ].filter(r => r.value)
})

const usedEquipment = computed(() => {
  if (!project.value?.equipmentSlugs?.length) return []
  return equipmentList.filter(e => project.value.equipmentSlugs.includes(e.slug))
})

// «Другие проекты» — из списка в админке, кроме текущего. Сначала объекты
// той же категории.
const otherProjects = computed(() => {
  const rest = projects.value.filter(p => p.slug !== route.params.slug && p.isKey !== false)
  const same = rest.filter(p => p.category === project.value?.category)
  const other = rest.filter(p => p.category !== project.value?.category)
  return [...same, ...other].slice(0, 4)
})

// Подполоса: короткое имя (место) и якоря только существующих блоков
const subTitle = computed(() => {
  const p = project.value || {}
  const n = String(p.name || '')
  return n.length > 28 && p.location && p.location.length < n.length ? p.location : n
})
const subLinks = computed(() => {
  const p = project.value || {}
  return [
    { href: '#overview', label: 'Обзор' },
    p.gallery?.length && { href: '#gallery', label: 'Фото' },
    p.techStack?.length && { href: '#stack', label: 'Оборудование' },
    params.value.length && { href: '#params', label: 'Параметры' }
  ].filter(Boolean)
})

const lightboxOpen = ref(false)
const activePhotoIdx = ref(0)

const openLightbox = (idx) => {
  activePhotoIdx.value = idx
  lightboxOpen.value = true
}
const prevPhoto = () => {
  activePhotoIdx.value = activePhotoIdx.value === 0 ? project.value.gallery.length - 1 : activePhotoIdx.value - 1
}
const nextPhoto = () => {
  activePhotoIdx.value = activePhotoIdx.value === project.value.gallery.length - 1 ? 0 : activePhotoIdx.value + 1
}

// og-картинки лежат в этом проекте: origin берём из runtimeConfig,
// чтобы смена домена правилась в одном месте.
const ogOrigin = useRuntimeConfig().public.ogOrigin

useHead(() => ({
  title: project.value ? `${project.value.name} | Проекты ESP` : 'Проект не найден | ESP',
  meta: [
    { name: 'description', content: project.value ? project.value.desc : '' },
    { property: 'og:title', content: project.value?.name || '' },
    { property: 'og:description', content: project.value?.desc || '' },
    { property: 'og:image', content: `${ogOrigin}/images/og-esp.png` }
  ],
  link: [{ rel: 'canonical', href: project.value ? `https://ecoservisproekt.by/projects/${project.value.slug}` : '' }]
}))

useSchemaOrg([
  defineBreadcrumb(() => ([
    { name: 'Проекты', item: '/projects' },
    { name: project.value?.name }
  ]))
])
</script>

<style scoped>
.pd-anchor { scroll-margin-top: 108px; }
/* Длинное имя объекта в подполосе обрезаем многоточием, чтобы кнопка не уезжала */
.pd :deep(.dsn-title) { min-width: 0; overflow: hidden; text-overflow: ellipsis; }
.pd :deep(.dsn-cta) { flex-shrink: 0; }
.pd-head { padding: clamp(56px, 7vw, 96px) 24px clamp(24px, 3vw, 36px); }
.pd-h2 { margin-top: 6px; }

/* Первый экран: кадр на всю ширину, текст сверху по центру, как у DJI */
.pd-hero { position: relative; display: flex; justify-content: center; height: calc(100svh - var(--dj-header-h)); min-height: 520px; max-height: 960px; overflow: hidden; background: #0b0d10; color: #fff; text-align: center; }
.pd-hero-media { position: absolute; inset: 0; }
.pd-hero-media video, .pd-hero-media img { width: 100%; height: 100%; object-fit: cover; animation: pd-zoom 1.8s var(--dj-ease) both; }
.pd-hero-media::after { content: ''; position: absolute; inset: 0; background: linear-gradient(180deg, rgba(0, 0, 0, 0.58) 0%, rgba(0, 0, 0, 0.2) 40%, rgba(0, 0, 0, 0.05) 70%, rgba(0, 0, 0, 0.32) 100%); }
.pd-hero-copy { position: relative; z-index: 1; display: flex; flex-direction: column; align-items: center; width: 100%; padding-top: clamp(56px, 9vh, 104px); }
.pd-hero-eyebrow { font-size: 14px; font-weight: 500; color: rgba(255, 255, 255, 0.8); }
.pd-hero-title { margin-top: 8px; max-width: 18ch; font-size: clamp(34px, 5.4vw, 72px); line-height: 1.04; font-weight: 600; letter-spacing: -0.03em; color: #fff; text-wrap: balance; }
.pd-hero-loc { margin-top: 12px; font-size: clamp(16px, 1.4vw, 20px); color: rgba(255, 255, 255, 0.86); }
.pd-hero-act { margin-top: 24px; }
.pd-hero--plain { height: auto; min-height: 0; padding: clamp(64px, 9vw, 120px) 0 clamp(40px, 5vw, 64px); background: #fff; color: var(--dj-ink); }
.pd-hero--plain .pd-hero-copy { padding-top: 0; }
.pd-hero--plain .pd-hero-title { color: var(--dj-ink); }
.pd-hero--plain .pd-hero-eyebrow, .pd-hero--plain .pd-hero-loc { color: var(--dj-muted); }
@keyframes pd-zoom { from { transform: scale(1.06); opacity: 0.4; } to { transform: none; opacity: 1; } }

.pd-crumbs { margin-bottom: clamp(28px, 4vw, 48px); font-size: 13px; }
.pd-lede { max-width: 30em; margin: 0 auto; text-align: center; font-size: clamp(20px, 2.1vw, 30px); line-height: 1.4; font-weight: 500; letter-spacing: -0.015em; color: var(--dj-ink); text-wrap: pretty; }

/* Ключевые цифры: крупный тонкий шрифт */
.pd-stats { display: grid; grid-template-columns: repeat(var(--n, 3), minmax(0, 1fr)); gap: 32px; margin: clamp(48px, 6vw, 80px) 0 0; padding: clamp(32px, 4vw, 48px) 0 0; border-top: 1px solid var(--dj-line); list-style: none; }
.pd-stats li { display: grid; gap: 8px; align-content: start; text-align: center; }
.pd-stats b { font-size: clamp(30px, calc(10vw / var(--n, 3)), 56px); line-height: 1.02; font-weight: 200; letter-spacing: -0.03em; color: var(--dj-ink); font-variant-numeric: tabular-nums; white-space: nowrap; }
.pd-stats b.is-long { font-size: clamp(22px, 2.2vw, 30px); line-height: 1.2; font-weight: 300; white-space: normal; overflow-wrap: anywhere; }
.pd-stats span { font-size: 14px; color: var(--dj-muted); }

/* Задача / Решение / Результат */
.pd-steps { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 12px; margin-top: clamp(32px, 4vw, 48px); padding: 0 12px; }
.pd-step { display: flex; flex-direction: column; gap: 8px; padding: clamp(28px, 3vw, 44px); background: #fff; }
.pd-step__num { font-size: 56px; line-height: 1; font-weight: 200; letter-spacing: -0.04em; color: var(--dj-ink); }
.pd-kicker { margin-top: 12px; font-size: 13px; font-weight: 500; color: var(--dj-accent); }
.pd-step__title { font-size: clamp(20px, 1.8vw, 26px); line-height: 1.2; font-weight: 600; color: var(--dj-ink); letter-spacing: -0.02em; }
.pd-step__text { font-size: 15px; line-height: 1.6; color: var(--dj-text); }

/* Галерея: квадратные края, зазор 12px */
.pd-gallery { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 12px; padding: 0 12px; }
.pd-gallery .pd-shot:first-child { grid-column: 1 / -1; aspect-ratio: 21 / 9; }
.pd-gallery--even .pd-shot:last-child { grid-column: 1 / -1; aspect-ratio: 21 / 9; }
.pd-shot { display: block; padding: 0; overflow: hidden; background: var(--dj-soft); aspect-ratio: 4 / 3; cursor: zoom-in; }
.pd-shot img { width: 100%; height: 100%; object-fit: cover; transition: transform 1.2s var(--dj-ease); }
.pd-shot:hover img { transform: scale(1.03); }

/* Стек и оборудование */
.pd-pills { display: flex; flex-wrap: wrap; justify-content: center; gap: 8px; max-width: 900px; margin: 24px auto 0; }
.pd-pill { display: inline-flex; align-items: center; height: 34px; padding: 0 16px; border-radius: 999px; background: var(--dj-soft); font-size: 13px; color: var(--dj-ink); }
.pd-subhead { padding: clamp(28px, 4vw, 48px) 24px 0; }
.pd-eq { min-height: clamp(400px, 34vw, 520px); }
.pd-eq__title { font-size: clamp(22px, 2vw, 30px); }
.pd-eq .dj-tile__media { height: 55%; }

/* Отзыв */
.pd-quote { max-width: 860px; margin: 0 auto; text-align: center; }
.pd-quote blockquote { font-size: clamp(22px, 2.4vw, 34px); line-height: 1.35; font-weight: 400; letter-spacing: -0.02em; color: var(--dj-ink); }
.pd-quote figcaption { margin-top: 20px; font-size: 14px; color: var(--dj-muted); }

/* Параметры */
.pd-params-wrap { max-width: 880px; }
.pd-params { margin-top: clamp(28px, 3.5vw, 44px); border-top: 1px solid var(--dj-ink); }
.pd-param { display: flex; justify-content: space-between; align-items: baseline; gap: 24px; padding: 20px 4px; border-bottom: 1px solid var(--dj-line); }
.pd-param dt { font-size: 15px; color: var(--dj-muted); }
.pd-param dd { text-align: right; font-size: clamp(17px, 1.5vw, 21px); font-weight: 500; color: var(--dj-ink); }

/* Другие проекты: кинокарточки */
.pd-others { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 12px; padding: 0 12px 12px; }
.pd-other { position: relative; display: block; aspect-ratio: 3 / 4; overflow: hidden; background: #0b0d10; color: #fff; isolation: isolate; }
.pd-other__media { position: absolute; inset: 0; z-index: -1; }
.pd-other__media img { width: 100%; height: 100%; object-fit: cover; transition: transform 1.2s var(--dj-ease); }
.pd-other:hover .pd-other__media img { transform: scale(1.04); }
.pd-other::after { content: ''; position: absolute; inset: 0; z-index: -1; background: linear-gradient(180deg, rgba(0, 0, 0, 0) 45%, rgba(0, 0, 0, 0.75) 100%); }
.pd-other__copy { position: absolute; inset: auto 0 0 0; display: grid; gap: 4px; padding: 24px; }
.pd-other-title { font-size: clamp(18px, 1.5vw, 22px); line-height: 1.2; font-weight: 600; letter-spacing: -0.01em; }
.pd-other__meta { font-size: 13px; color: rgba(255, 255, 255, 0.78); }

.pd-cta__lede { max-width: 56ch; margin-top: 16px; }
.pd-cta__act { margin-top: 28px; }
.pd-cta-note { margin-top: 12px; font-size: 13px; color: var(--dj-muted); }

/* Lightbox */
.pd-lb { position: fixed; inset: 0; z-index: 60; display: flex; align-items: center; justify-content: center; padding: 16px; background: rgba(0, 0, 0, 0.92); }
.pd-lb-box { position: relative; width: 100%; max-width: 72rem; }
.pd-lb-box > img { display: block; width: 100%; max-height: 82vh; object-fit: contain; }
.pd-lb-bar { position: absolute; top: -40px; right: 0; display: flex; gap: 20px; font-size: 14px; color: #fff; }
.pd-lb-bar button { color: #fff; }
.pd-lb-bar button:hover { opacity: 0.7; }
.pd-lb-arrow { position: absolute; top: 50%; transform: translateY(-50%); z-index: 1; display: flex; align-items: center; justify-content: center; width: 44px; height: 44px; border-radius: 50%; background: rgba(255, 255, 255, 0.18); color: #fff; backdrop-filter: blur(8px); }
.pd-lb-arrow:hover { background: rgba(255, 255, 255, 0.32); }
.pd-lb-arrow svg { width: 20px; height: 20px; }
.pd-lb-arrow--l { left: 8px; }
.pd-lb-arrow--r { right: 8px; }

@media (max-width: 1023px) {
  .pd-others { grid-template-columns: 1fr 1fr; }
  .pd-steps { grid-template-columns: 1fr; }
  .pd-stats { grid-template-columns: repeat(2, minmax(0, 1fr)); }
}
@media (max-width: 767px) {
  .pd-hero { height: calc(88svh - var(--dj-header-h)); min-height: 460px; }
  .pd-gallery { grid-template-columns: 1fr; gap: 8px; padding: 0 8px; }
  .pd-gallery .pd-shot:first-child, .pd-gallery--even .pd-shot:last-child { aspect-ratio: 4 / 3; }
  .pd-steps { padding: 0 8px; gap: 8px; }
  .pd-stats { grid-template-columns: 1fr; gap: 28px; }
  .pd-others { gap: 8px; padding: 0 8px 8px; }
  .pd-other__copy { padding: 16px; }
  .pd-param { flex-direction: column; gap: 4px; }
  .pd-param dd { text-align: left; }
}
@media (prefers-reduced-motion: reduce) {
  .pd-hero-media video, .pd-hero-media img { animation: none; }
  .pd-shot img, .pd-other__media img { transition: none; }
}
</style>
