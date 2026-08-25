<template>
  <!-- Фирменная суперграфика ESP: «Лист» из брендбука, размноженный в ленту
       («Дополнительная версия» — для макетов, где нужна протяжённая графика).
       Декор, поэтому aria-hidden. Цвет наследуется через currentColor. -->
  <div class="brand-pattern" :style="{ height: height + 'px' }" aria-hidden="true">
    <!-- .attr обязателен: у SVG-элементов height/width/patternTransform — read-only
         IDL-свойства (SVGAnimatedLength/SVGAnimatedTransformList). При гидрации Vue
         не прокидывает svg-namespace и без .attr пытается присвоить их как DOM-props. -->
    <svg class="brand-pattern-svg" width="100%" :height.attr="height" role="presentation">
      <defs>
        <pattern
          :id="patternId"
          patternUnits="userSpaceOnUse"
          :width.attr="TILE_W"
          :height.attr="TILE_H"
          :patternTransform.attr="`scale(${scale})`"
        >
          <g transform="translate(0,95) rotate(-90)">
            <path :d="LEAF_D" fill="currentColor" />
          </g>
        </pattern>
      </defs>
      <rect width="100%" height="100%" :fill="`url(#${patternId})`" />
    </svg>
  </div>
</template>

<script setup>
import { computed, useId } from 'vue'
import { LEAF_PATH } from './leafPath.js'

const props = defineProps({
  // Высота ленты в px. Масштаб «Листа» считается от неё, чтобы ряд всегда влезал.
  height: { type: Number, default: 95 }
})

// Геометрия из брендбука: нода «Листа» 130x95, шаг повтора в макете 137
// (130 + 7 просвета) — сохраняем ритм оригинала.
const LEAF_W = 130
const LEAF_H = 95
const TILE_W = 137
const TILE_H = LEAF_H

const LEAF_D = LEAF_PATH

// useId из Vue 3.5 — стабилен между сервером и клиентом, без рассинхрона гидрации
const patternId = `esp-leaf-${useId()}`
const scale = computed(() => props.height / LEAF_H)
</script>

<style scoped>
.brand-pattern {
  width: 100%;
  overflow: hidden;
  pointer-events: none;
}
.brand-pattern-svg { display: block; }
</style>
