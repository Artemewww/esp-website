<template>
  <div class="ap">
    <!-- Hero -->
    <section class="ap-sec ap-sec--first">
      <div class="ap-wrap">
        <span class="ap-eyebrow">Библиотека знаний</span>
        <h1 class="ap-title">Ресурсы и документы</h1>
        <p class="ap-lede">Техническая документация, ГОСТы, стандарты качества, инструкции, калькуляторы и полезные материалы для проектировщиков.</p>
      </div>
    </section>

    <!-- Downloads Section -->
    <section id="library" class="ap-sec ap-sec--white">
      <div class="ap-wrap">
        <span class="ap-eyebrow">Библиотека проектировщика</span>
        <h2 class="ap-h2">Центр технической документации и BIM-активов</h2>
        <p class="ap-small rs-sub">Опросные листы · Инструкции по монтажу · BIM/CAD файлы по запросу · ISO 9001</p>

        <div class="rs-search">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden="true">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
          </svg>
          <input
            v-model="docSearch"
            type="search"
            placeholder="Найти паспорт, опросный лист, инструкцию..."
            class="ap-input"
          />
        </div>

        <div class="ap-tabs" role="tablist" aria-label="Тип документа">
          <button
            v-for="cat in docCategories"
            :key="cat"
            type="button"
            role="tab"
            :aria-selected="activeDocCategory === cat"
            class="ap-tab"
            :class="{ 'is-on': activeDocCategory === cat }"
            @click="activeDocCategory = cat"
          >{{ cat }}</button>
        </div>

        <div class="ap-rows rs-docs">
          <a
            v-for="doc in filteredDocuments"
            :key="doc.id"
            :href="doc.href"
            target="_blank"
            rel="noopener"
            class="ap-row rs-doc"
          >
            <svg class="rs-doc-ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden="true">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.6" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
            </svg>
            <h3 class="rs-doc-title">{{ doc.title }}</h3>
            <span class="ap-small">{{ doc.category }}</span>
            <span class="ap-link">Скачать ›</span>
          </a>
          <p v-if="!filteredDocuments.length" class="ap-text rs-empty">Документы не найдены</p>
        </div>
      </div>
    </section>

    <!-- Standards & Certifications -->
    <section class="ap-sec">
      <div class="ap-wrap">
        <h2 class="ap-h2">Стандарты и сертификации</h2>
        <p class="ap-lede">Все системы ESP разработаны в соответствии с международными стандартами</p>

        <div class="ap-grid ap-grid--2">
          <div v-for="std in standards" :key="std.id" class="ap-card">
            <span class="ap-pill rs-pill">{{ std.title }}</span>
            <h3 class="ap-h3">{{ std.desc }}</h3>
            <p class="ap-text">{{ std.details }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Tools -->
    <section id="calculator" class="ap-sec ap-sec--white">
      <div class="ap-wrap">
        <h2 class="ap-h2">Онлайн-инструменты</h2>
        <p class="ap-lede">Используйте готовые калькуляторы и генераторы для подбора оборудования</p>

        <div class="ap-grid ap-grid--2">
          <div v-for="tool in tools" :key="tool.id" class="ap-card">
            <svg class="ap-ico" fill="none" stroke="currentColor" viewBox="0 0 24 24" v-html="tool.icon"></svg>
            <h3 class="ap-h3">{{ tool.title }}</h3>
            <p class="ap-text">{{ tool.desc }}</p>
            <div class="ap-card-foot">
              <button type="button" class="ap-btn" @click="toolModalOpen = tool.id">Открыть инструмент</button>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Blog -->
    <section id="blog" class="ap-sec rs-anchor">
      <div class="ap-wrap">
        <span class="ap-eyebrow">Технический блог</span>
        <h2 class="ap-h2">Аналитика и разборы кейсов</h2>

        <div class="ap-grid ap-grid--3">
          <NuxtLink
            v-for="article in articles"
            :key="article.slug"
            :to="`/articles/${article.slug}`"
            class="ap-card"
          >
            <span class="rs-cat">{{ article.category }}</span>
            <h3 class="ap-h3">{{ article.title }}</h3>
            <p class="ap-text rs-clamp">{{ article.excerpt }}</p>
            <div class="ap-card-foot rs-meta">
              <span>{{ article.date }}</span>
              <span>{{ article.readTime }}</span>
            </div>
          </NuxtLink>
        </div>
      </div>
    </section>

    <!-- Readiness Test -->
    <section id="test" class="ap-sec ap-sec--white rs-anchor">
      <div class="ap-wrap ap-wrap--narrow">
        <span class="ap-eyebrow">Аудит соответствия</span>
        <h2 class="ap-h2">Тест готовности объекта к очистке</h2>
        <p class="ap-lede">
          Ответьте на 3 быстрых вопроса, чтобы узнать, соответствуют ли текущие показатели сброса воды нормативно допустимым концентрациям (ПДК).
        </p>

        <div class="rs-quiz">
          <div v-for="(q, i) in readinessQuestions" :key="i" class="ap-card">
            <h4 class="ap-h3 rs-q">{{ i + 1 }}. {{ q.question }}</h4>
            <div v-if="readinessAnswer[i] === undefined" class="rs-answers">
              <button type="button" class="ap-btn" @click="readinessAnswer[i] = true">{{ q.yesLabel }}</button>
              <button type="button" class="ap-btn ap-btn--ghost" @click="readinessAnswer[i] = false">{{ q.noLabel }}</button>
            </div>
            <p v-else class="ap-text" :class="{ 'rs-yes': readinessAnswer[i] }">
              {{ readinessAnswer[i] ? q.yesResult : q.noResult }}
            </p>
          </div>
        </div>

        <div v-if="readinessQuestions.every((_, i) => readinessAnswer[i] !== undefined)" class="ap-card rs-done">
          <p class="ap-text">Спасибо за ответы! Наш инженер подготовит персональные рекомендации по вашему объекту.</p>
          <div><NuxtLink to="/contacts#contact-form" class="ap-btn">Получить рекомендации</NuxtLink></div>
        </div>
      </div>
    </section>

    <!-- Subscribe -->
    <section id="subscribe" class="ap-sec ap-sec--tight">
      <div class="ap-wrap rs-sub-row">
        <div>
          <h2 class="ap-h3">Подписка на новости и блог ESP</h2>
          <p class="ap-text">Статьи об отрасли, новые проекты, технологии — раз в месяц на вашу почту</p>
        </div>
        <form class="rs-sub-form" @submit.prevent="subscribe">
          <input v-if="!subscribed" v-model="subscribeEmail" name="email" autocomplete="email" required type="email" placeholder="Ваш e-mail" class="ap-input" />
          <button v-if="!subscribed" type="submit" class="ap-btn" :disabled="subLead.sending.value">{{ subLead.sending.value ? 'Отправка...' : 'Подписаться' }}</button>
          <LeadConsent v-if="!subscribed" v-model="subConsent" />
          <p v-if="subLead.error.value" role="alert" style="font-size:13px;color:#b42318;margin:0">{{ subLead.error.value }}</p>
          <span v-else class="ap-note-ok">✓ Вы подписаны</span>
        </form>
      </div>
    </section>

    <!-- Tool Modal -->
    <div v-if="toolModalOpen" class="rs-modal">
      <div class="rs-modal__backdrop" @click="toolModalOpen = null"></div>
      <div class="rs-modal__panel">
        <button type="button" class="rs-modal__close" aria-label="Закрыть" @click="toolModalOpen = null">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
        </button>
        <h3 class="ap-h3">{{ tools.find(t => t.id === toolModalOpen)?.title }}</h3>
        <p class="ap-text">Полная версия инструмента доступна на странице «Оборудование». Откройте каталог, чтобы рассчитать и подобрать оборудование под ваш объект.</p>
        <div class="ap-actions"><NuxtLink to="/equipment#tools" class="ap-btn" @click="toolModalOpen = null">Перейти в каталог оборудования</NuxtLink></div>
      </div>
    </div>

    <!-- FAQ -->
    <section id="faq" class="ap-sec ap-sec--white">
      <div class="ap-wrap ap-wrap--narrow">
        <h2 class="ap-h2">Частые вопросы</h2>
        <p class="ap-lede">Ответы на самые распространённые вопросы о системах очистки воды</p>

        <div class="ap-rows">
          <details v-for="(faq, i) in faqs" :key="i" class="ap-row rs-faq">
            <summary>
              {{ faq.q }}
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden="true">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
              </svg>
            </summary>
            <p class="ap-text">{{ faq.a }}</p>
          </details>
        </div>
      </div>
    </section>

    <!-- CTA -->
    <section class="ap-sec ap-cta">
      <div class="ap-wrap">
        <h2 class="ap-h2">Не нашли нужную информацию?</h2>
        <p class="ap-lede">Обратитесь к нашему техническому отделу. Мы подготовим для вас любые документы и расчеты.</p>
        <div class="ap-actions ap-center rs-cta-actions">
          <NuxtLink to="/contacts" class="ap-btn">Связаться с техническим отделом</NuxtLink>
          <NuxtLink to="/contacts#contact-form" class="ap-link">Оставить заявку ›</NuxtLink>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, computed, reactive } from 'vue'
import { articlesList } from '~/composables/useArticles'
const articles = useEditableList('articles', articlesList)

useHead({
  title: 'Ресурсы ESP | Документация, стандарты, калькуляторы, ГОСТы',
  meta: [
    {
      name: 'description',
      content: 'Ресурсы EcoServiceProject: техническая документация, ГОСТы, стандарты ISO, каталоги оборудования, калькуляторы подбора, BIM-библиотека для скачивания.'
    },
    { property: 'og:title', content: 'Ресурсы ESP | Документация и техблог' },
    { property: 'og:description', content: 'Техническая документация, стандарты, калькуляторы подбора и аналитические статьи инженеров ESP.' }
  ],
  link: [{ rel: 'canonical', href: 'https://ecoservisproekt.by/resources' }]
})

const documents = [
  { id: 1, title: 'Станции очистки сточных вод типа ДС — файл для скачивания', href: 'https://ecoservisproekt.com/upload/iblock/fa4/fa470f4784a902a2497d9c3d20ceafae.pdf', category: 'Паспорта' },
  { id: 2, title: 'Станции очистки сточных вод типа ДС — опросный лист', href: 'https://ecoservisproekt.com/upload/iblock/1f2/1f2236add9dda924caa0cebd06733a35.pdf', category: 'Паспорта' },
  { id: 3, title: 'Станции очистки сточных вод типа ВС — файл для скачивания', href: 'https://ecoservisproekt.com/upload/iblock/a06/a061e1daeaf55d5ae573298ef562d82c.pdf', category: 'Паспорта' },
  { id: 4, title: 'Схема расположения модулей ВС35 – ВС500 (план, разрез)', href: 'https://ecoservisproekt.com/upload/iblock/7e9/7e96bd3d6de7594a5b95e849b8cc4469.pdf', category: 'Чертежи' },
  { id: 5, title: 'Станции очистки сточных вод типа ВС — опросный лист', href: 'https://ecoservisproekt.com/upload/iblock/b84/b8402ea060eb48ae840aa2e043212706.pdf', category: 'Паспорта' },
  { id: 6, title: 'Установки очистки ливневых вод ОРЛ и ОРЛ-С — файл для скачивания', href: 'https://ecoservisproekt.com/upload/iblock/71e/71eaf61d2da5c0c8a5e504f96385aa06.pdf', category: 'Паспорта' },
  { id: 7, title: 'Установки очистки ливневых вод ОРЛ и ОРЛ-С — опросный лист', href: 'https://ecoservisproekt.com/upload/iblock/d8d/d8d878ce4255616ba670cdc18e9b8c79.pdf', category: 'Паспорта' },
  { id: 8, title: 'Инструкция по монтажу сооружений ОРЛ-С (ORL-S)', href: 'https://ecoservisproekt.com/upload/iblock/163/163a856ebd36e70508390588f7528e26.pdf', category: 'Инструкции' },
  { id: 9, title: 'Ленточный сборник нефтепродуктов «ОРОЛ» — файл для скачивания', href: 'https://ecoservisproekt.com/upload/iblock/358/358e8ff637e475f5b81db26760013238.pdf', category: 'Паспорта' },
  { id: 10, title: 'Канализационные насосные станции «Кватро» — опросный лист', href: 'https://ecoservisproekt.com/upload/iblock/7a8/7a85fdc0fe74dc79c58fad66cec53b6d.pdf', category: 'Паспорта' },
  { id: 11, title: 'Гравитационные жироуловители ЛТ — опросный лист', href: 'https://ecoservisproekt.com/upload/iblock/780/780841fce67fac581a46b3fc0258d43c.pdf', category: 'Паспорта' },
  { id: 12, title: 'Ультразвуковые расходомеры MQU 99-S,C — инструкция пользователя', href: 'https://ecoservisproekt.com/upload/iblock/ae9/ae9e8e0d0ebf6f1bd1f9c0933a94dcd2.pdf', category: 'Инструкции' },
  { id: 13, title: 'Нефтесорбент «Фиброил» — техническое описание', href: 'https://ecoservisproekt.com/upload/iblock/f41/f419806311d0091701082e0513e379b8.pdf', category: 'Паспорта' },
  { id: 14, title: 'Воздуходувки «KUBÍČEK» — каталог технических параметров', href: 'https://ecoservisproekt.com/upload/iblock/ad5/ad50902872d1e88bf1e9efbe2397b84a.pdf', category: 'Паспорта' },
  { id: 15, title: 'Воздуходувки «KUBÍČEK» — инструкция по эксплуатации', href: 'https://ecoservisproekt.com/upload/iblock/080/0807434930d265ea7aa853da2fe54f39.pdf', category: 'Инструкции' },
  { id: 16, title: 'Воздуходувки «KUBÍČEK» — сервисная книга', href: 'https://ecoservisproekt.com/upload/iblock/207/2071e0d08d8d9faab13eca7299a2faf2.pdf', category: 'Инструкции' }
]

const docCategories = ['Любой доступ', 'BIM (.RFA, .IFC)', 'Чертежи', 'Инструкции', 'Паспорта']
const activeDocCategory = ref('Любой доступ')
const docSearch = ref('')

const filteredDocuments = computed(() => {
  let r = documents
  if (activeDocCategory.value !== 'Любой доступ') {
    r = r.filter(d => d.category === activeDocCategory.value || (activeDocCategory.value.startsWith('BIM') && d.category === 'BIM'))
  }
  if (docSearch.value.trim()) {
    const q = docSearch.value.toLowerCase()
    r = r.filter(d => d.title.toLowerCase().includes(q))
  }
  return r
})

const standards = [
  {
    id: 1,
    title: 'ISO 9001:2015',
    desc: 'Система управления качеством',
    details: 'Сертификат подтверждает соответствие всех процессов ESP международным стандартам качества'
  },
  {
    id: 2,
    title: 'ISO 14001:2015',
    desc: 'Экологический менеджмент',
    details: 'Подтверждение экологической ответственности и соответствия методов производства требованиям охраны природы'
  },
  {
    id: 3,
    title: 'ГОСТ РБ EN 12566-3',
    desc: 'Малые системы очистки сточных вод',
    details: 'Требования и методы испытания локальных сооружений для отдельных объектов'
  },
  {
    id: 4,
    title: 'СНиП 3.05.04',
    desc: 'Наружные сети и сооружения водоснабжения и канализации',
    details: 'Нормы проектирования и строительства систем водоснабжения и водоотведения'
  }
]

const tools = [
  {
    id: 1,
    icon: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 11h.01M12 11h.01M15 11h.01M4 7h16M4 11h4m-4 4h4"/>',
    title: 'Калькулятор подбора',
    desc: 'Автоматический подбор оборудования по параметрам воды и производительности'
  },
  {
    id: 2,
    icon: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>',
    title: 'Генератор спецификаций',
    desc: 'Создание готовой спецификации в Excel или PDF для вашей системы'
  },
  {
    id: 3,
    icon: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/>',
    title: 'BIM-конструктор',
    desc: 'Скачайте BIM-модели для Revit и AutoCAD и встройте в свой проект'
  },
  {
    id: 4,
    icon: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/>',
    title: 'Калькулятор мощности',
    desc: 'Расчёт энергопотребления и выбор электрооборудования'
  }
]

const readinessQuestions = [
  {
    question: 'Превышает ли содержание органики (ХПК) предел 150 мг/л?',
    yesLabel: 'Да, превышает',
    noLabel: 'Нет, в норме',
    yesResult: 'Рекомендован мембранный биореактор ESP MBR для глубокой доочистки.',
    noResult: 'Показатели в норме. Стандартной фильтрации может быть достаточно.'
  },
  {
    question: 'Есть ли штрафы за экологическое несоответствие за последний квартал?',
    yesLabel: 'Более 7 000 BYN',
    noLabel: 'Меньше или отсутствуют',
    yesResult: 'Срок окупаемости модернизации — менее 12 месяцев. Рекомендуем установку ESP.',
    noResult: 'Риски в пределах нормы, но оптимизация системы снизит их дальше.'
  },
  {
    question: 'Требуется ли повторное использование очищенной воды в производстве?',
    yesLabel: 'Да, требуется',
    noLabel: 'Нет, сброс в сеть',
    yesResult: 'Рекомендована система замкнутого водооборота с обратным осмосом ESP.',
    noResult: 'Достаточно стандартной схемы очистки перед сбросом в канализацию.'
  }
]
const readinessAnswer = reactive({})

const toolModalOpen = ref(null)
const subscribeEmail = ref('')
const subscribed = ref(false)
const subConsent = ref(false)
const subLead = useLead('subscribe')
const subscribe = async (e) => {
  subscribed.value = await subLead.send({ email: subscribeEmail.value, subject: 'Новости и блог', consent: subConsent.value }, [], e)
}

const faqs = [
  {
    q: 'Какой размер системы оптимален для моего объекта?',
    a: 'Размер зависит от количества людей, производства и качества входящей воды. Рекомендуем провести техническую консультацию для точного подбора.'
  },
  {
    q: 'Гарантия на оборудование — как долго?',
    a: 'Все системы ESP поставляются с 5-летней гарантией. Дополнительно можно расширить до 7-10 лет и подписать сервисный контракт.'
  },
  {
    q: 'Есть ли готовые BIM-модели?',
    a: 'Да, все оборудование ESP имеет готовые параметризованные модели для Revit и AutoCAD. Скачайте их из нашей BIM-библиотеки.'
  },
  {
    q: 'Какие расходные материалы нужны?',
    a: 'Основные: фильтрующие загрузки, реагенты, УФ-лампы. Полный перечень для конкретной системы найдёте в документации оборудования.'
  },
  {
    q: 'Есть ли услуга техническая поддержка?',
    a: 'Да, доступна 24/7 горячая линия с гарантированным откликом 4 часа. Включает диагностику, удалённую помощь и выезды инженера.'
  }
]
</script>

<style scoped>
.rs-sub { margin-top: 0.9rem; }
.rs-search { position: relative; max-width: 40rem; margin-top: 2rem; }
.rs-search svg { position: absolute; left: 1rem; top: 50%; width: 18px; height: 18px; transform: translateY(-50%); color: #6e6e73; pointer-events: none; }
.rs-search .ap-input { padding-left: 2.75rem; }
.rs-docs { margin-top: 1.5rem; }
.rs-doc { flex-wrap: nowrap; gap: 1rem; transition: opacity .2s ease; }
.rs-doc:hover .rs-doc-title { color: #0b5cad; }
.rs-doc-ico { flex-shrink: 0; width: 22px; height: 22px; color: #002366; }
.rs-doc-title { flex: 1; min-width: 0; font-size: 15px; font-weight: 500; line-height: 1.4; color: #1d1d1f; transition: color .2s ease; }
.rs-empty { padding: 2rem 0; text-align: center; }
.rs-pill { align-self: flex-start; margin-bottom: 0.25rem; }
.rs-cat { font-size: 12px; font-weight: 600; color: #2f6fb8; }
.rs-clamp { display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden; }
.rs-meta { display: flex; justify-content: space-between; gap: 1rem; font-size: 13px; color: #6e6e73; }
.rs-anchor { scroll-margin-top: 100px; }
.rs-quiz { display: grid; gap: 1rem; margin-top: 2.5rem; }
.rs-q { font-size: 1.1rem; margin-bottom: 0.5rem; }
.rs-answers { display: flex; flex-wrap: wrap; gap: 0.75rem; }
.rs-yes { color: #006039; }
.rs-done { margin-top: 1.25rem; align-items: center; text-align: center; gap: 1rem; }
.rs-sub-row { display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between; gap: 1.25rem 2rem; }
.rs-sub-form { display: flex; flex-wrap: wrap; gap: 0.6rem; width: 100%; max-width: 26rem; }
.rs-sub-form .lead-consent, .rs-sub-form p { flex-basis: 100%; }
.rs-sub-form .ap-input { flex: 1; min-width: 0; border-radius: 999px; padding: 0.7rem 1.1rem; }
.rs-faq { display: block; }
.rs-faq summary { display: flex; justify-content: space-between; align-items: center; gap: 1rem; cursor: pointer; list-style: none; font-weight: 600; font-size: 1.05rem; color: #1d1d1f; }
.rs-faq summary::-webkit-details-marker { display: none; }
.rs-faq summary svg { flex-shrink: 0; width: 18px; height: 18px; color: #6e6e73; transition: transform .25s ease; }
.rs-faq[open] summary svg { transform: rotate(180deg); }
.rs-faq .ap-text { margin-top: 0.75rem; }
.rs-cta-actions { justify-content: center; }
.rs-modal { position: fixed; inset: 0; z-index: 50; display: flex; align-items: center; justify-content: center; padding: 1rem; }
.rs-modal__backdrop { position: absolute; inset: 0; background: rgba(29, 29, 31, .55); backdrop-filter: blur(6px); }
.rs-modal__panel { position: relative; display: grid; gap: 0.75rem; width: 100%; max-width: 28rem; padding: 2rem; border-radius: 22px; background: #fff; text-align: center; box-shadow: 0 30px 60px -20px rgba(0, 0, 0, .35); }
.rs-modal__panel .ap-actions { justify-content: center; margin-top: 0.75rem; }
.rs-modal__close { position: absolute; top: 12px; right: 12px; width: 32px; height: 32px; display: grid; place-items: center; border-radius: 50%; background: #f5f5f7; color: #1d1d1f; }
.rs-modal__close svg { width: 16px; height: 16px; }
@media (max-width: 767px) {
  .rs-doc { flex-wrap: wrap; }
  .rs-doc-title { flex-basis: calc(100% - 40px); }
  .rs-doc .ap-small { margin-left: 38px; }
}
</style>
