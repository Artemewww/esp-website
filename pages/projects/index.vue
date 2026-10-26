<template>
  <div>
    <!-- Отдельная шапка-баннер «Реализованные проекты» убрана: над слайдером
         она дублировала его. Заголовок страницы остаётся для поиска и
         экранных читалок. -->
    <h1 class="sr-only">Реализованные проекты ESP</h1>

    <!-- Флагманы: объекты со съёмкой идут первыми и крупно. -->
    <FlagshipSlider v-if="flagshipProjects.length" :items="flagshipProjects" />

    <!-- Цифры -->
    <section class="py-10 md:py-12 bg-white border-b border-esp-gray">
      <div class="container-custom">
        <div class="grid grid-cols-3 gap-4 md:gap-8 text-center">
          <div v-for="s in stats" :key="s.label">
            <div class="text-3xl md:text-5xl font-rounded font-bold text-esp-blue mb-2 tabular-nums">{{ s.value }}</div>
            <p class="text-esp-black/60 text-xs md:text-sm leading-snug">{{ s.label }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Объекты: ключевые и локальные -->
    <section id="objects" class="section-padding bg-esp-gray" style="scroll-margin-top: 90px;">
      <div class="container-custom">
        <span id="cases" class="pj-anchor"></span>
        <span id="registry" class="pj-anchor"></span>

        <div class="flex flex-col md:flex-row md:items-end md:justify-between gap-5 mb-6">
          <div>
            <span class="inline-block px-4 py-1.5 rounded-full bg-esp-blue/10 text-esp-blue text-sm font-medium mb-3 font-inter">Портфолио</span>
            <h2 class="font-rounded text-3xl md:text-4xl text-esp-black">Объекты</h2>
          </div>

          <!-- Две вкладки: ключевые объекты со своей страницей и реестр
               локальных объектов. -->
          <div class="pj-tabs" role="tablist" aria-label="Тип объектов">
            <button
              v-for="t in tabs"
              :key="t.id"
              type="button"
              role="tab"
              class="pj-tab"
              :class="{ 'is-active': tab === t.id }"
              :aria-selected="tab === t.id"
              @click="tab = t.id"
            >{{ t.label }}</button>
          </div>
        </div>

        <p class="text-esp-black/65 text-sm md:text-base max-w-3xl mb-6">
          {{ tab === 'key' ? 'Объекты, по которым есть съёмка и подробное описание: город, предприятие, технология и производительность.' : 'Реестр объектов ESP по Беларуси: заказчик, построенное сооружение, производительность и место.' }}
        </p>

        <!-- Категории — общие для обеих вкладок -->
        <div class="flex items-center gap-2 mb-6">
          <div class="pj-chiprow">
            <button
              v-for="c in categories"
              :key="c"
              type="button"
              class="pj-chip"
              :class="{ 'is-active': activeCategory === c }"
              @click="activeCategory = c"
            >
              <span v-if="c !== 'Все'" class="pj-dot" :style="dotStyle(c)"></span>{{ c }}
            </button>
          </div>
          <a href="#map" class="pj-chip pj-chip--ghost shrink-0">На карте</a>
        </div>

        <!-- ===== Ключевые ===== -->
        <div v-if="tab === 'key'">
          <div class="flex justify-end mb-4">
            <div class="pj-view" role="group" aria-label="Вид списка">
              <button type="button" :class="{ 'is-active': keyView === 'list' }" @click="keyView = 'list'">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M4 6h16M4 12h16M4 18h16"/></svg>
                Список
              </button>
              <button type="button" :class="{ 'is-active': keyView === 'cards' }" @click="keyView = 'cards'">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="4" y="4" width="7" height="7"/><rect x="13" y="4" width="7" height="7"/><rect x="4" y="13" width="7" height="7"/><rect x="13" y="13" width="7" height="7"/></svg>
                Карточки
              </button>
            </div>
          </div>

          <!-- Таблица-список: на телефоне строки складываются в карточку. -->
          <div v-if="keyView === 'list'" class="pj-list bg-white">
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
              <span class="pj-more">Подробнее →</span>
            </NuxtLink>
          </div>

          <!-- Карточки -->
          <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            <NuxtLink
              v-for="p in keyProjects"
              :key="p.slug"
              :to="`/projects/${p.slug}`"
              class="pj-card group"
            >
              <div class="h-52 relative overflow-hidden bg-esp-black">
                <img
                  v-if="p.poster || (p.gallery && p.gallery[0])"
                  :src="p.poster || p.gallery[0]"
                  :alt="p.name"
                  class="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                  loading="lazy"
                  decoding="async"
                />
              </div>
              <div class="p-6 flex flex-col flex-1">
                <h3 class="font-rounded text-lg leading-snug text-esp-black">{{ p.name }}</h3>
                <p class="text-esp-black/55 text-sm mt-1 font-inter">{{ p.location }}</p>

                <dl class="grid grid-cols-2 gap-4 mt-5">
                  <div>
                    <dt class="pj-label">Год</dt>
                    <dd class="text-esp-black font-medium tabular-nums">{{ p.year || '—' }}</dd>
                  </div>
                  <div>
                    <dt class="pj-label">Производительность</dt>
                    <dd class="text-esp-black font-medium tabular-nums">{{ p.capacity || '—' }}</dd>
                  </div>
                </dl>

                <div class="mt-auto pt-5">
                  <div class="flex items-center justify-between gap-3 border-t border-esp-gray pt-4">
                    <span class="flex items-center gap-2 text-xs text-esp-black/70 font-inter min-w-0">
                      <span class="pj-dot shrink-0" :style="dotStyle(p.category)"></span>
                      <span class="truncate">{{ p.category }}</span>
                    </span>
                    <span class="text-esp-blue text-sm font-medium whitespace-nowrap">Подробнее →</span>
                  </div>
                </div>
              </div>
            </NuxtLink>
          </div>

          <div v-if="!keyProjects.length" class="text-center py-16 bg-white">
            <p class="text-esp-black/55">В этой категории пока нет ключевых объектов.</p>
            <button type="button" class="mt-3 text-esp-blue font-medium" @click="activeCategory = 'Все'">Показать все</button>
          </div>
        </div>

        <!-- ===== Локальные ===== -->
        <div v-else>
          <div class="relative mb-4">
            <svg class="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-esp-black/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
            </svg>
            <input
              v-model="regSearch"
              type="search"
              placeholder="Поиск по заказчику, объекту или населённому пункту"
              class="w-full pl-12 pr-4 py-3 bg-white border border-esp-gray hover:border-esp-blue/40 focus:border-esp-blue focus:ring-2 focus:ring-esp-blue/20 outline-none transition font-inter text-esp-black"
            />
          </div>

          <div class="pj-list pj-list--reg bg-white" :class="{ 'pj-list--noyear': !regHasYear }">
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
                <span class="flex items-center gap-1.5 mt-1 text-xs text-esp-black/55">
                  <span class="pj-dot" :style="dotStyle(o.category)"></span>{{ o.category }}
                </span>
              </span>
              <span class="pj-cell tabular-nums" data-label="Производительность">{{ o.capacity || '—' }}</span>
              <span class="pj-cell pj-year tabular-nums" data-label="Год">{{ o.year || '—' }}</span>
              <span class="pj-cell" data-label="Локация">{{ o.location }}<span v-if="o.region" class="block text-esp-black/45 text-xs">{{ o.region }}</span></span>
            </div>
          </div>

          <div v-if="!filteredRegistry.length" class="text-center py-12 bg-white text-esp-black/55">Ничего не найдено. Измените запрос или категорию.</div>

          <div v-if="visibleCount < filteredRegistry.length" class="text-center mt-6">
            <button type="button" class="px-8 py-3 border-2 border-esp-blue text-esp-blue font-medium hover:bg-esp-blue hover:text-white transition" @click="visibleCount += 40">
              Показать ещё
            </button>
          </div>
        </div>
      </div>
    </section>

    <!-- Карта -->
    <section id="map" class="section-padding bg-white" style="scroll-margin-top: 90px;">
      <div class="container-custom">
        <div class="text-center mb-10">
          <span class="inline-block px-4 py-1.5 rounded-full bg-esp-green/10 text-esp-green text-sm font-medium mb-4 font-inter">География</span>
          <h2 class="font-rounded text-3xl md:text-4xl mb-4 text-esp-black">Объекты ESP на карте Беларуси</h2>
          <p class="text-base md:text-lg text-esp-black/70 max-w-2xl mx-auto">
            Крупные точки — ключевые объекты: по клику откроется их страница. Фильтр категорий выше действует и на карту.
          </p>
        </div>

        <!-- Карта во всю ширину экрана: блок вырывается из контейнера. -->
        <div class="pj-mapwrap relative bg-esp-gray mb-6 overflow-hidden">
          <ClientOnly>
            <ProjectsMap :points="mapPoints" class="pj-map w-full" />
            <template #fallback>
              <div class="pj-map w-full flex items-center justify-center text-esp-black/40 text-sm">Загрузка карты…</div>
            </template>
          </ClientOnly>
        </div>

        <div class="flex flex-wrap gap-x-6 gap-y-2 justify-center text-sm text-esp-black/70">
          <span v-for="c in projectCategories" :key="c" class="flex items-center gap-2">
            <span class="pj-dot pj-dot--lg" :style="dotStyle(c)"></span>{{ c }}
          </span>
        </div>
      </div>
    </section>

    <!-- CTA: спокойно, без должностей -->
    <section class="section-padding text-white text-center bg-esp-blue">
      <div class="container-custom max-w-3xl">
        <h2 class="font-rounded text-3xl md:text-4xl mb-5">Обсудим ваш объект</h2>
        <p class="text-base md:text-lg mb-9 text-white/85 max-w-2xl mx-auto">
          Расскажите о задаче — инженеры ESP изучат исходные данные и предложат решение под условия вашего объекта.
        </p>
        <div class="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4">
          <NuxtLink to="/contacts#contact-form" class="bg-white text-esp-blue px-8 py-4 font-medium hover:bg-esp-gray transition">
            Оставить заявку
          </NuxtLink>
          <a :href="`tel:${PHONE_TEL}`" class="border-2 border-white text-white px-8 py-4 font-medium hover:bg-white hover:text-esp-blue transition tabular-nums">
            {{ PHONE }}
          </a>
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
const keyView = ref(route.query.view === 'cards' ? 'cards' : 'list')
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
.pj-anchor { display: block; position: relative; top: -90px; visibility: hidden; }

/* Вкладки «Ключевые / Локальные» — сегментный переключатель */
.pj-tabs {
  display: inline-flex;
  padding: 4px;
  background: #fff;
  border: 1px solid rgba(26, 26, 26, 0.1);
  border-radius: 9999px;
  align-self: flex-start;
}
.pj-tab {
  padding: 0.6rem 1.4rem;
  border-radius: 9999px;
  font-size: 0.95rem;
  font-weight: 500;
  color: #1a1a1a;
  transition: background-color 0.2s ease, color 0.2s ease;
}
.pj-tab:hover { background: #ededed; }
.pj-tab.is-active { background: #002366; color: #fff; }

/* Категории: один ряд с горизонтальной прокруткой */
.pj-chiprow {
  display: flex;
  gap: 0.4rem;
  overflow-x: auto;
  scrollbar-width: none;
  -webkit-overflow-scrolling: touch;
  min-width: 0;
}
.pj-chiprow::-webkit-scrollbar { display: none; }
.pj-chip {
  flex: 0 0 auto;
  display: inline-flex;
  align-items: center;
  gap: 0.45rem;
  padding: 0.45rem 0.9rem;
  border-radius: 9999px;
  font-size: 0.8125rem;
  font-weight: 500;
  line-height: 1.2;
  white-space: nowrap;
  background: #fff;
  color: #1a1a1a;
  transition: background-color 0.2s ease, color 0.2s ease;
}
.pj-chip:hover { background: rgba(26, 26, 26, 0.08); }
.pj-chip.is-active { background: #1a1a1a; color: #fff; }
.pj-chip--ghost { background: transparent; border: 1px solid rgba(26, 26, 26, 0.2); }

.pj-dot { display: inline-block; flex-shrink: 0; width: 10px; height: 10px; border-radius: 50%; }
.pj-dot--lg { width: 12px; height: 12px; }

/* Переключатель вида */
.pj-view { display: inline-flex; border: 1px solid rgba(26, 26, 26, 0.12); background: #fff; }
.pj-view button {
  display: inline-flex; align-items: center; gap: 0.4rem;
  padding: 0.45rem 0.85rem; font-size: 0.8125rem; color: rgba(26, 26, 26, 0.6);
}
.pj-view button svg { width: 15px; height: 15px; }
.pj-view button.is-active { background: #1a1a1a; color: #fff; }

/* Таблица-список */
.pj-list { border: 1px solid rgba(26, 26, 26, 0.08); }
.pj-row {
  display: grid;
  grid-template-columns: minmax(0, 2.2fr) minmax(0, 1.6fr) minmax(0, 1.2fr) 4rem minmax(0, 1.1fr) 7rem;
  gap: 1rem;
  align-items: start;
  padding: 0.95rem 1.25rem;
  border-top: 1px solid #ededed;
  font-size: 0.875rem;
  color: rgba(26, 26, 26, 0.7);
}
.pj-list--reg .pj-row {
  grid-template-columns: minmax(0, 1.8fr) minmax(0, 2fr) minmax(0, 1fr) 4rem minmax(0, 1.2fr);
}
.pj-list--noyear .pj-row {
  grid-template-columns: minmax(0, 1.8fr) minmax(0, 2.2fr) minmax(0, 1fr) minmax(0, 1.2fr);
}
.pj-list--noyear .pj-year { display: none; }
.pj-row--head {
  border-top: 0;
  background: #1a1a1a;
  color: #fff;
  font-size: 0.75rem;
  font-weight: 500;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  padding-top: 0.8rem;
  padding-bottom: 0.8rem;
}
.pj-row--link { transition: background-color 0.2s ease; }
.pj-row--link:hover { background: rgba(237, 237, 237, 0.6); }
.pj-cell-name { color: #1a1a1a; font-weight: 500; }
.pj-more { color: #002366; font-weight: 500; white-space: nowrap; text-align: right; }
.pj-row--link:hover .pj-cell-name { color: #002366; }

@media (max-width: 1023px) {
  .pj-row--head { display: none; }
  .pj-row,
  .pj-list--reg .pj-row {
    grid-template-columns: 1fr 1fr;
    gap: 0.6rem 1rem;
    padding: 1rem;
  }
  .pj-row:first-of-type { border-top: 0; }
  .pj-list--noyear .pj-row { grid-template-columns: 1fr 1fr; }
  .pj-cell-name,
  .pj-cell-wide { grid-column: 1 / -1; }
  .pj-cell-name { font-size: 0.95rem; }
  .pj-cell::before {
    content: attr(data-label);
    display: block;
    font-size: 0.75rem;
    color: rgba(26, 26, 26, 0.45);
    margin-bottom: 0.1rem;
  }
  .pj-more { grid-column: 1 / -1; text-align: left; }
}

/* Карточка */
.pj-card {
  display: flex;
  flex-direction: column;
  background: #fff;
  overflow: hidden;
  border: 1px solid rgba(26, 26, 26, 0.06);
  transition: box-shadow 0.3s ease, transform 0.3s ease;
}
.pj-card:hover { box-shadow: 0 18px 40px -24px rgba(0, 35, 102, 0.45); transform: translateY(-2px); }
.pj-label { font-size: 0.75rem; color: rgba(26, 26, 26, 0.5); margin-bottom: 0.15rem; }

/* Карта во всю ширину экрана */
.pj-mapwrap { width: 100vw; margin-left: 50%; transform: translateX(-50%); }
.pj-map { height: clamp(22rem, 68vh, 44rem); }
@media (max-width: 767px) {
  .pj-map { height: clamp(20rem, 62vh, 30rem); }
}
</style>
