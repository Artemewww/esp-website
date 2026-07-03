<template>
  <div v-if="!ready" class="bg-esp-gray min-h-screen flex items-center justify-center">
    <p class="text-esp-black/40 text-sm">Загрузка кабинета…</p>
  </div>
  <div v-else class="bg-esp-gray min-h-screen">
    <!-- Header -->
    <section class="bg-esp-black text-white py-10">
      <div class="container-custom flex flex-wrap items-center justify-between gap-4">
        <div>
          <span class="text-xs uppercase tracking-widest text-esp-lidar font-semibold font-inter">Личный кабинет партнёра</span>
          <h1 class="font-rounded text-3xl md:text-4xl mt-1">Здравствуйте, {{ user?.name || 'Партнёр' }}</h1>
          <p class="text-white/60 text-sm mt-1">{{ user?.email }} · {{ user?.role }}</p>
        </div>
        <button @click="doLogout" class="border border-white/40 text-white px-6 py-3 text-sm font-medium hover:bg-white hover:text-esp-black transition">
          Выйти
        </button>
      </div>
    </section>

    <div class="container-custom py-12 space-y-10">
      <!-- Saved specification -->
      <section class="bg-white p-8 border border-esp-gray">
        <div class="flex flex-wrap items-center justify-between gap-3 mb-6">
          <h2 class="font-rounded text-2xl text-esp-black">Моя спецификация</h2>
          <div v-if="specCart.length" class="flex gap-3">
            <button @click="clearCart" class="text-esp-black/50 text-sm hover:text-esp-black">Очистить</button>
            <button @click="downloadCsv" class="px-5 py-2 bg-esp-green text-white text-sm font-medium hover:bg-esp-green/90 transition">Скачать CSV</button>
          </div>
        </div>

        <div v-if="specCart.length" class="overflow-x-auto border border-esp-gray">
          <table class="w-full text-sm">
            <thead>
              <tr class="bg-esp-gray text-esp-black text-left">
                <th class="p-3 font-medium">Оборудование</th>
                <th class="p-3 font-medium">Категория</th>
                <th class="p-3 font-medium">Производительность</th>
                <th class="p-3"></th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="item in specCart" :key="item.slug" class="border-t border-esp-gray">
                <td class="p-3 text-esp-black font-medium">
                  <NuxtLink :to="`/equipment/${item.slug}`" class="text-esp-blue hover:underline">{{ item.name }}</NuxtLink>
                </td>
                <td class="p-3 text-esp-black/70">{{ item.category }}</td>
                <td class="p-3 text-esp-black/70">{{ item.capacity }}</td>
                <td class="p-3 text-right">
                  <button @click="toggleCartItem(item)" class="text-esp-black/40 hover:text-red-500 text-sm">Убрать</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div v-else class="border border-dashed border-esp-black/20 p-10 text-center text-esp-black/50 text-sm">
          Спецификация пуста. Добавьте оборудование кнопкой «В спецификацию» в
          <NuxtLink to="/equipment" class="text-esp-blue hover:underline">каталоге</NuxtLink>.
        </div>
      </section>

      <!-- Quick access -->
      <section>
        <h2 class="font-rounded text-2xl text-esp-black mb-6">Быстрый доступ</h2>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <NuxtLink
            v-for="card in quickCards"
            :key="card.to"
            :to="card.to"
            class="bg-white p-6 border border-esp-gray hover:border-esp-blue hover:shadow-lg transition block"
          >
            <div class="w-12 h-12 bg-esp-blue/10 flex items-center justify-center mb-4">
              <Icon :name="card.icon" cls="w-6 h-6 text-esp-blue" />
            </div>
            <h3 class="font-rounded text-lg text-esp-black mb-1">{{ card.title }}</h3>
            <p class="text-esp-black/60 text-sm">{{ card.desc }}</p>
          </NuxtLink>
        </div>
      </section>

      <!-- Documents -->
      <section class="bg-white p-8 border border-esp-gray">
        <h2 class="font-rounded text-2xl text-esp-black mb-6">Документы и материалы</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <NuxtLink to="/about/documentation" class="flex items-center gap-3 p-4 bg-esp-gray hover:bg-esp-gray/70 transition">
            <Icon name="download" cls="w-5 h-5 text-esp-blue flex-shrink-0" />
            <span class="text-esp-black text-sm">Нормативная документация (16 PDF)</span>
          </NuxtLink>
          <NuxtLink to="/about/certifications" class="flex items-center gap-3 p-4 bg-esp-gray hover:bg-esp-gray/70 transition">
            <Icon name="certificate" cls="w-5 h-5 text-esp-blue flex-shrink-0" />
            <span class="text-esp-black text-sm">Сертификаты и аттестаты</span>
          </NuxtLink>
          <NuxtLink to="/resources" class="flex items-center gap-3 p-4 bg-esp-gray hover:bg-esp-gray/70 transition">
            <Icon name="folder" cls="w-5 h-5 text-esp-blue flex-shrink-0" />
            <span class="text-esp-black text-sm">Технический блог и калькуляторы</span>
          </NuxtLink>
          <NuxtLink to="/about/cooperation" class="flex items-center gap-3 p-4 bg-esp-gray hover:bg-esp-gray/70 transition">
            <Icon name="check" cls="w-5 h-5 text-esp-blue flex-shrink-0" />
            <span class="text-esp-black text-sm">Условия сотрудничества и дилерства</span>
          </NuxtLink>
        </div>
      </section>

      <div v-if="user?.demo" class="text-center text-esp-black/40 text-xs font-inter">
        Демо-режим: данные не сохраняются на сервере, это витрина возможностей личного кабинета ESP.
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { useAuth } from '~/composables/useAuth'
import { useSpecCart } from '~/composables/useSpecCart'

const { user, isLoggedIn, logout } = useAuth()
const { specCart, toggleCartItem, clearCart, downloadCsv } = useSpecCart()

useHead({ title: 'Личный кабинет | ESP' })

// Кабинет — клиентский, зависит от sessionStorage. Рендерим только после
// монтирования, чтобы не было расхождения SSR/клиент (hydration mismatch).
const ready = ref(false)
onMounted(() => {
  if (!isLoggedIn()) { navigateTo('/login'); return }
  ready.value = true
})

const doLogout = () => {
  logout()
  navigateTo('/login')
}

const quickCards = [
  { to: '/equipment', icon: 'folder', title: 'Каталог оборудования', desc: 'Флотаторы, КНС, реакторы, фильтры — с BIM/CAD и генератором спецификаций.' },
  { to: '/projects#registry', icon: 'pin', title: 'Реестр объектов', desc: 'Все 240 реализованных объектов ESP на карте Беларуси с фильтрами.' },
  { to: '/equipment/compare', icon: 'chart', title: 'Сравнение моделей', desc: 'Подберите оптимальное оборудование, сравнив параметры бок о бок.' },
  { to: '/technologies', icon: 'bolt', title: 'Технологии', desc: 'LiDAR, 3D/BIM, цифровые двойники и 5 стадий очистки воды.' },
  { to: '/webinars', icon: 'clock', title: 'Вебинары и события', desc: 'Календарь обучающих вебинаров и мастер-классов инженеров ESP.' },
  { to: '/contacts', icon: 'phone', title: 'Связаться с инженером', desc: 'Запросите технический аудит или консультацию по вашему объекту.' }
]
</script>
