<template>
  <!-- #89 Цифры — горизонтально прокручиваемый бенто: карточки разной ширины,
       часть на фото, листается свайпом, колесом и стрелками -->
  <section class="sb" aria-label="ESP в цифрах">
    <div ref="track" class="sb-track" @scroll.passive="onScroll">
      <article
        v-for="(s, i) in items"
        :key="s.label"
        class="sb-card dj-reveal"
        :class="[`sb-card--${s.size}`, { 'sb-card--img': s.img, 'sb-card--blue': s.tone === 'blue' }]"
        :style="{ '--d': i * 80 + 'ms' }"
      >
        <img v-if="s.img" :srcset="srcset(s.img)" sizes="(max-width: 734px) 100vw, 33vw" :src="s.img" alt="" loading="lazy" decoding="async" />
        <span class="sb-eyebrow">{{ s.eyebrow }}</span>
        <b class="sb-val">{{ s.value }}</b>
        <span class="sb-label">{{ s.label }}</span>
      </article>
    </div>
    <div class="sb-nav">
      <button type="button" class="sb-arrow" :disabled="atStart" aria-label="Назад" @click="go(-1)">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 6l-6 6 6 6" /></svg>
      </button>
      <button type="button" class="sb-arrow" :disabled="atEnd" aria-label="Вперёд" @click="go(1)">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 6l6 6-6 6" /></svg>
      </button>
    </div>
  </section>
</template>

<script setup>
import { srcset } from '~/composables/useSrcset'
import { ref, onMounted } from 'vue'

// Цифры — те же, что были на странице; фото — реальные кадры ESP
const items = [
  { size: 'm', tone: 'blue', value: '28 лет', label: 'компания работает в сфере очистки воды', eyebrow: 'Опыт' },
  { size: 'xl', value: '100+', label: 'инженеров и специалистов в штате', eyebrow: 'Команда', img: '/images/team/real/planning.webp' },
  { size: 'l', value: '2000+', label: 'реализованных объектов', eyebrow: 'Объекты', img: '/images/career/aerial-green.jpg' },
]

const track = ref(null)
const atStart = ref(true)
const atEnd = ref(false)
const onScroll = () => {
  const el = track.value
  if (!el) return
  atStart.value = el.scrollLeft < 8
  atEnd.value = el.scrollLeft + el.clientWidth >= el.scrollWidth - 8
}
const go = (dir) => {
  const el = track.value
  if (el) el.scrollBy({ left: dir * el.clientWidth * 0.7, behavior: 'smooth' })
}
onMounted(onScroll)
</script>

<style scoped>
.sb { padding: clamp(40px, 6vw, 80px) 0 0; }
.sb-track {
  display: flex; gap: 16px; overflow-x: auto; scroll-snap-type: x mandatory; scrollbar-width: none;
  padding: 4px max(16px, calc((100vw - 1200px) / 2)) 8px;
  scroll-padding-inline: max(16px, calc((100vw - 1200px) / 2));
}
.sb-track::-webkit-scrollbar { display: none; }
.sb-card {
  position: relative; flex: 0 0 auto; height: clamp(360px, 38vw, 480px); scroll-snap-align: start;
  display: flex; flex-direction: column; justify-content: flex-end; gap: 8px;
  padding: clamp(24px, 2.6vw, 36px); border-radius: var(--r-lg); overflow: hidden; isolation: isolate;
  background: #EDEDED; color: var(--dj-ink);
}
.sb-card--xl { width: min(640px, 84vw); }
.sb-card--l { width: min(520px, 84vw); }
.sb-card--m { width: min(440px, 84vw); }
.sb-card--s { width: min(320px, 72vw); }
.sb-card img { position: absolute; inset: 0; z-index: -2; width: 100%; height: 100%; object-fit: cover; filter: saturate(1.15); transition: transform 1.2s var(--dj-ease); }
.sb-card:hover img { transform: scale(1.04); }
.sb-card--img { color: #fff; }
.sb-card--img::after { content: ''; position: absolute; inset: 0; z-index: -1; background: var(--scrim-b); }
.sb-card--blue { color: #fff; background: radial-gradient(120% 90% at 20% 0%, #002366 0%, #002366 45%, #002366 100%); justify-content: space-between; }
.sb-eyebrow { position: absolute; top: clamp(24px, 2.6vw, 36px); left: clamp(24px, 2.6vw, 36px); font-size: 14px; font-weight: 600; letter-spacing: -0.01em; opacity: 0.85; }
.sb-val { font-size: clamp(56px, 7vw, 104px); line-height: 0.95; font-weight: 700; letter-spacing: -0.03em; font-variant-numeric: tabular-nums; }
.sb-label { max-width: 26ch; font-size: 17px; line-height: 1.35; letter-spacing: -0.022em; opacity: 0.9; }
.sb-nav { display: flex; justify-content: flex-end; gap: 12px; max-width: 1200px; margin: 18px auto 0; padding: 0 16px; }
.sb-arrow { display: grid; place-items: center; width: 44px; height: 44px; border-radius: 50%; background: #EDEDED; color: var(--dj-ink); transition: background-color 0.2s ease, opacity 0.2s ease; }
.sb-arrow:hover:not(:disabled) { background: #D6D6D6; }
.sb-arrow:disabled { opacity: 0.35; cursor: default; }
.sb-arrow svg { width: 20px; height: 20px; }
@media (max-width: 767px) {
  .sb-card { height: 340px; border-radius: var(--r-md); }
}
@media (prefers-reduced-motion: reduce) { .sb-card img { transition: none; } }
</style>
