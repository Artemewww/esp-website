<template>
  <svg :class="cls" fill="none" stroke="currentColor" viewBox="0 0 24 24" v-html="paths[name] || paths.circle"></svg>
</template>

<script setup>
const props = defineProps({
  name: { type: String, required: true },
  cls: { type: String, default: 'w-5 h-5' }
})

const paths = {
  bolt: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/>',
  search: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>',
  globe: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12h18M12 3c2.5 2.5 4 6 4 9s-1.5 6.5-4 9c-2.5-2.5-4-6-4-9s1.5-6.5 4-9z"/><circle cx="12" cy="12" r="9" stroke-width="2"/>',
  clock: '<circle cx="12" cy="12" r="9" stroke-width="2"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 7v5l3 3"/>',
  phone: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h2.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.05 11.05 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/>',
  pin: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a2 2 0 01-2.828 0l-4.243-4.243a8 8 0 1111.314 0z"/><circle cx="12" cy="11" r="3" stroke-width="2"/>',
  camera: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 9a2 2 0 012-2h1.5l1-1.5h5l1 1.5H15a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"/><circle cx="10" cy="13" r="3" stroke-width="2"/>',
  download: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v12m0 0l-4-4m4 4l4-4M4 20h16"/>',
  check: '<circle cx="12" cy="12" r="9" stroke-width="2"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4"/>',
  loop: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 12a8 8 0 0114-5.3M20 12a8 8 0 01-14 5.3M4 4v5h5M20 20v-5h-5"/>',
  microbe: '<circle cx="12" cy="12" r="4" stroke-width="2"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 2v3M12 19v3M2 12h3M19 12h3M5 5l2 2M17 17l2 2M19 5l-2 2M7 17l-2 2"/>',
  flask: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 3h6M10 3v6l-5.5 9.5A2 2 0 006.2 21h11.6a2 2 0 001.7-3.5L14 9V3"/>',
  dna: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 3c0 6 12 6 12 12M18 21c0-6-12-6-12-12M6 7h12M6 17h12"/>',
  bulb: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 18h6M10 21h4M12 3a6 6 0 00-3.6 10.8c.6.45 1.6 1.35 1.6 2.2h4c0-.85 1-1.75 1.6-2.2A6 6 0 0012 3z"/>',
  lidar: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 2v6M12 2l-4 3M12 2l4 3M4 21h16M6 21V11a6 6 0 0112 0v10"/>',
  building: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 21V6a1 1 0 011-1h6a1 1 0 011 1v15M4 21h16M12 21v-8h4a1 1 0 011 1v7M8 8h.01M8 12h.01M8 16h.01"/>',
  chart: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 20V10M10 20V4M16 20v-7M4 20h16"/>',
  certificate: '<circle cx="12" cy="8" r="5" stroke-width="2"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12.5L7 21l5-2.5L17 21l-2-8.5"/>',
  folder: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 7a2 2 0 012-2h4l2 2h8a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V7z"/>',
  film: '<rect x="3" y="5" width="18" height="14" rx="1" stroke-width="2"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 5v14M17 5v14M3 9h4M3 15h4M17 9h4M17 15h4"/>',
  circle: '<circle cx="12" cy="12" r="9" stroke-width="2"/>'
}
</script>
