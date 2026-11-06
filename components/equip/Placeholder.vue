<template>
  <!-- Заглушка вместо фото: серый контур того, что здесь будет. Когда появится
       качественный рендер, он встанет поверх и заглушка уйдёт. -->
  <svg class="eqp" viewBox="0 0 120 120" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" role="img" :aria-label="label">
    <template v-if="kind === 'pump-station'">
      <ellipse cx="60" cy="28" rx="26" ry="8" />
      <path d="M34 28v62c0 4.4 11.6 8 26 8s26-3.6 26-8V28" />
      <rect x="48" y="66" width="24" height="22" rx="4" />
      <path d="M60 66V46h22M82 46v-8" />
      <path d="M20 98h80" opacity=".5" />
    </template>
    <template v-else-if="kind === 'bio'">
      <rect x="18" y="34" width="84" height="58" rx="6" />
      <path d="M18 50h84" />
      <circle cx="38" cy="78" r="3" /><circle cx="52" cy="70" r="2.5" /><circle cx="64" cy="80" r="3" /><circle cx="78" cy="68" r="2.5" /><circle cx="88" cy="78" r="3" />
      <path d="M60 34V20h24" />
    </template>
    <template v-else-if="kind === 'storm'">
      <path d="M36 44h44a14 14 0 000-28 20 20 0 00-38 4 12 12 0 00-6 24z" />
      <path d="M44 54l-4 8M60 54l-4 8M76 54l-4 8" />
      <rect x="24" y="74" width="72" height="26" rx="5" />
      <path d="M24 86h72" opacity=".6" />
    </template>
    <template v-else-if="kind === 'septic'">
      <path d="M22 48l20-16 20 16v20H22z" />
      <path d="M36 68V56h12v12" />
      <path d="M62 64h14v14" />
      <rect x="58" y="78" width="44" height="24" rx="8" />
      <path d="M14 70h96" opacity=".5" />
    </template>
    <template v-else-if="kind === 'grease'">
      <rect x="20" y="30" width="80" height="62" rx="6" />
      <path d="M20 52h80" />
      <path d="M52 30v44M72 52v40" />
      <path d="M8 44h12M100 76h12" />
    </template>
    <template v-else-if="kind === 'modules'">
      <rect x="12" y="48" width="30" height="44" rx="3" />
      <rect x="45" y="40" width="30" height="52" rx="3" />
      <rect x="78" y="48" width="30" height="44" rx="3" />
      <path d="M20 58v24M27 58v24M53 50v32M60 50v32M67 50v32M86 58v24M93 58v24M100 58v24" opacity=".6" />
    </template>
    <template v-else-if="kind === 'meter'">
      <circle cx="60" cy="50" r="26" />
      <path d="M60 50l14-12" />
      <path d="M44 50h4M72 50h4M60 32v4" />
      <path d="M14 92h92M60 76v16" />
      <rect x="44" y="84" width="32" height="16" rx="3" />
    </template>
    <template v-else-if="kind === 'tanks'">
      <ellipse cx="40" cy="26" rx="18" ry="6" />
      <path d="M22 26v64c0 3.3 8 6 18 6s18-2.7 18-6V26" />
      <ellipse cx="82" cy="40" rx="18" ry="6" />
      <path d="M64 40v50c0 3.3 8 6 18 6s18-2.7 18-6V40" />
    </template>
    <template v-else-if="kind === 'aeration'">
      <path d="M16 30v60a6 6 0 006 6h76a6 6 0 006-6V30" />
      <path d="M26 86h68" />
      <path d="M34 86v-4M50 86v-4M66 86v-4M82 86v-4" />
      <circle cx="34" cy="70" r="2.5" /><circle cx="50" cy="62" r="2.5" /><circle cx="66" cy="72" r="2.5" /><circle cx="82" cy="60" r="2.5" /><circle cx="42" cy="50" r="2" /><circle cx="74" cy="46" r="2" />
    </template>
    <template v-else-if="kind === 'blower'">
      <circle cx="50" cy="60" r="28" />
      <path d="M50 60c0-12 8-18 18-16M50 60c10 6 10 16 2 22M50 60c-11 6-21 3-24-6" />
      <rect x="78" y="48" width="28" height="24" rx="4" />
      <path d="M50 88v10M36 98h28" />
    </template>
    <template v-else-if="kind === 'pump'">
      <circle cx="44" cy="70" r="22" />
      <circle cx="44" cy="70" r="6" />
      <rect x="66" y="58" width="36" height="24" rx="5" />
      <path d="M44 48V24h22" />
      <path d="M22 98h80" opacity=".5" />
    </template>
    <template v-else-if="kind === 'plant'">
      <rect x="14" y="20" width="44" height="30" rx="3" />
      <rect x="14" y="56" width="44" height="30" rx="3" />
      <circle cx="84" cy="36" r="16" />
      <circle cx="84" cy="80" r="16" />
      <path d="M84 36l9-6M84 80l9 6" opacity=".6" />
      <path d="M14 100h92" opacity=".5" />
    </template>
    <template v-else-if="kind === 'sorbent'">
      <path d="M60 14c14 18 26 34 26 50a26 26 0 01-52 0c0-16 12-32 26-50z" />
      <path d="M44 62c6-4 10 4 16 0s10 4 16 0M44 74c6-4 10 4 16 0s10 4 16 0" opacity=".7" />
    </template>
    <template v-else>
      <circle cx="60" cy="60" r="18" />
      <path d="M60 22v12M60 86v12M22 60h12M86 60h12M33 33l8 8M79 79l8 8M87 33l-8 8M41 79l-8 8" />
    </template>
  </svg>
</template>

<script setup>
defineProps({
  kind: { type: String, default: 'gear' },
  label: { type: String, default: 'Изображение оборудования появится позже' }
})
</script>

<style scoped>
.eqp { width: 46%; height: auto; color: #c4c9d2; }
</style>
