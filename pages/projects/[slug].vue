<template>
  <div v-if="project" class="ap">
    <!-- BLOCK 1: шапка в подаче Apple — заголовок и описание в потоке,
         под ними скруглённый кадр объекта: видео, если есть съёмка,
         иначе обложка или первое фото. -->
    <!-- Первый экран: кадр объекта на всю ширину и высоту, название поверх -->
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
        <img v-else :src="heroImage" :alt="project.name" />
      </div>
      <div class="pd-hero-copy ap-wrap">
        <div class="pd-crumbs">
          <Breadcrumb :items="[{ label: 'Проекты', to: '/projects' }, { label: project.name }]" />
        </div>
        <span v-if="project.badge || project.region" class="pd-hero-eyebrow">{{ project.badge || project.region }}</span>
        <h1 class="pd-hero-title">{{ project.name }}</h1>
        <div class="ap-actions">
          <NuxtLink to="/contacts#contact-form" class="pd-hero-btn">Обсудить похожий проект</NuxtLink>
          <span v-if="project.location" class="pd-hero-loc">{{ project.location }}</span>
        </div>
      </div>
    </section>

    <section class="ap-sec ap-sec--tight">
      <div class="ap-wrap">
        <p v-if="project.longDesc || project.desc" class="ap-lede pd-lede">
          {{ sw(project.longDesc || project.desc) }}
        </p>
        <!-- BLOCK 2: ключевые цифры объекта. Пустое поле не выводим. -->
        <ul v-if="keyStats.length" class="ap-stats pd-stats">
          <li v-for="s in keyStats" :key="s.label"><b>{{ s.value }}</b><span>{{ s.label }}</span></li>
        </ul>
      </div>
    </section>

    <!-- BLOCK 3: Task / Solution / Result -->
    <section v-if="steps.length" class="ap-sec ap-sec--white">
      <div class="ap-wrap">
        <span class="ap-eyebrow">Траектория модернизации</span>
        <h2 class="ap-h2">Путь трансформации сточных вод</h2>
        <div class="ap-grid ap-grid--3">
          <div v-for="st in steps" :key="st.num" class="ap-card">
            <span class="pd-kicker">{{ st.num }} · {{ st.kicker }}</span>
            <h3 class="ap-h3">{{ st.title }}</h3>
            <p class="ap-text">{{ sw(st.text) }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- BLOCK 4: Gallery -->
    <section v-if="project.gallery && project.gallery.length" class="ap-sec">
      <div class="ap-wrap">
        <h2 class="ap-h2">Фото объекта и сборки модулей</h2>
        <div class="ap-grid pd-gallery">
          <button
            v-for="(img, idx) in project.gallery"
            :key="idx"
            type="button"
            class="pd-shot"
            :aria-label="`Открыть фото ${idx + 1}`"
            @click="openLightbox(idx)"
          >
            <img :src="img" :alt="`${project.name} — фото ${idx + 1}`" loading="lazy" decoding="async" />
          </button>
        </div>
      </div>
    </section>

    <!-- BLOCK 5: Tech stack -->
    <section v-if="project.techStack && project.techStack.length" class="ap-sec ap-sec--white">
      <div class="ap-wrap">
        <h2 class="ap-h2">Использованный технологический стек</h2>
        <div class="pd-pills">
          <span v-for="t in project.techStack" :key="t" class="ap-pill">{{ t }}</span>
        </div>

        <template v-if="usedEquipment.length">
          <h3 class="ap-h3 pd-subhead">Применённое оборудование</h3>
          <div class="ap-grid ap-grid--2 pd-eq">
            <NuxtLink
              v-for="eq in usedEquipment"
              :key="eq.slug"
              :to="`/equipment/${eq.slug}`"
              class="ap-card ap-card--media"
            >
              <div class="pd-eq-img"><img :src="eq.image" :alt="eq.name" loading="lazy" /></div>
              <div class="ap-card-body">
                <h4 class="ap-h3">{{ eq.name }}</h4>
                <p class="ap-small">{{ eq.capacity }}</p>
                <span class="ap-card-foot ap-link">Смотреть оборудование ›</span>
              </div>
            </NuxtLink>
          </div>
        </template>
      </div>
    </section>

    <!-- BLOCK 6: Testimonial -->
    <section v-if="project.reviewName" class="ap-sec">
      <div class="ap-wrap ap-wrap--narrow">
        <figure class="pd-quote">
          <blockquote>{{ project.reviewQuote }}</blockquote>
          <figcaption class="ap-small">{{ project.reviewName }}</figcaption>
        </figure>
      </div>
    </section>

    <!-- Параметры и другие проекты -->
    <section v-if="params.length || otherProjects.length" class="ap-sec ap-sec--white">
      <div class="ap-wrap pd-bottom" :class="{ 'pd-bottom--solo': !params.length || !otherProjects.length }">
        <aside v-if="params.length">
          <h2 class="ap-h3">Параметры проекта</h2>
          <dl class="ap-rows pd-params">
            <div v-for="row in params" :key="row.label" class="ap-row">
              <dt class="ap-text">{{ row.label }}</dt>
              <dd><b>{{ row.value }}</b></dd>
            </div>
          </dl>
        </aside>

        <div v-if="otherProjects.length">
          <h2 class="ap-h3">Другие проекты</h2>
          <div class="ap-grid ap-grid--2 pd-others">
            <NuxtLink
              v-for="p in otherProjects"
              :key="p.slug"
              :to="`/projects/${p.slug}`"
              class="ap-card ap-card--media"
            >
              <img v-if="p.poster || (p.gallery && p.gallery[0])" :src="p.poster || p.gallery[0]" :alt="p.name" class="ap-card-img" loading="lazy" decoding="async" />
              <div v-else class="ap-card-img"></div>
              <div class="ap-card-body">
                <h3 class="pd-other-title">{{ p.name }}</h3>
                <p class="ap-small">{{ [p.location, p.capacity].filter(Boolean).join(' · ') }}</p>
              </div>
            </NuxtLink>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA: без сотрудника и должности, телефон общий — приёмная. -->
    <section class="ap-sec ap-cta">
      <div class="ap-wrap ap-wrap--narrow">
        <h2 class="ap-h2">Обсудим похожий объект</h2>
        <p class="ap-lede">
          Расскажите о задаче — инженеры ESP изучат исходные данные и предложат решение под условия вашего объекта.
        </p>
        <div class="ap-actions ap-center">
          <NuxtLink to="/contacts#contact-form" class="ap-btn">Оставить заявку</NuxtLink>
          <a :href="`tel:${PHONE_TEL}`" class="ap-link tabular-nums">{{ PHONE }} ›</a>
        </div>
        <p class="ap-small pd-cta-note">Телефон приёмной ESP</p>
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
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" aria-hidden="true"><path d="M14.5 6l-6 6 6 6" /></svg>
        </button>
        <img :src="project.gallery[activePhotoIdx]" :alt="`${project.name} — фото ${activePhotoIdx + 1}`" />
        <button type="button" class="pd-lb-arrow pd-lb-arrow--r" aria-label="Следующее фото" @click="nextPhoto">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" aria-hidden="true"><path d="M9.5 6l6 6-6 6" /></svg>
        </button>
      </div>
    </div>
  </div>
  <div v-else class="ap">
    <section class="ap-sec ap-sec--first ap-center">
      <div class="ap-wrap">
        <p class="ap-lede">Проект не найден.</p>
        <NuxtLink to="/projects" class="ap-link">Вернуться к проектам ›</NuxtLink>
      </div>
    </section>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import { useProjects } from '~/composables/useProjects'
import { equipmentList } from '~/composables/useEquipment'

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
.pd-crumbs { margin-bottom: 1.25rem; font-size: 13px; }

/* Первый экран: кадр на весь экран, текст поверх затемнения снизу */
.pd-hero { position: relative; display: flex; align-items: flex-end; height: 100vh; height: 100svh; min-height: 34rem; max-height: 62rem; margin-top: -5rem; overflow: hidden; background: #1d1d1f; color: #fff; }
.pd-hero-media { position: absolute; inset: 0; }
.pd-hero-media video, .pd-hero-media img { width: 100%; height: 100%; object-fit: cover; }
.pd-hero-media::after { content: ''; position: absolute; inset: 0; background: linear-gradient(to top, rgba(20, 20, 22, 0.9) 0%, rgba(20, 20, 22, 0.55) 35%, rgba(20, 20, 22, 0.1) 70%); }
.pd-hero-copy { position: relative; z-index: 1; width: 100%; padding-bottom: clamp(2rem, 6vh, 4rem); }
.pd-hero-copy :deep(a), .pd-hero-copy :deep(span), .pd-hero-copy :deep(li) { color: rgba(255, 255, 255, 0.78); }
.pd-hero-eyebrow { display: block; margin-bottom: 0.6rem; font-size: 14px; font-weight: 600; }
.pd-hero-title { max-width: 52rem; font-family: var(--font-sans); font-weight: 700; font-size: clamp(2rem, 5vw, 4rem); line-height: 1.06; letter-spacing: -0.025em; color: #fff; }
.pd-hero-btn { display: inline-flex; align-items: center; padding: 0.7rem 1.35rem; border-radius: 999px; background: #fff; color: #1d1d1f !important; font-size: 15px; line-height: 1.2; transition: background-color 0.2s ease; }
.pd-hero-btn:hover { background: #e8e8ed; }
.pd-hero-loc { font-size: 13px; }
.pd-hero--plain { height: auto; min-height: 0; padding-top: 8rem; }
.pd-lede { margin-top: 0; color: var(--ap-ink); }

.pd-stats b { font-size: clamp(1.4rem, 2.4vw, 2rem); line-height: 1.15; overflow-wrap: anywhere; }

.pd-kicker { font-size: 13px; font-weight: 600; color: var(--ap-accent); }

/* Галерея: крупные кадры, первый — во всю ширину */
.pd-gallery { grid-template-columns: repeat(2, minmax(0, 1fr)); }
.pd-gallery .pd-shot:first-child { grid-column: 1 / -1; aspect-ratio: 16 / 9; }
.pd-shot { display: block; padding: 0; border-radius: 18px; overflow: hidden; background: #ebebef; aspect-ratio: 4 / 3; cursor: zoom-in; }
.pd-shot img { width: 100%; height: 100%; object-fit: cover; transition: transform 0.6s cubic-bezier(0.16, 1, 0.3, 1); }
.pd-shot:hover img { transform: scale(1.03); }

.pd-pills { display: flex; flex-wrap: wrap; gap: 0.5rem; margin-top: 1.5rem; }
.pd-pills .ap-pill { font-size: 13px; padding: 0.35rem 0.85rem; }
.pd-subhead { margin-top: 3rem; }
.pd-eq { margin-top: 1.25rem; }
.pd-eq-img { aspect-ratio: 4 / 3; display: flex; align-items: center; justify-content: center; padding: 1.5rem; background: #fff; }
.pd-eq-img img { width: 100%; height: 100%; object-fit: contain; }

.pd-quote { margin: 0; padding: clamp(1.75rem, 4vw, 3rem); border-radius: 22px; background: #fff; }
.pd-quote blockquote { font-size: clamp(1.15rem, 2vw, 1.5rem); line-height: 1.45; font-weight: 500; letter-spacing: -0.01em; color: var(--ap-ink); }
.pd-quote figcaption { margin-top: 1rem; }

.pd-bottom { display: grid; grid-template-columns: minmax(0, 1fr) minmax(0, 2fr); gap: 2.5rem; align-items: start; }
.pd-bottom--solo { grid-template-columns: minmax(0, 1fr); }
.pd-params { margin-top: 1.25rem; }
.pd-params dd { text-align: right; }
.pd-others { margin-top: 1.25rem; }
.pd-others .ap-card-body { padding: 1.1rem 1.3rem 1.3rem; }
.pd-other-title { font-size: 1.02rem; font-weight: 600; line-height: 1.3; letter-spacing: -0.01em; color: var(--ap-ink); }

.pd-cta-note { margin-top: 0.75rem; }

/* Lightbox */
.pd-lb { position: fixed; inset: 0; z-index: 50; display: flex; align-items: center; justify-content: center; padding: 1rem; background: rgba(0, 0, 0, 0.9); }
.pd-lb-box { position: relative; width: 100%; max-width: 64rem; }
.pd-lb-box > img { display: block; width: 100%; max-height: 80vh; object-fit: contain; border-radius: 12px; }
.pd-lb-bar { position: absolute; top: -2.5rem; right: 0; display: flex; gap: 1.25rem; font-size: 14px; color: #fff; }
.pd-lb-bar button { color: #fff; }
.pd-lb-bar button:hover { opacity: 0.7; }
.pd-lb-arrow { position: absolute; top: 50%; transform: translateY(-50%); z-index: 1; display: flex; align-items: center; justify-content: center; width: 44px; height: 44px; border-radius: 50%; background: rgba(255, 255, 255, 0.18); color: #fff; backdrop-filter: blur(8px); }
.pd-lb-arrow:hover { background: rgba(255, 255, 255, 0.32); }
.pd-lb-arrow svg { width: 20px; height: 20px; }
.pd-lb-arrow--l { left: 0.5rem; }
.pd-lb-arrow--r { right: 0.5rem; }

@media (max-width: 1023px) {
  .pd-bottom { grid-template-columns: minmax(0, 1fr); }
}
@media (max-width: 767px) {
  .pd-gallery { grid-template-columns: minmax(0, 1fr); gap: 0.75rem; }
  .pd-gallery .pd-shot:first-child { aspect-ratio: 4 / 3; }
  .pd-shot { border-radius: 14px; }
  .pd-stats { grid-template-columns: minmax(0, 1fr); }
}
</style>
