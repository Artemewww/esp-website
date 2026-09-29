<template>
  <div class="cmap">
    <!-- Переключатель точек: карта одна, а адресов два — вместо двух карт
         рядом даём выбор, куда её увести. -->
    <div class="cmap-switch" role="tablist" aria-label="Наши адреса">
      <button
        v-for="(p, i) in points"
        :key="p.id"
        type="button"
        class="cmap-tab"
        :class="{ 'is-active': active === i }"
        role="tab"
        :aria-selected="active === i"
        @click="focus(i)"
      >
        <span class="cmap-tab-label">{{ p.title }}</span>
        <span class="cmap-tab-addr">{{ p.address }}</span>
      </button>
    </div>

    <div ref="mapEl" class="cmap-canvas"></div>
  </div>
</template>

<script setup>
import { ref, watch, onMounted, onUnmounted } from 'vue'
import { ESP_LOGO_PATHS } from '~/components/ui/espLogoPaths.js'
import { buildYandexCrs } from '~/components/ui/yandexCrs.js'

const props = defineProps({
  // [{ id, title, address, hours, lat, lng }]
  points: { type: Array, required: true },
  // id точки, на которую сразу навести карту (пункты меню «Как к нам проехать»)
  focusId: { type: String, default: '' }
})

const mapEl = ref(null)
const active = ref(0)
let map = null
let L = null
let proj4 = null
let markers = []

// Метка — синий флаг ESP на древке. Остриё прежней «капли» с логотипом и
// подписью внутри читалось на карте как мятая иконка: знак и текст налезали
// друг на друга в круге 35 px. Флаг крупнее по площади, знак в нём не мельчит,
// а якорь — основание древка, то есть ровно точка адреса.
const FLAG = { w: 58, h: 68, poleX: 12, baseY: 62 }
const logoIcon = () => L.divIcon({
  className: '',
  iconSize: [FLAG.w, FLAG.h],
  iconAnchor: [FLAG.poleX, FLAG.baseY],
  popupAnchor: [16, -58],
  html: `
    <svg width="${FLAG.w}" height="${FLAG.h}" viewBox="0 0 ${FLAG.w} ${FLAG.h}" xmlns="http://www.w3.org/2000/svg">
      <ellipse cx="${FLAG.poleX}" cy="${FLAG.baseY + 1}" rx="7" ry="2.2" fill="rgba(0,0,0,0.28)"/>
      <rect x="${FLAG.poleX - 1.4}" y="5" width="2.8" height="${FLAG.baseY - 5}" rx="1.4" fill="#16233d"/>
      <circle cx="${FLAG.poleX}" cy="5" r="2.6" fill="#16233d"/>
      <path d="M${FLAG.poleX + 1.4} 6 H52 L46.5 19.5 L52 33 H${FLAG.poleX + 1.4} Z" fill="#002366"/>
      <g transform="translate(16.6 12.4) scale(0.235)" fill="#ffffff">
        ${ESP_LOGO_PATHS.map((d) => `<path d="${d}"/>`).join('')}
      </g>
    </svg>`
})

const esc = (s) => String(s == null ? '' : s)
  .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

const focus = (i) => {
  active.value = i
  const p = props.points[i]
  if (!map || !p) return
  map.flyTo([p.lat, p.lng], 15, { duration: 0.9 })
  markers[i]?.openPopup()
}

onMounted(async () => {
  // <script setup> выполняется и на сервере (SSR), где нет window, а leaflet
  // использует window при импорте. Поэтому загружаем картографию только на
  // клиенте, внутри onMounted.
  const leaflet = await import('leaflet')
  L = leaflet.default
  await import('leaflet/dist/leaflet.css')
  const projModule = await import('proj4')
  proj4 = projModule.default || projModule

  if (!mapEl.value) return

  const first = props.points[0]
  // Атрибуцию отключаем — на карте не должно быть плашки
  // «Leaflet | © OpenStreetMap» и подобных надписей.
  map = L.map(mapEl.value, {
    scrollWheelZoom: false,
    zoomControl: true,
    attributionControl: false,
    crs: buildYandexCrs(L, proj4)
  }).setView([first.lat, first.lng], 12)

  // Подложка Яндекс.Карты (публичный тайл-сервер Яндекса).
  L.tileLayer('https://core-renderer-tiles.maps.yandex.net/tiles?l=map&v=21.07.07-0&x={x}&y={y}&z={z}&scale=1&lang=ru_RU', {
    attribution: '',
    maxZoom: 17
  }).addTo(map)

  markers = props.points.map((p) => {
    const m = L.marker([p.lat, p.lng], { icon: logoIcon(), title: p.title }).addTo(map)
    m.bindPopup(
      `<b style="font-size:14px">${esc(p.title)}</b><br>` +
      `<span style="color:#555">${esc(p.address)}</span>` +
      (p.hours ? `<br><span style="color:#777;font-size:12px">${esc(p.hours)}</span>` : '')
    )
    return m
  })

  // Обе точки в кадре на старте — сначала общий план, дальше по кнопкам.
  if (props.points.length > 1) {
    map.fitBounds(props.points.map((p) => [p.lat, p.lng]), { padding: [70, 70] })
  }
  focusById(props.focusId)
})

const focusById = (id) => {
  const i = props.points.findIndex((p) => p.id === id)
  if (i >= 0) focus(i)
}
watch(() => props.focusId, focusById)

onUnmounted(() => {
  if (map) { map.remove(); map = null }
})
</script>

<style scoped>
.cmap {
  display: grid;
  gap: 1rem;
}

.cmap-switch {
  display: grid;
  grid-template-columns: 1fr;
  gap: 0.75rem;
}
@media (min-width: 640px) {
  .cmap-switch { grid-template-columns: repeat(2, minmax(0, 1fr)); }
}

.cmap-tab {
  display: grid;
  gap: 0.15rem;
  text-align: left;
  padding: 0.95rem 1.15rem;
  border: 1px solid #ededed;
  background: #fff;
  transition: border-color 0.2s ease, background-color 0.2s ease;
}
.cmap-tab:hover { border-color: rgba(0, 35, 102, 0.35); }
/* Выбранная точка помечена не цветом текста, а линией слева — так строка
   остаётся спокойной, а состояние читается однозначно. */
.cmap-tab.is-active {
  border-color: #002366;
  box-shadow: inset 3px 0 0 #002366;
  background: rgba(0, 35, 102, 0.03);
}
.cmap-tab-label {
  font-weight: 600;
  color: #1a1a1a;
  font-size: 0.95rem;
}
.cmap-tab-addr {
  font-size: 0.82rem;
  color: rgba(26, 26, 26, 0.6);
}

.cmap-canvas {
  width: 100%;
  height: clamp(320px, 52vh, 520px);
  border: 1px solid #ededed;
}
</style>
