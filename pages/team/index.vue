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
            <!-- Премиальные 3D-иконки (хром с синим отливом) на белой плашке -->
            <img class="tm-ico3d" :src="dept.icon3d" :alt="''" loading="lazy" decoding="async" />
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
              <svg class="ap-ico" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24" aria-hidden="true" v-html="value.icon"></svg>
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
    icon3d: '/images/icons3d/icon-layers.webp',
    icon: '<path d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125"/>',
    title: 'Проектирование и Инжиниринг',
    desc: '3D-моделирование, BIM-разработка, LiDAR-сканирование, гидравлические расчеты',
    team: '25+ инженеров'
  },
  {
    id: 2,
    icon3d: '/images/icons3d/icon-gear.webp',
    icon: '<path d="M3 21h18M5 21V7l8-4v18M19 21V11l-6-4M9 9v.01M9 13v.01M9 17v.01"/>',
    title: 'Производство',
    desc: 'Производство оборудования, контроль качества, сборка, испытания',
    team: '30+ производственников'
  },
  {
    id: 3,
    icon3d: '/images/icons3d/icon-drop.webp',
    icon: '<path d="M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082M19.8 15.3l-1.57.393A9.065 9.065 0 0112 15a9.065 9.065 0 00-6.23.693L5 14.5m14.8.8l1.402 1.402c1.232 1.232.65 3.318-1.067 3.611A48.309 48.309 0 0112 21c-2.773 0-5.491-.235-8.135-.687-1.718-.293-2.3-2.379-1.067-3.61L5 14.5"/>',
    title: 'Лабораторные исследования',
    desc: 'Анализ качества воды, тестирование технологий, разработка инноваций',
    team: '10+ специалистов'
  },
  {
    id: 4,
    icon3d: '/images/icons3d/icon-pipe.webp',
    icon: '<path d="M21.75 6.75a4.5 4.5 0 01-5.7 4.432l-3.29 3.29a1 1 0 00-.24.376l-.84 2.52a1 1 0 01-1.38.56l-1.68-.84a1 1 0 00-1.04.06l-3.29 3.29m0 0a4.5 4.5 0 101.67-6.68l1.63 1.63a4.5 4.5 0 00-3.3-2.06l-1.7 1.7M21.75 6.75a4.5 4.5 0 00-6.68-1.67l-3.29 3.29"/>',
    title: 'Монтаж и Пусконаладка',
    desc: 'Выезды на объекты, монтаж оборудования, обучение операторов',
    team: '20+ мастеров'
  },
  {
    id: 5,
    icon3d: '/images/icons3d/icon-handshake.webp',
    icon: '<path d="M3 14v-3a9 9 0 0118 0v3M5 14h3v7H7a2 2 0 01-2-2v-5zm11 0h3v5a2 2 0 01-2 2h-1v-7z"/>',
    title: 'Техническая Поддержка',
    desc: '24/7 горячая линия, консультации, диагностика, удалённая помощь',
    team: '15+ диспетчеров'
  },
  {
    id: 6,
    icon3d: '/images/icons3d/icon-shield.webp',
    icon: '<path d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z"/>',
    title: 'Администрация и Управление',
    desc: 'Стратегия, финансы, логистика, управление проектами',
    team: '5+ менеджеров'
  }
]

const cultureValues = [
  {
    icon: '<path d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z"/>',
    title: 'Совершенство в каждой детали',
    text: 'Мы не останавливаемся на "хорошо". Только "Эталон качества".'
  },
  {
    icon: '<path d="M17 20h5v-2a3 3 0 00-2.5-2.95M9 20H4v-2a3 3 0 012.5-2.95M14 14a3 3 0 11-6 0 3 3 0 016 0zm3-1a3 3 0 10-1.5-5.6"/>',
    title: 'Партнёрство как образ жизни',
    text: 'Мы работаем вместе с клиентом, а не для клиента. Ваш успех — наш успех.'
  },
  {
    icon: '<path d="M12 18v-5.25m0 0a6.01 6.01 0 001.5-.189m-1.5.189a6.01 6.01 0 01-1.5-.189m3.75 7.478a12.06 12.06 0 01-4.5 0m3.75 2.383a14.406 14.406 0 01-3 0M14.25 18v-.192c0-.983.658-1.823 1.508-2.316a7.5 7.5 0 10-7.517 0c.85.493 1.509 1.333 1.509 2.316V18"/>',
    title: 'Инновации как необходимость',
    text: 'LiDAR, 3D, IoT — мы в авангарде цифровизации индустрии.'
  },
  {
    icon: '<path d="M12 2.69l5.66 5.66a8 8 0 11-11.31 0L12 2.69z"/>',
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
.tm-ico3d { width: 72px; height: 60px; object-fit: contain; mix-blend-mode: multiply; margin-bottom: 0.4rem; }
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
