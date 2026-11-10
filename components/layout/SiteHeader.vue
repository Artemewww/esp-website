<template>
  <!-- Шапка в подаче DJI: тонкая полоса 56px. На главной поверх видео она
       прозрачная с белым текстом и белеет после первого экрана; на внутренних
       страницах сразу белая. Наведение на раздел раскрывает мега-панель. -->
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
  if (window.matchMedia('(max-width: 1179px)').matches) return
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
.sh { position: fixed; inset: 0 0 auto 0; z-index: 60; font-family: var(--dj-font); color: var(--dj-ink); }
.sh-bar { position: relative; z-index: 2; display: flex; align-items: center; gap: 28px; height: var(--dj-header-h); padding: 0 clamp(16px, 3vw, 40px); background: rgba(255, 255, 255, 0.94); backdrop-filter: saturate(180%) blur(18px); -webkit-backdrop-filter: saturate(180%) blur(18px); box-shadow: 0 1px 0 rgba(0, 0, 0, 0.06); transition: background-color 0.4s ease, box-shadow 0.4s ease, color 0.4s ease; }
.sh--over .sh-bar { background: linear-gradient(180deg, rgba(0, 0, 0, 0.42), rgba(0, 0, 0, 0)); box-shadow: none; backdrop-filter: none; -webkit-backdrop-filter: none; color: #fff; }
.sh-logo { flex: 0 0 auto; display: flex; align-items: center; }
.sh-logo img { width: 60px; height: auto; transition: filter 0.4s ease; }
.sh--over .sh-logo img { filter: brightness(0) invert(1); }

.sh-nav { display: flex; align-items: center; gap: 2px; min-width: 0; }
.sh-link { position: relative; padding: 0 12px; height: var(--dj-header-h); display: flex; align-items: center; font-size: 14px; font-weight: 400; letter-spacing: -0.02em; color: inherit; opacity: 0.9; white-space: nowrap; transition: opacity 0.2s ease; }
.sh-link:hover, .sh-link.is-hover, .sh-link.is-active { opacity: 1; }
.sh-link::after { content: ''; position: absolute; left: 12px; right: 12px; bottom: 12px; height: 1.5px; background: currentColor; transform: scaleX(0); transform-origin: left; transition: transform 0.35s var(--dj-ease); }
.sh-link.is-hover::after, .sh-link.is-active::after { transform: scaleX(1); }

.sh-tools { margin-left: auto; display: flex; align-items: center; gap: 14px; }
.sh-icon { display: grid; place-items: center; width: 36px; height: 36px; border-radius: 50%; color: inherit; transition: background-color 0.2s ease; }
.sh-icon:hover { background: rgba(127, 127, 127, 0.14); }
.sh-icon svg { width: 20px; height: 20px; }
.sh-phone { font-size: 14px; font-weight: 500; color: inherit; white-space: nowrap; font-variant-numeric: tabular-nums; }
.sh-cta { display: inline-flex; align-items: center; height: 34px; padding: 0 16px; border-radius: 999px; background: var(--dj-blue); color: #fff; font-size: 13px; font-weight: 500; white-space: nowrap; transition: background-color 0.25s ease; }
.sh-cta:hover { background: #0b3a8c; }
.sh--over .sh-cta { background: #fff; color: var(--dj-ink); }
.sh-burger { display: none; position: relative; width: 36px; height: 36px; color: inherit; }
.sh-burger span { position: absolute; left: 9px; right: 9px; height: 1.5px; background: currentColor; border-radius: 2px; transition: transform 0.3s var(--dj-ease), top 0.3s var(--dj-ease); }
.sh-burger span:first-child { top: 14px; }
.sh-burger span:last-child { top: 21px; }
.sh-burger[aria-expanded='true'] span:first-child { top: 17.5px; transform: rotate(45deg); }
.sh-burger[aria-expanded='true'] span:last-child { top: 17.5px; transform: rotate(-45deg); }

/* Мега-панель */
.sh-panel { position: absolute; inset: var(--dj-header-h) 0 auto 0; z-index: 2; background: #fff; box-shadow: 0 24px 48px rgba(0, 0, 0, 0.08); }
.sh-panel__in { max-width: 1280px; margin: 0 auto; padding: 28px clamp(16px, 3vw, 40px) 22px; display: grid; grid-template-columns: 1fr; gap: 24px 48px; }
.sh-panel__in--tech { grid-template-columns: auto 1fr; }
.sh-panel__foot { grid-column: 1 / -1; padding-top: 16px; border-top: 1px solid var(--dj-line); }
.sh-col { display: flex; flex-direction: column; gap: 10px; min-width: 220px; }
.sh-col__h { font-size: 12px; font-weight: 500; color: var(--dj-muted); margin-bottom: 4px; }
.sh-col__a { font-size: 15px; color: var(--dj-ink); transition: color 0.2s ease; }
.sh-col__a:hover { color: var(--dj-link); }
.sh-col--grid { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 16px 32px; }
.sh-col__a--lg { font-size: 17px; font-weight: 500; }
.sh-cards { display: grid; gap: 14px; }
.sh-cards--3 { grid-template-columns: repeat(3, minmax(0, 1fr)); }
.sh-cards--4 { grid-template-columns: repeat(4, minmax(0, 1fr)); }
.sh-cards--8 { grid-template-columns: repeat(7, minmax(0, 1fr)); }
.sh-card { display: flex; flex-direction: column; align-items: center; gap: 8px; text-align: center; color: var(--dj-ink); }
.sh-card__img { display: block; width: 100%; aspect-ratio: 4 / 3; overflow: hidden; background: var(--dj-soft); }
.sh-card__img img { width: 100%; height: 100%; object-fit: contain; mix-blend-mode: multiply; transition: transform 0.6s var(--dj-ease); }
.sh-cards--photo .sh-card__img { aspect-ratio: 16 / 10; }
.sh-cards--photo .sh-card__img img, .sh-cards--3 .sh-card__img img { object-fit: cover; mix-blend-mode: normal; }
.sh-card:hover .sh-card__img img { transform: scale(1.05); }
.sh-card__t { font-size: 13px; font-weight: 500; line-height: 1.3; }
.sh-cards--4 .sh-card__t, .sh-cards--3 .sh-card__t { font-size: 15px; }
.sh-card__s { margin-top: -4px; font-size: 12px; color: var(--dj-muted); }
.sh-scrim { position: fixed; inset: var(--dj-header-h) 0 0 0; z-index: 1; background: rgba(0, 0, 0, 0.32); }

.sh-panel-enter-active, .sh-panel-leave-active { transition: opacity 0.28s ease, transform 0.36s var(--dj-ease); }
.sh-panel-enter-from, .sh-panel-leave-to { opacity: 0; transform: translateY(-8px); }
.sh-fade-enter-active, .sh-fade-leave-active { transition: opacity 0.3s ease; }
.sh-fade-enter-from, .sh-fade-leave-to { opacity: 0; }

/* Мобильное меню */
.sh-mob { position: fixed; inset: var(--dj-header-h) 0 0 0; z-index: 1; overflow-y: auto; background: #fff; padding: 8px 24px 40px; }
.sh-mob ul { list-style: none; margin: 0; padding: 0; }
.sh-mob li { border-bottom: 1px solid var(--dj-line); }
.sh-mob__row { display: flex; align-items: center; justify-content: space-between; }
.sh-mob__row a { flex: 1; padding: 16px 0; font-size: 20px; font-weight: 600; color: var(--dj-ink); }
.sh-mob__row button { display: grid; place-items: center; width: 44px; height: 44px; color: var(--dj-muted); }
.sh-mob__row button svg { width: 22px; height: 22px; transition: transform 0.3s var(--dj-ease); }
.sh-mob__row button[aria-expanded='true'] svg { transform: rotate(180deg); }
.sh-mob__sub { display: grid; gap: 2px; padding: 0 0 14px; }
.sh-mob__sub a { padding: 8px 0; font-size: 16px; color: var(--dj-text); }
.sh-mob__foot { display: grid; gap: 16px; margin-top: 28px; }
.sh-mob__foot > a:first-child { font-size: 18px; font-weight: 600; color: var(--dj-ink); }

@media (max-width: 1440px) { .sh-phone { display: none; } }
@media (max-width: 1279px) { .sh-link { padding: 0 9px; font-size: 13.5px; } .sh-link::after { left: 9px; right: 9px; } .sh-bar { gap: 18px; } }
@media (max-width: 1179px) {
  .sh-nav { display: none; }
  .sh-burger { display: block; }
}
@media (max-width: 767px) { .sh-cta { display: none; } }
</style>
