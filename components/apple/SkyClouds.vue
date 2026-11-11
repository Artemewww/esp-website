<template>
  <!-- Живое небо над съёмкой объекта: реалистичные облака-PNG без фона
       (те же, что в эксперименте «О компании») тремя слоями с параллаксом.
       Дальний слой — плоская гряда у горизонта, средний — мягкая пелена сверху,
       ближний — кучевые облака по краям, чтобы центр под текстом оставался чистым. -->
  <div class="sky" aria-hidden="true">
    <span class="sky-sun" />
    <img class="cl cl--top" src="/images/clouds.png" alt="" decoding="async" />
    <img class="cl cl--far" src="/images/about-story/cloud-b.webp" alt="" decoding="async" />
    <img class="cl cl--far2" src="/images/about-story/cloud-b.webp" alt="" decoding="async" />
    <img class="cl cl--l" src="/images/about-story/cloud-a.webp" alt="" decoding="async" />
    <img class="cl cl--r" src="/images/about-story/cloud-a.webp" alt="" decoding="async" />
  </div>
</template>

<style scoped>
.sky { position: absolute; inset: 0; overflow: hidden; background: linear-gradient(180deg, #1d4f93 0%, #3b72b8 38%, #7ea6d6 72%, #bdd6ed 100%); }
.sky-sun { position: absolute; right: 8%; top: -30%; width: 70vw; height: 70vw; max-width: 1100px; max-height: 1100px; border-radius: 50%; background: radial-gradient(circle, rgba(255, 248, 230, 0.45) 0%, rgba(255, 248, 230, 0) 60%); }
.cl { position: absolute; max-width: none; pointer-events: none; user-select: none; will-change: transform; }

/* мягкая пелена у верхнего края */
.cl--top { left: -8%; top: -14%; width: 116%; opacity: 0.5; animation: drift-m 120s linear infinite alternate; }
/* дальняя гряда у горизонта */
.cl--far { left: -10%; bottom: 6%; width: 75%; opacity: 0.9; animation: drift-a 140s linear infinite alternate; }
.cl--far2 { right: -18%; bottom: 12%; width: 70%; opacity: 0.75; animation: drift-m 160s linear infinite alternate; }
/* ближние кучевые по краям */
.cl--l { left: -12%; bottom: 2%; width: 36%; opacity: 0.95; filter: drop-shadow(0 18px 30px rgba(20, 50, 100, 0.18)); animation: drift-c 90s ease-in-out infinite alternate; }
.cl--r { right: -16%; top: 6%; width: 36%; opacity: 0.9; filter: drop-shadow(0 18px 30px rgba(20, 50, 100, 0.18)); animation: drift-d 100s ease-in-out infinite alternate; }

@keyframes drift-a { from { transform: translate3d(0, 0, 0); } to { transform: translate3d(9%, 0, 0); } }
@keyframes drift-m { from { transform: translate3d(0, 0, 0) scaleX(-1); } to { transform: translate3d(-8%, 0, 0) scaleX(-1); } }
@keyframes drift-c { from { transform: translate3d(0, 0, 0) scale(1); } to { transform: translate3d(14%, -3%, 0) scale(1.04); } }
@keyframes drift-d { from { transform: translate3d(0, 0, 0) scaleX(-1); } to { transform: translate3d(-12%, 2%, 0) scaleX(-1); } }

@media (max-width: 734px) {
  .cl--l { width: 70%; left: -30%; }
  .cl--r { width: 56%; right: -40%; top: -4%; opacity: 0.75; }
  .cl--far, .cl--far2 { width: 130%; }
}
@media (prefers-reduced-motion: reduce) { .cl { animation: none; } }
</style>
