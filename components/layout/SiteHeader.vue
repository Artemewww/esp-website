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
            <svg class="sh-cx__tel" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5.2 3h3.1c.5 0 .9.3 1 .8l.8 3.4c.1.4-.1.8-.4 1.1l-1.8 1.4a13 13 0 0 0 6.4 6.4l1.4-1.8c.3-.3.7-.5 1.1-.4l3.4.8c.5.1.8.5.8 1v3.1c0 .7-.6 1.2-1.3 1.2C10.6 20 4 13.4 4 4.3 4 3.6 4.5 3 5.2 3Z" /></svg>
            <svg class="sh-cx__chev" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><path d="M6 9l6 6 6-6" /></svg>
          </button>
          <Transition name="sh-panel">
            <ul v-if="cxOpen" class="sh-cx__menu" role="menu">
              <!-- #61: режим работы — статус, отсчёт и шкала дня (минское время) -->
              <li class="sh-work" role="none"><WorkDay compact /></li>
              <li v-for="c in channels" :key="c.id" role="none">
                <a role="menuitem" :href="c.href" :target="c.ext ? '_blank' : undefined" rel="noopener" :style="{ '--brand': c.color }" @click="cxOpen = false">
                  <i class="sh-cx__ico" :class="{ 'is-fill': c.fill }"><svg v-if="c.fill" viewBox="0 0 100 100" fill="currentColor" aria-hidden="true"><path fill-rule="evenodd" clip-rule="evenodd" :d="c.icon" /></svg><svg v-else viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path :d="c.icon" /></svg></i>
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
            <div class="sh-cards" :class="[current.key === 'equip' ? 'sh-cards--8' : (current.items.length > 4 ? 'sh-cards--6' : 'sh-cards--4'), ['proj', 'news'].includes(current.key) ? 'sh-cards--photo' : (current.key !== 'equip' ? 'sh-cards--icon' : '')]">
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
          <li v-for="s in mobNav" :key="s.key">
            <div class="sh-mob__row">
              <NuxtLink :to="s.to" @click="closeAll">{{ s.label }}</NuxtLink>
              <button v-if="hasSub(s) && s.key !== 'news'" :aria-expanded="mobSub === s.key" :aria-label="'Раскрыть: ' + s.label" @click="mobSub = mobSub === s.key ? null : s.key">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M6 9l6 6 6-6" /></svg>
              </button>
            </div>
            <div v-if="mobSub === s.key" class="sh-mob__sub">
              <!-- Технологии: стадии очистки текстом + цифровые технологии иконками -->
              <template v-if="s.key === 'tech'">
                <NuxtLink v-for="t in technologies" :key="t.to" :to="t.to" class="sh-mob__txt" @click="closeAll">{{ t.title }}</NuxtLink>
              </template>
              <!-- Остальные разделы: мелкие иконки из мега-меню с подписью 11–12 px -->
              <div v-if="s.key === 'tech' || s.items" class="sh-mob__grid" :class="{ 'is-photo': s.key === 'proj' }">
                <NuxtLink v-for="it in (s.key === 'tech' ? digitalTech : s.items)" :key="it.to + it.title" :to="it.to" class="sh-mob__ic" @click="closeAll">
                  <span class="sh-mob__img"><img :src="it.img" alt="" loading="lazy" decoding="async" /></span>
                  <span class="sh-mob__t">{{ it.title }}</span>
                </NuxtLink>
              </div>
              <template v-else-if="s.links">
                <NuxtLink v-for="l in s.links" :key="l.to + l.title" :to="l.to" class="sh-mob__txt" @click="closeAll">{{ l.title }}</NuxtLink>
              </template>
              <NuxtLink :to="s.to" class="sh-mob__all" @click="closeAll">Смотреть все</NuxtLink>
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
              <svg v-if="c.fill" viewBox="0 0 100 100" fill="currentColor" aria-hidden="true"><path fill-rule="evenodd" clip-rule="evenodd" :d="c.icon" /></svg><svg v-else viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path :d="c.icon" /></svg>
              <span>{{ c.short }}</span>
            </a>
          </div>
          <button v-if="!cb.sent.value && !cbOpen" type="button" class="sh-help__cbbtn" @click="openCallback">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path :d="ICON.tel" /></svg>
            Перезвоните мне
          </button>
          <form v-else-if="!cb.sent.value" ref="cbForm" class="sh-help__form" @submit.prevent="sendCallback">
            <b>Перезвоните мне</b>
            <div class="sh-help__row"><input v-model.trim="cbName" name="name" type="text" autocomplete="name" placeholder="Имя" aria-label="Имя" />
            <input v-model.trim="cbPhone" name="phone" type="tel" autocomplete="tel" inputmode="tel" placeholder="Телефон" aria-label="Телефон" required /></div>
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
import { ref, computed, watch, nextTick, onMounted, onBeforeUnmount } from 'vue'
import { nav, technologies, digitalTech, contacts } from '~/composables/useSiteNav'

const route = useRoute()
const panel = ref(null)
const mobileOpen = ref(false)
// В мобильном меню «Новости» — ниже, перед «Контактами», без раскрытия
const mobNav = computed(() => { const n = nav.find((x) => x.key === 'news'); const rest = nav.filter((x) => x.key !== 'news' && x.key !== 'contacts'); return [...rest, ...(n ? [n] : []), ...nav.filter((x) => x.key === 'contacts')] })
const mobSub = ref(null)
const scrolled = ref(false)
// Полноэкранные сцены (data-immersive) — меню уезжает вверх, чтобы не мешать
const immersive = ref(false)

// ── Способы связи. Телефон и почта — из useSiteNav.contacts; Telegram и WhatsApp —
// действующие ссылки компании (были в HeaderContacts). Почта/Telegram/WhatsApp — залитые круглые знаки (viewBox 100).
const ICON = {
  tel: 'M5.2 3h3.1c.5 0 .9.3 1 .8l.8 3.4c.1.4-.1.8-.4 1.1l-1.8 1.4a13 13 0 0 0 6.4 6.4l1.4-1.8c.3-.3.7-.5 1.1-.4l3.4.8c.5.1.8.5.8 1v3.1c0 .7-.6 1.2-1.3 1.2C10.6 20 4 13.4 4 4.3 4 3.6 4.5 3 5.2 3Z',
  mail: 'M50 100C77.6142 100 100 77.6142 100 50C100 22.3858 77.6142 0 50 0C22.3858 0 0 22.3858 0 50C0 77.6142 22.3858 100 50 100ZM51.8276 49.2076L74.191 33.6901C73.4347 32.6649 72.2183 32 70.8466 32H29.1534C27.8336 32 26.6576 32.6156 25.8968 33.5752L47.5881 49.172C48.8512 50.0802 50.5494 50.0945 51.8276 49.2076ZM75 63.6709V37.6286L53.4668 52.57C51.1883 54.151 48.1611 54.1256 45.9095 52.5066L25 37.4719V63.6709C25 65.9648 26.8595 67.8243 29.1534 67.8243H70.8466C73.1405 67.8243 75 65.9648 75 63.6709Z',
  tg: 'M50 100c27.614 0 50-22.386 50-50S77.614 0 50 0 0 22.386 0 50s22.386 50 50 50Zm21.977-68.056c.386-4.38-4.24-2.576-4.24-2.576-3.415 1.414-6.937 2.85-10.497 4.302-11.04 4.503-22.444 9.155-32.159 13.734-5.268 1.932-2.184 3.864-2.184 3.864l8.351 2.577c3.855 1.16 5.91-.129 5.91-.129l17.988-12.238c6.424-4.38 4.882-.773 3.34.773l-13.49 12.882c-2.056 1.804-1.028 3.35-.129 4.123 2.55 2.249 8.82 6.364 11.557 8.16.712.467 1.185.778 1.292.858.642.515 4.111 2.834 6.424 2.319 2.313-.516 2.57-3.479 2.57-3.479l3.083-20.226c.462-3.511.993-6.886 1.417-9.582.4-2.546.705-4.485.767-5.362Z',
  wa: 'M50 100C77.6142 100 100 77.6142 100 50C100 22.3858 77.6142 0 50 0C22.3858 0 0 22.3858 0 50C0 77.6142 22.3858 100 50 100ZM69.7626 28.9928C64.6172 23.841 57.7739 21.0027 50.4832 21C35.4616 21 23.2346 33.2252 23.2292 48.2522C23.2274 53.0557 24.4823 57.7446 26.8668 61.8769L23 76L37.4477 72.2105C41.4282 74.3822 45.9107 75.5262 50.4714 75.528H50.4823C65.5029 75.528 77.7299 63.301 77.7363 48.2749C77.7408 40.9915 74.9089 34.1446 69.7626 28.9928ZM62.9086 53.9588C62.2274 53.6178 58.8799 51.9708 58.2551 51.7435C57.6313 51.5161 57.1766 51.4024 56.7228 52.0845C56.269 52.7666 54.964 54.2998 54.5666 54.7545C54.1692 55.2092 53.7718 55.2656 53.0915 54.9246C52.9802 54.8688 52.8283 54.803 52.6409 54.7217C51.6819 54.3057 49.7905 53.4855 47.6151 51.5443C45.5907 49.7382 44.2239 47.5084 43.8265 46.8272C43.4291 46.1452 43.7837 45.7769 44.1248 45.4376C44.3292 45.2338 44.564 44.9478 44.7987 44.662C44.9157 44.5194 45.0328 44.3768 45.146 44.2445C45.4345 43.9075 45.56 43.6516 45.7302 43.3049C45.7607 43.2427 45.7926 43.1776 45.8272 43.1087C46.0545 42.654 45.9409 42.2565 45.7708 41.9155C45.6572 41.6877 45.0118 40.1167 44.4265 38.6923C44.1355 37.984 43.8594 37.3119 43.671 36.8592C43.1828 35.687 42.6883 35.69 42.2913 35.6924C42.2386 35.6928 42.1876 35.6931 42.1386 35.6906C41.7421 35.6706 41.2874 35.667 40.8336 35.667C40.3798 35.667 39.6423 35.837 39.0175 36.5191C38.9773 36.5631 38.9323 36.6111 38.8834 36.6633C38.1738 37.4209 36.634 39.0648 36.634 42.2002C36.634 45.544 39.062 48.7748 39.4124 49.2411L39.415 49.2444C39.4371 49.274 39.4767 49.3309 39.5333 49.4121C40.3462 50.5782 44.6615 56.7691 51.0481 59.5271C52.6732 60.2291 53.9409 60.6475 54.9303 60.9612C56.5618 61.4796 58.046 61.4068 59.22 61.2313C60.5286 61.0358 63.2487 59.5844 63.8161 57.9938C64.3836 56.4033 64.3836 55.0392 64.2136 54.7554C64.0764 54.5258 63.7545 54.3701 63.2776 54.1395C63.1633 54.0843 63.0401 54.0247 62.9086 53.9588Z'
}
const channels = [
  { id: 'tel', label: 'Позвонить', short: 'Звонок', sub: contacts.phone, href: contacts.phoneHref, icon: ICON.tel, color: '#002366' },
  { id: 'mail', label: 'Написать на почту', short: 'Почта', sub: contacts.email, href: `mailto:${contacts.email}`, icon: ICON.mail, fill: true, color: '#002366' },
  { id: 'tg', label: 'Telegram', short: 'Telegram', sub: '@ecoservisproekt', href: 'https://t.me/ecoservisproekt', icon: ICON.tg, fill: true, color: '#229ED9', ext: true },
  { id: 'wa', label: 'WhatsApp', short: 'WhatsApp', sub: '+375 29 165-60-61', href: 'https://wa.me/375291656061', icon: ICON.wa, fill: true, color: '#25D366', ext: true }
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
// форма обратного звонка свёрнута в кнопку — меню помещается в один экран
const cbOpen = ref(false)
const cbForm = ref(null)
const openCallback = () => {
  cbOpen.value = true
  nextTick(() => {
    cbForm.value?.scrollIntoView({ block: 'end', behavior: 'smooth' })
    cbForm.value?.querySelector('input[type=tel]')?.focus({ preventScroll: true })
  })
}
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
const closeAll = () => { clearTimeout(closeTimer); panel.value = null; mobileOpen.value = false; mobSub.value = null; cxOpen.value = false; cbOpen.value = false }

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
.sh-cards--6 { grid-template-columns: repeat(6, minmax(0, 1fr)); }
/* Предмет на белом без рамки — как иконки «Технологий» */
.sh-cards--icon .sh-card__img { aspect-ratio: 4 / 3; border-radius: 0; background: none; }
.sh-cards--icon .sh-card__img img { object-fit: contain; padding: 4%; mix-blend-mode: normal; }
.sh-cards--icon .sh-card:hover .sh-card__img img { transform: translateY(-4px) scale(1.03); }
.sh-cards--photo .sh-card__t { display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
.sh-card { display: flex; flex-direction: column; align-items: center; gap: 8px; text-align: center; color: #333333; }
.sh-card__img { display: block; width: 100%; aspect-ratio: 4 / 3; overflow: hidden; border-radius: var(--r-sm); background: transparent; }
.sh-card__img img { width: 100%; height: 100%; object-fit: contain; mix-blend-mode: multiply; transition: transform 0.6s var(--dj-ease); }
.sh-cards--photo .sh-card__img { aspect-ratio: 16 / 10; }
.sh-cards--photo .sh-card__img img { object-fit: cover; mix-blend-mode: normal; }
.sh-cards--3 .sh-card__img img { object-fit: contain; padding: 6%; mix-blend-mode: normal; }
.sh-card:hover .sh-card__img img { transform: scale(1.04); }
.sh-card:hover .sh-card__t { color: #000; }
.sh-card__t { font-size: 12px; line-height: 1.33337; font-weight: 600; letter-spacing: -0.01em; }
.sh-cards--4 .sh-card__t, .sh-cards--3 .sh-card__t, .sh-cards--6 .sh-card__t { font-size: 14px; line-height: 1.28577; letter-spacing: -0.016em; }
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
.sh-help__top img { display: block; width: auto; height: 128px; margin-bottom: -34px; object-fit: contain; object-position: center bottom; border-radius: 0; background: none; position: relative; z-index: 0; }
/* Блок графика перекрывает низ пары — люди «выглядывают» из-за него */
.sh-help__wd { position: relative; z-index: 1; }
.sh-help h3 { margin: 4px 0 2px; font-size: 21px; line-height: 1.19; font-weight: 600; letter-spacing: 0.011em; color: #1A1A1A; }
.sh-help p { margin: 0; font-size: 14px; line-height: 1.36; color: var(--dj-muted, #5E5E5E); }
.sh-help__ch { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 6px; margin-top: 16px; }
.sh-help__ch a { display: grid; justify-items: center; gap: 5px; padding: 9px 2px; border-radius: var(--r-sm); background: #EDEDED; color: #1A1A1A; font-size: 11px; line-height: 1.2; }
.sh-help__ch svg { width: 24px; height: 24px; color: var(--brand); }
.sh-help__cbbtn { display: flex; align-items: center; justify-content: center; gap: 8px; width: 100%; height: 44px; margin-top: 14px; border-radius: var(--r-pill); background: #002366; color: #fff; font-size: 16px; font-weight: 500; }
.sh-help__cbbtn svg { width: 18px; height: 18px; }
.sh-help__row { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; }
.sh-cx__ico.is-fill { background: none; color: var(--brand); }
.sh-cx__ico.is-fill svg { width: 34px; height: 34px; }
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
  /* мобильное меню целиком в один экран (390×844): компактный список, свёрнутая форма */
  .sh-mob { display: flex; flex-direction: column; padding: 8px 20px 16px; }
  .sh-mob__row a { padding: 5px 0; font-size: 21px; line-height: 1.2; }
  .sh-mob__row button { width: 36px; height: 34px; }
  .sh-mob__sub { padding: 0 0 8px; }
  .sh-mob__sub a { padding: 5px 0; font-size: 15px; }
  .sh-help { margin-top: auto; padding: 14px; }
  .sh-mob > ul { margin-bottom: 14px; }
  .sh-help__top { gap: 12px; }
  .sh-help__top img { height: 96px; margin-bottom: -26px; }
  .sh-help h3 { font-size: 18px; }
  .sh-help p { font-size: 13px; line-height: 1.3; }
  .sh-help__wd { margin-top: 12px; padding: 10px 12px 4px; }
  .sh-help__ch { grid-template-columns: repeat(4, minmax(0, 1fr)); margin-top: 10px; }
  .sh-help__ch a { padding: 8px 2px; }
  .sh-help__cbbtn { margin-top: 10px; }
  .sh-help__form { margin-top: 10px; padding-top: 10px; }
  .sh-cx__menu { position: fixed; top: var(--dj-header-h); left: 12px; right: 12px; width: auto; }
}
/* Мобильное меню: иконки разделов сеткой, подпись 11–12 px */
.sh-mob__sub .sh-mob__txt { padding: 5px 0; font-size: 15px; font-weight: 600; letter-spacing: -0.016em; color: #333; }
.sh-mob__grid { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 12px 8px; padding: 6px 0 2px; }
.sh-mob__sub .sh-mob__ic { display: flex; flex-direction: column; align-items: center; gap: 5px; padding: 0; text-align: center; color: #333; }
.sh-mob__img { display: grid; place-items: center; width: 100%; aspect-ratio: 4 / 3; border-radius: 12px; overflow: hidden; }
.sh-mob__img img { width: 100%; height: 100%; object-fit: contain; }
.sh-mob__grid.is-photo .sh-mob__img img { width: 100%; height: 100%; object-fit: cover; }
.sh-mob__t { display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; font-size: 11px; line-height: 1.22; font-weight: 500; letter-spacing: -0.005em; }
.sh-mob__sub .sh-mob__all { justify-self: start; padding: 8px 0 0; font-size: 13px; font-weight: 500; color: var(--dj-link); }
.sh-mob__all::after { content: ' ›'; }
</style>
