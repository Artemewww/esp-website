// Откуда мессенджеры и соцсети берут картинку превью.
// Канонический адрес сайта — ecoservisproekt.com, но пока этот домен обслуживает
// прежний сайт, и файлы og-картинок по нему отдают 404 — превью выходит без
// изображения. Поэтому картинку тянем с адреса, где этот проект реально лежит.
// После переключения домена достаточно поменять origin в этой строке.
const OG_ORIGIN = 'https://esp-websitetest.vercel.app'

export default defineNuxtConfig({
  compatibilityDate: '2026-03-06',

  devtools: { enabled: true },

  // Disabled: the #app-manifest virtual module fails to resolve in this
  // environment (Vite pre-transform error on every dev start), and we don't
  // rely on route-rules manifest matching, so turning it off avoids the crash.
  experimental: {
    appManifest: false
  },

  modules: [
    '@nuxtjs/tailwindcss',
    '@nuxtjs/sitemap',
    '@nuxtjs/robots',
    'nuxt-schema-org',
  ],

  site: {
    url: 'https://ecoservisproekt.com',
    name: 'ESP — ЭкоСервисПроект',
    description: 'Проектирование, производство и монтаж очистных сооружений «под ключ». 28 лет опыта, 2000+ реализованных проектов в Беларуси и СНГ.',
    defaultLocale: 'ru',
  },

  runtimeConfig: {
    public: {
      // Страницы берут origin og-картинок отсюда, чтобы при смене домена
      // правка была ровно в одном месте — в константе выше.
      ogOrigin: OG_ORIGIN
    }
  },

  schemaOrg: {
    identity: {
      type: 'Organization',
      name: 'ЭкоСервисПроект (ESP)',
      url: 'https://ecoservisproekt.com',
      logo: 'https://ecoservisproekt.com/logo-esp.svg',
      sameAs: [],
    },
  },

  sitemap: {
    exclude: ['/login', '/search'],
    sources: ['/api/__sitemap__/urls'],
  },

  robots: {
    disallow: ['/login', '/search'],
  },

  // Ролики и постеры слайдера неизменяемы (новая версия = новое имя файла),
  // поэтому отдаём их с годовым кэшем: повторный визит не тратит трафик.
  routeRules: {
    '/videos/**': { headers: { 'cache-control': 'public, max-age=31536000, immutable' } }
  },

  components: [
    { path: '~/components/ui', pathPrefix: false },
    '~/components'
  ],

  css: [
    '~/assets/styles/main.css'
  ],

  app: {
    head: {
      title: 'ESP | Архитекторы технологических экосистем',
      htmlAttrs: { lang: 'ru' },
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: 'Премиальный технологический партнер в сфере очистки воды. 28 лет опыта, 2000+ реализованных проектов, 30 000 элементов под контролем.' },
        { property: 'og:type', content: 'website' },
        { property: 'og:site_name', content: 'ЭкоСервисПроект (ESP)' },
        { property: 'og:locale', content: 'ru_RU' },
        { property: 'og:image', content: `${OG_ORIGIN}/images/team/team-hero-1.png` },
        { name: 'twitter:card', content: 'summary_large_image' }
      ],
      link: [
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap' },
        // SVG — основной; PNG на случай браузеров без поддержки svg-фавикона,
        // apple-touch — для иконки на домашнем экране iOS.
        { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' },
        { rel: 'icon', type: 'image/png', sizes: '32x32', href: '/favicon-32.png' },
        { rel: 'apple-touch-icon', sizes: '180x180', href: '/apple-touch-icon.png' }
      ]
    }
  },

  vite: {
    build: {
      target: 'esnext'
    }
  }
})
