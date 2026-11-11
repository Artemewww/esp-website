<template>
  <!-- Страница оборудования по макету DJI Mavic 4 Pro: hero → липкая подполоса →
       тёмная полоса ключевых параметров и плитки-хайлайты → главы с крупным
       медиа (полноэкранный ролик, сплит «кадр + текст», плитки деталей) →
       характеристики → объекты → смежное оборудование → таблица сравнения → CTA.
       Блоки без данных у конкретной позиции не показываются. -->
  <div v-if="product" ref="root" class="eqp-page">
    <EquipHeroBanner :product="product" :slides="heroSlides" :tagline="heroTagline" @more="jump('#overview')" />

    <div class="eqp-subnav">
      <DjSubnav :title="product.name" :links="subLinks" :cta="{ label: 'Запросить консультацию', to: '/contacts#contact-form' }" />
    </div>

    <!-- Обзор: полоса ключевых параметров и плитки 2×N -->
    <section id="overview" class="eqp-keys">
      <div class="dj-wrap">
        <div class="eqp-center dj-reveal">
          <span v-if="product.badge" class="eqp-eyebrow">{{ product.badge }}</span>
          <p class="eqp-keys-lead">{{ product.desc }}</p>
        </div>
        <ul v-if="keyFeatures.length" class="eqp-keys-grid" :class="`n-${Math.min(keyFeatures.length, 3)}`">
          <li v-for="k in keyFeatures" :key="k.label" class="dj-reveal">
            <b>{{ k.value }}</b>
            <span>{{ k.label }}</span>
          </li>
        </ul>
        <div v-if="tiles.length" class="eqp-tiles" :class="`n-${tiles.length}`">
          <figure v-for="t in tiles" :key="t.src" class="eqp-tile dj-reveal" :class="`is-${t.fit}`">
            <img :src="t.src" :alt="t.alt" loading="lazy" decoding="async" @error="fail(t.src)" />
            <figcaption>{{ t.caption }}</figcaption>
          </figure>
        </div>
      </div>
    </section>

    <!-- Глава 1. Принцип работы: заголовок раздела, текст, полноэкранное медиа -->
    <section class="eqp-ch">
      <div class="dj-wrap eqp-center dj-reveal">
        <h2 class="eqp-sec-title">Принцип работы</h2>
        <h3 class="eqp-h3">{{ product.name }}</h3>
      </div>
      <div class="dj-wrap eqp-ch-text dj-reveal">
        <p v-for="(para, i) in descParagraphs" :key="i">{{ para }}</p>
      </div>
      <figure v-if="films[0]" class="eqp-bleed dj-reveal">
        <EquipInViewVideo :src="films[0].video" :poster="films[0].poster" :label="films[0].name" />
        <figcaption class="dj-wrap"><b>{{ films[0].own ? 'На объекте' : 'Объект ESP' }}.</b> {{ films[0].name }}<template v-if="films[0].meta"> · {{ films[0].meta }}</template></figcaption>
      </figure>
    </section>

    <!-- Глава 2. Конструкция: сплит «кадр + текст» и плитки деталей -->
    <section v-if="splits.length || details.length || looseList.length" class="eqp-ch">
      <div class="dj-wrap eqp-center dj-reveal">
        <h2 class="eqp-sec-title">Конструкция</h2>
      </div>
      <div class="dj-wrap">
        <div v-for="(s, i) in splits" :key="s.key" class="eqp-split dj-reveal" :class="{ 'is-flip': i % 2 }">
          <div class="eqp-split-media" :class="`is-${s.media.fit}`">
            <img :src="s.media.src" :alt="s.media.alt" loading="lazy" decoding="async" @error="fail(s.media.src)" />
          </div>
          <div class="eqp-split-text">
            <h3 class="eqp-h3">{{ s.title }}</h3>
            <ul class="eqp-list">
              <li v-for="it in s.list" :key="it.label || it">
                <template v-if="it.label"><b>{{ it.label }}.</b> {{ it.value }}</template>
                <template v-else>{{ it }}</template>
              </li>
            </ul>
          </div>
        </div>
        <ul v-if="looseList.length" class="eqp-list eqp-list--loose dj-reveal">
          <li v-for="it in looseList" :key="it.label || it">
            <template v-if="it.label"><b>{{ it.label }}.</b> {{ it.value }}</template>
            <template v-else>{{ it }}</template>
          </li>
        </ul>
        <div v-if="details.length" class="eqp-details" :class="`n-${details.length}`">
          <figure v-for="d in details" :key="d.src" class="eqp-detail dj-reveal">
            <img :src="d.src" :alt="d.alt" loading="lazy" decoding="async" @error="fail(d.src)" />
            <figcaption>{{ d.caption }}</figcaption>
          </figure>
        </div>
      </div>
    </section>

    <!-- Технические характеристики: две колонки -->
    <section v-if="product.specs?.length" id="specs" class="eqp-sec eqp-specs-sec">
      <div class="dj-wrap">
        <h2 class="eqp-sec-title eqp-center dj-reveal">Технические характеристики</h2>
        <dl class="eqp-specs dj-reveal">
          <div v-for="s in product.specs" :key="s.label">
            <dt>{{ s.label }}</dt>
            <dd>{{ s.value }}</dd>
          </div>
        </dl>
        <p v-if="product.sku" class="eqp-sku">Артикул: {{ product.sku }}</p>
      </div>
    </section>

    <!-- Применение: полноэкранный ролик и сетка объектов 3×N -->
    <section id="application" class="eqp-ch eqp-appl">
      <div class="dj-wrap eqp-center dj-reveal">
        <h2 class="eqp-sec-title">{{ related.length ? 'На объектах' : 'Применение' }}</h2>
        <p v-if="product.application" class="eqp-lede">Применение: {{ product.application }}<template v-if="product.category"> · {{ product.category }}</template></p>
      </div>
      <figure v-if="films[1]" class="eqp-bleed dj-reveal">
        <EquipInViewVideo :src="films[1].video" :poster="films[1].poster" :label="films[1].name" />
        <figcaption class="dj-wrap"><b>{{ films[1].own ? 'На объекте' : 'Объект ESP' }}.</b> {{ films[1].name }}<template v-if="films[1].meta"> · {{ films[1].meta }}</template></figcaption>
      </figure>
      <div class="dj-wrap">
        <div v-if="related.length" class="eqp-where">
          <NuxtLink v-for="p in related" :key="p.slug" :to="`/projects/${p.slug}`" class="eqp-where-card dj-reveal">
            <div class="eqp-where-img"><img :src="cover(p)" :alt="p.name" loading="lazy" decoding="async" /></div>
            <b>{{ p.name }}</b>
            <span>{{ p.location }}<template v-if="p.capacity"> · {{ p.capacity }}</template></span>
          </NuxtLink>
        </div>
        <div class="eqp-center eqp-app-more">
          <NuxtLink to="/projects" class="eqp-more">Все проекты</NuxtLink>
        </div>
      </div>
    </section>

    <!-- Смежное оборудование: крупная плитка и ряд карточек, как «аксессуары» -->
    <section v-if="accessories.length" class="eqp-sec eqp-acc">
      <div class="dj-wrap">
        <h2 class="eqp-sec-title eqp-center dj-reveal">Смежное оборудование</h2>
        <div class="eqp-acc-grid">
          <NuxtLink v-for="(p, i) in accessories" :key="p.slug" :to="`/equipment/${p.slug}`" class="eqp-acc-card dj-reveal" :class="{ 'is-big': i === 0 }">
            <div class="eqp-acc-media"><EquipShot :item="p" :caption="false" /></div>
            <b>{{ p.name }}</b>
            <small>{{ p.category }}</small>
          </NuxtLink>
        </div>
        <div class="eqp-center eqp-app-more">
          <NuxtLink to="/equipment" class="eqp-more">Всё оборудование</NuxtLink>
        </div>
      </div>
    </section>

    <!-- Сравнение: таблица из трёх позиций -->
    <section v-if="compare.length > 1" class="eqp-sec eqp-cmp">
      <div class="dj-wrap">
        <h2 class="eqp-sec-title eqp-center dj-reveal">Сравните оборудование</h2>
        <div class="eqp-cmp-scroll dj-reveal">
          <table lang="ru" class="eqp-cmp-table" :style="{ '--cols': compare.length }">
            <thead>
              <tr>
                <th v-for="c in compare" :key="c.slug" scope="col">
                  <div class="eqp-cmp-media"><EquipShot :item="c.item" :caption="false" /></div>
                  <b>{{ c.item.name }}</b>
                  <NuxtLink v-if="c.slug !== product.slug" :to="`/equipment/${c.slug}`" class="eqp-more">Подробнее</NuxtLink>
                  <span v-else class="eqp-cmp-now">Эта позиция</span>
                </th>
              </tr>
            </thead>
            <tbody>
              <template v-for="r in compareRows" :key="r.label">
                <tr class="eqp-cmp-label"><th :colspan="compare.length" scope="colgroup">{{ r.label }}</th></tr>
                <tr>
                  <td v-for="c in compare" :key="c.slug">{{ c[r.key] || '—' }}</td>
                </tr>
              </template>
            </tbody>
          </table>
        </div>
      </div>
    </section>

    <section class="eqp-sec eqp-cta">
      <div class="dj-wrap">
        <h2 class="eqp-h1">Обсудим<br /><span>ваш проект</span></h2>
        <div class="eqp-cta-act">
          <NuxtLink to="/contacts#contact-form" class="eqp-btn">Обсудить проект</NuxtLink>
        </div>
        <p class="eqp-cta-note">Гарантия до 5 лет · Коммерческое предложение за 24 часа</p>
      </div>
    </section>
  </div>

  <div v-else class="eqp-missing">
    <h1 class="eqp-h2">Оборудование не найдено</h1>
    <NuxtLink to="/equipment" class="eqp-btn">Всё оборудование</NuxtLink>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useProjects } from '~/composables/useProjects'
import { useReveal } from '~/composables/useReveal'
import { renderOf } from '~/utils/equipVisual'

const { equipment, getBySlug } = useEquipment()
const { projects } = useProjects()
const route = useRoute()
const root = ref(null)
useReveal(root)

const product = computed(() => getBySlug(route.params.slug))
const photo = computed(() => product.value?.photo || product.value?.image)
const render = computed(() => renderOf(product.value))
const descParagraphs = computed(() => (product.value?.longDesc || product.value?.desc || '').split('\n\n'))

// Связанные объекты: в каталоге ссылки бывают длиннее слага проекта
// («krichev-vodokanal» → «krichev»), поэтому сверяем и по началу
const related = computed(() => {
  const refs = product.value?.relatedProjects || []
  return projects.value.filter((p) => refs.some((r) => r === p.slug || r.startsWith(p.slug + '-')))
})
const cover = (p) => (Array.isArray(p.gallery) && p.gallery[0]) || p.poster || p.image
const gallery = computed(() => related.value.flatMap((p) => (Array.isArray(p.gallery) ? p.gallery : []).slice(0, 4).map((src) => ({ src, alt: p.name }))))

const realPhoto = computed(() => {
  const s = photo.value
  if (!s || s === render.value || /placeholder\.svg$/.test(s) || !/^\/images\/equipment\//.test(s)) return null
  return s
})

// ——— Изображения: только реальные кадры ———
// Не загрузившиеся файлы (рендеры ещё могут дорисовываться) просто скрываем
const broken = ref({})
const fail = (src) => { broken.value = { ...broken.value, [src]: true } }
// Студийные рендеры 3D-моделей: public/images/equipment/renders/<slug>/<вид>.webp.
// Набор известен по слагу, но файлы показываем, только когда они реально загрузились
const RENDER_SETS = new Set(['flotation-units', 'polymer-dosing-station', 'filter-press', 'microfilters-sand-traps'])
const shot = (slug, view) => (RENDER_SETS.has(slug) ? `/images/equipment/renders/${slug}/${view}.webp` : null)
// Список реально существующих файлов берём из сборки (glob по public без импорта),
// поэтому несуществующие виды не запрашиваются и не дают 404
const SHOT_FILES = new Set(Object.keys(import.meta.glob('/public/images/equipment/renders/*/*.webp', { query: '?url' })).map((k) => k.replace(/^\/public/, '')))
const isShot = (src) => /\/renders\/[a-z-]+\//.test(src)
const ok = (m) => m && m.src && !broken.value[m.src] && (!isShot(m.src) || SHOT_FILES.has(m.src))
// Старые рендеры (светлый и тёмный фон) и вырезки изделия на прозрачном фоне
const MODELS = new Set(['flotation-units', 'microfilters-sand-traps', 'polymer-dosing-station', 'filter-press'])
const model = (slug, v) => (MODELS.has(slug) ? `/images/equipment/renders/${slug}-${v}.webp` : null)
const CUTS = { 'flotation-units': 'flotation', 'microfilters-sand-traps': 'microfilter', 'polymer-dosing-station': 'polymer-station', 'filter-press': 'belt-filter-press', 'rotary-drum-sieve': 'rotary-drum-sieve', 'sand-separator': 'sand-separator', 'screw-conveyor': 'screw-conveyor' }
const cutOf = (p) => (CUTS[p?.slug] ? `/images/equipment/cut/${CUTS[p.slug]}.webp` : null)
const BANNERS = { 'flotation-units': '/images/equipment/gen/flotation-banner.webp' }

const heroSlides = computed(() => {
  const p = product.value
  if (!p) return []
  const out = []
  if (CUTS[p.slug]) out.push({ key: 'studio', type: 'studio', src: cutOf(p), alt: p.name })
  if (realPhoto.value) out.push({ key: 'real', type: 'photo', src: realPhoto.value, alt: p.name, dark: true })
  gallery.value.slice(0, 2).forEach((g, i) => out.push({ key: 'g' + i, type: 'photo', src: g.src, alt: g.alt, dark: true }))
  return out.length ? out : [{ key: 'none', type: 'photo', src: '/images/real4k/aerial-orbit.webp', alt: p.name, dark: true }]
})
const heroTagline = computed(() => {
  const d = product.value?.desc || ''
  const first = d.split(/(?<=[.!?])\s/)[0]
  return first.length > 120 ? '' : first
})

// ——— Полоса ключевых параметров (данные карточки, новых фактов нет) ———
const keyFeatures = computed(() => {
  const p = product.value
  if (!p) return []
  const out = []
  if (p.capacity) out.push({ label: 'Производительность', value: p.capacity })
  ;(p.specs || []).forEach((s) => {
    if (p.capacity && s.label === 'Производительность') return
    if (String(s.value).length <= 24) out.push({ label: s.label, value: s.value })
  })
  if (out.length < 3 && p.application) out.push({ label: 'Применение', value: p.application })
  if (out.length < 3 && p.category && p.category !== p.application) out.push({ label: 'Категория', value: p.category })
  return out.slice(0, 6)
})

// Плитки-хайлайты: кадр изделия + подпись-преимущество
const tiles = computed(() => {
  const p = product.value
  if (!p) return []
  const pool = [
    { src: shot(p.slug, 'hero'), fit: 'cover' },
    { src: shot(p.slug, 'dark'), fit: 'cover' },
    { src: cutOf(p), fit: 'cut' },
    { src: model(p.slug, 'field'), fit: 'cover' }
  ].filter(ok)
  // Подписи: преимущества, затем длинные характеристики, не вошедшие в полосу
  const longSpecs = (p.specs || []).filter((s) => String(s.value).length > 24 && !isMaterial(s)).map((s) => `${s.label}: ${s.value}`)
  const caps = [...(p.advantages || []), ...longSpecs]
  return pool.slice(0, Math.min(2, caps.length)).map((t, i) => ({ ...t, alt: p.name, caption: caps[i] }))
})

// ——— Ролики с объектов: сначала объекты с этим оборудованием, затем
// объекты ESP той же отрасли (подпись честно говорит «Объект ESP») ———
const APP_OBJECTS = {
  'Промышленность': ['postavy-dairy', 'vitkonprodukt'],
  'HoReCa / Пищепром': ['vitkonprodukt', 'postavy-dairy'],
  'АПК / КХ': ['vitebsk-broiler', 'rechitsa'],
  'Механическая очистка': ['rechitsa', 'fanipol'],
  'Обезвоживание осадка': ['fanipol', 'rechitsa'],
  'Обработка осадка': ['fanipol', 'rechitsa'],
  'КХ / Жилые': ['skidel', 'krasnoe'],
  'Посёлки, малые объекты': ['krasnoe', 'skidel']
}
const DEFAULT_OBJECTS = ['rechitsa', 'mstislavl']
const films = computed(() => {
  const p = product.value
  if (!p) return []
  const own = related.value.filter((x) => x.video).map((x) => ({ ...x, own: true }))
  const slugs = APP_OBJECTS[p.application] || DEFAULT_OBJECTS
  const more = slugs.map((s) => projects.value.find((x) => x.slug === s && x.video)).filter(Boolean)
  const seen = new Set()
  return [...own, ...more]
    .filter((x) => !seen.has(x.video) && seen.add(x.video))
    .slice(0, 2)
    .map((x) => ({ video: x.video, poster: x.poster || x.video.replace(/\.mp4$/, '.jpg'), name: x.name, meta: [x.name.includes(x.location) ? '' : x.location, x.capacity].filter(Boolean).join(' · '), own: !!x.own }))
})

// ——— Конструкция: сплит «кадр + текст» и плитки деталей ———
const isMaterial = (s) => /материал|корпус|исполнение|модификац/i.test(s.label)
const splits = computed(() => {
  const p = product.value
  if (!p) return []
  const out = []
  const mats = (p.specs || []).filter(isMaterial)
  const imgs = [
    { src: shot(p.slug, 'detail-1'), fit: 'cover' },
    { src: BANNERS[p.slug], fit: 'cover' },
    { src: model(p.slug, 'light'), fit: 'cover' },
    { src: shot(p.slug, 'detail-2'), fit: 'cover' },
    { src: realPhoto.value, fit: 'cut' },
    { src: cutOf(p), fit: 'cut' }
  ].filter(ok)
  if (p.advantages?.length && imgs[0]) out.push({ key: 'adv', title: 'Преимущества', list: p.advantages, media: { ...imgs.shift(), alt: p.name } })
  if (mats.length && imgs[0]) out.push({ key: 'mat', title: 'Материалы и исполнение', list: mats, media: { ...imgs.shift(), alt: p.name } })
  return out
})
const VIEWS = [['front', 'Вид спереди'], ['side', 'Вид сбоку'], ['top', 'Вид сверху']]
const details = computed(() => {
  const p = product.value
  if (!p) return []
  const out = VIEWS.map(([v, caption]) => ({ src: shot(p.slug, v), caption, alt: `${p.name}. ${caption}` })).filter(ok)
  return out.length >= 2 ? out : []
})
// Если для текстов нет кадра — показываем их списком без сплита
const looseList = computed(() => {
  const p = product.value
  if (!p) return []
  const shown = new Set(splits.value.map((s) => s.key))
  return [...(!shown.has('adv') ? p.advantages || [] : []), ...(!shown.has('mat') ? (p.specs || []).filter(isMaterial) : [])]
})

// ——— Смежное оборудование и сравнение ———
const siblings = computed(() => {
  const p = product.value
  if (!p) return []
  const others = equipment.value.filter((e) => e.slug !== p.slug)
  const same = others.filter((e) => e.category === p.category)
  const rest = others.filter((e) => e.category !== p.category).sort((a, b) => (renderOf(b) ? 1 : 0) - (renderOf(a) ? 1 : 0))
  return [...same, ...rest]
})
const accessories = computed(() => siblings.value.slice(2, 7))
const specOf = (e, label) => (e.specs || []).find((s) => s.label === label)?.value || ''
const compare = computed(() => {
  const p = product.value
  if (!p) return []
  return [p, ...siblings.value.slice(0, 2)].map((e) => ({
    slug: e.slug,
    item: e,
    capacity: e.capacity || specOf(e, 'Производительность'),
    category: e.category,
    application: e.application,
    warranty: specOf(e, 'Гарантия')
  }))
})
const compareRows = [
  { key: 'capacity', label: 'Производительность' },
  { key: 'category', label: 'Категория' },
  { key: 'application', label: 'Применение' },
  { key: 'warranty', label: 'Гарантия' }
]

const subLinks = computed(() => {
  const l = [{ label: 'Обзор', href: '#overview' }]
  if (product.value?.specs?.length) l.push({ label: 'Характеристики', href: '#specs' })
  l.push({ label: 'Применение', href: '#application' })
  return l
})
const jump = (href) => {
  const el = document.querySelector(href)
  if (!el) return
  window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 56 - 52 + 1, behavior: 'smooth' })
}

const ogOrigin = useRuntimeConfig().public.ogOrigin
useHead(() => ({
  title: product.value ? `${product.value.name} | Оборудование ESP` : 'Оборудование не найдено | ESP',
  meta: [
    { name: 'description', content: product.value ? `${product.value.desc} Технические характеристики и расчёт под ваш объект.` : '' },
    { property: 'og:title', content: product.value ? product.value.name : '' },
    { property: 'og:description', content: product.value ? product.value.desc : '' },
    { property: 'og:image', content: `${ogOrigin}/images/og-esp.png` }
  ],
  link: [{ rel: 'canonical', href: product.value ? `https://ecoservisproekt.by/equipment/${product.value.slug}` : '' }]
}))

useSchemaOrg([
  defineProduct(() => ({
    name: product.value?.name,
    description: product.value?.desc,
    image: product.value ? `${ogOrigin}${photo.value}` : undefined,
    category: product.value?.category,
    brand: 'ESP'
  })),
  defineBreadcrumb(() => ([
    { name: 'Оборудование', item: '/equipment' },
    { name: product.value?.name }
  ]))
])
</script>

<style scoped>
/* Макет DJI Mavic 4 Pro: чёрная страница, центрированные заголовки разделов,
   полноэкранные медиа, сплиты, сетки 2/3 колонки; шкала Apple/SF */
.eqp-page { --ink: #f5f5f7; --mute: #86868b; --line: #333336; --tile: #161617; background: #000; color: var(--ink); font-family: var(--dj-font); letter-spacing: -0.022em; overflow-x: clip; }
.eqp-center { text-align: center; }
.eqp-sec { padding: clamp(80px, 10vw, 140px) 0; }
.eqp-eyebrow { display: block; margin-bottom: 12px; font-size: clamp(17px, 1.6vw, 21px); line-height: 1.19; font-weight: 600; letter-spacing: 0.011em; color: var(--mute); }
.eqp-sec-title { font-size: clamp(40px, 5.6vw, 80px); line-height: 1.05; font-weight: 600; letter-spacing: -0.015em; color: var(--ink); text-wrap: balance; overflow-wrap: break-word; }
.eqp-h1 { font-size: clamp(40px, 5.6vw, 80px); line-height: 1.05; font-weight: 600; letter-spacing: -0.015em; }
.eqp-h2 { font-size: clamp(32px, 3.9vw, 56px); line-height: 1.07; font-weight: 600; }
.eqp-h3 { margin-top: 16px; font-size: clamp(24px, 2.4vw, 32px); line-height: 1.19; font-weight: 600; letter-spacing: 0.004em; color: var(--ink); text-wrap: balance; overflow-wrap: break-word; }
.eqp-lede { max-width: 760px; margin: 16px auto 0; font-size: clamp(17px, 1.5vw, 21px); line-height: 1.381; letter-spacing: 0.011em; color: var(--mute); }
.eqp-more { display: inline-flex; align-items: center; gap: 3px; font-size: 17px; line-height: 1.18; font-style: normal; color: #2997ff; white-space: nowrap; }
.eqp-more::after { content: '›'; font-size: 1.25em; line-height: 1; transform: translateY(-1px); transition: transform 0.3s var(--dj-ease); }
.eqp-more:hover { text-decoration: underline; }
.eqp-more:hover::after { transform: translate(3px, -1px); }
.eqp-btn { display: inline-flex; align-items: center; justify-content: center; min-height: 44px; padding: 0 22px; border-radius: 980px; font-size: 17px; line-height: 1.18; color: #fff; background: #0071e3; white-space: nowrap; transition: background-color 0.25s ease; }
.eqp-btn:hover { background: #0077ed; }
.eqp-btn:focus-visible, .eqp-more:focus-visible { outline: 2px solid #2997ff; outline-offset: 3px; }

/* Подполоса */
.eqp-subnav { position: sticky; top: var(--dj-header-h); z-index: 40; }
.eqp-subnav :deep(.dsn) { position: static; }
.eqp-subnav :deep(.dsn-title) { min-width: 0; overflow: hidden; text-overflow: ellipsis; }
.eqp-subnav :deep(.dsn-links) { flex-shrink: 0; }

/* Обзор: ключевые параметры и плитки */
.eqp-keys { padding: clamp(80px, 10vw, 140px) 0 clamp(64px, 8vw, 112px); }
.eqp-keys-lead { max-width: 900px; margin: 0 auto; font-size: clamp(24px, 2.4vw, 32px); line-height: 1.19; font-weight: 600; letter-spacing: 0.004em; color: var(--ink); text-wrap: balance; }
.eqp-keys-grid { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: clamp(32px, 4vw, 56px) clamp(24px, 3vw, 48px); margin: clamp(48px, 6vw, 80px) 0 0; padding: clamp(40px, 5vw, 64px) 0 0; list-style: none; border-top: 1px solid var(--line); text-align: center; }
.eqp-keys-grid.n-2 { grid-template-columns: repeat(2, minmax(0, 1fr)); }
.eqp-keys-grid.n-1 { grid-template-columns: 1fr; }
.eqp-keys-grid li { display: flex; flex-direction: column; gap: 10px; min-width: 0; }
.eqp-keys-grid b { font-size: clamp(28px, 2.8vw, 40px); line-height: 1.1; font-weight: 600; color: #fff; overflow-wrap: break-word; }
.eqp-keys-grid span { font-size: 17px; line-height: 1.24; color: var(--mute); }
.eqp-tiles { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 20px; margin-top: clamp(48px, 6vw, 80px); }
.eqp-tiles.n-1 { grid-template-columns: 1fr; }
.eqp-tile { display: flex; flex-direction: column; margin: 0; overflow: hidden; border-radius: 18px; background: var(--tile); }
.eqp-tile figcaption { order: -1; padding: clamp(24px, 3vw, 40px) clamp(24px, 3vw, 40px) 0; font-size: clamp(19px, 1.8vw, 24px); line-height: 1.17; font-weight: 600; text-align: center; color: #fff; text-wrap: balance; }
.eqp-tile img { display: block; width: 100%; aspect-ratio: 16 / 10; margin-top: auto; padding-top: clamp(16px, 2vw, 28px); object-fit: cover; }
.eqp-tiles.n-1 .eqp-tile img { aspect-ratio: 21 / 9; }
.eqp-tile.is-cut img { padding: 0 8% 6%; object-fit: contain; }

/* Главы */
.eqp-ch { padding: clamp(80px, 10vw, 140px) 0 0; }
.eqp-ch-text { max-width: 820px; margin-top: 28px; }
.eqp-ch-text p { font-size: clamp(17px, 1.4vw, 19px); line-height: 1.47; letter-spacing: 0.011em; color: var(--mute); }
.eqp-ch-text p + p { margin-top: 1em; }
.eqp-bleed { margin: clamp(48px, 6vw, 80px) 0 0; }
.eqp-bleed video { display: block; width: 100%; aspect-ratio: 16 / 9; max-height: 92vh; object-fit: cover; background: #111; }
.eqp-bleed figcaption { padding-top: 16px; font-size: 14px; line-height: 1.43; letter-spacing: -0.016em; color: var(--mute); }
.eqp-bleed figcaption b { font-weight: 600; color: var(--ink); }

/* Сплит «кадр + текст» */
.eqp-split { display: grid; grid-template-columns: minmax(0, 1fr) minmax(0, 1fr); gap: clamp(28px, 5vw, 80px); align-items: center; margin-top: clamp(48px, 6vw, 80px); }
.eqp-split.is-flip .eqp-split-media { order: 2; }
.eqp-split-media { position: relative; aspect-ratio: 4 / 3; overflow: hidden; border-radius: 18px; background: var(--tile); }
.eqp-split-media img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; }
.eqp-split-media.is-cut img { inset: 8%; width: 84%; height: 84%; object-fit: contain; }
.eqp-split-text .eqp-h3 { margin-top: 0; }
.eqp-list { display: grid; gap: 14px; margin: 24px 0 0; padding: 0; list-style: none; }
.eqp-list li { position: relative; padding-left: 22px; font-size: 17px; line-height: 1.47; color: var(--mute); }
.eqp-list li::before { content: ''; position: absolute; left: 0; top: 0.6em; width: 8px; height: 8px; border-radius: 50%; background: #2997ff; }
.eqp-list b { font-weight: 600; color: var(--ink); }
.eqp-list--loose { grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 16px 40px; max-width: 900px; margin: clamp(32px, 4vw, 48px) auto 0; }
.eqp-details { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 20px; margin-top: clamp(48px, 6vw, 80px); }
.eqp-details.n-2 { grid-template-columns: repeat(2, minmax(0, 1fr)); }
.eqp-detail { margin: 0; }
.eqp-detail img { display: block; width: 100%; aspect-ratio: 1 / 1; object-fit: cover; border-radius: 18px; background: var(--tile); }
.eqp-detail figcaption { margin-top: 12px; font-size: 14px; text-align: center; color: var(--mute); }

/* Характеристики */
.eqp-specs { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 0 clamp(32px, 5vw, 80px); margin: clamp(40px, 5vw, 64px) 0 0; }
.eqp-specs > div { min-width: 0; padding: 20px 0; border-top: 1px solid var(--line); }
.eqp-specs dt { font-size: 14px; line-height: 1.43; font-weight: 600; letter-spacing: -0.016em; color: var(--mute); }
.eqp-specs dd { margin: 6px 0 0; font-size: 17px; line-height: 1.47; color: var(--ink); overflow-wrap: break-word; }
.eqp-sku { margin-top: 24px; font-size: 12px; color: var(--mute); }

/* Объекты 3×N */
.eqp-appl { padding-bottom: clamp(80px, 10vw, 140px); }
.eqp-where { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 20px; margin-top: clamp(40px, 5vw, 64px); }
.eqp-where-card { display: flex; flex-direction: column; gap: 6px; min-width: 0; }
.eqp-where-img { aspect-ratio: 16 / 10; margin-bottom: 10px; overflow: hidden; border-radius: 18px; background: var(--tile); }
.eqp-where-img img { width: 100%; height: 100%; object-fit: cover; transition: transform 0.6s var(--dj-ease); }
.eqp-where-card:hover img { transform: scale(1.03); }
.eqp-where-card b { font-size: 17px; line-height: 1.24; font-weight: 600; color: var(--ink); }
.eqp-where-card span { font-size: 14px; line-height: 1.43; color: var(--mute); }
.eqp-app-more { margin-top: 32px; }

/* Смежное оборудование: крупная плитка + карточки */
.eqp-acc { padding-top: 0; }
.eqp-acc-grid { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 20px; margin-top: clamp(40px, 5vw, 64px); }
.eqp-acc-card { display: flex; flex-direction: column; gap: 4px; min-width: 0; padding: 16px 16px 20px; border-radius: 18px; background: var(--tile); text-align: center; }
.eqp-acc-card.is-big { grid-column: span 2; grid-row: span 2; justify-content: flex-end; }
.eqp-acc-media { aspect-ratio: 1 / 1; margin-bottom: 10px; overflow: hidden; border-radius: 12px; background: #fff; }
.eqp-acc-card.is-big .eqp-acc-media { flex: 1; aspect-ratio: auto; min-height: 200px; }
.eqp-acc-card b { font-size: 14px; line-height: 1.29; font-weight: 600; color: var(--ink); overflow-wrap: break-word; }
.eqp-acc-card.is-big b { font-size: 21px; }
.eqp-acc-card small { font-size: 12px; color: var(--mute); }

/* Таблица сравнения */
.eqp-cmp { padding-top: 0; }
.eqp-cmp-scroll { margin-top: clamp(40px, 5vw, 64px); }
.eqp-cmp-table { width: 100%; table-layout: fixed; border-collapse: collapse; text-align: center; }
.eqp-cmp-table thead th { padding: 0 12px 28px; vertical-align: top; font-weight: 400; }
.eqp-cmp-media { width: min(100%, 240px); aspect-ratio: 1 / 1; margin: 0 auto 16px; overflow: hidden; border-radius: 18px; background: #fff; }
.eqp-cmp-table thead b { display: block; margin-bottom: 8px; font-size: 17px; line-height: 1.24; font-weight: 600; color: var(--ink); overflow-wrap: break-word; }
.eqp-cmp-now { font-size: 14px; color: var(--mute); }
.eqp-cmp-label th { padding: 20px 0 8px; border-top: 1px solid var(--line); font-size: 12px; font-weight: 600; letter-spacing: -0.01em; color: var(--mute); }
.eqp-cmp-table td { padding: 0 12px 16px; vertical-align: top; font-size: 17px; line-height: 1.35; color: var(--ink); overflow-wrap: break-word; }

/* Финал */
.eqp-cta { text-align: center; border-top: 1px solid var(--line); }
.eqp-cta .eqp-h1 span { color: var(--mute); }
.eqp-cta-act { display: flex; justify-content: center; margin-top: 32px; }
.eqp-cta-note { margin-top: 20px; font-size: 14px; color: var(--mute); }

.eqp-missing { min-height: 60vh; display: grid; place-content: center; justify-items: center; gap: 24px; padding: 48px 24px; text-align: center; }

@media (max-width: 1068px) {
  .eqp-keys-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
  .eqp-where { grid-template-columns: 1fr 1fr; }
  .eqp-acc-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
}
@media (max-width: 734px) {
  .eqp-keys-grid, .eqp-keys-grid.n-2 { grid-template-columns: 1fr; gap: 28px; }
  .eqp-tiles, .eqp-split, .eqp-specs, .eqp-where, .eqp-list--loose { grid-template-columns: 1fr; }
  .eqp-tiles.n-1 .eqp-tile img { aspect-ratio: 16 / 10; }
  .eqp-split.is-flip .eqp-split-media { order: 0; }
  .eqp-details, .eqp-details.n-2 { grid-template-columns: 1fr 1fr; gap: 12px; }
  .eqp-bleed video { aspect-ratio: 4 / 5; }
  .eqp-cmp-table thead th, .eqp-cmp-table td { padding-left: 6px; padding-right: 6px; }
  .eqp-cmp-table thead b, .eqp-cmp-table td { font-size: 13px; overflow-wrap: normal; hyphens: auto; -webkit-hyphens: auto; }
  .eqp-cmp-table .eqp-more { font-size: 14px; }
  .eqp-cta .eqp-h1 { overflow-wrap: break-word; }
}
@media (prefers-reduced-motion: reduce) {
  .eqp-where-img img { transition: none; }
}
</style>
