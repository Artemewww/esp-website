<template>
  <!-- #85 Вакансии — вертикальные карточки в стиле Apple: текст сверху,
       сотрудник по профессии на фото снизу; подробности раскрываются под сеткой -->
  <div class="vc">
    <div class="vc-grid">
      <button
        v-for="(v, i) in vacancies"
        :key="v.slug"
        type="button"
        class="vc-card dj-reveal"
        :class="{ 'is-active': opened === v.slug }"
        :style="{ '--d': i * 80 + 'ms' }"
        :aria-expanded="opened === v.slug"
        :aria-controls="`vac-${v.slug}`"
        @click="toggle(v.slug)"
      >
        <span class="vc-copy">
          <span class="vc-dept">{{ v.dept }} · {{ v.location }}</span>
          <b class="vc-title">{{ v.title }}</b>
          <span class="vc-salary">{{ v.salary }}</span>
        </span>
        <span class="vc-photo">
          <img :src="photoOf(v)" :alt="v.title" loading="lazy" decoding="async" />
        </span>
        <span class="vc-plus" :class="{ 'is-open': opened === v.slug }" aria-hidden="true" />
      </button>
    </div>

    <template v-for="v in vacancies" :key="'b-' + v.slug">
      <div v-show="opened === v.slug" :id="`vac-${v.slug}`" class="vc-body">
        <h3 class="vc-body-title">{{ v.title }}</h3>
        <p class="vc-text">{{ v.mission }}</p>
        <div class="vc-cols">
          <div>
            <h4 class="vc-h4">Чем предстоит заниматься</h4>
            <ul class="vc-list"><li v-for="(t, k) in v.tasks" :key="k">{{ t }}</li></ul>
          </div>
          <div>
            <h4 class="vc-h4">Что нужно</h4>
            <ul class="vc-list">
              <li v-for="(r, k) in v.requirements" :key="k"><b>{{ r.title }}</b><span v-if="r.desc"> — {{ r.desc }}</span></li>
            </ul>
          </div>
          <div v-if="v.offer?.length">
            <h4 class="vc-h4">Что предлагаем</h4>
            <ul class="vc-list"><li v-for="(o, k) in v.offer" :key="k">{{ o }}</li></ul>
          </div>
        </div>
        <div class="vc-foot">
          <p v-if="v.schedule" class="vc-small">График: {{ v.schedule }}</p>
          <a :href="mailTo(v.title)" class="dj-btn">Откликнуться</a>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const props = defineProps({
  vacancies: { type: Array, required: true },
  hrEmail: { type: String, required: true }
})

// Временные реальные кадры. Целевые фото (сотрудник в рабочей форме ESP
// по профессии) ведущий положит в public/images/career/vac-<slug>.webp
const PHOTOS = {
  'turner-universal': '/images/career/vac-turner-universal.webp',
  'accountant-tmc': '/images/career/vac-accountant-tmc.webp'
}
const photoOf = (v) => v.photo || PHOTOS[v.slug] || '/images/team/real/welder.webp'

const opened = ref(null)
const toggle = (slug) => { opened.value = opened.value === slug ? null : slug }
const mailTo = (title) =>
  `mailto:${props.hrEmail}?subject=${encodeURIComponent('Отклик на вакансию: ' + title)}`
</script>

<style scoped>
.vc { margin-top: clamp(32px, 4vw, 48px); }
.vc-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(min(100%, 340px), 1fr)); gap: 20px; }
.vc-card {
  position: relative; display: flex; flex-direction: column; min-height: clamp(520px, 46vw, 620px); padding: 0; overflow: hidden;
  border-radius: var(--r-lg); background: #fff; text-align: left; color: var(--dj-ink); isolation: isolate;
  box-shadow: var(--sh-1); transition: transform 0.5s var(--dj-ease), box-shadow 0.5s var(--dj-ease);
}
.vc-card:hover { transform: translateY(-4px); box-shadow: var(--sh-3); }
.vc-card.is-active { box-shadow: 0 0 0 2px #0a3a8c, 0 24px 48px -28px rgba(0, 35, 102, 0.45); }
.vc-copy { display: grid; gap: 8px; padding: clamp(26px, 2.6vw, 36px) clamp(24px, 2.4vw, 34px) 20px; }
.vc-dept { font-size: 14px; font-weight: 600; letter-spacing: -0.01em; color: #bf4800; }
.vc-title { font-size: clamp(28px, 2.6vw, 36px); line-height: 1.08; font-weight: 600; letter-spacing: -0.015em; }
.vc-salary { font-size: 17px; letter-spacing: -0.022em; color: #6e6e73; }
.vc-photo { position: relative; flex: 1 1 auto; min-height: 280px; overflow: hidden; }
.vc-photo img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; filter: saturate(1.12); transition: transform 1.2s var(--dj-ease); }
.vc-card:hover .vc-photo img { transform: scale(1.04); }
.vc-plus { position: absolute; right: 20px; bottom: 20px; width: 40px; height: 40px; border-radius: 50%; background: rgba(29, 29, 31, 0.72); backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px); }
.vc-plus::before, .vc-plus::after { content: ''; position: absolute; left: 50%; top: 50%; width: 14px; height: 2px; border-radius: 1px; background: #fff; transform: translate(-50%, -50%); transition: transform 0.3s var(--dj-ease); }
.vc-plus::after { transform: translate(-50%, -50%) rotate(90deg); }
.vc-plus.is-open::after { transform: translate(-50%, -50%) rotate(0deg); }
.vc-body { margin-top: 20px; padding: clamp(26px, 3vw, 44px); border-radius: var(--r-lg); background: #fff; }
.vc-body-title { font-size: clamp(24px, 2.2vw, 32px); line-height: 1.12; font-weight: 600; letter-spacing: -0.01em; color: var(--dj-ink); margin-bottom: 12px; }
.vc-text { font-size: 17px; line-height: 1.47; letter-spacing: -0.022em; color: #6e6e73; max-width: 64ch; }
.vc-cols { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 24px 40px; margin-top: 28px; }
.vc-h4 { font-size: 17px; line-height: 1.24; letter-spacing: -0.022em; font-weight: 600; color: var(--dj-ink); margin-bottom: 12px; }
.vc-list { display: grid; gap: 10px; list-style: none; margin: 0; padding: 0; }
.vc-list li { position: relative; padding-left: 16px; font-size: 17px; line-height: 1.47; letter-spacing: -0.022em; color: #6e6e73; }
.vc-list li::before { content: ''; position: absolute; left: 0; top: 0.66em; width: 5px; height: 5px; border-radius: 50%; background: var(--dj-blue); }
.vc-list b { color: var(--dj-ink); font-weight: 600; }
.vc-foot { display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between; gap: 12px 24px; margin-top: 32px; padding-top: 20px; border-top: 1px solid #d2d2d7; }
.vc-small { font-size: 14px; letter-spacing: -0.016em; color: #6e6e73; }
@media (max-width: 1023px) { .vc-cols { grid-template-columns: minmax(0, 1fr); } }
@media (max-width: 767px) {
  .vc-card, .vc-body { border-radius: var(--r-md); }
  .vc-card { min-height: 480px; }
  .vc-foot .dj-btn { width: 100%; }
}
@media (prefers-reduced-motion: reduce) { .vc-card, .vc-photo img { transition: none; } }
</style>
