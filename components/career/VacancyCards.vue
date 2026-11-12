<template>
  <!-- #85 Вакансии — вертикальные карточки в стиле Apple: текст сверху,
       сотрудник по профессии на фото снизу; подробности раскрываются под сеткой -->
  <div class="vc" :class="{ 'vc--open': opened }">
    <div class="vc-grid">
      <article
        v-for="(v, i) in vacancies"
        v-show="!opened || opened === v.slug"
        :key="v.slug"
        class="vc-card"
        :class="{ 'is-active': opened === v.slug }"
        :style="{ '--d': i * 80 + 'ms', viewTransitionName: `vc-${i}` }"
      >
        <button type="button" class="vc-head" :aria-expanded="opened === v.slug" :aria-controls="`vac-${v.slug}`" @click="toggle(v.slug)">
          <span class="vc-copy">
            <span class="vc-dept">{{ v.dept }} · {{ v.location }}</span>
            <b class="vc-title">{{ v.title }}</b>
            <span class="vc-salary">{{ v.salary }}</span>
          </span>
          <span class="vc-photo" :style="{ viewTransitionName: `vcp-${i}` }">
            <img :srcset="srcset(photoOf(v))" sizes="(max-width: 734px) 100vw, 40vw" :src="photoOf(v)" :alt="v.title" loading="lazy" decoding="async" />
          </span>
          <span class="vc-plus" :class="{ 'is-open': opened === v.slug }" aria-hidden="true" />
        </button>
        <!-- Описание выезжает внутри той же карточки, фото остаётся слева -->
        <div v-if="opened === v.slug" :id="`vac-${v.slug}`" class="vc-body">
          <p class="vc-text">{{ v.mission }}</p>
          <div class="vc-cols">
            <div>
              <h4 class="vc-h4">Чем предстоит заниматься</h4>
              <ul class="vc-list"><li v-for="(t, k) in v.tasks" :key="k">{{ t }}</li></ul>
            </div>
            <div>
              <h4 class="vc-h4">Что нужно</h4>
              <ul class="vc-list">
                <li v-for="(r, k) in v.requirements" :key="k"><b>{{ r.title }}</b><span v-if="r.desc"> — {{ r.desc }}</span></li>
              </ul>
            </div>
            <div v-if="v.offer?.length">
              <h4 class="vc-h4">Что предлагаем</h4>
              <ul class="vc-list"><li v-for="(o, k) in v.offer" :key="k">{{ o }}</li></ul>
            </div>
          </div>
          <div class="vc-foot">
            <p v-if="v.schedule" class="vc-small">График: {{ v.schedule }}</p>
            <NuxtLink :to="applyTo(v.slug)" class="dj-btn" @click.prevent="apply(v.slug)">Откликнуться</NuxtLink>
          </div>
        </div>
      </article>
    </div>
  </div>
</template>

<script setup>
import { srcset } from '~/composables/useSrcset'
import { ref, nextTick } from 'vue'

defineProps({
  vacancies: { type: Array, required: true },
  hrEmail: { type: String, required: true }
})

// Серия на белом фоне: специалист в фирменной одежде ESP (#002366), логотип ESP.
// Новая вакансия → public/images/career/vac/<slug>.webp (900×1125)
const PHOTOS = {
  'turner-universal': '/images/career/vac/turner-universal.webp',
  'accountant-tmc': '/images/career/vac/accountant-tmc.webp'
}
const photoOf = (v) => v.photo || PHOTOS[v.slug] || '/images/team/real/welder.webp'

const opened = ref(null)
// Карточка раскрывается сама (View Transitions: соседняя уезжает, фото «перетекает»),
// в браузерах без поддержки — просто раскрывается без анимации.
const toggle = (slug) => {
  const next = opened.value === slug ? null : slug
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches
  if (!document.startViewTransition || reduce) { opened.value = next; return }
  document.startViewTransition(async () => { opened.value = next; await nextTick() }).finished.then(() => {
    if (!next) return
    const el = document.querySelector('.vc-card.is-active')
    if (el) window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 110, behavior: 'smooth' })
  })
}
// «Откликнуться» → анкета на этой же странице с уже выбранной вакансией
const router = useRouter()
const applyTo = (slug) => ({ path: '/career', query: { vacancy: slug }, hash: '#forms' })
const apply = async (slug) => {
  // query без hash — роутер не прыгает; к анкете едем плавно сами
  await router.replace({ path: '/career', query: { vacancy: slug } })
  await nextTick()
  document.getElementById('forms')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  history.replaceState(history.state, '', `/career?vacancy=${encodeURIComponent(slug)}#forms`)
}
</script>

<style scoped>
.vc { margin-top: clamp(32px, 4vw, 48px); }
.vc-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(min(100%, 340px), 1fr)); gap: 20px; }
.vc-card {
  position: relative; display: flex; flex-direction: column; min-height: clamp(520px, 46vw, 620px); overflow: hidden;
  border-radius: var(--r-lg); background: #fff; color: var(--dj-ink); isolation: isolate;
  box-shadow: var(--sh-1); transition: transform 0.5s var(--dj-ease), box-shadow 0.5s var(--dj-ease);
}
.vc-card:not(.is-active):hover { transform: translateY(-4px); box-shadow: var(--sh-3); }
.vc-head { display: flex; flex: 1 1 auto; flex-direction: column; width: 100%; padding: 0; border: 0; background: none; text-align: left; color: inherit; cursor: pointer; }
.vc-copy { display: grid; gap: 8px; padding: clamp(26px, 2.6vw, 36px) clamp(24px, 2.4vw, 34px) 20px; }
/* Раскрытая карточка: на всю ширину, слева фото, справа заголовок и описание */
.vc--open .vc-grid { grid-template-columns: 1fr; }
.vc-card.is-active { display: grid; grid-template-columns: minmax(320px, 1fr) minmax(0, 1.3fr); grid-template-rows: auto minmax(0, 1fr); height: calc(100svh - var(--dj-header-h, 44px) - 52px - 48px); min-height: 520px; max-height: 920px; box-shadow: var(--sh-2); }
.vc-card.is-active .vc-head { display: contents; }
.vc-card.is-active .vc-copy { grid-column: 2; grid-row: 1; padding-bottom: 8px; }
.vc-card.is-active .vc-photo { grid-column: 1; grid-row: 1 / 3; align-self: stretch; min-height: 0; background: #fff; }
.vc-card.is-active .vc-plus { top: 20px; bottom: auto; }
.vc-body { grid-column: 2; grid-row: 2; min-height: 0; overflow-y: auto; overscroll-behavior: contain; padding: 4px clamp(24px, 2.4vw, 34px) clamp(26px, 3vw, 40px); animation: vc-in 0.5s var(--dj-ease) both; }
@keyframes vc-in { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: none; } }
::view-transition-group(*) { animation-duration: 0.55s; animation-timing-function: cubic-bezier(0.22, 1, 0.36, 1); }
.vc-dept { font-size: 14px; font-weight: 600; letter-spacing: -0.01em; color: #002366; }
.vc-title { font-size: clamp(28px, 2.6vw, 36px); line-height: 1.08; font-weight: 600; letter-spacing: -0.015em; }
.vc-salary { font-size: 17px; letter-spacing: -0.022em; color: #5E5E5E; }
.vc-photo { position: relative; flex: 1 1 auto; min-height: 280px; overflow: hidden; }
.vc-photo img { position: absolute; inset: clamp(12px, 1.6vw, 24px) 0 0; width: 100%; height: calc(100% - clamp(12px, 1.6vw, 24px)); object-fit: cover; object-position: 50% 0; }
.vc-plus { position: absolute; right: 20px; bottom: 20px; width: 40px; height: 40px; border-radius: 50%; background: rgba(26, 26, 26, 0.72); backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px); }
.vc-plus::before, .vc-plus::after { content: ''; position: absolute; left: 50%; top: 50%; width: 14px; height: 2px; border-radius: 1px; background: #fff; transform: translate(-50%, -50%); transition: transform 0.3s var(--dj-ease); }
.vc-plus::after { transform: translate(-50%, -50%) rotate(90deg); }
.vc-plus.is-open::after { transform: translate(-50%, -50%) rotate(0deg); }
.vc-text { font-size: 17px; line-height: 1.47; letter-spacing: -0.022em; color: #5E5E5E; max-width: 64ch; }
.vc-cols { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 24px 36px; margin-top: 24px; }
.vc-h4 { font-size: 17px; line-height: 1.24; letter-spacing: -0.022em; font-weight: 600; color: var(--dj-ink); margin-bottom: 12px; }
.vc-list { display: grid; gap: 10px; list-style: none; margin: 0; padding: 0; }
.vc-list li { position: relative; padding-left: 16px; font-size: 17px; line-height: 1.47; letter-spacing: -0.022em; color: #5E5E5E; }
.vc-list li::before { content: ''; position: absolute; left: 0; top: 0.66em; width: 5px; height: 5px; border-radius: 50%; background: var(--dj-blue); }
.vc-list b { color: var(--dj-ink); font-weight: 600; }
.vc-foot { display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between; gap: 12px 24px; margin-top: 32px; padding-top: 20px; border-top: 1px solid #D6D6D6; }
.vc-small { font-size: 14px; letter-spacing: -0.016em; color: #5E5E5E; }
@media (max-width: 1023px) { .vc-cols { grid-template-columns: minmax(0, 1fr); } }
@media (max-width: 767px) {
  .vc-card.is-active { display: flex; height: auto; max-height: none; }
  .vc-card.is-active .vc-body { overflow: visible; }
  .vc-card.is-active .vc-head { display: flex; }
  .vc-card.is-active .vc-photo { min-height: 320px; }
}
@media (max-width: 767px) {
  .vc-card, .vc-body { border-radius: var(--r-md); }
  .vc-card { min-height: 480px; }
  .vc-foot .dj-btn { width: 100%; }
}
@media (prefers-reduced-motion: reduce) { .vc-card { transition: none; } }
</style>
