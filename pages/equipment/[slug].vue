<template>
  <!-- Страница оборудования в подаче DJI Store: слева большая галерея
       с миниатюрами, справа липкая колонка с названием, ключевыми
       параметрами и кнопками; ниже — подполоса с якорями, обзор,
       таблица характеристик, применение и соседние позиции.
       Блоки без данных у конкретной позиции не показываются. -->
  <div v-if="product" ref="root" class="eqp-page">
    <div class="dj-wrap eqp-crumbs">
      <NuxtLink to="/equipment" class="eqp-back">← Всё оборудование</NuxtLink>
      <span v-if="product.category" class="eqp-crumb-cat">{{ product.category }}</span>
    </div>

    <section class="dj-wrap eqp-top">
      <!-- Галерея -->
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

      <!-- Информация -->
      <aside class="eqp-info">
        <span v-if="product.badge" class="dj-eyebrow">{{ product.badge }}</span>
        <h1 class="eqp-title">{{ product.name }}</h1>
        <p v-if="cap" class="eqp-cap">
          <template v-if="cap.num">{{ cap.prefix }} {{ cap.num }} {{ cap.unit }}<span v-if="cap.rest" class="eqp-cap-rest">{{ cap.rest }}</span></template>
          <template v-else>{{ cap.text }}</template>
        </p>
        <p v-if="product.application" class="eqp-app">{{ product.application }}</p>
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
          <NuxtLink to="/contacts#contact-form" class="dj-btn dj-btn--lg">Запросить КП</NuxtLink>
          <NuxtLink to="/contacts#contact-form" class="dj-btn dj-btn--lg dj-btn--line">Обсудить проект</NuxtLink>
        </div>
        <div class="eqp-links">
          <a v-if="product.specs?.length" href="#specs" class="dj-more" @click.prevent="jump('#specs')">Характеристики</a>
          <a href="#application" class="dj-more" @click.prevent="jump('#application')">Применение</a>
        </div>
        <p class="eqp-note">Гарантия до 5 лет · Коммерческое предложение за 24 часа</p>
        <p v-if="product.sku" class="eqp-sku">Артикул: {{ product.sku }}</p>
      </aside>
    </section>

    <div class="eqp-subnav">
      <DjSubnav :title="product.name" :links="subLinks" :cta="{ label: 'Запросить КП', to: '/contacts#contact-form' }" />
    </div>

    <!-- Обзор -->
    <section id="overview" class="dj-sec eqp-overview">
      <div class="dj-wrap">
        <div class="eqp-ov-head dj-reveal">
          <span class="dj-eyebrow">О решении</span>
          <h2 class="dj-h2">{{ product.name }}</h2>
        </div>
        <div class="eqp-long dj-reveal">
          <p v-for="(para, i) in descParagraphs" :key="i">{{ para }}</p>
        </div>
        <ul v-if="keySpecs.length" class="eqp-why">
          <li v-for="s in keySpecs" :key="s.label" class="dj-reveal">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.6" aria-hidden="true"><circle cx="12" cy="12" r="8.5" /><path d="M8.5 12.5l2.3 2.3 4.7-5" /></svg>
            <b>{{ s.label }}</b>
            <span>{{ s.value }}</span>
          </li>
        </ul>
      </div>
    </section>

    <!-- Фото с объектов во всю ширину -->
    <section v-if="gallery.length" class="eqp-strip" aria-label="Фото с объектов">
      <div class="eqp-strip-track">
        <figure v-for="g in gallery" :key="g.src" class="eqp-shot">
          <img :src="g.src" :alt="g.alt" loading="lazy" decoding="async" />
        </figure>
      </div>
    </section>

    <section v-if="product.specs?.length" id="specs" class="dj-sec dj-sec--soft">
      <div class="dj-wrap eqp-specs-wrap">
        <h2 class="dj-h2 dj-reveal">Технические характеристики</h2>
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
    <section id="application" class="dj-sec">
      <div class="dj-wrap">
        <div class="eqp-app-head dj-reveal">
          <span class="dj-eyebrow">Где работает</span>
          <h2 class="dj-h2">{{ related.length ? 'Проекты с этим оборудованием' : 'Применение' }}</h2>
          <p v-if="product.application" class="dj-lede">Применение: {{ product.application }}<template v-if="product.category"> · {{ product.category }}</template></p>
        </div>

        <figure v-if="film" class="eqp-film dj-reveal">
          <span class="dj-eyebrow">Ролик с объекта</span>
          <video :poster="film.poster" controls preload="none" playsinline>
            <source :src="film.video" type="video/mp4" />
          </video>
          <figcaption>{{ film.name }}</figcaption>
        </figure>

        <div v-if="related.length" class="eqp-where">
          <NuxtLink v-for="p in related" :key="p.slug" :to="`/projects/${p.slug}`" class="eqp-where-card dj-reveal">
            <div class="eqp-where-img"><img :src="cover(p)" :alt="p.name" loading="lazy" decoding="async" /></div>
            <b>{{ p.name }}</b>
            <span>{{ p.location }}<template v-if="p.capacity"> · {{ p.capacity }}</template></span>
            <i class="dj-more">Подробнее</i>
          </NuxtLink>
        </div>
        <div class="eqp-app-more">
          <NuxtLink to="/projects" class="dj-more">Все проекты</NuxtLink>
        </div>
      </div>
    </section>

    <!-- Соседние позиции каталога -->
    <section v-if="siblings.length" class="dj-sec dj-sec--soft eqp-rel">
      <div class="dj-wrap">
        <div class="eqp-rel-head">
          <h2 class="dj-h3">Другое оборудование</h2>
          <NuxtLink to="/equipment" class="dj-more">Всё оборудование</NuxtLink>
        </div>
        <ul class="eqp-rel-grid">
          <li v-for="p in siblings" :key="p.slug" class="dj-reveal">
            <NuxtLink :to="`/equipment/${p.slug}`" class="eqp-rel-card">
              <div class="eqp-rel-media"><EquipShot :item="p" :caption="false" /></div>
              <span class="eqp-rel-cat">{{ p.category }}</span>
              <b>{{ p.name }}</b>
              <i class="dj-more">Подробнее</i>
            </NuxtLink>
          </li>
        </ul>
      </div>
    </section>

    <section class="dj-sec dj-center eqp-cta">
      <div class="dj-wrap">
        <h2 class="dj-h2">Готовы<br /><span>к сотрудничеству?</span></h2>
        <div class="dj-links eqp-cta-act">
          <NuxtLink to="/contacts#contact-form" class="dj-btn dj-btn--lg">Обсудить проект</NuxtLink>
          <NuxtLink to="/equipment" class="dj-btn dj-btn--lg dj-btn--line">Всё оборудование</NuxtLink>
        </div>
        <p class="eqp-cta-note">Гарантия до 5 лет · Коммерческое предложение за 24 часа</p>
      </div>
    </section>
  </div>

  <div v-else class="eqp-missing">
    <h1 class="dj-h2">Оборудование не найдено</h1>
    <NuxtLink to="/equipment" class="dj-btn dj-btn--lg">Всё оборудование</NuxtLink>
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
  if (!out.length) out.push({ key: 'e', type: 'empty', src: '', alt: p.name })
  gallery.value.slice(0, 6).forEach((g, i) => out.push({ key: 'g' + i, type: 'site', src: g.src, alt: g.alt, note: `Объект: ${g.alt}` }))
  return out
})
const active = ref(0)
watch(() => route.params.slug, () => { active.value = 0 })
const current = computed(() => slides.value[active.value] || slides.value[0] || { type: 'empty' })

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
  window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 56 - 52, behavior: 'smooth' })
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
.eqp-page { background: #fff; color: var(--dj-text); }

.eqp-crumbs { display: flex; align-items: center; gap: 10px; padding-top: 20px; padding-bottom: 16px; font-size: 13px; }
.eqp-back { color: var(--dj-link); }
.eqp-back:hover { text-decoration: underline; }
.eqp-crumb-cat { color: var(--dj-muted); }
.eqp-crumb-cat::before { content: '/'; margin-right: 10px; color: var(--dj-line); }

/* Верх: галерея + липкая колонка */
.eqp-top { display: grid; grid-template-columns: minmax(0, 7fr) minmax(0, 5fr); gap: clamp(28px, 4vw, 64px); align-items: start; padding-bottom: clamp(48px, 6vw, 80px); }
.eqp-gal { min-width: 0; }
.eqp-main { position: relative; aspect-ratio: 1 / 1; max-height: calc(100svh - 120px); width: 100%; background: var(--dj-soft); overflow: hidden; display: grid; place-items: center; }
.eqp-main > img { width: 100%; height: 100%; object-fit: contain; }
.eqp-main.is-site > img { object-fit: cover; }
.eqp-main.is-photo > img { padding: 6%; }
.eqp-main :deep(.esh-img) { width: 84%; height: 84%; }
.eqp-main-note { position: absolute; left: 12px; bottom: 12px; padding: 6px 10px; font-size: 12px; color: #fff; background: rgba(0, 0, 0, 0.5); backdrop-filter: blur(8px); -webkit-backdrop-filter: blur(8px); max-width: calc(100% - 24px); }
.eqp-thumbs { display: flex; gap: 12px; margin-top: 12px; overflow-x: auto; scrollbar-width: none; }
.eqp-thumbs::-webkit-scrollbar { display: none; }
.eqp-thumb { flex: 0 0 auto; width: 84px; height: 84px; padding: 0; background: var(--dj-soft); box-shadow: inset 0 0 0 1px transparent; transition: box-shadow 0.2s ease; overflow: hidden; }
.eqp-thumb img { width: 100%; height: 100%; object-fit: cover; }
.eqp-thumb.is-render img, .eqp-thumb.is-photo img { object-fit: contain; padding: 8px; mix-blend-mode: multiply; }
.eqp-thumb.is-empty img { display: none; }
.eqp-thumb.is-on { box-shadow: inset 0 0 0 2px var(--dj-ink); }
.eqp-thumb.is-on img { opacity: 0.94; }

.eqp-info { position: sticky; top: calc(var(--dj-header-h) + 24px); min-width: 0; padding-top: 8px; }
.eqp-title { margin-top: 6px; font-size: clamp(28px, 3vw, 40px); line-height: 1.12; font-weight: 600; letter-spacing: -0.02em; color: var(--dj-ink); overflow-wrap: break-word; }
.eqp-cap { margin-top: 12px; font-size: clamp(18px, 1.6vw, 22px); font-weight: 600; color: var(--dj-blue); }
.eqp-cap-rest { margin-left: 0.3em; }
.eqp-app { margin-top: 4px; font-size: 14px; color: var(--dj-muted); }
.eqp-desc { margin-top: 16px; font-size: 16px; line-height: 1.6; color: var(--dj-text); }
.eqp-keys { margin-top: 24px; border-top: 1px solid var(--dj-line); }
.eqp-keys > div { display: grid; grid-template-columns: minmax(0, 2fr) minmax(0, 3fr); gap: 12px; padding: 11px 0; border-bottom: 1px solid var(--dj-line); }
.eqp-keys dt { font-size: 13px; color: var(--dj-muted); }
.eqp-keys dd { font-size: 14px; line-height: 1.45; color: var(--dj-ink); }
.eqp-adv { display: grid; gap: 8px; margin: 20px 0 0; padding: 0; list-style: none; }
.eqp-adv li { position: relative; padding-left: 20px; font-size: 14px; line-height: 1.45; color: var(--dj-ink); }
.eqp-adv li::before { content: ''; position: absolute; left: 2px; top: 0.5em; width: 7px; height: 7px; border-radius: 50%; background: var(--dj-accent); }
.eqp-actions { display: flex; flex-wrap: wrap; gap: 10px; margin-top: 28px; }
.eqp-links { display: flex; flex-wrap: wrap; gap: 8px 22px; margin-top: 18px; }
.eqp-note { margin-top: 18px; font-size: 13px; color: var(--dj-muted); }
.eqp-sku { margin-top: 6px; font-size: 12px; color: var(--dj-muted); }

.eqp-subnav { position: sticky; top: var(--dj-header-h); z-index: 40; }
.eqp-subnav :deep(.dsn) { position: static; }
.eqp-subnav :deep(.dsn-title) { min-width: 0; overflow: hidden; text-overflow: ellipsis; }
.eqp-subnav :deep(.dsn-links) { flex-shrink: 0; }

/* Обзор */
.eqp-ov-head { max-width: 820px; }
.eqp-ov-head .dj-h2 { margin-top: 8px; }
.eqp-long { display: grid; gap: 16px; max-width: 820px; margin-top: 24px; font-size: 17px; line-height: 1.7; color: var(--dj-text); }
.eqp-why { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 12px; margin: clamp(40px, 5vw, 64px) 0 0; padding: 0; list-style: none; }
.eqp-why li { display: grid; gap: 6px; align-content: start; padding: 28px 24px; background: var(--dj-soft); }
.eqp-why svg { width: 26px; height: 26px; color: var(--dj-accent); margin-bottom: 6px; }
.eqp-why b { font-size: 14px; font-weight: 500; color: var(--dj-muted); }
.eqp-why span { font-size: 17px; line-height: 1.4; font-weight: 600; color: var(--dj-ink); }

/* Лента фото с объектов */
.eqp-strip { padding: 0 0 clamp(56px, 7vw, 96px); }
.eqp-strip-track { display: grid; grid-auto-flow: column; grid-auto-columns: clamp(260px, 40vw, 620px); gap: 12px; overflow-x: auto; scroll-snap-type: x mandatory; padding: 0 12px; scroll-padding-left: 12px; scrollbar-width: none; }
.eqp-strip-track::-webkit-scrollbar { display: none; }
.eqp-shot { margin: 0; scroll-snap-align: start; aspect-ratio: 16 / 10; overflow: hidden; background: var(--dj-soft); }
.eqp-shot img { width: 100%; height: 100%; object-fit: cover; }

/* Характеристики: чистая таблица */
.eqp-specs-wrap { max-width: 960px; }
.eqp-specs { width: 100%; margin-top: 32px; border-collapse: collapse; background: #fff; }
.eqp-specs th, .eqp-specs td { padding: 18px 24px; text-align: left; vertical-align: top; border-bottom: 1px solid var(--dj-line); }
.eqp-specs tr:last-child th, .eqp-specs tr:last-child td { border-bottom: 0; }
.eqp-specs th { width: 38%; font-size: 14px; font-weight: 500; color: var(--dj-muted); }
.eqp-specs td { font-size: 15px; line-height: 1.5; color: var(--dj-ink); }

/* Применение */
.eqp-app-head { max-width: 820px; }
.eqp-app-head .dj-h2 { margin-top: 8px; }
.eqp-app-head .dj-lede { margin-top: 12px; }
.eqp-film { margin: 40px 0 0; }
.eqp-film video { display: block; width: 100%; margin-top: 12px; aspect-ratio: 16 / 9; background: #0b0d10; }
.eqp-film figcaption { margin-top: 10px; font-size: 14px; color: var(--dj-muted); }
.eqp-where { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 12px; margin-top: 40px; }
.eqp-where-card { display: flex; flex-direction: column; gap: 6px; min-width: 0; }
.eqp-where-img { aspect-ratio: 16 / 10; overflow: hidden; background: var(--dj-soft); margin-bottom: 10px; }
.eqp-where-img img { width: 100%; height: 100%; object-fit: cover; transition: transform 0.9s var(--dj-ease); }
.eqp-where-card:hover .eqp-where-img img { transform: scale(1.04); }
.eqp-where-card b { font-size: 17px; font-weight: 600; color: var(--dj-ink); }
.eqp-where-card span { font-size: 14px; color: var(--dj-muted); }
.eqp-where-card i { font-style: normal; margin-top: 4px; }
.eqp-app-more { margin-top: 28px; }

/* Другое оборудование */
.eqp-rel-head { display: flex; align-items: baseline; justify-content: space-between; gap: 12px 24px; flex-wrap: wrap; }
.eqp-rel-grid { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 12px; margin: 28px 0 0; padding: 0; list-style: none; }
.eqp-rel-card { display: flex; flex-direction: column; gap: 6px; height: 100%; padding-bottom: 20px; background: #fff; }
.eqp-rel-media { aspect-ratio: 1 / 1; margin-bottom: 10px; }
.eqp-rel-media :deep(.esh) { background: #fff; }
.eqp-rel-media :deep(.esh.is-empty) { background: linear-gradient(180deg, #fff 0%, #f1f2f4 100%); }
.eqp-rel-card:hover :deep(.esh-img) { transform: scale(1.04); }
.eqp-rel-cat { padding: 0 18px; font-size: 12px; font-weight: 500; color: var(--dj-accent); }
.eqp-rel-card b { padding: 0 18px; font-size: 16px; line-height: 1.3; font-weight: 600; color: var(--dj-ink); overflow-wrap: break-word; }
.eqp-rel-card i { padding: 0 18px; margin-top: auto; padding-top: 8px; font-style: normal; }

.eqp-cta .dj-h2 span { color: var(--dj-muted); }
.eqp-cta-act { margin-top: 28px; }
.eqp-cta-note { margin-top: 16px; font-size: 14px; color: var(--dj-muted); }

.eqp-missing { min-height: 60vh; display: grid; place-content: center; justify-items: center; gap: 24px; padding: 48px 24px; text-align: center; }

@media (max-width: 1023px) {
  .eqp-why { grid-template-columns: 1fr 1fr; }
  .eqp-rel-grid { grid-template-columns: 1fr 1fr; }
  .eqp-where { grid-template-columns: 1fr 1fr; }
}
@media (max-width: 899px) {
  .eqp-top { grid-template-columns: 1fr; }
  .eqp-info { position: static; padding-top: 0; }
  .eqp-main { max-height: none; aspect-ratio: 4 / 3; }
}
@media (max-width: 767px) {
  .eqp-top { padding-left: 0; padding-right: 0; }
  .eqp-gal { padding: 0 8px; }
  .eqp-info { padding: 0 24px; }
  .eqp-thumbs { gap: 8px; margin-top: 8px; }
  .eqp-thumb { width: 64px; height: 64px; }
  .eqp-specs th, .eqp-specs td { display: block; width: auto; padding: 0 18px; border: 0; }
  .eqp-specs th { padding-top: 16px; }
  .eqp-specs td { padding-bottom: 16px; border-bottom: 1px solid var(--dj-line); }
  .eqp-specs tr:last-child td { border-bottom: 0; }
  .eqp-where { grid-template-columns: 1fr; gap: 28px; }
  .eqp-strip-track { padding: 0 8px; gap: 8px; grid-auto-columns: 82vw; }
  .eqp-rel-grid { gap: 8px; }
  .eqp-cta .dj-h2 { overflow-wrap: break-word; }
}
@media (max-width: 480px) {
  .eqp-why { grid-template-columns: 1fr; }
  .eqp-keys > div { grid-template-columns: 1fr; gap: 2px; }
  .eqp-actions .dj-btn { flex: 1 1 100%; }
}
</style>
