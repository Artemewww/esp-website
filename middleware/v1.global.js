import { v1Redirect } from '~/composables/useSiteMenu'

// Скрытые в первой версии страницы уводим в ближайший открытый раздел.
export default defineNuxtRouteMiddleware((to) => {
  const target = v1Redirect(to.path)
  if (target) return navigateTo(target, { redirectCode: 302 })
})
