<template>
  <!-- Команда в подаче DJI × Apple. Личные карточки с ФИО и фото сняты:
       показываем коллектив целиком и то, как он работает, на реальных кадрах ESP. -->
  <div ref="root" class="dj tm">
    <DjPageHero
      eyebrow="Команда"
      title="Команда: от проекта до реализации"
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
        <h2 class="dj-h2 tm-h2">Как работает инженерная команда ESP</h2>
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
        <h2 class="dj-h2">Структура команды</h2>
        <p class="dj-lede tm-lede">Каждый отдел ESP отвечает за свою область работ</p>
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
          <h2 class="dj-h2">Культура ESP</h2>
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
            <h2 class="dj-h2 tm-h2">Открытые вакансии</h2>
          </div>
          <NuxtLink to="/career" class="dj-more">Работа в ESP</NuxtLink>
        </div>
        <p class="dj-lede tm-lede dj-reveal">Мы расширяем команду. Присоединяйтесь к специалистам, которые проектируют и строят очистные сооружения.</p>
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
        <p class="tm-note">Если подходящей вакансии нет, отправьте резюме через форму ниже: мы свяжемся с вами, когда появится позиция.</p>
      </div>
    </section>

    <section id="internship" class="dj-sec dj-sec--soft tm-anchor">
      <div class="dj-wrap dj-center dj-reveal">
        <span class="dj-eyebrow">Для студентов</span>
        <h2 class="dj-h2 tm-h2">Программа стажировок ESP</h2>
        <p class="dj-lede tm-lede">Трёхмесячная оплачиваемая стажировка для студентов технических специальностей: инженерия водоочистки, проектирование, автоматизация.</p>
      </div>
      <div class="tm-intern">
        <ul class="tm-card tm-checks dj-reveal">
          <li>Наставник из числа ведущих инженеров ESP</li>
          <li>Работа над реальными проектами</li>
          <li>Возможность трудоустройства по итогам</li>
        </ul>
        <div class="tm-card dj-reveal">
          <b class="tm-h3">Ближайший набор:</b>
          <p class="tm-text">Приём заявок на летнюю стажировку 2026 открыт. Направления: проектирование и BIM, производство оборудования, автоматизация и телеметрия.</p>
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
          <button type="submit" class="dj-btn dj-btn--lg tm-submit" :disabled="applyLead.sending.value">{{ applyLead.sending.value ? 'Отправка…' : 'Отправить отклик' }}</button>
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
  { src: '/images/team/real/planning.webp', title: 'Обсуждаем проект', text: 'Совещание проектного отдела: задача заказчика, состав стоков, сроки.', alt: 'Планёрка инженеров ESP за круглым столом' },
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
    title: 'Проектирование и инжиниринг',
    desc: '3D-моделирование, BIM-разработка, LiDAR-сканирование, гидравлические расчёты',
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
    desc: 'Анализ качества воды, тестирование технологий, разработка решений',
    team: '10+ специалистов'
  },
  {
    id: 4,
    glyph: 'pipe',
    title: 'Монтаж и пусконаладка',
    desc: 'Выезды на объекты, монтаж оборудования, обучение операторов',
    team: '20+ мастеров'
  },
  {
    id: 5,
    glyph: 'headset',
    title: 'Техническая поддержка',
    desc: 'Круглосуточная горячая линия, консультации, диагностика, удалённая помощь',
    team: '15+ диспетчеров'
  },
  {
    id: 6,
    glyph: 'shield',
    title: 'Администрация и управление',
    desc: 'Стратегия, финансы, логистика, управление проектами',
    team: '5+ менеджеров'
  }
]

const cultureValues = [
  {
    glyph: 'shieldcheck',
    title: 'Точность в деталях',
    text: 'Мы не останавливаемся на «достаточно хорошо»: проверяем каждый этап работ.'
  },
  {
    glyph: 'users',
    title: 'Партнёрство с заказчиком',
    text: 'Мы работаем вместе с заказчиком над результатом объекта.'
  },
  {
    glyph: 'bulb',
    title: 'Цифровые технологии в работе',
    text: 'LiDAR, 3D-моделирование и телеметрия — часть нашей работы.'
  },
  {
    glyph: 'leaf',
    title: 'Ответственность перед природой',
    text: 'Каждый проект направлен на снижение нагрузки на водные объекты.'
  }
]

const vacancies = useEditableList('vacancies', vacanciesList)


const applyForm = ref({ name: '', email: '', phone: '', position: '', message: '', resume: null, consent: false })

const internshipTracks = [
  { title: 'Для студентов', content: 'Дипломные проекты: возможность написания научно-практических работ на основе действующих технологических карт ESP с последующим трудоустройством.' },
  { title: 'Внутреннее обучение', content: 'Курсы и сертификаты: аттестационная платформа по AutoCAD/Revit, КИПиА-сетям и основам гидродинамической фильтрации.' },
  { title: 'Партнёрства с вузами', content: 'БНТУ, БГУИР и лабораторные базы: регулярная интеграция проектной практики с ведущими техническими кафедрами, совместные исследования.' }
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
/* Apple Leadership / Careers: общий кадр, цифры, галерея «highlights»,
   карточки #f5f5f7 со скруглением, вакансии строками, поля apple.com. */
.tm-anchor { scroll-margin-top: 120px; }
.tm-h2 { margin-top: 8px; }
.tm-lede { margin-top: 14px; max-width: 40em; color: #6e6e73; }
.dj-sec--dark .tm-lede { color: #86868b; }
.tm-h3 { display: block; font-size: clamp(21px, 1.8vw, 24px); line-height: 1.17; font-weight: 600; color: var(--dj-ink); letter-spacing: 0.009em; }
.tm-text { font-size: 17px; line-height: 1.47; letter-spacing: -0.022em; color: #6e6e73; }
.tm-narrow { max-width: 692px; margin: 0 auto; padding: 0 24px; }

/* Общий кадр — во всю ширину с отступом 12px */
.tm-group { margin: 0; padding: 0 12px; }
.tm-group img { display: block; width: 100%; height: auto; aspect-ratio: 2400 / 1230; object-fit: cover; border-radius: 28px; background: #f5f5f7; }
.tm-group figcaption { max-width: 40em; margin: 20px auto 0; padding: 0 24px; text-align: center; font-size: 14px; line-height: 1.43; letter-spacing: -0.016em; color: #6e6e73; }
.tm :deep(.dsn) { margin-top: clamp(40px, 5vw, 64px); }

.tm-stats { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 24px; list-style: none; margin: 0; padding: 0; }
.tm-stats li { display: grid; gap: 8px; text-align: center; }
.tm-stats b { font-size: clamp(40px, 5vw, 64px); line-height: 1.05; font-weight: 600; letter-spacing: -0.009em; color: var(--dj-ink); font-variant-numeric: tabular-nums; }
.tm-stats span { font-size: 17px; letter-spacing: -0.022em; color: #6e6e73; }

/* Галерея кадров «Get the highlights»: отступ слева по сетке, края в край экрана */
.tm-track {
  --tm-pad: max(22px, calc((100% - 1024px) / 2 + 22px));
  display: grid;
  grid-auto-flow: column;
  grid-auto-columns: clamp(280px, 30vw, 400px);
  column-gap: 20px;
  margin-top: clamp(36px, 4vw, 56px);
  overflow-x: auto;
  overscroll-behavior-x: contain;
  scroll-snap-type: x mandatory;
  padding: 0 var(--tm-pad) 8px;
  scroll-padding-left: var(--tm-pad);
  scrollbar-width: none;
}
.tm-track::-webkit-scrollbar { display: none; }
.tm-shot { scroll-snap-align: start; display: flex; flex-direction: column; margin: 0; }
.tm-shot-img { aspect-ratio: 4 / 5; overflow: hidden; border-radius: 28px; background: #e8e8ed; }
.tm-shot-img img { width: 100%; height: 100%; object-fit: cover; transition: transform 1.2s var(--dj-ease); }
.tm-shot:hover .tm-shot-img img { transform: scale(1.035); }
.tm-shot figcaption { display: grid; gap: 6px; margin-top: 20px; padding-right: 12px; }
.tm-idx { font-size: 14px; font-weight: 600; letter-spacing: -0.016em; color: var(--dj-blue); font-variant-numeric: tabular-nums; }

/* Отделы — карточки */
.tm-tiles { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 20px; max-width: 1200px; margin: clamp(36px, 4vw, 56px) auto 0; padding: 0 24px; }
.tm-tile { display: flex; flex-direction: column; align-items: flex-start; gap: 10px; min-height: 280px; padding: clamp(28px, 3vw, 40px); border-radius: 28px; background: #f5f5f7; }
.tm-ico { width: 36px; height: 36px; margin-bottom: 12px; color: var(--dj-ink); }
.tm-count { margin-top: auto; padding-top: 16px; font-size: 14px; font-weight: 600; letter-spacing: -0.016em; color: var(--dj-ink); }

/* Культура на тёмном */
.tm-culture { display: grid; grid-template-columns: minmax(0, 1fr) minmax(0, 1fr); gap: clamp(32px, 5vw, 80px); align-items: start; }
.tm-values { display: grid; gap: 32px; margin: 40px 0 0; list-style: none; padding: 0; }
.tm-values li { display: grid; grid-template-columns: 28px 1fr; gap: 18px; }
.tm-vico { width: 28px; height: 28px; color: #f5f5f7; }
.tm-values b { display: block; margin-bottom: 4px; font-size: 21px; line-height: 1.19; letter-spacing: 0.011em; font-weight: 600; color: #f5f5f7; }
.tm-values span { font-size: 17px; line-height: 1.47; letter-spacing: -0.022em; color: #86868b; }
.tm-culture-img { margin: 0; }
.tm-culture-img img { display: block; width: 100%; aspect-ratio: 4 / 3; object-fit: cover; border-radius: 28px; }
.tm-quote { margin: 20px 0 0; padding: clamp(28px, 3vw, 40px); border-radius: 28px; background: #1d1d1f; }
.tm-quote p { font-size: clamp(19px, 1.6vw, 24px); line-height: 1.33; letter-spacing: 0.009em; font-weight: 600; color: #f5f5f7; }
.tm-quote span { display: block; margin-top: 16px; font-size: 14px; letter-spacing: -0.016em; color: #86868b; }

/* Вакансии строками */
.tm-head { display: flex; align-items: flex-end; justify-content: space-between; gap: 16px 32px; flex-wrap: wrap; }
.tm-head .dj-more { font-size: 17px; }
.tm-rows { margin-top: clamp(32px, 4vw, 48px); border-top: 1px solid #d2d2d7; }
.tm-row { display: grid; grid-template-columns: minmax(0, 1fr) auto auto; align-items: center; gap: 12px 32px; padding: 24px 0; border-bottom: 1px solid #d2d2d7; }
.tm-row:hover .tm-vac b { color: #0066cc; }
.tm-row .dj-more { font-size: 17px; }
.tm-vac { display: grid; gap: 4px; min-width: 0; }
.tm-vac b { font-size: clamp(19px, 1.6vw, 24px); line-height: 1.17; letter-spacing: 0.009em; font-weight: 600; color: var(--dj-ink); transition: color 0.2s ease; }
.tm-vac span { font-size: 14px; letter-spacing: -0.016em; color: #6e6e73; }
.tm-type { font-size: 12px; font-weight: 600; padding: 6px 12px; border-radius: 999px; background: #f5f5f7; color: var(--dj-ink); }
.tm-note { max-width: 40rem; margin-top: 24px; font-size: 14px; line-height: 1.43; letter-spacing: -0.016em; color: #6e6e73; }

/* Стажировки */
.tm-intern { display: grid; grid-template-columns: repeat(6, minmax(0, 1fr)); gap: 20px; max-width: 1200px; margin: clamp(36px, 4vw, 56px) auto 0; padding: 0 24px; }
.tm-card { grid-column: span 3; display: flex; flex-direction: column; align-items: flex-start; gap: 12px; padding: clamp(28px, 3vw, 44px); border-radius: 28px; background: #fff; }
.tm-card--third { grid-column: span 2; }
.tm-card-btn { margin-top: auto; }
.tm-checks { list-style: none; margin: 0; gap: 16px; justify-content: center; }
.tm-checks li { position: relative; padding-left: 30px; font-size: 21px; line-height: 1.19; letter-spacing: 0.011em; font-weight: 600; color: var(--dj-ink); }
.tm-checks li::before { content: ''; position: absolute; left: 4px; top: 0.3em; width: 12px; height: 7px; border-left: 2px solid var(--dj-blue); border-bottom: 2px solid var(--dj-blue); transform: rotate(-45deg); }

/* Форма отклика: поля apple.com */
.tm-form { display: grid; gap: 16px; margin-top: clamp(32px, 4vw, 48px); }
.tm-form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
.tm-input { width: 100%; min-height: 56px; padding: 16px; border: 1px solid #86868b; border-radius: 12px; background: #fff; font: inherit; font-size: 17px; line-height: 1.24; letter-spacing: -0.022em; color: var(--dj-ink); transition: border-color 0.2s ease, box-shadow 0.2s ease; }
.tm-input::placeholder { color: #86868b; }
.tm-input:focus { outline: none; border-color: #0071e3; box-shadow: 0 0 0 4px rgba(0, 113, 227, 0.2); }
select.tm-input { -webkit-appearance: none; appearance: none; padding-right: 44px; background: #fff url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 12 8'%3E%3Cpath d='M1 1.5l5 5 5-5' fill='none' stroke='%2386868b' stroke-width='1.6'/%3E%3C/svg%3E") no-repeat right 18px center / 12px 8px; }
textarea.tm-input { resize: vertical; }
.tm-submit { width: 100%; height: 56px; border-radius: 12px; font-size: 17px; }
.tm-submit:disabled { opacity: 0.6; }
.tm-cta-act { margin-top: 30px; }

@media (max-width: 1023px) {
  .tm-culture { grid-template-columns: minmax(0, 1fr); }
  .tm-tiles { grid-template-columns: 1fr 1fr; }
  .tm-stats { grid-template-columns: 1fr 1fr; row-gap: 40px; }
  .tm-card, .tm-card--third { grid-column: span 3; }
  .tm-card--third:last-child { grid-column: 1 / -1; }
}
@media (max-width: 767px) {
  .tm-group { padding: 0 12px; }
  .tm-group img, .tm-shot-img, .tm-culture-img img, .tm-quote { border-radius: 18px; }
  .tm-tiles, .tm-intern { padding: 0 16px; gap: 12px; }
  .tm-tiles { grid-template-columns: minmax(0, 1fr); }
  .tm-tile, .tm-card { min-height: 0; border-radius: 18px; }
  .tm-intern { grid-template-columns: minmax(0, 1fr); }
  .tm-card, .tm-card--third, .tm-card--third:last-child { grid-column: auto; }
  .tm-checks li { font-size: 19px; }
  .tm-track { grid-auto-columns: 80vw; column-gap: 12px; --tm-pad: 16px; }
  .tm-row { grid-template-columns: minmax(0, 1fr) auto; }
  .tm-type { grid-column: 1; justify-self: start; }
  .tm-row .dj-more { grid-column: 2; grid-row: 1; }
  .tm-form-row { grid-template-columns: minmax(0, 1fr); }
  .tm-narrow { padding: 0 16px; }
  .tm-card-btn { white-space: normal; height: auto; min-height: 40px; padding: 10px 22px; text-align: center; }
}
@media (prefers-reduced-motion: reduce) {
  .tm-shot-img img, .tm-vac b { transition: none; }
}
</style>
