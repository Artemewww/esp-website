<template>
  <!-- 7 шагов в подаче «глава» Apple: слева липкое фото с кроссфейдом,
       справа список шагов; активный подсвечивается при прокрутке.
       До 1024px — вертикальные карточки, на компьютере — горизонтальные; везде карточки наезжают друг на друга. -->
  <div class="tk">
    <div class="tk-media" aria-hidden="true">
      <div class="tk-frame">
        <img
          v-for="(st, i) in steps"
          :key="st.slug"
          :src="st.image"
          alt=""
          :class="{ 'is-on': active === i }"
          :loading="i === 0 ? 'eager' : 'lazy'"
          decoding="async"
        />
        <span class="tk-badge">{{ steps[active]?.num }} / {{ String(steps.length).padStart(2, '0') }}</span>
      </div>
    </div>

    <ol class="tk-list">
      <li
        v-for="(st, i) in steps"
        :key="st.slug"
        ref="items"
        :data-i="i"
        class="tk-step"
        :class="{ 'is-on': active === i }"
        :style="{ '--i': i }"
      >
        <NuxtLink :to="`/services/process/${st.slug}`" class="tk-img" :class="{ 'tk-img--contain': st.fit === 'contain' }" tabindex="-1" aria-hidden="true">
          <img :src="st.image" alt="" loading="lazy" decoding="async" />
        </NuxtLink>
        <span class="tk-num">{{ st.num }}</span>
        <h3 class="tk-title">{{ st.title }}</h3>
        <p class="tk-desc">{{ st.desc }}</p>
        <ul class="tk-points">
          <li v-for="d in st.details" :key="d">{{ d }}</li>
        </ul>
        <NuxtLink :to="`/services/process/${st.slug}`" class="tk-more" @focus="active = i">
          Подробнее ›
        </NuxtLink>
      </li>
    </ol>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'

defineProps({ steps: { type: Array, required: true } })

const active = ref(0)
const items = ref([])
let io = null

onMounted(() => {
  io = new IntersectionObserver((entries) => {
    for (const e of entries) {
      if (e.isIntersecting) active.value = Number(e.target.dataset.i)
    }
  }, { rootMargin: '-45% 0px -50% 0px' })
  items.value.forEach((el) => io.observe(el))
})
onBeforeUnmount(() => io?.disconnect())
</script>

<style scoped>
.tk {
  --tk-top: calc(var(--dj-header-h, 48px) + 52px + 28px);
  display: grid;
  grid-template-columns: minmax(0, 1.15fr) minmax(0, 1fr);
  gap: clamp(40px, 5vw, 80px);
  max-width: 1200px;
  margin: clamp(48px, 5vw, 72px) auto 0;
  padding: 0 22px;
  font-family: var(--dj-font);
}
.tk-media { position: relative; }
.tk-frame {
  position: sticky;
  top: var(--tk-top);
  height: min(calc(100vh - var(--tk-top) - 40px), 640px);
  border-radius: var(--r-lg);
  overflow: hidden;
  background: #EDEDED;
}
.tk-frame img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; opacity: 0; transform: scale(1.04); transition: opacity 0.8s var(--dj-ease), transform 1.4s var(--dj-ease); }
.tk-frame img.is-on { opacity: 1; transform: none; }
.tk-badge { position: absolute; left: 20px; top: 18px; padding: 5px 12px; border-radius: var(--r-pill); font-size: 12px; font-weight: 600; color: var(--dj-ink); font-variant-numeric: tabular-nums; background: rgba(255, 255, 255, 0.86); backdrop-filter: blur(10px); -webkit-backdrop-filter: blur(10px); }

.tk-list { list-style: none; margin: 0; padding: 12vh 0 30vh; }
.tk-step {
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 40px 0;
  min-height: 46vh;
  justify-content: center;
  border-top: 1px solid #D6D6D6;
}
.tk-step:first-child { border-top: 0; }
.tk-img { display: none; }
.tk-num { font-size: 14px; font-weight: 600; letter-spacing: 0.02em; color: #8A8A8A; font-variant-numeric: tabular-nums; transition: color 0.4s ease; }
.tk-title { margin: 0; font-size: clamp(24px, 2.2vw, 32px); line-height: 1.125; font-weight: 600; letter-spacing: 0.004em; color: #8A8A8A; transition: color 0.4s ease; }
.tk-desc { margin: 0; font-size: 17px; line-height: 1.47; letter-spacing: -0.022em; color: #5E5E5E; }
.tk-points { display: grid; gap: 6px; margin: 4px 0 0; padding: 0; list-style: none; }
.tk-points li { position: relative; padding-left: 18px; font-size: 14px; line-height: 1.43; letter-spacing: -0.016em; color: #5E5E5E; }
.tk-points li::before { content: ''; position: absolute; left: 2px; top: 0.35em; width: 5px; height: 9px; border: solid var(--dj-blue); border-width: 0 1.5px 1.5px 0; transform: rotate(45deg); }
.tk-more { margin-top: 6px; font-size: 17px; line-height: 1.47; letter-spacing: -0.022em; color: #002366; }
.tk-more:hover { text-decoration: underline; }
.tk-step.is-on .tk-num { color: var(--dj-blue); }
.tk-step.is-on .tk-title { color: var(--dj-ink); }

@media (max-width: 1023px) {
  .tk { grid-template-columns: minmax(0, 1fr); gap: 0; padding: 0 16px; }
  .tk-media { display: none; }
  .tk-list { padding: 0; display: grid; gap: 16px; }
  .tk-step { min-height: 0; padding: 0 0 24px; border: 0; border-radius: var(--r-md); background: #fff; overflow: hidden; }
  .tk-step > :not(.tk-img) { margin-left: 20px; margin-right: 20px; }
  .tk-img { display: block; aspect-ratio: 4 / 3; overflow: hidden; background: #EDEDED; margin-bottom: 8px; }
  .tk-img img { width: 100%; height: 100%; object-fit: cover; }
  .tk-num { color: var(--dj-blue); }
  .tk-title { color: var(--dj-ink); font-size: 24px; }
  /* #20: карточки этапов наезжают друг на друга при прокрутке (sticky stack) */
  .tk-list { gap: 20px; padding-bottom: 8px; }
  .tk-step {
    position: sticky;
    top: calc(var(--dj-header-h, 44px) + 12px + var(--i, 0) * 10px);
    box-shadow: var(--sh-2);
  }
}
@media (max-width: 767px) {
  .tk-img { aspect-ratio: 16 / 10; }
}

/* Компьютер: карточки этапов наезжают друг на друга (как на телефоне и планшете) —
   фото слева, текст справа, каждая следующая прилипает поверх предыдущей */
@media (min-width: 1024px) {
  .tk { grid-template-columns: minmax(0, 1fr); gap: 0; max-width: 1180px; }
  .tk-media { display: none; }
  .tk-list { display: grid; gap: 28px; padding: 0 0 12vh; }
  .tk-step {
    position: sticky;
    top: calc(var(--dj-header-h, 44px) + 24px + var(--i, 0) * 14px);
    display: grid;
    grid-template-columns: minmax(0, 1.1fr) minmax(0, 1fr);
    grid-template-rows: auto auto auto auto 1fr;
    column-gap: clamp(32px, 4vw, 64px);
    row-gap: 10px;
    align-content: center;
    min-height: min(560px, calc(100vh - var(--dj-header-h, 44px) - 120px));
    padding: 0;
    overflow: hidden;
    border: 0;
    border-radius: var(--r-lg);
    background: #fff;
    box-shadow: var(--sh-2);
  }
  /* Как главы «Одна система ESP»: фото во всю левую половину карточки, без отступов */
  .tk-img { display: block; grid-column: 1; grid-row: 1 / -1; align-self: stretch; overflow: hidden; border-radius: 0; background: #EDEDED; }
  .tk-img img { width: 100%; height: 100%; object-fit: cover; }
  .tk-img--contain { background: #fff; }
  .tk-img--contain img { object-fit: contain; padding: 6%; }
  .tk-step > :not(.tk-img) { grid-column: 2; padding-right: clamp(28px, 4vw, 56px); }
  .tk-step > .tk-num { padding-top: clamp(28px, 3vw, 44px); }
  .tk-step > .tk-more { padding-bottom: clamp(28px, 3vw, 44px); }
  .tk-num { color: var(--dj-blue); align-self: end; }
  .tk-title { color: var(--dj-ink); }
  .tk-more { align-self: start; }
}

@media (prefers-reduced-motion: reduce) {
  .tk-frame img, .tk-num, .tk-title { transition: none; }
  .tk-frame img { transform: none; }
}
</style>
