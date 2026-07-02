export default defineNuxtConfig({
  compatibilityDate: '2026-03-06',

  devtools: { enabled: true },

  modules: [
    '@nuxtjs/tailwindcss',
    '@nuxtjs/sitemap',
    '@nuxtjs/robots',
    'nuxt-schema-org',
  ],

  site: {
    url: 'https://ecoservisproekt.com',
    name: 'ESP — ЭкоСервисПроект',
    description: 'Проектирование, производство и монтаж очистных сооружений «под ключ». 25+ лет опыта, 150+ реализованных проектов в Беларуси и СНГ.',
    defaultLocale: 'ru',
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
        { name: 'description', content: 'Премиальный технологический партнер в сфере очистки воды. 25+ лет опыта, 150+ реализованных проектов, 30 000 элементов под контролем.' },
        { property: 'og:type', content: 'website' },
        { property: 'og:site_name', content: 'ЭкоСервисПроект (ESP)' },
        { property: 'og:locale', content: 'ru_RU' },
        { property: 'og:image', content: 'https://ecoservisproekt.com/images/team/team-hero-1.png' },
        { name: 'twitter:card', content: 'summary_large_image' }
      ],
      link: [
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap' },
        { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' }
      ]
    }
  },

  vite: {
    build: {
      target: 'esnext'
    }
  }
})
