<template>
  <div v-if="project" id="top" ref="root" class="pd">
    <!-- Первый экран: название объекта крупно, съёмка под ним во всю ширину -->
    <AppleHero
      :eyebrow="heroEyebrow"
      :title="project.name"
      :lede="project.location && project.location !== project.name ? project.location : ''"
      :video="project.video || ''"
      :image="heroImage"
      :alt="project.name"
      :dark="!!(project.video || heroImage)"
      sky
    >
      <NuxtLink to="/contacts#contact-form" class="ax-btn">Обсудить похожий проект</NuxtLink>
      <a v-if="project.film" href="#film" class="ax-link">Смотреть фильм</a>
    </AppleHero>

    <AppleSubBar :title="subTitle" :links="subLinks" :cta="{ to: '/contacts#contact-form', label: 'Обсудить проект' }" />

    <!-- Описание: заявление, слова подсвечиваются при прокрутке; цифры — бенто -->
    <section id="overview" class="pd-anchor pd-overview">
      <div class="ax-wrap">
        <div class="pd-crumbs">
          <Breadcrumb :items="[{ label: 'Объекты', to: '/projects' }, { label: project.name }]" />
        </div>
        <p v-if="ledeWords.length" ref="ledeEl" class="pd-lede">
          <span v-for="(w, i) in ledeWords" :key="i" :class="{ 'is-lit': i < lit }">{{ w + ' ' }}</span>
        </p>
      </div>
      <AppleBento v-if="keyStats.length" class="pd-bento" :items="statBento" />
    </section>

    <!-- Фильм об объекте: аэросъёмка ESP, грузится только по нажатию Play -->
    <section v-if="project.film" id="film" class="pd-anchor ax-sec ax-white pd-film">
      <div class="ax-wrap ax-head dj-reveal">
        <span class="ax-eyebrow">Фильм об объекте</span>
        <h2 class="ax-h2">Объект с высоты</h2>
      </div>
      <div class="ax-wrap">
        <video class="pd-film__v" :src="project.film" :poster="project.filmPoster" controls playsinline preload="none" />
      </div>
    </section>

    <!-- Показатели: графики только по данным объекта -->
    <section id="charts" class="pd-anchor ax-sec ax-light pd-charts">
      <div class="ax-wrap ax-head dj-reveal">
        <span class="ax-eyebrow">Показатели</span>
        <h2 class="ax-h2">Объект в цифрах</h2>
      </div>
      <div class="ax-wrap pd-chgrid">
        <!-- Очистка: вход и выход -->
        <figure v-if="cleaning" class="pd-chart pd-chart--wide dj-reveal">
          <figcaption>
            <b>Очистка сточных вод{{ cleaning.what ? ` · ${cleaning.what}` : '' }}</b>
            <span>Концентрация на входе и на выходе, мг/л</span>
          </figcaption>
          <div class="pd-bars">
            <div class="pd-bar">
              <span class="pd-bar__k">Вход</span>
              <span class="pd-bar__track"><i class="pd-bar__fill pd-bar__fill--in" style="width: 100%"></i></span>
              <span class="pd-bar__v">{{ cleaning.before }}</span>
            </div>
            <div class="pd-bar">
              <span class="pd-bar__k">Выход</span>
              <span class="pd-bar__track"><i class="pd-bar__fill pd-bar__fill--out" :style="{ width: `${Math.max(1.5, cleaning.after / cleaning.before * 100)}%` }"></i></span>
              <span class="pd-bar__v">{{ cleaning.after }}</span>
            </div>
          </div>
          <p class="pd-chart__big"><b>−{{ cleaning.cut }}%</b> загрязнений после очистки</p>
        </figure>

        <!-- Доли в процентах — кольца -->
        <figure v-for="m in percentMetrics" :key="m.label" class="pd-chart pd-ring dj-reveal">
          <span class="pd-ring__dial">
            <svg viewBox="0 0 120 120" aria-hidden="true">
              <circle cx="60" cy="60" r="50" class="pd-ring__bg" />
              <circle cx="60" cy="60" r="50" class="pd-ring__fg" :stroke-dasharray="`${m.pct * 3.1416} 314.16`" />
            </svg>
            <b class="pd-ring__v">{{ m.value }}<small>%</small></b>
          </span>
          <figcaption>{{ m.label }}</figcaption>
        </figure>

        <!-- Масштаб: производительность среди ключевых объектов ESP -->
        <figure v-if="scale.length > 1" class="pd-chart pd-chart--wide dj-reveal">
          <figcaption>
            <b>Производительность среди ключевых объектов ESP</b>
            <span>м³/сут</span>
          </figcaption>
          <ol class="pd-scale">
            <li v-for="r in scale" :key="r.slug" :class="{ 'is-cur': r.cur }">
              <NuxtLink v-if="!r.cur" :to="`/projects/${r.slug}`" class="pd-scale__k">{{ r.short }}</NuxtLink>
              <span v-else class="pd-scale__k">{{ r.short }}</span>
              <span class="pd-bar__track"><i class="pd-bar__fill" :style="{ width: `${Math.max(1.5, r.n / scaleMax * 100)}%` }"></i></span>
              <span class="pd-bar__v">{{ r.label }}</span>
            </li>
          </ol>
        </figure>
      </div>
    </section>

    <!-- Задача / Решение / Результат: липкий кадр и главы -->
    <section v-if="steps.length" class="ax-sec ax-light">
      <div class="ax-wrap ax-head dj-reveal">
        <span class="ax-eyebrow">Этапы модернизации</span>
        <h2 class="ax-h2">От исходной задачи к результату</h2>
      </div>
      <AppleChapters :items="stepItems" :image="heroImage" :video="project.video || ''" />
    </section>

    <!-- Галерея: «Главное» с паузой и стрелками, по клику — просмотр -->
    <div v-if="project.gallery && project.gallery.length" id="gallery" class="pd-anchor">
      <AppleHighlights title="Фото объекта" tone="white" :items="galleryItems" />
    </div>

    <!-- Технологический стек и оборудование -->
    <section v-if="project.techStack && project.techStack.length" id="stack" class="pd-anchor ax-sec ax-dark">
      <div class="ax-wrap ax-head dj-reveal">
        <h2 class="ax-h2">Применённые технологии</h2>
        <div class="pd-pills">
          <span v-for="t in project.techStack" :key="t" class="pd-pill">{{ t }}</span>
        </div>
      </div>
      <template v-if="usedEquipment.length">
        <div class="ax-wrap pd-subhead dj-reveal"><h3 class="ax-h3">Применённое оборудование</h3></div>
        <EquipNovRow :items="usedEquipment" bare :meta-of="(e) => e.capacity || ''" />
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

    <AppleCta
      title="Обсудим похожий объект"
      lede="Расскажите о задаче — инженеры ESP изучат исходные данные и предложат решение под условия вашего объекта."
    />

    <!-- Lightbox -->
    <div v-if="lightboxOpen" class="pd-lb" @click.self="lightboxOpen = false">
      <div class="pd-lb-box">
        <div class="pd-lb-bar">
          <span>{{ activePhotoIdx + 1 }} / {{ project.gallery.length }}</span>
          <button type="button" @click="lightboxOpen = false">Закрыть</button>
        </div>
        <button type="button" class="pd-lb-arrow pd-lb-arrow--l" aria-label="Предыдущее фото" @click="prevPhoto">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" aria-hidden="true"><path d="M14.5 6l-6 6 6 6" /></svg>
        </button>
        <img :src="project.gallery[activePhotoIdx]" :alt="`${project.name} — фото ${activePhotoIdx + 1}`" />
        <button type="button" class="pd-lb-arrow pd-lb-arrow--r" aria-label="Следующее фото" @click="nextPhoto">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" aria-hidden="true"><path d="M9.5 6l6 6-6 6" /></svg>
        </button>
      </div>
    </div>
  </div>
  <div v-else class="pd">
    <section class="ax-sec">
      <div class="ax-wrap pd-center">
        <p class="ax-lede">Проект не найден.</p>
        <div class="ax-actions ax-actions--center"><NuxtLink to="/projects" class="ax-link">Вернуться к проектам</NuxtLink></div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { computed, ref, onMounted, onBeforeUnmount } from 'vue'
import { useProjects, nicheInfo, capacityNum } from '~/composables/useProjects'
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


// «Стоки» в текстах из данных выводим как «сточные воды».
const sw = (s) => String(s || '')
  .replace(/стоков/g, 'сточных вод')
  .replace(/стоками/g, 'сточными водами')
  .replace(/стоках/g, 'сточных водах')
  .replace(/стоки/g, 'сточные воды')

const heroImage = computed(() => project.value?.poster || project.value?.gallery?.[0] || '')

// Регион без дубля производительности (в badge она через «|»)
const heroEyebrow = computed(() => {
  const p = project.value || {}
  return p.region || String(p.badge || '').split('|')[0].trim()
})

// ===== Единая структура показателей =====
// «Объём сточных вод» и «Производительность» — один показатель: выводим
// производительность (если пусто — объём). Метрики из данных объекта,
// повторяющие её, отбрасываем.
const DUP_RE = /объ[её]м сточных|производительн/i
const metrics = computed(() => (project.value?.metrics || []).filter(m => m && m.value && !DUP_RE.test(m.label || '')))
const percentMetrics = computed(() => metrics.value
  .filter(m => (m.suffix || '').trim() === '%')
  .map(m => ({ label: m.label, value: String(m.value), pct: Math.min(100, parseFloat(String(m.value).replace(',', '.')) || 0) })))

// Вход/выход очистки — только когда в данных есть обе цифры в мг/л
const mgl = (s) => { const m = String(s || '').match(/([\d.,]+)\s*мг\/л/); return m ? parseFloat(m[1].replace(',', '.')) : 0 }
const cleaning = computed(() => {
  const p = project.value || {}
  const before = mgl(p.beforeValue)
  const after = mgl(p.afterValue)
  if (!before || !after || after >= before) return null
  const what = (String(p.beforeValue).match(/мг\/л\s+(.+)$/) || [])[1] || ''
  return { before, after, what, cut: (Math.round((1 - after / before) * 1000) / 10).toLocaleString('ru-RU') }
})

// Ключевые цифры под кадром: год, производительность, прочие (не %) метрики.
// Качество очистки — только если нет графика «вход/выход» (там та же цифра).
const keyStats = computed(() => {
  const p = project.value || {}
  return [
    { label: 'Год запуска', value: String(p.year || '').trim() },
    { label: 'Производительность', value: String(p.capacity || p.volume || '').trim() },
    ...metrics.value.filter(m => (m.suffix || '').trim() !== '%').map(m => ({ label: m.label, value: `${m.value} ${m.suffix || ''}`.trim() })),
    !cleaning.value && { label: 'Качество очистки', value: String(p.quality || '').trim() }
  ].filter(s => s && s.value)
})

// Короткая подпись: «г. Речица», иначе имя в «ёлочках», иначе место
const shortOf = (p) => (String(p.location || '').match(/^(г\.|д\.|аг\.|п\.)\s*[^,]+/) || [])[0] ||
  (String(p.name || '').match(/«([^»]+)»/) || [])[1] || p.location || p.name

// Масштаб: все ключевые объекты по производительности, текущий выделен
const scale = computed(() => projects.value
  .filter(p => p.isKey !== false && capacityNum(p.capacity))
  .map(p => ({ slug: p.slug, short: shortOf(p), n: capacityNum(p.capacity), label: capacityNum(p.capacity).toLocaleString('ru-RU'), cur: p.slug === route.params.slug }))
  .sort((a, b) => b.n - a.n))
const scaleMax = computed(() => scale.value[0]?.n || 1)

const steps = computed(() => [
  { num: '01', kicker: 'Задача', title: 'Исходная задача', text: project.value?.task, color: 'text-esp-black/60' },
  { num: '02', kicker: 'Решение', title: 'Внедрённое решение', text: project.value?.solution, color: 'text-esp-blue' },
  { num: '03', kicker: 'Результат', title: 'Результат', text: project.value?.resultText, color: 'text-esp-green' }
].filter(st => st.text))

const params = computed(() => {
  const p = project.value || {}
  return [
    { label: 'Направление', value: nicheInfo(p).title },
    { label: 'Отрасль', value: p.category },
    { label: 'Населённый пункт', value: p.location },
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
    p.film && { href: '#film', label: 'Фильм' },
    { href: '#charts', label: 'Показатели' },
    p.gallery?.length && { href: '#gallery', label: 'Фото' },
    p.techStack?.length && { href: '#stack', label: 'Оборудование' },
    params.value.length && { href: '#params', label: 'Параметры' }
  ].filter(Boolean)
})

// ===== Раскладка по блокам страницы продукта apple.com =====
const statBento = computed(() => {
  const n = keyStats.value.length
  // плитка производительности — где бы она ни стояла — получает стальной патрубок с потоком (стиль «Lean»)
  const capIdx = keyStats.value.findIndex((st) => /м[³3]/.test(String(st.value)) || /производительн/i.test(String(st.label)))
  return keyStats.value.map((st, i) => ({
    size: n === 1 ? 'full' : (n === 2 || (n === 4) ? 'md' : (n === 3 ? 'sm' : 'sm')),
    value: st.value,
    label: st.label,
    tone: i === (capIdx >= 0 ? capIdx : 0) ? 'ink' : '',
    image: i === capIdx ? '/images/projects/capacity-flow.webp' : undefined
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
  light: true,
  click: () => openLightbox(i)
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
.pd-lede { margin: 0; font-size: clamp(25px, 3.4vw, 48px); line-height: 1.12; font-weight: 600; letter-spacing: -0.003em; color: #1A1A1A; text-wrap: pretty; overflow-wrap: break-word; hyphens: auto; }
.pd-lede span { color: #D6D6D6; transition: color 0.35s ease; }
.pd-lede span.is-lit { color: #1A1A1A; }
.pd-bento { margin-top: clamp(56px, 7vw, 96px) !important; }
.pd-bento :deep(.bn-tile) { background: #EDEDED; }
.pd-bento :deep(.bn--ink) { background: #002366 !important; }

/* Стек */
.pd-pills { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 28px; }
.pd-pill { display: inline-flex; align-items: center; height: 36px; padding: 0 16px; border-radius: var(--r-pill); background: #1A1A1A; font-size: 14px; letter-spacing: -0.016em; color: #EDEDED; }
.pd-subhead { margin: clamp(48px, 6vw, 80px) auto 28px; }

/* Отзыв */
.pd-quote { max-width: 860px; margin: 0 auto; text-align: center; }
.pd-quote blockquote { margin: 0; font-size: clamp(24px, 2.6vw, 32px); line-height: 1.25; font-weight: 600; letter-spacing: 0.004em; color: #1A1A1A; }
.pd-quote figcaption { margin-top: 20px; font-size: 17px; color: #5E5E5E; }

/* Параметры */
.pd-params { margin: clamp(32px, 4vw, 56px) 0 0; border-top: 1px solid #D6D6D6; }
.pd-param { display: grid; grid-template-columns: minmax(0, 1fr) minmax(0, 2fr); gap: 24px; padding: 28px 0; border-bottom: 1px solid #D6D6D6; }
.pd-param dt { font-size: 17px; line-height: 1.47; font-weight: 600; letter-spacing: -0.022em; color: #1A1A1A; }
.pd-param dd { margin: 0; font-size: clamp(21px, 2vw, 28px); line-height: 1.14; letter-spacing: 0.007em; color: #1A1A1A; }

/* Lightbox */
.pd-lb { position: fixed; inset: 0; z-index: 60; display: flex; align-items: center; justify-content: center; padding: 16px; background: rgba(0, 0, 0, 0.92); }
.pd-lb-box { position: relative; width: 100%; max-width: 72rem; }
.pd-lb-box > img { display: block; width: 100%; max-height: 82vh; object-fit: contain; border-radius: var(--r-md); }
.pd-lb-bar { position: absolute; top: -40px; right: 0; display: flex; gap: 20px; font-size: 14px; color: #EDEDED; }
.pd-lb-bar button { color: #EDEDED; }
.pd-lb-bar button:hover { opacity: 0.7; }
.pd-lb-arrow { position: absolute; top: 50%; transform: translateY(-50%); z-index: 1; display: flex; align-items: center; justify-content: center; width: 44px; height: 44px; border-radius: 50%; background: rgba(61, 61, 61, 0.72); color: #EDEDED; backdrop-filter: blur(20px); -webkit-backdrop-filter: blur(20px); }
.pd-lb-arrow:hover { background: rgba(90, 90, 94, 0.8); }
.pd-lb-arrow svg { width: 20px; height: 20px; }
.pd-lb-arrow--l { left: 8px; }
.pd-lb-arrow--r { right: 8px; }

/* Показатели: графики */
.pd-chgrid { display: grid; grid-template-columns: repeat(auto-fill, minmax(240px, 1fr)); gap: 16px; margin-top: clamp(32px, 4vw, 56px); }
.pd-chart { margin: 0; padding: clamp(24px, 2.6vw, 36px); border-radius: var(--r-lg); background: #fff; color: #1A1A1A; }
.pd-chart--wide { grid-column: 1 / -1; }
.pd-chart figcaption { display: grid; gap: 4px; margin-bottom: 24px; }
.pd-chart figcaption b { font-size: clamp(19px, 1.8vw, 24px); line-height: 1.2; font-weight: 600; letter-spacing: 0.009em; }
.pd-chart figcaption span { font-size: 14px; color: #5E5E5E; }
.pd-bars, .pd-scale { display: grid; gap: 14px; margin: 0; padding: 0; list-style: none; }
.pd-bar, .pd-scale li { display: grid; grid-template-columns: minmax(64px, 9rem) minmax(0, 1fr) 4.5rem; align-items: center; gap: 14px; font-size: 14px; letter-spacing: -0.016em; }
.pd-bar__k { color: #5E5E5E; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
a.pd-scale__k:hover { color: #002366; }
.pd-bar__track { position: relative; height: 12px; border-radius: var(--r-pill); background: #EDEDED; overflow: hidden; }
.pd-bar__fill { position: absolute; inset: 0 auto 0 0; border-radius: inherit; background: #c7cbd4; }
.pd-bar__fill--in { background: #8A8A8A; }
.pd-bar__fill--out, .pd-scale li.is-cur .pd-bar__fill { background: #002366; }
.pd-bar__v { text-align: right; font-weight: 600; font-variant-numeric: tabular-nums; }
.pd-scale li.is-cur .pd-scale__k { color: #1A1A1A; font-weight: 600; }
.pd-chart__big { margin: 24px 0 0; font-size: 17px; color: #5E5E5E; }
.pd-chart__big b { margin-right: 6px; font-size: clamp(32px, 3.4vw, 48px); font-weight: 600; letter-spacing: -0.01em; color: #1f8a4c; font-variant-numeric: tabular-nums; }
.pd-ring { position: relative; display: grid; justify-items: center; align-content: start; text-align: center; }
.pd-ring__dial { position: relative; display: block; width: 160px; max-width: 100%; }
.pd-ring svg { display: block; width: 100%; transform: rotate(-90deg); }
.pd-ring__bg, .pd-ring__fg { fill: none; stroke-width: 10; }
.pd-ring__bg { stroke: #EDEDED; }
.pd-ring__fg { stroke: #002366; stroke-linecap: round; }
.pd-ring__v { position: absolute; inset: 0; display: grid; place-content: center; grid-auto-flow: column; align-items: baseline; font-size: 32px; font-weight: 600; letter-spacing: -0.01em; font-variant-numeric: tabular-nums; }
.pd-ring__v small { font-size: 18px; }
.pd-ring figcaption { margin: 18px 0 0; font-size: 17px; color: #1A1A1A; }

@media (max-width: 734px) {
  .pd-bar, .pd-scale li { grid-template-columns: 5.5rem minmax(0, 1fr) 3.6rem; gap: 10px; font-size: 13px; }
  .pd-chgrid { grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 12px; }
  .pd-chart { padding: 22px 18px; border-radius: var(--r-md); }
  .pd-ring__dial { width: 110px; }
  .pd-ring__v { font-size: 24px; }
  .pd-ring figcaption { font-size: 14px; }
  .pd :deep(.sb-title) { min-width: 0; }
  .pd-param { grid-template-columns: 1fr; gap: 6px; }
  .ax-h2 { overflow-wrap: break-word; hyphens: auto; }
}
@media (prefers-reduced-motion: reduce) {
  .pd-lede span { transition: none; }
}
.pd-film__v { display: block; width: 100%; aspect-ratio: 16 / 9; border-radius: var(--r-lg, 28px); background: #0b0d10; object-fit: cover; }
/* Плитки цифр компактнее; картинка производительности — поток справа, текст слева */
.pd-bento :deep(.bn-tile) { min-height: 180px; }
.pd-bento :deep(.bn--photo) { min-height: 240px; background: #002366; }
.pd-bento :deep(.bn--photo .bn-img) { object-position: right center; }
.pd-bento :deep(.bn--photo)::after { background: linear-gradient(90deg, rgba(0, 35, 102, 0.85) 0%, rgba(0, 35, 102, 0.35) 45%, rgba(0, 35, 102, 0) 70%); }
</style>
