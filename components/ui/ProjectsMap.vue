<template>
  <div class="pm-host">
  <Teleport to="body" :disabled="!full">
  <div ref="wrap" class="pm-wrap" :class="{ 'is-full': full, 'has-ov': full && !!$slots.overlay }" :style="ovH ? { '--pm-ov': ovH + 'px' } : null">
    <div ref="mapEl" class="w-full h-full"></div>
    <!-- Плавающая панель поверх карты — только в полноэкранном режиме -->
    <div v-if="full && $slots.overlay" ref="ovEl" class="pm-ov">
      <slot name="overlay" :close="toggleFull" />
    </div>
    <button type="button" class="pm-full" :aria-label="full ? 'Свернуть карту' : 'Открыть карту на весь экран'" @click="toggleFull">
      <svg v-if="!full" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5" /></svg>
      <svg v-else viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M9 4v5H4M15 4v5h5M9 20v-5H4M15 20v-5h5" /></svg>
      <span>{{ full ? 'Свернуть' : 'На весь экран' }}</span>
    </button>
  </div>
  </Teleport>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, onBeforeUnmount, nextTick, watch } from 'vue'

const props = defineProps({
  // [{ lng, lat, name, location, capacity, category, region, featuredSlug?, image? }]
  points: { type: Array, required: true }
})

const mapEl = ref(null)
let map = null
import { buildYandexCrs } from '~/components/ui/yandexCrs.js'
let L = null
let layerGroup = null

// Единый стиль карт сайта: серая подложка, на ней — фирменные капли ESP.
// Цвет и иконка капли — ниша «Решений для бизнеса» (nicheInfo), размер —
// производительность объекта: чем крупнее станция, тем больше капля.
// Ключевые объекты (своя страница) — с белым знаком ESP внутри и поверх всех.
import { nicheInfo, capacityNum } from '~/composables/useProjects'
import { LOGO_PATHS } from '~/components/layout/logoPaths.js'

const esc = (s) => String(s == null ? '' : s)
  .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')

// Высота капли в px: от 14 (нет данных / малые) до 52 (18 000 м³/сут).
const MAX_CAP = 18000
const dropSize = (p) => {
  const n = capacityNum(p.capacity)
  const h = 14 + 38 * Math.sqrt(Math.min(n, MAX_CAP) / MAX_CAP)
  return Math.round(p.flagship ? Math.max(h, 30) : Math.min(h, 40))
}

// Капля остриём вверх, viewBox 0 0 24 32; центр круглой части — (12, 20.5).
const DROP = 'M12 1.5C12 1.5 3 12.6 3 20.2A9 9 0 0 0 21 20.2C21 12.6 12 1.5 12 1.5Z'
const logo = LOGO_PATHS.map(d => `<path d="${d}" fill="#fff"/>`).join('')

const makeIcon = (p) => {
  const n = nicheInfo(p)
  const h = dropSize(p)
  const w = Math.round(h * 0.75)
  const mark = p.flagship
    ? `<g transform="translate(12 20.6) scale(0.105) translate(-60 -30.5)">${logo}</g>`
    : (h >= 22 ? '<circle cx="12" cy="20.4" r="2.6" fill="#fff" opacity=".9"/>' : '')
  return L.divIcon({
    className: 'pm-drop',
    html: `<svg width="${w}" height="${h}" viewBox="0 0 24 32" style="display:block;overflow:visible;filter:drop-shadow(0 2px 3px rgba(0,0,0,.35))">
      <path d="${DROP}" fill="${n.color}" stroke="#fff" stroke-width="${p.flagship ? 1.6 : 1.3}"/>${mark}</svg>`,
    iconSize: [w, h],
    // Точка на карте — центр круглой части капли
    iconAnchor: [w / 2, Math.round(h * 20.5 / 32)],
    popupAnchor: [0, -Math.round(h * 0.6)]
  })
}

const renderMarkers = () => {
  if (!map || !L) return
  if (layerGroup) { layerGroup.clearLayers(); map.removeLayer(layerGroup) }
  layerGroup = L.layerGroup().addTo(map)

  // Мелкие ниже крупных, флагманы — поверх всех
  const pts = [...props.points].sort((a, b) => (a.flagship - b.flagship) || (capacityNum(a.capacity) - capacityNum(b.capacity)))
  pts.forEach(p => {
    const n = nicheInfo(p)
    const marker = L.marker([p.lat, p.lng], { icon: makeIcon(p), zIndexOffset: p.flagship ? 1000 : 0, riseOnHover: true }).addTo(layerGroup)
    const linkHtml = p.featuredSlug
      ? `<a href="/projects/${p.featuredSlug}" style="color:#002366;font-size:13px;font-weight:600;text-decoration:underline;">Подробнее об объекте →</a>`
      : `<span style="font-size:12px;color:rgba(26,26,26,.5);">Реализованный объект ESP</span>`
    const capHtml = p.capacity && p.capacity !== '—'
      ? `<div style="font-size:12px;color:#002366;font-weight:600;margin-bottom:6px;">${esc(p.capacity)}</div>` : ''
    const popupHtml = `
      <div style="font-family: inherit; min-width: 210px; max-width: 260px;">
        <div style="display:inline-flex;align-items:center;gap:6px;font-size:12px;color:#fff;background:${n.color};padding:3px 9px;border-radius:var(--r-pill);margin-bottom:8px;">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="${n.icon}"/></svg>${esc(n.title)}</div>
        <div style="font-weight:600;margin-bottom:3px;color:#1A1A1A;line-height:1.25;">${esc(p.name)}</div>
        <div style="font-size:12px;color:rgba(26,26,26,.6);margin-bottom:6px;">${esc(p.location)}${p.region ? ' · ' + esc(p.region) : ''}</div>
        ${capHtml}
        <div style="font-size:12px;color:rgba(26,26,26,.55);margin-bottom:6px;">${esc(p.facility || '')}</div>
        ${linkHtml}
        <div style="display:flex;flex-wrap:wrap;gap:6px;margin-top:10px;">
          <a href="https://yandex.ru/maps/?rtext=~${p.lat},${p.lng}&rtt=auto" target="_blank" rel="noopener" style="display:inline-flex;align-items:center;min-height:32px;padding:0 12px;border-radius:999px;background:#002366;color:#fff;font-size:12px;font-weight:600;text-decoration:none;">Маршрут в Яндекс</a>
          <a href="https://www.google.com/maps/dir/?api=1&destination=${p.lat},${p.lng}" target="_blank" rel="noopener" style="display:inline-flex;align-items:center;min-height:32px;padding:0 12px;border-radius:999px;background:#EDEDED;color:#1A1A1A;font-size:12px;font-weight:600;text-decoration:none;">Google Maps</a>
        </div>
      </div>`
    marker.bindPopup(popupHtml)
  })
}

const wrap = ref(null)
const full = ref(false)
const ovEl = ref(null)
const ovH = ref(0)
let ovRo = null
const onEsc = (e) => { if (e.key === 'Escape' && full.value) toggleFull() }
const toggleFull = () => {
  full.value = !full.value
  document.documentElement.style.overflow = full.value ? 'hidden' : ''
  if (map) full.value ? map.scrollWheelZoom.enable() : map.scrollWheelZoom.disable()
  nextTick(() => {
    // Высота панели сдвигает кнопки масштаба Leaflet ниже неё
    if (ovRo) { ovRo.disconnect(); ovRo = null }
    ovH.value = 0
    if (full.value && ovEl.value && 'ResizeObserver' in window) {
      ovRo = new ResizeObserver(([e]) => { ovH.value = Math.ceil(e.target.getBoundingClientRect().height) })
      ovRo.observe(ovEl.value)
    }
    setTimeout(() => map && map.invalidateSize(), 60)
  })
}
defineExpose({ toggleFull, isFull: full })
onMounted(() => window.addEventListener('keydown', onEsc))
onBeforeUnmount(() => { window.removeEventListener('keydown', onEsc); document.documentElement.style.overflow = ''; if (ovRo) ovRo.disconnect() })

onMounted(async () => {
  L = (await import('leaflet')).default
  await import('leaflet/dist/leaflet.css')
  const projModule = await import('proj4')
  const proj4 = projModule.default || projModule
  if (!mapEl.value) return

  // Плашку Leaflet убираем: библиотека подмешивает в неё свой флаг, которому
  // на карте объектов не место. Подпись подложки оставляем — это условие
  // использования тайлов.
  // Та же проекция, что на карте контактов: с CRS по умолчанию метки
  // по WGS84 уезжают от яндексовой подложки на десятки километров.
  map = L.map(mapEl.value, {
    scrollWheelZoom: false,
    zoomControl: true,
    attributionControl: false,
    crs: buildYandexCrs(L, proj4)
  }).setView([53.55, 27.8], 7)
  L.control.attribution({ prefix: false }).addAttribution('&copy; Яндекс Карты').addTo(map)
  // Серая подложка: цветные капли ниш читаются на ней чётко
  L.tileLayer('https://core-renderer-tiles.maps.yandex.net/tiles?l=map&v=21.07.07-0&x={x}&y={y}&z={z}&scale=1&lang=ru_RU', {
    maxZoom: 18,
    className: 'pm-gray'
  }).addTo(map)

  renderMarkers()
})

watch(() => props.points, renderMarkers)

onUnmounted(() => {
  if (map) { map.remove(); map = null }
})
</script>

<style>
/* Единый стиль карт ESP: серая подложка */
.pm-gray { filter: grayscale(1) contrast(0.92) brightness(1.04); }
.pm-drop { background: none; border: 0; }
.pm-host, .pm-wrap { position: relative; width: 100%; height: 100%; }
.pm-wrap.is-full { position: fixed; inset: 0; width: 100vw; height: 100dvh; z-index: 1000; background: #fff; }
.pm-full { position: absolute; top: 12px; right: 12px; z-index: 500; display: inline-flex; align-items: center; gap: 6px; min-height: 40px; padding: 0 14px; border: 0; border-radius: 999px; background: rgba(255, 255, 255, 0.94); color: #1A1A1A; font: 600 13px/1 var(--dj-font); box-shadow: var(--sh-2); cursor: pointer; }
.pm-full svg { width: 18px; height: 18px; }
.pm-full:hover { background: #fff; color: #002366; }
@media (max-width: 600px) { .pm-full span { display: none; } .pm-full { padding: 0 11px; } }
/* Панель поверх полноэкранной карты (стекло, как у Apple) */
.pm-ov { position: absolute; top: 12px; left: 12px; right: 12px; z-index: 600; pointer-events: none; }
.pm-ov > * { pointer-events: auto; }
.pm-wrap.has-ov .pm-full { top: 24px; right: 24px; z-index: 700; }
.pm-wrap.has-ov .leaflet-top { top: calc(var(--pm-ov, 0px) + 12px); }
@media (max-width: 600px) { .pm-wrap.has-ov .pm-full { top: 20px; right: 20px; } }
</style>
