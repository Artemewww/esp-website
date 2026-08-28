<template>
  <!-- Флаг Беларуси вектором, а не эмодзи. Эмодзи-флаги собираются из пары
       региональных индикаторов, и системы без соответствующего шрифта
       (в первую очередь Windows) рисуют вместо флага буквы «BY». -->
  <svg
    class="flag-by"
    viewBox="0 0 36 18"
    role="img"
    aria-label="Беларусь"
    xmlns="http://www.w3.org/2000/svg"
  >
    <defs>
      <!-- Орнаментальная полоса: упрощённый ромбовидный мотив, читаемый
           на высоте 12–16 px, где точный узор всё равно не различить. -->
      <pattern :id="patternId" width="3" height="4.5" patternUnits="userSpaceOnUse">
        <rect width="3" height="4.5" fill="#ffffff" />
        <path d="M1.5 0.5 2.6 2.25 1.5 4 0.4 2.25Z" fill="#c8313e" />
      </pattern>
    </defs>

    <rect x="5" width="31" height="12" fill="#c8313e" />
    <rect x="5" y="12" width="31" height="6" fill="#4aa657" />
    <rect width="5" height="18" :fill="`url(#${patternId})`" />
  </svg>
</template>

<script setup>
import { useId } from 'vue'

// useId стабилен между сервером и клиентом — иначе идентификатор паттерна
// разъезжается при гидрации и заливка теряется.
const patternId = `flag-by-${useId()}`
</script>

<style scoped>
.flag-by {
  display: inline-block;
  width: auto;
  height: 1em;
  vertical-align: -0.15em;
  border-radius: 1px;
}
</style>
