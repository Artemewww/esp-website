<template>
  <!-- Карьера в подаче Apple Careers: крупное высказывание, широкий кадр,
       разделы «Работа в ESP», вакансии строками с шевроном. -->
  <div ref="root" class="dj cr">
    <DjPageHero
      eyebrow="Работа в ESP"
      title="Работа в «Экосервиспроект»"
      lede="Мы ищем тех, кто готов сделать осознанный шаг к сохранению природы нашей страны вместе с нами."
    >
      <a href="#vacancies" class="dj-btn dj-btn--lg">Смотреть вакансии</a>
      <a href="#forms" class="dj-more">Заполнить анкету</a>
    </DjPageHero>

    <DjSubnav
      title="Работа в ESP"
      :links="[
        { href: '#mission', label: 'О работе' },
        { href: '#benefits', label: 'Условия' },
        { href: '#vacancies', label: 'Вакансии' },
        { href: '#hiring', label: 'Отбор' },
        { href: '#forms', label: 'Анкета' },
        { href: '#faq', label: 'Вопросы' }
      ]"
      :cta="{ to: '/career#forms', label: 'Заполнить анкету' }"
    />

    <!-- Широкий кадр под шапкой и цифры масштаба -->
    <figure class="cr-wide">
      <img src="/images/career/site-people.jpg" alt="Сотрудники ESP на объекте" fetchpriority="high" />
    </figure>

    <!-- Цифры: не украшение, а масштаб, в котором придётся работать -->
    <section class="dj-sec cr-stats-sec">
      <div class="dj-wrap">
        <ul class="cr-stats">
          <li v-for="s in stats" :key="s.label" class="dj-reveal"><b>{{ s.value }}</b><span>{{ s.label }}</span></li>
        </ul>
      </div>
    </section>

    <!-- Миссия и кадры с объектов рядом: текст объясняет, картинки показывают -->
    <section id="mission" class="dj-sec dj-sec--soft cr-anchor">
      <div class="dj-wrap cr-mission">
        <div class="dj-reveal">
          <span class="dj-eyebrow">Работа в ESP</span>
          <h2 class="dj-h2 cr-h2">Зачем это всё</h2>
          <p class="cr-statement">
            Работая в «Экосервиспроект», вы не просто чертите схемы и управляете проектами —
            вы создаёте системы, которые защищают реки и озёра Беларуси от загрязнений.
            Здоровье будущих поколений — это результат вашего рабочего дня.
          </p>
          <p class="cr-note">
            Мы дорожим каждым своим сотрудником: предоставляем все возможности для роста и развития.
          </p>
        </div>
        <div class="cr-shots dj-reveal">
          <img src="/images/career/flag-sunset.jpg" alt="Очистные сооружения ESP на закате" loading="lazy" class="cr-shot cr-shot--tall" />
          <img src="/images/career/aerial-green.jpg" alt="Объект ESP с высоты" loading="lazy" class="cr-shot" />
          <img src="/images/career/welding.jpg" alt="Сварочные работы в цехе ESP" loading="lazy" class="cr-shot" />
        </div>
      </div>
    </section>

    <!-- Фирменный фильм: показать компанию быстрее, чем описать -->
    <section class="dj-sec dj-sec--dark">
      <div class="dj-wrap dj-center dj-reveal">
        <h2 class="dj-h2">Как мы работаем</h2>
        <p class="dj-lede cr-lede">
          Фильм о том, что стоит за словами «полный цикл»: изыскания, проектирование,
          собственное производство, монтаж и пусконаладка.
        </p>
      </div>
      <div class="dj-wrap dj-wrap--wide cr-film-wrap dj-reveal">
        <video controls playsinline preload="none" poster="/images/career/site-people.jpg" class="cr-film">
          <source src="/videos/hero/ESP_final_280826_1080.mp4" type="video/mp4" />
        </video>
      </div>
    </section>

    <!-- Что мы даём. Только то, что зафиксировано в условиях по вакансиям, —
         без обещаний, которых компания не давала. -->
    <section id="benefits" class="dj-sec cr-anchor">
      <div class="dj-wrap dj-center dj-reveal">
        <h2 class="dj-h2">Что мы даём</h2>
        <p class="dj-lede cr-lede">Условия, которые компания фиксирует при трудоустройстве.</p>
      </div>
      <div class="cr-tiles">
        <article v-for="b in benefits" :key="b.title" class="cr-tile dj-reveal">
          <span class="cr-num">{{ b.num }}</span>
          <h3 class="cr-h3">{{ b.title }}</h3>
          <ul class="cr-list">
            <li v-for="(i, k) in b.items" :key="k">{{ i }}</li>
          </ul>
        </article>
      </div>
    </section>

    <!-- ВАКАНСИИ: строки как в Apple Jobs, раскрытие по клику -->
    <section id="vacancies" class="dj-sec dj-sec--soft cr-anchor">
      <div class="dj-wrap">
        <div class="cr-head dj-reveal">
          <h2 class="dj-h2">Открытые вакансии</h2>
          <p class="dj-lede cr-lede">
            {{ openVacancies.length }} {{ vacancyWord }} на производстве в Заславле.
            Не нашли подходящую — заполните анкету, мы вернёмся, когда появится позиция.
          </p>
        </div>

        <div class="cr-vacs dj-reveal">
          <article
            v-for="v in openVacancies"
            :key="v.slug"
            class="cr-vac"
            :class="{ 'is-open': opened === v.slug }"
          >
            <button type="button" class="cr-vac-row" :aria-expanded="opened === v.slug" @click="toggle(v.slug)">
              <span class="cr-vac-main">
                <b class="cr-vac-title">{{ v.title }}</b>
                <span class="cr-vac-dept">{{ v.dept }} · {{ v.location }}</span>
              </span>
              <span class="cr-vac-salary">{{ v.salary }}</span>
              <span class="cr-vac-more">{{ opened === v.slug ? 'Свернуть' : 'Подробнее' }}</span>
              <span class="cr-chevron" aria-hidden="true">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.6"><path d="M9 6l6 6-6 6" /></svg>
              </span>
            </button>

            <div v-show="opened === v.slug" class="cr-vac-body">
              <p class="cr-text">{{ v.mission }}</p>

              <div class="cr-cols">
                <div>
                  <h4 class="cr-h4">Чем предстоит заниматься</h4>
                  <ul class="cr-list">
                    <li v-for="(t, i) in v.tasks" :key="i">{{ t }}</li>
                  </ul>
                </div>
                <div>
                  <h4 class="cr-h4">Что нужно</h4>
                  <ul class="cr-list">
                    <li v-for="(r, i) in v.requirements" :key="i">
                      <b>{{ r.title }}</b><span v-if="r.desc"> — {{ r.desc }}</span>
                    </li>
                  </ul>
                </div>
                <div v-if="v.offer?.length">
                  <h4 class="cr-h4">Что предлагаем</h4>
                  <ul class="cr-list">
                    <li v-for="(o, i) in v.offer" :key="i">{{ o }}</li>
                  </ul>
                </div>
              </div>

              <div class="cr-vac-foot">
                <p v-if="v.schedule" class="cr-small">График: {{ v.schedule }}</p>
                <a :href="mailTo(v.title)" class="dj-btn">Откликнуться</a>
              </div>
            </div>
          </article>
        </div>
      </div>
    </section>

    <!-- Как проходит отбор: горизонтальная шкала шагов -->
    <section id="hiring" class="dj-sec cr-anchor">
      <div class="dj-wrap">
        <h2 class="dj-h2 dj-center dj-reveal">Как проходит отбор</h2>
        <ol class="cr-steps">
          <li v-for="(s, i) in hiringSteps" :key="i" class="dj-reveal">
            <span class="cr-step-num">{{ String(i + 1).padStart(2, '0') }}</span>
            <b class="cr-h3">{{ s.title }}</b>
            <span class="cr-text">{{ s.desc }}</span>
          </li>
        </ol>
      </div>
    </section>

    <!-- АНКЕТЫ: заполнение прямо на сайте, файл — как запасной путь -->
    <section id="forms" class="dj-sec dj-sec--soft cr-anchor">
      <div class="dj-wrap">
        <div class="cr-forms-head dj-reveal">
          <div>
            <h2 class="dj-h2">Заполнить анкету</h2>
            <p class="dj-lede cr-lede">
              Выберите подходящую анкету и заполните её прямо здесь. Если удобнее
              на бумаге — рядом лежит файл для скачивания.
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
        <h2 class="dj-h2">Не только работаем</h2>
        <p class="dj-lede cr-lede">Сплавы, корпоративы и обычные рабочие дни.</p>
      </div>
      <div class="cr-photos">
        <figure v-for="p in life" :key="p.src" class="cr-photo dj-reveal">
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
    <section class="dj-sec dj-sec--dark dj-center">
      <div class="dj-wrap dj-reveal">
        <h2 class="dj-h2">Присоединяйтесь к команде</h2>
        <p class="dj-lede cr-lede">
          Открытой позиции под вас может не быть прямо сейчас — но анкета остаётся у нас,
          и мы возвращаемся к ней, когда появляется подходящая вакансия.
        </p>
        <div class="dj-links cr-cta-act">
          <a href="#forms" class="dj-btn dj-btn--white dj-btn--lg">Заполнить анкету</a>
          <a :href="`mailto:${HR_EMAIL}`" class="dj-more dj-more--light">Написать в отдел кадров</a>
        </div>
      </div>
    </section>
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

const mailTo = (title) =>
  `mailto:${HR_EMAIL}?subject=${encodeURIComponent('Отклик на вакансию: ' + title)}`

const stats = [
  { value: '28 лет', label: 'компания работает в очистке воды' },
  { value: '100+', label: 'инженеров и специалистов в штате' },
  { value: '2000+', label: 'реализованных объектов' },
  { value: '2', label: 'площадки: офис в Минске и производство в Заславле' }
]

const vacancies = useEditableList('vacancies', vacanciesList)
const openVacancies = computed(() => vacancies.value)
const vacancyWord = computed(() => {
  const n = openVacancies.value.length
  if (n % 10 === 1 && n % 100 !== 11) return 'открытая позиция'
  if ([2, 3, 4].includes(n % 10) && ![12, 13, 14].includes(n % 100)) return 'открытые позиции'
  return 'открытых позиций'
})

const opened = ref(null)
const toggle = (slug) => { opened.value = opened.value === slug ? null : slug }

// Всё перечисленное взято из условий по вакансиям и данных компании —
// придуманных льгот здесь нет.
const benefits = [
  {
    num: '01',
    title: 'Оформление и деньги',
    items: [
      'Официальное трудоустройство по ТК РБ',
      'Зарплата на карту два раза в месяц',
      'Премии по результатам работы'
    ]
  },
  {
    num: '02',
    title: 'Социальные гарантии',
    items: [
      'Оплачиваемый отпуск и больничные',
      'Материальная помощь',
      'Подарки ко дню рождения'
    ]
  },
  {
    num: '03',
    title: 'Работа и график',
    items: [
      'График 5/2 с 8:30 до 17:00',
      'Собственное производство в Заславле',
      'По отдельным позициям возможна частичная занятость'
    ]
  },
  {
    num: '04',
    title: 'Развитие',
    items: [
      'Полный цикл внутри компании: проектирование, производство, пусконаладка',
      'Практика и распределение для студентов',
      'Возможности для роста внутри направления'
    ]
  }
]

const hiringSteps = [
  { title: 'Отклик', desc: 'Вы откликаетесь на вакансию письмом или присылаете заполненную анкету на почту отдела кадров.' },
  { title: 'Рассмотрение', desc: 'Отдел кадров изучает анкету и при совпадении по опыту связывается с вами.' },
  { title: 'Собеседование', desc: 'Разговор с руководителем направления: задачи, условия, ожидания по зарплате.' },
  { title: 'Выход на работу', desc: 'Официальное оформление по ТК РБ и знакомство с командой на площадке.' }
]

const life = [
  { src: '/images/career/splav-2026.jpg', alt: 'Команда ESP на корпоративном сплаве', caption: 'Корпоративный сплав, август 2026' },
  { src: '/images/career/new-year-2026.jpg', alt: 'Новогодний корпоратив ESP', caption: 'Новый год, декабрь 2026' },
  { src: '/images/career/work-process.jpg', alt: 'Рабочий процесс в цехе ESP', caption: 'Рабочий процесс' }
]

const faq = [
  {
    q: 'Что делать, если подходящей вакансии нет?',
    a: 'Заполните анкету и отправьте её на почту отдела кадров. Анкета остаётся у нас, и мы возвращаемся к ней, когда появляется подходящая позиция.'
  },
  {
    q: 'Какую анкету выбрать?',
    a: 'Анкета рабочего — для рабочих специальностей, анкета специалиста — для инженерных и офисных позиций, анкета практиканта — для студентов, которые ищут место практики.'
  },
  {
    q: 'Берёте ли вы студентов на практику?',
    a: 'Да. Для этого есть отдельная анкета практиканта: в ней указываются учебное заведение, вид и период практики, тема.'
  },
  {
    q: 'Где находится работа?',
    a: 'Производство — в Заславле, ул. Советская, 118Д. Инженерный офис — в Минске, ул. Петра Мстиславца, 20. Место работы указано в каждой вакансии.'
  },
  {
    q: 'Как быстро вы отвечаете?',
    a: 'Отдел кадров рассматривает анкеты в рабочие дни. Если ваш опыт подходит под открытую позицию, с вами свяжутся по указанному в анкете телефону.'
  }
]

const openedFaq = ref(null)
const toggleFaq = (q) => { openedFaq.value = openedFaq.value === q ? null : q }

// Тексты юридических разделов заказчиком пока не переданы — структура
// готова к их подстановке.
const privacyDocs = [
  { id: 'policy', title: 'Политика в отношении обработки персональных данных', text: 'Текст политики готовится отделом кадров и будет размещён здесь.' },
  { id: 'rights', title: 'Права субъекта персональных данных', text: 'Перечень прав соискателя готовится отделом кадров и будет размещён здесь.' },
  { id: 'consent', title: 'Последствия дачи и отзыва согласия', text: 'Разъяснение последствий готовится отделом кадров и будет размещено здесь.' }
]

const openedDoc = ref(null)
const toggleDoc = (id) => { openedDoc.value = openedDoc.value === id ? null : id }

useHead({
  title: 'Работа в ESP | Вакансии и анкеты «Экосервиспроект»',
  meta: [
    { name: 'description', content: 'Вакансии «Экосервиспроект»: токарь-универсал, бухгалтер по ТМЦ. Анкеты для рабочих, специалистов и практикантов, условия работы и корпоративная жизнь компании.' }
  ]
})
</script>

<style scoped>
/* Apple Careers: крупные высказывания, кадры со скруглением, карточки
   #f5f5f7 радиусом 18–28px, вакансии строками с шевроном, аккордеоны. */
.cr-anchor { scroll-margin-top: 120px; }
.cr-lede { margin-top: 14px; max-width: 40em; }
.dj-sec--soft .cr-lede, .dj-sec .cr-lede { color: #6e6e73; }
.dj-sec--dark .cr-lede { color: #86868b; }
.cr-h2 { margin-top: 8px; }
.cr-h3 { display: block; font-size: clamp(21px, 1.8vw, 24px); line-height: 1.17; font-weight: 600; color: var(--dj-ink); letter-spacing: 0.009em; }
.cr-h4 { font-size: 17px; line-height: 1.24; letter-spacing: -0.022em; font-weight: 600; color: var(--dj-ink); margin-bottom: 12px; }
.cr-text { font-size: 17px; line-height: 1.47; letter-spacing: -0.022em; color: #6e6e73; }
.cr-small { font-size: 14px; letter-spacing: -0.016em; color: #6e6e73; }
.cr-narrow { max-width: 980px; margin: 0 auto; padding: 0 24px; }
/* «Экосервиспроект» — одно длинное слово: на телефоне уменьшаем кегль */
@media (max-width: 480px) { .cr :deep(.dph-title) { font-size: 2rem; overflow-wrap: anywhere; } }

/* Широкий кадр */
.cr-wide { margin: 0; padding: 0 12px; }
.cr-wide img { display: block; width: 100%; height: clamp(320px, 52vw, 720px); object-fit: cover; border-radius: 28px; background: #f5f5f7; }

/* Цифры */
.cr-stats { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 24px; list-style: none; margin: 0; padding: 0; }
.cr-stats li { display: grid; gap: 8px; align-content: start; text-align: center; }
.cr-stats b { font-size: clamp(40px, 4.6vw, 64px); line-height: 1.05; font-weight: 600; letter-spacing: -0.009em; color: var(--dj-ink); font-variant-numeric: tabular-nums; }
.cr-stats span { font-size: 17px; line-height: 1.47; letter-spacing: -0.022em; color: #6e6e73; max-width: 22ch; margin: 0 auto; }

/* Миссия — высказывание крупным кеглем, как «Join us. Be you.» */
.cr-mission { display: grid; grid-template-columns: minmax(0, 1fr) minmax(0, 1fr); gap: clamp(32px, 5vw, 80px); align-items: center; }
.cr-statement { margin-top: 22px; font-size: clamp(21px, 2vw, 28px); line-height: 1.29; font-weight: 600; color: var(--dj-ink); letter-spacing: 0.007em; }
.cr-note { margin-top: 20px; font-size: 17px; line-height: 1.47; letter-spacing: -0.022em; color: #6e6e73; max-width: 40rem; }
.cr-shots { display: grid; grid-template-columns: 1fr 1fr; grid-template-rows: 1fr 1fr; gap: 12px; aspect-ratio: 5 / 4; }
.cr-shot { width: 100%; height: 100%; object-fit: cover; border-radius: 18px; background: #e8e8ed; }
.cr-shot--tall { grid-row: span 2; }

/* Фильм */
.cr-film-wrap { margin-top: clamp(36px, 4vw, 56px); }
.cr-film { display: block; width: 100%; aspect-ratio: 16 / 9; object-fit: cover; border-radius: 28px; background: #000; }

/* Условия — карточки */
.cr-tiles { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 20px; max-width: 1200px; margin: clamp(36px, 4vw, 56px) auto 0; padding: 0 24px; }
.cr-tile { display: flex; flex-direction: column; gap: 12px; min-height: 340px; padding: clamp(28px, 2.6vw, 40px) clamp(24px, 2.2vw, 32px); border-radius: 28px; background: #f5f5f7; }
.cr-num { margin-bottom: 14px; font-size: clamp(40px, 3.6vw, 48px); line-height: 1; font-weight: 600; letter-spacing: -0.005em; color: var(--dj-blue); font-variant-numeric: tabular-nums; }
.cr-list { display: grid; gap: 10px; margin-top: 6px; list-style: none; padding: 0; }
.cr-list li { position: relative; padding-left: 16px; font-size: 17px; line-height: 1.47; letter-spacing: -0.022em; color: #6e6e73; }
.cr-list li::before { content: ''; position: absolute; left: 0; top: 0.66em; width: 5px; height: 5px; border-radius: 50%; background: var(--dj-blue); }
.cr-list b { color: var(--dj-ink); font-weight: 600; }

/* Вакансии строками */
.cr-head { max-width: 760px; }
.cr-vacs { margin-top: clamp(32px, 4vw, 48px); border-radius: 18px; background: #fff; overflow: hidden; }
.cr-vac + .cr-vac { border-top: 1px solid #d2d2d7; }
.cr-vac-row { display: grid; grid-template-columns: minmax(0, 1fr) auto auto 20px; align-items: center; gap: 12px 28px; width: 100%; padding: 26px clamp(20px, 3vw, 40px); text-align: left; transition: background-color 0.2s ease; }
.cr-vac-row:hover { background: #fafafc; }
.cr-vac-main { display: grid; gap: 4px; min-width: 0; }
.cr-vac-title { font-size: clamp(19px, 1.6vw, 24px); line-height: 1.17; font-weight: 600; color: var(--dj-ink); letter-spacing: 0.009em; }
.cr-vac-dept { font-size: 14px; letter-spacing: -0.016em; color: #6e6e73; }
.cr-vac-salary { font-size: 17px; letter-spacing: -0.022em; color: var(--dj-ink); white-space: nowrap; }
.cr-vac-more { font-size: 17px; letter-spacing: -0.022em; color: #0066cc; }
.cr-chevron { width: 20px; height: 20px; color: #86868b; transition: transform 0.35s var(--dj-ease); }
.cr-chevron svg { width: 100%; height: 100%; }
.cr-vac.is-open .cr-chevron { transform: rotate(90deg); }
.cr-vac-body { padding: 0 clamp(20px, 3vw, 40px) 36px; }
.cr-cols { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 24px 40px; margin-top: 28px; }
.cr-vac-foot { display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between; gap: 12px 24px; margin-top: 32px; padding-top: 20px; border-top: 1px solid #d2d2d7; }

/* Отбор — шаги с круглыми маркерами */
.cr-steps { position: relative; display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 32px; margin: clamp(40px, 5vw, 64px) 0 0; padding: 0; list-style: none; }
.cr-steps::before { content: ''; position: absolute; left: 0; right: 0; top: 21px; height: 1px; background: #d2d2d7; }
.cr-steps li { position: relative; display: grid; gap: 10px; align-content: start; }
.cr-step-num { position: relative; display: grid; place-items: center; width: 44px; height: 44px; margin-bottom: 10px; border-radius: 50%; background: var(--dj-blue); color: #fff; font-size: 14px; font-weight: 600; font-variant-numeric: tabular-nums; box-shadow: 0 0 0 6px #fff; }

/* Анкеты */
.cr-forms-head { display: flex; justify-content: space-between; align-items: flex-end; gap: 24px 48px; flex-wrap: wrap; }
.cr-hr { display: grid; justify-items: start; gap: 6px; min-width: 280px; padding: 28px 32px; border-radius: 18px; background: #fff; }
.cr-hr .dj-more { font-size: 17px; }
.cr-hr-ico { width: 28px; height: 28px; color: var(--dj-ink); margin-bottom: 6px; }
.cr-hr-label { font-size: 17px; letter-spacing: -0.022em; font-weight: 600; color: var(--dj-ink); }
.cr-tab { font-variant-numeric: tabular-nums; }
.cr-form { margin-top: 36px; }

/* Корпоративная жизнь */
.cr-life { padding: clamp(56px, 8vw, 104px) 0 12px; }
.cr-photos { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 20px; max-width: 1200px; margin: clamp(36px, 4vw, 56px) auto 0; padding: 0 24px; }
.cr-photo { position: relative; margin: 0; overflow: hidden; border-radius: 28px; background: #e8e8ed; isolation: isolate; }
.cr-photo img { display: block; width: 100%; aspect-ratio: 4 / 5; object-fit: cover; transition: transform 1.2s var(--dj-ease); }
.cr-photo:hover img { transform: scale(1.035); }
.cr-photo figcaption { position: absolute; left: 0; right: 0; bottom: 0; padding: 64px 28px 24px; font-size: 17px; line-height: 1.24; letter-spacing: -0.022em; font-weight: 600; color: #fff; background: linear-gradient(180deg, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 0.55) 100%); }

/* Аккордеоны */
.cr-acc { margin-top: 32px; border-top: 1px solid #d2d2d7; }
.cr-item { border-bottom: 1px solid #d2d2d7; }
.cr-q { display: flex; align-items: center; justify-content: space-between; gap: 16px; width: 100%; padding: 24px 0; text-align: left; font-size: clamp(19px, 1.6vw, 24px); line-height: 1.17; letter-spacing: 0.009em; color: var(--dj-ink); }
.cr-q b { font-weight: 600; }
.cr-plus { position: relative; flex: 0 0 18px; height: 18px; }
.cr-plus::before, .cr-plus::after { content: ''; position: absolute; left: 50%; top: 50%; width: 14px; height: 1.5px; border-radius: 1px; background: var(--dj-ink); transform: translate(-50%, -50%); transition: transform 0.3s var(--dj-ease); }
.cr-plus::after { transform: translate(-50%, -50%) rotate(90deg); }
.cr-plus.is-open::after { transform: translate(-50%, -50%) rotate(0deg); }
.cr-a { padding-bottom: 24px; max-width: 64ch; }

.cr-cta-act { margin-top: 30px; }

@media (max-width: 1023px) {
  .cr-mission { grid-template-columns: minmax(0, 1fr); }
  .cr-cols { grid-template-columns: minmax(0, 1fr); }
  .cr-tiles { grid-template-columns: 1fr 1fr; }
  .cr-stats { grid-template-columns: 1fr 1fr; row-gap: 40px; }
  .cr-steps { grid-template-columns: 1fr 1fr; }
  .cr-steps::before { display: none; }
}
@media (max-width: 767px) {
  .cr-wide { padding: 0 12px; }
  .cr-wide img, .cr-film, .cr-photo { border-radius: 18px; }
  .cr-tiles, .cr-photos { padding: 0 16px; gap: 12px; grid-template-columns: minmax(0, 1fr); }
  .cr-tile { min-height: 0; border-radius: 18px; }
  .cr-vac-row { grid-template-columns: minmax(0, 1fr) 20px; gap: 6px 16px; }
  .cr-vac-salary, .cr-vac-more { grid-column: 1; }
  .cr-chevron { grid-column: 2; grid-row: 1; }
  .cr-vac-salary { white-space: normal; }
  .cr-vac-foot .dj-btn { width: 100%; }
  .cr-steps { grid-template-columns: minmax(0, 1fr); gap: 28px; }
  .cr-steps::before { display: block; left: 21px; right: auto; top: 0; bottom: 0; width: 1px; height: auto; }
  .cr-steps li { grid-template-columns: 44px minmax(0, 1fr); column-gap: 18px; }
  .cr-steps li > :not(.cr-step-num) { grid-column: 2; }
  .cr-step-num { grid-row: 1 / span 2; margin-bottom: 0; }
  .cr-hr { width: 100%; min-width: 0; }
  .cr-hr .dj-more { white-space: normal; overflow-wrap: anywhere; }
  .cr-narrow { padding: 0 16px; }
}
@media (prefers-reduced-motion: reduce) {
  .cr-chevron, .cr-plus::before, .cr-plus::after, .cr-photo img { transition: none; }
}
</style>
