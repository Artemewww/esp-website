<template>
  <!-- Три цифры в стиле бенто главной: синяя плитка с точечной картой Беларуси,
       «30 000» — точки слетаются в знак ESP, «0» и «28 лет» — стальные цифры под водой -->
  <div class="st">
    <div class="st-t st-t--map dj-reveal">
      <HomeBentoDotMap class="st-map" />
      <b class="st-num">2000<em>+</em></b>
      <span class="st-label">Реализованных объектов за 28 лет</span>
    </div>
    <NuxtLink to="/about#ecosystem" class="st-t st-t--dots dj-reveal">
      <HomeBentoParticles class="st-dots" @progress="(p) => (count = Math.round(30000 * p))" />
      <b class="st-num">{{ count.toLocaleString('ru-RU') }}</b>
      <span class="st-label">Элементов под контролем</span>
    </NuxtLink>
    <!-- «0» и «28 лет» — объёмные стальные цифры под водой (как «Lean»); число на картинке, текст скрыт для зрения -->
    <NuxtLink to="/equipment#support" class="st-t st-t--img dj-reveal">
      <img class="st-cover" src="/images/about/zero-steel.webp" alt="" aria-hidden="true" loading="lazy" decoding="async" />
      <b class="st-num st-sr">0</b>
      <span class="st-label">Аварийных сбоев</span>
    </NuxtLink>
    <NuxtLink to="/about#history" class="st-t st-t--img dj-reveal">
      <img class="st-cover" src="/images/about/years-28.webp" alt="" aria-hidden="true" loading="lazy" decoding="async" />
      <b class="st-num st-sr">28 лет</b>
      <span class="st-label">Лет опыта в очистке воды</span>
    </NuxtLink>
  </div>
</template>

<script setup>
import { ref } from 'vue'
// SSR и браузер без JS видят итог; частицы при подлёте обнуляют и докручивают счётчик
const count = ref(30000)
</script>

<style scoped>
.st { display: grid; grid-template-columns: 1.3fr 1fr 1fr 1fr; gap: clamp(12px, 1.4vw, 20px); width: min(1180px, 87.5vw); margin: 0 auto; }
.st-t { position: relative; display: flex; flex-direction: column; justify-content: flex-end; gap: 6px; min-height: clamp(220px, 22vw, 300px); padding: clamp(20px, 2.2vw, 32px); overflow: hidden; isolation: isolate; border-radius: var(--r-lg, 28px); background: #EDEDED; color: #1A1A1A; text-decoration: none; font-family: var(--dj-font); transition: transform 0.4s cubic-bezier(0.22, 1, 0.36, 1); }
.st-t:hover { transform: translateY(-4px); }
.st-t > :not(.st-map):not(.st-dots):not(.st-cover) { position: relative; z-index: 1; }
.st-num { font-size: clamp(40px, 3.6vw, 58px); line-height: 1; font-weight: 600; letter-spacing: -0.03em; font-variant-numeric: tabular-nums; white-space: nowrap; }
.st-num em { font-style: normal; color: #002366; }
.st-label { max-width: 24ch; font-size: clamp(15px, 1.2vw, 17px); line-height: 1.3; letter-spacing: -0.016em; color: #3D3D3D; }
/* 2000+ — как герой-плитка главной */
.st-t--map { color: #fff; background: radial-gradient(120% 90% at 85% 10%, #1b56b8 0%, rgba(27, 86, 184, 0) 55%), linear-gradient(160deg, #002366 0%, #002366 70%); }
.st-t--map .st-num em { color: #7fb2ff; }
.st-t--map .st-label { color: rgba(255, 255, 255, 0.8); }
.st-map { position: absolute; top: 6%; right: 4%; width: 62%; z-index: 0; pointer-events: none; }
/* 30 000 — частицы во всю плитку */
.st-dots { position: absolute; inset: 0; z-index: 0; }
/* 0 сбоев — щит в правом верхнем углу, как «5 лет гарантии» */
.st-art { position: absolute; z-index: 0; right: 9%; top: 12%; height: min(52%, 140px); width: auto; pointer-events: none; transition: transform 0.6s cubic-bezier(0.22, 1, 0.36, 1); }
.st-t--shield:hover .st-art { transform: translateY(-6px); }
/* Картинка во всю плитку, подпись белым на мягком затемнении */
.st-t--img { color: #fff; background: #002366; }
.st-cover { position: absolute; inset: 0; z-index: 0; width: 100%; height: 100%; object-fit: cover; object-position: center 30%; transition: transform 1.2s cubic-bezier(0.22, 1, 0.36, 1); }
.st-t--img:hover .st-cover { transform: scale(1.04); }
.st-t--img::after { content: ''; position: absolute; inset: 0; z-index: 0; background: linear-gradient(180deg, transparent 50%, rgba(0, 20, 60, 0.8) 100%); pointer-events: none; }
.st-t--img .st-label { color: #fff; }
.st-sr { position: absolute !important; width: 1px; height: 1px; overflow: hidden; clip: rect(0 0 0 0); white-space: nowrap; }
@media (max-width: 1100px) {
  .st { grid-template-columns: 1fr 1fr; }
}
@media (max-width: 560px) { .st { grid-template-columns: 1fr; } }
</style>
