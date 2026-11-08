<template>
  <!-- Команда в подаче Apple. Личные карточки с ФИО и фото сняты: показываем
       коллектив целиком и то, как он работает, на реальных кадрах ESP. -->
  <div class="ap">
    <section class="ap-sec ap-sec--first">
      <div class="ap-wrap">
        <span class="ap-eyebrow">Синергия опыта</span>
        <h1 class="ap-title">Команда — от проекта до реализации.</h1>
        <p class="ap-lede">Инженеры, проектировщики и производственники ESP — один коллектив: расчёт, оборудование и монтаж в одних руках.</p>
        <!-- Общий кадр команды, вырезанный с реального фото и посаженный
             на белую студию (подача Apple Leadership) -->
        <figure class="ap-media tm-group">
          <img src="/images/team/real/team-studio.webp" alt="Коллектив ESP" width="2400" height="1230" fetchpriority="high" />
        </figure>
        <p class="ap-caption">Коллектив ESP — проектный отдел, производство и монтаж: один коллектив, одна ответственность.</p>
        <ul class="ap-stats">
          <li><b>100+</b><span>Специалистов</span></li>
          <li><b>28</b><span>Лет опыта</span></li>
          <li><b>2000+</b><span>Проектов реализовано</span></li>
          <li><b>3</b><span>Поколения инженеров</span></li>
        </ul>
      </div>
    </section>

    <!-- Как работает команда: лента кадров, листается пальцем -->
    <section id="experts" class="ap-sec ap-sec--white tm-anchor">
      <div class="ap-wrap">
        <span class="ap-eyebrow">Люди ESP</span>
        <h2 class="ap-h2">Как работает инженерная команда ESP.</h2>
        <p class="ap-lede">Один коллектив ведёт объект от первой встречи до пусконаладки — без передачи между подрядчиками.</p>
      </div>
      <div class="tm-track">
        <figure v-for="(shot, i) in workShots" :key="shot.src" class="tm-shot">
          <div class="tm-shot-img"><img :src="shot.src" :alt="shot.alt" loading="lazy" decoding="async" /></div>
          <figcaption>
            <span class="ap-eyebrow">{{ String(i + 1).padStart(2, '0') }}</span>
            <b class="ap-h3">{{ shot.title }}</b>
            <span class="ap-text">{{ shot.text }}</span>
          </figcaption>
        </figure>
      </div>
    </section>

    <section id="departments" class="ap-sec">
      <div class="ap-wrap">
        <h2 class="ap-h2">Структура команды.</h2>
        <p class="ap-lede">Каждый отдел ESP отвечает за экселленс в своей области</p>
        <div class="ap-grid ap-grid--3">
          <div v-for="dept in departments" :key="dept.id" class="ap-card">
            <!-- Линейные иконки в стиле SF Symbols -->
            <ApIcon :name="dept.glyph" class="ap-ico" />
            <h3 class="ap-h3">{{ dept.title }}</h3>
            <p class="ap-text">{{ dept.desc }}</p>
            <span class="ap-pill ap-card-foot tm-pill">{{ dept.team }}</span>
          </div>
        </div>
      </div>
    </section>

    <section id="culture" class="ap-sec ap-sec--white tm-anchor">
      <div class="ap-wrap tm-culture">
        <div>
          <h2 class="ap-h2">Культура ESP.</h2>
          <ul class="tm-values">
            <li v-for="value in cultureValues" :key="value.title">
              <ApIcon :name="value.glyph" class="ap-ico" />
              <div>
                <b>{{ value.title }}</b>
                <span class="ap-text">{{ value.text }}</span>
              </div>
            </li>
          </ul>
        </div>
        <div>
          <figure class="ap-media tm-culture-img">
            <img src="/images/team/real/board.webp" alt="Инженеры ESP за обсуждением проекта" loading="lazy" />
          </figure>
          <blockquote class="ap-card tm-quote">
            <p>«Мы держимся на двух вещах: инженерном расчёте и собственном производстве. Проект, оборудование и пусконаладка — в одних руках, поэтому за результат отвечаем целиком.»</p>
            <span class="ap-small">Руководство ESP · 28 лет в отрасли очистки воды</span>
          </blockquote>
        </div>
      </div>
    </section>

    <section id="vacancies" class="ap-sec tm-anchor">
      <div class="ap-wrap">
        <span class="ap-eyebrow">Карьера в ESP</span>
        <div class="ap-head">
          <h2 class="ap-h2">Открытые вакансии.</h2>
          <NuxtLink to="/career" class="ap-link">Работа в ESP ›</NuxtLink>
        </div>
        <p class="ap-lede">Мы растём — присоединяйтесь к команде, которая строит экосистемы чистой воды</p>
        <div class="ap-rows">
          <div v-for="vac in vacancies" :key="vac.title" class="ap-row">
            <div class="tm-vac">
              <NuxtLink :to="`/team/vacancies/${vac.slug}`"><b>{{ vac.title }}</b></NuxtLink>
              <span class="ap-small">{{ vac.dept }} · {{ vac.location }}</span>
            </div>
            <span class="ap-pill">{{ vac.type }}</span>
            <NuxtLink :to="`/team/vacancies/${vac.slug}`" class="ap-link">Подробнее ›</NuxtLink>
          </div>
        </div>
        <p class="ap-small tm-note">Если сейчас нет подходящей открытой позиции — отправьте резюме через форму ниже, мы будем иметь вас в виду, когда появится подходящая вакансия.</p>
      </div>
    </section>

    <section id="internship" class="ap-sec ap-sec--white tm-anchor">
      <div class="ap-wrap">
        <span class="ap-eyebrow">Для студентов</span>
        <h2 class="ap-h2">Программа стажировок ESP.</h2>
        <p class="ap-lede">3-месячная оплачиваемая стажировка для студентов технических специальностей: инженерия водоочистки, проектирование, автоматизация.</p>
        <div class="ap-grid ap-grid--2">
          <ul class="ap-card tm-checks">
            <li>Наставник из числа ведущих инженеров ESP</li>
            <li>Работа над реальными проектами</li>
            <li>Возможность трудоустройства по итогам</li>
          </ul>
          <div class="ap-card">
            <b>Ближайший набор:</b>
            <p class="ap-text">Приём заявок на летнюю стажировку 2026 открыт. Направления: проектирование и BIM, производство оборудования, автоматизация и IoT.</p>
            <div class="ap-card-foot"><a href="#apply" class="ap-btn">Подать заявку на стажировку</a></div>
          </div>
        </div>
        <div class="ap-grid ap-grid--3">
          <div v-for="t in internshipTracks" :key="t.title" class="ap-card">
            <h3 class="ap-h3">{{ t.title }}</h3>
            <p class="ap-text">{{ t.content }}</p>
          </div>
        </div>
      </div>
    </section>

    <section id="apply" class="ap-sec tm-anchor">
      <div class="ap-wrap ap-wrap--narrow">
        <div class="ap-center">
          <h2 class="ap-h2">Отправить отклик.</h2>
          <p class="ap-lede">Заполните форму — HR-отдел ESP свяжется с вами в течение 3 рабочих дней</p>
        </div>
        <form v-if="!applySent" class="ap-form tm-form" @submit.prevent="apply">
          <div class="ap-form-row">
            <input v-model="applyForm.name" name="name" autocomplete="name" required type="text" placeholder="Ваше имя" class="ap-input" />
            <input v-model="applyForm.email" name="email" autocomplete="email" required type="email" placeholder="E-mail" class="ap-input" />
          </div>
          <input v-model="applyForm.phone" name="phone" autocomplete="tel" type="tel" placeholder="Телефон" class="ap-input" />
          <FileUpload accept=".pdf,.doc,.docx" hint="Резюме: PDF, DOC, DOCX до 10МБ" @change="applyForm.resume = $event" />
          <select v-model="applyForm.position" name="position" class="ap-input">
            <option value="">Выберите вакансию или стажировку</option>
            <option v-for="vac in vacancies" :key="vac.title" :value="vac.title">{{ vac.title }}</option>
            <option value="Стажировка">Стажировка</option>
          </select>
          <textarea v-model="applyForm.message" name="message" rows="4" placeholder="Сопроводительное письмо" class="ap-input"></textarea>
          <LeadConsent v-model="applyForm.consent" />
          <p v-if="applyLead.error.value" role="alert" style="font-size:13px;color:#b42318;margin:0">{{ applyLead.error.value }}</p>
          <button type="submit" class="ap-btn ap-btn--block" :disabled="applyLead.sending.value">{{ applyLead.sending.value ? 'Отправка...' : 'Отправить отклик' }}</button>
        </form>
        <div v-else class="ap-form ap-center tm-form">
          <h3 class="ap-h3">Отклик отправлен</h3>
          <p class="ap-text">HR-отдел ESP свяжется с вами в течение 3 рабочих дней.</p>
        </div>
      </div>
    </section>

    <section class="ap-sec ap-sec--white ap-cta">
      <div class="ap-wrap">
        <h2 class="ap-h2">Присоединитесь к команде инноваторов</h2>
        <p class="ap-lede">ESP ищет талантливых инженеров, проектировщиков и специалистов, которые разделяют нашу страсть к совершенству.</p>
        <div class="ap-actions">
          <a href="#apply" class="ap-btn">Отправить резюме</a>
          <NuxtLink to="/contacts" class="ap-link">Контакты ›</NuxtLink>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { vacanciesList } from '~/composables/useVacancies'
import { ref } from 'vue'


// Как работает команда — реальные кадры ESP: офис, производство, площадка
// (исходники 4K с диска, Samsung_T5/01_Проекты/Экосервис).
const workShots = [
  { src: '/images/team/real/planning.webp', title: 'Обсуждаем проект', text: 'Планёрка проектного отдела: задача заказчика, состав стоков, сроки.', alt: 'Планёрка инженеров ESP за круглым столом' },
  { src: '/images/team/real/board.webp', title: 'Разбираем схему', text: 'Технологическая схема на доске — до того, как она уйдёт в 3D.', alt: 'Инженеры ESP разбирают технологическую схему у доски' },
  { src: '/images/team/real/cad.webp', title: 'Проектируем', text: '3D-моделирование, BIM-разработка, гидравлические расчёты.', alt: 'Проектировщик ESP моделирует барабанное сито в 3D' },
  { src: '/images/team/real/welder.webp', title: 'Изготавливаем', text: 'Производство оборудования, контроль качества, сборка, испытания.', alt: 'Сварщик ESP в цеху с деталями из нержавеющей стали' },
  { src: '/images/team/real/forklift.webp', title: 'Отгружаем', text: 'Готовое оборудование уходит с собственной площадки ESP.', alt: 'Сотрудник ESP за рулём погрузчика на площадке' },
  { src: '/images/team/real/site.webp', title: 'Сдаём объект', text: 'Выезды на объекты, монтаж оборудования, обучение операторов.', alt: 'Мастер ESP на площадке рядом с оборудованием' }
]

// og-картинки лежат в этом проекте: origin берём из runtimeConfig,
// чтобы смена домена правилась в одном месте.
const ogOrigin = useRuntimeConfig().public.ogOrigin

useHead({
  title: 'Команда ESP | 100+ инженеров с 28-летним опытом в очистке воды',
  meta: [
    {
      name: 'description',
      content: 'Команда EcoServiceProject: 100+ профессионалов, 28 лет опыта, три поколения инженеров. Структура: проектирование, производство, инжиниринг, поддержка.'
    },
    { property: 'og:title', content: 'Команда ESP | Как работает коллектив ESP' },
    { property: 'og:description', content: '100+ специалистов, 28 лет опыта, три поколения инженеров очистки воды.' },
    { property: 'og:image', content: `${ogOrigin}/images/og-esp.png` }
  ],
  link: [{ rel: 'canonical', href: 'https://ecoservisproekt.by/team' }]
})

const departments = [
  {
    id: 1,
    glyph: 'layers',
    title: 'Проектирование и Инжиниринг',
    desc: '3D-моделирование, BIM-разработка, LiDAR-сканирование, гидравлические расчеты',
    team: '25+ инженеров'
  },
  {
    id: 2,
    glyph: 'factory',
    title: 'Производство',
    desc: 'Производство оборудования, контроль качества, сборка, испытания',
    team: '30+ производственников'
  },
  {
    id: 3,
    glyph: 'flask',
    title: 'Лабораторные исследования',
    desc: 'Анализ качества воды, тестирование технологий, разработка инноваций',
    team: '10+ специалистов'
  },
  {
    id: 4,
    glyph: 'pipe',
    title: 'Монтаж и Пусконаладка',
    desc: 'Выезды на объекты, монтаж оборудования, обучение операторов',
    team: '20+ мастеров'
  },
  {
    id: 5,
    glyph: 'headset',
    title: 'Техническая Поддержка',
    desc: '24/7 горячая линия, консультации, диагностика, удалённая помощь',
    team: '15+ диспетчеров'
  },
  {
    id: 6,
    glyph: 'shield',
    title: 'Администрация и Управление',
    desc: 'Стратегия, финансы, логистика, управление проектами',
    team: '5+ менеджеров'
  }
]

const cultureValues = [
  {
    glyph: 'shieldcheck',
    title: 'Совершенство в каждой детали',
    text: 'Мы не останавливаемся на "хорошо". Только "Эталон качества".'
  },
  {
    glyph: 'users',
    title: 'Партнёрство как образ жизни',
    text: 'Мы работаем вместе с клиентом, а не для клиента. Ваш успех — наш успех.'
  },
  {
    glyph: 'bulb',
    title: 'Инновации как необходимость',
    text: 'LiDAR, 3D, IoT — мы в авангарде цифровизации индустрии.'
  },
  {
    glyph: 'leaf',
    title: 'Ответственность перед природой',
    text: 'Каждый проект — это забота о чистоте воды на Земле.'
  }
]

const vacancies = useEditableList('vacancies', vacanciesList)


const applyForm = ref({ name: '', email: '', phone: '', position: '', message: '', resume: null, consent: false })

const internshipTracks = [
  { title: 'Для студентов', content: 'Дипломные проекты: возможность написания научно-практических работ на основе действующих технологических карт ESP с последующим трудоустройством.' },
  { title: 'Внутреннее обучение', content: 'Курсы и сертификаты: аттестационная платформа по AutoCAD/Revit, КИПиА-сетям и основам гидродинамической фильтрации.' },
  { title: 'Партнёрства с вузами', content: 'БНТУ, БГУИР и лаб-базы: регулярная интеграция проектной практики с ведущими техническими кафедрами, совместные исследования.' }
]
const applySent = ref(false)
const applyLead = useLead('career')
const apply = async (e) => {
  const { resume, ...fields } = applyForm.value
  const files = [resume].flat().filter((f) => f instanceof File)
  applySent.value = await applyLead.send(fields, files, e)
}
</script>

<style scoped>
.tm-group { margin-top: 2.75rem; }
.tm-group img { aspect-ratio: 16 / 9; object-fit: cover; }
.tm-anchor { scroll-margin-top: 5rem; }

/* Лента кадров как в каталоге: отступ слева по сетке, края — в край экрана */
.tm-track {
  --tm-pad: max(1.5rem, calc((100% - 76rem) / 2 + 1.5rem));
  display: grid;
  grid-auto-flow: column;
  grid-auto-columns: clamp(17rem, 30vw, 24rem);
  column-gap: 1.25rem;
  margin-top: 2.5rem;
  overflow-x: auto;
  overscroll-behavior-x: contain;
  scroll-snap-type: x mandatory;
  padding: 0 var(--tm-pad) 0.5rem;
  scroll-padding-left: var(--tm-pad);
  scrollbar-width: none;
}
.tm-track::-webkit-scrollbar { display: none; }
.tm-shot { scroll-snap-align: start; display: flex; flex-direction: column; margin: 0; }
.tm-shot-img { aspect-ratio: 4 / 5; border-radius: 18px; overflow: hidden; background: #ebebef; }
.tm-shot-img img { width: 100%; height: 100%; object-fit: cover; transition: transform 0.6s cubic-bezier(0.16, 1, 0.3, 1); }
.tm-shot:hover .tm-shot-img img { transform: scale(1.04); }
.tm-shot figcaption { display: grid; gap: 0.35rem; margin-top: 1.1rem; }
.tm-shot .ap-eyebrow { margin: 0; }

.tm-pill { align-self: flex-start; }
.tm-culture { display: grid; grid-template-columns: 1fr 1fr; gap: 3rem; align-items: start; }
.tm-values { display: grid; gap: 1.5rem; margin-top: 2rem; list-style: none; padding: 0; }
.tm-values li { display: grid; grid-template-columns: 28px 1fr; gap: 1rem; }
.tm-values .ap-ico { width: 28px; height: 28px; color: var(--ap-blue); }
.tm-values b { display: block; margin-bottom: 0.2rem; font-weight: 600; }
.tm-culture-img { margin-top: 0; }
.tm-culture-img img { aspect-ratio: 4 / 3; object-fit: cover; }
.tm-quote { margin-top: 1.25rem; }
.tm-quote p { font-size: 1.1rem; line-height: 1.5; }
.tm-vac { display: grid; gap: 0.15rem; flex: 1; min-width: 14rem; }
.tm-vac a:hover { color: var(--ap-link); }
.tm-note { max-width: 36rem; margin-top: 1.25rem; }
.tm-checks { list-style: none; gap: 0.75rem; }
.tm-checks li { position: relative; padding-left: 1.6rem; font-size: 15px; }
.tm-checks li::before { content: ''; position: absolute; left: 0.2rem; top: 0.35rem; width: 0.8rem; height: 0.45rem; border-left: 2px solid #006039; border-bottom: 2px solid #006039; transform: rotate(-45deg); }
.tm-form { margin-top: 2.5rem; }

@media (max-width: 1023px) {
  .tm-culture { grid-template-columns: 1fr; }
}
@media (max-width: 767px) {
  .tm-track { grid-auto-columns: 78vw; }
}
@media (prefers-reduced-motion: reduce) {
  .tm-shot-img img { transition: none; }
}
</style>
