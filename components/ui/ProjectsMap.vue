<template>
  <div ref="mapEl" class="w-full h-full"></div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const props = defineProps({
  points: { type: Array, required: true } // [{ lng, lat, name, location, slug, external }]
})

const mapEl = ref(null)
let map = null

onMounted(async () => {
  const L = (await import('leaflet')).default
  await import('leaflet/dist/leaflet.css')

  if (!mapEl.value) return

  map = L.map(mapEl.value, {
    scrollWheelZoom: false,
    zoomControl: true
  }).setView([53.7, 27.8], 6)

  L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
    attribution: '&copy; OpenStreetMap &copy; CARTO',
    maxZoom: 18
  }).addTo(map)

  const makeIcon = (color) => L.divIcon({
    className: '',
    html: `<div style="width:16px;height:16px;border-radius:50%;background:${color};border:2px solid white;box-shadow:0 1px 4px rgba(0,0,0,.4);"></div>`,
    iconSize: [16, 16],
    iconAnchor: [8, 8]
  })

  const greenIcon = makeIcon('#006039')
  const blueIcon = makeIcon('#002366')

  props.points.forEach(p => {
    const marker = L.marker([p.lat, p.lng], { icon: p.external ? blueIcon : greenIcon }).addTo(map)
    const popupHtml = `
      <div style="font-family: inherit; min-width: 180px;">
        <div style="font-weight:600;margin-bottom:4px;color:#1A1A1A;">${p.name}</div>
        <div style="font-size:12px;color:#666;margin-bottom:8px;">${p.location}</div>
        <a href="/projects/${p.slug}" style="color:#002366;font-size:13px;font-weight:500;text-decoration:underline;">Открыть проект →</a>
      </div>
    `
    marker.bindPopup(popupHtml)
  })
})

onUnmounted(() => {
  if (map) {
    map.remove()
    map = null
  }
})
</script>
