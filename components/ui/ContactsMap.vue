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
import { ref, onMounted, onUnmounted } from 'vue'
import { LEAF_PATH } from '~/components/ui/leafPath.js'

const props = defineProps({
  // [{ id, title, address, hours, lat, lng }]
  points: { type: Array, required: true }
})

const mapEl = ref(null)
const active = ref(0)
let map = null
let L = null
let proj4 = null
let markers = []

// CRS для Яндекс-тайлов: у Яндекса своя проекция (Меркатор на эллипсоиде
// Красовского, EPSG:3395), а не стандартный Web-Mercator. Без точной проекции
// метки по WGS84-координатам плыли бы относительно тайлов Яндекса. CRS
// собираем вручную на базе proj4 (без проj4leaflet, чтобы не тянуть лишний
// плагин на серверный бандл).
const buildYandexCrs = () => {
  const code = 'EPSG:3395'
  proj4.defs(code, '+proj=merc +lon_0=0 +k=1 +x_0=0 +y_0=0 +ellps=krass +towgs84=0,0,0,0,0,0,0 +units=m +no_defs')
  const p = proj4(code)
  // Разрешения тайлов Яндекса (метры на пиксель) по уровням зума.
  const resolutions = [2048, 1024, 512, 256, 128, 64, 32, 16, 8, 4, 2, 1, 0.5, 0.25, 0.125]
  const scales = resolutions.map((r) => 1 / r)

  const projection = {
    project: (latlng) => {
      const pt = p.forward([latlng.lng, latlng.lat])
      return L.point(pt[0], pt[1])
    },
    unproject: (point) => {
      const pt = p.inverse([point.x, point.y])
      return L.latLng(pt[1], pt[0])
    }
  }

  const crs = L.Util.extend({}, L.CRS.EPSG3857, {
    code,
    projection,
    transformation: new L.Transformation(1, 0, -1, 0),
    scale: (zoom) => {
      const z = Math.min(Math.floor(zoom), scales.length - 1)
      return scales[z]
    },
    zoom: (scale) => {
      for (let i = 0; i < scales.length; i++) {
        if (scale >= scales[i]) return i
      }
      return scales.length - 1
    },
    infinite: true
  })
  return crs
}

// Метка-логотип ESP: фирменный «Лист» в белом на синем значке-капле с
// остриём вниз — якорь на точке адреса. Форма — та же, что в фавиконе.
const logoIcon = () => L.divIcon({
  className: '',
  iconSize: [48, 58],
  iconAnchor: [24, 56],
  popupAnchor: [0, -52],
  html: `
    <svg width="48" height="58" viewBox="0 0 48 58" xmlns="http://www.w3.org/2000/svg">
      <path d="M24 0C10.745 0 0 10.745 0 24c0 9.6 4.6 15.9 12.2 22.6C17.2 51.2 21 54.7 24 58c3-3.3 6.8-6.8 11.8-11.4C43.4 39.9 48 33.6 48 24 48 10.745 37.255 0 24 0Z" fill="#002366"/>
      <circle cx="24" cy="24" r="17.5" fill="#002366" stroke="#fff" stroke-width="2"/>
      <g transform="translate(24 24) scale(0.135) translate(-47.5 -65)">
        <path d="${LEAF_PATH}" fill="#ffffff"/>
      </g>
      <text x="24" y="34.5" text-anchor="middle" font-family="SF Pro Rounded, system-ui, sans-serif" font-size="7" font-weight="700" fill="#ffffff" letter-spacing="0.5">ESP</text>
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
    crs: buildYandexCrs()
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
})

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
