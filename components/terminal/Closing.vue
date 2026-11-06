<template>
  <!-- Закрывающий баннер в подаче Terminal: тёмная секция, сверху светлый
       уступ с плавными плечами, огромный заголовок, кнопки-коробочки,
       крупные цифры и тонкие линии на фоне. -->
  <section class="tcl" aria-labelledby="tcl-title">
    <svg class="tcl-tab" viewBox="0 0 1440 40" preserveAspectRatio="none" aria-hidden="true">
      <path d="M0 0H1440V0H1010C990 0 982 32 952 32H488C458 32 450 0 430 0H0Z" fill="#fff" />
    </svg>
    <svg class="tcl-lines" viewBox="0 0 1440 700" preserveAspectRatio="none" aria-hidden="true">
      <path d="M-20 520 C 160 470, 220 300, 120 120" />
      <path d="M1460 160 C 1300 200, 1250 360, 1340 560" />
    </svg>

    <div class="tcl-inner">
      <span class="t-label tcl-label">Следующий шаг</span>
      <h2 id="tcl-title" class="tcl-title">Готовы к сотрудничеству?</h2>
      <p class="tcl-lead">
        Обсудим Ваш проект, подготовим индивидуальное решение и покажем, как опыт
        и передовые технологии в руках наших экспертов приводят к кристально чистому результату.
      </p>
      <div class="tcl-actions">
        <NuxtLink to="/contacts#contact-form" class="t-btn t-btn--accent">Обсудить проект</NuxtLink>
        <NuxtLink to="/contacts" class="t-btn t-btn--dark">Запросить презентацию</NuxtLink>
      </div>

      <ul class="tcl-metrics">
        <li v-for="m in metrics" :key="m.label">
          <span class="tcl-value">{{ m.value.toLocaleString('ru-RU') }}{{ m.suffix }}</span>
          <span class="tcl-mlabel">{{ m.label }}</span>
        </li>
      </ul>
    </div>
  </section>
</template>

<script setup>
defineProps({ metrics: { type: Array, required: true } })
</script>

<style scoped>
.tcl {
  position: relative;
  overflow: hidden;
  background: var(--t-dark);
  color: #fff;
  padding: clamp(6rem, 12vw, 10rem) 1.5rem clamp(4.5rem, 9vw, 7rem);
}
.tcl-tab { position: absolute; top: 0; left: 0; width: 100%; height: 40px; }
.tcl-lines { position: absolute; inset: 0; width: 100%; height: 100%; pointer-events: none; }
.tcl-lines path { fill: none; stroke: rgba(255, 255, 255, 0.08); stroke-width: 1; vector-effect: non-scaling-stroke; }
.tcl-inner { position: relative; max-width: 60rem; margin: 0 auto; text-align: center; }
.tcl-label { color: rgba(255, 255, 255, 0.55); }
.tcl-title {
  margin-top: 1.25rem;
  font-family: var(--font-display);
  font-weight: 400;
  font-size: clamp(2.6rem, 5.4vw, 4.6rem);
  line-height: 1;
  letter-spacing: -0.045em;
}
.tcl-lead { max-width: 40rem; margin: 1.5rem auto 0; font-size: 1.05rem; line-height: 1.6; color: rgba(255, 255, 255, 0.72); }
.tcl-actions { display: flex; flex-wrap: wrap; justify-content: center; gap: 0.6rem; margin-top: 2.25rem; }
.tcl-metrics {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  margin: clamp(3.5rem, 7vw, 5.5rem) auto 0;
  max-width: 52rem;
  padding: 0;
  list-style: none;
  border-top: 1px solid var(--t-line-dark);
}
.tcl-metrics li { display: grid; gap: 0.5rem; padding: 1.75rem 1rem 0; text-align: left; border-left: 1px solid var(--t-line-dark); }
.tcl-metrics li:first-child { border-left: 0; }
.tcl-value { font-family: var(--font-display); font-size: clamp(2.4rem, 4.4vw, 3.6rem); line-height: 1; letter-spacing: -0.04em; }
.tcl-mlabel { font-size: 0.85rem; line-height: 1.35; color: rgba(255, 255, 255, 0.6); }
@media (max-width: 640px) {
  .tcl-metrics { grid-template-columns: 1fr; }
  .tcl-metrics li { border-left: 0; border-top: 1px solid var(--t-line-dark); padding: 1.25rem 0; }
  .tcl-metrics li:first-child { border-top: 0; }
  .tcl-tab { height: 22px; }
}
</style>
