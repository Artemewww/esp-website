<template>
  <div>
    <PageHero
      kicker="Работа в ESP"
      title="Работа в «Экосервиспроект»"
      lede="Мы ищем тех, кто готов сделать осознанный шаг к сохранению природы нашей страны вместе с нами."
    >
      <div class="flex flex-wrap gap-4">
        <a href="#vacancies" class="ph-btn ph-btn--primary">Смотреть вакансии</a>
        <a href="#forms" class="ph-btn ph-btn--ghost">Заполнить анкету</a>
      </div>
    </PageHero>

    <!-- Цифры: не украшение, а масштаб, в котором придётся работать -->
    <section class="cr-stats">
      <div class="container-custom cr-stats-grid">
        <div v-for="s in stats" :key="s.label" class="cr-stat">
          <b>{{ s.value }}</b>
          <span>{{ s.label }}</span>
        </div>
      </div>
    </section>

    <!-- Миссия и кадры с объектов рядом: текст объясняет, картинки показывают -->
    <section class="section-padding bg-white">
      <div class="container-custom cr-mission-grid">
        <div class="cr-lead">
        <h2 class="cr-h2">Зачем это всё</h2>
        <p class="cr-lede">
          Работая в «Экосервиспроект», вы не просто чертите схемы и управляете проектами —
          вы создаёте системы, которые защищают реки и озёра Беларуси от загрязнений.
          Здоровье будущих поколений — это результат вашего рабочего дня.
        </p>
        <p class="cr-lede cr-lede--muted">
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
    <section class="cr-film">
      <div class="container-custom cr-film-inner">
        <div class="cr-film-text">
          <h2 class="cr-h2 cr-h2--light">Как мы работаем</h2>
          <p class="cr-film-lede">
            Фильм о том, что стоит за словами «полный цикл»: изыскания, проектирование,
            собственное производство, монтаж и пусконаладка.
          </p>
        </div>

        <div class="cr-film-player">
          <video
            controls
            playsinline
            preload="none"
            poster="/images/career/site-people.jpg"
            class="cr-film-video"
          >
            <source src="/videos/hero/ESP_final_280826_1080.mp4" type="video/mp4" />
          </video>
        </div>
      </div>
    </section>

    <!-- Что мы даём. Только то, что зафиксировано в условиях по вакансиям, —
         без обещаний, которых компания не давала. -->
    <section class="section-padding bg-esp-gray/40">
      <div class="container-custom">
        <h2 class="cr-h2 mb-3">Что мы даём</h2>
        <p class="cr-note mb-10">Условия, которые компания фиксирует при трудоустройстве.</p>

        <div class="cr-benefits">
          <article v-for="b in benefits" :key="b.title" class="cr-benefit">
            <span class="cr-benefit-num">{{ b.num }}</span>
            <h3 class="cr-benefit-title">{{ b.title }}</h3>
            <ul class="cr-list">
              <li v-for="(i, k) in b.items" :key="k">{{ i }}</li>
            </ul>
          </article>
        </div>
      </div>
    </section>

    <!-- ВАКАНСИИ: карточкой видно суть, раскрытие — по клику -->
    <section id="vacancies" class="section-padding bg-white" style="scroll-margin-top: 100px">
      <div class="container-custom">
        <h2 class="cr-h2 mb-3">Открытые вакансии</h2>
        <p class="cr-note mb-10">
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
                <h3 class="cr-vac-title">{{ v.title }}</h3>
                <span class="cr-vac-salary">{{ v.salary }}</span>
              </div>

              <div class="cr-vac-actions">
                <button type="button" class="cr-btn cr-btn--ghost" @click="toggle(v.slug)">
                  {{ opened === v.slug ? 'Свернуть' : 'Подробнее' }}
                </button>
                <a :href="mailTo(v.title)" class="cr-btn">Откликнуться</a>
              </div>
            </div>

            <div v-show="opened === v.slug" class="cr-vac-body">
              <p class="cr-mission">{{ v.mission }}</p>

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

              <p v-if="v.schedule" class="cr-schedule">График: {{ v.schedule }}</p>
            </div>
          </article>
        </div>
      </div>
    </section>

    <!-- Как проходит отбор -->
    <section class="section-padding bg-esp-gray/40">
      <div class="container-custom">
        <h2 class="cr-h2 mb-10">Как проходит отбор</h2>
        <ol class="cr-steps">
          <li v-for="(s, i) in hiringSteps" :key="i" class="cr-step">
            <span class="cr-step-num">{{ String(i + 1).padStart(2, '0') }}</span>
            <b class="cr-step-title">{{ s.title }}</b>
            <span class="cr-step-desc">{{ s.desc }}</span>
          </li>
        </ol>
      </div>
    </section>

    <!-- АНКЕТЫ: заполнение прямо на сайте, файл — как запасной путь -->
    <section id="forms" class="section-padding bg-white" style="scroll-margin-top: 100px">
      <div class="container-custom">
        <div class="cr-forms-head">
          <div>
            <h2 class="cr-h2 mb-3">Заполнить анкету</h2>
            <p class="cr-note">
              Выберите подходящую анкету и заполните её прямо здесь. Если удобнее
              на бумаге — рядом лежит файл для скачивания.
            </p>
          </div>

          <!-- Карточка HR: у отклика должно быть лицо, а не безличный ящик -->
          <aside class="cr-hr">
            <img class="cr-hr-photo" :src="HR_PHOTO" :alt="HR_NAME" loading="lazy" />
            <div class="cr-hr-body">
              <span class="cr-hr-label">Ваш контакт в компании</span>
              <b class="cr-hr-name">{{ HR_NAME }}</b>
              <span class="cr-hr-role">{{ HR_ROLE }}</span>
              <a :href="`mailto:${HR_EMAIL}`" class="cr-hr-link">{{ HR_EMAIL }}</a>
              <a :href="`tel:${HR_PHONE_RAW}`" class="cr-hr-link">{{ HR_PHONE }}</a>
            </div>
          </aside>
        </div>

        <CareerForm :hr-email="HR_EMAIL" />
      </div>
    </section>

    <!-- КОРПОРАТИВНАЯ ЖИЗНЬ -->
    <section id="life" class="section-padding bg-esp-gray/40" style="scroll-margin-top: 100px">
      <div class="container-custom">
        <h2 class="cr-h2 mb-3">Не только работаем</h2>
        <p class="cr-note mb-10">Сплавы, корпоративы и обычные рабочие дни.</p>

        <div class="cr-gallery">
          <figure v-for="p in life" :key="p.src" class="cr-photo">
            <img :src="p.src" :alt="p.alt" loading="lazy" />
            <figcaption>{{ p.caption }}</figcaption>
          </figure>
        </div>
      </div>
    </section>

    <!-- ЧАСТЫЕ ВОПРОСЫ -->
    <section class="section-padding bg-white">
      <div class="container-custom">
        <h2 class="cr-h2 mb-8">Частые вопросы</h2>
        <div class="cr-acc">
          <article v-for="q in faq" :key="q.q" class="cr-item">
            <button type="button" class="cr-head" :aria-expanded="openedFaq === q.q" @click="toggleFaq(q.q)">
              <b class="cr-head-title">{{ q.q }}</b>
              <span class="cr-chevron" :class="{ 'is-open': openedFaq === q.q }" aria-hidden="true">↓</span>
            </button>
            <div v-show="openedFaq === q.q" class="cr-body">
              <p class="cr-mission">{{ q.a }}</p>
            </div>
          </article>
        </div>
      </div>
    </section>

    <!-- ПЕРСОНАЛЬНЫЕ ДАННЫЕ -->
    <section id="privacy" class="section-padding bg-esp-gray/40" style="scroll-margin-top: 100px">
      <div class="container-custom">
        <h2 class="cr-h2 mb-8">Обработка персональных данных</h2>
        <div class="cr-acc">
          <article v-for="d in privacyDocs" :key="d.id" class="cr-item">
            <button type="button" class="cr-head" :aria-expanded="openedDoc === d.id" @click="toggleDoc(d.id)">
              <b class="cr-head-title">{{ d.title }}</b>
              <span class="cr-chevron" :class="{ 'is-open': openedDoc === d.id }" aria-hidden="true">↓</span>
            </button>
            <div v-show="openedDoc === d.id" class="cr-body">
              <p class="cr-mission">{{ d.text }}</p>
            </div>
          </article>
        </div>
      </div>
    </section>

    <!-- Финальный призыв -->
    <section class="cr-cta">
      <div class="container-custom cr-cta-inner">
        <h2 class="cr-cta-title font-rounded">Присоединяйтесь к команде</h2>
        <p class="cr-cta-text">
          Открытой позиции под вас может не быть прямо сейчас — но анкета остаётся у нас,
          и мы возвращаемся к ней, когда появляется подходящая вакансия.
        </p>
        <div class="cr-cta-actions">
          <a href="#forms" class="cr-btn cr-btn--light">Заполнить анкету</a>
          <a :href="`mailto:${HR_EMAIL}`" class="cr-btn cr-btn--outline">Написать в отдел кадров</a>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { vacanciesList } from '~/composables/useVacancies'

const HR_EMAIL = 'l.kozhuro@ecoservisproekt.com'
const HR_PHONE = '+375 44 763-70-50'
const HR_PHONE_RAW = '+375447637050'
const HR_NAME = 'Людмила Кожуро'
const HR_ROLE = 'Менеджер по персоналу'
const HR_PHOTO = '/images/team/kozhuro-lyudmila-maika.png'

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
/* .container-custom в проекте без горизонтальных полей — задаём их здесь,
   иначе на телефоне цифры и заголовки упираются в край экрана. */
.container-custom {
  padding-left: 1.25rem;
  padding-right: 1.25rem;
}
@media (min-width: 640px) {
  .container-custom { padding-left: 1.5rem; padding-right: 1.5rem; }
}
@media (min-width: 1024px) {
  .container-custom { padding-left: 2rem; padding-right: 2rem; }
}

.cr-h2 {
  font-family: 'SF Pro Rounded', system-ui, sans-serif;
  font-size: clamp(1.6rem, 3vw, 2.4rem);
  color: #1a1a1a;
}
.cr-h4 {
  font-family: 'SF Pro Rounded', system-ui, sans-serif;
  font-size: 0.98rem;
  color: #1a1a1a;
  margin-bottom: 0.7rem;
}
.cr-note {
  font-size: 0.98rem;
  line-height: 1.6;
  color: rgba(26, 26, 26, 0.6);
  max-width: 56ch;
}

.cr-lead { max-width: 60rem; }
.cr-lede {
  font-size: clamp(1.02rem, 1.3vw, 1.18rem);
  line-height: 1.7;
  color: rgba(26, 26, 26, 0.78);
  margin-top: 1.5rem;
}
.cr-lede--muted { color: rgba(26, 26, 26, 0.6); }

/* ===== Цифры ===== */
.cr-stats {
  background: #0b1626;
  color: #fff;
  padding: clamp(2rem, 5vw, 3rem) 0;
}
.cr-stats-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 2rem 1.5rem;
}
@media (min-width: 900px) {
  .cr-stats-grid { grid-template-columns: repeat(4, minmax(0, 1fr)); }
}
.cr-stat { display: grid; gap: 0.4rem; }
.cr-stat b {
  font-family: 'SF Pro Rounded', system-ui, sans-serif;
  font-size: clamp(1.7rem, 3.2vw, 2.5rem);
  color: #fff;
  line-height: 1;
}
.cr-stat span {
  font-size: 0.85rem;
  line-height: 1.4;
  color: rgba(255, 255, 255, 0.55);
}

/* ===== Что мы даём ===== */
.cr-benefits {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1px;
  background: #e2e2e2;
  border: 1px solid #e2e2e2;
}
@media (min-width: 700px) { .cr-benefits { grid-template-columns: repeat(2, minmax(0, 1fr)); } }
@media (min-width: 1100px) { .cr-benefits { grid-template-columns: repeat(4, minmax(0, 1fr)); } }

.cr-benefit {
  background: #fff;
  padding: 1.75rem 1.5rem;
  display: grid;
  align-content: start;
  gap: 0.75rem;
}
.cr-benefit-num {
  font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
  font-size: 0.75rem;
  color: #0057b8;
  letter-spacing: 0.08em;
}
.cr-benefit-title {
  font-family: 'SF Pro Rounded', system-ui, sans-serif;
  font-size: 1.1rem;
  color: #1a1a1a;
}

.cr-list { display: grid; gap: 0.6rem; }
.cr-list li {
  position: relative;
  padding-left: 1.05rem;
  font-size: 0.9rem;
  line-height: 1.55;
  color: rgba(26, 26, 26, 0.68);
}
.cr-list li::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0.55em;
  width: 5px;
  height: 5px;
  border-radius: 50%;
  background: #0057b8;
}
.cr-list b { color: #1a1a1a; font-weight: 600; }

/* ===== Вакансии ===== */
.cr-vacs { display: grid; gap: 1rem; }

.cr-vac {
  border: 1px solid #e2e2e2;
  padding: 1.6rem;
  transition: border-color 0.25s ease, box-shadow 0.25s ease;
}
.cr-vac:hover { border-color: rgba(0, 35, 102, 0.35); }
.cr-vac.is-open {
  border-color: #002366;
  box-shadow: 0 18px 44px -28px rgba(0, 35, 102, 0.55);
}

.cr-vac-top {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.25rem;
  align-items: center;
}
@media (min-width: 800px) {
  .cr-vac-top { grid-template-columns: 1fr auto; }
}

.cr-vac-main { display: grid; gap: 0.3rem; min-width: 0; }
.cr-vac-dept {
  font-size: 0.78rem;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: #0057b8;
  font-weight: 600;
}
.cr-vac-title {
  font-family: 'SF Pro Rounded', system-ui, sans-serif;
  font-size: clamp(1.15rem, 2vw, 1.5rem);
  color: #1a1a1a;
}
.cr-vac-salary {
  font-size: 0.95rem;
  font-weight: 600;
  color: rgba(26, 26, 26, 0.7);
}

.cr-vac-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 0.65rem;
}

.cr-vac-body {
  margin-top: 1.75rem;
  padding-top: 1.75rem;
  border-top: 1px solid #ededed;
}
.cr-mission {
  font-size: 1rem;
  line-height: 1.65;
  color: rgba(26, 26, 26, 0.75);
  max-width: 64ch;
  margin-bottom: 1.75rem;
}
.cr-cols {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.75rem;
}
@media (min-width: 900px) {
  .cr-cols { grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 2.5rem; }
}
.cr-schedule {
  margin-top: 1.5rem;
  font-size: 0.88rem;
  color: rgba(26, 26, 26, 0.55);
}

/* ===== Кнопки ===== */
.cr-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.8rem 1.6rem;
  background: #002366;
  color: #fff;
  font-weight: 600;
  font-size: 0.92rem;
  white-space: nowrap;
  transition: background-color 0.2s ease, transform 0.2s ease, border-color 0.2s ease, color 0.2s ease;
}
.cr-btn:hover { background: #0057b8; transform: translateY(-2px); }
.cr-btn--ghost {
  background: transparent;
  color: #002366;
  border: 1px solid rgba(0, 35, 102, 0.35);
}
.cr-btn--ghost:hover { background: rgba(0, 35, 102, 0.05); color: #002366; border-color: #002366; }
.cr-btn--light { background: #fff; color: #002366; }
.cr-btn--light:hover { background: #eaf6ff; }
.cr-btn--outline {
  background: transparent;
  border: 1px solid rgba(255, 255, 255, 0.35);
  color: #fff;
}
.cr-btn--outline:hover { background: rgba(255, 255, 255, 0.1); border-color: rgba(255, 255, 255, 0.6); }

/* ===== Отбор ===== */
.cr-steps {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1px;
  background: #e2e2e2;
  border: 1px solid #e2e2e2;
}
@media (min-width: 900px) { .cr-steps { grid-template-columns: repeat(4, minmax(0, 1fr)); } }

.cr-step {
  background: #fff;
  padding: 1.6rem 1.4rem;
  display: grid;
  align-content: start;
  gap: 0.55rem;
}
.cr-step-num {
  font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
  font-size: 0.75rem;
  color: #0057b8;
}
.cr-step-title {
  font-family: 'SF Pro Rounded', system-ui, sans-serif;
  font-size: 1.02rem;
  color: #1a1a1a;
}
.cr-step-desc {
  font-size: 0.88rem;
  line-height: 1.55;
  color: rgba(26, 26, 26, 0.62);
}

/* ===== Аккордеон ===== */
.cr-acc { border-top: 1px solid #e2e2e2; }
.cr-item { border-bottom: 1px solid #e2e2e2; }
.cr-head {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1.5rem;
  padding: 1.3rem 0;
  text-align: left;
  background: none;
  transition: color 0.2s ease;
}
.cr-head:hover { color: #0057b8; }
.cr-head-title {
  font-family: 'SF Pro Rounded', system-ui, sans-serif;
  font-size: clamp(1rem, 1.5vw, 1.2rem);
  font-weight: 600;
}
.cr-chevron {
  flex-shrink: 0;
  width: 2rem;
  height: 2rem;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: 1px solid #d8d8d8;
  border-radius: 50%;
  font-size: 0.9rem;
  transition: transform 0.25s ease, background-color 0.2s ease, border-color 0.2s ease, color 0.2s ease;
}
.cr-chevron.is-open {
  transform: rotate(180deg);
  background: #002366;
  border-color: #002366;
  color: #fff;
}
.cr-body { padding: 0 0 1.75rem; }


/* ===== Миссия с кадрами ===== */
.cr-mission-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 2.5rem;
  align-items: center;
}
@media (min-width: 1000px) {
  .cr-mission-grid { grid-template-columns: minmax(0, 6fr) minmax(0, 5fr); gap: 3.5rem; }
}
.cr-shots {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  grid-auto-rows: 1fr;
  gap: 0.75rem;
}
.cr-shot {
  width: 100%;
  height: 100%;
  aspect-ratio: 4 / 3;
  object-fit: cover;
  display: block;
}
/* Крупный кадр держит блок: рядом с текстом нужна одна сильная картинка,
   а не три равные. */
.cr-shot--tall {
  grid-row: span 2;
  aspect-ratio: 3 / 4;
}

/* ===== Фильм ===== */
.cr-film {
  background: linear-gradient(140deg, #001b4d 0%, #0a1526 60%, #080a0e 100%);
  color: #fff;
  padding: clamp(3rem, 7vw, 5rem) 0;
}
.cr-film-inner {
  display: grid;
  grid-template-columns: 1fr;
  gap: 2rem;
  align-items: center;
}
@media (min-width: 1000px) {
  .cr-film-inner { grid-template-columns: minmax(0, 4fr) minmax(0, 7fr); gap: 3rem; }
}
.cr-h2--light { color: #fff; }
.cr-film-lede {
  margin-top: 1rem;
  font-size: 1rem;
  line-height: 1.65;
  color: rgba(255, 255, 255, 0.72);
}
.cr-film-video {
  width: 100%;
  aspect-ratio: 16 / 9;
  display: block;
  background: #000;
}

/* ===== Карточка HR ===== */
.cr-hr {
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 1.15rem;
  align-items: center;
  padding: 1.35rem 1.5rem;
  border: 1px solid #ededed;
  background: #fafafa;
}
.cr-hr-photo {
  width: 5.5rem;
  height: 5.5rem;
  border-radius: 50%;
  object-fit: cover;
  object-position: center 25%;
  border: 3px solid #fff;
  box-shadow: 0 8px 24px -12px rgba(0, 35, 102, 0.5);
}
.cr-hr-body { display: grid; gap: 0.15rem; min-width: 0; }
.cr-hr-name {
  font-family: 'SF Pro Rounded', system-ui, sans-serif;
  font-size: 1.05rem;
  color: #1a1a1a;
}
.cr-hr-role {
  font-size: 0.83rem;
  color: rgba(26, 26, 26, 0.55);
  margin-bottom: 0.35rem;
}

/* ===== Анкеты ===== */
.cr-forms-head {
  display: grid;
  grid-template-columns: 1fr;
  gap: 2rem;
  margin-bottom: 2.5rem;
}
@media (min-width: 900px) {
  .cr-forms-head { grid-template-columns: minmax(0, 7fr) minmax(0, 4fr); align-items: start; }
}
.cr-hr {
  display: grid;
  gap: 0.35rem;
  padding: 1.25rem 1.5rem;
  border: 1px solid #ededed;
  background: #fafafa;
}
.cr-hr-label {
  font-size: 0.72rem;
  letter-spacing: 0.09em;
  text-transform: uppercase;
  color: #0057b8;
  font-weight: 600;
  margin-bottom: 0.3rem;
}
.cr-hr-link {
  font-size: 0.95rem;
  font-weight: 600;
  color: #1a1a1a;
  word-break: break-word;
}
.cr-hr-link:hover { color: #0057b8; }

.cr-files {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1px;
  background: #ededed;
  border: 1px solid #ededed;
}
@media (min-width: 760px) { .cr-files { grid-template-columns: repeat(3, minmax(0, 1fr)); } }
.cr-file {
  display: grid;
  gap: 0.35rem;
  padding: 1.5rem;
  background: #fff;
  transition: background-color 0.2s ease;
}
.cr-file:hover { background: rgba(0, 35, 102, 0.03); }
.cr-file-name {
  font-family: 'SF Pro Rounded', system-ui, sans-serif;
  font-size: 1.05rem;
  font-weight: 600;
  color: #1a1a1a;
}
.cr-file-meta { font-size: 0.85rem; color: rgba(26, 26, 26, 0.55); }
.cr-file-act {
  margin-top: 0.5rem;
  font-size: 0.8rem;
  font-weight: 600;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  color: #0057b8;
}

/* ===== Корпоративная жизнь ===== */
.cr-gallery {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.5rem;
}
@media (min-width: 760px) { .cr-gallery { grid-template-columns: repeat(3, minmax(0, 1fr)); } }
.cr-photo img {
  width: 100%;
  aspect-ratio: 4 / 3;
  object-fit: cover;
  display: block;
}
.cr-photo figcaption {
  margin-top: 0.75rem;
  font-size: 0.86rem;
  color: rgba(26, 26, 26, 0.6);
}

/* ===== Финальный призыв ===== */
.cr-cta {
  background: linear-gradient(140deg, #001b4d 0%, #0a1526 60%, #080a0e 100%);
  color: #fff;
  padding: clamp(3.5rem, 8vw, 6rem) 0;
}
.cr-cta-inner { max-width: 46rem; }
.cr-cta-title {
  font-size: clamp(1.8rem, 3.6vw, 2.8rem);
  margin-bottom: 1rem;
}
.cr-cta-text {
  font-size: 1.02rem;
  line-height: 1.65;
  color: rgba(255, 255, 255, 0.72);
  margin-bottom: 2rem;
}
.cr-cta-actions { display: flex; flex-wrap: wrap; gap: 0.85rem; }
</style>
