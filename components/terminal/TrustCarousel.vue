<template>
  <!-- Карточки «What's the one thing slowing your yard down?» у Terminal:
       крупный заголовок вверху, снизу текст с меткой капсом, под ним —
       размытое фото под цветной вуалью. -->
  <section class="tc" aria-labelledby="tc-title">
    <div class="tc-head">
      <h2 id="tc-title" class="tc-title">Почему нам доверяют лидеры?</h2>
      <div class="tc-nav">
        <button type="button" class="tc-arrow" :disabled="atStart" aria-label="Предыдущая карточка" @click="go(-1)">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><path d="M14 7l-5 5 5 5" /></svg>
        </button>
        <button type="button" class="tc-arrow" :disabled="atEnd" aria-label="Следующая карточка" @click="go(1)">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><path d="M10 7l5 5-5 5" /></svg>
        </button>
      </div>
    </div>

    <div ref="track" class="tc-track" @scroll.passive="onScroll">
      <article
        v-for="(f, i) in items"
        :key="f.title"
        class="tc-card"
        :class="'tc-card--' + TONES[i % TONES.length]"
      >
        <img class="tc-photo" :src="f.image" :alt="f.alt" loading="lazy" decoding="async" />
        <span class="tc-veil" aria-hidden="true"></span>
        <h3 class="tc-card-title">{{ titleCase(f.title) }}</h3>
        <div class="tc-foot">
          <p class="tc-text"><span class="tc-tag">{{ f.caption }}</span> — {{ f.text }}</p>
          <img class="tc-thumb" :src="f.image" alt="" loading="lazy" decoding="async" />
        </div>
      </article>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted } from 'vue'

defineProps({ items: { type: Array, required: true } })

// Чередование, как у Terminal (лайм → серый → тёмный), в цветах ESP
const TONES = ['brand', 'gray', 'dark', 'brand']

const track = ref(null)
const atStart = ref(true)
const atEnd = ref(false)

const titleCase = (s) => s.charAt(0) + s.slice(1).toLowerCase().replace('usbf', 'USBF')

const onScroll = () => {
  const el = track.value
  if (!el) return
  atStart.value = el.scrollLeft < 8
  atEnd.value = el.scrollLeft + el.clientWidth > el.scrollWidth - 8
}

const go = (dir) => {
  const el = track.value
  if (!el) return
  const card = el.querySelector('.tc-card')
  const step = card ? card.getBoundingClientRect().width + 16 : el.clientWidth * 0.8
  el.scrollBy({ left: dir * step, behavior: 'smooth' })
}

onMounted(onScroll)
</script>

<style scoped>
.tc {
  background: #fff;
  padding: clamp(4rem, 8vw, 7rem) 0 clamp(4rem, 8vw, 7rem);
}
.tc-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1.5rem;
  padding: 0 max(1.5rem, calc((100% - 90rem) / 2 + 1.5rem));
  margin-bottom: 2.5rem;
}
.tc-title {
  font-family: var(--font-display);
  font-weight: 400;
  font-size: clamp(1.4rem, 2vw, 1.9rem);
  line-height: 1.2;
  letter-spacing: -0.02em;
  color: #9a9a9a;
}
.tc-nav { display: flex; gap: 6px; flex-shrink: 0; }
.tc-arrow {
  width: 36px;
  height: 36px;
  display: grid;
  place-items: center;
  border-radius: 4px;
  background: #bdbdbd;
  color: var(--t-ink);
  transition: background-color 0.2s ease, opacity 0.2s ease;
}
.tc-arrow + .tc-arrow { background: #f0f0f0; }
.tc-arrow svg { width: 18px; height: 18px; }
.tc-arrow:hover:not(:disabled) { background: var(--t-accent); color: #fff; }
.tc-arrow:disabled { opacity: 0.45; cursor: default; }

.tc-track {
  display: grid;
  grid-auto-flow: column;
  grid-auto-columns: clamp(18rem, 40vw, 36rem);
  gap: 1rem;
  overflow-x: auto;
  scroll-snap-type: x mandatory;
  scroll-padding-left: max(1.5rem, calc((100% - 90rem) / 2 + 1.5rem));
  padding: 0 max(1.5rem, calc((100% - 90rem) / 2 + 1.5rem));
  scrollbar-width: none;
  overscroll-behavior-x: contain;
}
.tc-track::-webkit-scrollbar { display: none; }

.tc-card {
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  scroll-snap-align: start;
  min-height: clamp(26rem, 42vw, 36rem);
  padding: clamp(1.75rem, 4vw, 3.75rem) clamp(1.5rem, 5vw, 5rem) clamp(1.5rem, 3vw, 2.5rem) clamp(1.5rem, 4vw, 3.75rem);
  border-radius: 20px;
  overflow: hidden;
  isolation: isolate;
  color: var(--t-ink);
}
/* Фото размыто и стоит под сплошной цветной вуалью — без градиентов */
.tc-photo {
  position: absolute;
  inset: -24px;
  width: calc(100% + 48px);
  height: calc(100% + 48px);
  object-fit: cover;
  filter: blur(22px) saturate(0.8);
  z-index: -2;
}
.tc-veil { position: absolute; inset: 0; z-index: -1; }
.tc-card--brand { color: #fff; }
.tc-card--brand .tc-veil { background: rgba(0, 35, 102, 0.82); }
.tc-card--gray .tc-veil { background: rgba(190, 190, 190, 0.78); }
.tc-card--dark { color: #fff; }
.tc-card--dark .tc-veil { background: rgba(6, 24, 51, 0.86); }

.tc-card-title {
  font-family: var(--font-display);
  font-weight: 400;
  font-size: clamp(2rem, 3.2vw, 2.9rem);
  line-height: 0.98;
  letter-spacing: -0.02em;
  max-width: 13ch;
}
.tc-foot { display: grid; gap: 1.25rem; }
.tc-text { font-size: 1rem; line-height: 1.5; max-width: 34rem; }
.tc-tag { font-weight: 600; letter-spacing: 0.02em; text-transform: uppercase; }
/* Чёткий кадр под текстом: размытый фон и фото одного объекта читаются вместе */
.tc-thumb {
  width: 100%;
  aspect-ratio: 16 / 7;
  object-fit: cover;
  border-radius: 12px;
}
@media (max-width: 640px) {
  .tc-track { grid-auto-columns: 86vw; }
  .tc-thumb { aspect-ratio: 16 / 9; }
}
</style>
