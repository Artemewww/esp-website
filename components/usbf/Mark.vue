<template>
  <!-- Знак USBF в системе ESP: скруглённый квадрат бренда, три волны — «одеяло»
       из активного ила, сквозь него снизу вверх идёт вода (стрелка) и выходит
       чистой каплей. Геометрия на сетке 48, скругления как у иконок сайта. -->
  <svg class="um" viewBox="0 0 48 48" role="img" :aria-label="label">
    <rect x="1" y="1" width="46" height="46" rx="14" :fill="bg" />
    <path d="M7 31c3.4 0 3.4-2.4 6.8-2.4s3.4 2.4 6.8 2.4 3.4-2.4 6.8-2.4 3.4 2.4 6.8 2.4 3.4-2.4 6.8-2.4" fill="none" :stroke="fg" stroke-opacity=".38" stroke-width="2.6" stroke-linecap="round" />
    <path d="M7 36.5c3.4 0 3.4-2.4 6.8-2.4s3.4 2.4 6.8 2.4 3.4-2.4 6.8-2.4 3.4 2.4 6.8 2.4 3.4-2.4 6.8-2.4" fill="none" :stroke="fg" stroke-opacity=".6" stroke-width="2.6" stroke-linecap="round" />
    <path d="M7 42c3.4 0 3.4-2.4 6.8-2.4s3.4 2.4 6.8 2.4 3.4-2.4 6.8-2.4 3.4 2.4 6.8 2.4 3.4-2.4 6.8-2.4" fill="none" :stroke="fg" stroke-opacity=".85" stroke-width="2.6" stroke-linecap="round" />
    <path d="M24 40V17" fill="none" :stroke="fg" stroke-width="3.2" stroke-linecap="round" />
    <path d="M17.5 23.5 24 17l6.5 6.5" fill="none" :stroke="fg" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round" />
    <path d="M24 5.5c2.6 3 4 5 4 6.8a4 4 0 0 1-8 0c0-1.8 1.4-3.8 4-6.8Z" :fill="accent" />
  </svg>
</template>

<script setup>
defineProps({
  bg: { type: String, default: '#002366' },
  fg: { type: String, default: '#FFFFFF' },
  accent: { type: String, default: '#7FD3FF' },
  label: { type: String, default: 'USBF — восходящая фильтрация через слой ила' }
})
</script>

<style scoped>
.um { display: block; width: 100%; height: 100%; }
</style>
