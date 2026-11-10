<template>
  <div ref="root" class="pj">
    <!-- Первый экран: тот же слайдер, что на главной, — 11 ключевых объектов
         от самого крупного к самому малому, акцент на производительности -->
    <HomeObjectsSlider :items="objectSlides" label="Ключевые объекты ESP" :h1="false" />

    <section class="dj-sec dj-center pj-intro">
      <div class="dj-wrap">
        <span class="dj-eyebrow">Портфолио ESP</span>
        <h1 class="dj-h2 pj-intro__h">Реализованные проекты ESP</h1>
        <p class="dj-lede pj-intro__lede">Реализованные проекты ESP: 2000+ очистных сооружений в Беларуси. Коммунальное хозяйство, мясопереработка, молочные предприятия, локальные очистные сооружения.</p>
        <div class="dj-links">
          <a href="#objects" class="dj-btn" @click.prevent="jump('#objects')">Смотреть объекты</a>
          <a href="#map" class="dj-more" @click.prevent="jump('#map')">На карте</a>
        </div>
      </div>
    </section>

    <DjSubnav
      title="Объекты"
      :links="[{ href: '#objects', label: 'Портфолио' }, { href: '#map', label: 'География' }]"
      :cta="{ to: '/contacts#contact-form', label: 'Оставить заявку' }"
    />

    <!-- Цифры: крупный тонкий шрифт -->
    <section class="dj-sec pj-numbers">
      <ul class="dj-wrap dj-stats pj-stats">
        <li v-for="s in stats" :key="s.label" class="dj-reveal"><b>{{ s.value }}</b><span>{{ s.label }}</span></li>
      </ul>
    </section>

    <!-- Объекты: ключевые и локальные -->
    <section id="objects" class="pj-scroll pj-objects">
      <span id="cases" class="pj-anchor"></span>
      <span id="registry" class="pj-anchor"></span>

      <div class="dj-wrap dj-center pj-head dj-reveal">
        <span class="dj-eyebrow">Портфолио</span>
        <h2 class="dj-h2 pj-h2">Объекты</h2>

        <!-- Две вкладки: ключевые объекты со своей страницей и реестр локальных -->
        <div class="pj-seg" role="tablist" aria-label="Тип объектов">
          <button
            v-for="t in tabs"
            :key="t.id"
            type="button"
            role="tab"
            :class="{ 'is-on': tab === t.id }"
            :aria-selected="tab === t.id"
            @click="tab = t.id"
          >{{ t.label }}</button>
        </div>

        <p class="dj-lede pj-intro">
          {{ tab === 'key' ? 'Объекты, по которым есть съёмка и подробное описание: город, предприятие, технология и производительность.' : 'Реестр объектов ESP по Беларуси: заказчик, построенное сооружение, производительность и место.' }}
        </p>
      </div>

      <!-- Категории — общие для обеих вкладок -->
      <div class="pj-chips" aria-label="Категории">
        <button
          v-for="c in categories"
          :key="c"
          type="button"
          class="pj-chip"
          :class="{ 'is-on': activeCategory === c }"
          :aria-pressed="activeCategory === c"
          @click="activeCategory = c"
        >
          <span v-if="c !== 'Все'" class="pj-dot" :style="dotStyle(c)"></span>{{ c }}
        </button>
      </div>

      <!-- ===== Ключевые ===== -->
      <div v-if="tab === 'key'" class="pj-block">
        <div class="dj-wrap dj-wrap--wide pj-viewbar">
          <div class="pj-view" role="group" aria-label="Вид списка">
            <button type="button" :class="{ 'is-on': keyView === 'cards' }" @click="keyView = 'cards'">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.6"><rect x="4" y="4" width="7" height="7" rx="1.5"/><rect x="13" y="4" width="7" height="7" rx="1.5"/><rect x="4" y="13" width="7" height="7" rx="1.5"/><rect x="13" y="13" width="7" height="7" rx="1.5"/></svg>
              Карточки
            </button>
            <button type="button" :class="{ 'is-on': keyView === 'list' }" @click="keyView = 'list'">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"><path d="M4 6h16M4 12h16M4 18h16"/></svg>
              Список
            </button>
          </div>
        </div>

        <!-- Карточки: кадр во всю плитку, категория, название, место и мощность -->
        <div v-if="keyView === 'cards'" class="pj-grid">
          <NuxtLink
            v-for="p in keyProjects"
            :key="p.slug"
            :to="`/projects/${p.slug}`"
            class="pj-card"
            @mouseenter="play"
            @mouseleave="pause"
          >
            <span class="pj-card__media">
              <video v-if="p.video && canHover" :src="p.video" :poster="p.poster || p.gallery?.[0]" muted loop playsinline preload="none" />
              <img
                v-else-if="p.poster || (p.gallery && p.gallery[0])"
                :src="p.poster || p.gallery[0]"
                :alt="p.name"
                loading="lazy"
                decoding="async"
              />
            </span>
            <span class="pj-card__copy">
              <span class="pj-card__cat">{{ p.category }}</span>
              <b class="pj-card__title">{{ p.name }}</b>
              <span class="pj-card__meta">{{ [p.location, p.capacity, p.year].filter(Boolean).join(' · ') }}</span>
              <span class="dj-more dj-more--light">Подробнее</span>
            </span>
          </NuxtLink>
        </div>

        <!-- Таблица-список: на телефоне строки складываются в карточку. -->
        <div v-else class="dj-wrap dj-wrap--wide">
          <div class="pj-list">
            <div class="pj-row pj-row--head">
              <span>Объект</span>
              <span>Оборудование / технология</span>
              <span>Локация</span>
              <span>Год</span>
              <span>Производительность</span>
              <span></span>
            </div>
            <NuxtLink
              v-for="p in keyProjects"
              :key="p.slug"
              :to="`/projects/${p.slug}`"
              class="pj-row pj-row--link"
            >
              <span class="pj-cell-name">{{ p.name }}</span>
              <span class="pj-cell" data-label="Технология">{{ techLabel(p) || '—' }}</span>
              <span class="pj-cell" data-label="Локация">{{ p.location || '—' }}</span>
              <span class="pj-cell tabular-nums" data-label="Год">{{ p.year || '—' }}</span>
              <span class="pj-cell tabular-nums" data-label="Производительность">{{ p.capacity || '—' }}</span>
              <span class="dj-more pj-more">Подробнее</span>
            </NuxtLink>
          </div>
        </div>

        <div v-if="!keyProjects.length" class="dj-wrap">
          <div class="pj-empty">
            <p>В этой категории пока нет ключевых объектов.</p>
            <button type="button" class="dj-more" @click="activeCategory = 'Все'">Показать все</button>
          </div>
        </div>
      </div>

      <!-- ===== Локальные ===== -->
      <div v-else class="pj-block dj-wrap dj-wrap--wide">
        <div class="pj-search">
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.6" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
          </svg>
          <input
            v-model="regSearch"
            type="search"
            placeholder="Поиск по заказчику, объекту или населённому пункту"
            class="pj-input"
            aria-label="Поиск по реестру"
          />
        </div>

        <div class="pj-list pj-list--reg" :class="{ 'pj-list--noyear': !regHasYear }">
          <div class="pj-row pj-row--head">
            <span>Заказчик</span>
            <span>Объект</span>
            <span>Производительность</span>
            <span class="pj-year">Год</span>
            <span>Локация</span>
          </div>
          <div v-for="(o, i) in visibleRegistry" :key="i" class="pj-row">
            <span class="pj-cell-name">{{ o.name }}</span>
            <span class="pj-cell pj-cell-wide" data-label="Объект">
              {{ o.facility }}
              <span class="pj-sub">
                <span class="pj-dot" :style="dotStyle(o.category)"></span>{{ o.category }}
              </span>
            </span>
            <span class="pj-cell tabular-nums" data-label="Производительность">{{ o.capacity || '—' }}</span>
            <span class="pj-cell pj-year tabular-nums" data-label="Год">{{ o.year || '—' }}</span>
            <span class="pj-cell" data-label="Локация">{{ o.location }}<span v-if="o.region" class="pj-region">{{ o.region }}</span></span>
          </div>
        </div>

        <div v-if="!filteredRegistry.length" class="pj-empty">Ничего не найдено. Измените запрос или категорию.</div>

        <div v-if="visibleCount < filteredRegistry.length" class="dj-links pj-moreline">
          <button type="button" class="dj-btn dj-btn--line" @click="visibleCount += 40">
            Показать ещё
          </button>
        </div>
      </div>
    </section>

    <!-- Карта -->
    <section id="map" class="pj-scroll pj-mapsec">
      <div class="dj-wrap dj-center pj-head dj-reveal">
        <span class="dj-eyebrow">География</span>
        <h2 class="dj-h2 pj-h2">Объекты ESP на карте Беларуси</h2>
        <p class="dj-lede pj-intro">
          Крупные точки — ключевые объекты: по клику откроется их страница. Фильтр категорий выше действует и на карту.
        </p>
      </div>

      <div class="pj-mapwrap">
        <ClientOnly>
          <ProjectsMap :points="mapPoints" class="pj-map" />
          <template #fallback>
            <div class="pj-map pj-map--wait">Загрузка карты…</div>
          </template>
        </ClientOnly>
      </div>

      <div class="pj-legend">
        <span v-for="c in projectCategories" :key="c">
          <span class="pj-dot pj-dot--lg" :style="dotStyle(c)"></span>{{ c }}
        </span>
      </div>
    </section>

    <!-- CTA: спокойно, без должностей -->
    <section class="dj-sec dj-center pj-cta">
      <div class="dj-wrap dj-reveal">
        <h2 class="dj-h1">Обсудим ваш объект</h2>
        <p class="dj-lede pj-cta__lede">
          Расскажите о задаче — инженеры ESP изучат исходные данные и предложат решение под условия вашего объекта.
        </p>
        <div class="dj-links pj-cta__act">
          <NuxtLink to="/contacts#contact-form" class="dj-btn dj-btn--lg">Оставить заявку</NuxtLink>
          <a :href="`tel:${PHONE_TEL}`" class="dj-more tabular-nums">{{ PHONE }}</a>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { slidesFromProjects } from '~/composables/useObjectSlides'
import { ref, computed, watch, onMounted } from 'vue'
import { useProjects, projectCategories } from '~/composables/useProjects'
import { useRegistry, registryCategories } from '~/composables/useProjectRegistry'
import { equipmentList } from '~/composables/useEquipment'
import { projectGeo } from '~/composables/useProjectGeo'
import { useReveal } from '~/composables/useReveal'

const ogOrigin = useRuntimeConfig().public.ogOrigin

useHead({
  title: 'Проекты ESP | Очистные сооружения под ключ: объекты и результаты',
  meta: [
    { name: 'description', content: 'Реализованные проекты ESP: 2000+ очистных сооружений в Беларуси. Коммунальное хозяйство, мясопереработка, молочные предприятия, локальные очистные сооружения.' },
    { property: 'og:title', content: 'Проекты ESP | Очистные сооружения под ключ' },
    { property: 'og:description', content: '2000+ реализованных объектов в Беларуси.' },
    { property: 'og:image', content: `${ogOrigin}/images/og-esp.png` }
  ],
  link: [{ rel: 'canonical', href: 'https://ecoservisproekt.by/projects' }]
})

const root = ref(null)
useReveal(root)

const PHONE = '+375 (17) 238-11-41'
const PHONE_TEL = '+375172381141'

const stats = [
  { value: '2000+', label: 'Реализованных объектов за 28 лет' },
  { value: '30 000', label: 'Элементов под контролем' },
  { value: '0', label: 'Аварийных сбоев' }
]

const { projects } = useProjects()
const { registry } = useRegistry()

// В «Ключевые» идут объекты с галочкой isKey. Поле появилось недавно,
// поэтому запись без него тоже считаем ключевой.
const keyAll = computed(() => projects.value.filter(p => p.isKey !== false))

// В слайдер — объекты со своей съёмкой: сначала с видео, потом с фото.
const flagshipProjects = computed(() => [
  ...keyAll.value.filter(p => p.video),
  ...keyAll.value.filter(p => !p.video && (p.poster || (p.gallery && p.gallery.length)))
])

// Первый экран — съёмка первого флагмана
const objectSlides = computed(() => slidesFromProjects(keyAll.value))
const heroProject = computed(() => flagshipProjects.value[0] || null)

// Ролик в карточке оживает только при наведении мышью
const canHover = ref(false)
const play = (e) => { const v = e.currentTarget.querySelector('video'); v && v.play().catch(() => {}) }
const pause = (e) => { const v = e.currentTarget.querySelector('video'); v && v.pause() }
const jump = (href) => {
  const el = document.querySelector(href)
  if (el) window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 56 - 52, behavior: 'smooth' })
}

// ===== Вкладки и категории =====
const tabs = [
  { id: 'key', label: 'Ключевые' },
  { id: 'local', label: 'Локальные' }
]
// ?tab=local открывает реестр сразу (и при серверной отрисовке).
const route = useRoute()
const tab = ref(route.query.tab === 'local' ? 'local' : 'key')
const keyView = ref(route.query.view === 'list' ? 'list' : 'cards')
const categories = ['Все', ...new Set([...projectCategories, ...registryCategories])]
const activeCategory = ref('Все')
const inCategory = (o) => activeCategory.value === 'Все' || o.category === activeCategory.value

const keyProjects = computed(() => keyAll.value.filter(inCategory))

// Цвета категорий — только из фирменной палитры. Локальные объекты — белая
// точка с синим кольцом: их больше всего, и карта не должна тонуть в цвете.
const CATEGORY_STYLE = {
  'Коммунальное хозяйство': { fill: '#002366', ring: '#002366' },
  'Мясопереработка': { fill: '#006039', ring: '#006039' },
  'Молочные предприятия': { fill: '#1A1A1A', ring: '#1A1A1A' },
  'Локальные очистные сооружения': { fill: '#FFFFFF', ring: '#002366' }
}
const dotStyle = (c) => {
  const s = CATEGORY_STYLE[c] || CATEGORY_STYLE['Локальные очистные сооружения']
  return { background: s.fill, boxShadow: `inset 0 0 0 2px ${s.ring}` }
}

// «Стоки» в подписях из данных выводим как «сточные воды».
const sw = (s) => String(s || '')
  .replace(/стоков/g, 'сточных вод')
  .replace(/стоки/g, 'сточные воды')
  .replace(/Стоки/g, 'Сточные воды')

const equipmentName = (slug) => equipmentList.find(e => e.slug === slug)?.name || ''
const techLabel = (p) => {
  const eq = (p.equipmentSlugs || []).map(equipmentName).filter(Boolean)
  return sw((eq.length ? eq : (p.tags || [])).join(', '))
}

// ===== Реестр =====
const regSearch = ref('')
const visibleCount = ref(40)
const filteredRegistry = computed(() => {
  let r = registry.value.filter(inCategory)
  const q = regSearch.value.trim().toLowerCase()
  if (q) {
    r = r.filter(o =>
      [o.name, o.facility, o.location].some(v => String(v || '').toLowerCase().includes(q))
    )
  }
  return r
})
// Колонку «Год» показываем, только когда год заполнен хоть у одного объекта.
const regHasYear = computed(() => registry.value.some(o => String(o.year || '').trim()))
const visibleRegistry = computed(() => filteredRegistry.value.slice(0, visibleCount.value))
watch([regSearch, activeCategory, tab], () => { visibleCount.value = 40 })

// ===== Карта =====
// Точки реестра + ключевые объекты поверх них. Координаты ключевого
// объекта: lat/lng из админки, если заданы, иначе привязка из useProjectGeo.
const mapPoints = computed(() => {
  const reg = registry.value
    .filter(o => Number.isFinite(+o.lat) && Number.isFinite(+o.lng) && o.lat !== '' && o.lng !== '')
    .filter(inCategory)
    .map(o => ({
      lng: +o.lng, lat: +o.lat, name: o.name, location: o.location, region: o.region,
      capacity: o.capacity, category: o.category, facility: o.facility,
      featuredSlug: null, flagship: false
    }))
  const key = keyProjects.value
    .map(p => {
      const ll = (p.lat && p.lng) ? [+p.lng, +p.lat] : projectGeo[p.slug]
      if (!ll) return null
      return {
        lng: ll[0], lat: ll[1], name: p.name, location: p.location, region: p.region,
        capacity: p.capacity || '', category: p.category, facility: p.year ? `Год: ${p.year}` : '',
        featuredSlug: p.slug, flagship: true
      }
    })
    .filter(Boolean)
  return [...reg, ...key]
})

// Старые ссылки меню: /projects#cases — ключевые, /projects#registry — реестр.
onMounted(() => {
  if (location.hash === '#registry') tab.value = 'local'
  canHover.value = matchMedia('(hover: hover) and (pointer: fine)').matches &&
    !matchMedia('(prefers-reduced-motion: reduce)').matches
})
</script>

<style scoped>
.pj-scroll { scroll-margin-top: 108px; }
.pj-anchor { display: block; position: relative; top: -108px; visibility: hidden; }
.pj-head { padding: clamp(56px, 7vw, 96px) 24px clamp(20px, 2.5vw, 28px); }
.pj-h2 { margin-top: 6px; }
.pj-intro { max-width: 44rem; margin-top: 16px; }

/* Цифры: крупно и тонко */
.pj-numbers { border-bottom: 1px solid var(--dj-line); }
.pj-stats b { font-weight: 200; font-size: clamp(48px, 7vw, 96px); }
.pj-stats span { font-size: 15px; }

/* Сегмент-капсула вкладок */
.pj-seg { display: inline-flex; margin-top: 24px; padding: 4px; border-radius: 999px; background: var(--dj-soft); }
.pj-seg button { height: 36px; padding: 0 22px; border-radius: 999px; font-size: 14px; font-weight: 500; color: var(--dj-muted); transition: background-color 0.25s ease, color 0.25s ease, box-shadow 0.25s ease; }
.pj-seg button.is-on { background: #fff; color: var(--dj-ink); box-shadow: 0 1px 4px rgba(0, 0, 0, 0.1); }

/* Чипы категорий */
.pj-chips { display: flex; flex-wrap: wrap; justify-content: center; gap: 8px; padding: 0 16px; }
.pj-chip { display: inline-flex; align-items: center; gap: 8px; height: 36px; padding: 0 16px; border-radius: 999px; font-size: 14px; color: var(--dj-ink); box-shadow: inset 0 0 0 1px var(--dj-line); background: #fff; transition: background-color 0.25s ease, color 0.25s ease, box-shadow 0.25s ease; }
.pj-chip:hover { box-shadow: inset 0 0 0 1px rgba(0, 0, 0, 0.3); }
.pj-chip.is-on { background: var(--dj-ink); color: #fff; box-shadow: none; }

.pj-dot { display: inline-block; flex-shrink: 0; width: 10px; height: 10px; border-radius: 50%; }
.pj-dot--lg { width: 12px; height: 12px; }

.pj-block { margin-top: clamp(24px, 3vw, 36px); }

/* Переключатель вида */
.pj-viewbar { display: flex; justify-content: flex-end; margin-bottom: 12px; }
.pj-view { display: inline-flex; padding: 3px; border-radius: 999px; background: var(--dj-soft); }
.pj-view button { display: inline-flex; align-items: center; gap: 6px; padding: 6px 14px; border-radius: 999px; font-size: 13px; color: var(--dj-muted); transition: background-color 0.2s ease, color 0.2s ease; }
.pj-view button svg { width: 15px; height: 15px; }
.pj-view button.is-on { background: #fff; color: var(--dj-ink); box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08); }

/* Кинокарточки: квадратные края, зазор 12px, кадр во всю плитку */
.pj-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 12px; padding: 0 12px; }
.pj-card { position: relative; display: block; aspect-ratio: 16 / 11; overflow: hidden; background: #0b0d10; color: #fff; isolation: isolate; }
.pj-card:first-child { grid-column: 1 / -1; aspect-ratio: 21 / 9; }
.pj-card__media { position: absolute; inset: 0; z-index: -1; }
.pj-card__media img, .pj-card__media video { width: 100%; height: 100%; object-fit: cover; transition: transform 1.2s var(--dj-ease); }
.pj-card:hover .pj-card__media img, .pj-card:hover .pj-card__media video { transform: scale(1.035); }
.pj-card::after { content: ''; position: absolute; inset: 0; z-index: -1; background: linear-gradient(180deg, rgba(0, 0, 0, 0) 45%, rgba(0, 0, 0, 0.75) 100%); pointer-events: none; }
.pj-card__copy { position: absolute; inset: auto 0 0 0; display: flex; flex-direction: column; align-items: flex-start; gap: 6px; padding: clamp(22px, 3vw, 44px); }
.pj-card__cat { font-size: 13px; color: rgba(255, 255, 255, 0.74); }
.pj-card__title { max-width: 26ch; font-size: clamp(22px, 2.4vw, 36px); line-height: 1.1; font-weight: 600; letter-spacing: -0.02em; }
.pj-card:first-child .pj-card__title { font-size: clamp(28px, 3.6vw, 52px); }
.pj-card__meta { font-size: 14px; color: rgba(255, 255, 255, 0.8); font-variant-numeric: tabular-nums; }
.pj-card .dj-more { margin-top: 6px; }

/* Таблица-список */
.pj-list { border-top: 1px solid var(--dj-ink); }
.pj-row { display: grid; grid-template-columns: minmax(0, 2.2fr) minmax(0, 1.6fr) minmax(0, 1.2fr) 4rem minmax(0, 1.1fr) 7rem; gap: 16px; align-items: start; padding: 18px 8px; border-bottom: 1px solid var(--dj-line); font-size: 14px; line-height: 1.45; color: var(--dj-muted); }
.pj-list--reg .pj-row { grid-template-columns: minmax(0, 1.8fr) minmax(0, 2fr) minmax(0, 1fr) 4rem minmax(0, 1.2fr); }
.pj-list--noyear .pj-row { grid-template-columns: minmax(0, 1.8fr) minmax(0, 2.2fr) minmax(0, 1fr) minmax(0, 1.2fr); }
.pj-list--noyear .pj-year { display: none; }
.pj-row--head { font-size: 12px; font-weight: 600; color: var(--dj-ink); padding-top: 14px; padding-bottom: 14px; }
.pj-row--link { transition: background-color 0.2s ease; }
.pj-row--link:hover { background: var(--dj-soft); }
.pj-cell-name { color: var(--dj-ink); font-weight: 600; }
.pj-more { justify-self: end; font-size: 14px; }
.pj-sub { display: flex; align-items: center; gap: 6px; margin-top: 4px; font-size: 12px; }
.pj-region { display: block; font-size: 12px; opacity: 0.8; }

.pj-empty { margin-top: 16px; padding: 48px 16px; background: var(--dj-soft); text-align: center; color: var(--dj-muted); font-size: 15px; display: grid; gap: 8px; justify-items: center; }

/* Поиск по реестру */
.pj-search { position: relative; margin-bottom: 20px; }
.pj-search svg { position: absolute; left: 18px; top: 50%; transform: translateY(-50%); width: 18px; height: 18px; color: var(--dj-muted); pointer-events: none; }
.pj-input { width: 100%; height: 48px; padding: 0 20px 0 46px; border: 0; border-radius: 999px; background: var(--dj-soft); font: inherit; font-size: 15px; color: var(--dj-ink); outline: none; transition: box-shadow 0.2s ease; }
.pj-input:focus { box-shadow: inset 0 0 0 2px var(--dj-accent); }
.pj-moreline { margin-top: 28px; }

/* Карта во всю ширину */
.pj-mapwrap { margin: clamp(20px, 3vw, 32px) 12px 0; overflow: hidden; background: var(--dj-soft); }
.pj-map { width: 100%; height: clamp(22rem, 72vh, 46rem); }
.pj-map--wait { display: flex; align-items: center; justify-content: center; color: var(--dj-muted); font-size: 14px; }
.pj-legend { display: flex; flex-wrap: wrap; justify-content: center; gap: 8px 24px; margin-top: 20px; padding: 0 16px; font-size: 13px; color: var(--dj-muted); }
.pj-legend > span { display: inline-flex; align-items: center; gap: 8px; }

.pj-cta__lede { max-width: 56ch; margin-top: 16px; }
.pj-cta__act { margin-top: 28px; }

@media (max-width: 1023px) {
  .pj-row--head { display: none; }
  .pj-row,
  .pj-list--reg .pj-row,
  .pj-list--noyear .pj-row { grid-template-columns: 1fr 1fr; gap: 10px 16px; padding: 18px 4px; }
  .pj-cell-name, .pj-cell-wide { grid-column: 1 / -1; }
  .pj-cell-name { font-size: 15px; }
  .pj-cell::before { content: attr(data-label); display: block; font-size: 12px; color: var(--dj-muted); opacity: 0.8; margin-bottom: 2px; }
  .pj-more { grid-column: 1 / -1; justify-self: start; }
}
@media (max-width: 767px) {
  .pj-grid { grid-template-columns: 1fr; gap: 8px; padding: 0 8px; }
  .pj-card, .pj-card:first-child { grid-column: auto; aspect-ratio: 4 / 5; }
  .pj-stats { gap: 28px; }
  .pj-chips { flex-wrap: nowrap; justify-content: flex-start; overflow-x: auto; scrollbar-width: none; }
  .pj-chips::-webkit-scrollbar { display: none; }
  .pj-chip { flex-shrink: 0; }
  .pj-mapwrap { margin: 20px 8px 0; }
  .pj-map { height: clamp(20rem, 62vh, 30rem); }
}
@media (prefers-reduced-motion: reduce) {
  .pj-card__media img, .pj-card__media video { transition: none; }
}
.pj-intro { padding-bottom: clamp(24px, 4vw, 48px); }
.pj-intro__h { margin: 8px auto 0; max-width: 18ch; }
.pj-intro__lede { max-width: 60ch; margin-top: 16px; }
</style>
