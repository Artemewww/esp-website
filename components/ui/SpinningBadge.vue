<template>
  <div class="spinning-badge" :style="{ width: size + 'px', height: size + 'px' }">
    <svg viewBox="0 0 100 100" class="spin-svg">
      <defs>
        <path id="circlePath" d="M 50, 50 m -37, 0 a 37,37 0 1,1 74,0 a 37,37 0 1,1 -74,0" />
      </defs>
      <text font-size="8.2" fill="currentColor" letter-spacing="1.5">
        <textPath href="#circlePath">{{ text }}</textPath>
      </text>
    </svg>
    <slot />
  </div>
</template>

<script setup>
defineProps({
  text: { type: String, default: 'ESP • КАЧЕСТВО • ИННОВАЦИИ • ' },
  size: { type: Number, default: 110 }
})
</script>

<style scoped>
.spinning-badge {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
}
.spin-svg {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  animation: spin-rotate 12s linear infinite;
}
@keyframes spin-rotate {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}
</style>
