<template>
  <div
    ref="cardRef"
    class="tilt-card"
    @mousemove="handleMove"
    @mouseleave="reset"
    :style="{ transform }"
  >
    <div class="tilt-card__content" :style="{ transform: contentTransform }">
      <slot />
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const cardRef = ref(null)
const transform = ref('perspective(1000px) rotateX(0deg) rotateY(0deg)')
const contentTransform = ref('translateZ(0px)')

const handleMove = (e) => {
  const rect = cardRef.value.getBoundingClientRect()
  const x = e.clientX - rect.left
  const y = e.clientY - rect.top
  const rotateY = ((x / rect.width) - 0.5) * 14
  const rotateX = -((y / rect.height) - 0.5) * 14
  transform.value = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`
  contentTransform.value = 'translateZ(30px)'
}

const reset = () => {
  transform.value = 'perspective(1000px) rotateX(0deg) rotateY(0deg)'
  contentTransform.value = 'translateZ(0px)'
}
</script>

<style scoped>
.tilt-card {
  transition: transform 0.15s ease-out;
  transform-style: preserve-3d;
  will-change: transform;
}
.tilt-card__content {
  transition: transform 0.15s ease-out;
  transform-style: preserve-3d;
}
</style>
