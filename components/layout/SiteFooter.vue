<template>
  <!-- Футер в подаче DJI: тёмная полоса-призыв сверху, колонки ссылок,
       нижняя строка с правовой информацией. На мобильном колонки
       сворачиваются в аккордеон. -->
  <footer class="sf">
    <!-- Сервисная строка, как Where to buy / Support / Fly Safe у DJI -->
    <div class="sf-svc">
      <NuxtLink v-for="s in services" :key="s.t" :to="s.to" class="sf-svc__i">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path :d="s.icon" /></svg>
        <b>{{ s.t }}</b>
        <span class="dj-more">{{ s.more }}</span>
      </NuxtLink>
    </div>

    <div class="sf-cols">
      <div v-for="col in cols" :key="col.h" class="sf-col" :class="{ 'is-open': open === col.h }">
        <button class="sf-col__h" :aria-expanded="open === col.h" @click="open = open === col.h ? null : col.h">
          {{ col.h }}
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M6 9l6 6 6-6" /></svg>
        </button>
        <ul>
          <li v-for="l in col.links" :key="l.title">
            <a v-if="l.href" :href="l.href">{{ l.title }}</a>
            <NuxtLink v-else-if="l.to" :to="l.to">{{ l.title }}</NuxtLink>
            <span v-else>{{ l.title }}</span>
          </li>
        </ul>
      </div>
    </div>

    <div class="sf-bottom">
      <NuxtLink to="/" class="sf-logo" aria-label="ESP — на главную"><img src="/logo-esp.svg" alt="ESP" width="52" height="26" /></NuxtLink>
      <p>© 2007–2026 ООО "ЭкоСервисПроект". ESP (ЭкоСервисПроект) — все права защищены.</p>
      <nav>
        <NuxtLink to="/privacy">Конфиденциальность</NuxtLink>
        <NuxtLink to="/terms">Условия</NuxtLink>
      </nav>
      <p class="sf-made">Сделано в Беларуси</p>
      <a href="https://artdementiev.by" target="_blank" rel="noopener" class="sf-made">архитектура цифровой среды</a>
    </div>
  </footer>
</template>

<script setup>
import { ref } from 'vue'
import { contacts, technologies, solutions } from '~/composables/useSiteNav'

const open = ref(null)
const services = [
  { t: 'Обсудить проект', more: 'Оставить заявку', to: '/contacts#contact-form', icon: 'M4 5h16v11H8l-4 3.5V5zM8 9.5h8M8 12.5h5' },
  { t: 'Запросить презентацию', more: 'Подробнее', to: '/contacts', icon: 'M6 3h9l4 4v14H6V3zM14.5 3v4.5H19M9 12h7M9 15.5h7' },
  { t: 'Где нас найти', more: 'Контакты', to: '/contacts', icon: 'M12 21s-6.5-6-6.5-11a6.5 6.5 0 0113 0c0 5-6.5 11-6.5 11zM12 12.5a2.5 2.5 0 100-5 2.5 2.5 0 000 5z' }
]
const cols = [
  { h: 'Решения для бизнеса', links: solutions.map((s) => ({ title: s.title, to: `/solutions/${s.slug}` })) },
  { h: 'Технологии', links: [...technologies, { title: 'LiDAR-сканирование', to: '/technologies#lidar' }, { title: 'Цифровые двойники', to: '/technologies#digital-twin' }] },
  { h: 'Компания', links: [
    { title: 'О компании', to: '/about' }, { title: 'Команда', to: '/team' }, { title: 'Карьера', to: '/career' },
    { title: 'Новости', to: '/about/news' }, { title: 'Вебинары и события', to: '/webinars' }, { title: 'Партнёры', to: '/partners' }
  ] },
  { h: 'Каталог', links: [
    { title: 'Оборудование', to: '/equipment' }, { title: 'Проекты (Кейсы)', to: '/projects' }, { title: 'Услуги', to: '/services' },
    { title: 'Сертификаты', to: '/about/certifications' }, { title: 'Документация', to: '/about/documentation' }
  ] },
  { h: 'Контакты', links: [
    { title: contacts.phone, href: contacts.phoneHref }, { title: contacts.email, href: 'mailto:' + contacts.email },
    { title: contacts.address }, { title: contacts.hours }, { title: 'Все контакты', to: '/contacts' }
  ] }
]
</script>

<style scoped>
.sf { font-family: var(--dj-font); background: #16181b; color: rgba(255, 255, 255, 0.6); }
.sf-svc { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 24px; padding: clamp(44px, 6vw, 68px) 24px; background: var(--dj-soft); text-align: center; }
.sf-svc__i { display: flex; flex-direction: column; align-items: center; gap: 8px; color: var(--dj-ink); }
.sf-svc__i svg { width: 40px; height: 40px; margin-bottom: 6px; }
.sf-svc__i b { font-size: 18px; font-weight: 600; }
.sf-cols { max-width: 1200px; margin: 0 auto; padding: 48px 24px 24px; display: grid; grid-template-columns: repeat(5, minmax(0, 1fr)); gap: 32px; }
.sf-col__h { display: flex; align-items: center; justify-content: space-between; width: 100%; font-size: 14px; font-weight: 600; color: #fff; text-align: left; cursor: default; }
.sf-col__h svg { display: none; width: 18px; height: 18px; }
.sf-col ul { list-style: none; margin: 14px 0 0; padding: 0; display: grid; gap: 10px; }
.sf-col li { font-size: 13px; line-height: 1.45; }
.sf-col a { color: rgba(255, 255, 255, 0.6); transition: color 0.2s ease; }
.sf-col a:hover { color: #fff; }
.sf-bottom { max-width: 1200px; margin: 0 auto; padding: 24px 24px 36px; display: flex; flex-wrap: wrap; align-items: center; gap: 10px 24px; font-size: 12px; border-top: 1px solid rgba(255, 255, 255, 0.08); }
.sf-logo img { filter: brightness(0) invert(1); opacity: 0.9; }
.sf-bottom nav { display: flex; gap: 18px; }
.sf-bottom a { color: rgba(255, 255, 255, 0.6); }
.sf-bottom a:hover { color: #fff; }
.sf-made { margin-left: auto; }
.sf-made + .sf-made { margin-left: 0; }

@media (max-width: 1023px) { .sf-cols { grid-template-columns: repeat(3, minmax(0, 1fr)); } }
@media (max-width: 767px) {
  .sf-svc { grid-template-columns: 1fr; gap: 36px; }
  .sf-cols { grid-template-columns: 1fr; gap: 0; padding-top: 16px; }
  .sf-col { border-bottom: 1px solid rgba(255, 255, 255, 0.08); }
  .sf-col__h { padding: 16px 0; cursor: pointer; }
  .sf-col__h svg { display: block; transition: transform 0.3s var(--dj-ease); }
  .sf-col.is-open .sf-col__h svg { transform: rotate(180deg); }
  .sf-col ul { display: none; margin: 0 0 16px; }
  .sf-col.is-open ul { display: grid; }
  .sf-made { margin-left: 0; }
}
</style>
