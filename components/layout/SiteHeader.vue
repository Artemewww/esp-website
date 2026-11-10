<template>
  <!-- Шапка как глобальная навигация apple.com: полоса 44px, ссылки 12px,
       полупрозрачный фон с размытием. На главной поверх видео — тёмная
       (как у Apple на тёмных страницах), после первого экрана светлая.
       Наведение на раздел раскрывает выпадающую панель с размытием страницы. -->
  <header
    class="sh"
    :class="{ 'sh--over': overHero && !panel && !mobileOpen, 'sh--open': panel }"
    @mouseleave="closeSoon"
  >
    <div class="sh-bar">
      <NuxtLink to="/" class="sh-logo" aria-label="ESP — на главную" @click="closeAll">
        <img src="/logo-esp.svg" alt="ESP" width="60" height="30" />
      </NuxtLink>

      <nav class="sh-nav" aria-label="Основное меню">
        <NuxtLink
          v-for="s in nav"
          :key="s.key"
          :to="s.to"
          class="sh-link"
          :class="{ 'is-active': isActive(s), 'is-hover': panel === s.key }"
          @mouseenter="openPanel(s)"
          @focus="openPanel(s)"
          @click="closeAll"
        >{{ s.label }}</NuxtLink>
      </nav>

      <div class="sh-tools">
        <NuxtLink to="/search" class="sh-icon" aria-label="Поиск по сайту" @click="closeAll">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"><circle cx="11" cy="11" r="6.5" /><path d="M20 20l-4.2-4.2" /></svg>
        </NuxtLink>
        <a :href="contacts.phoneHref" class="sh-phone">{{ contacts.phone }}</a>
        <NuxtLink to="/contacts#contact-form" class="sh-cta" @click="closeAll">Обсудить проект</NuxtLink>
        <button class="sh-burger" :aria-expanded="mobileOpen" aria-label="Меню" @click="mobileOpen = !mobileOpen">
          <span /><span />
        </button>
      </div>
    </div>

    <!-- Мега-панель -->
    <Transition name="sh-panel">
      <div v-if="panel && current" class="sh-panel" @mouseenter="cancelClose">
        <div class="sh-panel__in" :class="{ 'sh-panel__in--tech': current.key === 'tech' }">
          <!-- Технологии: стадии очистки + цифровые инструменты с кадрами -->
          <template v-if="current.key === 'tech'">
            <div class="sh-col">
              <span class="sh-col__h">Стадии очистки</span>
              <NuxtLink v-for="t in technologies" :key="t.to" :to="t.to" class="sh-col__a" @click="closeAll">{{ t.title }}</NuxtLink>
            </div>
            <div class="sh-cards sh-cards--3">
              <NuxtLink v-for="t in digitalTech" :key="t.title" :to="t.to" class="sh-card" @click="closeAll">
                <span class="sh-card__img"><img :src="t.img" :alt="t.title" loading="lazy" /></span>
                <span class="sh-card__t">{{ t.title }}</span>
              </NuxtLink>
            </div>
          </template>

          <template v-else-if="current.items">
            <div class="sh-cards" :class="current.key === 'sol' ? 'sh-cards--4 sh-cards--photo' : 'sh-cards--8'">
              <NuxtLink v-for="it in current.items" :key="it.to" :to="it.to" class="sh-card" @click="closeAll">
                <span class="sh-card__img"><img :src="it.img" :alt="it.title" loading="lazy" /></span>
                <span class="sh-card__t">{{ it.title }}</span>
                <span v-if="it.sub" class="sh-card__s">{{ it.sub }}</span>
              </NuxtLink>
            </div>
          </template>

          <template v-else-if="current.links">
            <div class="sh-col sh-col--grid">
              <NuxtLink v-for="l in current.links" :key="l.to" :to="l.to" class="sh-col__a sh-col__a--lg" @click="closeAll">{{ l.title }}</NuxtLink>
            </div>
          </template>

          <div class="sh-panel__foot">
            <NuxtLink :to="current.to" class="dj-more" @click="closeAll">{{ footLabel }}</NuxtLink>
          </div>
        </div>
      </div>
    </Transition>
    <Transition name="sh-fade">
      <div v-if="panel" class="sh-scrim" @mouseenter="closeSoon" @click="closeAll" />
    </Transition>

    <!-- Мобильное меню -->
    <Transition name="sh-fade">
      <div v-if="mobileOpen" class="sh-mob">
        <ul>
          <li v-for="s in nav" :key="s.key">
            <div class="sh-mob__row">
              <NuxtLink :to="s.to" @click="closeAll">{{ s.label }}</NuxtLink>
              <button v-if="hasSub(s)" :aria-expanded="mobSub === s.key" :aria-label="'Раскрыть: ' + s.label" @click="mobSub = mobSub === s.key ? null : s.key">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M6 9l6 6 6-6" /></svg>
              </button>
            </div>
            <div v-if="mobSub === s.key" class="sh-mob__sub">
              <NuxtLink v-for="l in subLinks(s)" :key="l.to + l.title" :to="l.to" @click="closeAll">{{ l.title }}</NuxtLink>
            </div>
          </li>
        </ul>
        <div class="sh-mob__foot">
          <a :href="contacts.phoneHref">{{ contacts.phone }}</a>
          <NuxtLink to="/contacts#contact-form" class="dj-btn dj-btn--lg" @click="closeAll">Обсудить проект</NuxtLink>
        </div>
      </div>
    </Transition>
  </header>
</template>

<script setup>
import { ref, computed, watch, onMounted, onBeforeUnmount } from 'vue'
import { nav, technologies, digitalTech, contacts } from '~/composables/useSiteNav'

const route = useRoute()
const panel = ref(null)
const mobileOpen = ref(false)
const mobSub = ref(null)
const scrolled = ref(false)

const isHome = computed(() => route.path === '/')
const overHero = computed(() => isHome.value && !scrolled.value)
const current = computed(() => nav.find((s) => s.key === panel.value))
const footLabel = computed(() => ({ tech: 'Все технологии', equip: 'Весь каталог оборудования', sol: 'Все решения для бизнеса', about: 'О компании' }[panel.value] || 'Подробнее'))

const isActive = (s) => s.match.some((m) => route.path === m || route.path.startsWith(m + '/'))
const hasPanel = (s) => s.key === 'tech' || s.items || s.links
const hasSub = (s) => hasPanel(s)
const subLinks = (s) => {
  if (s.key === 'tech') return [...technologies, ...digitalTech]
  if (s.items) return [...s.items, { title: 'Смотреть все', to: s.to }]
  return s.links || []
}

let closeTimer = null
const openPanel = (s) => {
  clearTimeout(closeTimer)
  if (window.matchMedia('(max-width: 1067px)').matches) return
  panel.value = hasPanel(s) ? s.key : null
}
const closeSoon = () => { clearTimeout(closeTimer); closeTimer = setTimeout(() => { panel.value = null }, 140) }
const cancelClose = () => clearTimeout(closeTimer)
const closeAll = () => { clearTimeout(closeTimer); panel.value = null; mobileOpen.value = false; mobSub.value = null }

const onScroll = () => { scrolled.value = window.scrollY > window.innerHeight * 0.82 }
const onKey = (e) => { if (e.key === 'Escape') closeAll() }

watch(() => route.fullPath, () => { closeAll(); onScroll() })
watch(mobileOpen, (v) => { document.documentElement.style.overflow = v ? 'hidden' : '' })

onMounted(() => {
  onScroll()
  window.addEventListener('scroll', onScroll, { passive: true })
  window.addEventListener('keydown', onKey)
})
onBeforeUnmount(() => {
  window.removeEventListener('scroll', onScroll)
  window.removeEventListener('keydown', onKey)
  document.documentElement.style.overflow = ''
})
</script>

<style scoped>
.sh { position: fixed; inset: 0 0 auto 0; z-index: 60; font-family: var(--dj-font); color: rgba(0, 0, 0, 0.8); }
.sh-bar { position: relative; z-index: 2; display: flex; align-items: center; justify-content: space-between; gap: 8px; height: var(--dj-header-h); padding: 0 max(22px, calc((100% - 1180px) / 2 + 22px)); background: rgba(250, 250, 252, 0.8); backdrop-filter: saturate(180%) blur(20px); -webkit-backdrop-filter: saturate(180%) blur(20px); transition: background-color 0.32s cubic-bezier(0.4, 0, 0.6, 1), color 0.32s cubic-bezier(0.4, 0, 0.6, 1); }
.sh--open .sh-bar { background: #fafafc; backdrop-filter: none; -webkit-backdrop-filter: none; }
.sh--over { color: rgba(255, 255, 255, 0.8); }
.sh--over .sh-bar { background: rgba(22, 22, 23, 0.8); }
.sh-logo { flex: 0 0 auto; display: flex; align-items: center; height: var(--dj-header-h); padding: 0 8px 0 0; opacity: 0.88; transition: opacity 0.32s ease; }
.sh-logo:hover { opacity: 1; }
.sh-logo img { width: 44px; height: auto; transition: filter 0.32s ease; }
.sh--over .sh-logo img { filter: brightness(0) invert(1); }

.sh-nav { flex: 1 1 auto; display: flex; align-items: center; justify-content: space-between; min-width: 0; margin: 0 8px; }
.sh-link { position: relative; padding: 0 8px; height: var(--dj-header-h); display: flex; align-items: center; font-size: 12px; line-height: 1; font-weight: 400; letter-spacing: -0.01em; color: inherit; white-space: nowrap; transition: color 0.32s cubic-bezier(0.4, 0, 0.6, 1); }
.sh-link:hover, .sh-link.is-hover, .sh-link.is-active { color: #000; }
.sh--over .sh-link:hover, .sh--over .sh-link.is-active { color: #fff; }

.sh-tools { flex: 0 0 auto; display: flex; align-items: center; gap: 6px; }
.sh-icon { display: grid; place-items: center; width: 32px; height: var(--dj-header-h); color: inherit; transition: color 0.32s ease; }
.sh-icon:hover { color: #000; }
.sh--over .sh-icon:hover { color: #fff; }
.sh-icon svg { width: 15px; height: 15px; }
.sh-phone { padding: 0 8px; font-size: 12px; letter-spacing: -0.01em; color: inherit; white-space: nowrap; font-variant-numeric: tabular-nums; }
.sh-phone:hover { color: #000; }
.sh--over .sh-phone:hover { color: #fff; }
.sh-cta { display: inline-flex; align-items: center; min-height: 24px; margin-left: 4px; padding: 3px 11px; border-radius: 980px; background: var(--dj-blue); color: #fff; font-size: 12px; line-height: 1.33337; letter-spacing: -0.01em; white-space: nowrap; transition: background-color 0.2s ease; }
.sh-cta:hover { background: var(--dj-blue-hover); }
.sh--over .sh-cta { background: var(--dj-apple); }
.sh--over .sh-cta:hover { background: var(--dj-apple-hover); }
.sh-burger { display: none; position: relative; width: 32px; height: var(--dj-header-h); color: inherit; }
.sh-burger span { position: absolute; left: 8px; right: 8px; height: 1px; background: currentColor; transition: transform 0.24s cubic-bezier(0.4, 0, 0.6, 1), top 0.24s cubic-bezier(0.4, 0, 0.6, 1); }
.sh-burger span:first-child { top: 18px; }
.sh-burger span:last-child { top: 25px; }
.sh-burger[aria-expanded='true'] span:first-child { top: 21.5px; transform: rotate(45deg); }
.sh-burger[aria-expanded='true'] span:last-child { top: 21.5px; transform: rotate(-45deg); }

/* Выпадающая панель, как меню разделов apple.com */
.sh-panel { position: absolute; inset: var(--dj-header-h) 0 auto 0; z-index: 2; background: #fafafc; }
.sh-panel__in { max-width: 1024px; margin: 0 auto; padding: 40px 22px 68px; display: grid; grid-template-columns: 1fr; gap: 28px 56px; }
.sh-panel__in--tech { grid-template-columns: auto 1fr; }
.sh-panel__foot { grid-column: 1 / -1; padding-top: 4px; }
.sh-panel__foot .dj-more { font-size: 12px; font-weight: 600; letter-spacing: -0.01em; }
.sh-col { display: flex; flex-direction: column; gap: 8px; min-width: 220px; }
.sh-col__h { font-size: 12px; line-height: 1.33337; letter-spacing: -0.01em; color: var(--dj-muted); margin-bottom: 6px; }
.sh-col__a { font-size: 17px; line-height: 1.235; font-weight: 600; letter-spacing: -0.022em; color: #333336; transition: color 0.2s ease; }
.sh-col__a:hover { color: #000; text-decoration: underline; text-underline-offset: 0.12em; }
.sh-col--grid { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 10px 40px; }
.sh-col__a--lg { font-size: 24px; line-height: 1.16667; font-weight: 600; letter-spacing: 0.009em; }
.sh-cards { display: grid; gap: 18px 12px; }
.sh-cards--3 { grid-template-columns: repeat(3, minmax(0, 1fr)); }
.sh-cards--4 { grid-template-columns: repeat(4, minmax(0, 1fr)); }
.sh-cards--8 { grid-template-columns: repeat(7, minmax(0, 1fr)); }
.sh-card { display: flex; flex-direction: column; align-items: center; gap: 8px; text-align: center; color: #333336; }
.sh-card__img { display: block; width: 100%; aspect-ratio: 4 / 3; overflow: hidden; border-radius: 12px; background: #f0f0f3; }
.sh-card__img img { width: 100%; height: 100%; object-fit: contain; mix-blend-mode: multiply; transition: transform 0.6s var(--dj-ease); }
.sh-cards--photo .sh-card__img { aspect-ratio: 16 / 10; }
.sh-cards--photo .sh-card__img img, .sh-cards--3 .sh-card__img img { object-fit: cover; mix-blend-mode: normal; }
.sh-card:hover .sh-card__img img { transform: scale(1.04); }
.sh-card:hover .sh-card__t { color: #000; }
.sh-card__t { font-size: 12px; line-height: 1.33337; font-weight: 600; letter-spacing: -0.01em; }
.sh-cards--4 .sh-card__t, .sh-cards--3 .sh-card__t { font-size: 14px; line-height: 1.28577; letter-spacing: -0.016em; }
.sh-card__s { margin-top: -4px; font-size: 12px; line-height: 1.33337; letter-spacing: -0.01em; color: var(--dj-muted); }
.sh-scrim { position: fixed; inset: var(--dj-header-h) 0 0 0; z-index: 1; background: rgba(232, 232, 237, 0.4); backdrop-filter: blur(20px); -webkit-backdrop-filter: blur(20px); }

.sh-panel-enter-active, .sh-panel-leave-active { transition: opacity 0.32s cubic-bezier(0.4, 0, 0.6, 1), transform 0.32s cubic-bezier(0.4, 0, 0.6, 1); }
.sh-panel-enter-from, .sh-panel-leave-to { opacity: 0; transform: translateY(-6px); }
.sh-fade-enter-active, .sh-fade-leave-active { transition: opacity 0.32s cubic-bezier(0.4, 0, 0.6, 1); }
.sh-fade-enter-from, .sh-fade-leave-to { opacity: 0; }

/* Мобильное меню, как у apple.com: крупные ссылки 28px */
.sh-mob { position: fixed; inset: var(--dj-header-h) 0 0 0; z-index: 1; overflow-y: auto; background: #fafafc; padding: 20px 48px 48px; }
.sh-mob ul { list-style: none; margin: 0; padding: 0; }
.sh-mob__row { display: flex; align-items: center; justify-content: space-between; }
.sh-mob__row a { flex: 1; padding: 6px 0; font-size: 28px; line-height: 1.14286; font-weight: 600; letter-spacing: 0.007em; color: #333336; }
.sh-mob__row button { display: grid; place-items: center; width: 44px; height: 44px; color: var(--dj-muted); }
.sh-mob__row button svg { width: 20px; height: 20px; transition: transform 0.3s var(--dj-ease); }
.sh-mob__row button[aria-expanded='true'] svg { transform: rotate(180deg); }
.sh-mob__sub { display: grid; gap: 2px; padding: 4px 0 14px; }
.sh-mob__sub a { padding: 6px 0; font-size: 17px; line-height: 1.235; font-weight: 600; letter-spacing: -0.022em; color: #333336; }
.sh-mob__foot { display: grid; justify-items: start; gap: 16px; margin-top: 32px; }
.sh-mob__foot > a:first-child { font-size: 17px; font-weight: 600; color: var(--dj-ink); }

@media (max-width: 1279px) { .sh-phone { display: none; } }
@media (max-width: 1067px) {
  .sh-nav { display: none; }
  .sh-burger { display: block; }
  .sh-tools { margin-left: auto; }
}
@media (max-width: 734px) {
  .sh-bar { padding: 0 16px; }
  .sh-cta { display: none; }
  .sh-mob { padding: 16px 32px 40px; }
}
</style>
