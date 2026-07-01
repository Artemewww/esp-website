<template>
  <div>
    <!-- Hero -->
    <section class="section-padding bg-white">
      <div class="container-custom">
        <span class="inline-block px-4 py-1.5 rounded-full bg-esp-green/10 text-esp-green text-sm font-medium mb-4 font-inter">
          Синергия опыта
        </span>
        <h1 class="font-rounded text-5xl md:text-6xl mb-6 text-esp-black">
          Команда ESP
        </h1>
        <p class="text-xl text-esp-black/80 max-w-3xl mb-8">
          100+ инженеров и специалистов с опытом 25+ лет. Поколения знаний: от основателя к современным экспертам в очистке воды.
        </p>
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
            <div class="text-4xl md:text-5xl font-rounded font-bold text-esp-blue mb-2">25+</div>
            <p class="text-esp-black/60 text-sm">Лет опыта</p>
          </div>
          <div>
            <div class="text-4xl md:text-5xl font-rounded font-bold text-esp-blue mb-2">150+</div>
            <p class="text-esp-black/60 text-sm">Проектов реализовано</p>
          </div>
          <div>
            <div class="text-4xl md:text-5xl font-rounded font-bold text-esp-blue mb-2">3</div>
            <p class="text-esp-black/60 text-sm">Поколения инженеров</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Наши эксперты -->
    <section id="experts" class="section-padding bg-white">
      <div class="container-custom">
        <div class="text-center mb-14">
          <span class="inline-block px-4 py-1.5 rounded-full bg-esp-blue/10 text-esp-blue text-sm font-medium mb-4 font-inter">
            Наши эксперты
          </span>
          <h2 class="font-rounded text-3xl md:text-4xl mb-4 text-esp-black">Инженерный «Мозг» ESP</h2>
          <p class="text-lg text-esp-black/70 max-w-2xl mx-auto">Лидерство, подтверждённое 25-летним опытом</p>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div v-for="ex in expertsList" :key="ex.slug" class="bg-esp-gray p-6">
            <div class="w-14 h-14 rounded-full bg-esp-blue text-white flex items-center justify-center font-rounded font-bold text-lg mb-4">
              {{ ex.name.split(' ').map(w => w[0]).join('') }}
            </div>
            <h3 class="font-rounded text-lg font-semibold text-esp-black mb-1">{{ ex.name }}</h3>
            <p class="text-esp-blue text-sm font-medium mb-4">{{ ex.role }}</p>
            <p class="text-esp-black/70 text-sm italic mb-5">{{ ex.philosophy }}</p>
            <NuxtLink :to="`/team/${ex.slug}`" class="text-esp-blue text-sm font-medium hover:underline">Подробный профиль и биография →</NuxtLink>
          </div>
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
              <svg class="w-7 h-7 text-esp-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24" v-html="dept.icon"></svg>
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
                  <svg class="w-5 h-5 text-esp-green" fill="none" stroke="currentColor" viewBox="0 0 24 24" v-html="value.icon"></svg>
                </div>
                <div>
                  <h4 class="font-rounded font-semibold text-esp-black mb-1">{{ value.title }}</h4>
                  <p class="text-esp-black/70 text-sm">{{ value.text }}</p>
                </div>
              </div>
            </div>
          </div>
          <div class="mt-12 lg:mt-0 bg-esp-gray p-12 rounded-lg">
            <p class="text-lg text-esp-black mb-6">
              "Мы строим бизнес на двух столпах: опыт отца-основателя и технологии сына. Результат — премиальный партнёр для систем очистки мирового уровня."
            </p>
            <div class="flex items-center gap-3">
              <div class="w-12 h-12 bg-esp-blue rounded-full flex items-center justify-center text-white font-bold">ЭС</div>
              <div>
                <p class="font-rounded font-semibold text-esp-black text-sm">Управляющий директор ESP</p>
                <p class="text-esp-black/60 text-xs">25 лет в отрасли очистки воды</p>
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
import { ref } from 'vue'
import { expertsList } from '~/composables/useExperts'

useHead({
  title: 'Команда ESP | 100+ инженеров с 25-летним опытом в очистке воды',
  meta: [
    {
      name: 'description',
      content: 'Команда EcoServiceProject: 100+ профессионалов, 25+ лет опыта, три поколения инженеров. Структура: проектирование, производство, инжиниринг, поддержка.'
    }
  ]
})

const departments = [
  {
    id: 1,
    icon: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 11h.01M12 11h.01M15 11h.01M4 7h16M4 11h4m-4 4h4"/>',
    title: 'Проектирование и Инжиниринг',
    desc: '3D-моделирование, BIM-разработка, LiDAR-сканирование, гидравлические расчеты',
    team: '25+ инженеров'
  },
  {
    id: 2,
    icon: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 21h18M5 21V9l5-4 5 4v12M9 21v-6h4v6M5 9l-2 2m18-2l2 2"/>',
    title: 'Производство',
    desc: 'Производство оборудования, контроль качества, сборка, испытания',
    team: '30+ производственников'
  },
  {
    id: 3,
    icon: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.75 3v4.5L4.5 18a2 2 0 001.8 2.9h11.4a2 2 0 001.8-2.9L14.25 7.5V3M9 3h6"/>',
    title: 'Лабораторные исследования',
    desc: 'Анализ качества воды, тестирование технологий, разработка инноваций',
    team: '10+ специалистов'
  },
  {
    id: 4,
    icon: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/><circle cx="12" cy="12" r="3" stroke-width="2"/>',
    title: 'Монтаж и Пусконаладка',
    desc: 'Выезды на объекты, монтаж оборудования, обучение операторов',
    team: '20+ мастеров'
  },
  {
    id: 5,
    icon: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8a9 9 0 0118 0M3 8v8a2 2 0 002 2h1v-7H4a1 1 0 00-1 1zM21 8v8a2 2 0 01-2 2h-1v-7h2a1 1 0 011 1z"/>',
    title: 'Техническая Поддержка',
    desc: '24/7 горячая линия, консультации, диагностика, удалённая помощь',
    team: '15+ диспетчеров'
  },
  {
    id: 6,
    icon: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 17v-6m4 6V7m4 10v-3M5 21h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v14a2 2 0 002 2z"/>',
    title: 'Администрация и Управление',
    desc: 'Стратегия, финансы, логистика, управление проектами',
    team: '5+ менеджеров'
  }
]

const cultureValues = [
  {
    icon: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/>',
    title: 'Совершенство в каждой детали',
    text: 'Мы не останавливаемся на "хорошо". Только "Эталон качества".'
  },
  {
    icon: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a4 4 0 00-3-3.87M9 20H4v-2a4 4 0 013-3.87m6-1.13a4 4 0 10-4-4 4 4 0 004 4zm6 0a4 4 0 10-1-7.87"/>',
    title: 'Партнёрство как образ жизни',
    text: 'Мы работаем вместе с клиентом, а не для клиента. Ваш успех — наш успех.'
  },
  {
    icon: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 18h6m-5 3h4m-2-19a7 7 0 00-4 12.74V17a1 1 0 001 1h6a1 1 0 001-1v-2.26A7 7 0 0012 2z"/>',
    title: 'Инновации как необходимость',
    text: 'LiDAR, 3D, IoT — мы в авангарде цифровизации индустрии.'
  },
  {
    icon: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 2C8 6 5 9.5 5 14a7 7 0 0014 0c0-4.5-3-8-7-12z"/>',
    title: 'Ответственность перед природой',
    text: 'Каждый проект — это забота о чистоте воды на Земле.'
  }
]

const vacancies = [
  { slug: 'bim-revit-engineer', title: 'Инженер-проектировщик (BIM/Revit)', dept: 'Проектирование', location: 'Минск', type: 'Полная занятость' },
  { slug: 'plc-scada-engineer', title: 'Инженер по автоматизации (ПЛК, SCADA)', dept: 'Производство', location: 'Минск', type: 'Полная занятость' },
  { slug: 'water-treatment-technologist', title: 'Технолог водоочистки', dept: 'Лаборатория', location: 'Минск', type: 'Полная занятость' },
  { slug: 'commissioning-engineer', title: 'Инженер пусконаладочных работ', dept: 'Монтаж и ПНР', location: 'Разъездная работа по РБ', type: 'Полная занятость' },
  { slug: 'designer-relations-manager', title: 'Менеджер по работе с проектировщиками', dept: 'Продажи', location: 'Минск', type: 'Полная занятость' }
]

const applyForm = ref({ name: '', email: '', phone: '', position: '', message: '', resume: null })

const internshipTracks = [
  { title: 'Для студентов', content: 'Дипломные проекты: возможность написания научно-практических работ на основе действующих технологических карт ESP с последующим трудоустройством.' },
  { title: 'Внутреннее обучение', content: 'Курсы и сертификаты: аттестационная платформа по AutoCAD/Revit, КИПиА-сетям и основам гидродинамической фильтрации.' },
  { title: 'Партнёрства с вузами', content: 'БНТУ, БГУИР и лаб-базы: регулярная интеграция проектной практики с ведущими техническими кафедрами, совместные исследования.' }
]
const applySent = ref(false)
</script>
