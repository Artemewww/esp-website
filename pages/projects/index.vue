<template>
  <div id="top" ref="root" class="pj">
    <!-- Первый экран: тот же слайдер, что на главной, — 11 ключевых объектов
         от самого крупного к самому малому, акцент на производительности -->
    <!-- Слайдер ключевых объектов (пагинация «03 / 11» — в самом слайдере) -->
    <HomeObjectsSlider :items="objectSlides" label="Ключевые объекты ESP" :h1="false" />

    <AppleSubBar
      title="Объекты"
      :links="[{ href: '#objects', label: 'Портфолио' }]"
      :cta="{ to: '/contacts#contact-form', label: 'Обсудить проект' }"
    />

    <!-- Цифры: сразу после съёмки -->
    <section class="pj-numbers">
      <HomeStatTiles />
    </section>

    <!-- Объекты: ключевые и локальные -->
    <section id="objects" class="pj-scroll pj-objects">
      <span id="cases" class="pj-anchor"></span>
      <span id="registry" class="pj-anchor"></span>
      <span id="map" class="pj-anchor"></span>

      <div class="ax-wrap ax-head--center pj-head dj-reveal">
        <h1 class="ax-h2">Реализованные объекты ESP</h1>

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
      </div>

      <!-- Категории — общие для обеих вкладок -->
      <div class="pj-chips" aria-label="Категории">
        <button
          type="button"
          class="pj-chip"
          :class="{ 'is-on': activeNiche === 'all' }"
          :aria-pressed="activeNiche === 'all'"
          @click="activeNiche = 'all'"
        >Все</button>
        <button
          v-for="n in projectNiches"
          :key="n.slug"
          type="button"
          class="pj-chip"
          :class="{ 'is-on': activeNiche === n.slug }"
          :style="{ '--nc': n.color }"
          :aria-pressed="activeNiche === n.slug"
          @click="activeNiche = n.slug"
        >
          <svg class="pj-ico" viewBox="0 0 24 24" aria-hidden="true"><path :d="n.icon" /></svg>{{ n.title }}
        </button>
      </div>

      <!-- Переключатель вида: карточки / список / карта — общий для вкладок -->
      <div class="dj-wrap dj-wrap--wide pj-viewbar pj-block">
        <span class="pj-count tabular-nums" aria-live="polite">{{ countLabel }}</span>
        <div class="pj-view" role="group" aria-label="Вид списка">
          <button v-if="tab === 'key'" type="button" :class="{ 'is-on': !mapMode && keyView === 'cards' }" :aria-pressed="!mapMode && keyView === 'cards'" @click="setView('cards')">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"><rect x="4" y="4" width="7" height="7" rx="1.5"/><rect x="13" y="4" width="7" height="7" rx="1.5"/><rect x="4" y="13" width="7" height="7" rx="1.5"/><rect x="13" y="13" width="7" height="7" rx="1.5"/></svg>
            Карточки
          </button>
          <button type="button" :class="{ 'is-on': !mapMode && (tab === 'local' || keyView === 'list') }" :aria-pressed="!mapMode && (tab === 'local' || keyView === 'list')" @click="setView('list')">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><path d="M4 6h16M4 12h16M4 18h16"/></svg>
            Список
          </button>
          <button type="button" :class="{ 'is-on': mapMode }" :aria-pressed="mapMode" @click="setView('map')">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 21s-6.5-5.6-6.5-11a6.5 6.5 0 0 1 13 0c0 5.4-6.5 11-6.5 11z"/><circle cx="12" cy="10" r="2.4"/></svg>
            На карте
          </button>
        </div>
      </div>

      <!-- ===== Ключевые ===== -->
      <div v-if="tab === 'key' && !mapMode">

        <!-- Карточки: кадр во всю плитку, категория, название, место и мощность -->
        <div v-if="keyView === 'cards'" class="pj-grid">
          <NuxtLink
            v-for="p in keyProjects"
            :key="p.slug"
            :to="`/projects/${p.slug}`"
            class="pj-card"
          >
            <span class="pj-card__media">
              <video v-if="p.video && !reduceMotion" v-lazy-video :data-src="p.video" :poster="p.poster || p.gallery?.[0]" muted loop playsinline preload="none" disablepictureinpicture />
              <img
                v-else-if="p.poster || (p.gallery && p.gallery[0])"
                :srcset="srcset(p.poster || p.gallery[0])" sizes="(max-width: 734px) 100vw, 33vw" :src="p.poster || p.gallery[0]"
                :alt="p.name"
                loading="lazy"
                decoding="async"
              />
            </span>
            <span class="pj-card__copy">
              <span class="pj-card__cat">{{ nicheInfo(p).title }}</span>
              <b class="pj-card__title">{{ p.name }}</b>
              <span class="pj-card__meta">{{ [p.location, p.capacity, p.year].filter(Boolean).join(' · ') }}</span>
              <span class="pj-card__more">Подробнее ›</span>
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
              <span class="ax-link pj-more">Подробнее ›</span>
            </NuxtLink>
          </div>
        </div>

        <div v-if="!keyProjects.length" class="dj-wrap">
          <div class="pj-empty">
            <p>В этой категории пока нет ключевых объектов.</p>
            <button type="button" class="ax-link" @click="activeNiche = 'all'">Показать все</button>
          </div>
        </div>
      </div>

      <!-- ===== Локальные ===== -->
      <div v-if="tab === 'local'" class="dj-wrap dj-wrap--wide">
        <div class="pj-search">
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
          </svg>
          <input
            v-model="regSearch"
            type="search"
            placeholder="Поиск по заказчику, объекту или населённому пункту"
            class="pj-input"
            aria-label="Поиск по реестру"
          />
        </div>

        <template v-if="!mapMode">
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
                <svg class="pj-ico pj-ico--sm" :style="{ color: nicheInfo(o).color }" viewBox="0 0 24 24" aria-hidden="true"><path :d="nicheInfo(o).icon" /></svg>{{ nicheInfo(o).title }}
              </span>
            </span>
            <span class="pj-cell tabular-nums" data-label="Производительность">{{ o.capacity || '—' }}</span>
            <span class="pj-cell pj-year tabular-nums" data-label="Год">{{ o.year || '—' }}</span>
            <span class="pj-cell" data-label="Локация">{{ o.location }}<span v-if="o.region" class="pj-region">{{ o.region }}</span></span>
          </div>
        </div>

        <div v-if="!filteredRegistry.length" class="pj-empty">Ничего не найдено. Измените запрос или направление.</div>

        <div v-if="visibleCount < filteredRegistry.length" class="ax-actions ax-actions--center pj-moreline">
          <button type="button" class="pj-morebtn" @click="visibleCount += 40">
            Показать ещё
          </button>
        </div>
        </template>
      </div>

      <!-- ===== На карте: та же выборка, что в списке (вкладка, отрасль, поиск) ===== -->
      <div v-if="mapMode" class="pj-mapwrap">
        <ClientOnly>
          <ProjectsMap :points="mapPoints" class="pj-map">
            <template #overlay>
              <div class="pj-ovp" role="region" aria-label="Фильтры карты">
                <div class="pj-ovp__row">
                  <div class="pj-seg pj-seg--sm" role="tablist" aria-label="Тип объектов">
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
                  <span class="pj-ovp__count tabular-nums">{{ countLabel }}</span>
                </div>
                <div class="pj-chips pj-chips--ov" aria-label="Отрасли">
                  <button type="button" class="pj-chip" :class="{ 'is-on': activeNiche === 'all' }" :aria-pressed="activeNiche === 'all'" @click="activeNiche = 'all'">Все</button>
                  <button
                    v-for="n in projectNiches"
                    :key="n.slug"
                    type="button"
                    class="pj-chip"
                    :class="{ 'is-on': activeNiche === n.slug }"
                    :style="{ '--nc': n.color }"
                    :aria-pressed="activeNiche === n.slug"
                    @click="activeNiche = n.slug"
                  >
                    <svg class="pj-ico" viewBox="0 0 24 24" aria-hidden="true"><path :d="n.icon" /></svg>{{ n.title }}
                  </button>
                </div>
                <div class="pj-ovp__legend" aria-label="Обозначения">
                  <span v-for="n in projectNiches" :key="n.slug" class="pj-ovp__li">
                    <svg viewBox="0 0 24 32" width="12" height="16" aria-hidden="true"><path :d="DROP" :fill="n.color" stroke="#fff" stroke-width="1.3" /></svg>{{ n.title }}
                  </span>
                  <span class="pj-ovp__li pj-ovp__li--size">
                    <svg viewBox="0 0 24 32" width="8" height="11" aria-hidden="true"><path :d="DROP" /></svg>
                    <svg viewBox="0 0 24 32" width="15" height="20" aria-hidden="true"><path :d="DROP" /></svg>
                    размер — производительность
                  </span>
                  <span class="pj-ovp__li">
                    <svg viewBox="0 0 24 32" width="18" height="24" aria-hidden="true"><path :d="DROP" fill="#002366" stroke="#fff" stroke-width="1.6" /><g transform="translate(12 20.6) scale(0.105) translate(-60 -30.5)"><path v-for="(d, i) in LOGO_PATHS" :key="i" :d="d" fill="#fff" /></g></svg>
                    крупная капля со знаком — ключевой объект
                  </span>
                </div>
              </div>
            </template>
          </ProjectsMap>
          <template #fallback>
            <div class="pj-map pj-map--wait">Загрузка карты…</div>
          </template>
        </ClientOnly>
      </div>

      <div v-if="mapMode" class="pj-legend">
        <span v-for="n in projectNiches" :key="n.slug" class="pj-legend__item">
          <span class="pj-legend__ico" :style="{ background: n.color }">
            <svg class="pj-ico" viewBox="0 0 24 24" aria-hidden="true"><path :d="n.icon" /></svg>
          </span>{{ n.title }}
        </span>
        <span class="pj-legend__item pj-legend__size">
          <svg viewBox="0 0 24 32" width="9" height="12" aria-hidden="true"><path :d="DROP" /></svg>
          <svg viewBox="0 0 24 32" width="15" height="20" aria-hidden="true"><path :d="DROP" /></svg>
          <svg viewBox="0 0 24 32" width="24" height="32" aria-hidden="true"><path :d="DROP" /></svg>
          меньше — больше м³/сут; капли со знаком ESP — ключевые объекты
        </span>
      </div>
    </section>

    <AppleCta
      title="Обсудим ваш объект"
      lede="Расскажите о задаче — инженеры ESP изучат исходные данные и предложат решение под условия вашего объекта."
    />
  </div>
</template>

<script setup>
import { srcset } from '~/composables/useSrcset'
import { slidesFromProjects } from '~/composables/useObjectSlides'
import { ref, computed, watch, onMounted, onBeforeUnmount, nextTick } from 'vue'
import { useProjects, projectNiches, nicheInfo, nicheOf, capacityNum } from '~/composables/useProjects'
import { useRegistry } from '~/composables/useProjectRegistry'
import { equipmentList } from '~/composables/useEquipment'
import { projectGeo } from '~/composables/useProjectGeo'
import { useReveal } from '~/composables/useReveal'
import { LOGO_PATHS } from '~/components/layout/logoPaths.js'

const ogOrigin = useRuntimeConfig().public.ogOrigin

useHead({
  title: 'Проекты ESP | Очистные сооружения под ключ: объекты и результаты',
  meta: [
    { name: 'description', content: 'Реализованные объекты ESP: 2000+ очистных сооружений в Беларуси. Коммунальное хозяйство, мясопереработка, молочные предприятия, локальные очистные сооружения.' },
    { property: 'og:title', content: 'Проекты ESP | Очистные сооружения под ключ' },
    { property: 'og:description', content: '2000+ реализованных объектов в Беларуси.' },
    { property: 'og:image', content: `${ogOrigin}/images/og-esp.png` }
  ],
  link: [{ rel: 'canonical', href: 'https://ecoservisproekt.by/projects' }]
})

const root = ref(null)
useReveal(root)

// Контур фирменной капли для легенды (тот же, что у меток карты)
const DROP = 'M12 1.5C12 1.5 3 12.6 3 20.2A9 9 0 0 0 21 20.2C21 12.6 12 1.5 12 1.5Z'

const stats = [
  { value: '2000+', label: 'Реализованных объектов за 28 лет' },
  { value: '30 000', label: 'Элементов под контролем' },
  { value: '0', label: 'Аварийных сбоев' }
]

const statBento = stats.map((st, i) => ({ size: 'sm', value: st.value, label: st.label, tone: i === 0 ? 'ink' : '' }))

const { projects } = useProjects()
const { registry } = useRegistry()

// В «Ключевые» идут объекты с галочкой isKey. Поле появилось недавно,
// поэтому запись без него тоже считаем ключевой.
const keyAll = computed(() => projects.value.filter(p => p.isKey !== false))

// Первый экран — съёмка флагманов от крупного к малому
const objectSlides = computed(() => slidesFromProjects(keyAll.value))

// Ролик в карточке оживает только при наведении мышью

// ===== Вкладки и категории =====
const tabs = [
  { id: 'key', label: 'Ключевые' },
  { id: 'local', label: 'Локальные' }
]
// ?tab=local открывает реестр сразу (и при серверной отрисовке).
const route = useRoute()
const tab = ref(route.query.tab === 'local' ? 'local' : 'key')
const keyView = ref(route.query.view === 'list' ? 'list' : 'cards')
// Третий вид — «На карте»: карта встаёт на место списка, фильтры общие.
const mapMode = ref(route.query.view === 'map')
const setView = (v) => {
  if (v === 'map') { mapMode.value = true; return }
  mapMode.value = false
  if (tab.value === 'key') keyView.value = v
}
// Фильтр — четыре направления «Решений для бизнеса» (useSiteNav.solutions)
const activeNiche = ref('all')
const inCategory = (o) => activeNiche.value === 'all' || nicheOf(o) === activeNiche.value

// От крупного объекта к малому (м³/сут); без данных — в конце, порядок прежний
const byCapacity = (list) => list
  .map((o, i) => ({ o, i, n: capacityNum(o.capacity) }))
  .sort((a, b) => (b.n - a.n) || (a.i - b.i))
  .map(x => x.o)

const keyProjects = computed(() => byCapacity(keyAll.value.filter(inCategory)))

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
  let r = byCapacity(registry.value.filter(inCategory))
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
watch([regSearch, activeNiche, tab], () => { visibleCount.value = 40 })

// ===== Карта =====
// Вкладка «Ключевые» — только ключевые объекты; «Локальные» — реестр с учётом
// поиска и ключевые поверх него. Координаты ключевого объекта: lat/lng из
// админки, если заданы, иначе привязка из useProjectGeo.
const mapPoints = computed(() => {
  const reg = (tab.value === 'local' ? filteredRegistry.value : [])
    .filter(o => Number.isFinite(+o.lat) && Number.isFinite(+o.lng) && o.lat !== '' && o.lng !== '')
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

// Подсчёт: сколько объектов в выборке (в режиме карты — сколько меток)
const plural = (n, f) => f[(n % 10 === 1 && n % 100 !== 11) ? 0 : (n % 10 >= 2 && n % 10 <= 4 && (n % 100 < 10 || n % 100 >= 20)) ? 1 : 2]
const countLabel = computed(() => {
  const n = mapMode.value ? mapPoints.value.length
    : tab.value === 'key' ? keyProjects.value.length : filteredRegistry.value.length
  return `${n} ${plural(n, ['объект', 'объекта', 'объектов'])}${mapMode.value ? ' на карте' : ''}`
})

// Старые ссылки меню: /projects#cases — ключевые, /projects#registry — реестр.
onMounted(() => {
  if (location.hash === '#registry') tab.value = 'local'
  // Старый пункт меню «Карта проектов» (/projects#map) открывает вид «На карте»
  if (location.hash === '#map') mapMode.value = true
})

// Видео карточек играет сразу, пока карточка на экране; вне экрана — пауза (экономим батарею и трафик)
const reduceMotion = ref(false)
let cardIo = null
const observeCards = () => {
  if (!cardIo) return
  cardIo.disconnect()
  document.querySelectorAll('.pj-grid .pj-card').forEach((el) => cardIo.observe(el))
}
onMounted(() => {
  reduceMotion.value = matchMedia('(prefers-reduced-motion: reduce)').matches
  if (reduceMotion.value || !('IntersectionObserver' in window)) return
  cardIo = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      const v = e.target.querySelector('video')
      if (!v) return
      if (e.isIntersecting) { v.muted = true; v.play().catch(() => {}) } else v.pause()
    })
  }, { rootMargin: '120px 0px', threshold: 0 })
  nextTick(observeCards)
})
watch([keyView, keyProjects], () => nextTick(observeCards))
onBeforeUnmount(() => cardIo && cardIo.disconnect())
</script>

<style scoped src="../../components/apple/apple.css"></style>
<style scoped>
.pj { background: #fff; }
.pj-scroll { scroll-margin-top: 108px; }
.pj-anchor { display: block; position: relative; top: -108px; visibility: hidden; }
.pj-head { padding: clamp(64px, 8vw, 120px) 0 clamp(28px, 3vw, 40px); text-align: center; }
.pj-head .ax-lede { margin-left: auto; margin-right: auto; }

/* Цифры */
.pj-numbers { padding: clamp(48px, 6vw, 80px) 0 0; }


.pj-numbers :deep(.bn-tile) { background: #EDEDED; min-height: 240px; }
.pj-numbers :deep(.bn--ink) { background: #002366 !important; }

/* Сегмент-капсула вкладок, как переключатели apple.com */
.pj-seg { display: inline-flex; margin-top: 28px; padding: 4px; border-radius: var(--r-pill); background: #EDEDED; }
.pj-seg button { height: 36px; padding: 0 24px; border-radius: var(--r-pill); font-size: 14px; letter-spacing: -0.016em; color: #1A1A1A; transition: background-color 0.25s ease, box-shadow 0.25s ease; }
.pj-seg button.is-on { background: #fff; box-shadow: var(--sh-1); font-weight: 600; }

/* Чипы категорий */
.pj-chips { display: flex; flex-wrap: wrap; justify-content: center; gap: 8px; padding: 0 16px; }
.pj-chip { display: inline-flex; align-items: center; gap: 8px; height: 36px; padding: 0 16px; border-radius: var(--r-pill); font-size: 14px; letter-spacing: -0.016em; color: #1A1A1A; box-shadow: inset 0 0 0 1px #D6D6D6; background: #fff; transition: background-color 0.25s ease, color 0.25s ease, box-shadow 0.25s ease; }
.pj-chip:hover { box-shadow: inset 0 0 0 1px #8A8A8A; }
.pj-chip.is-on { background: #1A1A1A; color: #fff; box-shadow: none; }
.pj-chip[style] .pj-ico { color: var(--nc); }
.pj-chip.is-on[style] { background: var(--nc); }
.pj-chip.is-on .pj-ico { color: #fff; }
.pj-ico { width: 18px; height: 18px; flex-shrink: 0; fill: none; stroke: currentColor; stroke-width: 1.8; stroke-linecap: round; stroke-linejoin: round; }
.pj-ico--sm { width: 15px; height: 15px; }


.pj-block { margin-top: clamp(28px, 3vw, 40px); }

/* Переключатель вида */
.pj-viewbar { display: flex; align-items: center; justify-content: space-between; gap: 12px; margin-bottom: 16px; }
.pj-count { font-size: 14px; letter-spacing: -0.016em; color: #5E5E5E; }
.pj-view { display: inline-flex; padding: 3px; border-radius: var(--r-pill); background: #EDEDED; }
.pj-view button { display: inline-flex; align-items: center; gap: 6px; padding: 6px 14px; border-radius: var(--r-pill); font-size: 12px; letter-spacing: -0.01em; color: #1A1A1A; transition: background-color 0.2s ease; }
.pj-view button svg { width: 15px; height: 15px; }
.pj-view button.is-on { background: #fff; box-shadow: var(--sh-1); }

/* Карточки объектов: скругление 28px, подпись сверху слева, как в «Главном» apple.com */
.pj-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 20px; width: min(1440px, calc(100% - 40px)); margin: 0 auto; }
.pj-card { position: relative; display: block; aspect-ratio: 16 / 11; overflow: hidden; border-radius: var(--r-lg); background: #000; color: #EDEDED; isolation: isolate; }
.pj-card:first-child { grid-column: 1 / -1; aspect-ratio: 21 / 9; }
.pj-card__media { position: absolute; inset: 0; z-index: -1; }
.pj-card__media img, .pj-card__media video { width: 100%; height: 100%; object-fit: cover; transition: transform 1.2s var(--dj-ease); }
.pj-card:hover .pj-card__media img { transform: scale(1.03); }
.pj-card::after { content: ''; position: absolute; inset: 0; z-index: -1; background: var(--scrim-tb); pointer-events: none; }
.pj-card__copy { position: absolute; inset: 0; display: flex; flex-direction: column; align-items: flex-start; gap: 6px; padding: clamp(24px, 3vw, 44px); }
.pj-card__cat { font-size: 14px; font-weight: 600; letter-spacing: -0.016em; color: rgba(237, 237, 237, 0.8); }
.pj-card__title { max-width: 22ch; font-size: clamp(24px, 2.4vw, 32px); line-height: 1.125; font-weight: 600; letter-spacing: 0.004em; }
.pj-card:first-child .pj-card__title { font-size: clamp(32px, 4vw, 56px); line-height: 1.07; letter-spacing: -0.005em; }
.pj-card__meta { font-size: 17px; line-height: 1.47; letter-spacing: -0.022em; color: rgba(237, 237, 237, 0.86); font-variant-numeric: tabular-nums; }
.pj-card__more { margin-top: auto; font-size: 17px; letter-spacing: -0.022em; color: #FFFFFF; }
.pj-card__more::after { content: ' ›'; }

/* Таблица-список */
.pj-list { border-top: 1px solid #1A1A1A; }
.pj-row { display: grid; grid-template-columns: minmax(0, 2.2fr) minmax(0, 1.6fr) minmax(0, 1.2fr) 4rem minmax(0, 1.1fr) 7rem; gap: 16px; align-items: start; padding: 20px 8px; border-bottom: 1px solid #D6D6D6; font-size: 14px; line-height: 1.43; letter-spacing: -0.016em; color: #5E5E5E; }
.pj-list--reg .pj-row { grid-template-columns: minmax(0, 1.8fr) minmax(0, 2fr) minmax(0, 1fr) 4rem minmax(0, 1.2fr); }
.pj-list--noyear .pj-row { grid-template-columns: minmax(0, 1.8fr) minmax(0, 2.2fr) minmax(0, 1fr) minmax(0, 1.2fr); }
.pj-list--noyear .pj-year { display: none; }
.pj-row--head { font-size: 12px; font-weight: 600; color: #1A1A1A; padding-top: 14px; padding-bottom: 14px; }
.pj-row--link { transition: background-color 0.2s ease; }
.pj-row--link:hover { background: #EDEDED; }
.pj-cell-name { font-size: 17px; line-height: 1.29; letter-spacing: -0.022em; color: #1A1A1A; font-weight: 600; }
.pj-more { justify-self: end; font-size: 14px; }
.pj-sub { display: flex; align-items: center; gap: 6px; margin-top: 4px; font-size: 12px; }
.pj-region { display: block; font-size: 12px; opacity: 0.8; }

.pj-empty { margin-top: 16px; padding: 48px 16px; border-radius: var(--r-md); background: #EDEDED; text-align: center; color: #5E5E5E; font-size: 17px; display: grid; gap: 8px; justify-items: center; }

/* Поиск по реестру */
.pj-search { position: relative; margin-bottom: 20px; }
.pj-search svg { position: absolute; left: 18px; top: 50%; transform: translateY(-50%); width: 18px; height: 18px; color: #5E5E5E; pointer-events: none; }
.pj-input { width: 100%; height: 52px; padding: 0 20px 0 48px; border: 1px solid #D6D6D6; border-radius: var(--r-sm); background: #fff; font: inherit; font-size: 17px; letter-spacing: -0.022em; color: #1A1A1A; outline: none; transition: border-color 0.2s ease, box-shadow 0.2s ease; }
.pj-input:focus { border-color: #002366; box-shadow: var(--focus-ring); }
.pj-moreline { margin-top: 32px; }
.pj-morebtn { min-height: 44px; padding: 0 22px; border-radius: var(--r-pill); font-size: 17px; letter-spacing: -0.022em; color: #002366; box-shadow: inset 0 0 0 1px #002366; transition: background-color 0.2s ease, color 0.2s ease; }
.pj-morebtn:hover { background: #002366; color: #fff; }

/* Карта во всю ширину, со скруглением */
.pj-mapwrap { width: min(1440px, calc(100% - 40px)); margin: 0 auto; overflow: hidden; border-radius: var(--r-lg); background: #EDEDED; }
.pj-map { width: 100%; height: clamp(24rem, 70vh, 52rem); }
.dj-wrap + .pj-mapwrap { margin-top: 0; }

/* Плавающая панель на полноэкранной карте: стекло, как у Apple */
.pj-ovp { display: grid; gap: 10px; padding: 12px; border-radius: 22px; background: rgba(255, 255, 255, 0.72); -webkit-backdrop-filter: saturate(180%) blur(20px); backdrop-filter: saturate(180%) blur(20px); box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12), inset 0 0 0 1px rgba(255, 255, 255, 0.6); font-family: var(--dj-font); }
.pj-ovp__row { display: flex; align-items: center; gap: 14px; padding-right: 168px; min-height: 40px; }
.pj-seg--sm { margin-top: 0; padding: 3px; background: rgba(0, 0, 0, 0.06); }
.pj-seg--sm button { height: 32px; padding: 0 16px; font-size: 13px; }
.pj-ovp__count { font-size: 13px; color: #5E5E5E; white-space: nowrap; }
.pj-chips--ov { justify-content: flex-start; padding: 0; }
.pj-chips--ov .pj-chip { height: 32px; padding: 0 12px; font-size: 13px; background: rgba(255, 255, 255, 0.85); }
.pj-chips--ov .pj-chip.is-on { background: #1A1A1A; }
.pj-chips--ov .pj-chip.is-on[style] { background: var(--nc); }
.pj-ovp__legend { display: flex; flex-wrap: wrap; align-items: center; gap: 6px 18px; padding: 2px 4px 0; font-size: 12px; letter-spacing: -0.01em; color: #3A3A3A; }
.pj-ovp__li { display: inline-flex; align-items: center; gap: 6px; white-space: nowrap; }
.pj-ovp__li svg { flex-shrink: 0; }
.pj-ovp__li--size { gap: 4px; align-items: flex-end; }
.pj-ovp__li--size svg { fill: #8A8A8A; }
.pj-map--wait { display: flex; align-items: center; justify-content: center; color: #5E5E5E; font-size: 14px; }
.pj-legend { display: flex; flex-wrap: wrap; justify-content: center; gap: 16px 40px; width: min(1440px, calc(100% - 40px)); margin: clamp(28px, 3vw, 40px) auto 0; padding: 0 16px; font-size: 14px; letter-spacing: -0.016em; color: #1A1A1A; }
.pj-legend__item { display: inline-flex; align-items: center; gap: 12px; }
.pj-legend__ico { display: grid; place-items: center; width: 32px; height: 32px; border-radius: 50%; color: #fff; }
.pj-legend__ico .pj-ico { width: 17px; height: 17px; }
.pj-legend__size { gap: 6px; align-items: flex-end; color: #5E5E5E; }
.pj-legend__size svg { fill: #8A8A8A; }

@media (max-width: 1023px) {
  .pj-row--head { display: none; }
  .pj-row,
  .pj-list--reg .pj-row,
  .pj-list--noyear .pj-row { grid-template-columns: 1fr 1fr; gap: 10px 16px; padding: 18px 4px; }
  .pj-cell-name, .pj-cell-wide { grid-column: 1 / -1; }
  .pj-cell::before { content: attr(data-label); display: block; font-size: 12px; color: #5E5E5E; opacity: 0.8; margin-bottom: 2px; }
  .pj-more { grid-column: 1 / -1; justify-self: start; }
}
@media (max-width: 767px) {
  .pj-grid { grid-template-columns: 1fr; gap: 12px; width: calc(100% - 24px); }
  .pj-card, .pj-card:first-child { grid-column: auto; aspect-ratio: 4 / 5; border-radius: var(--r-md); }
  .pj-chips { flex-wrap: nowrap; justify-content: flex-start; overflow-x: auto; scrollbar-width: none; }
  .pj-chips::-webkit-scrollbar { display: none; }
  .pj-chip { flex-shrink: 0; }
  .pj-mapwrap { width: calc(100% - 24px); border-radius: var(--r-md); }
  .pj-legend { justify-content: flex-start; gap: 14px 24px; width: calc(100% - 24px); padding: 0 8px; }
  .pj-map { height: clamp(22rem, 70vh, 40rem); }
  .pj-ovp { gap: 8px; padding: 8px; border-radius: 18px; }
  .pj-ovp__row { padding-right: 52px; gap: 8px; }
  .pj-seg--sm button { padding: 0 12px; }
  .pj-chips--ov, .pj-ovp__legend { flex-wrap: nowrap; overflow-x: auto; scrollbar-width: none; margin: 0 -8px; padding-left: 8px; padding-right: 8px; }
  .pj-chips--ov::-webkit-scrollbar, .pj-ovp__legend::-webkit-scrollbar { display: none; }
  .pj-viewbar { flex-wrap: wrap; }
  .pj-view button { padding: 6px 11px; }
  .ax-h2 { overflow-wrap: break-word; hyphens: auto; }
}
@media (prefers-reduced-motion: reduce) {
  .pj-card__media img, .pj-card__media video { transition: none; }
}
</style>
