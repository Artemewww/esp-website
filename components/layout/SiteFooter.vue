<template>
  <!-- Футер как на apple.com: светло-серый, мелкий шрифт 12px, строка
       сервисов, колонки ссылок, внизу строка «где купить» и правовая линия.
       На мобильном колонки сворачиваются в аккордеон, как у Apple. -->
  <footer class="sf">
    <!-- Верхний край подвала — мягкая волна вместо ровной линии -->
    <svg class="sf-wave" viewBox="0 0 1440 40" preserveAspectRatio="none" aria-hidden="true"><path d="M0 22 C 120 6 240 6 360 20 S 600 36 720 22 S 960 6 1080 20 S 1320 36 1440 20 V40 H0 Z" /></svg>
    <div class="sf-in">
      <!-- Сервисная строка: Обсудить проект / Презентация / Где нас найти -->
      <div class="sf-svc">
        <NuxtLink v-for="s in services" :key="s.t" :to="s.to" class="sf-svc__i">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path :d="s.icon" /></svg>
          <span><b>{{ s.t }}</b><span class="sf-svc__more">{{ s.more }}</span></span>
        </NuxtLink>
      </div>

      <nav class="sf-crumbs" aria-label="Хлебные крошки">
        <NuxtLink to="/" class="sf-logo" aria-label="ESP — на главную"><img src="/logo-esp.svg" alt="ESP" width="34" height="17" /></NuxtLink>
      </nav>

      <div class="sf-cols">
        <div v-for="col in cols" :key="col.h" class="sf-col" :class="{ 'is-open': open === col.h }">
          <h3><button class="sf-col__h" :aria-expanded="open === col.h" @click="open = open === col.h ? null : col.h">
            {{ col.h }}
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M6 9l6 6 6-6" /></svg>
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


      <!-- Фирменный паттерн ESP вместо разделительной линии -->
      <div class="sf-pattern" aria-hidden="true" />
      <div class="sf-bottom">
        <p class="sf-copy">© 2007–2026 ООО «Экосервиспроект». Все права защищены.</p>
        <nav class="sf-legal" aria-label="Правовая информация">
          <NuxtLink to="/privacy">Политика конфиденциальности</NuxtLink>
          <NuxtLink to="/terms">Условия использования</NuxtLink>
          <NuxtLink to="/contacts#requisites">Реквизиты</NuxtLink>
          <a href="/sitemap.xml">Карта сайта</a>
        </nav>
      </div>
    </div>
    <!-- Подпись автора — «язычок» у нижнего края страницы. Текст ссылки читается
         поисковиком целиком: «Архитектура цифровой среды — artdementiev»;
         авторство дублируется в разметке schema.org (WebSite.creator). -->
    <div class="sf-sign">
      <a href="https://artdementiev.by" target="_blank" rel="noopener author" class="dev-credit" title="Архитектура цифровой среды — artdementiev">
        <span class="dev-credit__mark" aria-hidden="true" />
        <span class="dev-credit__sep" aria-hidden="true" />
        <span class="dev-credit__text"><span>Архитектура</span><span>цифровой среды</span><span class="sf-sr"> — artdementiev</span></span>
      </a>
    </div>
  </footer>
</template>

<script setup>
import { ref } from 'vue'
import { contacts, technologies, solutions } from '~/composables/useSiteNav'

const open = ref(null)

// Кто создал сайт — в понятном Google виде (schema.org)
useHead({
  script: [{
    type: 'application/ld+json',
    key: 'site-creator',
    innerHTML: JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      name: 'ESP — ЭкоСервисПроект',
      url: 'https://ecoservisproekt.by/',
      inLanguage: 'ru-BY',
      publisher: { '@type': 'Organization', name: 'ООО «Экосервиспроект»', url: 'https://ecoservisproekt.by/' },
      creator: { '@type': 'Organization', name: 'artdementiev', url: 'https://artdementiev.by/', description: 'Архитектура цифровой среды' }
    })
  }]
})
const services = [
  { t: 'Обсудить проект', more: 'Оставить заявку', to: '/contacts#contact-form', icon: 'M4 5h16v11H8l-4 3.5V5zM8 9.5h8M8 12.5h5' },
  { t: 'Запросить презентацию', more: 'Подробнее', to: '/contacts', icon: 'M6 3h9l4 4v14H6V3zM14.5 3v4.5H19M9 12h7M9 15.5h7' },
  { t: 'Где нас найти', more: 'Контакты', to: '/contacts', icon: 'M12 21s-6.5-6-6.5-11a6.5 6.5 0 0113 0c0 5-6.5 11-6.5 11zM12 12.5a2.5 2.5 0 100-5 2.5 2.5 0 000 5z' }
]
const cols = [
  { h: 'Решения для бизнеса', links: solutions.map((s) => ({ title: s.title, to: `/solutions/${s.slug}` })) },
  { h: 'Технологии', links: [...technologies, { title: 'LiDAR-сканирование', to: '/technologies#lidar' }, { title: 'Цифровые двойники', to: '/technologies#digital-twin' }] },
  { h: 'Компания', links: [
    { title: 'О компании', to: '/about' }, { title: 'Карьера', to: '/career' },
    { title: 'Отзывы', to: '/about/reviews' }, { title: 'Сертификаты', to: '/about/certifications' },
    { title: 'Документация', to: '/about/documentation' }, { title: 'Новости', to: '/about/news' }
  ] },
  { h: 'Каталог', links: [
    { title: 'Оборудование', to: '/equipment' }, { title: 'Объекты', to: '/projects' }, { title: 'Услуги', to: '/services' },
    { title: 'Качество и сертификация', to: '/about#quality' }, { title: 'Реквизиты', to: '/contacts#requisites' }
  ] },
  { h: 'Контакты', links: [
    { title: contacts.phone, href: contacts.phoneHref }, { title: contacts.email, href: 'mailto:' + contacts.email },
    { title: contacts.address }, { title: contacts.hours }, { title: 'Все контакты', to: '/contacts' }
  ] }
]
</script>

<style scoped>
.sf { font-family: var(--dj-font); background: #EDEDED; color: rgba(0, 0, 0, 0.56); font-size: 12px; line-height: 1.33337; letter-spacing: -0.01em; }
.sf-in { max-width: 1024px; margin: 0 auto; padding: 0 22px; }
.sf a { color: rgba(0, 0, 0, 0.72); }
.sf a:hover { color: rgba(0, 0, 0, 0.88); text-decoration: underline; }

.sf-svc { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 20px; padding: 28px 0 24px; border-bottom: 1px solid #D6D6D6; }
.sf .sf-svc__i { display: flex; flex-direction: column; align-items: flex-start; gap: 14px; color: rgba(0, 0, 0, 0.88); text-decoration: none; }
.sf-svc__i svg { flex: 0 0 auto; width: 36px; height: 36px; shape-rendering: geometricPrecision; color: #1A1A1A; }
.sf-svc__i b { display: block; font-size: 14px; line-height: 1.28577; font-weight: 600; letter-spacing: -0.016em; color: #1A1A1A; }
.sf-svc__more { color: var(--dj-link); }
.sf-svc__more::after { content: ' ›'; }
.sf-svc__i:hover .sf-svc__more { text-decoration: underline; }

.sf-crumbs { display: flex; align-items: center; padding: 17px 0 3px; }
.sf-logo { display: inline-flex; opacity: 0.8; }
.sf-logo img { width: 34px; height: auto; filter: grayscale(1); }

.sf-cols { display: grid; grid-template-columns: repeat(5, minmax(0, 1fr)); gap: 0 30px; padding: 20px 0 32px; border-bottom: 1px solid #D6D6D6; }
.sf-col h3 { margin: 0; font-size: inherit; }
.sf-col__h { display: flex; align-items: center; justify-content: space-between; width: 100%; font-size: 12px; line-height: 1.33337; font-weight: 600; letter-spacing: -0.01em; color: rgba(0, 0, 0, 0.88); text-align: left; cursor: default; }
.sf-col__h svg { display: none; width: 14px; height: 14px; }
.sf-col ul { list-style: none; margin: 9px 0 0; padding: 0; }
.sf-col li { margin-bottom: 0.8em; font-size: 12px; line-height: 1.33337; }
.sf-col li > span { color: rgba(0, 0, 0, 0.56); }

.sf-more { margin: 0; padding: 17px 0 11px; border-bottom: 1px solid #D6D6D6; }
.sf .sf-more a { color: var(--dj-link); text-decoration: underline; }

.sf-bottom { display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between; gap: 6px 24px; padding: 12px 0 10px; }
.sf-copy { margin: 0 30px 0 0; }
.sf-legal { display: flex; flex-wrap: wrap; }
.sf-legal { row-gap: 4px; }
.sf-legal a { display: inline-flex; align-items: center; min-height: 24px; padding: 0 9px; line-height: 1; background: linear-gradient(#D6D6D6, #D6D6D6) left center / 1px 1em no-repeat; }
.sf-legal a:first-child { padding-left: 0; background: none; }
.sf-made { margin: 0 0 0 auto; }

@media (max-width: 1068px) { .sf-cols { grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 24px 30px; } }
@media (max-width: 734px) {
  .sf-in { padding: 0 16px; }
  .sf-svc { grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 10px; padding: 18px 0 16px; }
  .sf .sf-svc__i { align-items: center; text-align: center; gap: 8px; }
  .sf-svc__i b { font-size: 12px; line-height: 1.25; text-wrap: balance; }
  .sf-svc__more { font-size: 12px; }
  .sf .sf-svc__i { min-height: 44px; }
  .sf-svc__i svg { width: 28px; height: 28px; }
  .sf-crumbs { padding: 4px 0 0; }
  .sf-logo { min-height: 44px; align-items: center; }
  .sf-legal a { position: relative; }
  .sf-legal a::after { content: ''; position: absolute; inset: -14px 0; }
  .sf-cols { grid-template-columns: 1fr; gap: 0; padding: 4px 0 12px; }
  .sf-col { border-bottom: 1px solid #D6D6D6; }
  .sf-col:last-child { border-bottom: 0; }
  .sf-col__h { padding: 14px 0; font-weight: 400; color: rgba(0, 0, 0, 0.88); cursor: pointer; }
  .sf-col__h svg { display: block; transition: transform 0.3s var(--dj-ease); }
  .sf-col.is-open .sf-col__h svg { transform: rotate(180deg); }
  .sf-col ul { display: none; margin: 0 0 10px; padding-left: 0; }
  .sf-col.is-open ul { display: block; }
  .sf-bottom { flex-direction: column; align-items: flex-start; gap: 8px; }
  .sf-copy { margin: 0; }
}
.sf { position: relative; }
.sf-wave { position: absolute; left: 0; bottom: calc(100% - 1px); display: block; width: 100%; height: clamp(18px, 2.4vw, 34px); fill: #EDEDED; pointer-events: none; }
.sf-cols { border-bottom: 0 !important; }
.sf-pattern { height: 18px; margin: 4px 0 2px; background: #C9C9CC; -webkit-mask: url('/images/patternesp.svg') repeat-x left center / auto 18px; mask: url('/images/patternesp.svg') repeat-x left center / auto 18px; }
/* «Язычок»: вкладка, вырастающая из нижнего края страницы */
.sf-sign { display: flex; justify-content: center; padding-top: 6px; }
.dev-credit { position: relative; display: inline-flex; align-items: center; gap: 0.6rem; padding: 11px 18px 12px; border-radius: 14px 14px 0 0; background: #E3E3E6; color: rgba(0, 0, 0, 0.45); line-height: 1; text-decoration: none !important; transform: translateY(3px); transition: transform 0.5s cubic-bezier(0.22, 1, 0.36, 1), color 0.3s ease, background-color 0.3s ease; }
/* мягкие «плечи» вкладки — переход в фон без ступеньки */
.dev-credit::before, .dev-credit::after { content: ''; position: absolute; bottom: 0; width: 14px; height: 14px; background: radial-gradient(circle at var(--cx) 0, transparent 13.5px, #E3E3E6 14px); transition: background 0.3s ease; }
.dev-credit::before { left: -14px; --cx: 0; }
.dev-credit::after { right: -14px; --cx: 100%; }
.dev-credit:hover { transform: translateY(0); color: rgba(0, 0, 0, 0.85); }
/* Знак белый в файле — красим через маску в цвет текста */
.dev-credit__mark { display: block; width: 64px; height: 20px; background: currentColor; -webkit-mask: url('/images/artdementiev.svg') center / contain no-repeat; mask: url('/images/artdementiev.svg') center / contain no-repeat; }
.dev-credit__sep { width: 1px; height: 20px; background: currentColor; opacity: 0.35; }
.dev-credit__text { display: grid; font-size: 9px; letter-spacing: 0.06em; line-height: 1.18; text-transform: uppercase; white-space: nowrap; }
.sf-sr { position: absolute; width: 1px; height: 1px; overflow: hidden; clip: rect(0 0 0 0); white-space: nowrap; }
@media (max-width: 734px) { .sf-sign { padding-top: 2px; } }
@media (max-width: 400px) { .dev-credit { gap: 0.45rem; padding: 10px 14px 11px; } .dev-credit__mark, .dev-credit__sep { height: 18px; } .dev-credit__text { font-size: 8.5px; } }
</style>
