<template>
  <!-- «Решения по отраслям»: карточки по образцу владельца — светлое небо кадра,
       заголовок слева сверху, объект внизу. Главная и мобильная /solutions. -->
  <div>
    <div v-for="s in solutions" :key="s.slug" class="hm-sc dj-reveal">
      <img class="hm-sc__img" :srcset="srcset(FIELD_COVERS[s.slug] || s.cover)" sizes="(max-width: 734px) 100vw, 33vw" :src="FIELD_COVERS[s.slug] || s.cover" :alt="s.title" loading="lazy" decoding="async" />
      <NuxtLink :to="`/solutions/${s.slug}`" class="hm-sc__hit" :aria-label="s.title" tabindex="-1" />
      <div class="hm-sc__text">
        <h3 class="hm-sc__title">{{ s.title }}</h3>
        <p class="hm-sc__sub">{{ s.short }}</p>
        <div class="hm-sc__act">
          <NuxtLink :to="`/solutions/${s.slug}`" class="hm-sc__btn">Подробнее <i>›</i></NuxtLink>
          <NuxtLink to="/contacts#contact-form" class="hm-sc__btn hm-sc__btn--line">Обсудить проект</NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { srcset } from '~/composables/useSrcset'
import { solutions } from '~/composables/useSiteNav'

// обложка по slug отрасли (пусто — берётся cover из useSiteNav)
const FIELD_COVERS = {
  vodokanaly: '/images/solutions/cover/vodokanaly.webp',
  agrokompleksy: '/images/solutions/cover/agrokompleksy.webp',
  'pishchevaya-promyshlennost': '/images/solutions/cover/pishchevaya-promyshlennost.webp',
  'chastnye-i-kommercheskie': '/images/solutions/cover/chastnye-i-kommercheskie.webp'
}
</script>

<style scoped>
.hm-sc { position: relative; aspect-ratio: 1 / 1; overflow: hidden; border-radius: var(--r-lg); background: #dbe9f8; isolation: isolate; box-shadow: var(--sh-2); transition: transform 0.6s var(--dj-ease), box-shadow 0.6s var(--dj-ease); }
.hm-sc:hover { transform: translateY(-4px); box-shadow: var(--sh-3); }
.hm-sc__img { position: absolute; inset: 0; z-index: -1; width: 100%; height: 100%; object-fit: cover; object-position: center bottom; transition: transform 1.4s var(--dj-ease); }
.hm-sc:hover .hm-sc__img { transform: scale(1.03); }
.hm-sc__hit { position: absolute; inset: 0; z-index: 0; }
.hm-sc__text { position: relative; z-index: 1; display: grid; justify-items: start; gap: 10px; padding: clamp(28px, 3.6vw, 52px) clamp(26px, 3.6vw, 52px) 0; pointer-events: none; }
.hm-sc__title { margin: 0; max-width: 12em; font-size: clamp(28px, 3.3vw, 48px); line-height: 1.06; font-weight: 700; letter-spacing: -0.02em; color: #1A1A1A; text-wrap: balance; }
.hm-sc__sub { margin: 0; max-width: 24ch; font-size: clamp(17px, 1.55vw, 22px); line-height: 1.3; letter-spacing: -0.012em; color: #2b2f36; }
.hm-sc__act { display: flex; flex-wrap: wrap; gap: 12px; margin-top: clamp(10px, 1.4vw, 18px); pointer-events: auto; }
.hm-sc__btn { display: inline-flex; align-items: center; gap: 8px; min-height: 48px; padding: 0 28px; border-radius: var(--r-pill); font-size: 17px; letter-spacing: -0.016em; color: #fff; background: #002366; box-shadow: var(--sh-2); transition: background-color 0.25s ease, transform 0.25s ease; }
.hm-sc__btn:hover { background: #002366; }
.hm-sc__btn i { font-style: normal; transition: transform 0.25s ease; }
.hm-sc__btn:hover i { transform: translateX(3px); }
.hm-sc__btn--line { color: #002366; background: rgba(255, 255, 255, 0.55); box-shadow: inset 0 0 0 1.5px #002366; backdrop-filter: blur(8px); -webkit-backdrop-filter: blur(8px); }
.hm-sc__btn--line:hover { background: rgba(255, 255, 255, 0.85); }
@media (max-width: 734px) {
  /* компактнее: квадрат вместо 4:5, текст и кнопки меньше */
  .hm-sc { aspect-ratio: 1 / 1; border-radius: var(--r-lg); }
  .hm-sc__text { gap: 6px; padding: 22px 20px 0; }
  .hm-sc__title { font-size: 25px; }
  .hm-sc__sub { font-size: 15px; }
  .hm-sc__act { gap: 8px; margin-top: 6px; }
  .hm-sc__btn { min-height: 40px; padding: 0 16px; font-size: 15px; }
}
</style>
