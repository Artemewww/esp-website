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
        <span class="cmap-tab-icon" aria-hidden="true">
          <svg viewBox="0 0 24 30" width="20" height="25"><path d="M12 1.5C12 1.5 2.5 12.6 2.5 19.2a9.5 9.5 0 0 0 19 0C21.5 12.6 12 1.5 12 1.5Z" fill="currentColor"/><circle cx="12" cy="19.4" r="3.4" fill="var(--cmap-dot)"/></svg>
        </span>
        <span class="cmap-tab-text">
          <span class="cmap-tab-label">{{ p.title }}</span>
          <span class="cmap-tab-addr">{{ p.address }}</span>
        </span>
        <span class="cmap-tab-cta">
          {{ active === i ? 'На карте' : 'Показать на карте' }}
          <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>
        </span>
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

// Метка — фирменная капля ESP (синий #002366, белый знак внутри).
// Белая обводка держит каплю на пёстрой подложке, якорь — низ капли,
// под ним мягкая тень, чтобы точка адреса читалась однозначно.
const DROP = { w: 48, h: 68, cx: 24, baseY: 61 }
const logoIcon = () => L.divIcon({
  className: 'cmap-drop',
  iconSize: [DROP.w, DROP.h],
  iconAnchor: [DROP.cx, DROP.baseY],
  popupAnchor: [0, -58],
  html: `
    <svg width="${DROP.w}" height="${DROP.h}" viewBox="0 0 ${DROP.w} ${DROP.h}" xmlns="http://www.w3.org/2000/svg">
      <ellipse cx="${DROP.cx}" cy="${DROP.baseY + 2}" rx="11" ry="2.6" fill="rgba(0,0,0,0.25)"/>
      <path d="M24 2.5C24 2.5 4 24.5 4 40.5a20 20 0 0 0 40 0C44 24.5 24 2.5 24 2.5Z" fill="#002366" stroke="#ffffff" stroke-width="2.5" stroke-linejoin="round"/>
      <g transform="translate(9 33) scale(0.25)" fill="#ffffff">
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

/* Табы — явные кнопки: иконка-капля, подпись-действие, рамка и смена
   фона на hover, у выбранной точки — заливка фирменным синим. */
.cmap-tab {
  --cmap-dot: #ffffff;
  display: flex;
  align-items: center;
  gap: 0.85rem;
  width: 100%;
  text-align: left;
  padding: 0.9rem 1.1rem;
  border: 1px solid rgba(0, 35, 102, 0.25);
  border-radius: 12px;
  background: #fff;
  color: #1a1a1a;
  cursor: pointer;
  transition: border-color 0.2s ease, background-color 0.2s ease, box-shadow 0.2s ease, color 0.2s ease;
}
.cmap-tab:hover {
  border-color: #002366;
  background: rgba(0, 35, 102, 0.04);
  box-shadow: 0 6px 18px -10px rgba(0, 35, 102, 0.45);
}
.cmap-tab:focus-visible { outline: 2px solid #002366; outline-offset: 2px; }
.cmap-tab-icon {
  flex: none;
  display: grid;
  place-items: center;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: rgba(0, 35, 102, 0.08);
  color: #002366;
}
.cmap-tab-text { display: grid; gap: 0.15rem; min-width: 0; flex: 1; }
.cmap-tab-label { font-weight: 600; font-size: 0.95rem; }
.cmap-tab-addr { font-size: 0.8125rem; color: rgba(26, 26, 26, 0.6); }
.cmap-tab-cta {
  flex: none;
  display: inline-flex;
  align-items: center;
  gap: 0.3rem;
  font-size: 0.75rem;
  font-weight: 600;
  color: #002366;
  white-space: nowrap;
}
.cmap-tab.is-active {
  --cmap-dot: #002366;
  border-color: #002366;
  background: #002366;
  color: #fff;
}
.cmap-tab.is-active .cmap-tab-icon { background: #fff; color: #002366; }
.cmap-tab.is-active .cmap-tab-addr { color: rgba(255, 255, 255, 0.75); }
.cmap-tab.is-active .cmap-tab-cta { color: #fff; }
@media (max-width: 420px) {
  .cmap-tab { flex-wrap: wrap; }
  .cmap-tab-cta { margin-left: calc(40px + 0.85rem); }
}

.cmap-canvas {
  width: 100%;
  height: clamp(320px, 52vh, 520px);
  border: 1px solid #ededed;
}
</style>
