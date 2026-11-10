<template>
  <div ref="root" class="nw">
    <DjPageHero
      eyebrow="Новости"
      title="Новости и экспертные материалы"
      lede="События ESP — запуски очистных сооружений, отраслевые семинары, развитие компании — и материалы инженеров об очистке сточных вод."
    />

    <!-- Годы как чипы-фильтры, как разделы в DJI Newsroom -->
    <div class="dj-wrap nw-chips" role="tablist" aria-label="Годы">
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

    <section class="nw-sec">
      <div class="dj-wrap">
        <!-- Главная новость -->
        <article v-if="lead" :key="'lead' + lead.date" class="nw-lead nw-in" @click="open(lead)">
          <div class="nw-media nw-media--lead">
            <img v-if="lead.image" :src="lead.image" :alt="lead.title" class="nw-img" />
            <NewsPlaceholder v-else label="ESP · Хроника" />
          </div>
          <div class="nw-lead__body">
            <span class="nw-cat">{{ lead.category || 'Новости' }}</span>
            <h2 class="nw-lead__title">
              <button type="button" class="nw-link" @click.stop="open(lead)">{{ lead.title }}</button>
            </h2>
            <time :datetime="lead.date" class="nw-date">{{ lead.dateLabel }}</time>
            <p class="nw-excerpt nw-excerpt--lead">{{ excerpt(lead) }}</p>
            <span class="dj-more nw-more">Читать полностью</span>
          </div>
        </article>

        <!-- Лента -->
        <div v-if="rest.length" class="nw-grid">
          <article
            v-for="(n, i) in rest"
            :key="n.date + n.title"
            class="nw-card nw-in"
            :style="{ animationDelay: `${Math.min(i, 8) * 60}ms` }"
            @click="open(n)"
          >
            <div class="nw-media">
              <img v-if="n.image" :src="n.image" :alt="n.title" loading="lazy" class="nw-img" />
              <NewsPlaceholder v-else label="ESP · Хроника" />
            </div>
            <div class="nw-card__body">
              <div class="nw-card__meta">
                <span class="nw-cat">{{ n.category || 'Новости' }}</span>
                <time :datetime="n.date" class="nw-date">{{ n.dateLabel }}</time>
              </div>
              <h3 class="nw-card__title">
                <button type="button" class="nw-link" @click.stop="open(n)">{{ n.title }}</button>
              </h3>
              <p class="nw-excerpt">{{ excerpt(n) }}</p>
            </div>
          </article>
        </div>
      </div>
    </section>

    <!-- Чтение новости целиком -->
    <Teleport to="body">
      <div v-if="current" class="nw-modal" role="dialog" aria-modal="true" :aria-label="current.title" @keydown.esc="close">
        <div class="nw-modal__backdrop" @click="close"></div>
        <div ref="panel" class="nw-modal__panel" tabindex="-1">
          <button type="button" class="nw-modal__close" aria-label="Закрыть" @click="close">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.6" d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
          <div class="nw-modal__head">
            <span class="nw-cat">{{ current.category || 'Новости' }}</span>
            <time :datetime="current.date" class="nw-date">{{ current.dateLabel }}</time>
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
    { name: 'description', content: current.value ? excerpt(current.value) : 'Новости ЭкоСервисПроект: запуски очистных сооружений, отраслевые семинары и экспертные материалы об очистке сточных вод.' }
  ]
}))
</script>

<style scoped>
/* DJI Newsroom: чипы, крупная главная история, ниже ровная сетка 16:9 */
.nw-chips { display: flex; gap: 8px; justify-content: center; flex-wrap: wrap; padding-bottom: 8px; }
.nw-chip { flex: 0 0 auto; height: 36px; padding: 0 18px; border-radius: 999px; font-size: 14px; color: var(--dj-ink); background: var(--dj-soft); transition: background-color .25s ease, color .25s ease; }
.nw-chip:hover { background: #e8eaed; }
.nw-chip.is-on { background: var(--dj-ink); color: #fff; }
.nw-sec { padding: clamp(28px, 4vw, 48px) 0 clamp(64px, 8vw, 112px); }

.nw-media { aspect-ratio: 16 / 9; overflow: hidden; background: var(--dj-blue); }
.nw-img { width: 100%; height: 100%; object-fit: cover; display: block; transition: transform 1s var(--dj-ease); }
.nw-cat { font-size: 12px; font-weight: 600; letter-spacing: .04em; text-transform: uppercase; color: var(--dj-accent); }
.nw-date { display: block; font-size: 13px; color: var(--dj-muted); }
.nw-link { all: unset; cursor: pointer; }
.nw-link:focus-visible { outline: 2px solid var(--dj-link); outline-offset: 3px; }
.nw-excerpt { font-size: 15px; line-height: 1.55; color: var(--dj-text); display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden; }

/* Главная история: кадр слева, текст справа на светлой плитке */
.nw-lead { display: grid; grid-template-columns: minmax(0, 7fr) minmax(0, 5fr); background: var(--dj-soft); cursor: pointer; }
.nw-media--lead { aspect-ratio: auto; min-height: 100%; }
.nw-media--lead .nw-img { aspect-ratio: 16 / 10; }
.nw-lead__body { display: flex; flex-direction: column; justify-content: center; gap: 12px; padding: clamp(28px, 4vw, 56px); }
.nw-lead__title { font-size: clamp(24px, 2.6vw, 36px); line-height: 1.14; font-weight: 600; letter-spacing: -0.02em; color: var(--dj-ink); text-wrap: balance; }
.nw-excerpt--lead { font-size: 16px; -webkit-line-clamp: 4; }
.nw-more { margin-top: 4px; }

.nw-grid { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 40px 12px; margin-top: 48px; }
.nw-card { display: flex; flex-direction: column; cursor: pointer; }
.nw-card__body { display: flex; flex-direction: column; gap: 8px; padding: 16px 4px 0; }
.nw-card__meta { display: flex; align-items: baseline; gap: 10px; flex-wrap: wrap; }
.nw-card__title { font-size: 19px; line-height: 1.3; font-weight: 600; letter-spacing: -0.01em; color: var(--dj-ink); transition: color .25s ease; }
.nw-card .nw-excerpt { -webkit-line-clamp: 2; color: var(--dj-muted); }
.nw-card:hover .nw-card__title, .nw-lead:hover .nw-lead__title { color: var(--dj-link); }
.nw-card:hover .nw-img, .nw-lead:hover .nw-img { transform: scale(1.03); }
.nw-lead__title, .nw-card__title { transition: color .25s ease; }

/* Мягкое появление карточек (и при смене фильтра) */
.nw-in { animation: nw-in .8s var(--dj-ease) both; }
@keyframes nw-in { from { opacity: 0; transform: translateY(18px); } to { opacity: 1; transform: none; } }

@media (max-width: 1023px) {
  .nw-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
  .nw-lead { grid-template-columns: 1fr; }
  .nw-media--lead .nw-img { aspect-ratio: 16 / 9; }
}
@media (max-width: 767px) {
  .nw-chips { justify-content: flex-start; flex-wrap: nowrap; overflow-x: auto; scrollbar-width: none; }
  .nw-chips::-webkit-scrollbar { display: none; }
  .nw-grid { grid-template-columns: 1fr; gap: 32px; margin-top: 32px; }
  .nw-lead__body { padding: 24px 20px 28px; }
  .nw-card__title { font-size: 18px; }
}

/* Заглушка */
:deep(.nw-ph) { position: relative; width: 100%; height: 100%; min-height: 100%; background: var(--dj-blue); overflow: hidden; color: rgba(255, 255, 255, .06); }
:deep(.nw-ph__rows) { position: absolute; inset: -8px 0 0; display: flex; flex-direction: column; gap: 8px; }
:deep(.nw-ph__row--shift) { transform: translateX(-34px); width: calc(100% + 34px); }
:deep(.nw-ph__label) { position: absolute; left: 16px; bottom: 14px; font-size: 12px; font-weight: 600; color: rgba(255, 255, 255, .75); }

/* Окно чтения: колонка Apple Newsroom */
.nw-modal { position: fixed; inset: 0; z-index: 1000; display: flex; align-items: flex-start; justify-content: center; padding: 16px; overflow-y: auto; font-family: var(--dj-font); }
.nw-modal__backdrop { position: fixed; inset: 0; background: rgba(11, 13, 16, .6); backdrop-filter: blur(8px); -webkit-backdrop-filter: blur(8px); }
.nw-modal__panel { position: relative; width: 100%; max-width: 820px; margin: auto 0; background: #fff; overflow: hidden; outline: none; animation: nw-in .6s var(--dj-ease) both; }
.nw-modal__head { display: flex; flex-direction: column; gap: 8px; padding: 44px 24px 24px; }
.nw-modal__title { font-size: clamp(26px, 3.4vw, 38px); line-height: 1.12; font-weight: 600; letter-spacing: -0.02em; color: var(--dj-ink); text-wrap: balance; }
.nw-modal__media { aspect-ratio: 16 / 9; overflow: hidden; background: var(--dj-blue); }
.nw-modal__body { padding: 28px 24px 40px; }
.nw-modal__p { font-size: 18px; line-height: 1.65; color: var(--dj-ink); margin-bottom: 1.1em; }
.nw-modal__p:last-child { margin-bottom: 0; }
@media (min-width: 768px) { .nw-modal { padding: 48px 24px; } .nw-modal__head { padding: 56px 64px 28px; } .nw-modal__body { padding: 36px 64px 56px; } .nw-modal__p { font-size: 19px; } }
.nw-modal__close { position: absolute; top: 12px; right: 12px; z-index: 1; width: 36px; height: 36px; display: flex; align-items: center; justify-content: center; background: var(--dj-soft); color: var(--dj-ink); border-radius: 999px; transition: background-color .2s ease; }
.nw-modal__close:hover { background: #e8eaed; }
.nw-modal__close svg { width: 18px; height: 18px; }
@media (prefers-reduced-motion: reduce) { .nw-img, .nw-in, .nw-modal__panel { transition: none; animation: none; } }
</style>
