<template>
  <!-- Бенто в подаче Apple Careers: большая карточка с тремя кадрами,
       пара карточек (иллюстрированная команда + фото), тёмный блок 2×2. -->
  <div class="ab">
    <!-- Большая карточка на всю ширину -->
    <article class="ab-card ab-hero dj-reveal">
      <header class="ab-head">
        <span class="ab-eyebrow">Работа в ESP</span>
        <h2 class="ab-title ab-title--xl">Проектируем, производим и&nbsp;запускаем очистные&nbsp;— одной командой.</h2>
      </header>
      <div class="ab-trio">
        <figure v-for="p in trio" :key="p.src" class="ab-shot">
          <img :srcset="srcset(p.src)" sizes="(max-width: 734px) 100vw, 50vw" :src="p.src" :alt="p.alt" loading="lazy" decoding="async" />
          <figcaption>{{ p.caption }}</figcaption>
        </figure>
      </div>
      <a href="#vacancies" class="ab-pill ab-pill--line">Подробнее</a>
    </article>

    <!-- Две карточки в ряд -->
    <div class="ab-pair">
      <article class="ab-card ab-white dj-reveal">
        <h3 class="ab-title">Инженеры, рабочие и&nbsp;специалисты&nbsp;— в&nbsp;одной команде.</h3>
        <p class="ab-line">Больше 100&nbsp;человек в&nbsp;штате: от&nbsp;проектного отдела до&nbsp;цеха.</p>
        <ul class="ab-avatars" aria-label="Роли в команде ESP">
          <li v-for="a in avatars" :key="a.src">
            <img :src="a.src" :alt="a.alt" loading="lazy" decoding="async" width="320" height="320" />
            <span>{{ a.role }}</span>
          </li>
        </ul>
        <a href="#vacancies" class="ab-pill ab-pill--line">Открытые вакансии</a>
      </article>

      <article class="ab-card ab-photo dj-reveal">
        <img :srcset="srcset('/images/career/apple/team.webp')" sizes="(max-width: 734px) 100vw, 50vw" src="/images/career/apple/team.webp" alt="Сотрудники ESP общаются в светлом цехе" loading="lazy" decoding="async" />
        <div class="ab-photo-copy">
          <h3 class="ab-title">Растём вместе с&nbsp;компанией.</h3>
          <p class="ab-line">Мы создаём условия для профессионального роста сотрудников.</p>
          <a href="#benefits" class="ab-pill">Подробнее</a>
        </div>
      </article>
    </div>

    <!-- Тёмный блок 2×2 -->
    <div class="ab-dark dj-reveal">
      <h3 class="ab-title ab-dark-title">Найдите своё место в&nbsp;ESP.</h3>
      <div class="ab-grid">
        <article v-for="c in dark" :key="c.title" class="ab-tile">
          <div class="ab-tile-copy">
            <h4>{{ c.title }}</h4>
            <p v-html="c.line"></p>
            <a v-if="c.href.startsWith('#')" :href="c.href" class="ab-pill">{{ c.cta }}</a>
            <NuxtLink v-else :to="c.href" class="ab-pill">{{ c.cta }}</NuxtLink>
          </div>
          <img :srcset="srcset(c.img)" sizes="(max-width: 734px) 100vw, 50vw" :src="c.img" :alt="c.alt" loading="lazy" decoding="async" />
        </article>
      </div>
    </div>
  </div>
</template>

<script setup>
import { srcset } from '~/composables/useSrcset'
const trio = [
  { src: '/images/career/apple/p1.webp', alt: 'Сотрудник ESP в фирменной куртке', caption: 'Производство' },
  { src: '/images/career/apple/p2.webp', alt: 'Сотрудница ESP в фирменном поло', caption: 'Проектирование' },
  { src: '/images/career/apple/p3.webp', alt: 'Опытный инженер ESP', caption: 'Пусконаладка' }
]

// Собирательные образы ролей в фирменной одежде ESP, не реальные сотрудники
const avatars = [
  { src: '/images/career/apple/a1.webp', alt: 'Инженер в фирменном поло ESP', role: 'Инженер' },
  { src: '/images/career/apple/a2.webp', alt: 'Специалист производства в фирменной куртке ESP', role: 'Производство' },
  { src: '/images/career/apple/a3.webp', alt: 'Проектировщица в фирменном поло ESP', role: 'Проектирование' },
  { src: '/images/career/apple/a4.webp', alt: 'Специалист офиса в фирменном поло ESP', role: 'Офис' }
]

const dark = [
  { title: 'Где мы работаем', line: 'Офис в&nbsp;Минске, производство в&nbsp;Заславле, объекты по&nbsp;всей Беларуси.', cta: 'Контакты', href: '/contacts', img: '/images/career/apple/where.webp', alt: 'Офисное здание вечером' },
  { title: 'Команды и отделы', line: 'Проектирование, производство, монтаж и&nbsp;пусконаладка, офисные службы.', cta: 'Вакансии', href: '#vacancies', img: '/images/career/apple/teams.webp', alt: 'Двое сотрудников ESP обсуждают проект за столом' },
  { title: 'Производство', line: 'Собственный цех в&nbsp;Заславле: металлообработка, сварка, лазерная резка.', cta: 'Жизнь команды', href: '#life', img: '/images/career/apple/production.webp', alt: 'Сотрудник ESP собирает оборудование в цехе' },
  { title: 'Студентам и практикантам', line: 'Практика и&nbsp;распределение — по&nbsp;отдельной анкете практиканта.', cta: 'Заполнить анкету', href: '#forms', img: '/images/career/apple/students.webp', alt: 'Практиканты с наставником ESP на объекте' }
]
</script>

<style scoped>
.ab { display: grid; grid-template-columns: minmax(0, 1fr); gap: 16px; max-width: 1200px; margin: 0 auto; padding: 0 24px; }
.ab-card { position: relative; overflow: hidden; border-radius: var(--r-lg); isolation: isolate; }
.ab-eyebrow { display: block; margin-bottom: 10px; font-size: 17px; font-weight: 600; letter-spacing: -0.02em; color: var(--dj-blue, #0a3a8c); }
.ab-title { font-size: clamp(26px, 2.6vw, 40px); line-height: 1.1; font-weight: 700; letter-spacing: -0.02em; color: var(--dj-ink); text-wrap: balance; }
.ab-title--xl { font-size: clamp(32px, 4.4vw, 64px); line-height: 1.05; letter-spacing: -0.03em; max-width: 18ch; margin: 0 auto; }
.ab-line { margin-top: 12px; font-size: clamp(17px, 1.4vw, 19px); line-height: 1.4; letter-spacing: -0.02em; color: #5E5E5E; text-wrap: pretty; }

/* Кнопки-капсулы как у Apple: белая на тёмном/фото, обводка на светлом */
.ab-pill { display: inline-flex; align-items: center; justify-content: center; min-height: 44px; padding: 0 22px; border-radius: 980px; font-size: 17px; font-weight: 500; letter-spacing: -0.02em; white-space: nowrap; background: #fff; color: #1d1d1f; border: 1px solid #fff; transition: background 0.25s, color 0.25s, transform 0.25s; }
.ab-pill:hover { background: rgba(255, 255, 255, 0.86); }
.ab-pill:active { transform: scale(0.97); }
.ab-pill--line { background: transparent; color: var(--dj-ink); border-color: currentColor; }
.ab-pill--line:hover { background: var(--dj-ink); color: #fff; border-color: var(--dj-ink); }
.ab-pill:focus-visible { outline: 2px solid #0a3a8c; outline-offset: 3px; }

/* Большая карточка */
.ab-hero { display: grid; grid-template-columns: minmax(0, 1fr); justify-items: center; gap: clamp(28px, 3.4vw, 48px); padding: clamp(40px, 5vw, 72px) clamp(20px, 3vw, 40px); background: #F5F5F7; text-align: center; }
.ab-trio { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 16px; width: 100%; min-width: 0; }
.ab-shot { position: relative; margin: 0; overflow: hidden; border-radius: var(--r-md); aspect-ratio: 4 / 5; background: #fff; transform: translateZ(0); }
.ab-shot img { width: 100%; height: 100%; object-fit: cover; filter: saturate(1.1); transition: transform 1.2s var(--dj-ease); }
.ab-shot:hover img { transform: scale(1.04); }
.ab-shot figcaption { position: absolute; left: 0; right: 0; bottom: 0; padding: 48px 20px 18px; text-align: left; font-size: 17px; font-weight: 600; letter-spacing: -0.02em; color: #fff; background: linear-gradient(180deg, rgba(0, 20, 50, 0), rgba(0, 20, 50, 0.6)); }

/* Пара */
.ab-pair { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 16px; }
.ab-white { display: flex; flex-direction: column; align-items: center; text-align: center; padding: clamp(36px, 4vw, 56px) clamp(20px, 3vw, 40px); background: #fff; border: 1px solid #E5E5EA; }
.ab-avatars { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: clamp(10px, 1.4vw, 18px); width: 100%; margin: clamp(28px, 3vw, 40px) 0; padding: 0; list-style: none; }
.ab-avatars li { display: grid; justify-items: center; gap: 10px; font-size: 14px; letter-spacing: -0.01em; color: #5E5E5E; }
.ab-avatars img { width: 100%; aspect-ratio: 1; object-fit: cover; border-radius: 50%; transition: transform 0.5s var(--dj-ease); }
.ab-avatars li:hover img { transform: translateY(-4px); }
.ab-white .ab-pill { margin-top: auto; }

.ab-photo { min-height: clamp(460px, 44vw, 600px); background: #fff; transform: translateZ(0); color: #fff; }
.ab-photo > img { position: absolute; inset: 0; z-index: -2; width: 100%; height: 100%; object-fit: cover; object-position: center 30%; }
.ab-photo::after { content: ''; position: absolute; inset: 0; z-index: -1; background: linear-gradient(180deg, rgba(0, 20, 50, 0) 40%, rgba(0, 20, 50, 0.82) 100%); }
.ab-photo-copy { position: absolute; left: 0; right: 0; bottom: 0; display: grid; justify-items: start; gap: 4px; padding: clamp(24px, 3vw, 40px); }
.ab-photo .ab-title { color: #fff; }
.ab-photo .ab-line { margin: 4px 0 16px; color: rgba(255, 255, 255, 0.86); }

/* Тёмный блок 2×2 */
.ab-dark { padding: clamp(40px, 5vw, 72px) clamp(16px, 3vw, 40px); border-radius: var(--r-lg); background: #000; }
.ab-dark-title { color: #fff; text-align: center; margin-bottom: clamp(28px, 3.4vw, 48px); }
.ab-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 16px; }
.ab-tile { display: flex; flex-direction: column; overflow: hidden; border-radius: var(--r-md); background: #1c1c1e; color: #fff; }
.ab-tile-copy { display: grid; justify-items: start; gap: 10px; padding: clamp(24px, 2.6vw, 36px); }
.ab-tile h4 { font-size: clamp(22px, 2vw, 28px); line-height: 1.14; font-weight: 700; letter-spacing: -0.02em; }
.ab-tile p { margin-bottom: 8px; font-size: 17px; line-height: 1.4; letter-spacing: -0.02em; color: rgba(255, 255, 255, 0.72); }
.ab-tile img { width: 100%; aspect-ratio: 16 / 8; margin-top: auto; object-fit: cover; filter: saturate(1.1); transition: transform 1.2s var(--dj-ease); }
.ab-tile:hover img { transform: scale(1.04); }

@media (max-width: 900px) {
  .ab-pair, .ab-grid { grid-template-columns: minmax(0, 1fr); }
}
@media (max-width: 767px) {
  .ab { padding: 0 16px; gap: 12px; }
  .ab-card, .ab-dark { border-radius: var(--r-md); }
  .ab-title--xl { font-size: 30px; }
  .ab-title { font-size: 26px; }
  .ab-trio { grid-template-columns: none; grid-auto-flow: column; grid-auto-columns: 72%; gap: 10px; overflow-x: auto; scroll-snap-type: x mandatory; scrollbar-width: none; justify-self: stretch; width: auto; margin: 0 -20px; padding: 0 20px; }
  .ab-trio::-webkit-scrollbar { display: none; }
  .ab-shot { scroll-snap-align: center; }
  .ab-avatars { grid-template-columns: repeat(2, minmax(0, 1fr)); max-width: 280px; gap: 16px 20px; }
  .ab-photo { min-height: 480px; }
  .ab-photo::after { background: linear-gradient(180deg, rgba(0, 20, 50, 0) 30%, rgba(0, 20, 50, 0.9) 100%); }
  .ab-pill { white-space: normal; }
}
@media (prefers-reduced-motion: reduce) {
  .ab-shot img, .ab-tile img, .ab-avatars img, .ab-pill { transition: none; }
}
</style>
