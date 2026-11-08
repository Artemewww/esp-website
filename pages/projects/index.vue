<template>
  <div class="ap">
    <!-- Шапка в подаче Apple: надзаголовок, заголовок, вводный абзац.
         Под ней — флагманы со своей съёмкой, скруглённым кадром. -->
    <!-- Первый экран — объекты кадром на всю ширину и высоту экрана -->
    <h1 class="sr-only">Реализованные проекты ESP</h1>
    <div v-if="flagshipProjects.length" class="pj-hero">
      <FlagshipSlider :items="flagshipProjects" full>
        <template #eyebrow><span class="pj-hero-eyebrow">Портфолио ESP</span></template>
      </FlagshipSlider>
    </div>

    <section class="ap-sec ap-sec--tight">
      <div class="ap-wrap">
        <p class="ap-lede pj-lede">
          Реализованные проекты ESP: 2000+ очистных сооружений в Беларуси. Коммунальное хозяйство,
          мясопереработка, молочные предприятия, локальные очистные сооружения.
        </p>

        <!-- Цифры -->
        <ul class="ap-stats pj-stats">
          <li v-for="s in stats" :key="s.label"><b class="tabular-nums">{{ s.value }}</b><span>{{ s.label }}</span></li>
        </ul>
      </div>
    </section>

    <!-- Объекты: ключевые и локальные -->
    <section id="objects" class="ap-sec ap-sec--white pj-scroll">
      <div class="ap-wrap">
        <span id="cases" class="pj-anchor"></span>
        <span id="registry" class="pj-anchor"></span>

        <span class="ap-eyebrow">Портфолио</span>
        <div class="ap-head">
          <h2 class="ap-h2">Объекты</h2>
          <a href="#map" class="ap-link">На карте ›</a>
        </div>

        <!-- Две вкладки: ключевые объекты со своей страницей и реестр
             локальных объектов. -->
        <div class="ap-tabs" role="tablist" aria-label="Тип объектов">
          <button
            v-for="t in tabs"
            :key="t.id"
            type="button"
            role="tab"
            class="ap-tab"
            :class="{ 'is-on': tab === t.id }"
            :aria-selected="tab === t.id"
            @click="tab = t.id"
          >{{ t.label }}</button>
        </div>

        <p class="ap-text pj-intro">
          {{ tab === 'key' ? 'Объекты, по которым есть съёмка и подробное описание: город, предприятие, технология и производительность.' : 'Реестр объектов ESP по Беларуси: заказчик, построенное сооружение, производительность и место.' }}
        </p>

        <!-- Категории — общие для обеих вкладок -->
        <div class="ap-tabs pj-cats" aria-label="Категории">
          <button
            v-for="c in categories"
            :key="c"
            type="button"
            class="ap-tab"
            :class="{ 'is-on': activeCategory === c }"
            @click="activeCategory = c"
          >
            <span v-if="c !== 'Все'" class="pj-dot" :style="dotStyle(c)"></span>{{ c }}
          </button>
        </div>

        <!-- ===== Ключевые ===== -->
        <div v-if="tab === 'key'" class="pj-block">
          <div class="pj-viewbar">
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

          <!-- Карточки: скруглённый кадр, категория, название, место и мощность -->
          <div v-if="keyView === 'cards'" class="ap-grid ap-grid--3 pj-grid">
            <NuxtLink
              v-for="p in keyProjects"
              :key="p.slug"
              :to="`/projects/${p.slug}`"
              class="ap-card ap-card--media"
            >
              <img
                v-if="p.poster || (p.gallery && p.gallery[0])"
                :src="p.poster || p.gallery[0]"
                :alt="p.name"
                class="ap-card-img"
                loading="lazy"
                decoding="async"
              />
              <div v-else class="ap-card-img"></div>
              <div class="ap-card-body">
                <span class="pj-cat">{{ p.category }}</span>
                <h3 class="ap-h3">{{ p.name }}</h3>
                <p class="ap-small">{{ [p.location, p.capacity, p.year].filter(Boolean).join(' · ') }}</p>
                <span class="ap-card-foot ap-link">Подробнее ›</span>
              </div>
            </NuxtLink>
          </div>

          <!-- Таблица-список: на телефоне строки складываются в карточку. -->
          <div v-else class="pj-list">
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
              <span class="pj-more">Подробнее ›</span>
            </NuxtLink>
          </div>

          <div v-if="!keyProjects.length" class="pj-empty">
            <p>В этой категории пока нет ключевых объектов.</p>
            <button type="button" class="ap-link" @click="activeCategory = 'Все'">Показать все ›</button>
          </div>
        </div>

        <!-- ===== Локальные ===== -->
        <div v-else class="pj-block">
          <div class="pj-search">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.6" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
            </svg>
            <input
              v-model="regSearch"
              type="search"
              placeholder="Поиск по заказчику, объекту или населённому пункту"
              class="ap-input"
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

          <div v-if="visibleCount < filteredRegistry.length" class="ap-actions ap-center pj-moreline">
            <button type="button" class="ap-btn ap-btn--ghost" @click="visibleCount += 40">
              Показать ещё
            </button>
          </div>
        </div>
      </div>
    </section>

    <!-- Карта -->
    <section id="map" class="ap-sec pj-scroll">
      <div class="ap-wrap">
        <span class="ap-eyebrow">География</span>
        <h2 class="ap-h2">Объекты ESP на карте Беларуси</h2>
        <p class="ap-lede">
          Крупные точки — ключевые объекты: по клику откроется их страница. Фильтр категорий выше действует и на карту.
        </p>

        <div class="ap-media pj-mapwrap">
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
      </div>
    </section>

    <!-- CTA: спокойно, без должностей -->
    <section class="ap-sec ap-sec--white ap-cta">
      <div class="ap-wrap ap-wrap--narrow">
        <h2 class="ap-h2">Обсудим ваш объект</h2>
        <p class="ap-lede">
          Расскажите о задаче — инженеры ESP изучат исходные данные и предложат решение под условия вашего объекта.
        </p>
        <div class="ap-actions ap-center">
          <NuxtLink to="/contacts#contact-form" class="ap-btn">Оставить заявку</NuxtLink>
          <a :href="`tel:${PHONE_TEL}`" class="ap-link tabular-nums">{{ PHONE }} ›</a>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { useProjects, projectCategories } from '~/composables/useProjects'
import { useRegistry, registryCategories } from '~/composables/useProjectRegistry'
import { equipmentList } from '~/composables/useEquipment'
import { projectGeo } from '~/composables/useProjectGeo'

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
})
</script>

<style scoped>
.pj-scroll { scroll-margin-top: 90px; }
.pj-anchor { display: block; position: relative; top: -90px; visibility: hidden; }

/* Флагманский слайдер внутри скруглённого кадра */
.pj-hero { isolation: isolate; margin-top: -5rem; }
.pj-hero-eyebrow { display: block; margin-bottom: 0.75rem; font-size: 14px; font-weight: 600; color: rgba(255, 255, 255, 0.75); }
.pj-lede { margin-top: 0; color: var(--ap-ink); }

.pj-stats { grid-template-columns: repeat(3, minmax(0, 1fr)); }
@media (max-width: 767px) {
  .pj-stats { grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 0.75rem; }
  .pj-stats b { font-size: 1.6rem; }
}

.pj-intro { max-width: 44rem; margin-top: 1.25rem; }
.pj-cats { margin-top: 1rem; }
.pj-cats .ap-tab { display: inline-flex; align-items: center; gap: 0.45rem; }

.pj-dot { display: inline-block; flex-shrink: 0; width: 10px; height: 10px; border-radius: 50%; }
.pj-dot--lg { width: 12px; height: 12px; }

.pj-block { margin-top: 1.5rem; }

/* Переключатель вида: сегмент-капсула */
.pj-viewbar { display: flex; justify-content: flex-end; }
.pj-view { display: inline-flex; padding: 3px; border-radius: 999px; background: rgba(0, 0, 0, 0.05); }
.pj-view button {
  display: inline-flex; align-items: center; gap: 0.4rem;
  padding: 0.4rem 0.9rem; border-radius: 999px; font-size: 13px; color: var(--ap-muted);
  transition: background-color 0.2s ease, color 0.2s ease;
}
.pj-view button svg { width: 15px; height: 15px; }
.pj-view button.is-on { background: #fff; color: var(--ap-ink); box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08); }

.pj-grid { margin-top: 1.25rem; }
.pj-cat { font-size: 13px; font-weight: 600; color: var(--ap-accent); }

/* Таблица-список */
.pj-list { margin-top: 1.25rem; border-radius: 18px; background: var(--ap-bg); overflow: hidden; }
.pj-row {
  display: grid;
  grid-template-columns: minmax(0, 2.2fr) minmax(0, 1.6fr) minmax(0, 1.2fr) 4rem minmax(0, 1.1fr) 7rem;
  gap: 1rem;
  align-items: start;
  padding: 1rem 1.5rem;
  border-top: 1px solid var(--ap-line);
  font-size: 14px;
  line-height: 1.45;
  color: var(--ap-muted);
}
.pj-list--reg .pj-row { grid-template-columns: minmax(0, 1.8fr) minmax(0, 2fr) minmax(0, 1fr) 4rem minmax(0, 1.2fr); }
.pj-list--noyear .pj-row { grid-template-columns: minmax(0, 1.8fr) minmax(0, 2.2fr) minmax(0, 1fr) minmax(0, 1.2fr); }
.pj-list--noyear .pj-year { display: none; }
.pj-row--head { border-top: 0; font-size: 12px; font-weight: 600; color: var(--ap-muted); padding-top: 0.9rem; padding-bottom: 0.9rem; }
.pj-row--link { transition: background-color 0.2s ease; }
.pj-row--link:hover { background: rgba(0, 0, 0, 0.03); }
.pj-cell-name { color: var(--ap-ink); font-weight: 600; }
.pj-more { color: var(--ap-link); white-space: nowrap; text-align: right; }
.pj-sub { display: flex; align-items: center; gap: 0.4rem; margin-top: 0.3rem; font-size: 12px; }
.pj-region { display: block; font-size: 12px; opacity: 0.8; }

@media (max-width: 1023px) {
  .pj-row--head { display: none; }
  .pj-row,
  .pj-list--reg .pj-row,
  .pj-list--noyear .pj-row { grid-template-columns: 1fr 1fr; gap: 0.6rem 1rem; padding: 1.1rem 1.1rem; }
  .pj-row--head + .pj-row { border-top: 0; }
  .pj-cell-name,
  .pj-cell-wide { grid-column: 1 / -1; }
  .pj-cell-name { font-size: 15px; }
  .pj-cell::before { content: attr(data-label); display: block; font-size: 12px; color: #86868b; margin-bottom: 0.1rem; }
  .pj-more { grid-column: 1 / -1; text-align: left; }
}

.pj-empty { margin-top: 1.25rem; padding: 3rem 1rem; border-radius: 18px; background: var(--ap-bg); text-align: center; color: var(--ap-muted); font-size: 15px; display: grid; gap: 0.5rem; justify-items: center; }

/* Поиск по реестру */
.pj-search { position: relative; }
.pj-search svg { position: absolute; left: 1rem; top: 50%; transform: translateY(-50%); width: 18px; height: 18px; color: #86868b; pointer-events: none; }
.pj-search .ap-input { padding-left: 2.75rem; border-radius: 999px; }
.pj-moreline { margin-top: 1.5rem; }

/* Карта — скруглённый кадр */
.pj-map { width: 100%; height: clamp(22rem, 68vh, 44rem); }
.pj-map--wait { display: flex; align-items: center; justify-content: center; color: var(--ap-muted); font-size: 14px; }
@media (max-width: 767px) {
  .pj-map { height: clamp(20rem, 62vh, 30rem); }
}
.pj-legend { display: flex; flex-wrap: wrap; gap: 0.5rem 1.5rem; margin-top: 1.25rem; font-size: 13px; color: var(--ap-muted); }
.pj-legend > span { display: inline-flex; align-items: center; gap: 0.5rem; }
</style>
