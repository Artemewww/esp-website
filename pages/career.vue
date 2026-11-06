<template>
  <div class="ap">
    <!-- Шапка в подаче Apple: надзаголовок, заголовок, вводный абзац -->
    <section class="ap-sec ap-sec--first">
      <div class="ap-wrap">
        <span class="ap-eyebrow">Работа в ESP</span>
        <h1 class="ap-title cr-title">Работа в «Экосервиспроект»</h1>
        <p class="ap-lede">
          Мы ищем тех, кто готов сделать осознанный шаг к сохранению природы нашей страны вместе с нами.
        </p>
        <div class="ap-actions">
          <a href="#vacancies" class="ap-btn">Смотреть вакансии</a>
          <a href="#forms" class="ap-link">Заполнить анкету ›</a>
        </div>

        <!-- Цифры: не украшение, а масштаб, в котором придётся работать -->
        <ul class="ap-stats">
          <li v-for="s in stats" :key="s.label"><b>{{ s.value }}</b><span>{{ s.label }}</span></li>
        </ul>
      </div>
    </section>

    <!-- Миссия и кадры с объектов рядом: текст объясняет, картинки показывают -->
    <section class="ap-sec ap-sec--white">
      <div class="ap-wrap cr-mission">
        <div>
          <h2 class="ap-h2">Зачем это всё</h2>
          <p class="ap-lede">
            Работая в «Экосервиспроект», вы не просто чертите схемы и управляете проектами —
            вы создаёте системы, которые защищают реки и озёра Беларуси от загрязнений.
            Здоровье будущих поколений — это результат вашего рабочего дня.
          </p>
          <p class="ap-text cr-mission-note">
            Мы дорожим каждым своим сотрудником: предоставляем все возможности для роста и развития.
          </p>
        </div>

        <div class="cr-shots">
          <img src="/images/career/flag-sunset.jpg" alt="Очистные сооружения ESP на закате" loading="lazy" class="cr-shot cr-shot--tall" />
          <img src="/images/career/aerial-green.jpg" alt="Объект ESP с высоты" loading="lazy" class="cr-shot" />
          <img src="/images/career/welding.jpg" alt="Сварочные работы в цехе ESP" loading="lazy" class="cr-shot" />
        </div>
      </div>
    </section>

    <!-- Фирменный фильм: показать компанию быстрее, чем описать -->
    <section class="ap-sec">
      <div class="ap-wrap">
        <h2 class="ap-h2">Как мы работаем</h2>
        <p class="ap-lede">
          Фильм о том, что стоит за словами «полный цикл»: изыскания, проектирование,
          собственное производство, монтаж и пусконаладка.
        </p>
        <div class="ap-media">
          <video
            controls
            playsinline
            preload="none"
            poster="/images/career/site-people.jpg"
            class="cr-film"
          >
            <source src="/videos/hero/ESP_final_280826_1080.mp4" type="video/mp4" />
          </video>
        </div>
      </div>
    </section>

    <!-- Что мы даём. Только то, что зафиксировано в условиях по вакансиям, —
         без обещаний, которых компания не давала. -->
    <section class="ap-sec ap-sec--white">
      <div class="ap-wrap">
        <h2 class="ap-h2">Что мы даём</h2>
        <p class="ap-lede">Условия, которые компания фиксирует при трудоустройстве.</p>

        <div class="ap-grid ap-grid--4">
          <article v-for="b in benefits" :key="b.title" class="ap-card">
            <span class="cr-num">{{ b.num }}</span>
            <h3 class="ap-h3">{{ b.title }}</h3>
            <ul class="cr-list">
              <li v-for="(i, k) in b.items" :key="k">{{ i }}</li>
            </ul>
          </article>
        </div>
      </div>
    </section>

    <!-- ВАКАНСИИ: карточкой видно суть, раскрытие — по клику -->
    <section id="vacancies" class="ap-sec cr-scroll">
      <div class="ap-wrap">
        <h2 class="ap-h2">Открытые вакансии</h2>
        <p class="ap-lede">
          {{ openVacancies.length }} {{ vacancyWord }} на производстве в Заславле.
          Не нашли подходящую — заполните анкету, мы вернёмся, когда появится позиция.
        </p>

        <div class="cr-vacs">
          <article
            v-for="v in openVacancies"
            :key="v.slug"
            class="cr-vac"
            :class="{ 'is-open': opened === v.slug }"
          >
            <div class="cr-vac-top">
              <div class="cr-vac-main">
                <span class="cr-vac-dept">{{ v.dept }} · {{ v.location }}</span>
                <h3 class="ap-h3">{{ v.title }}</h3>
                <span class="cr-vac-salary">{{ v.salary }}</span>
              </div>

              <div class="cr-vac-actions">
                <button type="button" class="ap-btn ap-btn--ghost" @click="toggle(v.slug)">
                  {{ opened === v.slug ? 'Свернуть' : 'Подробнее' }}
                </button>
                <a :href="mailTo(v.title)" class="ap-btn">Откликнуться</a>
              </div>
            </div>

            <div v-show="opened === v.slug" class="cr-vac-body">
              <p class="ap-text">{{ v.mission }}</p>

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

              <p v-if="v.schedule" class="ap-small cr-schedule">График: {{ v.schedule }}</p>
            </div>
          </article>
        </div>
      </div>
    </section>

    <!-- Как проходит отбор -->
    <section class="ap-sec ap-sec--white">
      <div class="ap-wrap">
        <h2 class="ap-h2">Как проходит отбор</h2>
        <ol class="ap-grid ap-grid--4 cr-steps">
          <li v-for="(s, i) in hiringSteps" :key="i" class="ap-card">
            <span class="cr-num">{{ String(i + 1).padStart(2, '0') }}</span>
            <b class="ap-h3">{{ s.title }}</b>
            <span class="ap-text">{{ s.desc }}</span>
          </li>
        </ol>
      </div>
    </section>

    <!-- АНКЕТЫ: заполнение прямо на сайте, файл — как запасной путь -->
    <section id="forms" class="ap-sec cr-scroll">
      <div class="ap-wrap">
        <div class="cr-forms-head">
          <div>
            <h2 class="ap-h2">Заполнить анкету</h2>
            <p class="ap-lede">
              Выберите подходящую анкету и заполните её прямо здесь. Если удобнее
              на бумаге — рядом лежит файл для скачивания.
            </p>
          </div>

          <!-- Общий контакт отдела кадров — без имён и личных номеров сотрудников -->
          <aside class="cr-hr">
            <span class="cr-hr-label">Отдел кадров ESP</span>
            <a :href="`mailto:${HR_EMAIL}`" class="ap-link">{{ HR_EMAIL }}</a>
            <a :href="`tel:${HR_PHONE_RAW}`" class="ap-link tabular-nums">{{ HR_PHONE }}</a>
          </aside>
        </div>

        <div class="cr-form">
          <CareerForm :hr-email="HR_EMAIL" />
        </div>
      </div>
    </section>

    <!-- КОРПОРАТИВНАЯ ЖИЗНЬ -->
    <section id="life" class="ap-sec ap-sec--white cr-scroll">
      <div class="ap-wrap">
        <h2 class="ap-h2">Не только работаем</h2>
        <p class="ap-lede">Сплавы, корпоративы и обычные рабочие дни.</p>

        <div class="ap-grid ap-grid--3">
          <figure v-for="p in life" :key="p.src" class="cr-photo">
            <img :src="p.src" :alt="p.alt" loading="lazy" />
            <figcaption class="ap-caption">{{ p.caption }}</figcaption>
          </figure>
        </div>
      </div>
    </section>

    <!-- ЧАСТЫЕ ВОПРОСЫ -->
    <section class="ap-sec">
      <div class="ap-wrap ap-wrap--narrow">
        <h2 class="ap-h2">Частые вопросы</h2>
        <div class="ap-rows cr-acc">
          <article v-for="q in faq" :key="q.q" class="cr-item">
            <button type="button" class="cr-head" :aria-expanded="openedFaq === q.q" @click="toggleFaq(q.q)">
              <b>{{ q.q }}</b>
              <span class="cr-chevron" :class="{ 'is-open': openedFaq === q.q }" aria-hidden="true">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M6 9.5l6 6 6-6" /></svg>
              </span>
            </button>
            <div v-show="openedFaq === q.q" class="cr-body">
              <p class="ap-text">{{ q.a }}</p>
            </div>
          </article>
        </div>
      </div>
    </section>

    <!-- ПЕРСОНАЛЬНЫЕ ДАННЫЕ -->
    <section id="privacy" class="ap-sec ap-sec--white cr-scroll">
      <div class="ap-wrap ap-wrap--narrow">
        <h2 class="ap-h2">Обработка персональных данных</h2>
        <div class="ap-rows cr-acc">
          <article v-for="d in privacyDocs" :key="d.id" class="cr-item">
            <button type="button" class="cr-head" :aria-expanded="openedDoc === d.id" @click="toggleDoc(d.id)">
              <b>{{ d.title }}</b>
              <span class="cr-chevron" :class="{ 'is-open': openedDoc === d.id }" aria-hidden="true">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M6 9.5l6 6 6-6" /></svg>
              </span>
            </button>
            <div v-show="openedDoc === d.id" class="cr-body">
              <p class="ap-text">{{ d.text }}</p>
            </div>
          </article>
        </div>
      </div>
    </section>

    <!-- Финальный призыв -->
    <section class="ap-sec ap-cta">
      <div class="ap-wrap ap-wrap--narrow">
        <h2 class="ap-h2">Присоединяйтесь к команде</h2>
        <p class="ap-lede">
          Открытой позиции под вас может не быть прямо сейчас — но анкета остаётся у нас,
          и мы возвращаемся к ней, когда появляется подходящая вакансия.
        </p>
        <div class="ap-actions ap-center">
          <a href="#forms" class="ap-btn">Заполнить анкету</a>
          <a :href="`mailto:${HR_EMAIL}`" class="ap-link">Написать в отдел кадров ›</a>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { vacanciesList } from '~/composables/useVacancies'

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
.cr-scroll { scroll-margin-top: 100px; }
/* «Экосервиспроект» — одно длинное слово: на телефоне уменьшаем кегль */
@media (max-width: 480px) { .cr-title { font-size: 2rem; overflow-wrap: anywhere; } }

/* Миссия и кадры */
.cr-mission { display: grid; grid-template-columns: minmax(0, 1fr) minmax(0, 1fr); gap: clamp(2rem, 5vw, 4rem); align-items: center; }
.cr-mission-note { margin-top: 1.25rem; max-width: 40rem; }
.cr-shots { display: grid; grid-template-columns: 1fr 1fr; grid-template-rows: 1fr 1fr; gap: 0.75rem; aspect-ratio: 5 / 4; }
.cr-shot { width: 100%; height: 100%; object-fit: cover; border-radius: 18px; background: #ebebef; }
.cr-shot--tall { grid-row: span 2; }

.cr-film { aspect-ratio: 16 / 9; object-fit: cover; background: #000; }

.cr-num { font-size: 13px; font-weight: 600; color: var(--ap-accent); }
.cr-h4 { font-size: 15px; font-weight: 600; color: var(--ap-ink); margin-bottom: 0.7rem; }

.cr-list { display: grid; gap: 0.55rem; margin-top: 0.4rem; }
.cr-list li { position: relative; padding-left: 1rem; font-size: 14px; line-height: 1.5; color: var(--ap-muted); }
.cr-list li::before { content: ''; position: absolute; left: 0; top: 0.6em; width: 5px; height: 5px; border-radius: 50%; background: var(--ap-accent); }
.cr-list b { color: var(--ap-ink); font-weight: 600; }

.cr-steps { list-style: none; padding: 0; }

/* Вакансии: белые плашки на сером */
.cr-vacs { display: grid; gap: 1rem; margin-top: 2.5rem; }
.cr-vac { border-radius: 18px; background: #fff; padding: clamp(1.25rem, 3vw, 1.75rem); }
.cr-vac-top { display: flex; align-items: center; justify-content: space-between; gap: 1rem 1.5rem; flex-wrap: wrap; }
.cr-vac-main { display: grid; gap: 0.3rem; min-width: 0; }
.cr-vac-dept { font-size: 13px; font-weight: 600; color: var(--ap-accent); }
.cr-vac-salary { font-size: 15px; color: var(--ap-muted); }
.cr-vac-actions { display: flex; gap: 0.6rem; flex-wrap: wrap; }
.cr-vac-body { margin-top: 1.5rem; padding-top: 1.5rem; border-top: 1px solid var(--ap-line); }
.cr-cols { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 1.5rem 2rem; margin-top: 1.5rem; }
.cr-schedule { margin-top: 1.5rem; }

/* Анкеты */
.cr-forms-head { display: flex; justify-content: space-between; align-items: flex-end; gap: 1.5rem 3rem; flex-wrap: wrap; }
.cr-hr { display: grid; gap: 0.35rem; padding: 1.25rem 1.5rem; border-radius: 18px; background: #fff; }
.cr-hr-label { font-size: 13px; font-weight: 600; color: var(--ap-ink); margin-bottom: 0.15rem; }
.cr-form { margin-top: 2rem; }

/* Корпоративная жизнь */
.cr-photo { margin: 0; }
.cr-photo img { display: block; width: 100%; aspect-ratio: 4 / 3; object-fit: cover; border-radius: 18px; background: #ebebef; }

/* Аккордеоны */
.cr-acc { margin-top: 2rem; }
.cr-item + .cr-item { border-top: 1px solid var(--ap-line); }
.cr-head { display: flex; align-items: center; justify-content: space-between; gap: 1rem; width: 100%; padding: 1.15rem 0; text-align: left; font-size: 16px; color: var(--ap-ink); }
.cr-head b { font-weight: 600; }
.cr-chevron { flex-shrink: 0; width: 20px; height: 20px; color: var(--ap-muted); transition: transform 0.3s ease; }
.cr-chevron svg { width: 100%; height: 100%; }
.cr-chevron.is-open { transform: rotate(180deg); }
.cr-body { padding-bottom: 1.25rem; }

@media (max-width: 1023px) {
  .cr-mission { grid-template-columns: minmax(0, 1fr); }
  .cr-cols { grid-template-columns: minmax(0, 1fr); }
}
@media (max-width: 767px) {
  .cr-vac-actions { width: 100%; }
  .cr-vac-actions .ap-btn { flex: 1 1 0; }
  .cr-hr { width: 100%; }
  .cr-hr .ap-link { white-space: normal; overflow-wrap: anywhere; }
}
@media (prefers-reduced-motion: reduce) {
  .cr-chevron { transition: none; }
}
</style>
