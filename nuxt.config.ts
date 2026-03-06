export default defineNuxtConfig({
  compatibilityDate: '2026-03-06',
  
  devtools: { enabled: true },
  
  modules: [
    '@nuxtjs/tailwindcss',
  ],
  
  css: [
    '~/assets/styles/main.css'
  ],
  
  app: {
    head: {
      title: 'ESP | Архитекторы технологических экосистем',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: 'Премиальный технологический партнер в сфере очистки воды. 18 лет опыта, 30 000 элементов под контролем.' }
      ],
      link: [
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap' }
      ]
    }
  },
  
  vite: {
    build: {
      target: 'esnext'
    }
  }
})