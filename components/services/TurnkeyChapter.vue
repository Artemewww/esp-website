<template>
  <!-- 7 шагов в подаче «глава» Apple: слева липкое фото с кроссфейдом,
       справа список шагов; активный подсвечивается при прокрутке.
       До 1024px — вертикальные карточки: фото сверху, текст снизу. -->
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
        <NuxtLink :to="`/services/process/${st.slug}`" class="tk-img" tabindex="-1" aria-hidden="true">
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
  border-radius: 28px;
  overflow: hidden;
  background: #e8e8ed;
}
.tk-frame img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; opacity: 0; transform: scale(1.04); transition: opacity 0.8s var(--dj-ease), transform 1.4s var(--dj-ease); }
.tk-frame img.is-on { opacity: 1; transform: none; }
.tk-badge { position: absolute; left: 20px; top: 18px; padding: 5px 12px; border-radius: 999px; font-size: 12px; font-weight: 600; color: var(--dj-ink); font-variant-numeric: tabular-nums; background: rgba(255, 255, 255, 0.86); backdrop-filter: blur(10px); -webkit-backdrop-filter: blur(10px); }

.tk-list { list-style: none; margin: 0; padding: 12vh 0 30vh; }
.tk-step {
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 40px 0;
  min-height: 46vh;
  justify-content: center;
  border-top: 1px solid #d2d2d7;
}
.tk-step:first-child { border-top: 0; }
.tk-img { display: none; }
.tk-num { font-size: 14px; font-weight: 600; letter-spacing: 0.02em; color: #86868b; font-variant-numeric: tabular-nums; transition: color 0.4s ease; }
.tk-title { margin: 0; font-size: clamp(24px, 2.2vw, 32px); line-height: 1.125; font-weight: 600; letter-spacing: 0.004em; color: #86868b; transition: color 0.4s ease; }
.tk-desc { margin: 0; font-size: 17px; line-height: 1.47; letter-spacing: -0.022em; color: #6e6e73; }
.tk-points { display: grid; gap: 6px; margin: 4px 0 0; padding: 0; list-style: none; }
.tk-points li { position: relative; padding-left: 18px; font-size: 14px; line-height: 1.43; letter-spacing: -0.016em; color: #6e6e73; }
.tk-points li::before { content: ''; position: absolute; left: 2px; top: 0.35em; width: 5px; height: 9px; border: solid var(--dj-blue); border-width: 0 1.5px 1.5px 0; transform: rotate(45deg); }
.tk-more { margin-top: 6px; font-size: 17px; line-height: 1.47; letter-spacing: -0.022em; color: #0066cc; }
.tk-more:hover { text-decoration: underline; }
.tk-step.is-on .tk-num { color: var(--dj-blue); }
.tk-step.is-on .tk-title { color: var(--dj-ink); }

@media (max-width: 1023px) {
  .tk { grid-template-columns: minmax(0, 1fr); gap: 0; padding: 0 16px; }
  .tk-media { display: none; }
  .tk-list { padding: 0; display: grid; gap: 16px; }
  .tk-step { min-height: 0; padding: 0 0 24px; border: 0; border-radius: 18px; background: #fff; overflow: hidden; }
  .tk-step > :not(.tk-img) { margin-left: 20px; margin-right: 20px; }
  .tk-img { display: block; aspect-ratio: 4 / 3; overflow: hidden; background: #e8e8ed; margin-bottom: 8px; }
  .tk-img img { width: 100%; height: 100%; object-fit: cover; }
  .tk-num { color: var(--dj-blue); }
  .tk-title { color: var(--dj-ink); font-size: 24px; }
  /* #20: карточки этапов наезжают друг на друга при прокрутке (sticky stack) */
  .tk-list { gap: 20px; padding-bottom: 8px; }
  .tk-step {
    position: sticky;
    top: calc(var(--dj-header-h, 44px) + 12px + var(--i, 0) * 10px);
    box-shadow: 0 -1px 0 rgba(0, 0, 0, .04), 0 -10px 30px rgba(0, 35, 102, .10);
  }
}
@media (max-width: 767px) {
  .tk-img { aspect-ratio: 16 / 10; }
}
@media (prefers-reduced-motion: reduce) {
  .tk-frame img, .tk-num, .tk-title { transition: none; }
  .tk-frame img { transform: none; }
}
</style>
