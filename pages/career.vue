<template>
  <!-- Карьера в подаче Apple Careers: крупное высказывание, широкий кадр,
       разделы «Работа в ESP», вакансии строками с шевроном. -->
  <div ref="root" class="dj cr">
    <!-- #90 Без громоздкой шапки: сразу сильный кадр команды, заголовок поверх (как Apple Careers) -->
    <section class="cr-hero">
      <figure class="cr-hero-fig">
        <picture>
          <source media="(max-width: 767px)" srcset="/images/career/apple/hero-m.webp" />
          <img src="/images/career/apple/hero.webp" alt="Сотрудники ESP общаются в светлом цехе" fetchpriority="high" decoding="async" />
        </picture>
        <figcaption class="cr-hero-copy">
          <span class="cr-hero-eyebrow">Работа в ESP</span>
          <h1 class="cr-hero-title">Работа в&nbsp;ЭкоСервисПроект</h1>
          <p class="cr-hero-lede">Мы ищем инженеров, специалистов и рабочих для проектирования, производства и&nbsp;пусконаладки очистных сооружений.</p>
          <span class="cr-hero-act">
            <a href="#vacancies" class="dj-btn dj-btn--white dj-btn--lg">Смотреть вакансии</a>
            <a href="#forms" class="dj-more dj-more--light">Заполнить анкету</a>
          </span>
        </figcaption>
      </figure>
    </section>

    <DjSubnav
      title="Работа в ESP"
      :links="[
        { href: '#mission', label: 'О работе' },
        { href: '#benefits', label: 'Условия' },
        { href: '#vacancies', label: 'Вакансии' },
        { href: '#hiring', label: 'Отбор' },
        { href: '#forms', label: 'Анкета' },
        { href: '#faq', label: 'Вопросы' }
      ]"
      :cta="{ to: '/career#forms', label: 'Заполнить анкету' }"
    />

    <!-- Манифест на живом фирменном градиенте (Apple Careers) -->
    <CareerManifesto
      variant="gradient"
      title="Мы делаем воду чище.<br>Каждый день, всей командой."
    />

    <!-- #88 Работа в ESP — бенто в подаче Apple Careers -->
    <section id="mission" class="dj-sec cr-anchor">
      <CareerAppleBento />
    </section>

    <!-- #89 Цифры масштаба — горизонтальный бенто -->
    <CareerStatsBento />

    <!-- Манифест поверх реального кадра с градиентной тонировкой -->
    <CareerManifesto
      variant="photo"
      img="/images/team/real/team-all.webp"
      alt="Команда ESP на производственной площадке"
      title="Каждый объект — это чистые реки и&nbsp;озёра Беларуси."
      text="От&nbsp;проекта до&nbsp;пусконаладки: вы видите, как ваша работа становится действующей станцией."
    />

    <!-- Фирменный фильм: показать компанию быстрее, чем описать -->
    <section class="dj-sec dj-sec--dark">
      <div class="dj-wrap dj-center dj-reveal">
        <h2 class="dj-h2">Как мы работаем</h2>
        <p class="dj-lede cr-lede">
          Фильм о том, что стоит за словами «полный цикл»: изыскания, проектирование,
          собственное производство, монтаж и пусконаладка.
        </p>
      </div>
      <div class="dj-wrap dj-wrap--wide cr-film-wrap dj-reveal">
        <video ref="film" controls playsinline preload="none" poster="/images/career/film-poster-9s.webp" class="cr-film" @loadedmetadata="startAt9">
          <source src="/videos/hero/ESP_final_280826_1080.mp4#t=9" type="video/mp4" />
        </video>
      </div>
    </section>

    <!-- Что мы даём. Только то, что зафиксировано в условиях по вакансиям, —
         без обещаний, которых компания не давала. -->
    <section id="benefits" class="dj-sec cr-anchor">
      <CareerManifesto
        variant="warm"
        eyebrow="Что мы даём"
        title="Здесь есть всё, чтобы работать спокойно."
        text="Всё, что ниже,&nbsp;— условия, которые компания фиксирует при&nbsp;трудоустройстве."
      />
      <CareerBenefitsBento :items="benefits" />
    </section>

    <!-- ВАКАНСИИ: строки как в Apple Jobs, раскрытие по клику -->
    <section id="vacancies" class="dj-sec dj-sec--soft cr-anchor">
      <div class="dj-wrap">
        <div class="cr-head dj-reveal">
          <h2 class="dj-h2">Открытые вакансии</h2>
          <p class="dj-lede cr-lede">
            {{ openVacancies.length }} {{ vacancyWord }} на производстве в Заславле.
            Не нашли подходящую — заполните анкету, мы свяжемся, когда появится позиция.
          </p>
        </div>

        <CareerVacancyCards :vacancies="openVacancies" :hr-email="HR_EMAIL" />
      </div>
    </section>

    <!-- Как проходит отбор: инфографика — капля течёт по трубе через этапы -->
    <section id="hiring" class="dj-sec cr-anchor">
      <div class="dj-wrap">
        <h2 class="dj-h2 dj-center dj-reveal">Как проходит отбор</h2>
      </div>
      <CareerHiringPanels :steps="hiringSteps" />
    </section>

    <!-- АНКЕТЫ: заполнение прямо на сайте, файл — как запасной путь -->
    <section id="forms" class="dj-sec dj-sec--soft cr-anchor">
      <div class="dj-wrap">
        <div class="cr-forms-head dj-reveal">
          <div>
            <h2 class="dj-h2">Заполнить анкету</h2>
            <p class="dj-lede cr-lede">
              Выберите подходящую анкету и заполните её прямо здесь. Если удобнее
              на бумаге — рядом лежит файл для скачивания.
            </p>
          </div>

          <!-- Общий контакт отдела кадров — без имён и личных номеров сотрудников -->
          <aside class="cr-hr">
            <ApIcon name="users" class="cr-hr-ico" />
            <span class="cr-hr-label">Отдел кадров ESP</span>
            <a :href="`mailto:${HR_EMAIL}`" class="dj-more">{{ HR_EMAIL }}</a>
            <a :href="`tel:${HR_PHONE_RAW}`" class="dj-more cr-tab">{{ HR_PHONE }}</a>
          </aside>
        </div>

        <div class="cr-form dj-reveal">
          <CareerForm :hr-email="HR_EMAIL" />
        </div>
      </div>
    </section>

    <!-- КОРПОРАТИВНАЯ ЖИЗНЬ -->
    <section id="life" class="cr-anchor cr-life">
      <div class="dj-wrap dj-center cr-life-head dj-reveal">
        <h2 class="dj-h2">Жизнь команды</h2>
        <p class="dj-lede cr-lede">Корпоративные мероприятия и рабочие будни.</p>
      </div>
      <div class="cr-photos">
        <figure v-for="p in life" :key="p.src" class="cr-photo dj-reveal" :class="{ 'cr-photo--wide': p.wide }">
          <img :src="p.src" :alt="p.alt" loading="lazy" />
          <figcaption>{{ p.caption }}</figcaption>
        </figure>
      </div>
    </section>

    <!-- ЧАСТЫЕ ВОПРОСЫ -->
    <section id="faq" class="dj-sec cr-anchor">
      <div class="cr-narrow">
        <h2 class="dj-h2 dj-reveal">Частые вопросы</h2>
        <div class="cr-acc dj-reveal">
          <article v-for="q in faq" :key="q.q" class="cr-item">
            <button type="button" class="cr-q" :aria-expanded="openedFaq === q.q" @click="toggleFaq(q.q)">
              <b>{{ q.q }}</b>
              <span class="cr-plus" :class="{ 'is-open': openedFaq === q.q }" aria-hidden="true"></span>
            </button>
            <div v-show="openedFaq === q.q" class="cr-a">
              <p class="cr-text">{{ q.a }}</p>
            </div>
          </article>
        </div>
      </div>
    </section>

    <!-- ПЕРСОНАЛЬНЫЕ ДАННЫЕ -->
    <section id="privacy" class="dj-sec dj-sec--soft cr-anchor">
      <div class="cr-narrow">
        <h2 class="dj-h2 dj-reveal">Обработка персональных данных</h2>
        <div class="cr-acc dj-reveal">
          <article v-for="d in privacyDocs" :key="d.id" class="cr-item">
            <button type="button" class="cr-q" :aria-expanded="openedDoc === d.id" @click="toggleDoc(d.id)">
              <b>{{ d.title }}</b>
              <span class="cr-plus" :class="{ 'is-open': openedDoc === d.id }" aria-hidden="true"></span>
            </button>
            <div v-show="openedDoc === d.id" class="cr-a">
              <p class="cr-text">{{ d.text }}</p>
            </div>
          </article>
        </div>
      </div>
    </section>

    <!-- Финальный призыв -->
    <AppleCta
      title="Присоединяйтесь к команде ESP"
      lede="Подходящей вакансии может не быть сейчас, но анкета остаётся у нас: мы вернёмся к ней, когда появится позиция."
    >
      <a href="#forms" class="ax-btn">Заполнить анкету</a>
      <a :href="`mailto:${HR_EMAIL}`" class="ax-link">Написать в отдел кадров</a>
    </AppleCta>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { vacanciesList } from '~/composables/useVacancies'
import { useReveal } from '~/composables/useReveal'

const root = ref(null)
useReveal(root)

// Общие контакты компании: личные имена, фото и номера сотрудников
// на сайте не публикуем.
const HR_EMAIL = 'info@ecoservisproekt.com'
const HR_PHONE = '+375 (17) 238-11-41'
const HR_PHONE_RAW = '+375172381141'

const vacancies = useEditableList('vacancies', vacanciesList)
const openVacancies = computed(() => vacancies.value)
const vacancyWord = computed(() => {
  const n = openVacancies.value.length
  if (n % 10 === 1 && n % 100 !== 11) return 'открытая позиция'
  if ([2, 3, 4].includes(n % 10) && ![12, 13, 14].includes(n % 100)) return 'открытые позиции'
  return 'открытых позиций'
})

// #87 Фильм стартует с 9-й секунды — тот же кадр стоит постером
const film = ref(null)
const startAt9 = () => { if (film.value && film.value.currentTime < 9) film.value.currentTime = 9 }

// Всё перечисленное взято из условий по вакансиям и данных компании —
// придуманных льгот здесь нет.
const benefits = [
  {
    num: '01',
    kind: 'hero',
    title: 'Оформление и деньги',
    items: [
      'Официальное трудоустройство по ТК РБ',
      'Заработная плата два раза в месяц',
      'Премии по результатам работы'
    ]
  },
  {
    num: '02',
    kind: 'photo',
    img: '/images/career/site-people.jpg',
    title: 'Социальные гарантии',
    items: [
      'Оплачиваемый отпуск и больничные',
      'Материальная помощь',
      'Подарки ко дню рождения'
    ]
  },
  {
    num: '03',
    kind: 'soft',
    title: 'Работа и график',
    items: [
      'График 5/2 с 8:30 до 17:00',
      'Собственное производство в Заславле',
      'По отдельным позициям возможна частичная занятость'
    ]
  },
  {
    num: '04',
    kind: 'wide',
    img: '/images/career/lathe.webp',
    title: 'Развитие',
    items: [
      'Полный цикл внутри компании: проектирование, производство, пусконаладка',
      'Практика и распределение для студентов',
      'Возможности для роста внутри направления'
    ]
  }
]

const hiringSteps = [
  { img: '/images/team/work/esp-work-17.jpg', alt: 'Сотрудник ESP за компьютером', title: 'Отклик', desc: 'Вы откликаетесь на вакансию письмом или присылаете заполненную анкету на почту отдела кадров.' },
  { img: '/images/team/work/esp-work-37.jpg', alt: 'Отдел ESP изучает документы', title: 'Рассмотрение', desc: 'Отдел кадров изучает анкету и при совпадении по опыту связывается с вами.' },
  { img: '/images/team/real/board.webp', alt: 'Разговор с руководителем направления', title: 'Собеседование', desc: 'Разговор с руководителем направления: задачи, условия, ожидания по зарплате.' },
  { img: '/images/team/real/site.webp', alt: 'Сотрудник ESP на площадке', title: 'Выход на работу', desc: 'Официальное оформление по ТК РБ и знакомство с командой на площадке.' }
]

const life = [
  { src: '/images/career/splav-2026.webp', alt: 'Команда ESP на корпоративном сплаве', caption: 'Корпоративный сплав, август 2026', wide: true },
  { src: '/images/career/new-year-2026.jpg', alt: 'Новогоднее мероприятие ESP', caption: 'Новый год, декабрь 2026' },
  { src: '/images/career/laser-cut.webp', alt: 'Лазерная резка металла в цехе ESP', caption: 'Производство в Заславле' }

]

const faq = [
  {
    q: 'Что делать, если подходящей вакансии нет?',
    a: 'Заполните анкету и отправьте её в отдел кадров. Анкета остаётся у нас, и мы возвращаемся к ней, когда появляется подходящая позиция.'
  },
  {
    q: 'Какую анкету выбрать?',
    a: 'Анкета рабочего — для рабочих специальностей, анкета специалиста — для инженерных и офисных позиций, анкета практиканта — для студентов, которые ищут место практики.'
  },
  {
    q: 'Берёте ли вы студентов на практику?',
    a: 'Да. Для этого есть отдельная анкета практиканта: в ней указываются учебное заведение, вид и период практики, тема.'
  },
  {
    q: 'Где находится работа?',
    a: 'Производство — в Заславле, ул. Советская, 118Д. Инженерный офис — в Минске, ул. Петра Мстиславца, 20. Место работы указано в каждой вакансии.'
  },
  {
    q: 'Как быстро вы отвечаете?',
    a: 'Отдел кадров рассматривает анкеты в рабочие дни. Если ваш опыт подходит под открытую позицию, с вами свяжутся по указанному в анкете телефону.'
  }
]

const openedFaq = ref(null)
const toggleFaq = (q) => { openedFaq.value = openedFaq.value === q ? null : q }

// Тексты юридических разделов заказчиком пока не переданы — структура
// готова к их подстановке.
const privacyDocs = [
  { id: 'policy', title: 'Политика в отношении обработки персональных данных', text: 'Текст политики готовится отделом кадров и будет размещён здесь.' },
  { id: 'rights', title: 'Права субъекта персональных данных', text: 'Перечень прав соискателя готовится отделом кадров и будет размещён здесь.' },
  { id: 'consent', title: 'Последствия дачи и отзыва согласия', text: 'Разъяснение последствий готовится отделом кадров и будет размещено здесь.' }
]

const openedDoc = ref(null)
const toggleDoc = (id) => { openedDoc.value = openedDoc.value === id ? null : id }

useHead({
  title: 'Работа в ESP | Вакансии и анкеты ЭкоСервисПроект',
  meta: [
    { name: 'description', content: 'Вакансии ЭкоСервисПроект: токарь-универсал, бухгалтер по ТМЦ. Анкеты для рабочих, специалистов и практикантов, условия работы и корпоративная жизнь компании.' }
  ]
})
</script>

<style scoped>
/* Apple Careers: крупные высказывания, кадры со скруглением, карточки
   #EDEDED радиусом 18–28px, вакансии строками с шевроном, аккордеоны. */
.cr-anchor { scroll-margin-top: 120px; }
.cr-lede { margin-top: 14px; max-width: 40em; }
.dj-sec--soft .cr-lede, .dj-sec .cr-lede { color: #5E5E5E; }
.dj-sec--dark .cr-lede { color: #8A8A8A; }
.cr-h2 { margin-top: 8px; }
.cr-h3 { display: block; font-size: clamp(21px, 1.8vw, 24px); line-height: 1.17; font-weight: 600; color: var(--dj-ink); letter-spacing: 0.009em; }
.cr-h4 { font-size: 17px; line-height: 1.24; letter-spacing: -0.022em; font-weight: 600; color: var(--dj-ink); margin-bottom: 12px; }
.cr-text { font-size: 17px; line-height: 1.47; letter-spacing: -0.022em; color: #5E5E5E; }
.cr-small { font-size: 14px; letter-spacing: -0.016em; color: #5E5E5E; }
.cr-narrow { max-width: 980px; margin: 0 auto; padding: 0 24px; }

/* Фильм */
.cr-film-wrap { margin-top: clamp(36px, 4vw, 56px); }
.cr-film { display: block; width: 100%; aspect-ratio: 16 / 9; object-fit: cover; border-radius: var(--r-lg); background: #000; }

.cr-list { display: grid; gap: 10px; margin-top: 6px; list-style: none; padding: 0; }
.cr-list li { position: relative; padding-left: 16px; font-size: 17px; line-height: 1.47; letter-spacing: -0.022em; color: #5E5E5E; }
.cr-list li::before { content: ''; position: absolute; left: 0; top: 0.66em; width: 5px; height: 5px; border-radius: 50%; background: var(--dj-blue); }
.cr-list b { color: var(--dj-ink); font-weight: 600; }

/* Анкеты */
.cr-forms-head { display: flex; justify-content: space-between; align-items: flex-end; gap: 24px 48px; flex-wrap: wrap; }
.cr-hr { display: grid; justify-items: start; gap: 6px; min-width: 280px; padding: 28px 32px; border-radius: var(--r-md); background: #fff; }
.cr-hr .dj-more { font-size: 17px; }
.cr-hr-ico { width: var(--ico); height: var(--ico); color: var(--dj-ink); margin-bottom: calc(var(--ico-gap) - 6px); }
.cr-hr-label { font-size: 17px; letter-spacing: -0.022em; font-weight: 600; color: var(--dj-ink); }
.cr-tab { font-variant-numeric: tabular-nums; }
.cr-form { margin-top: 36px; }

/* Корпоративная жизнь */
.cr-life { padding: clamp(56px, 8vw, 104px) 0 12px; }

/* Аккордеоны */
.cr-acc { margin-top: 32px; border-top: 1px solid #D6D6D6; }
.cr-item { border-bottom: 1px solid #D6D6D6; }
.cr-q { display: flex; align-items: center; justify-content: space-between; gap: 16px; width: 100%; padding: 24px 0; text-align: left; font-size: clamp(19px, 1.6vw, 24px); line-height: 1.17; letter-spacing: 0.009em; color: var(--dj-ink); }
.cr-q b { font-weight: 600; }
.cr-plus { position: relative; flex: 0 0 18px; height: 18px; }
.cr-plus::before, .cr-plus::after { content: ''; position: absolute; left: 50%; top: 50%; width: 14px; height: 1.5px; border-radius: 1px; background: var(--dj-ink); transform: translate(-50%, -50%); transition: transform 0.3s var(--dj-ease); }
.cr-plus::after { transform: translate(-50%, -50%) rotate(90deg); }
.cr-plus.is-open::after { transform: translate(-50%, -50%) rotate(0deg); }
.cr-a { padding-bottom: 24px; max-width: 64ch; }

/* #90 Первый экран — кадр команды, заголовок поверх */
.cr-hero { padding: 12px 12px 0; }
.cr-hero-fig { position: relative; margin: 0; overflow: hidden; border-radius: var(--r-lg); background: #0b1630; isolation: isolate; }
.cr-hero-fig img { display: block; width: 100%; height: clamp(520px, 78vh, 860px); object-fit: cover; object-position: 70% 40%; }
.cr-hero-fig::after { content: ''; position: absolute; inset: 0; z-index: 0; background: linear-gradient(180deg, rgba(0, 20, 50, 0) 45%, rgba(0, 20, 50, 0.5) 72%, rgba(0, 20, 50, 0.85) 100%), linear-gradient(90deg, rgba(0, 20, 50, 0.5) 0%, rgba(0, 20, 50, 0) 55%); }
.cr-hero-copy { position: absolute; left: 0; right: 0; bottom: 0; z-index: 1; display: grid; justify-items: start; gap: 12px; padding: clamp(24px, 4vw, 64px); color: #fff; }
.cr-hero-eyebrow { font-size: 17px; font-weight: 600; letter-spacing: -0.02em; opacity: 0.9; }
.cr-hero-title { font-size: clamp(40px, 6vw, 88px); line-height: 1.02; font-weight: 700; letter-spacing: -0.03em; max-width: 14ch; color: #fff; }
.cr-hero-lede { max-width: 36em; font-size: clamp(17px, 1.5vw, 21px); line-height: 1.4; letter-spacing: -0.02em; color: rgba(255, 255, 255, 0.9); }
.cr-hero-act { display: flex; flex-wrap: wrap; align-items: center; gap: 14px 28px; margin-top: 8px; }


/* #83 Жизнь команды — бенто: сплав крупно, рядом Новый год и площадка */
.cr-photos { display: grid; grid-template-columns: 2fr 1fr; grid-template-rows: repeat(2, minmax(240px, 1fr)); gap: 16px; max-width: 1200px; height: clamp(520px, 56vw, 720px); margin: clamp(36px, 4vw, 56px) auto 0; padding: 0 24px; }
.cr-photo { position: relative; margin: 0; overflow: hidden; border-radius: var(--r-lg); background: #EDEDED; isolation: isolate; }
.cr-photo--wide { grid-row: span 2; }
.cr-photo img { display: block; width: 100%; height: 100%; object-fit: cover; filter: saturate(1.25) contrast(1.05); transition: transform 1.2s var(--dj-ease); }
.cr-photo:hover img { transform: scale(1.035); }
.cr-photo figcaption { position: absolute; left: 0; right: 0; bottom: 0; padding: 64px 28px 24px; font-size: 17px; line-height: 1.24; letter-spacing: -0.022em; font-weight: 600; color: #fff; background: linear-gradient(180deg, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 0.55) 100%); }

@media (max-width: 1068px) {
  .cr-hero-title { max-width: none; }
}
@media (max-width: 767px) {
  .cr-hero { padding: 8px 8px 0; }
  .cr-hero-fig { border-radius: var(--r-md); }
  .cr-hero-fig img { height: 620px; }
  .cr-hero-title { font-size: 34px; overflow-wrap: anywhere; }
  .cr-hero-act .dj-btn { width: 100%; }
  .cr-photos { padding: 0 16px; gap: 12px; grid-template-columns: minmax(0, 1fr); }
  .cr-photo { border-radius: var(--r-md); }
  .cr-photos { height: auto; grid-template-rows: none; grid-auto-rows: 300px; }
  .cr-photo--wide { grid-row: auto; }
}

@media (max-width: 767px) {
  .cr-hr { width: 100%; min-width: 0; }
  .cr-hr .dj-more { white-space: normal; overflow-wrap: anywhere; }
  .cr-narrow { padding: 0 16px; }
}
@media (prefers-reduced-motion: reduce) {
  .cr-plus::before, .cr-plus::after, .cr-photo img { transition: none; }
}
</style>
