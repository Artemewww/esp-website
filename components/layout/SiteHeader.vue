<template>
  <!-- Шапка как глобальная навигация apple.com: полоса 44px, ссылки 12px,
       полупрозрачный фон с размытием. На главной поверх видео — тёмная
       (как у Apple на тёмных страницах), после первого экрана светлая.
       Наведение на раздел раскрывает выпадающую панель с размытием страницы. -->
  <header
    class="sh"
    :class="{ 'sh--over': overHero && !panel && !mobileOpen, 'sh--open': panel, 'sh--hide': immersive && !panel && !mobileOpen }"
    @mouseleave="closeSoon"
  >
    <div class="sh-bar">
      <NuxtLink to="/" class="sh-logo" aria-label="ESP — на главную" @click="closeAll">
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
        <!-- Телефон + выбор способа связи -->
        <div ref="cxEl" class="sh-cx" :class="{ 'is-open': cxOpen }" @mouseenter="cxHover(true)" @mouseleave="cxHover(false)">
          <a :href="contacts.phoneHref" class="sh-phone">{{ contacts.phone }}</a>
          <button class="sh-cx__btn" :aria-expanded="cxOpen" aria-haspopup="true" aria-label="Способы связи" @click="cxOpen = !cxOpen">
            <svg class="sh-cx__tel" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 16.5v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 3.1 3.7 2 2 0 0 1 5 1.5h3a2 2 0 0 1 2 1.7c.1.9.4 1.9.7 2.7a2 2 0 0 1-.4 2.1L9 9.3a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.7.7a2 2 0 0 1 1.7 2z" /></svg>
            <svg class="sh-cx__chev" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><path d="M6 9l6 6 6-6" /></svg>
          </button>
          <Transition name="sh-panel">
            <ul v-if="cxOpen" class="sh-cx__menu" role="menu">
              <!-- #61: режим работы — статус, отсчёт и шкала дня (минское время) -->
              <li class="sh-work" role="none"><WorkDay compact /></li>
              <li v-for="c in channels" :key="c.id" role="none">
                <a role="menuitem" :href="c.href" :target="c.ext ? '_blank' : undefined" rel="noopener" :style="{ '--brand': c.color }" @click="cxOpen = false">
                  <i class="sh-cx__ico"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path :d="c.icon" /></svg></i>
                  <span><b>{{ c.label }}</b><small>{{ c.sub }}</small></span>
                </a>
              </li>
            </ul>
          </Transition>
        </div>
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
        <!-- Карточка «Готовы помочь»: сотрудники ESP, мессенджеры, обратный звонок -->
        <section class="sh-help" aria-labelledby="sh-help-h">
          <div class="sh-help__top">
            <img src="/images/people/esp-team-cut-thumb.webp" alt="Сотрудники ESP" width="505" height="560" loading="lazy" decoding="async" />
            <div>
              <h3 id="sh-help-h">Готовы помочь</h3>
              <p>Подберём решение под ваш объект и ответим на вопросы.</p>
            </div>
          </div>
          <WorkDay class="sh-help__wd" compact />
          <div class="sh-help__ch">
            <a v-for="c in channels" :key="c.id" :href="c.href" :target="c.ext ? '_blank' : undefined" rel="noopener" :aria-label="c.label" :style="{ '--brand': c.color }">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path :d="c.icon" /></svg>
              <span>{{ c.short }}</span>
            </a>
          </div>
          <form v-if="!cb.sent.value" class="sh-help__form" @submit.prevent="sendCallback">
            <b>Перезвоните мне</b>
            <input v-model.trim="cbName" name="name" type="text" autocomplete="name" placeholder="Имя" aria-label="Имя" />
            <input v-model.trim="cbPhone" name="phone" type="tel" autocomplete="tel" inputmode="tel" placeholder="Телефон" aria-label="Телефон" required />
            <input name="website" type="text" tabindex="-1" autocomplete="off" class="sh-help__trap" aria-hidden="true" />
            <label class="sh-help__ok"><input v-model="cbConsent" type="checkbox" /> <span>Согласен на обработку <NuxtLink to="/privacy" @click="closeAll">персональных данных</NuxtLink></span></label>
            <button type="submit" :disabled="cb.sending.value">{{ cb.sending.value ? 'Отправляем…' : 'Жду звонка' }}</button>
            <small v-if="cb.error.value" class="sh-help__err">{{ cb.error.value }}</small>
          </form>
          <p v-else class="sh-help__done">Спасибо! Перезвоним в рабочее время — {{ contacts.hours }}.</p>
        </section>
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
// Полноэкранные сцены (data-immersive) — меню уезжает вверх, чтобы не мешать
const immersive = ref(false)

// ── Способы связи. Телефон и почта — из useSiteNav.contacts; Telegram и WhatsApp —
// действующие ссылки компании (были в HeaderContacts); Viber — тот же мобильный, что у WhatsApp.
const ICON = {
  tel: 'M21 16.5v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 3.1 3.7 2 2 0 0 1 5 1.5h3a2 2 0 0 1 2 1.7c.1.9.4 1.9.7 2.7a2 2 0 0 1-.4 2.1L9 9.3a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.7.7a2 2 0 0 1 1.7 2z',
  mail: 'M3 6.5h18v11H3zM3.5 7l8.5 6.5L20.5 7',
  tg: 'M21 4.5L2.8 11.6c-.8.3-.8 1.3 0 1.5l4.6 1.4 1.8 5.4c.2.6 1 .8 1.5.3l2.5-2.3 4.7 3.5c.6.4 1.4.1 1.5-.6L22 5.6c.2-.8-.4-1.4-1-1.1zM7.4 14.5l9.6-6.3-7.4 7.6',
  vb: 'M12 2.5c5.2 0 8.5 2.6 8.5 8.2s-3.3 8.3-8.5 8.3c-.8 0-1.6-.1-2.4-.2L6 21.5v-3.6C4 16.6 3.5 14.2 3.5 10.7 3.5 5.1 6.8 2.5 12 2.5zM9.2 7.3c.6 0 1.4 1.6 1.4 2 0 .5-.8.7-.8 1.1.3 1.4 1.6 2.7 3 3 .4 0 .6-.8 1.1-.8.4 0 2 .8 2 1.4 0 .8-1 1.5-1.8 1.5-2.6-.2-5.6-3.2-5.8-5.8 0-.8.7-2.4 1-2.4z',
  wa: 'M3.5 20.5l1.2-4.3A8.5 8.5 0 1 1 8 19.4zM9 8c-.4 0-1 .6-1 1.6 0 2.3 3.6 6.2 6.4 6.2 1 0 1.6-.7 1.6-1.2 0-.3-1.7-1.3-2-1.3s-.6.8-1 .8c-.9-.2-2.6-1.9-2.8-2.8 0-.4.8-.7.8-1S10 8 9.6 8z'
}
const channels = [
  { id: 'tel', label: 'Позвонить', short: 'Звонок', sub: contacts.phone, href: contacts.phoneHref, icon: ICON.tel, color: '#002366' },
  { id: 'mail', label: 'Написать на почту', short: 'Почта', sub: contacts.email, href: `mailto:${contacts.email}`, icon: ICON.mail, color: '#002366' },
  { id: 'tg', label: 'Telegram', short: 'Telegram', sub: '@ecoservisproekt', href: 'https://t.me/ecoservisproekt', icon: ICON.tg, color: '#229ED9', ext: true },
  { id: 'vb', label: 'Viber', short: 'Viber', sub: '+375 29 165-60-61', href: 'viber://chat?number=%2B375291656061', icon: ICON.vb, color: '#7360F2' },
  { id: 'wa', label: 'WhatsApp', short: 'WhatsApp', sub: '+375 29 165-60-61', href: 'https://wa.me/375291656061', icon: ICON.wa, color: '#25D366', ext: true }
]
const cxOpen = ref(false)
const cxEl = ref(null)
let cxTimer = null
const canHover = () => window.matchMedia('(hover: hover) and (pointer: fine)').matches
const cxHover = (on) => {
  if (!canHover()) return
  clearTimeout(cxTimer)
  if (on) { panel.value = null; cxOpen.value = true } else cxTimer = setTimeout(() => { cxOpen.value = false }, 180)
}
const onDocClick = (e) => { if (cxOpen.value && cxEl.value && !cxEl.value.contains(e.target)) cxOpen.value = false }

// ── Обратный звонок из мобильного меню → /api/lead
const cb = useLead('contact')
const cbName = ref('')
const cbPhone = ref('')
const cbConsent = ref(false)
const sendCallback = (e) => cb.send({ name: cbName.value, phone: cbPhone.value, topic: 'Перезвоните мне (мобильное меню)', consent: cbConsent.value ? 'on' : '' }, [], e)

const isHome = computed(() => route.path === '/')
const overHero = computed(() => isHome.value && !scrolled.value)
const current = computed(() => nav.find((s) => s.key === panel.value))
const footLabel = computed(() => ({ tech: 'Все технологии', equip: 'Весь каталог оборудования', sol: 'Все решения для бизнеса', about: 'О компании' }[panel.value] || 'Подробнее'))

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
const closeAll = () => { clearTimeout(closeTimer); panel.value = null; mobileOpen.value = false; mobSub.value = null; cxOpen.value = false }

const onScroll = () => {
  scrolled.value = window.scrollY > window.innerHeight * 0.82
  const h = window.innerHeight
  immersive.value = Array.from(document.querySelectorAll('[data-immersive]')).some((el) => {
    const r = el.getBoundingClientRect()
    return r.top <= 1 && r.bottom >= h * 0.98
  })
}
const onKey = (e) => { if (e.key === 'Escape') closeAll() }

watch(() => route.fullPath, () => { closeAll(); onScroll() })
watch(mobileOpen, (v) => { document.documentElement.style.overflow = v ? 'hidden' : '' })

onMounted(() => {
  onScroll()
  window.addEventListener('scroll', onScroll, { passive: true })
  window.addEventListener('keydown', onKey)
  document.addEventListener('click', onDocClick)
})
onBeforeUnmount(() => {
  window.removeEventListener('scroll', onScroll)
  window.removeEventListener('keydown', onKey)
  document.removeEventListener('click', onDocClick)
  document.documentElement.style.overflow = ''
})
</script>

<style scoped>
.sh { position: fixed; inset: 0 0 auto 0; z-index: 60; transition: transform 0.45s cubic-bezier(0.16, 1, 0.3, 1); font-family: var(--dj-font); color: rgba(0, 0, 0, 0.8); }
.sh-bar { position: relative; z-index: 2; display: flex; align-items: center; justify-content: space-between; gap: 8px; height: var(--dj-header-h); padding: 0 max(22px, calc((100% - 1180px) / 2 + 22px)); background: rgba(250, 250, 252, 0.8); backdrop-filter: saturate(180%) blur(20px); -webkit-backdrop-filter: saturate(180%) blur(20px); transition: background-color 0.32s cubic-bezier(0.4, 0, 0.6, 1), color 0.32s cubic-bezier(0.4, 0, 0.6, 1); }
.sh--open .sh-bar { background: #FAFAFA; backdrop-filter: none; -webkit-backdrop-filter: none; }
.sh--hide { transform: translateY(-100%); }
.sh--over { color: rgba(255, 255, 255, 0.8); }
.sh--over .sh-bar { background: rgba(26, 26, 26, 0.8); }
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
.sh-cta { display: inline-flex; align-items: center; min-height: 24px; margin-left: 4px; padding: 3px 11px; border-radius: var(--r-pill); background: var(--dj-blue); color: #fff; font-size: 12px; line-height: 1.33337; letter-spacing: -0.01em; white-space: nowrap; transition: background-color 0.2s ease; }
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
.sh-panel { position: absolute; inset: var(--dj-header-h) 0 auto 0; z-index: 2; background: #FAFAFA; }
.sh-panel__in { max-width: 1024px; margin: 0 auto; padding: 40px 22px 68px; display: grid; grid-template-columns: 1fr; gap: 28px 56px; }
.sh-panel__in--tech { grid-template-columns: auto 1fr; }
.sh-panel__foot { grid-column: 1 / -1; padding-top: 4px; }
.sh-panel__foot .dj-more { font-size: 12px; font-weight: 600; letter-spacing: -0.01em; }
.sh-col { display: flex; flex-direction: column; gap: 8px; min-width: 220px; }
.sh-col__h { font-size: 12px; line-height: 1.33337; letter-spacing: -0.01em; color: var(--dj-muted); margin-bottom: 6px; }
.sh-col__a { font-size: 17px; line-height: 1.235; font-weight: 600; letter-spacing: -0.022em; color: #333333; transition: color 0.2s ease; }
.sh-col__a:hover { color: #000; text-decoration: underline; text-underline-offset: 0.12em; }
.sh-col--grid { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 10px 40px; }
.sh-col__a--lg { font-size: 24px; line-height: 1.16667; font-weight: 600; letter-spacing: 0.009em; }
.sh-cards { display: grid; gap: 18px 12px; }
.sh-cards--3 { grid-template-columns: repeat(3, minmax(0, 1fr)); }
.sh-cards--4 { grid-template-columns: repeat(4, minmax(0, 1fr)); }
.sh-cards--8 { grid-template-columns: repeat(7, minmax(0, 1fr)); }
.sh-card { display: flex; flex-direction: column; align-items: center; gap: 8px; text-align: center; color: #333333; }
.sh-card__img { display: block; width: 100%; aspect-ratio: 4 / 3; overflow: hidden; border-radius: var(--r-sm); background: transparent; }
.sh-card__img img { width: 100%; height: 100%; object-fit: contain; mix-blend-mode: multiply; transition: transform 0.6s var(--dj-ease); }
.sh-cards--photo .sh-card__img { aspect-ratio: 16 / 10; }
.sh-cards--photo .sh-card__img img { object-fit: cover; mix-blend-mode: normal; }
.sh-cards--3 .sh-card__img img { object-fit: contain; padding: 6%; mix-blend-mode: normal; }
.sh-card:hover .sh-card__img img { transform: scale(1.04); }
.sh-card:hover .sh-card__t { color: #000; }
.sh-card__t { font-size: 12px; line-height: 1.33337; font-weight: 600; letter-spacing: -0.01em; }
.sh-cards--4 .sh-card__t, .sh-cards--3 .sh-card__t { font-size: 14px; line-height: 1.28577; letter-spacing: -0.016em; }
.sh-card__s { margin-top: -4px; font-size: 12px; line-height: 1.33337; letter-spacing: -0.01em; color: var(--dj-muted); }
.sh-scrim { position: fixed; inset: var(--dj-header-h) 0 0 0; z-index: 1; background: rgba(237, 237, 237, 0.4); backdrop-filter: blur(20px); -webkit-backdrop-filter: blur(20px); }

.sh-panel-enter-active, .sh-panel-leave-active { transition: opacity 0.32s cubic-bezier(0.4, 0, 0.6, 1), transform 0.32s cubic-bezier(0.4, 0, 0.6, 1); }
.sh-panel-enter-from, .sh-panel-leave-to { opacity: 0; transform: translateY(-6px); }
.sh-fade-enter-active, .sh-fade-leave-active { transition: opacity 0.32s cubic-bezier(0.4, 0, 0.6, 1); }
.sh-fade-enter-from, .sh-fade-leave-to { opacity: 0; }

/* Мобильное меню, как у apple.com: крупные ссылки 28px */
.sh-mob { position: fixed; inset: var(--dj-header-h) 0 0 0; z-index: 1; overflow-y: auto; background: #FAFAFA; padding: 20px 48px 48px; }
.sh-mob ul { list-style: none; margin: 0; padding: 0; }
.sh-mob__row { display: flex; align-items: center; justify-content: space-between; }
.sh-mob__row a { flex: 1; padding: 6px 0; font-size: 28px; line-height: 1.14286; font-weight: 600; letter-spacing: 0.007em; color: #333333; }
.sh-mob__row button { display: grid; place-items: center; width: 44px; height: 44px; color: var(--dj-muted); }
.sh-mob__row button svg { width: 20px; height: 20px; transition: transform 0.3s var(--dj-ease); }
.sh-mob__row button[aria-expanded='true'] svg { transform: rotate(180deg); }
.sh-mob__sub { display: grid; gap: 2px; padding: 4px 0 14px; }
.sh-mob__sub a { padding: 6px 0; font-size: 17px; line-height: 1.235; font-weight: 600; letter-spacing: -0.022em; color: #333333; }
/* Телефон + выпадающий выбор связи */
.sh-cx { position: relative; display: flex; align-items: center; }
.sh-cx__btn { display: flex; align-items: center; gap: 2px; height: var(--dj-header-h); padding: 0 4px; color: inherit; opacity: 0.85; transition: opacity 0.2s ease; }
.sh-cx__btn:hover, .sh-cx.is-open .sh-cx__btn { opacity: 1; }
.sh-cx__tel { display: none; width: 15px; height: 15px; }
.sh-cx__chev { width: 11px; height: 11px; transition: transform 0.3s var(--dj-ease); }
.sh-cx.is-open .sh-cx__chev { transform: rotate(180deg); }
.sh-work { margin: 0 0 6px; padding: 14px 10px 4px; border-bottom: 1px solid rgba(0, 0, 0, 0.08); }
.sh-help__wd { margin-top: 16px; padding: 14px 14px 6px; border-radius: 14px; background: #fff; box-shadow: inset 0 0 0 1px #EDEDED; }
.sh-cx__menu { position: absolute; top: calc(100% - 4px); right: 0; z-index: 5; width: 264px; margin: 0; padding: 8px; list-style: none; border-radius: var(--r-md); background: rgba(255, 255, 255, 0.96); backdrop-filter: saturate(180%) blur(20px); -webkit-backdrop-filter: saturate(180%) blur(20px); box-shadow: 0 18px 44px rgba(0, 0, 0, 0.16), 0 0 0 1px rgba(0, 0, 0, 0.05); color: #1A1A1A; }
.sh-cx__menu a { display: flex; align-items: center; gap: 12px; padding: 9px 10px; border-radius: var(--r-xs); transition: background-color 0.2s ease; }
.sh-cx__menu a:hover { background: #EDEDED; }
.sh-cx__ico { flex: 0 0 auto; display: grid; place-items: center; width: 34px; height: 34px; border-radius: 50%; color: #fff; background: #002366; } /* единый стиль каналов: фирменный синий круг */
.sh-cx__ico svg { display: block; width: 18px; height: 18px; }
.sh-cx__menu b { display: block; font-size: 14px; font-weight: 600; letter-spacing: -0.016em; }
.sh-cx__menu small { display: block; font-size: 12px; color: var(--dj-muted, #5E5E5E); }

/* Карточка «Готовы помочь» в мобильном меню */
.sh-help { margin-top: 28px; padding: 18px; border-radius: var(--r-md); background: #fff; box-shadow: 0 10px 30px rgba(0, 0, 0, 0.07), 0 0 0 1px rgba(0, 0, 0, 0.04); }
.sh-help__top { display: grid; grid-template-columns: auto 1fr; gap: 16px; align-items: end; }
/* Сотрудники «свободно» — вырезанные, без рамки и фона */
.sh-help__top img { display: block; width: auto; height: 112px; object-fit: contain; object-position: center bottom; border-radius: 0; background: none; }
.sh-help h3 { margin: 4px 0 2px; font-size: 21px; line-height: 1.19; font-weight: 600; letter-spacing: 0.011em; color: #1A1A1A; }
.sh-help p { margin: 0; font-size: 14px; line-height: 1.36; color: var(--dj-muted, #5E5E5E); }
.sh-help__ch { display: grid; grid-template-columns: repeat(5, minmax(0, 1fr)); gap: 6px; margin-top: 16px; }
.sh-help__ch a { display: grid; justify-items: center; gap: 5px; padding: 9px 2px; border-radius: var(--r-sm); background: #EDEDED; color: #1A1A1A; font-size: 11px; line-height: 1.2; }
.sh-help__ch svg { width: 22px; height: 22px; color: var(--brand); }
.sh-help__form { display: grid; gap: 8px; margin-top: 16px; padding-top: 16px; border-top: 1px solid rgba(0, 0, 0, 0.08); }
.sh-help__form > b { font-size: 15px; font-weight: 600; color: #1A1A1A; }
.sh-help__form input[type='text'], .sh-help__form input[type='tel'] { width: 100%; height: 44px; padding: 0 14px; border-radius: var(--r-sm); border: 1px solid #D6D6D6; background: #fff; font: inherit; font-size: 16px; color: #1A1A1A; }
.sh-help__form input:focus { outline: none; border-color: #002366; box-shadow: 0 0 0 3px rgba(0, 35, 102, 0.15); }
.sh-help__trap { position: absolute; left: -9999px; width: 1px; height: 1px; opacity: 0; }
.sh-help__ok { display: flex; gap: 8px; align-items: flex-start; font-size: 12px; line-height: 1.35; color: var(--dj-muted, #5E5E5E); }
.sh-help__ok input { margin-top: 2px; accent-color: #002366; }
.sh-help__ok a { text-decoration: underline; }
.sh-help__form button { height: 44px; border-radius: var(--r-pill); background: #002366; color: #fff; font-size: 16px; font-weight: 500; }
.sh-help__form button:disabled { opacity: 0.6; }
.sh-help__err { color: #c0392b; font-size: 12px; }
.sh-help__done { margin-top: 16px !important; padding-top: 16px; border-top: 1px solid rgba(0, 0, 0, 0.08); color: #1A1A1A !important; }

@media (max-width: 1279px) { .sh-phone { display: none; } .sh-cx__tel { display: block; } .sh-cx__chev { display: none; }
  /* иконки шапки на одной сетке: 32×44, знак 15px по центру */
  .sh-cx__btn { justify-content: center; width: 32px; padding: 0; opacity: 1; } }
@media (max-width: 1067px) {
  .sh-nav { display: none; }
  .sh-burger { display: block; }
  .sh-tools { margin-left: auto; }
}
@media (max-width: 734px) {
  .sh-bar { padding: 0 16px; }
  .sh-cta { display: none; }
  .sh-mob { padding: 16px 24px 40px; }
  .sh-cx__menu { position: fixed; top: var(--dj-header-h); left: 12px; right: 12px; width: auto; }
}
</style>
