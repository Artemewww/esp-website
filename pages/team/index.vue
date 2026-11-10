<template>
  <!-- Команда в подаче DJI × Apple. Личные карточки с ФИО и фото сняты:
       показываем коллектив целиком и то, как он работает, на реальных кадрах ESP. -->
  <div ref="root" class="dj tm">
    <DjPageHero
      eyebrow="Синергия опыта"
      title="Команда — от проекта до реализации."
      lede="Инженеры, проектировщики и производственники ESP — один коллектив: расчёт, оборудование и монтаж в одних руках."
    />

    <!-- Общий кадр команды, вырезанный с реального фото и посаженный
         на белую студию (подача Apple Leadership) -->
    <figure class="tm-group">
      <img src="/images/team/real/team-studio.webp" alt="Коллектив ESP" width="2400" height="1230" fetchpriority="high" />
      <figcaption>Коллектив ESP — проектный отдел, производство и монтаж: один коллектив, одна ответственность.</figcaption>
    </figure>

    <DjSubnav
      title="Команда ESP"
      :links="[
        { href: '#experts', label: 'Люди' },
        { href: '#departments', label: 'Отделы' },
        { href: '#culture', label: 'Культура' },
        { href: '#vacancies', label: 'Вакансии' },
        { href: '#internship', label: 'Стажировки' }
      ]"
      :cta="{ to: '/team#apply', label: 'Отправить отклик' }"
    />

    <section class="dj-sec">
      <div class="dj-wrap">
        <ul class="tm-stats">
          <li class="dj-reveal"><b>100+</b><span>Специалистов</span></li>
          <li class="dj-reveal"><b>28</b><span>Лет опыта</span></li>
          <li class="dj-reveal"><b>2000+</b><span>Проектов реализовано</span></li>
          <li class="dj-reveal"><b>3</b><span>Поколения инженеров</span></li>
        </ul>
      </div>
    </section>

    <!-- Как работает команда: лента кадров, листается пальцем -->
    <section id="experts" class="dj-sec dj-sec--soft tm-anchor">
      <div class="dj-wrap dj-reveal">
        <span class="dj-eyebrow">Люди ESP</span>
        <h2 class="dj-h2 tm-h2">Как работает инженерная команда ESP.</h2>
        <p class="dj-lede tm-lede">Один коллектив ведёт объект от первой встречи до пусконаладки — без передачи между подрядчиками.</p>
      </div>
      <div class="tm-track">
        <figure v-for="(shot, i) in workShots" :key="shot.src" class="tm-shot">
          <div class="tm-shot-img"><img :src="shot.src" :alt="shot.alt" loading="lazy" decoding="async" /></div>
          <figcaption>
            <span class="tm-idx">{{ String(i + 1).padStart(2, '0') }}</span>
            <b class="tm-h3">{{ shot.title }}</b>
            <span class="tm-text">{{ shot.text }}</span>
          </figcaption>
        </figure>
      </div>
    </section>

    <section id="departments" class="dj-sec tm-anchor">
      <div class="dj-wrap dj-center dj-reveal">
        <h2 class="dj-h2">Структура команды.</h2>
        <p class="dj-lede tm-lede">Каждый отдел ESP отвечает за экселленс в своей области</p>
      </div>
      <div class="tm-tiles">
        <div v-for="dept in departments" :key="dept.id" class="tm-tile dj-reveal">
          <ApIcon :name="dept.glyph" class="tm-ico" />
          <h3 class="tm-h3">{{ dept.title }}</h3>
          <p class="tm-text">{{ dept.desc }}</p>
          <span class="tm-count">{{ dept.team }}</span>
        </div>
      </div>
    </section>

    <section id="culture" class="dj-sec dj-sec--dark tm-anchor">
      <div class="dj-wrap tm-culture">
        <div class="dj-reveal">
          <h2 class="dj-h2">Культура ESP.</h2>
          <ul class="tm-values">
            <li v-for="value in cultureValues" :key="value.title">
              <ApIcon :name="value.glyph" class="tm-vico" />
              <div>
                <b>{{ value.title }}</b>
                <span>{{ value.text }}</span>
              </div>
            </li>
          </ul>
        </div>
        <div class="dj-reveal">
          <figure class="tm-culture-img">
            <img src="/images/team/real/board.webp" alt="Инженеры ESP за обсуждением проекта" loading="lazy" />
          </figure>
          <blockquote class="tm-quote">
            <p>«Мы держимся на двух вещах: инженерном расчёте и собственном производстве. Проект, оборудование и пусконаладка — в одних руках, поэтому за результат отвечаем целиком.»</p>
            <span>Руководство ESP · 28 лет в отрасли очистки воды</span>
          </blockquote>
        </div>
      </div>
    </section>

    <section id="vacancies" class="dj-sec tm-anchor">
      <div class="dj-wrap">
        <div class="tm-head dj-reveal">
          <div>
            <span class="dj-eyebrow">Карьера в ESP</span>
            <h2 class="dj-h2 tm-h2">Открытые вакансии.</h2>
          </div>
          <NuxtLink to="/career" class="dj-more">Работа в ESP</NuxtLink>
        </div>
        <p class="dj-lede tm-lede dj-reveal">Мы растём — присоединяйтесь к команде, которая строит экосистемы чистой воды</p>
        <div class="tm-rows dj-reveal">
          <NuxtLink v-for="vac in vacancies" :key="vac.title" :to="`/team/vacancies/${vac.slug}`" class="tm-row">
            <span class="tm-vac">
              <b>{{ vac.title }}</b>
              <span>{{ vac.dept }} · {{ vac.location }}</span>
            </span>
            <span class="tm-type">{{ vac.type }}</span>
            <span class="dj-more">Подробнее</span>
          </NuxtLink>
        </div>
        <p class="tm-note">Если сейчас нет подходящей открытой позиции — отправьте резюме через форму ниже, мы будем иметь вас в виду, когда появится подходящая вакансия.</p>
      </div>
    </section>

    <section id="internship" class="dj-sec dj-sec--soft tm-anchor">
      <div class="dj-wrap dj-center dj-reveal">
        <span class="dj-eyebrow">Для студентов</span>
        <h2 class="dj-h2 tm-h2">Программа стажировок ESP.</h2>
        <p class="dj-lede tm-lede">3-месячная оплачиваемая стажировка для студентов технических специальностей: инженерия водоочистки, проектирование, автоматизация.</p>
      </div>
      <div class="tm-intern">
        <ul class="tm-card tm-checks dj-reveal">
          <li>Наставник из числа ведущих инженеров ESP</li>
          <li>Работа над реальными проектами</li>
          <li>Возможность трудоустройства по итогам</li>
        </ul>
        <div class="tm-card dj-reveal">
          <b class="tm-h3">Ближайший набор:</b>
          <p class="tm-text">Приём заявок на летнюю стажировку 2026 открыт. Направления: проектирование и BIM, производство оборудования, автоматизация и IoT.</p>
          <a href="#apply" class="dj-btn tm-card-btn">Подать заявку на стажировку</a>
        </div>
        <div v-for="t in internshipTracks" :key="t.title" class="tm-card tm-card--third dj-reveal">
          <h3 class="tm-h3">{{ t.title }}</h3>
          <p class="tm-text">{{ t.content }}</p>
        </div>
      </div>
    </section>

    <section id="apply" class="dj-sec tm-anchor">
      <div class="tm-narrow">
        <div class="dj-center dj-reveal">
          <h2 class="dj-h2">Отправить отклик.</h2>
          <p class="dj-lede tm-lede">Заполните форму — HR-отдел ESP свяжется с вами в течение 3 рабочих дней</p>
        </div>
        <form v-if="!applySent" class="tm-form dj-reveal" @submit.prevent="apply">
          <div class="tm-form-row">
            <input v-model="applyForm.name" name="name" autocomplete="name" required type="text" placeholder="Ваше имя" class="tm-input" />
            <input v-model="applyForm.email" name="email" autocomplete="email" required type="email" placeholder="E-mail" class="tm-input" />
          </div>
          <input v-model="applyForm.phone" name="phone" autocomplete="tel" type="tel" placeholder="Телефон" class="tm-input" />
          <FileUpload accept=".pdf,.doc,.docx" hint="Резюме: PDF, DOC, DOCX до 10МБ" @change="applyForm.resume = $event" />
          <select v-model="applyForm.position" name="position" class="tm-input">
            <option value="">Выберите вакансию или стажировку</option>
            <option v-for="vac in vacancies" :key="vac.title" :value="vac.title">{{ vac.title }}</option>
            <option value="Стажировка">Стажировка</option>
          </select>
          <textarea v-model="applyForm.message" name="message" rows="4" placeholder="Сопроводительное письмо" class="tm-input"></textarea>
          <LeadConsent v-model="applyForm.consent" />
          <p v-if="applyLead.error.value" role="alert" style="font-size:13px;color:#b42318;margin:0">{{ applyLead.error.value }}</p>
          <button type="submit" class="dj-btn dj-btn--lg tm-submit" :disabled="applyLead.sending.value">{{ applyLead.sending.value ? 'Отправка...' : 'Отправить отклик' }}</button>
        </form>
        <div v-else class="tm-form dj-center">
          <h3 class="tm-h3">Отклик отправлен</h3>
          <p class="tm-text">HR-отдел ESP свяжется с вами в течение 3 рабочих дней.</p>
        </div>
      </div>
    </section>

    <section class="dj-sec dj-sec--dark dj-center">
      <div class="dj-wrap dj-reveal">
        <h2 class="dj-h2">Присоединитесь к команде инноваторов</h2>
        <p class="dj-lede tm-lede">ESP ищет талантливых инженеров, проектировщиков и специалистов, которые разделяют нашу страсть к совершенству.</p>
        <div class="dj-links tm-cta-act">
          <a href="#apply" class="dj-btn dj-btn--white dj-btn--lg">Отправить резюме</a>
          <NuxtLink to="/contacts" class="dj-more dj-more--light">Контакты</NuxtLink>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { vacanciesList } from '~/composables/useVacancies'
import { ref } from 'vue'
import { useReveal } from '~/composables/useReveal'

const root = ref(null)
useReveal(root)


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
.tm-anchor { scroll-margin-top: 120px; }
.tm-h2 { margin-top: 6px; }
.tm-lede { margin-top: 12px; max-width: 52ch; }
.tm-h3 { display: block; font-size: clamp(19px, 1.6vw, 22px); line-height: 1.25; font-weight: 600; color: var(--dj-ink); letter-spacing: -0.015em; }
.tm-text { font-size: 15px; line-height: 1.55; color: var(--dj-text); }
.tm-narrow { max-width: 760px; margin: 0 auto; padding: 0 24px; }

/* Общий кадр — во всю ширину с отступом 12px */
.tm-group { margin: 0; padding: 0 12px; }
.tm-group img { display: block; width: 100%; height: auto; aspect-ratio: 2400 / 1230; object-fit: cover; background: #f4f5f7; }
.tm-group figcaption { max-width: 60ch; margin: 18px auto 0; padding: 0 24px; text-align: center; font-size: 14px; line-height: 1.5; color: var(--dj-muted); }
.tm :deep(.dsn) { margin-top: clamp(40px, 5vw, 64px); }

.tm-stats { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 24px; list-style: none; margin: 0; padding: 0; }
.tm-stats li { display: grid; gap: 8px; text-align: center; }
.tm-stats b { font-size: clamp(40px, 5vw, 68px); line-height: 1; font-weight: 600; letter-spacing: -0.03em; color: var(--dj-ink); font-variant-numeric: tabular-nums; }
.tm-stats span { font-size: 14px; color: var(--dj-muted); }

/* Лента кадров: отступ слева по сетке, края — в край экрана */
.tm-track {
  --tm-pad: max(24px, calc((100% - 1200px) / 2 + 24px));
  display: grid;
  grid-auto-flow: column;
  grid-auto-columns: clamp(272px, 30vw, 400px);
  column-gap: 12px;
  margin-top: clamp(32px, 4vw, 48px);
  overflow-x: auto;
  overscroll-behavior-x: contain;
  scroll-snap-type: x mandatory;
  padding: 0 var(--tm-pad) 8px;
  scroll-padding-left: var(--tm-pad);
  scrollbar-width: none;
}
.tm-track::-webkit-scrollbar { display: none; }
.tm-shot { scroll-snap-align: start; display: flex; flex-direction: column; margin: 0; }
.tm-shot-img { aspect-ratio: 4 / 5; overflow: hidden; background: #e9ecef; }
.tm-shot-img img { width: 100%; height: 100%; object-fit: cover; transition: transform 1.2s var(--dj-ease); }
.tm-shot:hover .tm-shot-img img { transform: scale(1.035); }
.tm-shot figcaption { display: grid; gap: 6px; margin-top: 18px; padding-right: 12px; }
.tm-idx { font-size: 13px; font-weight: 600; color: var(--dj-accent); font-variant-numeric: tabular-nums; }

/* Отделы — плитки */
.tm-tiles { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 12px; max-width: 1440px; margin: clamp(32px, 4vw, 48px) auto 0; padding: 0 12px; }
.tm-tile { display: flex; flex-direction: column; align-items: flex-start; gap: 10px; min-height: 280px; padding: clamp(28px, 3vw, 40px); background: linear-gradient(180deg, #f6f7f9 0%, #eaedf0 100%); }
.tm-ico { width: 34px; height: 34px; margin-bottom: 10px; color: var(--dj-ink); }
.tm-count { margin-top: auto; padding-top: 14px; font-size: 13px; font-weight: 600; color: var(--dj-ink); }

/* Культура на тёмном */
.tm-culture { display: grid; grid-template-columns: minmax(0, 1fr) minmax(0, 1fr); gap: clamp(32px, 5vw, 72px); align-items: start; }
.tm-values { display: grid; gap: 28px; margin: 36px 0 0; list-style: none; padding: 0; }
.tm-values li { display: grid; grid-template-columns: 28px 1fr; gap: 18px; }
.tm-vico { width: 28px; height: 28px; color: #fff; }
.tm-values b { display: block; margin-bottom: 4px; font-size: 17px; font-weight: 600; color: #fff; }
.tm-values span { font-size: 15px; line-height: 1.55; color: rgba(255, 255, 255, 0.66); }
.tm-culture-img { margin: 0; }
.tm-culture-img img { display: block; width: 100%; aspect-ratio: 4 / 3; object-fit: cover; }
.tm-quote { margin: 12px 0 0; padding: clamp(24px, 3vw, 36px); background: rgba(255, 255, 255, 0.06); }
.tm-quote p { font-size: clamp(17px, 1.4vw, 20px); line-height: 1.5; color: #fff; }
.tm-quote span { display: block; margin-top: 14px; font-size: 13px; color: rgba(255, 255, 255, 0.55); }

/* Вакансии строками */
.tm-head { display: flex; align-items: flex-end; justify-content: space-between; gap: 16px 32px; flex-wrap: wrap; }
.tm-rows { margin-top: clamp(28px, 4vw, 40px); border-top: 1px solid var(--dj-line); }
.tm-row { display: grid; grid-template-columns: minmax(0, 1fr) auto auto; align-items: center; gap: 12px 32px; padding: 22px 0; border-bottom: 1px solid var(--dj-line); transition: background-color 0.2s ease; }
.tm-row:hover .tm-vac b { color: var(--dj-link); }
.tm-vac { display: grid; gap: 4px; min-width: 0; }
.tm-vac b { font-size: clamp(17px, 1.5vw, 20px); font-weight: 600; color: var(--dj-ink); transition: color 0.2s ease; }
.tm-vac span { font-size: 14px; color: var(--dj-muted); }
.tm-type { font-size: 13px; padding: 6px 12px; background: var(--dj-soft); color: var(--dj-text); }
.tm-note { max-width: 40rem; margin-top: 20px; font-size: 14px; line-height: 1.55; color: var(--dj-muted); }

/* Стажировки */
.tm-intern { display: grid; grid-template-columns: repeat(6, minmax(0, 1fr)); gap: 12px; max-width: 1440px; margin: clamp(32px, 4vw, 48px) auto 0; padding: 0 12px; }
.tm-card { grid-column: span 3; display: flex; flex-direction: column; align-items: flex-start; gap: 10px; padding: clamp(28px, 3vw, 40px); background: #fff; }
.tm-card--third { grid-column: span 2; }
.tm-card-btn { margin-top: auto; }
.tm-checks { list-style: none; margin: 0; gap: 14px; justify-content: center; }
.tm-checks li { position: relative; padding-left: 28px; font-size: 17px; color: var(--dj-ink); }
.tm-checks li::before { content: ''; position: absolute; left: 4px; top: 0.4em; width: 12px; height: 7px; border-left: 2px solid var(--dj-accent); border-bottom: 2px solid var(--dj-accent); transform: rotate(-45deg); }

/* Форма отклика */
.tm-form { display: grid; gap: 16px; margin-top: clamp(28px, 4vw, 44px); padding: clamp(24px, 4vw, 48px); background: #fff; box-shadow: 0 0 0 1px var(--dj-line), 0 24px 60px -32px rgba(0, 0, 0, 0.18); }
.tm-form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
.tm-input { width: 100%; padding: 13px 14px; border: 1px solid #d2d5d9; border-radius: 0; background: #fff; font: inherit; font-size: 15px; color: var(--dj-ink); transition: border-color 0.2s ease, box-shadow 0.2s ease; }
.tm-input:focus { outline: none; border-color: var(--dj-ink); box-shadow: 0 0 0 3px rgba(0, 35, 102, 0.1); }
textarea.tm-input { resize: vertical; }
.tm-submit { width: 100%; }
.tm-submit:disabled { opacity: 0.6; }
.tm-cta-act { margin-top: 26px; }

@media (max-width: 1023px) {
  .tm-culture { grid-template-columns: minmax(0, 1fr); }
  .tm-tiles { grid-template-columns: 1fr 1fr; }
  .tm-stats { grid-template-columns: 1fr 1fr; row-gap: 40px; }
  .tm-card, .tm-card--third { grid-column: span 3; }
  .tm-card--third:last-child { grid-column: 1 / -1; }
}
@media (max-width: 767px) {
  .tm-group, .tm-tiles, .tm-intern { padding: 0 8px; gap: 8px; }
  .tm-tiles { grid-template-columns: minmax(0, 1fr); }
  .tm-tile { min-height: 0; }
  .tm-intern { grid-template-columns: minmax(0, 1fr); }
  .tm-card, .tm-card--third, .tm-card--third:last-child { grid-column: auto; }
  .tm-track { grid-auto-columns: 78vw; --tm-pad: 16px; }
  .tm-row { grid-template-columns: minmax(0, 1fr) auto; }
  .tm-type { grid-column: 1; justify-self: start; }
  .tm-row .dj-more { grid-column: 2; grid-row: 1; }
  .tm-form-row { grid-template-columns: minmax(0, 1fr); }
  .tm-narrow { padding: 0 16px; }
  .tm-card-btn { white-space: normal; height: auto; min-height: 40px; padding: 10px 22px; text-align: center; }
}
@media (prefers-reduced-motion: reduce) {
  .tm-shot-img img { transition: none; }
}
</style>
