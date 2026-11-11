<template>
  <!-- Футер как на apple.com: светло-серый, мелкий шрифт 12px, строка
       сервисов, колонки ссылок, внизу строка «где купить» и правовая линия.
       На мобильном колонки сворачиваются в аккордеон, как у Apple. -->
  <footer class="sf">
    <div class="sf-in">
      <!-- Сервисная строка: Обсудить проект / Презентация / Где нас найти -->
      <div class="sf-svc">
        <NuxtLink v-for="s in services" :key="s.t" :to="s.to" class="sf-svc__i">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path :d="s.icon" /></svg>
          <span><b>{{ s.t }}</b><span class="sf-svc__more">{{ s.more }}</span></span>
        </NuxtLink>
      </div>

      <nav class="sf-crumbs" aria-label="Хлебные крошки">
        <NuxtLink to="/" class="sf-logo" aria-label="ESP — на главную"><img src="/logo-esp.svg" alt="ESP" width="34" height="17" /></NuxtLink>
      </nav>

      <div class="sf-cols">
        <div v-for="col in cols" :key="col.h" class="sf-col" :class="{ 'is-open': open === col.h }">
          <h3><button class="sf-col__h" :aria-expanded="open === col.h" @click="open = open === col.h ? null : col.h">
            {{ col.h }}
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M6 9l6 6 6-6" /></svg>
          </button></h3>
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
        <p class="sf-copy">© 2007–2026 ООО «ЭкоСервисПроект». Все права защищены.</p>
        <nav class="sf-legal" aria-label="Правовая информация">
          <NuxtLink to="/privacy">Политика конфиденциальности</NuxtLink>
          <NuxtLink to="/terms">Условия использования</NuxtLink>
          <NuxtLink to="/contacts#requisites">Реквизиты</NuxtLink>
          <a href="/sitemap.xml">Карта сайта</a>
        </nav>
        <p class="sf-made">Беларусь</p>
      </div>
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
    { title: 'Отзывы', to: '/about/reviews' }, { title: 'Сертификаты', to: '/about/certifications' },
    { title: 'Документация', to: '/about/documentation' }, { title: 'Новости', to: '/about/news' }
  ] },
  { h: 'Каталог', links: [
    { title: 'Оборудование', to: '/equipment' }, { title: 'Проекты (Кейсы)', to: '/projects' }, { title: 'Услуги', to: '/services' },
    { title: 'Качество и сертификация', to: '/about#quality' }, { title: 'Реквизиты', to: '/contacts#requisites' }
  ] },
  { h: 'Контакты', links: [
    { title: contacts.phone, href: contacts.phoneHref }, { title: contacts.email, href: 'mailto:' + contacts.email },
    { title: contacts.address }, { title: contacts.hours }, { title: 'Все контакты', to: '/contacts' }
  ] }
]
</script>

<style scoped>
.sf { font-family: var(--dj-font); background: #f5f5f7; color: rgba(0, 0, 0, 0.56); font-size: 12px; line-height: 1.33337; letter-spacing: -0.01em; }
.sf-in { max-width: 1024px; margin: 0 auto; padding: 0 22px; }
.sf a { color: rgba(0, 0, 0, 0.72); }
.sf a:hover { color: rgba(0, 0, 0, 0.88); text-decoration: underline; }

.sf-svc { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 20px; padding: 28px 0 24px; border-bottom: 1px solid #d2d2d7; }
.sf .sf-svc__i { display: flex; align-items: center; gap: 12px; color: rgba(0, 0, 0, 0.88); text-decoration: none; }
.sf-svc__i svg { flex: 0 0 auto; width: 28px; height: 28px; color: #1d1d1f; }
.sf-svc__i b { display: block; font-size: 14px; line-height: 1.28577; font-weight: 600; letter-spacing: -0.016em; color: #1d1d1f; }
.sf-svc__more { color: var(--dj-link); }
.sf-svc__more::after { content: ' ›'; }
.sf-svc__i:hover .sf-svc__more { text-decoration: underline; }

.sf-crumbs { display: flex; align-items: center; padding: 17px 0 3px; }
.sf-logo { display: inline-flex; opacity: 0.8; }
.sf-logo img { width: 34px; height: auto; filter: grayscale(1); }

.sf-cols { display: grid; grid-template-columns: repeat(5, minmax(0, 1fr)); gap: 0 30px; padding: 20px 0 32px; border-bottom: 1px solid #d2d2d7; }
.sf-col h3 { margin: 0; font-size: inherit; }
.sf-col__h { display: flex; align-items: center; justify-content: space-between; width: 100%; font-size: 12px; line-height: 1.33337; font-weight: 600; letter-spacing: -0.01em; color: rgba(0, 0, 0, 0.88); text-align: left; cursor: default; }
.sf-col__h svg { display: none; width: 14px; height: 14px; }
.sf-col ul { list-style: none; margin: 9px 0 0; padding: 0; }
.sf-col li { margin-bottom: 0.8em; font-size: 12px; line-height: 1.33337; }
.sf-col li > span { color: rgba(0, 0, 0, 0.56); }

.sf-more { margin: 0; padding: 17px 0 11px; border-bottom: 1px solid #d2d2d7; }
.sf .sf-more a { color: var(--dj-link); text-decoration: underline; }

.sf-bottom { display: flex; flex-wrap: wrap; align-items: center; gap: 6px 0; padding: 12px 0 21px; }
.sf-copy { margin: 0 30px 0 0; }
.sf-legal { display: flex; flex-wrap: wrap; }
.sf-legal a { padding: 0 9px; border-left: 1px solid #d2d2d7; line-height: 1; }
.sf-legal a:first-child { padding-left: 0; border-left: 0; }
.sf-made { margin: 0 0 0 auto; }

@media (max-width: 1068px) { .sf-cols { grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 24px 30px; } }
@media (max-width: 734px) {
  .sf-in { padding: 0 16px; }
  .sf-svc { grid-template-columns: 1fr; gap: 16px; padding: 22px 0 18px; }
  .sf-cols { grid-template-columns: 1fr; gap: 0; padding: 4px 0 12px; }
  .sf-col { border-bottom: 1px solid #d2d2d7; }
  .sf-col:last-child { border-bottom: 0; }
  .sf-col__h { padding: 11px 0; font-weight: 400; color: rgba(0, 0, 0, 0.88); cursor: pointer; }
  .sf-col__h svg { display: block; transition: transform 0.3s var(--dj-ease); }
  .sf-col.is-open .sf-col__h svg { transform: rotate(180deg); }
  .sf-col ul { display: none; margin: 0 0 10px; padding-left: 0; }
  .sf-col.is-open ul { display: block; }
  .sf-bottom { flex-direction: column; align-items: flex-start; gap: 8px; }
  .sf-copy { margin: 0; }
  .sf-made { margin: 0; }
}
</style>
