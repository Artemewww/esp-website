<template>
  <header 
    class="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
    :class="[
      hidden ? '-translate-y-full' : 'translate-y-0',
      scrolled ? 'glass border-b border-gray-200' : 'bg-transparent',
      scrolled ? 'header-scrolled' : '',
      headerOnDark ? 'is-dark' : 'is-light'
    ]"
  >
    <!-- White overlay for text visibility on video -->
    <div v-if="headerOnDark" class="absolute inset-0 bg-gradient-to-b from-black/30 to-transparent pointer-events-none"></div>
    <div class="max-w-[1600px] mx-auto px-6">
      <div class="flex items-center justify-between h-20">
        
        <!-- Logo -->
        <NuxtLink to="/" class="flex items-center flex-shrink-0">
          <svg width="100" height="34" viewBox="0 0 120 61" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M63.0562 1.29415C66.2988 4.75237 73.6844 12.9677 75.2426 17.0885C75.8406 18.671 76.4481 21.7646 73.9536 21.9386C71.7999 22.0887 71.3448 19.0047 70.6491 17.6391C70.1202 16.5999 69.1911 15.27 68.4787 14.3334C66.4465 11.6617 63.6947 9.12579 61.5838 6.45645L57.6694 11.5663C50.2599 29.0719 76.9818 26.4645 78.6018 42.3209C80.3458 59.4022 58.6129 65.9325 48.0395 54.1184L45.1972 50.5291C44.7088 50.5982 42.9624 52.8337 42.343 53.4081C29.5729 65.2152 9.53871 60.4938 2.45324 44.9854C-3.36714 32.2465 1.4526 16.8502 13.9082 10.3747C22.5375 5.88922 32.5868 7.24057 41.9785 7.40025C43.477 16.8335 41.5472 28.6072 34.2426 35.2805C29.4767 39.6339 23.2365 41.7799 16.8427 41.8132C15.5211 41.82 14.5739 40.6019 14.7912 39.2983C14.9634 38.2655 15.8243 37.491 16.8696 37.432C18.5252 37.3387 20.1784 37.2264 21.8084 36.8845C30.6538 35.0313 35.8414 28.031 37.5864 19.9074C38.5857 15.2555 34.4738 11.29 29.7183 11.4424C25.9921 11.5616 22.2635 11.7808 18.7184 13.0511C8.10447 16.8621 2.58904 27.8564 5.03108 38.8221C5.18393 39.5065 5.41556 40.1635 5.66802 40.813C5.93275 41.4941 7.17602 41.3764 7.25631 40.6501C7.83525 35.4378 10.1034 30.5424 13.7581 26.7887C17.1602 23.2923 22.0086 21.9219 26.1207 19.5124C27.4032 18.7596 28.5079 17.8111 29.7476 17.0235C29.954 16.8923 30.2207 16.9132 30.4096 17.0686C30.5299 17.1675 30.6074 17.3107 30.6115 17.4663C30.6595 19.2819 29.453 20.8557 28.3078 22.1793C24.341 26.7625 18.1013 26.8912 14.4323 32.8233C6.6178 45.4573 15.421 58.4989 30.0971 55.1932C35.9961 53.8657 39.7294 50.0858 43.2721 45.5169C43.988 44.5937 44.1633 43.2027 45.8366 43.2027C47.5099 43.2027 48.2491 46.0031 49.1831 47.967C51.3392 52.4977 57.2787 56.69 62.3891 55.1432C65.7079 54.1398 67.2041 50.1263 66.6585 46.9016C65.372 39.2988 49.8311 37.671 46.7267 27.7873C43.2459 16.7096 55.5085 8.13432 61.1097 0.233567L61.6005 0C61.8936 0 62.7441 0.960484 63.0562 1.29177V1.29415ZM52.204 18.6043C51.0557 18.9118 50.6221 21.7432 50.5458 22.7775C49.6453 34.7609 68.7503 34.3891 70.7325 45.679C71.1614 48.1243 70.6968 49.397 70.5443 51.6397C70.4609 52.8576 71.3448 51.8304 71.7093 51.3728C74.2967 48.1195 75.0948 42.8261 72.9435 39.1701C68.2262 31.1549 52.4018 30.2779 52.204 18.6019V18.6043Z" :fill="headerOnDark ? 'white' : '#002366'"/>
            <path d="M94.9361 58.0852C91.2242 62.0606 83.7123 60.0157 83.1286 54.2313C82.1184 44.2189 84.3722 32.7384 95.3435 29.7735C97.8427 29.0991 100.342 29.2873 102.727 28.8297C106.627 28.0838 107.632 22.8261 104.283 20.6406C102.477 19.4609 99.4533 19.8303 98.1453 21.6178C97.1113 23.0287 97.3067 25.872 96.468 26.6109C95.7485 27.2424 93.4161 27.3354 92.4035 27.6595C91.9652 20.7693 96.5443 13.9697 104.106 15.812C113.367 18.0714 112.831 31.6564 103.356 33.2723C101.54 33.5821 99.6129 33.2913 97.776 33.6393C93.0325 34.5378 89.0395 38.4274 87.9888 43.1369C87.4956 45.3534 87.2431 51.7527 87.6982 53.9382C88.1937 56.331 91.908 56.1237 92.3463 53.6975C93.3065 48.3564 89.8567 39.6048 97.3472 37.7363C101.4 36.7257 105.162 37.8674 109.128 35.7176C118.92 30.4123 117.21 14.9897 106.391 12.0868C103.556 11.3265 94.2595 11.3957 91.0836 11.6769C88.7417 11.8842 87.8673 13.1307 87.6457 15.383C87.6457 21.8854 87.6457 25.2918 87.6457 31.0605C85.0398 33.2998 83.3716 35.8695 83.3716 35.8695C83.3716 35.8695 83.3716 35.8695 83.1143 15.1327C83.4883 10.3684 86.6356 7.44647 91.3171 7.14617C94.7765 6.92452 99.763 6.93644 103.229 7.14617C124.14 8.41411 125.82 37.2453 106.443 41.3685C104.263 41.8332 98.3311 41.2088 97.29 42.6841C95.2172 45.6203 98.5527 54.2003 94.9313 58.078L94.9361 58.0852Z" :fill="headerOnDark ? 'white' : '#002366'"/>
          </svg>
        </NuxtLink>

        <!-- Desktop Navigation: пункты — из composables/useSiteMenu.js, общий список с мобильным меню -->
        <nav class="hidden nav:flex items-center space-x-0">
          <div
            v-for="(section, idx) in navMenu"
            :key="section.id"
            class="relative group"
            @mouseenter="activeMenu = section.id"
            @mouseleave="activeMenu = null"
          >
            <NuxtLink :to="section.to" class="nav-link flex items-center gap-1" :class="{ 'nav-link-active': section.match.some(isActive) }">
              <span>{{ section.title }}</span>
              <svg class="w-4 h-4 transition-transform group-hover:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
              </svg>
            </NuxtLink>

            <div
              v-show="activeMenu === section.id"
              class="absolute top-full pt-4 w-[300px] max-w-[90vw]"
              :class="idx >= navMenu.length - 2 ? 'right-0' : 'left-0'"
            >
              <div class="glass rounded-xl shadow-xl border border-gray-200 overflow-hidden">
                <div class="p-4">
                  <h4 class="font-bold text-esp-black mb-3 font-rounded text-xs uppercase tracking-wider">{{ section.title }}</h4>
                  <NuxtLink
                    v-for="item in section.items"
                    :key="item.to"
                    :to="item.to"
                    class="mega-link !py-2 text-sm"
                    @click="activeMenu = null"
                  >
                    <div class="font-medium text-esp-black">{{ item.label }}</div>
                    <div v-if="item.hint" class="text-xs text-gray-500">{{ item.hint }}</div>
                  </NuxtLink>
                </div>
              </div>
            </div>
          </div>
        </nav>

        <!-- Utility Icons -->
        <div class="hidden nav:flex items-center space-x-3">
          <NuxtLink to="/search" class="p-2 hover:bg-gray-100/20 rounded-lg transition-colors block" title="Поиск по сайту">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
            </svg>
          </NuxtLink>

          

          
          <LayoutHeaderContacts :on-dark="headerOnDark" class="ml-1" />

          <NuxtLink to="/contacts" class="btn-primary ml-4">
            Заказать аудит
          </NuxtLink>
        </div>

        <!-- Связаться: телефон, мессенджеры и живой режим работы. Стоит
             рядом с бургером, потому что это самое частое действие. -->
        <div class="flex items-center gap-3 nav:hidden">
          <LayoutHeaderContacts :on-dark="headerOnDark" />
          <button @click="mobileMenuOpen = !mobileMenuOpen" class="p-2 -mr-2" aria-label="Меню">
            <svg v-if="!mobileMenuOpen" class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path>
            </svg>
            <svg v-else class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>
      </div>
    </div>

    <!-- Mobile Menu -->
    <div v-show="mobileMenuOpen" class="nav:hidden glass border-t border-gray-200 max-h-[80vh] overflow-y-auto">
      <div class="px-6 py-4 space-y-2">
        
        <!-- Mobile Accordions for each section -->
        <div v-for="section in navMenu" :key="section.id">
          <button 
            @click="mobileOpen = mobileOpen === section.id ? null : section.id" 
            class="mobile-nav-link"
          >
            <div class="flex items-center justify-between w-full">
              <!-- Text aligned left -->
              <span class="text-left flex-1">{{ section.title }}</span>
              <!-- Arrow aligned right, same vertical level -->
              <svg 
                class="w-5 h-5 flex-shrink-0 transition-transform duration-300" 
                :class="{ 'rotate-180': mobileOpen === section.id }" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
              </svg>
            </div>
          </button>
          <div v-show="mobileOpen === section.id" class="pl-4 mt-2 space-y-2">
            <NuxtLink 
              v-for="item in section.items" 
              :key="item.to"
              :to="item.to" 
              class="mobile-sublink text-left"
              @click="mobileMenuOpen = false"
            >
              {{ item.label }}
            </NuxtLink>
          </div>
        </div>

        <!-- Mobile CTA -->
        <div class="pt-4 mt-4 border-t border-gray-200">
          <NuxtLink to="/contacts" class="btn-primary w-full block text-center">
            Заказать технический аудит
          </NuxtLink>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup>
import { ref, computed, watch, onMounted, onUnmounted, nextTick } from 'vue'
import { navMenu } from '~/composables/useSiteMenu'

const route = useRoute()
const isActive = (path) => route.path === path || route.path.startsWith(path + '/')

const mobileMenuOpen = ref(false)
const scrolled = ref(false)
const hidden = ref(false)
// Логотип был белым всегда, пока страница не проскроллена, — и на светлых
// страницах пропадал на белом фоне. Теперь смотрим, что реально лежит под
// шапкой, а не гадаем по факту скролла.
const heroIsDark = ref(false)
// Белая тема нужна на всех внутренних страницах. Автоопределение фона
// оставляем только для главной, где шапка действительно лежит на hero-видео.
const headerOnDark = computed(() => route.path === '/' && heroIsDark.value && !scrolled.value && !mobileMenuOpen.value)
const activeMenu = ref(null)
const mobileOpen = ref(null)
let lastScrollY = 0

const HEADER_H = 80

// Яркость подложки: пробуем точку сразу под шапкой и поднимаемся по предкам,
// пока не встретим непрозрачный фон.
const probeBackdrop = () => {
  if (typeof window === 'undefined') return
  const el = document.elementFromPoint(Math.round(window.innerWidth / 2), HEADER_H + 8)
  let node = el
  while (node && node !== document.documentElement) {
    // Явная метка блока сильнее любых вычислений: свои тёмные шапки
    // помечаем сами и не зависим от того, чем они покрашены.
    const flag = node.dataset && node.dataset.header
    if (flag === 'dark' || flag === 'light') {
      heroIsDark.value = flag === 'dark'
      return
    }

    const cs = getComputedStyle(node)
    const solid = readColor(cs.backgroundColor)
    if (solid) {
      heroIsDark.value = isDark(solid)
      return
    }
    // Градиент даёт прозрачный background-color, поэтому цвет берём из
    // background-image — иначе секция с градиентом «невидима» для пробы.
    const grad = cs.backgroundImage
    if (grad && grad.includes('gradient')) {
      const first = grad.match(/rgba?\([^)]+\)/)
      const c = first && readColor(first[0])
      if (c) {
        heroIsDark.value = isDark(c)
        return
      }
    }
    node = node.parentElement
  }
  // Ничего не нашли — считаем страницу светлой: тёмный логотип виден всегда.
  heroIsDark.value = false
}

// Разбор css-цвета в [r,g,b]; полупрозрачные слои пропускаем — под ними
// всё равно лежит что-то ещё.
function readColor(value) {
  const m = value && value.match(/rgba?\(([^)]+)\)/)
  if (!m) return null
  const parts = m[1].split(',').map((v) => parseFloat(v))
  const alpha = parts[3] === undefined ? 1 : parts[3]
  if (alpha <= 0.5) return null
  return parts.slice(0, 3)
}

// Стандартная формула воспринимаемой яркости
const isDark = ([r, g, b]) => (0.299 * r + 0.587 * g + 0.114 * b) < 140

// Полноэкранные сцены (цифровой двойник) на узких экранах шапка не
// перекрывает: кадр занимает весь экран, и выехавшее навстречу меню режет
// ему верх. Пока такая секция держит экран — шапка убрана, даже если
// прокрутка пошла вверх.
let immersiveNodes = []
const refreshImmersive = () => {
  immersiveNodes = Array.from(document.querySelectorAll('[data-immersive]'))
}
const inImmersive = () => {
  if (window.innerWidth > 1024) return false
  const h = window.innerHeight
  return immersiveNodes.some((el) => {
    const r = el.getBoundingClientRect()
    return r.top <= 0 && r.bottom > h * 0.5
  })
}

const handleScroll = () => {
  const y = window.scrollY
  scrolled.value = y > 50
  if (inImmersive()) {
    hidden.value = true
    lastScrollY = y
    return
  }
  if (y > lastScrollY && y > 150) {
    hidden.value = true
  } else {
    hidden.value = false
  }
  // У самого верха шапка снова ложится на подложку страницы — надо заново
  // понять, светлая она или тёмная.
  if (y <= 60) probeBackdrop()
  lastScrollY = y
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll, { passive: true })
  window.addEventListener('resize', probeBackdrop, { passive: true })
  nextTick(() => {
    probeBackdrop()
    refreshImmersive()
  })
  // Герой дорисовывается после гидрации (видео, картинки), поэтому одной
  // пробы мало — повторяем, пока страница устаканивается.
  setTimeout(probeBackdrop, 400)
  setTimeout(probeBackdrop, 1200)
})

watch(() => route.path, () => {
  nextTick(() => {
    probeBackdrop()
    setTimeout(probeBackdrop, 400)
  })
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
  window.removeEventListener('resize', probeBackdrop)
})
</script>

<style scoped>
/* Плотнее к 1400 px и просторнее на широких: девять разделов должны влезать
   в строку, не выталкивая кнопку аудита за экран. */
.nav-link {
  @apply px-1.5 2xl:px-2.5 py-2 transition-colors font-medium font-inter text-[13px] 2xl:text-sm whitespace-nowrap relative;
}
.nav-link:hover {
  @apply opacity-80;
}
.is-light {
  --header-text: #1A1A1A;
  color: var(--header-text);
}
.is-light .nav-link:not(.nav-link-active),
.is-light :deep(.hc),
.is-light :deep(.hc-phone),
.is-light :deep(.hc-hours-text) {
  color: var(--header-text) !important;
}
.is-dark {
  --header-text: #fff;
  color: #fff;
}
.is-dark .nav-link:not(.nav-link-active),
.is-dark :deep(.hc),
.is-dark :deep(.hc-phone),
.is-dark :deep(.hc-hours-text) {
  color: var(--header-text) !important;
}
.is-light > .max-w-\[1600px\] > div > a svg path {
  fill: #002366 !important;
}
.is-dark > .max-w-\[1600px\] > div > a svg path {
  fill: #fff !important;
}
.header-scrolled {
  background: rgba(255, 255, 255, 0.98) !important;
}
.nav-link-active {
  @apply !text-esp-blue;
}
.nav-link-active::after {
  content: '';
  position: absolute;
  left: 16px;
  right: 16px;
  bottom: -2px;
  height: 2px;
  background: #002366;
  border-radius: 2px;
}

.mega-link {
  @apply block px-4 py-3 hover:bg-gray-50 transition-colors border-l-2 border-transparent hover:border-esp-blue rounded-r-lg text-gray-800;
}
.mega-link .font-medium {
  @apply text-gray-900;
}

.mobile-nav-link {
  @apply block px-4 py-3 text-esp-black hover:text-esp-blue hover:bg-gray-50 transition-colors font-medium font-inter w-full;
}

.mobile-sublink {
  @apply block px-4 py-2 text-sm text-gray-700 hover:text-esp-blue hover:bg-gray-100 transition-colors rounded text-left;
}

.glass {
  background: rgba(255, 255, 255, 0.98);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  color: #1a1a2e;
}
.glass h4 {
  color: #1a1a2e;
}
.glass .text-gray-500,
.glass .text-gray-600 {
  color: #6b7280;
}

.btn-primary {
  @apply bg-esp-blue text-white px-6 py-2.5 rounded-none font-medium transition-all duration-300 hover:bg-opacity-90 hover:shadow-lg whitespace-nowrap;
}
</style>