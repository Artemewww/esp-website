<template>
  <div class="bg-white">
    <PageHero
      compact
      kicker="Новости"
      title="Новости и экспертные материалы"
      lede="События ESP — запуски очистных сооружений, отраслевые семинары, развитие компании — и материалы инженеров об очистке сточных вод."
    />

    <section class="section-padding bg-white">
      <div class="container-custom">
        <!-- Главная новость: крупная карточка -->
        <article v-if="lead" class="nw-lead group" @click="open(lead)">
          <div class="nw-lead__media">
            <img v-if="lead.image" :src="lead.image" :alt="lead.title" class="nw-img" />
            <NewsPlaceholder v-else label="ESP · Хроника" />
          </div>
          <div class="nw-lead__body">
            <time :datetime="lead.date" class="nw-date">{{ lead.dateLabel }}</time>
            <h2 class="nw-lead__title font-rounded">
              <button type="button" class="nw-link" @click.stop="open(lead)">{{ lead.title }}</button>
            </h2>
            <p class="nw-excerpt nw-excerpt--lead">{{ excerpt(lead) }}</p>
            <span class="nw-more">Читать полностью
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" /></svg>
            </span>
          </div>
        </article>

        <!-- Лента -->
        <div class="nw-grid">
          <article v-for="n in rest" :key="n.date + n.title" class="nw-card group" @click="open(n)">
            <div class="nw-card__media">
              <img v-if="n.image" :src="n.image" :alt="n.title" loading="lazy" class="nw-img" />
              <NewsPlaceholder v-else label="ESP · Хроника" />
            </div>
            <div class="nw-card__body">
              <time :datetime="n.date" class="nw-date">{{ n.dateLabel }}</time>
              <h3 class="nw-card__title font-rounded">
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
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
          <div class="nw-modal__media">
            <img v-if="current.image" :src="current.image" :alt="current.title" class="nw-img" />
            <NewsPlaceholder v-else label="ESP · Хроника" />
          </div>
          <div class="nw-modal__body">
            <time :datetime="current.date" class="nw-date">{{ current.dateLabel }}</time>
            <h2 class="font-rounded text-2xl md:text-3xl text-esp-black leading-tight mb-5">{{ current.title }}</h2>
            <p v-for="(para, i) in paragraphs(current)" :key="i" class="text-esp-black/80 leading-relaxed mb-4 last:mb-0">{{ para }}</p>
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
const lead = computed(() => sorted.value[0])
const rest = computed(() => sorted.value.slice(1))

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
.nw-img { width: 100%; height: 100%; object-fit: cover; display: block; transition: transform .6s ease; }
.nw-date { display: block; font-family: ui-monospace, SFMono-Regular, Menlo, monospace; font-size: 13px; color: #002366; margin-bottom: 10px; }
.nw-link { all: unset; cursor: pointer; }
.nw-link:focus-visible { outline: 2px solid #002366; outline-offset: 3px; }
.nw-excerpt {
  font-size: 14px; line-height: 1.6; color: rgba(26, 26, 26, .65);
  display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden;
}
.nw-excerpt--lead { font-size: 16px; -webkit-line-clamp: 4; }

/* Главная новость */
.nw-lead {
  display: grid; grid-template-columns: 1fr; cursor: pointer;
  background: #EDEDED; margin-bottom: 32px; overflow: hidden;
}
.nw-lead__media { aspect-ratio: 16 / 10; overflow: hidden; background: #002366; }
.nw-lead__body { padding: 20px 20px 24px; display: flex; flex-direction: column; justify-content: center; min-width: 0; }
.nw-lead__title { font-size: 22px; line-height: 1.25; color: #1A1A1A; margin-bottom: 14px; }
.nw-lead:hover .nw-img { transform: scale(1.03); }
.nw-lead:hover .nw-lead__title { color: #002366; }
.nw-more { display: inline-flex; align-items: center; gap: 6px; margin-top: 18px; font-size: 14px; font-weight: 500; color: #002366; }
.nw-more svg { width: 16px; height: 16px; transition: transform .25s ease; }
.nw-lead:hover .nw-more svg { transform: translateX(3px); }
@media (min-width: 768px) {
  .nw-lead__body { padding: 32px; }
  .nw-lead__title { font-size: 28px; }
}
@media (min-width: 1024px) {
  .nw-lead { grid-template-columns: 7fr 5fr; margin-bottom: 40px; }
  .nw-lead__media { aspect-ratio: auto; min-height: 420px; }
  .nw-lead__body { padding: 48px; }
  .nw-lead__title { font-size: 32px; }
}

/* Лента */
.nw-grid { display: grid; grid-template-columns: 1fr; gap: 20px; }
@media (min-width: 640px) { .nw-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); } }
@media (min-width: 1024px) { .nw-grid { grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 28px; } }
.nw-card {
  display: flex; flex-direction: column; cursor: pointer; background: #fff;
  border: 1px solid #EDEDED; transition: box-shadow .25s ease, transform .25s ease, border-color .25s ease;
}
.nw-card:hover { border-color: rgba(0, 35, 102, .25); box-shadow: 0 12px 32px -16px rgba(26, 26, 26, .25); transform: translateY(-2px); }
.nw-card:hover .nw-img { transform: scale(1.04); }
.nw-card__media { aspect-ratio: 16 / 10; overflow: hidden; background: #002366; }
.nw-card__body { padding: 18px 20px 22px; min-width: 0; }
.nw-card__title { font-size: 17px; line-height: 1.35; color: #1A1A1A; margin-bottom: 10px; }
.nw-card:hover .nw-card__title { color: #002366; }

/* Заглушка */
:deep(.nw-ph) { position: relative; width: 100%; height: 100%; min-height: 100%; background: #002366; overflow: hidden; color: rgba(255, 255, 255, .06); }
:deep(.nw-ph__rows) { position: absolute; inset: -8px 0 0; display: flex; flex-direction: column; gap: 8px; }
:deep(.nw-ph__row--shift) { transform: translateX(-34px); width: calc(100% + 34px); }
:deep(.nw-ph__label) {
  position: absolute; left: 16px; bottom: 14px; font-size: 12px; letter-spacing: .08em; text-transform: uppercase;
  color: rgba(255, 255, 255, .75); font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
}

/* Модальное окно */
.nw-modal { position: fixed; inset: 0; z-index: 1000; display: flex; align-items: flex-start; justify-content: center; padding: 16px; overflow-y: auto; }
.nw-modal__backdrop { position: fixed; inset: 0; background: rgba(26, 26, 26, .6); }
.nw-modal__panel { position: relative; width: 100%; max-width: 760px; margin: auto 0; background: #fff; box-shadow: 0 30px 60px -20px rgba(0, 0, 0, .4); outline: none; }
.nw-modal__media { aspect-ratio: 16 / 9; overflow: hidden; background: #002366; }
.nw-modal__body { padding: 24px 20px 28px; }
@media (min-width: 768px) { .nw-modal { padding: 40px 24px; } .nw-modal__body { padding: 36px 44px 44px; } }
.nw-modal__close {
  position: absolute; top: 12px; right: 12px; z-index: 1; width: 40px; height: 40px;
  display: flex; align-items: center; justify-content: center; background: #fff; color: #1A1A1A; border-radius: 9999px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, .15); transition: color .2s ease;
}
.nw-modal__close:hover { color: #002366; }
.nw-modal__close svg { width: 20px; height: 20px; }
</style>
