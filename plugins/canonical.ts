// Канонический адрес на каждой странице: origin сайта + путь без query и хвостового «/».
// Страница может задать свой canonical через useHead — unhead сведёт дубли по rel=canonical,
// и победит более поздний (страничный) тег.
export default defineNuxtPlugin(() => {
  const route = useRoute()
  const origin = String(useRuntimeConfig().public.ogOrigin || 'https://ecoservisproekt.by').replace(/\/$/, '')
  useHead({
    link: [{
      rel: 'canonical',
      href: computed(() => {
        const path = route.path.length > 1 ? route.path.replace(/\/+$/, '') : '/'
        return origin + (path === '/' ? '/' : path)
      })
    }]
  })
})
