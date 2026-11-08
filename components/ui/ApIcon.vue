<template>
  <svg
    class="ap-icon"
    viewBox="0 0 24 24"
    :width="size"
    :height="size"
    fill="none"
    stroke="currentColor"
    stroke-width="1.6"
    stroke-linecap="round"
    stroke-linejoin="round"
    aria-hidden="true"
    focusable="false"
    v-html="glyphs[name] || glyphs.circle"
  ></svg>
</template>

<script setup>
// Единый набор линейных иконок в стиле SF Symbols: viewBox 24, stroke 1.6, round caps/joins.
// Цвет — через currentColor (navy на светлом, white на тёмном — задаётся CSS родителя).
defineProps({
  name: { type: String, required: true },
  size: { type: [Number, String], default: 24 }
})

const glyphs = {
  circle: '<circle cx="12" cy="12" r="8.5"/>',
  drop: '<path d="M12 3.5c3.5 4 6 7 6 10.5a6 6 0 0 1-12 0c0-3.5 2.5-6.5 6-10.5z"/>',
  gear: '<circle cx="12" cy="12" r="3.5"/><path d="M12 3v2.5M12 18.5V21M3 12h2.5M18.5 12H21M5.6 5.6l1.8 1.8M16.6 16.6l1.8 1.8M18.4 5.6l-1.8 1.8M7.4 16.6l-1.8 1.8"/>',
  layers: '<path d="M12 3.5l8.5 4.5-8.5 4.5L3.5 8 12 3.5z"/><path d="M3.5 12.2l8.5 4.5 8.5-4.5M3.5 16.2l8.5 4.5 8.5-4.5"/>',
  pipe: '<path d="M3 8h8a3 3 0 0 1 3 3v2a3 3 0 0 0 3 3h4"/><path d="M5.5 6v4M18.5 14v4"/>',
  shield: '<path d="M12 3l7 3v5.5c0 4.3-3 7.7-7 9.5-4-1.8-7-5.2-7-9.5V6l7-3z"/>',
  shieldcheck: '<path d="M12 3l7 3v5.5c0 4.3-3 7.7-7 9.5-4-1.8-7-5.2-7-9.5V6l7-3z"/><path d="M9 12l2.2 2.2L15 10.4"/>',
  check: '<path d="M5 12.5l4.5 4.5L19 7.5"/>',
  circlecheck: '<circle cx="12" cy="12" r="8.5"/><path d="M8.5 12.3l2.5 2.5 4.5-5"/>',
  arrow: '<path d="M5 12h14M13 6l6 6-6 6"/>',
  doc: '<path d="M6 3h8l5 5v13H6V3z"/><path d="M14 3v5h5M9.5 13h6M9.5 17h6"/>',
  download: '<path d="M12 4v11M8 11l4 4 4-4M5 20h14"/>',
  upload: '<path d="M12 15V4M8 8l4-4 4 4M5 20h14"/>',
  calendar: '<rect x="4" y="5" width="16" height="15" rx="2.5"/><path d="M4 10h16M8 3v4M16 3v4"/>',
  pin: '<path d="M12 21s6-5.4 6-11a6 6 0 0 0-12 0c0 5.6 6 11 6 11z"/><circle cx="12" cy="10" r="2.2"/>',
  phone: '<path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z"/>',
  mail: '<rect x="3" y="5" width="18" height="14" rx="2.5"/><path d="M3.5 7.5l8.5 6 8.5-6"/>',
  user: '<circle cx="12" cy="8" r="4"/><path d="M4.5 20c0-4 3.5-6 7.5-6s7.5 2 7.5 6"/>',
  users: '<circle cx="9" cy="8" r="3.5"/><path d="M2.5 20c0-3.5 3-5.5 6.5-5.5s6.5 2 6.5 5.5"/><path d="M16 4.7a3.5 3.5 0 0 1 0 6.6M18 14.8c2 .7 3.5 2.3 3.5 5.2"/>',
  chart: '<path d="M5 20v-8M12 20V5M19 20v-9"/>',
  flask: '<path d="M9 3h6M10 3v6l-5 9a2 2 0 0 0 1.8 3h10.4a2 2 0 0 0 1.8-3l-5-9V3M7.5 14h9"/>',
  wrench: '<path d="M20 7.5a4.5 4.5 0 0 1-5.8 5L7 19.7a2 2 0 0 1-2.8-2.8l7.2-7.2A4.5 4.5 0 0 1 16.5 4l-2.7 2.7.5 2.5 2.5.5L20 7.5z"/>',
  truck: '<path d="M2.5 6h10.5v10H2.5zM13 9.5h4l3.5 3.5v3H13"/><circle cx="6.5" cy="17.5" r="1.8"/><circle cx="17" cy="17.5" r="1.8"/>',
  factory: '<path d="M3 21h18M5 21V11l5 3v-3l5 3V5h4v16"/><path d="M8 17h.01M12 17h.01M16.5 9h.01"/>',
  warehouse: '<path d="M3 10l9-6 9 6v10H3V10z"/><path d="M9 20v-6h6v6"/>',
  leaf: '<path d="M5 19c0-8 5-14 15-14 0 10-6 15-14 15"/><path d="M5 19c3-5 6-8 10-10"/>',
  clock: '<circle cx="12" cy="12" r="8.5"/><path d="M12 7.5V12l3 2"/>',
  star: '<path d="M12 3.5l2.6 5.4 5.9.8-4.3 4.1 1 5.9-5.2-2.8-5.2 2.8 1-5.9-4.3-4.1 5.9-.8L12 3.5z"/>',
  play: '<path d="M8 5.5v13l11-6.5L8 5.5z"/>',
  search: '<circle cx="11" cy="11" r="6.5"/><path d="M20 20l-4.4-4.4"/>',
  zoom: '<circle cx="11" cy="11" r="6.5"/><path d="M20 20l-4.4-4.4M11 8.5v5M8.5 11h5"/>',
  cube: '<path d="M12 3l8 4.5v9L12 21l-8-4.5v-9L12 3z"/><path d="M4 7.5l8 4.5 8-4.5M12 12v9"/>',
  bolt: '<path d="M13 3L5.5 13.5H11L10 21l8-10.5h-5.5L13 3z"/>',
  compass: '<circle cx="12" cy="12" r="8.5"/><path d="M15.5 8.5l-2 5-5 2 2-5 5-2z"/>',
  lightning: '<path d="M13 3L5.5 13.5H11L10 21l8-10.5h-5.5L13 3z"/>',
  award: '<circle cx="12" cy="9" r="5.5"/><path d="M8.7 13.6L7.5 21l4.5-2.4 4.5 2.4-1.2-7.4"/>',
  book: '<path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H19v15H6.5A2.5 2.5 0 0 0 4 20.5v-15z"/><path d="M4 20.5A2.5 2.5 0 0 1 6.5 18H19v3H6.5"/>',
  chat: '<path d="M5 4.5h14a1.5 1.5 0 0 1 1.5 1.5v9a1.5 1.5 0 0 1-1.5 1.5H11l-5 4v-4H5A1.5 1.5 0 0 1 3.5 15V6A1.5 1.5 0 0 1 5 4.5z"/>',
  headset: '<path d="M4 14v-2a8 8 0 0 1 16 0v2"/><path d="M4 14h3v5H6a2 2 0 0 1-2-2v-3zM20 14h-3v5h1a2 2 0 0 0 2-2v-3z"/>',
  building: '<path d="M5 21V4h10v17M15 9h4v12M3 21h18"/><path d="M8.5 8h3M8.5 12h3M8.5 16h3"/>',
  globe: '<circle cx="12" cy="12" r="8.5"/><path d="M3.5 12h17M12 3.5c2.4 2.4 3.6 5.3 3.6 8.5s-1.2 6.1-3.6 8.5c-2.4-2.4-3.6-5.3-3.6-8.5S9.6 5.9 12 3.5z"/>',
  bulb: '<path d="M9 18h6M10 21h4M12 3a6 6 0 0 0-3.5 10.9c.6.5 1.5 1.3 1.5 2.1h4c0-.8.9-1.6 1.5-2.1A6 6 0 0 0 12 3z"/>',
  microbe: '<circle cx="12" cy="12" r="4"/><path d="M12 3v3M12 18v3M3 12h3M18 12h3M5.6 5.6l2.1 2.1M16.3 16.3l2.1 2.1M18.4 5.6l-2.1 2.1M7.7 16.3l-2.1 2.1"/>',
  loop: '<path d="M4.5 12a7.5 7.5 0 0 1 13-5.1M19.5 12a7.5 7.5 0 0 1-13 5.1M17.5 3v4h-4M6.5 21v-4h4"/>',
  lidar: '<circle cx="12" cy="12" r="2.5"/><path d="M7.8 7.8a6 6 0 0 0 0 8.4M16.2 7.8a6 6 0 0 1 0 8.4M4.9 4.9a10 10 0 0 0 0 14.2M19.1 4.9a10 10 0 0 1 0 14.2"/>',
  expand: '<path d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5"/>',
  calculator: '<rect x="5" y="3" width="14" height="18" rx="2.5"/><path d="M8.5 7.5h7M9 12h.01M12 12h.01M15 12h.01M9 16h.01M12 16h.01M15 16h.01"/>',
  pencil: '<path d="M4 20l1-4L16 5l3 3L8 19l-4 1z"/><path d="M14 7l3 3"/>',
  camera: '<path d="M4 8.5A1.5 1.5 0 0 1 5.5 7H8l1.5-2h5L16 7h2.5A1.5 1.5 0 0 1 20 8.5v9A1.5 1.5 0 0 1 18.5 19h-13A1.5 1.5 0 0 1 4 17.5v-9z"/><circle cx="12" cy="13" r="3.5"/>',
  folder: '<path d="M3.5 7A2 2 0 0 1 5.5 5H9l2 2.5h7.5a2 2 0 0 1 2 2V17.5a2 2 0 0 1-2 2h-13a2 2 0 0 1-2-2V7z"/>',
  close: '<path d="M6 6l12 12M18 6L6 18"/>',
  chevronleft: '<path d="M14.5 6l-6 6 6 6"/>',
  chevronright: '<path d="M9.5 6l6 6-6 6"/>',
  chevrondown: '<path d="M6 9.5l6 6 6-6"/>'
}
</script>
