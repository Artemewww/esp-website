<template>
  <!-- Фирменная заглушка вместо слабого фото: чертёжная сетка ESP, контурная
       схема типа оборудования с размерными метками и табличка с названием —
       как штамп инженерного листа. Без генерации, только CSS/SVG. -->
  <div class="ebr" :class="{ 'ebr--compact': compact }" role="img" :aria-label="item?.name">
    <span class="ebr-grid" aria-hidden="true" />
    <span class="ebr-glow" aria-hidden="true" />
    <div class="ebr-fig" aria-hidden="true">
      <span class="ebr-tick ebr-tick--tl" /><span class="ebr-tick ebr-tick--tr" />
      <span class="ebr-tick ebr-tick--bl" /><span class="ebr-tick ebr-tick--br" />
      <EquipPlaceholder :kind="placeholderOf(item)" class="ebr-ph" label="" />
    </div>
    <div v-if="!compact" class="ebr-plate">
      <span class="ebr-mark">ESP</span>
      <span class="ebr-meta"><b>{{ item?.name }}</b><small>{{ item?.category || 'Оборудование ESP' }} · схема</small></span>
    </div>
  </div>
</template>

<script setup>
import { placeholderOf } from '~/utils/equipVisual'
defineProps({ item: { type: Object, default: null }, compact: Boolean })
</script>

<style scoped>
.ebr { position: absolute; inset: 0; overflow: hidden; display: grid; place-items: center; background: radial-gradient(90% 70% at 50% 60%, #ffffff 0%, #eef2f8 60%, #e3e9f2 100%); color: #0a3a8c; font-family: var(--dj-font); }
.ebr-grid { position: absolute; inset: 0; background-image:
  linear-gradient(rgba(10, 58, 140, 0.07) 1px, transparent 1px),
  linear-gradient(90deg, rgba(10, 58, 140, 0.07) 1px, transparent 1px),
  linear-gradient(rgba(10, 58, 140, 0.035) 1px, transparent 1px),
  linear-gradient(90deg, rgba(10, 58, 140, 0.035) 1px, transparent 1px);
  background-size: 96px 96px, 96px 96px, 24px 24px, 24px 24px; background-position: center;
  -webkit-mask-image: radial-gradient(75% 70% at 50% 55%, #000 30%, transparent 100%); mask-image: radial-gradient(75% 70% at 50% 55%, #000 30%, transparent 100%); }
.ebr-glow { position: absolute; left: 50%; top: 62%; width: 60%; aspect-ratio: 1; transform: translate(-50%, -50%); border-radius: 50%; background: radial-gradient(closest-side, rgba(47, 127, 240, 0.12), transparent); }
.ebr-fig { position: absolute; left: 50%; bottom: 12%; display: grid; place-items: center; height: min(44%, 440px); aspect-ratio: 1; transform: translateX(-50%); }
.ebr-fig .ebr-ph { width: 100%; height: auto; color: #0a3a8c; stroke-width: 1.1; }
.ebr-tick { position: absolute; width: 18px; height: 18px; border: 0 solid rgba(10, 58, 140, 0.45); }
.ebr-tick--tl { left: 0; top: 0; border-left-width: 1.5px; border-top-width: 1.5px; }
.ebr-tick--tr { right: 0; top: 0; border-right-width: 1.5px; border-top-width: 1.5px; }
.ebr-tick--bl { left: 0; bottom: 0; border-left-width: 1.5px; border-bottom-width: 1.5px; }
.ebr-tick--br { right: 0; bottom: 0; border-right-width: 1.5px; border-bottom-width: 1.5px; }
.ebr-plate { position: absolute; right: clamp(16px, 3vw, 40px); bottom: clamp(24px, 3vw, 32px); display: flex; align-items: stretch; max-width: min(360px, calc(100% - 32px)); border: 1px solid rgba(10, 58, 140, 0.3); border-radius: 10px; background: rgba(255, 255, 255, 0.7); backdrop-filter: blur(8px); -webkit-backdrop-filter: blur(8px); font-size: 12px; line-height: 1.3; }
.ebr-mark { display: grid; place-items: center; padding: 0 12px; border-right: 1px solid rgba(10, 58, 140, 0.3); font-weight: 700; letter-spacing: 0.08em; color: #fff; background: #002366; border-radius: 9px 0 0 9px; }
.ebr-meta { display: grid; gap: 2px; padding: 8px 12px; min-width: 0; }
.ebr-meta b { font-weight: 600; color: #1d1d1f; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.ebr-meta small { font-size: 11px; color: #5b6b85; }
.ebr--compact .ebr-fig { top: 50%; bottom: auto; height: 66%; transform: translate(-50%, -50%); }
.ebr--compact .ebr-glow { top: 50%; }
.ebr--compact .ebr-fig .ebr-ph { stroke-width: 1.6; }
.ebr--compact .ebr-tick { width: 10px; height: 10px; }
@media (max-width: 734px) {
  .ebr:not(.ebr--compact) .ebr-fig { height: min(34%, 300px); bottom: 150px; }
  .ebr-plate { left: 16px; right: 16px; max-width: none; bottom: 76px; }
}
</style>
