<template>
  <!-- Отдельный макет: шапка и футер сайта в админке только мешают. -->
  <div class="adm-root">
    <slot />
  </div>
</template>

<style>
.adm-root {
  --adm-blue: #002366;
  --adm-ink: #14161a;
  --adm-muted: #6b7280;
  --adm-line: #e4e7ec;
  --adm-bg: #f6f7f9;
  --adm-card: #ffffff;
  min-height: 100vh;
  background: var(--adm-bg);
  color: var(--adm-ink);
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  -webkit-font-smoothing: antialiased;
}
.adm-root *, .adm-root *::before, .adm-root *::after { box-sizing: border-box; }
</style>
