<template>
  <div v-if="project" id="top" ref="root" class="pd">
    <!-- Первый экран: название объекта крупно, съёмка под ним во всю ширину -->
    <AppleHero
      :eyebrow="project.badge || project.region || ''"
      :title="project.name"
      :lede="project.location && project.location !== project.name ? project.location : ''"
      :video="project.video || ''"
      :image="heroImage"
      :alt="project.name"
      :dark="!!(project.video || heroImage)"
    >
      <NuxtLink to="/contacts#contact-form" class="ax-btn">Обсудить похожий проект</NuxtLink>
    </AppleHero>

    <AppleSubBar :title="subTitle" :links="subLinks" :cta="{ to: '/contacts#contact-form', label: 'Оставить заявку' }" />

    <!-- Описание: заявление, слова подсвечиваются при прокрутке; цифры — бенто -->
    <section id="overview" class="pd-anchor pd-overview">
      <div class="ax-wrap">
        <div class="pd-crumbs">
          <Breadcrumb :items="[{ label: 'Проекты', to: '/projects' }, { label: project.name }]" />
        </div>
        <p v-if="ledeWords.length" ref="ledeEl" class="pd-lede">
          <span v-for="(w, i) in ledeWords" :key="i" :class="{ 'is-lit': i < lit }">{{ w + ' ' }}</span>
        </p>
      </div>
      <AppleBento v-if="keyStats.length" class="pd-bento" :items="statBento" />
    </section>

    <!-- Задача / Решение / Результат: липкий кадр и главы -->
    <section v-if="steps.length" class="ax-sec ax-light">
      <div class="ax-wrap ax-head dj-reveal">
        <span class="ax-eyebrow">Траектория модернизации</span>
        <h2 class="ax-h2">Путь трансформации сточных вод</h2>
      </div>
      <AppleChapters :items="stepItems" :image="heroImage" :video="project.video || ''" />
    </section>

    <!-- Галерея: «Главное» с паузой и стрелками, по клику — просмотр -->
    <div v-if="project.gallery && project.gallery.length" id="gallery" class="pd-anchor">
      <AppleHighlights title="Фото объекта и сборки модулей" tone="white" :items="galleryItems" />
    </div>

    <!-- Технологический стек и оборудование -->
    <section v-if="project.techStack && project.techStack.length" id="stack" class="pd-anchor ax-sec ax-dark">
      <div class="ax-wrap ax-head dj-reveal">
        <h2 class="ax-h2">Использованный технологический стек</h2>
        <div class="pd-pills">
          <span v-for="t in project.techStack" :key="t" class="pd-pill">{{ t }}</span>
        </div>
      </div>
      <template v-if="usedEquipment.length">
        <div class="ax-wrap pd-subhead dj-reveal"><h3 class="ax-h3">Применённое оборудование</h3></div>
        <AppleCloserLook class="dj-reveal" :items="eqItems" label="Применённое оборудование" />
      </template>
    </section>

    <!-- Отзыв -->
    <section v-if="project.reviewName" class="ax-sec">
      <div class="ax-wrap">
        <figure class="pd-quote dj-reveal">
          <blockquote>{{ project.reviewQuote }}</blockquote>
          <figcaption>{{ project.reviewName }}</figcaption>
        </figure>
      </div>
    </section>

    <!-- Параметры проекта: как Tech Specs apple.com -->
    <section v-if="params.length" id="params" class="ax-sec pd-anchor">
      <div class="ax-wrap">
        <h2 class="ax-h2 dj-reveal">Параметры проекта</h2>
        <dl class="pd-params dj-reveal">
          <div v-for="row in params" :key="row.label" class="pd-param">
            <dt>{{ row.label }}</dt>
            <dd>{{ row.value }}</dd>
          </div>
        </dl>
      </div>
    </section>

    <!-- Другие проекты: карусель -->
    <section v-if="otherProjects.length" class="ax-sec ax-light">
      <div class="ax-wrap ax-head dj-reveal">
        <h2 class="ax-h2">Другие проекты</h2>
        <div class="ax-actions"><NuxtLink to="/projects" class="ax-link">Все объекты</NuxtLink></div>
      </div>
      <AppleWhy :items="otherCards" />
    </section>

    <!-- CTA: без сотрудника и должности, телефон общий — приёмная. -->
    <AppleCta
      title="Обсудим похожий объект"
      lede="Расскажите о задаче — инженеры ESP изучат исходные данные и предложат решение под условия вашего объекта."
      note="Телефон приёмной ESP"
    >
      <NuxtLink to="/contacts#contact-form" class="ax-btn">Оставить заявку</NuxtLink>
      <a :href="`tel:${PHONE_TEL}`" class="ax-link">{{ PHONE }}</a>
    </AppleCta>

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
    <section class="ax-sec">
      <div class="ax-wrap pd-center">
        <p class="ax-lede">Проект не найден.</p>
        <div class="ax-actions ax-actions--center"><NuxtLink to="/projects" class="ax-link">Вернуться к проектам</NuxtLink></div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { computed, ref, onMounted, onBeforeUnmount } from 'vue'
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

// ===== Раскладка по блокам страницы продукта apple.com =====
const statBento = computed(() => {
  const n = keyStats.value.length
  return keyStats.value.map((st, i) => ({
    size: n === 1 ? 'full' : (n === 2 || (n === 4) ? 'md' : (n === 3 ? 'sm' : 'sm')),
    value: st.value,
    label: st.label,
    tone: i === 0 ? 'ink' : ''
  }))
})
const stepItems = computed(() => {
  const g = project.value?.gallery || []
  const withImg = g.length >= steps.value.length
  return steps.value.map((st, i) => ({
    kicker: `${st.num} · ${st.kicker}`,
    title: st.title,
    text: sw(st.text),
    image: withImg ? g[i] : undefined
  }))
})
const galleryItems = computed(() => (project.value?.gallery || []).map((img, i) => ({
  image: img,
  alt: `${project.value.name} — фото ${i + 1}`,
  label: `Открыть фото ${i + 1}`,
  click: () => openLightbox(i)
})))
const eqItems = computed(() => usedEquipment.value.map((eq) => ({
  label: eq.name, text: eq.capacity || '', image: eq.image, contain: true, to: `/equipment/${eq.slug}`, linkLabel: 'Смотреть оборудование'
})))
const otherCards = computed(() => otherProjects.value.map((p) => ({
  title: p.name,
  text: [p.location, p.capacity].filter(Boolean).join(' · '),
  image: p.poster || p.gallery?.[0],
  to: `/projects/${p.slug}`
})))

// Описание подсвечивается словами по мере прокрутки, как на apple.com/environment
const ledeEl = ref(null)
const ledeWords = computed(() => sw(project.value?.longDesc || project.value?.desc || '').split(/\s+/).filter(Boolean))
const lit = ref(0)
let ledeRaf = 0
const onLede = () => {
  if (ledeRaf) return
  ledeRaf = requestAnimationFrame(() => {
    ledeRaf = 0
    const el = ledeEl.value
    if (!el) return
    const r = el.getBoundingClientRect()
    const vh = window.innerHeight
    const p = Math.min(1, Math.max(0, (vh * 0.85 - r.top) / (r.height + vh * 0.35)))
    lit.value = Math.round(p * ledeWords.value.length)
  })
}
onMounted(() => {
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) { lit.value = 1e6; return }
  window.addEventListener('scroll', onLede, { passive: true })
  onLede()
})
onBeforeUnmount(() => {
  window.removeEventListener('scroll', onLede)
  if (ledeRaf) cancelAnimationFrame(ledeRaf)
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

<style scoped src="../../components/apple/apple.css"></style>
<style scoped>
.pd { background: #fff; }
.pd-anchor { scroll-margin-top: 108px; }
.pd-center { text-align: center; }
.pd-crumbs { padding-top: 18px; margin-bottom: clamp(40px, 6vw, 80px); font-size: 12px; }

/* Описание: крупное заявление, слова «загораются» при прокрутке */
.pd-overview { padding-bottom: clamp(80px, 11vw, 160px); }
.pd-lede { margin: 0; font-size: clamp(28px, 3.4vw, 48px); line-height: 1.12; font-weight: 600; letter-spacing: -0.003em; color: #1d1d1f; text-wrap: pretty; }
.pd-lede span { color: #d2d2d7; transition: color 0.35s ease; }
.pd-lede span.is-lit { color: #1d1d1f; }
.pd-bento { margin-top: clamp(56px, 7vw, 96px) !important; }
.pd-bento :deep(.bn-tile) { background: #f5f5f7; }
.pd-bento :deep(.bn--ink) { background: #002366 !important; }

/* Стек */
.pd-pills { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 28px; }
.pd-pill { display: inline-flex; align-items: center; height: 36px; padding: 0 16px; border-radius: 980px; background: #1d1d1f; font-size: 14px; letter-spacing: -0.016em; color: #f5f5f7; }
.pd-subhead { margin: clamp(48px, 6vw, 80px) auto 28px; }

/* Отзыв */
.pd-quote { max-width: 860px; margin: 0 auto; text-align: center; }
.pd-quote blockquote { margin: 0; font-size: clamp(24px, 2.6vw, 32px); line-height: 1.25; font-weight: 600; letter-spacing: 0.004em; color: #1d1d1f; }
.pd-quote figcaption { margin-top: 20px; font-size: 17px; color: #6e6e73; }

/* Параметры */
.pd-params { margin: clamp(32px, 4vw, 56px) 0 0; border-top: 1px solid #d2d2d7; }
.pd-param { display: grid; grid-template-columns: minmax(0, 1fr) minmax(0, 2fr); gap: 24px; padding: 28px 0; border-bottom: 1px solid #d2d2d7; }
.pd-param dt { font-size: 17px; line-height: 1.47; font-weight: 600; letter-spacing: -0.022em; color: #1d1d1f; }
.pd-param dd { margin: 0; font-size: clamp(21px, 2vw, 28px); line-height: 1.14; letter-spacing: 0.007em; color: #1d1d1f; }

/* Lightbox */
.pd-lb { position: fixed; inset: 0; z-index: 60; display: flex; align-items: center; justify-content: center; padding: 16px; background: rgba(0, 0, 0, 0.92); }
.pd-lb-box { position: relative; width: 100%; max-width: 72rem; }
.pd-lb-box > img { display: block; width: 100%; max-height: 82vh; object-fit: contain; border-radius: 18px; }
.pd-lb-bar { position: absolute; top: -40px; right: 0; display: flex; gap: 20px; font-size: 14px; color: #f5f5f7; }
.pd-lb-bar button { color: #f5f5f7; }
.pd-lb-bar button:hover { opacity: 0.7; }
.pd-lb-arrow { position: absolute; top: 50%; transform: translateY(-50%); z-index: 1; display: flex; align-items: center; justify-content: center; width: 44px; height: 44px; border-radius: 50%; background: rgba(66, 66, 69, 0.72); color: #f5f5f7; backdrop-filter: blur(20px); -webkit-backdrop-filter: blur(20px); }
.pd-lb-arrow:hover { background: rgba(90, 90, 94, 0.8); }
.pd-lb-arrow svg { width: 20px; height: 20px; }
.pd-lb-arrow--l { left: 8px; }
.pd-lb-arrow--r { right: 8px; }

@media (max-width: 734px) {
  .pd-param { grid-template-columns: 1fr; gap: 6px; }
  .ax-h2 { overflow-wrap: break-word; hyphens: auto; }
}
@media (prefers-reduced-motion: reduce) {
  .pd-lede span { transition: none; }
}
</style>
