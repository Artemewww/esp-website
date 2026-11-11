<template>
  <div ref="root" class="nw">

    <!-- Лента в подаче Apple Newsroom: серое поле, белые плитки 1up / 2up / 3up -->
    <section class="nw-feed">
      <div class="nw-wrap">
        <!-- #23: компактная шапка — заголовок мелко, сразу лента -->
        <header class="nw-top">
          <h1 class="nw-h1">Новости ESP</h1>
          <p class="nw-sub">Запуски очистных сооружений, отраслевые семинары и&nbsp;материалы инженеров</p>
        </header>
        <div class="nw-head">
          <h2 class="nw-head__title">{{ year === ALL ? 'Последние новости' : year }}</h2>
          <div class="nw-chips" role="tablist" aria-label="Годы">
            <button
              v-for="y in years"
              :key="y"
              type="button"
              role="tab"
              class="nw-chip"
              :class="{ 'is-on': year === y }"
              :aria-selected="year === y"
              @click="year = y"
            >{{ y }}</button>
          </div>
        </div>

        <!-- Главная новость: плитка-герой -->
        <article v-if="lead" :key="'lead' + lead.date" class="nw-tile nw-tile--hero nw-in" @click="open(lead)">
          <div class="nw-tile__media">
            <img v-if="lead.image" :src="lead.image" :alt="lead.title" class="nw-img" />
            <NewsPlaceholder v-else label="ESP · Хроника" />
          </div>
          <div class="nw-tile__desc">
            <span class="nw-cat">{{ lead.category || 'Новости' }}</span>
            <h3 class="nw-tile__title">
              <button type="button" class="nw-link" @click.stop="open(lead)">{{ lead.title }}</button>
            </h3>
            <p class="nw-excerpt">{{ excerpt(lead) }}</p>
            <time :datetime="lead.date" class="nw-date">{{ lead.dateLabel }}</time>
          </div>
        </article>

        <!-- Лента -->
        <ul v-if="rest.length" class="nw-grid">
          <li
            v-for="(n, i) in rest"
            :key="n.date + n.title"
            class="nw-item"
            :class="i < 2 ? 'nw-item--2up' : 'nw-item--3up'"
          >
            <article
              class="nw-tile nw-in"
              :style="{ animationDelay: `${Math.min(i, 8) * 60}ms` }"
              @click="open(n)"
            >
              <div class="nw-tile__media">
                <img v-if="n.image" :src="n.image" :alt="n.title" loading="lazy" class="nw-img" />
                <NewsPlaceholder v-else label="ESP · Хроника" />
              </div>
              <div class="nw-tile__desc">
                <span class="nw-cat">{{ n.category || 'Новости' }}</span>
                <h3 class="nw-tile__title">
                  <button type="button" class="nw-link" @click.stop="open(n)">{{ n.title }}</button>
                </h3>
                <time :datetime="n.date" class="nw-date">{{ n.dateLabel }}</time>
              </div>
            </article>
          </li>
        </ul>
      </div>
    </section>

    <!-- Чтение новости целиком: колонка статьи Apple Newsroom -->
    <Teleport to="body">
      <div v-if="current" class="nw-modal" role="dialog" aria-modal="true" :aria-label="current.title" @keydown.esc="close">
        <div class="nw-modal__backdrop" @click="close"></div>
        <div ref="panel" class="nw-modal__panel" tabindex="-1">
          <button type="button" class="nw-modal__close" aria-label="Закрыть" @click="close">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
          <div class="nw-modal__head">
            <span class="nw-cat">{{ current.category || 'Новости' }}</span>
            <time :datetime="current.date" class="nw-modal__date">{{ current.dateLabel }}</time>
            <h2 class="nw-modal__title">{{ current.title }}</h2>
          </div>
          <div class="nw-modal__media">
            <img v-if="current.image" :src="current.image" :alt="current.title" class="nw-img" />
            <NewsPlaceholder v-else label="ESP · Хроника" />
          </div>
          <div class="nw-modal__body">
            <p v-for="(para, i) in paragraphs(current)" :key="i" class="nw-modal__p">{{ para }}</p>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup>
import { computed, ref, nextTick, watch, onBeforeUnmount, h } from 'vue'
import BrandPattern from '~/components/ui/BrandPattern.vue'

const { news } = useNews()

// Свежие сверху: заказчик может добавить новость в любое место списка в админке
const sorted = computed(() =>
  [...(news.value || [])].sort((a, b) => String(b.date || '').localeCompare(String(a.date || '')))
)

// Фильтр по годам — только годы, которые есть в ленте
const ALL = 'Все новости'
const year = ref(ALL)
const years = computed(() => [ALL, ...new Set(sorted.value.map(n => String(n.date || '').slice(0, 4)).filter(Boolean))])
const visible = computed(() => year.value === ALL ? sorted.value : sorted.value.filter(n => String(n.date || '').startsWith(year.value)))
const lead = computed(() => visible.value[0])
const rest = computed(() => visible.value.slice(1))

const paragraphs = (n) => String(n?.text || '').split(/\n\s*\n/).map(p => p.trim()).filter(Boolean)
const excerpt = (n) => paragraphs(n)[0] || ''

// Заглушка без фото: фирменная суперграфика «Лист» на синем
const NewsPlaceholder = (props) =>
  h('div', { class: 'nw-ph', 'aria-hidden': 'true' }, [
    h('div', { class: 'nw-ph__rows' }, [0, 1, 2, 3, 4].map(i =>
      h(BrandPattern, { key: i, height: 44, class: i % 2 ? 'nw-ph__row nw-ph__row--shift' : 'nw-ph__row' })
    )),
    h('span', { class: 'nw-ph__label' }, props.label || 'ESP')
  ])
NewsPlaceholder.props = ['label']

// Открытая новость живёт в ?news=<date>, чтобы ссылкой можно было поделиться
const route = useRoute()
const router = useRouter()
const root = ref(null)
const panel = ref(null)
const current = computed(() => {
  const key = route.query.news
  return key ? sorted.value.find(n => n.date === key) || null : null
})
const open = (n) => router.push({ query: { ...route.query, news: n.date } })
const close = () => {
  const { news: _, ...q } = route.query
  router.push({ query: q })
}

const onKey = (e) => { if (e.key === 'Escape') close() }
watch(current, async (val) => {
  if (!import.meta.client) return
  document.documentElement.style.overflow = val ? 'hidden' : ''
  if (val) {
    window.addEventListener('keydown', onKey)
    await nextTick()
    panel.value?.focus()
  } else {
    window.removeEventListener('keydown', onKey)
  }
}, { immediate: true })
onBeforeUnmount(() => {
  if (!import.meta.client) return
  document.documentElement.style.overflow = ''
  window.removeEventListener('keydown', onKey)
})

useHead(() => ({
  title: current.value ? `${current.value.title} | Новости ESP` : 'Новости | ESP',
  meta: [
    { name: 'description', content: current.value ? excerpt(current.value) : 'Новости ЭкоСервисПроект: запуски очистных сооружений, отраслевые семинары и экспертные материалы об очистке сточных вод.' }
  ]
}))
</script>

<style scoped>
/* Apple Newsroom: серое поле #f5f5f7, колонка 980px, белые плитки со скруглением,
   категория 14/700 серым капсом, заголовок 24/28 (герой 32/36), дата 17/600 */
.nw-feed { background: #f5f5f7; padding: 28px 0 80px; }
.nw-top { display: flex; align-items: baseline; flex-wrap: wrap; gap: 4px 16px; padding-bottom: 16px; margin-bottom: 20px; border-bottom: 1px solid #d2d2d7; }
.nw-h1 { font-size: 21px; line-height: 1.19; font-weight: 600; letter-spacing: 0.011em; color: var(--dj-ink); }
.nw-sub { font-size: 14px; line-height: 1.43; letter-spacing: -0.016em; color: #6e6e73; }
.nw-wrap { max-width: 980px; margin: 0 auto; padding: 0 22px; box-sizing: content-box; }
.nw-head { display: flex; align-items: center; justify-content: space-between; gap: 12px 24px; flex-wrap: wrap; margin-bottom: 24px; }
.nw-head__title { font-size: 28px; line-height: 1.125; font-weight: 700; letter-spacing: 0.004em; color: var(--dj-ink); }
.nw-chips { display: flex; gap: 8px; flex-wrap: wrap; }
.nw-chip { flex: 0 0 auto; height: 36px; padding: 0 16px; border-radius: 999px; font-size: 14px; letter-spacing: -0.016em; color: var(--dj-ink); background: #fff; box-shadow: inset 0 0 0 1px #d2d2d7; transition: background-color .25s ease, color .25s ease, box-shadow .25s ease; }
.nw-chip:hover { box-shadow: inset 0 0 0 1px #86868b; }
.nw-chip.is-on { background: var(--dj-ink); color: #fff; box-shadow: none; }

.nw-tile { display: flex; flex-direction: column; height: 100%; overflow: hidden; border-radius: 28px; background: #fff; cursor: pointer; transform: translateZ(0); transition: box-shadow .3s ease; }
.nw-tile:hover { box-shadow: 2px 4px 16px rgba(0, 0, 0, .16); }
.nw-tile__media { aspect-ratio: 16 / 9; overflow: hidden; background: var(--dj-blue); }
.nw-img { width: 100%; height: 100%; object-fit: cover; display: block; transition: transform 1s var(--dj-ease); }
.nw-tile:hover .nw-img { transform: scale(1.03); }
.nw-tile__desc { display: flex; flex: 1; flex-direction: column; gap: 8px; padding: 28px 32px 32px; }
.nw-cat { font-size: 12px; line-height: 1.33; font-weight: 700; letter-spacing: 0.02em; text-transform: uppercase; color: #6e6e73; }
.nw-tile__title { font-size: 24px; line-height: 1.167; font-weight: 700; letter-spacing: 0.009em; color: var(--dj-ink); text-wrap: pretty; }
.nw-date { display: block; margin-top: auto; padding-top: 12px; font-size: 17px; line-height: 1.235; font-weight: 600; letter-spacing: -0.022em; color: #6e6e73; }
.nw-link { all: unset; cursor: pointer; }
.nw-link:focus-visible { outline: 2px solid #0071e3; outline-offset: 3px; border-radius: 4px; }
.nw-excerpt { font-size: 17px; line-height: 1.47; letter-spacing: -0.022em; color: #6e6e73; display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden; }

/* Плитка-герой: кадр слева, текст справа */
.nw-tile--hero { display: grid; grid-template-columns: minmax(0, 2fr) minmax(0, 1fr); }
.nw-tile--hero .nw-tile__media { aspect-ratio: auto; min-height: 380px; }
.nw-tile--hero .nw-tile__desc { justify-content: center; padding: 32px; }
.nw-tile--hero .nw-tile__title { font-size: 32px; line-height: 1.125; letter-spacing: 0.004em; }
.nw-tile--hero .nw-date { margin-top: 8px; }

.nw-grid { display: grid; grid-template-columns: repeat(6, minmax(0, 1fr)); gap: 24px; margin: 24px 0 0; padding: 0; list-style: none; }
.nw-item--2up { grid-column: span 3; }
.nw-item--3up { grid-column: span 2; }
.nw-item--3up .nw-tile__title { font-size: 21px; line-height: 1.19; letter-spacing: 0.011em; }
.nw-item--3up .nw-tile__desc { padding: 24px 24px 28px; }

/* Мягкое появление плиток (и при смене фильтра) */
.nw-in { animation: nw-in .8s var(--dj-ease) both; }
@keyframes nw-in { from { opacity: 0; transform: translateY(24px); } to { opacity: 1; transform: none; } }

@media (max-width: 1068px) {
  .nw-item--3up { grid-column: span 3; }
}
@media (max-width: 734px) {
  .nw-feed { padding: 40px 0 64px; }
  .nw-wrap { padding: 0 16px; box-sizing: border-box; max-width: none; }
  .nw-head { margin-bottom: 24px; }
  .nw-head__title { font-size: 28px; line-height: 1.14; }
  .nw-chips { flex-wrap: nowrap; overflow-x: auto; scrollbar-width: none; width: 100%; margin: 0 -16px; padding: 0 16px; box-sizing: content-box; }
  .nw-chips::-webkit-scrollbar { display: none; }
  .nw-tile { border-radius: 18px; }
  .nw-tile--hero { grid-template-columns: 1fr; }
  .nw-tile--hero .nw-tile__media { min-height: 0; aspect-ratio: 16 / 9; }
  .nw-tile--hero .nw-tile__title { font-size: 28px; line-height: 1.14; }
  .nw-tile__desc, .nw-tile--hero .nw-tile__desc, .nw-item--3up .nw-tile__desc { padding: 20px 20px 24px; }
  .nw-grid { grid-template-columns: 1fr; gap: 20px; margin-top: 20px; }
  .nw-item--2up, .nw-item--3up { grid-column: auto; }
  .nw-tile__title, .nw-item--3up .nw-tile__title { font-size: 21px; line-height: 1.19; }
  .nw-date { font-size: 14px; }
}

/* Заглушка */
:deep(.nw-ph) { position: relative; width: 100%; height: 100%; min-height: 100%; background: var(--dj-blue); overflow: hidden; color: rgba(255, 255, 255, .06); }
:deep(.nw-ph__rows) { position: absolute; inset: -8px 0 0; display: flex; flex-direction: column; gap: 8px; }
:deep(.nw-ph__row--shift) { transform: translateX(-34px); width: calc(100% + 34px); }
:deep(.nw-ph__label) { position: absolute; left: 16px; bottom: 14px; font-size: 12px; font-weight: 600; color: rgba(255, 255, 255, .75); }

/* Окно чтения: колонка статьи Apple Newsroom (eyebrow, дата, 48/52, кадр, текст 17/25) */
.nw-modal { position: fixed; inset: 0; z-index: 1000; display: flex; align-items: flex-start; justify-content: center; padding: 16px; overflow-y: auto; font-family: var(--dj-font); }
.nw-modal__backdrop { position: fixed; inset: 0; background: rgba(0, 0, 0, .48); backdrop-filter: blur(20px) saturate(180%); -webkit-backdrop-filter: blur(20px) saturate(180%); }
.nw-modal__panel { position: relative; width: 100%; max-width: 860px; margin: auto 0; background: #fff; border-radius: 28px; overflow: hidden; outline: none; animation: nw-in .6s var(--dj-ease) both; }
.nw-modal__head { display: flex; flex-direction: column; gap: 4px; padding: 56px 24px 28px; }
.nw-modal__date { font-size: 14px; line-height: 1.29; font-weight: 600; letter-spacing: -0.016em; color: #6e6e73; }
.nw-modal__title { margin-top: 16px; font-size: clamp(32px, 4vw, 48px); line-height: 1.08; font-weight: 700; letter-spacing: -0.003em; color: var(--dj-ink); text-wrap: balance; }
.nw-modal__media { aspect-ratio: 16 / 9; overflow: hidden; background: var(--dj-blue); }
.nw-modal__body { padding: 32px 24px 48px; }
.nw-modal__p { font-size: 17px; line-height: 1.47; letter-spacing: -0.022em; color: var(--dj-ink); margin-bottom: 1.47em; }
.nw-modal__p:last-child { margin-bottom: 0; }
@media (min-width: 768px) { .nw-modal { padding: 48px 24px; } .nw-modal__head { padding: 72px 84px 32px; } .nw-modal__body { padding: 40px 84px 64px; } }
.nw-modal__close { position: absolute; top: 16px; right: 16px; z-index: 1; width: 36px; height: 36px; display: flex; align-items: center; justify-content: center; background: #e8e8ed; color: #6e6e73; border-radius: 999px; transition: background-color .2s ease, color .2s ease; }
.nw-modal__close:hover { background: #dcdce1; color: var(--dj-ink); }
.nw-modal__close svg { width: 18px; height: 18px; }
@media (prefers-reduced-motion: reduce) { .nw-img, .nw-in, .nw-modal__panel { transition: none; animation: none; } }
</style>
