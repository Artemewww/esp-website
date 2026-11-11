<template>
  <!-- #64: отзывы заказчиков — сканы писем в рамке, слайдером; ниже лента логотипов -->
  <section class="tb" aria-labelledby="tb-h">
    <div class="dj-wrap tb-head">
      <div>
        <span class="tb-eyebrow">{{ objectsCount }} объектов по&nbsp;всей Беларуси</span>
        <h2 id="tb-h" class="dj-h2 tb-h">Что говорят о&nbsp;нас заказчики</h2>
      </div>
      <div class="tb-nav">
        <button type="button" class="tb-arrow" aria-label="Предыдущие письма" :disabled="atStart" @click="scrollBy(-1)">
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M15 5l-7 7 7 7" /></svg>
        </button>
        <button type="button" class="tb-arrow" aria-label="Следующие письма" :disabled="atEnd" @click="scrollBy(1)">
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 5l7 7-7 7" /></svg>
        </button>
      </div>
    </div>

    <div ref="track" class="tb-track" @scroll.passive="onScroll">
      <button
        v-for="(r, i) in letters"
        :key="r.id"
        type="button"
        class="tb-card"
        :aria-label="`Открыть благодарственное письмо ${i + 1}`"
        @click="open = r"
      >
        <span class="tb-frame"><img :src="r.img" :alt="`Благодарственное письмо заказчика ESP, № ${i + 1}`" loading="lazy" decoding="async" /></span>
      </button>
    </div>

    <div class="dj-wrap tb-foot">
      <NuxtLink to="/about/reviews" class="dj-more">Все отзывы</NuxtLink>
      <NuxtLink to="/about/certifications" class="dj-more">Сертификаты</NuxtLink>
    </div>

    <div class="tb-logos" aria-label="Наши заказчики и партнёры">
      <div class="tb-logos__run">
        <span v-for="(l, i) in [...logos, ...logos]" :key="i" class="tb-logo" :aria-hidden="i >= logos.length">
          <img :src="l.src" :alt="i < logos.length ? l.name : ''" :width="l.w" :height="l.h" :style="{ width: `calc(${l.w}px * var(--tb-k))`, height: `calc(${l.h}px * var(--tb-k))` }" loading="lazy" decoding="async" />
        </span>
      </div>
    </div>

    <Teleport to="body">
      <div v-if="open" class="tb-lb" role="dialog" aria-modal="true" aria-label="Благодарственное письмо" @click.self="open = null">
        <button type="button" class="tb-lb__x" aria-label="Закрыть" @click="open = null">×</button>
        <img :src="open.full" alt="Благодарственное письмо заказчика ESP" />
      </div>
    </Teleport>
  </section>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { reviewLetters, clientLogos, objectsCount } from '~/composables/useTrust'

const letters = reviewLetters
const logos = clientLogos
const track = ref(null)
const open = ref(null)
const atStart = ref(true)
const atEnd = ref(false)

const onScroll = () => {
  const el = track.value
  if (!el) return
  atStart.value = el.scrollLeft < 8
  atEnd.value = el.scrollLeft + el.clientWidth > el.scrollWidth - 8
}
const scrollBy = (dir) => {
  const el = track.value
  if (el) el.scrollBy({ left: dir * el.clientWidth * 0.8, behavior: 'smooth' })
}
const onKey = (e) => { if (e.key === 'Escape') open.value = null }
onMounted(() => { onScroll(); window.addEventListener('keydown', onKey) })
onBeforeUnmount(() => window.removeEventListener('keydown', onKey))
</script>

<style scoped>
.tb { padding: clamp(72px, 9vw, 128px) 0; background: #fff; font-family: var(--dj-font); overflow: hidden; }
.tb-head { display: flex; align-items: flex-end; justify-content: space-between; gap: 24px; }
.tb-eyebrow { display: block; margin-bottom: 8px; font-size: 14px; font-weight: 600; letter-spacing: -0.01em; color: #002366; }
.tb-h { max-width: 20ch; text-wrap: balance; }
.tb-nav { display: flex; gap: 12px; flex-shrink: 0; }
.tb-arrow { display: grid; place-items: center; width: 44px; height: 44px; border-radius: 50%; background: #EDEDED; color: #1A1A1A; transition: background .3s, opacity .3s; }
.tb-arrow:hover:not(:disabled) { background: #D6D6D6; }
.tb-arrow:disabled { opacity: .35; cursor: default; }
.tb-arrow svg { width: 20px; height: 20px; fill: none; stroke: currentColor; stroke-width: 2; stroke-linecap: round; stroke-linejoin: round; }

.tb-track {
  display: flex; gap: 20px; margin-top: clamp(32px, 4vw, 48px);
  padding: 8px max(6.25vw, calc((100vw - 980px) / 2)) 28px;
  overflow-x: auto; scroll-snap-type: x mandatory; scroll-padding-inline: max(6.25vw, calc((100vw - 980px) / 2));
  scrollbar-width: none;
}
.tb-track::-webkit-scrollbar { display: none; }
.tb-card { flex: 0 0 clamp(220px, 24vw, 300px); scroll-snap-align: start; padding: 0; text-align: left; }
/* Рамка: светлое паспарту + тонкий кант, письмо «лежит» на нём с тенью */
.tb-frame {
  display: block; aspect-ratio: 3 / 4; padding: 14px; border-radius: var(--r-md);
  background: linear-gradient(180deg, #EDEDED, #EDEDED);
  box-shadow: inset 0 0 0 .5px rgba(0, 0, 0, .14);
  transition: transform .6s cubic-bezier(.2, .8, .2, 1), box-shadow .6s;
}
.tb-frame img { width: 100%; height: 100%; object-fit: cover; object-position: top; background: #fff; border-radius: 4px; box-shadow: 0 0 0 .5px rgba(0, 0, 0, .12), 0 8px 20px rgba(0, 0, 0, .08); }
.tb-card:hover .tb-frame { transform: translateY(-6px); box-shadow: inset 0 0 0 .5px rgba(0, 0, 0, .18), 0 18px 40px rgba(0, 35, 102, .1); }

.tb-foot { display: flex; flex-wrap: wrap; gap: 12px 32px; }

.tb-logos { --tb-k: 1; margin-top: clamp(48px, 6vw, 80px); padding: 16px 0;
  -webkit-mask-image: linear-gradient(90deg, transparent, #000 10%, #000 90%, transparent); mask-image: linear-gradient(90deg, transparent, #000 10%, #000 90%, transparent); }
.tb-logos__run { display: flex; width: max-content; animation: tb-run 50s linear infinite; }
.tb-logos:hover .tb-logos__run { animation-play-state: paused; }
/* Ячейка не обрезает: картинка задаёт свой размер (равная площадь, см. useTrust) */
.tb-logo { display: flex; align-items: center; justify-content: center; flex-shrink: 0; height: calc(72px * var(--tb-k)); padding: 0 calc(28px * var(--tb-k)); }
.tb-logo img { display: block; max-width: none; object-fit: contain; filter: grayscale(1); opacity: .7; transition: filter .4s, opacity .4s; }
.tb-logo:hover img { filter: none; opacity: 1; }
@keyframes tb-run { to { transform: translateX(-50%); } }
@media (prefers-reduced-motion: reduce) { .tb-logos__run { animation: none; flex-wrap: wrap; width: auto; justify-content: center; } }

.tb-lb { position: fixed; inset: 0; z-index: 1000; display: flex; align-items: center; justify-content: center; padding: 16px; background: rgba(11, 13, 16, .88); backdrop-filter: blur(8px); }
.tb-lb img { max-width: min(760px, 100%); max-height: 90vh; object-fit: contain; border-radius: var(--r-xs); background: #fff; }
.tb-lb__x { position: absolute; top: 16px; right: 16px; width: 44px; height: 44px; border-radius: 50%; background: rgba(255, 255, 255, .16); color: #fff; font-size: 26px; line-height: 1; }

@media (max-width: 767px) {
  .tb-nav { display: none; }
  .tb-track { gap: 14px; padding-inline: 16px; scroll-padding-inline: 16px; }
  .tb-card { flex-basis: 68vw; }
  .tb-foot { padding-inline: 16px; }
  .tb-logos { --tb-k: .72; }
}
</style>
