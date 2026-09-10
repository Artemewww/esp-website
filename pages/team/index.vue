<template>
  <div>
    <!-- Hero -->
    <PageHero
      kicker="Синергия опыта"
      title="Команда ESP"
      lede="100+ инженеров и специалистов с опытом 28 лет. Поколения знаний: от основателя к современным экспертам в очистке воды."
    />

    <section class="py-12 bg-white">
      <div class="container-custom">
</div>
      <!-- Живой кадр вместо постановочного фото: как команда работает за
           экранами, у доски и за общим столом. Немой луп — чтобы автозапуск
           не блокировался браузером и ролик не спорил со звуком страницы. -->
      <div class="container-custom mt-4">
        <div class="team-film">
          <video
            autoplay
            muted
            loop
            playsinline
            preload="metadata"
            poster="/images/team/office-poster.jpg"
            class="team-film-video"
            aria-label="Инженеры и специалисты ESP за работой в офисе"
          >
            <source src="/videos/team/esp-office.mp4" type="video/mp4" />
          </video>
          <div class="team-film-scrim" aria-hidden="true"></div>
          
        </div>
      </div>
    </section>


    <!-- Team Stats -->
    <section class="py-12 bg-white border-y border-esp-gray">
      <div class="container-custom">
        <div class="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div>
            <div class="text-4xl md:text-5xl font-rounded font-bold text-esp-blue mb-2">100+</div>
            <p class="text-esp-black/60 text-sm">Специалистов</p>
          </div>
          <div>
            <div class="text-4xl md:text-5xl font-rounded font-bold text-esp-blue mb-2">28</div>
            <p class="text-esp-black/60 text-sm">Лет опыта</p>
          </div>
          <div>
            <div class="text-4xl md:text-5xl font-rounded font-bold text-esp-blue mb-2">2000+</div>
            <p class="text-esp-black/60 text-sm">Проектов реализовано</p>
          </div>
          <div>
            <div class="text-4xl md:text-5xl font-rounded font-bold text-esp-blue mb-2">3</div>
            <p class="text-esp-black/60 text-sm">Поколения инженеров</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Наши эксперты — Apple Leadership-style grid -->
    <section id="experts" class="py-20 md:py-28 bg-white">
      <div class="container-custom">
        <div class="mb-10">
          <span class="block text-esp-blue text-sm font-medium tracking-wide mb-3 font-inter">Руководство и специалисты</span>
          <h2 class="font-rounded text-4xl md:text-6xl text-esp-black leading-tight max-w-3xl">Инженерная команда ESP</h2>
        </div>

        <div class="flex flex-wrap gap-2 mb-14">
          <button
            @click="activeDept = null"
            class="px-4 py-2 text-sm font-medium transition"
            :class="activeDept === null ? 'bg-esp-blue text-white' : 'bg-esp-gray text-esp-black hover:bg-esp-gray/70'"
          >
            Все подразделения
          </button>
          <button
            v-for="d in expertDepartments"
            :key="d"
            @click="activeDept = d"
            class="px-4 py-2 text-sm font-medium transition"
            :class="activeDept === d ? 'bg-esp-blue text-white' : 'bg-esp-gray text-esp-black hover:bg-esp-gray/70'"
          >
            {{ d }}
          </button>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-14">
          <NuxtLink
            v-for="ex in filteredExperts"
            :key="ex.slug"
            :to="`/team/${ex.slug}`"
            class="group block"
          >
            <div class="aspect-[4/5] bg-esp-gray overflow-hidden mb-5">
              <img
                :src="ex.photo"
                :alt="ex.name"
                :style="{ objectPosition: `center ${ex.facePosition || '25%'}` }"
                class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
              />
            </div>
            <h3 class="font-rounded text-xl text-esp-black leading-snug group-hover:text-esp-blue transition-colors">{{ ex.name }}</h3>
            <p class="text-esp-black/50 text-sm mt-1">{{ ex.role }}</p>
            <p class="text-esp-blue/70 text-xs mt-1 font-inter">{{ ex.department }}</p>
          </NuxtLink>
        </div>
      </div>
    </section>

    <!-- Departments -->
    <section id="departments" class="section-padding bg-esp-gray">
      <div class="container-custom">
        <div class="text-center mb-14">
          <h2 class="font-rounded text-3xl md:text-4xl mb-4 text-esp-black">Структура команды</h2>
          <p class="text-lg text-esp-black/70 max-w-2xl mx-auto">
            Каждый отдел ESP отвечает за экселленс в своей области
          </p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div v-for="dept in departments" :key="dept.id" class="bg-white p-8 hover:shadow-lg transition-all">
            <div class="w-14 h-14 bg-esp-blue/10 flex items-center justify-center mb-5">
              <svg class="w-7 h-7 text-esp-blue" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24" v-html="dept.icon"></svg>
            </div>
            <h3 class="font-rounded text-xl font-semibold mb-2 text-esp-black">{{ dept.title }}</h3>
            <p class="text-esp-black/70 text-sm mb-4">{{ dept.desc }}</p>
            <p class="text-sm font-medium text-esp-green">{{ dept.team }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Culture -->
    <section id="culture" class="section-padding bg-white">
      <div class="container-custom">
        <div class="lg:grid lg:grid-cols-2 lg:gap-12 lg:items-center">
          <div>
            <h2 class="font-rounded text-3xl md:text-4xl mb-6 text-esp-black">Культура ESP</h2>
            <div class="space-y-6">
              <div v-for="value in cultureValues" :key="value.title" class="flex gap-4">
                <div class="w-11 h-11 bg-esp-green/10 flex items-center justify-center flex-shrink-0">
                  <svg class="w-5 h-5 text-esp-green" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24" v-html="value.icon"></svg>
                </div>
                <div>
                  <h4 class="font-rounded font-semibold text-esp-black mb-1">{{ value.title }}</h4>
                  <p class="text-esp-black/70 text-sm">{{ value.text }}</p>
                </div>
              </div>
            </div>
          </div>
          <div class="mt-12 lg:mt-0">
            <img src="/images/team/team-collaboration.jpg" alt="Инженеры ESP за обсуждением проекта" class="w-full aspect-[4/3] object-cover mb-6" />
            <div class="bg-esp-gray p-8">
              <p class="text-lg text-esp-black mb-6">
                "Мы держимся на двух вещах: инженерном расчёте и собственном производстве. Проект, оборудование и пусконаладка — в одних руках, поэтому за результат отвечаем целиком."
              </p>
              <div class="flex items-center gap-3">
                <img src="/images/team/alek-gromak-top.png" alt="Алексей Громак" class="w-12 h-12 rounded-full object-cover object-center" />
                <div>
                  <p class="font-rounded font-semibold text-esp-black text-sm">Генеральный директор ESP</p>
                  <p class="text-esp-black/60 text-xs">28 лет в отрасли очистки воды</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Vacancies -->
    <section id="vacancies" class="section-padding bg-esp-gray">
      <div class="container-custom">
        <div class="text-center mb-14">
          <span class="inline-block px-4 py-1.5 rounded-full bg-esp-blue/10 text-esp-blue text-sm font-medium mb-4 font-inter">
            Карьера в ESP
          </span>
          <h2 class="font-rounded text-3xl md:text-4xl mb-4 text-esp-black">Открытые вакансии</h2>
          <p class="text-lg text-esp-black/70 max-w-2xl mx-auto">
            Мы растём — присоединяйтесь к команде, которая строит экосистемы чистой воды
          </p>
        </div>

        <div class="bg-white divide-y divide-esp-gray">
          <div v-for="vac in vacancies" :key="vac.title" class="flex flex-col md:flex-row md:items-center gap-3 md:gap-6 px-6 py-5 hover:bg-esp-gray/50 transition-colors">
            <div class="flex-1">
              <NuxtLink :to="`/team/vacancies/${vac.slug}`" class="font-rounded font-semibold text-esp-black hover:text-esp-blue">{{ vac.title }}</NuxtLink>
              <p class="text-esp-black/60 text-sm">{{ vac.dept }} · {{ vac.location }}</p>
            </div>
            <span class="text-xs px-3 py-1 bg-esp-green/10 text-esp-green font-medium w-fit">{{ vac.type }}</span>
            <NuxtLink :to="`/team/vacancies/${vac.slug}`" class="text-esp-blue text-sm font-medium hover:underline whitespace-nowrap">Подробнее →</NuxtLink>
          </div>
        </div>

        <p class="text-esp-black/50 text-sm text-center mt-8 max-w-xl mx-auto">
          Если сейчас нет подходящей открытой позиции — отправьте резюме через форму ниже, мы будем иметь вас в виду, когда появится подходящая вакансия.
        </p>
      </div>
    </section>

    <!-- Internship -->
    <section id="internship" class="section-padding bg-white">
      <div class="container-custom">
        <div class="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <span class="inline-block px-4 py-1.5 rounded-full bg-esp-green/10 text-esp-green text-sm font-medium mb-4 font-inter">
              Для студентов
            </span>
            <h2 class="font-rounded text-3xl md:text-4xl mb-6 text-esp-black">Программа стажировок ESP</h2>
            <p class="text-esp-black/70 text-lg mb-6">
              3-месячная оплачиваемая стажировка для студентов технических специальностей: инженерия водоочистки, проектирование, автоматизация.
            </p>
            <ul class="space-y-3 text-sm text-esp-black/70">
              <li class="flex gap-2"><span class="text-esp-green font-bold">✓</span>Наставник из числа ведущих инженеров ESP</li>
              <li class="flex gap-2"><span class="text-esp-green font-bold">✓</span>Работа над реальными проектами</li>
              <li class="flex gap-2"><span class="text-esp-green font-bold">✓</span>Возможность трудоустройства по итогам</li>
            </ul>
          </div>
          <div class="bg-esp-gray p-8">
            <p class="text-esp-black mb-4 font-medium">Ближайший набор:</p>
            <p class="text-esp-black/70 text-sm mb-6">Приём заявок на летнюю стажировку 2026 открыт. Направления: проектирование и BIM, производство оборудования, автоматизация и IoT.</p>
            <a href="#apply" class="btn-primary inline-block">Подать заявку на стажировку</a>
          </div>
        </div>

        <div class="mt-16">
          <Timeline :items="internshipTracks" />
        </div>
      </div>
    </section>

    <!-- Apply form -->
    <section id="apply" class="section-padding bg-esp-gray">
      <div class="container-custom max-w-2xl">
        <div class="text-center mb-10">
          <h2 class="font-rounded text-3xl md:text-4xl mb-4 text-esp-black">Отправить отклик</h2>
          <p class="text-esp-black/70">Заполните форму — HR-отдел ESP свяжется с вами в течение 3 рабочих дней</p>
        </div>

        <form @submit.prevent="applySent = true" class="bg-white p-8 space-y-4" v-if="!applySent">
          <input v-model="applyForm.name" required type="text" placeholder="Ваше имя" class="w-full px-4 py-3 border border-esp-gray focus:border-esp-blue outline-none font-inter" />
          <input v-model="applyForm.email" required type="email" placeholder="E-mail" class="w-full px-4 py-3 border border-esp-gray focus:border-esp-blue outline-none font-inter" />
          <input v-model="applyForm.phone" type="tel" placeholder="Телефон" class="w-full px-4 py-3 border border-esp-gray focus:border-esp-blue outline-none font-inter" />
          <FileUpload accept=".pdf,.doc,.docx" hint="Резюме: PDF, DOC, DOCX до 10МБ" @change="applyForm.resume = $event" />
          <select v-model="applyForm.position" class="w-full px-4 py-3 border border-esp-gray focus:border-esp-blue outline-none font-inter text-esp-black">
            <option value="">Выберите вакансию или стажировку</option>
            <option v-for="vac in vacancies" :key="vac.title" :value="vac.title">{{ vac.title }}</option>
            <option value="Стажировка">Стажировка</option>
          </select>
          <textarea v-model="applyForm.message" rows="4" placeholder="Сопроводительное письмо" class="w-full px-4 py-3 border border-esp-gray focus:border-esp-blue outline-none font-inter resize-none"></textarea>
          <button type="submit" class="w-full btn-primary">Отправить отклик</button>
        </form>

        <div v-else class="bg-white p-10 text-center">
          <div class="w-16 h-16 bg-esp-green/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg class="w-8 h-8 text-esp-green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
            </svg>
          </div>
          <h3 class="font-rounded text-xl font-semibold mb-2 text-esp-black">Отклик отправлен</h3>
          <p class="text-esp-black/60 text-sm">HR-отдел ESP свяжется с вами в течение 3 рабочих дней.</p>
        </div>
      </div>
    </section>

    <!-- CTA -->
    <section class="section-padding text-white text-center" style="background: linear-gradient(135deg, #002366 0%, #000f33 100%)">
      <div class="container-custom max-w-4xl">
        <h2 class="font-rounded text-3xl md:text-4xl mb-6">Присоединитесь к команде инноваторов</h2>
        <p class="text-lg mb-10 text-white/90 max-w-2xl mx-auto">
          ESP ищет талантливых инженеров, проектировщиков и специалистов, которые разделяют нашу страсть к совершенству.
        </p>
        <a href="#apply" class="border-2 border-white text-white px-8 py-4 font-medium hover:bg-white hover:text-esp-blue transition inline-block">
          Отправить резюме
        </a>
      </div>
    </section>
  </div>
</template>

<script setup>
import { vacanciesList } from '~/composables/useVacancies'
import { ref, computed } from 'vue'
import { expertsList } from '~/composables/useExperts'

const activeDept = ref(null)
const experts = useEditableList('team', expertsList)
const expertDepartments = computed(() => [...new Set(experts.value.map(e => e.department))])
const filteredExperts = computed(() => activeDept.value ? experts.value.filter(e => e.department === activeDept.value) : experts.value)

useHead({
  title: 'Команда ESP | 100+ инженеров с 28-летним опытом в очистке воды',
  meta: [
    {
      name: 'description',
      content: 'Команда EcoServiceProject: 100+ профессионалов, 28 лет опыта, три поколения инженеров. Структура: проектирование, производство, инжиниринг, поддержка.'
    },
    { property: 'og:title', content: 'Команда ESP | Инженеры и руководство' },
    { property: 'og:description', content: '100+ специалистов, 28 лет опыта, три поколения инженеров очистки воды.' },
    { property: 'og:image', content: 'https://ecoservisproekt.com/images/team/team-hero-1.png' }
  ],
  link: [{ rel: 'canonical', href: 'https://ecoservisproekt.com/team' }]
})

const departments = [
  {
    id: 1,
    icon: '<path d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125"/>',
    title: 'Проектирование и Инжиниринг',
    desc: '3D-моделирование, BIM-разработка, LiDAR-сканирование, гидравлические расчеты',
    team: '25+ инженеров'
  },
  {
    id: 2,
    icon: '<path d="M3 21h18M5 21V7l8-4v18M19 21V11l-6-4M9 9v.01M9 13v.01M9 17v.01"/>',
    title: 'Производство',
    desc: 'Производство оборудования, контроль качества, сборка, испытания',
    team: '30+ производственников'
  },
  {
    id: 3,
    icon: '<path d="M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082M19.8 15.3l-1.57.393A9.065 9.065 0 0112 15a9.065 9.065 0 00-6.23.693L5 14.5m14.8.8l1.402 1.402c1.232 1.232.65 3.318-1.067 3.611A48.309 48.309 0 0112 21c-2.773 0-5.491-.235-8.135-.687-1.718-.293-2.3-2.379-1.067-3.61L5 14.5"/>',
    title: 'Лабораторные исследования',
    desc: 'Анализ качества воды, тестирование технологий, разработка инноваций',
    team: '10+ специалистов'
  },
  {
    id: 4,
    icon: '<path d="M21.75 6.75a4.5 4.5 0 01-5.7 4.432l-3.29 3.29a1 1 0 00-.24.376l-.84 2.52a1 1 0 01-1.38.56l-1.68-.84a1 1 0 00-1.04.06l-3.29 3.29m0 0a4.5 4.5 0 101.67-6.68l1.63 1.63a4.5 4.5 0 00-3.3-2.06l-1.7 1.7M21.75 6.75a4.5 4.5 0 00-6.68-1.67l-3.29 3.29"/>',
    title: 'Монтаж и Пусконаладка',
    desc: 'Выезды на объекты, монтаж оборудования, обучение операторов',
    team: '20+ мастеров'
  },
  {
    id: 5,
    icon: '<path d="M3 14v-3a9 9 0 0118 0v3M5 14h3v7H7a2 2 0 01-2-2v-5zm11 0h3v5a2 2 0 01-2 2h-1v-7z"/>',
    title: 'Техническая Поддержка',
    desc: '24/7 горячая линия, консультации, диагностика, удалённая помощь',
    team: '15+ диспетчеров'
  },
  {
    id: 6,
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


const applyForm = ref({ name: '', email: '', phone: '', position: '', message: '', resume: null })

const internshipTracks = [
  { title: 'Для студентов', content: 'Дипломные проекты: возможность написания научно-практических работ на основе действующих технологических карт ESP с последующим трудоустройством.' },
  { title: 'Внутреннее обучение', content: 'Курсы и сертификаты: аттестационная платформа по AutoCAD/Revit, КИПиА-сетям и основам гидродинамической фильтрации.' },
  { title: 'Партнёрства с вузами', content: 'БНТУ, БГУИР и лаб-базы: регулярная интеграция проектной практики с ведущими техническими кафедрами, совместные исследования.' }
]
const applySent = ref(false)
</script>

<style scoped>
/* Ролик команды: кадр 16:8, как было у постановочного фото, чтобы блок
   не «прыгал» по высоте относительно остальной страницы. */
.team-film {
  position: relative;
  aspect-ratio: 16 / 8;
  overflow: hidden;
  background: #0b0e13;
}
.team-film-video {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}
.team-film-scrim {
  position: absolute;
  inset: 0;
  background: linear-gradient(to top, rgba(10, 13, 18, 0.72) 0%, rgba(10, 13, 18, 0) 38%);
  pointer-events: none;
}
.team-film-caption {
  position: absolute;
  left: clamp(1rem, 3vw, 2.25rem);
  bottom: clamp(0.9rem, 3vh, 1.75rem);
  display: flex;
  align-items: center;
  gap: 0.6rem;
  font-size: clamp(0.8rem, 1.1vw, 0.95rem);
  color: rgba(255, 255, 255, 0.9);
  text-shadow: 0 1px 12px rgba(0, 0, 0, 0.5);
}
.team-film-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #00d4ff;
  box-shadow: 0 0 0 4px rgba(0, 212, 255, 0.2);
}
</style>
