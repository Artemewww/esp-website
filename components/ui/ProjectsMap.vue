<template>
  <div ref="mapEl" class="w-full h-full"></div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch } from 'vue'

const props = defineProps({
  // [{ lng, lat, name, location, capacity, category, region, featuredSlug?, image? }]
  points: { type: Array, required: true }
})

const mapEl = ref(null)
let map = null
import { buildYandexCrs } from '~/components/ui/yandexCrs.js'
let L = null
let layerGroup = null

const CATEGORY_COLORS = {
  'Биологическая очистка': '#002366',
  'Ливневая канализация': '#00A3CC',
  'Насосные станции': '#006039',
  'Автономная канализация': '#7A4FD6',
  'КИПиА': '#C2410C'
}

const esc = (s) => String(s == null ? '' : s)
  .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')

const renderMarkers = () => {
  if (!map || !L) return
  if (layerGroup) { layerGroup.clearLayers(); map.removeLayer(layerGroup) }
  layerGroup = L.layerGroup().addTo(map)

  const makeIcon = (color, big) => L.divIcon({
    className: '',
    html: `<div style="width:${big ? 18 : 12}px;height:${big ? 18 : 12}px;border-radius:50%;background:${color};border:2px solid white;box-shadow:0 1px 4px rgba(0,0,0,.45);"></div>`,
    iconSize: big ? [18, 18] : [12, 12],
    iconAnchor: big ? [9, 9] : [6, 6]
  })

  props.points.forEach(p => {
    const color = CATEGORY_COLORS[p.category] || '#002366'
    const marker = L.marker([p.lat, p.lng], { icon: makeIcon(color, !!p.featuredSlug) }).addTo(layerGroup)
    const linkHtml = p.featuredSlug
      ? `<a href="/projects/${p.featuredSlug}" style="color:#002366;font-size:13px;font-weight:600;text-decoration:underline;">Открыть кейс →</a>`
      : `<span style="font-size:12px;color:#999;">Реализованный объект ESP</span>`
    const capHtml = p.capacity && p.capacity !== '—'
      ? `<div style="font-size:12px;color:#002366;font-weight:600;margin-bottom:6px;">${esc(p.capacity)}</div>` : ''
    const popupHtml = `
      <div style="font-family: inherit; min-width: 210px; max-width: 260px;">
        <div style="display:inline-block;font-size:10px;text-transform:uppercase;letter-spacing:.04em;color:#fff;background:${color};padding:2px 7px;margin-bottom:7px;">${esc(p.category)}</div>
        <div style="font-weight:600;margin-bottom:3px;color:#1A1A1A;line-height:1.25;">${esc(p.name)}</div>
        <div style="font-size:12px;color:#666;margin-bottom:6px;">${esc(p.location)}${p.region ? ' · ' + esc(p.region) : ''}</div>
        ${capHtml}
        <div style="font-size:11px;color:#888;margin-bottom:6px;">${esc(p.facility || '')}</div>
        ${linkHtml}
      </div>`
    marker.bindPopup(popupHtml)
  })
}

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
  L.tileLayer('https://core-renderer-tiles.maps.yandex.net/tiles?l=map&v=21.07.07-0&x={x}&y={y}&z={z}&scale=1&lang=ru_RU', {
    maxZoom: 18
  }).addTo(map)

  renderMarkers()
})

watch(() => props.points, renderMarkers)

onUnmounted(() => {
  if (map) { map.remove(); map = null }
})
</script>
