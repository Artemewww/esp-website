import { createRouter, createWebHistory } from 'vue-router'
import Home from '@/views/Home.vue'
import Contact from '@/views/Contact.vue'  // ← Добавить импорт

// Заглушка для остальных страниц
const Placeholder = {
  template: `
    <div class="min-h-screen flex items-center justify-center bg-esp-grey/30">
      <div class="text-center px-4">
        <div class="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-esp-blue to-esp-green 
                    flex items-center justify-center text-4xl animate-pulse">
          🚧
        </div>
        <h1 class="text-2xl md:text-3xl font-heading font-semibold mb-3 text-esp-black">
          Страница в разработке
        </h1>
        <p class="text-esp-black/70 max-w-md mx-auto mb-8">
          Мы готовим для вас полноценный раздел с детальным контентом, 
          интерактивными элементами и кейсами.
        </p>
        <RouterLink to="/" class="btn btn--primary">
          ← Вернуться на главную
        </RouterLink>
      </div>
    </div>
  `
}

const routes = [
  { path: '/', name: 'Home', component: Home },
  { path: '/contact', name: 'Contact', component: Contact },  // ← Добавить маршрут
  { path: '/about', name: 'About', component: Placeholder },
  { path: '/services', name: 'Services', component: Placeholder },
  { path: '/projects', name: 'Projects', component: Placeholder },
  { path: '/technologies', name: 'Technologies', component: Placeholder },
  { path: '/equipment', name: 'Equipment', component: Placeholder },
  { path: '/team', name: 'Team', component: Placeholder },
  { path: '/resources', name: 'Resources', component: Placeholder },
  { path: '/:pathMatch(.*)*', redirect: '/' }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    return savedPosition || { top: 0, behavior: 'smooth' }
  }
})

export default router