<template>
  <!-- Страница оборудования в подаче Apple: hero с огромным заголовком,
       липкая подполоса, «Коротко о главном» — горизонтальная галерея
       карточек, «Рассмотрите ближе», панель запроса как Apple «Купить»
       (липкая галерея слева, параметры и капсула справа), характеристики,
       применение и сравнение соседних позиций.
       Блоки без данных у конкретной позиции не показываются. -->
  <div v-if="product" ref="root" class="eqp-page">
    <EquipHeroBanner :product="product" :slides="heroSlides" :tagline="heroTagline" @more="jump('#overview')" />

    <div class="eqp-subnav">
      <DjSubnav :title="product.name" :links="subLinks" :cta="{ label: 'Запросить КП', to: '/contacts#contact-form' }" />
    </div>

    <!-- Обзор: утверждение и bento-сетка ключевых параметров -->
    <section id="overview" class="eqp-sec eqp-overview">
      <div class="dj-wrap">
        <div class="eqp-ov-head dj-reveal">
          <span class="eqp-eyebrow">О решении</span>
          <h2 class="eqp-h2">{{ product.name }}</h2>
        </div>
        <div class="eqp-long dj-reveal">
          <p v-for="(para, i) in descParagraphs" :key="i">{{ para }}</p>
        </div>
        <ul v-if="keySpecs.length" class="eqp-bento">
          <li v-for="(s, i) in keySpecs" :key="s.label" class="dj-reveal" :class="{ 'is-wide': i === 0 && keySpecs.length !== 2 }">
            <span>{{ s.label }}</span>
            <b>{{ s.value }}</b>
          </li>
        </ul>
      </div>
    </section>

    <!-- Коротко о главном: галерея карточек со стрелками, как у Apple -->
    <section v-if="highlights.length > 1" class="eqp-sec eqp-hl" aria-label="Коротко о главном">
      <div class="dj-wrap">
        <h2 class="eqp-h2 dj-reveal">Коротко о главном.</h2>
      </div>
      <div ref="hlTrack" class="eqp-hl-track" @scroll.passive="hlScroll">
        <figure v-for="(h, i) in highlights" :key="h.key" class="eqp-hl-card" :class="[`is-${h.fit}`, { 'is-dark': h.dark }]">
          <img :src="h.src" :alt="h.alt" loading="lazy" decoding="async" />
          <figcaption>
            <template v-if="h.cap?.value"><b>{{ h.cap.label }}.</b> {{ h.cap.value }}</template>
            <b v-else>{{ h.cap?.label || h.alt }}</b>
          </figcaption>
          <span class="eqp-sr">{{ i + 1 }} из {{ highlights.length }}</span>
        </figure>
      </div>
      <div class="dj-wrap eqp-hl-nav">
        <button type="button" class="eqp-round" :disabled="hlAt <= 0" aria-label="Назад" @click="hlGo(-1)">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14.5 6l-6 6 6 6" /></svg>
        </button>
        <button type="button" class="eqp-round" :disabled="hlAt >= 1" aria-label="Вперёд" @click="hlGo(1)">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9.5 6l6 6-6 6" /></svg>
        </button>
      </div>
    </section>

    <!-- Рассмотрите ближе: рендеры модели и фото, переключатели-капсулы -->
    <section v-if="closer.length > 1" class="eqp-sec eqp-closer" aria-label="Рассмотрите ближе">
      <div class="dj-wrap">
        <h2 class="eqp-h2 dj-reveal">Рассмотрите ближе.</h2>
        <div class="eqp-closer-stage dj-reveal" :class="{ 'is-dark': closer[closerOn]?.dark }">
          <img
            v-for="(c, i) in closer"
            :key="c.key"
            :src="c.src"
            :alt="c.alt"
            class="eqp-closer-img"
            :class="[`is-${c.fit}`, { 'is-on': i === closerOn }]"
            loading="lazy"
            decoding="async"
          />
          <div class="eqp-closer-pills" role="tablist" aria-label="Вид">
            <button
              v-for="(c, i) in closer"
              :key="c.key"
              type="button"
              role="tab"
              :aria-selected="i === closerOn"
              :class="{ 'is-on': i === closerOn }"
              @click="closerOn = i"
            >{{ c.label }}</button>
          </div>
        </div>
      </div>
    </section>

    <!-- Панель запроса в подаче Apple «Купить» -->
    <section id="buy" class="eqp-sec eqp-buy">
      <div class="dj-wrap eqp-top">
        <div class="eqp-gal">
          <div class="eqp-main" :class="`is-${current.type}`">
            <EquipShot v-if="current.type === 'render' || current.type === 'empty'" :item="product" eager />
            <img v-else :src="current.src" :alt="current.alt" decoding="async" />
            <span v-if="current.note" class="eqp-main-note">{{ current.note }}</span>
          </div>
          <div v-if="slides.length > 1" class="eqp-thumbs" role="tablist" aria-label="Изображения">
            <button
              v-for="(s, i) in slides"
              :key="s.key"
              type="button"
              role="tab"
              class="eqp-thumb"
              :class="[`is-${s.type}`, { 'is-on': i === active }]"
              :aria-selected="i === active"
              :aria-label="s.alt"
              @click="active = i"
            >
              <img :src="s.src" :alt="''" loading="lazy" decoding="async" />
            </button>
          </div>
        </div>

        <aside class="eqp-info">
          <NuxtLink to="/equipment" class="eqp-back">Всё оборудование</NuxtLink>
          <span v-if="product.badge" class="eqp-badge">{{ product.badge }}</span>
          <h2 class="eqp-title">{{ product.name }}</h2>
          <p v-if="cap" class="eqp-cap">
            <template v-if="cap.num">{{ cap.prefix }} {{ cap.num }} {{ cap.unit }}<span v-if="cap.rest" class="eqp-cap-rest">{{ cap.rest }}</span></template>
            <template v-else>{{ cap.text }}</template>
          </p>
          <p v-if="product.application || product.category" class="eqp-app">
            {{ product.application }}<template v-if="product.application && product.category"> · </template>{{ product.category }}
          </p>
          <p class="eqp-desc">{{ product.desc }}</p>

          <dl v-if="keySpecs.length" class="eqp-keys">
            <div v-for="s in keySpecs" :key="s.label">
              <dt>{{ s.label }}</dt>
              <dd>{{ s.value }}</dd>
            </div>
          </dl>

          <ul v-if="product.advantages?.length" class="eqp-adv">
            <li v-for="a in product.advantages" :key="a">{{ a }}</li>
          </ul>

          <div class="eqp-actions">
            <NuxtLink to="/contacts#contact-form" class="eqp-btn">Запросить КП</NuxtLink>
            <NuxtLink to="/contacts#contact-form" class="eqp-btn eqp-btn--line">Обсудить проект</NuxtLink>
          </div>
          <ul class="eqp-assure">
            <li>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 3l7 3v5.5c0 4.3-3 7.9-7 9.5-4-1.6-7-5.2-7-9.5V6z" /><path d="M9 12l2.2 2.2L15.5 10" /></svg>
              <span>Гарантия до 5 лет</span>
            </li>
            <li>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="8.5" /><path d="M12 7.5V12l3 2" /></svg>
              <span>Коммерческое предложение за 24 часа</span>
            </li>
          </ul>
          <div class="eqp-links">
            <a v-if="product.specs?.length" href="#specs" class="eqp-more" @click.prevent="jump('#specs')">Характеристики</a>
            <a href="#application" class="eqp-more" @click.prevent="jump('#application')">Применение</a>
          </div>
          <p v-if="product.sku" class="eqp-sku">Артикул: {{ product.sku }}</p>
        </aside>
      </div>
    </section>

    <!-- Фото с объектов: лента скруглённых кадров -->
    <section v-if="gallery.length" class="eqp-strip" aria-label="Фото с объектов">
      <div class="eqp-strip-track">
        <figure v-for="g in gallery" :key="g.src" class="eqp-shot">
          <img :src="g.src" :alt="g.alt" loading="lazy" decoding="async" />
        </figure>
      </div>
    </section>

    <section v-if="product.specs?.length" id="specs" class="eqp-sec eqp-specs-sec">
      <div class="dj-wrap eqp-specs-wrap">
        <h2 class="eqp-h2 dj-reveal">Технические характеристики</h2>
        <table class="eqp-specs dj-reveal">
          <tbody>
            <tr v-for="s in product.specs" :key="s.label">
              <th scope="row">{{ s.label }}</th>
              <td>{{ s.value }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>

    <!-- Применение: область, ролик и объекты с этим оборудованием -->
    <section id="application" class="eqp-sec eqp-appl">
      <div class="dj-wrap">
        <div class="eqp-app-head dj-reveal">
          <span class="eqp-eyebrow">Где работает</span>
          <h2 class="eqp-h2">{{ related.length ? 'Проекты с этим оборудованием' : 'Применение' }}</h2>
          <p v-if="product.application" class="eqp-lede">Применение: {{ product.application }}<template v-if="product.category"> · {{ product.category }}</template></p>
        </div>

        <figure v-if="film" class="eqp-film dj-reveal">
          <video :poster="film.poster" controls preload="none" playsinline>
            <source :src="film.video" type="video/mp4" />
          </video>
          <figcaption><b>Ролик с объекта.</b> {{ film.name }}</figcaption>
        </figure>

        <div v-if="related.length" class="eqp-where">
          <NuxtLink v-for="p in related" :key="p.slug" :to="`/projects/${p.slug}`" class="eqp-where-card dj-reveal">
            <div class="eqp-where-img"><img :src="cover(p)" :alt="p.name" loading="lazy" decoding="async" /></div>
            <div class="eqp-where-body">
              <b>{{ p.name }}</b>
              <span>{{ p.location }}<template v-if="p.capacity"> · {{ p.capacity }}</template></span>
              <i class="eqp-more">Подробнее</i>
            </div>
          </NuxtLink>
        </div>
        <div class="eqp-app-more">
          <NuxtLink to="/projects" class="eqp-more">Все проекты</NuxtLink>
        </div>
      </div>
    </section>

    <!-- Соседние позиции, как «Which AirPods are right for you?» -->
    <section v-if="siblings.length" class="eqp-sec eqp-rel">
      <div class="dj-wrap">
        <div class="eqp-rel-head dj-reveal">
          <h2 class="eqp-h2">Другое оборудование</h2>
          <NuxtLink to="/equipment" class="eqp-more">Всё оборудование</NuxtLink>
        </div>
        <ul class="eqp-rel-grid">
          <li v-for="p in siblings" :key="p.slug" class="dj-reveal">
            <NuxtLink :to="`/equipment/${p.slug}`" class="eqp-rel-card">
              <div class="eqp-rel-media"><EquipShot :item="p" :caption="false" /></div>
              <span class="eqp-rel-cat">{{ p.category }}</span>
              <b>{{ p.name }}</b>
              <small v-if="p.capacity">{{ p.capacity }}</small>
              <i class="eqp-more">Подробнее</i>
            </NuxtLink>
          </li>
        </ul>
      </div>
    </section>

    <section class="eqp-sec eqp-cta">
      <div class="dj-wrap">
        <h2 class="eqp-h1">Готовы<br /><span>к сотрудничеству?</span></h2>
        <div class="eqp-cta-act">
          <NuxtLink to="/contacts#contact-form" class="eqp-btn">Обсудить проект</NuxtLink>
          <NuxtLink to="/equipment" class="eqp-more">Всё оборудование</NuxtLink>
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
import { ref, computed, watch } from 'vue'
import { useProjects } from '~/composables/useProjects'
import { useReveal } from '~/composables/useReveal'
import { splitCapacity } from '~/utils/equipCapacity'
import { renderOf } from '~/utils/equipVisual'

const { equipment, getBySlug } = useEquipment()
const { projects } = useProjects()
const route = useRoute()
const root = ref(null)
useReveal(root)

const product = computed(() => getBySlug(route.params.slug))
const photo = computed(() => product.value?.photo || product.value?.image)
const render = computed(() => renderOf(product.value))
const cap = computed(() => splitCapacity(product.value?.capacity))
const descParagraphs = computed(() => (product.value?.longDesc || product.value?.desc || '').split('\n\n'))
// Первые четыре характеристики — ключевые параметры
const keySpecs = computed(() => (product.value?.specs || []).slice(0, 4))

// Связанные объекты: в каталоге ссылки бывают длиннее слага проекта
// («krichev-vodokanal» → «krichev»), поэтому сверяем и по началу
const related = computed(() => {
  const refs = product.value?.relatedProjects || []
  return projects.value.filter((p) => refs.some((r) => r === p.slug || r.startsWith(p.slug + '-')))
})
const cover = (p) => (Array.isArray(p.gallery) && p.gallery[0]) || p.poster || p.image
const gallery = computed(() => related.value.flatMap((p) => (Array.isArray(p.gallery) ? p.gallery : []).slice(0, 4).map((src) => ({ src, alt: p.name }))))
const film = computed(() => related.value.find((p) => p.video))

// Галерея: рендер (или пустая плашка), фото изделия, кадры с объектов
const realPhoto = computed(() => {
  const s = photo.value
  if (!s || s === render.value || /placeholder\.svg$/.test(s) || !/^\/images\/equipment\//.test(s)) return null
  return s
})
const slides = computed(() => {
  const p = product.value
  if (!p) return []
  const out = []
  if (render.value) out.push({ key: 'r', type: 'render', src: render.value, alt: p.name })
  if (realPhoto.value) out.push({ key: 'p', type: 'photo', src: realPhoto.value, alt: p.name })
  const lm = model(p.slug, 'light')
  if (lm) out.push({ key: 'm', type: 'model', src: lm, alt: `${p.name}, 3D-модель` })
  if (!out.length) out.push({ key: 'e', type: 'empty', src: '', alt: p.name })
  gallery.value.slice(0, 6).forEach((g, i) => out.push({ key: 'g' + i, type: 'site', src: g.src, alt: g.alt, note: `Объект: ${g.alt}` }))
  return out
})
// Первый экран как у продукта DJI: светлая студия с настоящим рендером,
// затем кадры оборудования в работе и фото с объектов
const CUTS = { 'flotation-units': 'flotation', 'microfilters-sand-traps': 'microfilter', 'polymer-dosing-station': 'polymer-station', 'filter-press': 'belt-filter-press', 'rotary-drum-sieve': 'rotary-drum-sieve', 'sand-separator': 'sand-separator', 'screw-conveyor': 'screw-conveyor' }
const SCENES = {

}
const heroSlides = computed(() => {
  const p = product.value
  if (!p) return []
  const out = []
  if (CUTS[p.slug]) out.push({ key: 'studio', type: 'studio', src: `/images/equipment/cut/${CUTS[p.slug]}.webp`, alt: p.name })
  ;(SCENES[p.slug] || []).forEach((sc, i) => out.push({ key: 'scene' + i, type: 'photo', src: sc.src, alt: `${p.name} на объекте`, dark: sc.dark }))
  if (realPhoto.value) out.push({ key: 'real', type: 'photo', src: realPhoto.value, alt: p.name, dark: true })
  gallery.value.slice(0, 2).forEach((g, i) => out.push({ key: 'g' + i, type: 'photo', src: g.src, alt: g.alt, dark: true }))
  return out.length ? out : [{ key: 'none', type: 'photo', src: '/images/real4k/aerial-orbit.webp', alt: p.name, dark: true }]
})
const heroTagline = computed(() => {
  const d = product.value?.desc || ''
  const first = d.split(/(?<=[.!?])\s/)[0]
  return first.length > 120 ? '' : first
})

const active = ref(0)
watch(() => route.params.slug, () => { active.value = 0 })
const current = computed(() => slides.value[active.value] || slides.value[0] || { type: 'empty' })

// Рендеры 3D-моделей (docs/models/renders → public/images/equipment/renders)
const MODELS = new Set(['flotation-units', 'microfilters-sand-traps', 'polymer-dosing-station', 'filter-press'])
const model = (slug, v) => (MODELS.has(slug) ? `/images/equipment/renders/${slug}-${v}.webp` : null)
const cutOf = (p) => (CUTS[p?.slug] ? `/images/equipment/cut/${CUTS[p.slug]}.webp` : null)

// «Коротко о главном»: каждая карточка — реальный кадр позиции, подпись —
// ключевой параметр или преимущество из карточки товара (новых фактов нет)
const highlights = computed(() => {
  const p = product.value
  if (!p) return []
  const pool = []
  const cut = cutOf(p)
  if (cut) pool.push({ key: 'cut', src: cut, fit: 'contain', alt: p.name })
  const light = model(p.slug, 'light')
  if (light) pool.push({ key: 'model', src: light, fit: 'cover', alt: `${p.name}, 3D-модель` })
  if (realPhoto.value && realPhoto.value !== cut) pool.push({ key: 'photo', src: realPhoto.value, fit: /\/real\//.test(realPhoto.value) ? 'cover' : 'contain', dark: /\/real\//.test(realPhoto.value), alt: p.name })
  const field = model(p.slug, 'field')
  if (field) pool.push({ key: 'field', src: field, fit: 'field', dark: true, alt: `${p.name}, 3D-модель` })
  gallery.value.slice(0, 3).forEach((g, i) => pool.push({ key: 'g' + i, src: g.src, fit: 'cover', dark: true, alt: g.alt }))
  const caps = [...keySpecs.value, ...(p.advantages || []).map((a) => ({ label: a }))]
  return pool.slice(0, 6).map((h, i) => ({ ...h, cap: caps[i] || null }))
})
const hlTrack = ref(null)
const hlAt = ref(0)
const hlScroll = () => {
  const el = hlTrack.value
  if (!el) return
  const max = el.scrollWidth - el.clientWidth
  hlAt.value = max > 0 ? el.scrollLeft / max : 1
}
const hlGo = (dir) => {
  const el = hlTrack.value
  if (!el) return
  const card = el.querySelector('.eqp-hl-card')
  el.scrollBy({ left: dir * ((card?.offsetWidth || 600) + 20), behavior: 'smooth' })
}

// «Рассмотрите ближе»: фото изделия и рендеры модели на светлом и тёмном фоне
const closer = computed(() => {
  const p = product.value
  if (!p) return []
  const out = []
  const cut = cutOf(p)
  if (cut) out.push({ key: 'cut', label: 'Фото', src: cut, fit: 'contain', alt: p.name })
  const light = model(p.slug, 'light')
  if (light) out.push({ key: 'light', label: 'Модель', src: light, fit: 'cover', alt: `${p.name}, 3D-модель` })
  const field = model(p.slug, 'field')
  if (field) out.push({ key: 'field', label: 'На тёмном', src: field, fit: 'field', dark: true, alt: `${p.name}, 3D-модель на тёмном фоне` })
  return out
})
const closerOn = ref(0)
watch(() => route.params.slug, () => { closerOn.value = 0; hlAt.value = 0 })

const siblings = computed(() => {
  const p = product.value
  if (!p) return []
  const others = equipment.value.filter((e) => e.slug !== p.slug)
  const same = others.filter((e) => e.category === p.category)
  const rest = others.filter((e) => e.category !== p.category).sort((a, b) => (renderOf(b) ? 1 : 0) - (renderOf(a) ? 1 : 0))
  return [...same, ...rest].slice(0, 4)
})

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
/* Страница продукта Apple: шкала 80/56/32/21/17, серый #6e6e73,
   ссылки #0066cc «›», капсулы, скругления 18–28px, плитки #f5f5f7 */
.eqp-page { background: #fff; color: #1d1d1f; font-family: var(--dj-font); letter-spacing: -0.022em; }
.eqp-sr { position: absolute; width: 1px; height: 1px; overflow: hidden; clip: rect(0 0 0 0); white-space: nowrap; }
.eqp-sec { padding: clamp(64px, 9vw, 120px) 0; }
.eqp-eyebrow { display: block; margin-bottom: 8px; font-size: clamp(17px, 1.6vw, 21px); line-height: 1.19; font-weight: 600; letter-spacing: 0.011em; color: #6e6e73; }
.eqp-h1 { font-size: clamp(40px, 5.6vw, 80px); line-height: 1.05; font-weight: 600; letter-spacing: -0.015em; color: #1d1d1f; }
.eqp-h2 { font-size: clamp(32px, 3.9vw, 56px); line-height: 1.07; font-weight: 600; letter-spacing: -0.005em; color: #1d1d1f; text-wrap: balance; hyphens: manual; overflow-wrap: break-word; }
.eqp-lede { margin-top: 16px; max-width: 760px; font-size: clamp(19px, 1.5vw, 21px); line-height: 1.381; letter-spacing: 0.011em; color: #6e6e73; }
.eqp-more { display: inline-flex; align-items: center; gap: 3px; font-size: 17px; line-height: 1.18; letter-spacing: -0.022em; font-style: normal; color: #0066cc; white-space: nowrap; }
.eqp-more::after { content: '›'; font-size: 1.25em; line-height: 1; transform: translateY(-1px); transition: transform 0.3s var(--dj-ease); }
.eqp-more:hover { text-decoration: underline; }
.eqp-more:hover::after { transform: translate(3px, -1px); }
.eqp-btn { display: inline-flex; align-items: center; justify-content: center; min-height: 44px; padding: 0 22px; border-radius: 980px; font-size: 17px; line-height: 1.18; letter-spacing: -0.022em; color: #fff; background: var(--dj-blue); white-space: nowrap; transition: background-color 0.25s ease, color 0.25s ease, box-shadow 0.25s ease; }
.eqp-btn:hover { background: #0b3a8c; }
.eqp-btn--line { color: var(--dj-blue); background: transparent; box-shadow: inset 0 0 0 1px var(--dj-blue); }
.eqp-btn--line:hover { color: #fff; background: var(--dj-blue); }
.eqp-btn:focus-visible, .eqp-more:focus-visible, .eqp-round:focus-visible, .eqp-thumb:focus-visible, .eqp-closer-pills button:focus-visible { outline: 2px solid #0071e3; outline-offset: 3px; }

/* Подполоса */
.eqp-subnav { position: sticky; top: var(--dj-header-h); z-index: 40; }
.eqp-subnav :deep(.dsn) { position: static; }
.eqp-subnav :deep(.dsn-title) { min-width: 0; overflow: hidden; text-overflow: ellipsis; }
.eqp-subnav :deep(.dsn-links) { flex-shrink: 0; }

/* Обзор */
.eqp-ov-head { max-width: 900px; }
.eqp-long { max-width: 820px; margin-top: 24px; }
.eqp-long p { font-size: clamp(19px, 1.5vw, 21px); line-height: 1.381; letter-spacing: 0.011em; font-weight: 600; color: #6e6e73; }
.eqp-long p + p { margin-top: 1em; }
.eqp-long p::first-line { color: #1d1d1f; }
.eqp-bento { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 20px; margin: clamp(48px, 6vw, 80px) 0 0; padding: 0; list-style: none; }
.eqp-bento li { display: flex; flex-direction: column; justify-content: space-between; gap: 28px; min-height: 220px; padding: clamp(28px, 3vw, 40px); border-radius: 28px; background: #f5f5f7; }
.eqp-bento li.is-wide { grid-column: span 2; background: #1d1d1f; }
.eqp-bento span { font-size: 17px; line-height: 1.24; font-weight: 600; letter-spacing: -0.022em; color: #6e6e73; }
.eqp-bento b { font-size: clamp(28px, 2.6vw, 40px); line-height: 1.1; font-weight: 600; letter-spacing: 0; color: #1d1d1f; overflow-wrap: break-word; }
.eqp-bento li.is-wide span { color: #a1a1a6; }
.eqp-bento li.is-wide b { font-size: clamp(40px, 4.4vw, 64px); line-height: 1.05; letter-spacing: -0.009em; background: linear-gradient(90deg, #5ac8fa 0%, #2997ff 55%, #7ab8ff 100%); -webkit-background-clip: text; background-clip: text; color: transparent; }
.eqp-bento:has(li:nth-child(4)) li:nth-child(4) { grid-column: span 2; }

/* Коротко о главном */
.eqp-hl { padding-bottom: clamp(48px, 6vw, 80px); background: #f5f5f7; }
.eqp-hl-track { display: flex; gap: 20px; margin-top: clamp(32px, 4vw, 52px); overflow-x: auto; scroll-snap-type: x mandatory; scroll-behavior: smooth; scrollbar-width: none; padding: 0 max(24px, calc((100vw - 1152px) / 2)); scroll-padding: 0 max(24px, calc((100vw - 1152px) / 2)); }
.eqp-hl-track::-webkit-scrollbar { display: none; }
.eqp-hl-card { position: relative; flex: 0 0 min(80vw, 980px); aspect-ratio: 980 / 600; margin: 0; overflow: hidden; border-radius: 28px; background: #fff; scroll-snap-align: start; }
.eqp-hl-card img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; }
.eqp-hl-card.is-contain img { inset: 22% 8% 6%; width: 84%; height: 72%; object-fit: contain; mix-blend-mode: multiply; }
.eqp-hl-card.is-field { background: #000; }
/* Рендер «на тёмном»: модель стоит правее центра кадра — центрируем её */
.eqp-hl-card.is-field img { left: -54%; width: 143%; max-width: none; object-fit: fill; }
.eqp-hl-card.is-dark:not(.is-field)::after { content: ''; position: absolute; inset: 0; background: linear-gradient(180deg, rgba(0, 0, 0, 0.55) 0%, rgba(0, 0, 0, 0) 42%); pointer-events: none; }
.eqp-hl-card figcaption { position: absolute; z-index: 1; top: clamp(24px, 3.4vw, 48px); left: clamp(24px, 3.4vw, 48px); right: clamp(24px, 3.4vw, 48px); max-width: 30ch; font-size: clamp(19px, 2vw, 28px); line-height: 1.143; font-weight: 600; letter-spacing: 0.007em; color: #6e6e73; text-wrap: pretty; }
.eqp-hl-card figcaption b { font-weight: 600; color: #1d1d1f; }
.eqp-hl-card.is-dark figcaption { color: rgba(255, 255, 255, 0.72); }
.eqp-hl-card.is-dark figcaption b { color: #fff; }
.eqp-hl-nav { display: flex; justify-content: flex-end; gap: 16px; margin-top: 24px; }
.eqp-round { display: grid; place-items: center; width: 44px; height: 44px; border-radius: 50%; color: rgba(0, 0, 0, 0.56); background: rgba(210, 210, 215, 0.64); transition: background-color 0.25s ease, opacity 0.25s ease; }
.eqp-round:hover:not(:disabled) { background: rgba(223, 223, 227, 0.9); color: rgba(0, 0, 0, 0.64); }
.eqp-round:disabled { opacity: 0.42; cursor: default; }
.eqp-round svg { width: 20px; height: 20px; }

/* Рассмотрите ближе */
.eqp-closer-stage { position: relative; margin-top: clamp(32px, 4vw, 52px); aspect-ratio: 16 / 9; max-height: 760px; width: 100%; overflow: hidden; border-radius: 28px; background: #f5f5f7; transition: background-color 0.6s ease; }
.eqp-closer-stage.is-dark { background: #000; }
.eqp-closer-img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; opacity: 0; transform: scale(1.03); transition: opacity 0.7s ease, transform 1.2s var(--dj-ease); }
.eqp-closer-img.is-on { opacity: 1; transform: none; }
.eqp-closer-img.is-contain { inset: 10% 10% 18%; width: 80%; height: 72%; object-fit: contain; mix-blend-mode: multiply; }
.eqp-closer-img.is-field { left: -46%; width: 131%; max-width: none; object-fit: fill; }
.eqp-closer-pills { position: absolute; left: 50%; bottom: clamp(16px, 2.4vw, 32px); transform: translateX(-50%); display: flex; gap: 4px; max-width: calc(100% - 32px); padding: 4px; overflow-x: auto; scrollbar-width: none; border-radius: 980px; background: rgba(232, 232, 237, 0.72); backdrop-filter: blur(14px) saturate(180%); -webkit-backdrop-filter: blur(14px) saturate(180%); }
.eqp-closer-pills::-webkit-scrollbar { display: none; }
.eqp-closer-pills button { flex: 0 0 auto; height: 36px; padding: 0 18px; border-radius: 980px; font-size: 14px; letter-spacing: -0.016em; color: #1d1d1f; transition: background-color 0.25s ease, color 0.25s ease; }
.eqp-closer-pills button.is-on { background: #1d1d1f; color: #fff; }
.eqp-closer-stage.is-dark .eqp-closer-pills { background: rgba(66, 66, 69, 0.72); }
.eqp-closer-stage.is-dark .eqp-closer-pills button { color: #f5f5f7; }
.eqp-closer-stage.is-dark .eqp-closer-pills button.is-on { background: #f5f5f7; color: #1d1d1f; }

/* Панель запроса — Apple «Купить» */
.eqp-buy { background: #fff; }
.eqp-top { display: grid; grid-template-columns: minmax(0, 7fr) minmax(0, 5fr); gap: clamp(28px, 5vw, 80px); align-items: start; }
.eqp-gal { position: sticky; top: calc(var(--dj-header-h) + 72px); min-width: 0; }
.eqp-main { position: relative; aspect-ratio: 1 / 1; max-height: calc(100svh - 200px); width: 100%; overflow: hidden; display: grid; place-items: center; border-radius: 18px; background: #f5f5f7; }
.eqp-main > img { width: 100%; height: 100%; object-fit: contain; }
.eqp-main.is-site > img, .eqp-main.is-model > img { object-fit: cover; }
.eqp-main.is-photo > img { padding: 6%; mix-blend-mode: multiply; }
.eqp-main :deep(.esh-img) { width: 84%; height: 84%; }
.eqp-main-note { position: absolute; left: 16px; bottom: 16px; max-width: calc(100% - 32px); padding: 6px 12px; border-radius: 980px; font-size: 12px; line-height: 1.33; letter-spacing: -0.01em; color: #fff; background: rgba(0, 0, 0, 0.45); backdrop-filter: blur(10px); -webkit-backdrop-filter: blur(10px); }
.eqp-thumbs { display: flex; gap: 10px; margin-top: 14px; padding: 2px; overflow-x: auto; scrollbar-width: none; }
.eqp-thumbs::-webkit-scrollbar { display: none; }
.eqp-thumb { flex: 0 0 auto; width: 72px; height: 72px; overflow: hidden; border-radius: 12px; background: #f5f5f7; box-shadow: inset 0 0 0 1px transparent; opacity: 0.72; transition: opacity 0.2s ease, box-shadow 0.2s ease; }
.eqp-thumb:hover { opacity: 1; }
.eqp-thumb.is-on { opacity: 1; box-shadow: 0 0 0 2px #0071e3; }
.eqp-thumb img { width: 100%; height: 100%; object-fit: contain; mix-blend-mode: multiply; }
.eqp-thumb.is-site img, .eqp-thumb.is-model img { object-fit: cover; mix-blend-mode: normal; }

.eqp-info { min-width: 0; padding-top: 4px; }
.eqp-back { display: inline-flex; align-items: center; gap: 4px; font-size: 14px; letter-spacing: -0.016em; color: #0066cc; }
.eqp-back::before { content: '‹'; font-size: 1.3em; line-height: 1; transform: translateY(-1px); }
.eqp-back:hover { text-decoration: underline; }
.eqp-badge { display: block; margin-top: 16px; font-size: 14px; line-height: 1.29; font-weight: 400; letter-spacing: -0.016em; color: #b64400; }
.eqp-title { margin-top: 10px; font-size: clamp(32px, 3vw, 48px); line-height: 1.08; font-weight: 600; letter-spacing: -0.003em; color: #1d1d1f; text-wrap: balance; hyphens: manual; overflow-wrap: break-word; }
.eqp-cap { margin-top: 12px; font-size: 21px; line-height: 1.19; font-weight: 600; letter-spacing: 0.011em; color: #1d1d1f; }
.eqp-cap-rest { display: block; margin-top: 4px; font-size: 14px; font-weight: 400; letter-spacing: -0.016em; color: #6e6e73; }
.eqp-app { margin-top: 8px; font-size: 14px; line-height: 1.43; letter-spacing: -0.016em; color: #6e6e73; }
.eqp-desc { margin-top: 20px; font-size: 17px; line-height: 1.47; letter-spacing: -0.022em; color: #1d1d1f; }
.eqp-keys { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin: 28px 0 0; }
.eqp-keys > div { min-width: 0; padding: 16px 18px; border-radius: 12px; box-shadow: inset 0 0 0 1px #d2d2d7; }
.eqp-keys dt { font-size: 12px; line-height: 1.33; letter-spacing: -0.01em; color: #6e6e73; }
.eqp-keys dd { margin: 4px 0 0; font-size: 17px; line-height: 1.24; font-weight: 600; letter-spacing: -0.022em; color: #1d1d1f; overflow-wrap: break-word; }
.eqp-adv { display: grid; gap: 10px; margin: 24px 0 0; padding: 0; list-style: none; }
.eqp-adv li { position: relative; padding-left: 28px; font-size: 17px; line-height: 1.47; letter-spacing: -0.022em; color: #1d1d1f; }
.eqp-adv li::before { content: ''; position: absolute; left: 2px; top: 6px; width: 16px; height: 16px; border-radius: 50%; background: #0071e3 url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'%3E%3Cpath d='M4.5 8.2l2.2 2.2 4.8-4.8' fill='none' stroke='%23fff' stroke-width='1.8' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E") center / 16px no-repeat; }
.eqp-actions { display: grid; gap: 12px; margin-top: 32px; }
.eqp-actions .eqp-btn { width: 100%; min-height: 48px; }
.eqp-assure { display: grid; gap: 0; margin: 24px 0 0; padding: 0; list-style: none; border-radius: 18px; background: #f5f5f7; }
.eqp-assure li { display: flex; align-items: center; gap: 14px; padding: 18px 20px; font-size: 14px; line-height: 1.43; letter-spacing: -0.016em; color: #1d1d1f; }
.eqp-assure li + li { border-top: 1px solid #d2d2d7; }
.eqp-assure svg { flex: 0 0 auto; width: 24px; height: 24px; color: #1d1d1f; }
.eqp-links { display: flex; flex-wrap: wrap; gap: 8px 24px; margin-top: 22px; }
.eqp-sku { margin-top: 16px; font-size: 12px; letter-spacing: -0.01em; color: #6e6e73; }

/* Лента фото с объектов */
.eqp-strip { padding: 0 0 clamp(64px, 8vw, 104px); }
.eqp-strip-track { display: grid; grid-auto-flow: column; grid-auto-columns: clamp(260px, 40vw, 620px); gap: 20px; overflow-x: auto; scroll-snap-type: x mandatory; scrollbar-width: none; padding: 0 max(24px, calc((100vw - 1152px) / 2)); scroll-padding: 0 max(24px, calc((100vw - 1152px) / 2)); }
.eqp-strip-track::-webkit-scrollbar { display: none; }
.eqp-shot { margin: 0; aspect-ratio: 4 / 3; overflow: hidden; border-radius: 18px; background: #f5f5f7; scroll-snap-align: start; }
.eqp-shot img { width: 100%; height: 100%; object-fit: cover; }

/* Характеристики — таблица Apple Tech Specs */
.eqp-specs-sec { background: #fff; border-top: 1px solid #d2d2d7; }
.eqp-specs-wrap { display: grid; grid-template-columns: minmax(0, 4fr) minmax(0, 8fr); gap: 24px 48px; align-items: start; }
.eqp-specs { width: 100%; border-collapse: collapse; }
.eqp-specs tr { border-top: 1px solid #d2d2d7; }
.eqp-specs tr:first-child { border-top: 0; }
.eqp-specs th, .eqp-specs td { padding: 18px 0; vertical-align: top; text-align: left; font-size: 17px; line-height: 1.47; letter-spacing: -0.022em; }
.eqp-specs th { width: 40%; padding-right: 24px; font-weight: 600; color: #1d1d1f; }
.eqp-specs td { color: #1d1d1f; }

/* Применение */
.eqp-appl { background: #f5f5f7; }
.eqp-app-head { max-width: 900px; }
.eqp-film { margin: clamp(32px, 4vw, 52px) 0 0; }
.eqp-film video { display: block; width: 100%; aspect-ratio: 16 / 9; border-radius: 28px; background: #000; }
.eqp-film figcaption { margin-top: 14px; font-size: 17px; line-height: 1.47; letter-spacing: -0.022em; color: #6e6e73; }
.eqp-film figcaption b { font-weight: 600; color: #1d1d1f; }
.eqp-where { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 20px; margin-top: 40px; }
.eqp-where-card { display: flex; flex-direction: column; min-width: 0; overflow: hidden; border-radius: 18px; background: #fff; box-shadow: 2px 4px 12px rgba(0, 0, 0, 0.08); transition: box-shadow 0.3s cubic-bezier(0, 0, 0.5, 1), transform 0.3s cubic-bezier(0, 0, 0.5, 1); }
.eqp-where-card:hover { box-shadow: 2px 4px 16px rgba(0, 0, 0, 0.16); transform: scale3d(1.01, 1.01, 1.01); }
.eqp-where-img { aspect-ratio: 16 / 10; overflow: hidden; background: #e8e8ed; }
.eqp-where-img img { width: 100%; height: 100%; object-fit: cover; }
.eqp-where-body { display: flex; flex-direction: column; gap: 6px; padding: 20px 24px 24px; }
.eqp-where-body b { font-size: 21px; line-height: 1.19; font-weight: 600; letter-spacing: 0.011em; color: #1d1d1f; }
.eqp-where-body span { font-size: 14px; line-height: 1.43; letter-spacing: -0.016em; color: #6e6e73; }
.eqp-where-body .eqp-more { margin-top: 8px; font-size: 14px; }
.eqp-app-more { margin-top: 32px; }

/* Сравнение */
.eqp-rel-head { display: flex; flex-wrap: wrap; align-items: flex-end; justify-content: space-between; gap: 16px 40px; }
.eqp-rel-links { display: flex; flex-wrap: wrap; gap: 8px 28px; }
.eqp-rel-grid { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 20px; margin: clamp(32px, 4vw, 52px) 0 0; padding: 0; list-style: none; }
.eqp-rel-card { display: flex; flex-direction: column; align-items: center; gap: 6px; height: 100%; text-align: center; }
.eqp-rel-media { width: 100%; aspect-ratio: 1 / 1; margin-bottom: 18px; overflow: hidden; border-radius: 18px; }
.eqp-rel-card:hover :deep(.esh-img) { transform: scale(1.03); }
.eqp-rel-cat { font-size: 12px; line-height: 1.33; font-weight: 600; letter-spacing: -0.01em; color: #b64400; }
.eqp-rel-card b { font-size: 21px; line-height: 1.19; font-weight: 600; letter-spacing: 0.011em; color: #1d1d1f; overflow-wrap: break-word; hyphens: manual; }
.eqp-rel-card small { font-size: 14px; line-height: 1.43; letter-spacing: -0.016em; color: #6e6e73; }
.eqp-rel-card .eqp-more { margin-top: auto; padding-top: 10px; font-size: 14px; }

/* Финал */
.eqp-cta { text-align: center; background: #fff; }
.eqp-cta .eqp-h1 span { color: #6e6e73; }
.eqp-cta-act { display: flex; flex-wrap: wrap; align-items: center; justify-content: center; gap: 14px 28px; margin-top: 32px; }
.eqp-cta-note { margin-top: 20px; font-size: 14px; letter-spacing: -0.016em; color: #6e6e73; }

.eqp-missing { min-height: 60vh; display: grid; place-content: center; justify-items: center; gap: 24px; padding: 48px 24px; text-align: center; }

@media (max-width: 1068px) {
  .eqp-rel-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); row-gap: 48px; }
  .eqp-where { grid-template-columns: 1fr 1fr; }
  .eqp-bento { grid-template-columns: 1fr 1fr; }
  .eqp-bento li.is-wide, .eqp-bento:has(li:nth-child(4)) li:nth-child(4) { grid-column: span 2; }
}
@media (max-width: 900px) {
  .eqp-top { grid-template-columns: 1fr; }
  .eqp-gal { position: static; }
  .eqp-main { max-height: none; }
  .eqp-specs-wrap { grid-template-columns: 1fr; }
}
@media (max-width: 734px) {
  .eqp-bento { grid-template-columns: 1fr; gap: 12px; }
  .eqp-bento li, .eqp-bento li.is-wide, .eqp-bento:has(li:nth-child(4)) li:nth-child(4) { grid-column: auto; min-height: 0; gap: 16px; }
  .eqp-hl-track, .eqp-strip-track { gap: 12px; padding: 0 16px; scroll-padding: 0 16px; }
  .eqp-hl-card { flex-basis: 86vw; aspect-ratio: 3 / 4; border-radius: 18px; }
  .eqp-hl-card.is-contain img { inset: 34% 6% 6%; width: 88%; height: 60%; }
  .eqp-hl-card.is-field img, .eqp-closer-img.is-field { inset: 50% auto auto -111%; width: 220%; height: auto; transform: translateY(-50%); }
  .eqp-strip-track { grid-auto-columns: 82vw; }
  .eqp-closer-stage { aspect-ratio: 4 / 5; border-radius: 18px; }
  .eqp-closer-img.is-contain { inset: 14% 6% 22%; width: 88%; height: 64%; }
  .eqp-keys { grid-template-columns: 1fr; }
  .eqp-where { grid-template-columns: 1fr; }
  .eqp-specs th, .eqp-specs td { display: block; width: auto; padding: 0; }
  .eqp-specs th { padding-top: 16px; }
  .eqp-specs td { padding: 4px 0 16px; color: #6e6e73; }
  .eqp-cta .eqp-h1 { overflow-wrap: break-word; }
}
@media (prefers-reduced-motion: reduce) {
  .eqp-hl-track { scroll-behavior: auto; }
  .eqp-closer-img, .eqp-where-card, .eqp-where-card:hover { transition: none; transform: none; }
}
</style>
