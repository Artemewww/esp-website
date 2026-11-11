<template>
  <!-- Финал в подаче Watergen: по небу плывут крупные размытые буквы заголовка,
       при появлении блока они собираются и становятся резкими. -->
  <section ref="root" class="wf" aria-labelledby="wf-title">
    <WgSky class="wf-sky" />
    <h2 id="wf-title" class="wf-title" :class="{ 'is-in': inView }">
      <span v-for="(w, wi) in words" :key="wi" class="wf-word">
        <span
          v-for="ch in w"
          :key="ch.i"
          class="wf-ch"
          :style="{ '--dx': ch.dx + 'px', '--dy': ch.dy + 'px', '--d': (ch.i * 0.025) + 's' }"
        >{{ ch.c }}</span>
      </span>
    </h2>
    <p class="wf-lead">
      Обсудим Ваш проект, подготовим индивидуальное решение и покажем, как опыт
      и передовые технологии в руках наших экспертов приводят к кристально чистому результату.
    </p>
    <div class="wf-actions">
      <NuxtLink to="/contacts#contact-form" class="wg-pill wg-pill--solid">
        Обсудить проект
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
      </NuxtLink>
      <NuxtLink to="/contacts" class="wg-pill wg-pill--ghost">Запросить презентацию</NuxtLink>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const TEXT = 'Готовы к сотрудничеству?'
// Стартовые смещения букв фиксированы, чтобы сервер и браузер рисовали одно и то же
// Буквы собраны по словам: так строка переносится только между словами
let n = 0
const words = TEXT.split(' ').map((w) => [...w].map((c) => { const i = n++; return { c, i, dx: Math.round(Math.sin(i * 12.9898) * 160), dy: Math.round(Math.cos(i * 78.233) * 90) } }))

const root = ref(null)
const inView = ref(false)
let io = null
onMounted(() => {
  io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { inView.value = true; io.disconnect() } }, { threshold: 0.35 })
  if (root.value) io.observe(root.value)
})
onUnmounted(() => io?.disconnect())
</script>

<style scoped>
.wf {
  position: relative;
  overflow: hidden;
  padding: clamp(7rem, 14vw, 11rem) 1.5rem clamp(6rem, 11vw, 9rem);
  text-align: center;
}
.wf-sky { position: absolute; inset: 0; opacity: 0.85; }
.wf-title {
  position: relative;
  font-family: var(--font-display);
  font-weight: 700;
  font-size: clamp(2.4rem, 5.6vw, 4rem);
  line-height: 1.05;
  letter-spacing: -0.015em;
  color: var(--wg-ink);
}
.wf-word { display: inline-block; white-space: nowrap; margin: 0 0.12em; }
.wf-ch {
  display: inline-block;
  transform: translate(var(--dx), var(--dy)) scale(1.4);
  filter: blur(14px);
  opacity: 0.35;
  transition: transform 1.4s cubic-bezier(0.16, 1, 0.3, 1) var(--d), filter 1.2s ease var(--d), opacity 1.2s ease var(--d);
}
.wf-title.is-in .wf-ch { transform: none; filter: none; opacity: 1; }
.wf-lead { position: relative; max-width: 36rem; margin: 1.4rem auto 0; font-size: 1rem; line-height: 1.6; color: var(--wg-text); }
.wf-actions { position: relative; display: flex; flex-wrap: wrap; justify-content: center; gap: 0.5rem; margin-top: 2rem; }
@media (prefers-reduced-motion: reduce) {
  .wf-ch { transform: none; filter: none; opacity: 1; transition: none; }
}
</style>
