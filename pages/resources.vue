<template>
  <div ref="root" class="dj">
    <DjPageHero eyebrow="Документация" title="Ресурсы и документы" lede="Техническая документация, ГОСТы, стандарты качества, инструкции и калькуляторы для проектировщиков." />

    <!-- Downloads Section -->
    <section id="library" class="dj-sec rs-anchor">
      <div class="dj-wrap">
        <div class="dj-center rs-intro dj-reveal">
          <span class="dj-eyebrow">Библиотека проектировщика</span>
          <h2 class="dj-h2">Центр технической документации и BIM-активов</h2>
          <p class="rs-small rs-sub">Опросные листы · Инструкции по монтажу · BIM/CAD файлы по запросу · ISO 9001</p>
        </div>

        <div class="rs-search">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden="true">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
          </svg>
          <input
            v-model="docSearch"
            type="search"
            placeholder="Найти паспорт, опросный лист, инструкцию"
            class="rs-input"
          />
        </div>

        <div class="rs-tabs" role="tablist" aria-label="Тип документа">
          <button
            v-for="cat in docCategories"
            :key="cat"
            type="button"
            role="tab"
            :aria-selected="activeDocCategory === cat"
            class="rs-tab"
            :class="{ 'is-on': activeDocCategory === cat }"
            @click="activeDocCategory = cat"
          >{{ cat }}</button>
        </div>

        <div class="rs-docs">
          <a
            v-for="doc in filteredDocuments"
            :key="doc.id"
            :href="doc.href"
            target="_blank"
            rel="noopener"
            class="rs-doc"
          >
            <ApIcon name="doc" class="rs-doc-ico" />
            <h3 class="rs-doc-title">{{ doc.title }}</h3>
            <span class="rs-small rs-doc-cat">{{ doc.category }}</span>
            <span class="dj-more rs-doc-dl">Скачать</span>
          </a>
          <p v-if="!filteredDocuments.length" class="rs-text rs-empty">Документы не найдены</p>
        </div>
      </div>
    </section>

    <!-- Standards & Certifications -->
    <section class="dj-sec dj-sec--soft">
      <div class="dj-wrap">
        <div class="dj-center rs-intro dj-reveal">
          <h2 class="dj-h2">Стандарты и сертификации</h2>
          <p class="dj-lede">Системы ESP разработаны в соответствии с международными и национальными стандартами</p>
        </div>

        <div class="rs-grid rs-grid--2">
          <div v-for="std in standards" :key="std.id" class="rs-card rs-card--white dj-reveal">
            <span class="rs-pill">{{ std.title }}</span>
            <h3 class="dj-h3 rs-card-title">{{ std.desc }}</h3>
            <p class="rs-text">{{ std.details }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Tools -->
    <section id="calculator" class="dj-sec rs-anchor">
      <div class="dj-wrap">
        <div class="dj-center rs-intro dj-reveal">
          <h2 class="dj-h2">Онлайн-инструменты</h2>
          <p class="dj-lede">Калькуляторы и генераторы для подбора оборудования</p>
        </div>

        <div class="rs-grid rs-grid--2">
          <div v-for="tool in tools" :key="tool.id" class="rs-card dj-reveal">
            <ApIcon :name="tool.glyph" class="rs-ico" />
            <h3 class="dj-h3 rs-card-title">{{ tool.title }}</h3>
            <p class="rs-text">{{ tool.desc }}</p>
            <div class="rs-card-foot">
              <button type="button" class="dj-btn" @click="toolModalOpen = tool.id">Открыть инструмент</button>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Blog -->
    <section id="blog" class="dj-sec dj-sec--soft rs-anchor">
      <div class="dj-wrap">
        <div class="dj-center rs-intro dj-reveal">
          <span class="dj-eyebrow">Технический блог</span>
          <h2 class="dj-h2">Аналитика и разбор проектов</h2>
        </div>

        <div class="rs-grid rs-grid--3">
          <NuxtLink
            v-for="article in articles"
            :key="article.slug"
            :to="`/articles/${article.slug}`"
            class="rs-card rs-card--white rs-article"
          >
            <span class="rs-cat">{{ article.category }}</span>
            <h3 class="dj-h3 rs-card-title">{{ article.title }}</h3>
            <p class="rs-text rs-clamp">{{ article.excerpt }}</p>
            <div class="rs-card-foot rs-meta">
              <span>{{ article.date }}</span>
              <span>{{ article.readTime }}</span>
            </div>
          </NuxtLink>
        </div>
      </div>
    </section>

    <!-- Readiness Test -->
    <section id="test" class="dj-sec rs-anchor">
      <div class="dj-wrap rs-narrow">
        <div class="dj-center rs-intro dj-reveal">
          <span class="dj-eyebrow">Аудит соответствия</span>
          <h2 class="dj-h2">Тест готовности объекта к очистке</h2>
          <p class="dj-lede">
            Ответьте на три вопроса, чтобы узнать, соответствуют ли текущие показатели сброса воды нормативно допустимым концентрациям (ПДК).
          </p>
        </div>

        <div class="rs-quiz">
          <div v-for="(q, i) in readinessQuestions" :key="i" class="rs-card">
            <h4 class="dj-h3 rs-q">{{ i + 1 }}. {{ q.question }}</h4>
            <div v-if="readinessAnswer[i] === undefined" class="rs-answers">
              <button type="button" class="dj-btn" @click="readinessAnswer[i] = true">{{ q.yesLabel }}</button>
              <button type="button" class="dj-btn dj-btn--line" @click="readinessAnswer[i] = false">{{ q.noLabel }}</button>
            </div>
            <p v-else class="rs-text" :class="{ 'rs-yes': readinessAnswer[i] }">
              {{ readinessAnswer[i] ? q.yesResult : q.noResult }}
            </p>
          </div>
        </div>

        <div v-if="readinessQuestions.every((_, i) => readinessAnswer[i] !== undefined)" class="rs-card rs-done">
          <p class="rs-text">Спасибо за ответы. Инженер ESP подготовит рекомендации по вашему объекту.</p>
          <div><NuxtLink to="/contacts#contact-form" class="dj-btn">Запросить консультацию</NuxtLink></div>
        </div>
      </div>
    </section>

    <!-- Subscribe -->
    <section id="subscribe" class="dj-sec dj-sec--soft rs-subsec rs-anchor">
      <div class="dj-wrap rs-sub-row dj-reveal">
        <div>
          <h2 class="dj-h3">Подписка на новости и блог ESP</h2>
          <p class="rs-text">Статьи об отрасли, новые проекты и технологии — раз в месяц на вашу почту</p>
        </div>
        <form class="rs-sub-form" @submit.prevent="subscribe">
          <input v-if="!subscribed" v-model="subscribeEmail" name="email" autocomplete="email" required type="email" placeholder="Электронная почта" class="rs-input" />
          <button v-if="!subscribed" type="submit" class="dj-btn" :disabled="subLead.sending.value">{{ subLead.sending.value ? 'Отправка…' : 'Подписаться' }}</button>
          <LeadConsent v-if="!subscribed" v-model="subConsent" />
          <p v-if="subLead.error.value" role="alert" style="font-size:13px;color:#b42318;margin:0">{{ subLead.error.value }}</p>
          <span v-else-if="subscribed" class="rs-note-ok"><ApIcon name="check" :size="16" /> Вы подписаны</span>
        </form>
      </div>
    </section>

    <!-- Tool Modal -->
    <div v-if="toolModalOpen" class="rs-modal">
      <div class="rs-modal__backdrop" @click="toolModalOpen = null"></div>
      <div class="rs-modal__panel">
        <button type="button" class="rs-modal__close" aria-label="Закрыть" @click="toolModalOpen = null">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M6 18L18 6M6 6l12 12" /></svg>
        </button>
        <h3 class="dj-h3 rs-modal__title">{{ tools.find(t => t.id === toolModalOpen)?.title }}</h3>
        <p class="rs-text">Полная версия инструмента доступна на странице «Оборудование». Откройте каталог, чтобы рассчитать и подобрать оборудование под ваш объект.</p>
        <div class="rs-modal__act"><NuxtLink to="/equipment#tools" class="dj-btn" @click="toolModalOpen = null">Перейти в каталог оборудования</NuxtLink></div>
      </div>
    </div>

    <!-- FAQ -->
    <section id="faq" class="dj-sec rs-anchor">
      <div class="dj-wrap rs-narrow">
        <div class="dj-center rs-intro dj-reveal">
          <h2 class="dj-h2">Частые вопросы</h2>
          <p class="dj-lede">Ответы на частые вопросы об очистных сооружениях</p>
        </div>

        <div class="rs-faqs">
          <details v-for="(faq, i) in faqs" :key="i" class="rs-faq">
            <summary>
              {{ faq.q }}
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden="true">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M19 9l-7 7-7-7"></path>
              </svg>
            </summary>
            <p class="rs-text">{{ faq.a }}</p>
          </details>
        </div>
      </div>
    </section>

    <!-- CTA -->
    <section class="dj-sec dj-sec--soft">
      <div class="dj-wrap dj-center dj-reveal">
        <h2 class="dj-h2">Не нашли нужную информацию?</h2>
        <p class="dj-lede">Обратитесь к нашему техническому отделу. Мы подготовим необходимые документы и расчёты.</p>
        <div class="dj-links rs-cta-actions">
          <NuxtLink to="/contacts" class="dj-btn dj-btn--lg">Обсудить проект</NuxtLink>
          <NuxtLink to="/contacts#contact-form" class="dj-more">Запросить консультацию</NuxtLink>
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
    { property: 'og:title', content: 'Ресурсы ESP | Документация и техблог' },
    { property: 'og:description', content: 'Техническая документация, стандарты, калькуляторы подбора и аналитические статьи инженеров ESP.' }
  ],
  link: [{ rel: 'canonical', href: 'https://ecoservisproekt.by/resources' }]
})

const documents = [
  { id: 1, title: 'Станции очистки сточных вод типа ДС — файл для скачивания', href: 'https://ecoservisproekt.com/upload/iblock/fa4/fa470f4784a902a2497d9c3d20ceafae.pdf', category: 'Паспорта' },
  { id: 2, title: 'Станции очистки сточных вод типа ДС — опросный лист', href: 'https://ecoservisproekt.com/upload/iblock/1f2/1f2236add9dda924caa0cebd06733a35.pdf', category: 'Паспорта' },
  { id: 3, title: 'Станции очистки сточных вод типа ВС — файл для скачивания', href: 'https://ecoservisproekt.com/upload/iblock/a06/a061e1daeaf55d5ae573298ef562d82c.pdf', category: 'Паспорта' },
  { id: 4, title: 'Схема расположения модулей ВС35 — ВС500 (план, разрез)', href: 'https://ecoservisproekt.com/upload/iblock/7e9/7e96bd3d6de7594a5b95e849b8cc4469.pdf', category: 'Чертежи' },
  { id: 5, title: 'Станции очистки сточных вод типа ВС — опросный лист', href: 'https://ecoservisproekt.com/upload/iblock/b84/b8402ea060eb48ae840aa2e043212706.pdf', category: 'Паспорта' },
  { id: 6, title: 'Установки очистки ливневых вод ОРЛ и ОРЛ-С — файл для скачивания', href: 'https://ecoservisproekt.com/upload/iblock/71e/71eaf61d2da5c0c8a5e504f96385aa06.pdf', category: 'Паспорта' },
  { id: 7, title: 'Установки очистки ливневых вод ОРЛ и ОРЛ-С — опросный лист', href: 'https://ecoservisproekt.com/upload/iblock/d8d/d8d878ce4255616ba670cdc18e9b8c79.pdf', category: 'Паспорта' },
  { id: 8, title: 'Инструкция по монтажу сооружений ОРЛ-С (ORL-S)', href: 'https://ecoservisproekt.com/upload/iblock/163/163a856ebd36e70508390588f7528e26.pdf', category: 'Инструкции' },
  { id: 9, title: 'Ленточный сборник нефтепродуктов «ОРОЛ» — файл для скачивания', href: 'https://ecoservisproekt.com/upload/iblock/358/358e8ff637e475f5b81db26760013238.pdf', category: 'Паспорта' },
  { id: 10, title: 'Канализационные насосные станции «Кватро» — опросный лист', href: 'https://ecoservisproekt.com/upload/iblock/7a8/7a85fdc0fe74dc79c58fad66cec53b6d.pdf', category: 'Паспорта' },
  { id: 11, title: 'Гравитационные жироуловители ЛТ — опросный лист', href: 'https://ecoservisproekt.com/upload/iblock/780/780841fce67fac581a46b3fc0258d43c.pdf', category: 'Паспорта' },
  { id: 12, title: 'Ультразвуковые расходомеры MQU 99-S,C — инструкция пользователя', href: 'https://ecoservisproekt.com/upload/iblock/ae9/ae9e8e0d0ebf6f1bd1f9c0933a94dcd2.pdf', category: 'Инструкции' },
  { id: 13, title: 'Нефтесорбент «Фиброил» — техническое описание', href: 'https://ecoservisproekt.com/upload/iblock/f41/f419806311d0091701082e0513e379b8.pdf', category: 'Паспорта' },
  { id: 14, title: 'Воздуходувки «KUBÍČEK» — каталог технических параметров', href: 'https://ecoservisproekt.com/upload/iblock/ad5/ad50902872d1e88bf1e9efbe2397b84a.pdf', category: 'Паспорта' },
  { id: 15, title: 'Воздуходувки «KUBÍČEK» — инструкция по эксплуатации', href: 'https://ecoservisproekt.com/upload/iblock/080/0807434930d265ea7aa853da2fe54f39.pdf', category: 'Инструкции' },
  { id: 16, title: 'Воздуходувки «KUBÍČEK» — сервисная книга', href: 'https://ecoservisproekt.com/upload/iblock/207/2071e0d08d8d9faab13eca7299a2faf2.pdf', category: 'Инструкции' }
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
    details: 'Подтверждение экологической ответственности и соответствия методов производства требованиям охраны природы'
  },
  {
    id: 3,
    title: 'ГОСТ РБ EN 12566-3',
    desc: 'Малые системы очистки сточных вод',
    details: 'Требования и методы испытания локальных сооружений для отдельных объектов'
  },
  {
    id: 4,
    title: 'СНиП 3.05.04',
    desc: 'Наружные сети и сооружения водоснабжения и канализации',
    details: 'Нормы проектирования и строительства систем водоснабжения и водоотведения'
  }
]

const tools = [
  {
    id: 1,
    glyph: 'calculator',
    title: 'Калькулятор подбора',
    desc: 'Автоматический подбор оборудования по параметрам воды и производительности'
  },
  {
    id: 2,
    glyph: 'doc',
    title: 'Генератор спецификаций',
    desc: 'Создание готовой спецификации в Excel или PDF для вашей системы'
  },
  {
    id: 3,
    glyph: 'cube',
    title: 'BIM-конструктор',
    desc: 'Скачайте BIM-модели для Revit и AutoCAD и встройте в свой проект'
  },
  {
    id: 4,
    glyph: 'lightning',
    title: 'Калькулятор мощности',
    desc: 'Расчёт энергопотребления и выбор электрооборудования'
  }
]

const readinessQuestions = [
  {
    question: 'Превышает ли содержание органики (ХПК) предел 150 мг/л?',
    yesLabel: 'Да, превышает',
    noLabel: 'Нет, в норме',
    yesResult: 'Рекомендован мембранный биореактор ESP MBR для глубокой доочистки.',
    noResult: 'Показатели в норме. Стандартной фильтрации может быть достаточно.'
  },
  {
    question: 'Есть ли штрафы за экологическое несоответствие за последний квартал?',
    yesLabel: 'Более 7 000 BYN',
    noLabel: 'Меньше или отсутствуют',
    yesResult: 'Срок окупаемости модернизации — менее 12 месяцев. Рекомендуем установку ESP.',
    noResult: 'Риски в пределах нормы, но оптимизация системы снизит их дальше.'
  },
  {
    question: 'Требуется ли повторное использование очищенной воды в производстве?',
    yesLabel: 'Да, требуется',
    noLabel: 'Нет, сброс в сеть',
    yesResult: 'Рекомендована система замкнутого водооборота с обратным осмосом ESP.',
    noResult: 'Достаточно стандартной схемы очистки перед сбросом в канализацию.'
  }
]
const readinessAnswer = reactive({})

const toolModalOpen = ref(null)
const subscribeEmail = ref('')
const subscribed = ref(false)
const subConsent = ref(false)
const subLead = useLead('subscribe')
const subscribe = async (e) => {
  subscribed.value = await subLead.send({ email: subscribeEmail.value, subject: 'Новости и блог', consent: subConsent.value }, [], e)
}

const faqs = [
  {
    q: 'Какой размер системы оптимален для моего объекта?',
    a: 'Размер зависит от количества людей, производства и качества входящей воды. Рекомендуем провести техническую консультацию для точного подбора.'
  },
  {
    q: 'Какая гарантия на оборудование?',
    a: 'Системы ESP поставляются с 5-летней гарантией. Срок можно увеличить до 7–10 лет и заключить сервисный контракт.'
  },
  {
    q: 'Есть ли готовые BIM-модели?',
    a: 'Да, для оборудования ESP есть готовые параметризованные модели для Revit и AutoCAD. Их можно скачать из BIM-библиотеки.'
  },
  {
    q: 'Какие расходные материалы нужны?',
    a: 'Основные: фильтрующие загрузки, реагенты, УФ-лампы. Полный перечень для конкретной системы найдёте в документации оборудования.'
  },
  {
    q: 'Есть ли услуга техническая поддержка?',
    a: 'Да, доступна 24/7 горячая линия с гарантированным откликом 4 часа. Включает диагностику, удалённую помощь и выезды инженера.'
  }
]

const root = ref(null)
useReveal(root)
</script>

<style scoped>
/* Apple: поиск в сером поле, чипы-капсулы, плитки 28px, список загрузок
   и FAQ — строки с разделителями, как Docs & Downloads / вопросы на apple.com */
.rs-input { width: 100%; height: 48px; padding: 0 16px; border: 1px solid #d2d2d7; border-radius: 12px; background: #fff; font: inherit; font-size: 17px; letter-spacing: -0.022em; color: var(--dj-ink); outline: none; transition: border-color .2s ease, box-shadow .2s ease, background-color .2s ease; }
.rs-input:focus { border-color: #0071e3; box-shadow: 0 0 0 4px rgba(0, 113, 227, .18); }
.rs-input::placeholder { color: #86868b; }
.rs-text { font-size: 17px; line-height: 1.47; letter-spacing: -0.022em; color: #6e6e73; }
.rs-small { font-size: 14px; line-height: 1.43; letter-spacing: -0.016em; color: #6e6e73; }
.rs-anchor { scroll-margin-top: 100px; }
.rs-narrow { max-width: 820px; }
.rs-intro { max-width: 52rem; margin: 0 auto; }
.rs-intro .dj-lede, .rs-intro .rs-sub { margin-top: 16px; }

.rs-search { position: relative; max-width: 692px; margin: 40px auto 0; }
.rs-search svg { position: absolute; left: 16px; top: 50%; width: 18px; height: 18px; transform: translateY(-50%); color: #86868b; pointer-events: none; }
.rs-search .rs-input { padding-left: 44px; background: #f5f5f7; border-color: transparent; }
.rs-search .rs-input:focus { background: #fff; border-color: #0071e3; }
.rs-tabs { display: flex; flex-wrap: nowrap; justify-content: center; gap: 8px; margin-top: 20px; overflow-x: auto; scrollbar-width: none; }
.rs-tabs::-webkit-scrollbar { display: none; }
@media (max-width: 767px) { .rs-tabs { justify-content: flex-start; margin-left: -16px; margin-right: -16px; padding: 0 16px; } }
.rs-tab { flex: none; height: 36px; padding: 0 16px; border-radius: 999px; font-size: 14px; font-weight: 400; letter-spacing: -0.016em; white-space: nowrap; color: var(--dj-ink); background: #fff; box-shadow: inset 0 0 0 1px #d2d2d7; transition: background-color .2s ease, color .2s ease, box-shadow .2s ease; }
.rs-tab:hover { box-shadow: inset 0 0 0 1px #86868b; }
.rs-tab.is-on { background: var(--dj-ink); color: #fff; box-shadow: none; }

.rs-docs { max-width: 980px; margin: 32px auto 0; border-top: 1px solid #d2d2d7; }
.rs-doc { display: flex; align-items: center; gap: 16px; min-width: 0; padding: 20px 8px; border-bottom: 1px solid #d2d2d7; transition: background-color .25s ease; }
.rs-doc:hover { background: #fafafc; }
.rs-doc:hover .rs-doc-title { color: #0066cc; }
.rs-doc-ico { flex-shrink: 0; width: 24px; height: 24px; color: #6e6e73; }
.rs-doc-title { flex: 1; min-width: 0; font-size: 17px; font-weight: 600; line-height: 1.3; letter-spacing: -0.022em; color: var(--dj-ink); transition: color .2s ease; overflow-wrap: break-word; }
.rs-doc-cat { flex-shrink: 0; }
.rs-doc-dl { flex-shrink: 0; font-size: 17px; }
.rs-empty { padding: 32px 0; text-align: center; }
@media (max-width: 767px) {
  .rs-doc { flex-wrap: wrap; gap: 6px 12px; padding: 16px 0; }
  .rs-doc-title { flex-basis: calc(100% - 40px); }
  .rs-doc-cat { margin-left: 36px; }
  .rs-doc-dl { margin-left: auto; }
}

.rs-grid { display: grid; gap: 20px; margin-top: 48px; }
.rs-grid--2 { grid-template-columns: repeat(2, minmax(0, 1fr)); }
.rs-grid--3 { grid-template-columns: repeat(3, minmax(0, 1fr)); }
@media (max-width: 1023px) { .rs-grid--3 { grid-template-columns: repeat(2, minmax(0, 1fr)); } }
@media (max-width: 719px) { .rs-grid { gap: 16px; } .rs-grid--2, .rs-grid--3 { grid-template-columns: minmax(0, 1fr); } }
.rs-card { display: flex; flex-direction: column; align-items: flex-start; gap: 12px; min-width: 0; padding: clamp(28px, 3vw, 40px); border-radius: 28px; background: #f5f5f7; }
.rs-card--white { background: #fff; }
@media (max-width: 767px) { .rs-card { border-radius: 18px; } }
.rs-card-title { font-size: clamp(24px, 2.2vw, 28px); line-height: 1.14; letter-spacing: 0.007em; overflow-wrap: break-word; }
.rs-card-foot { margin-top: auto; padding-top: 16px; }
.rs-ico { width: 40px; height: 40px; color: var(--dj-ink); }
.rs-pill { display: inline-flex; align-items: center; height: 24px; padding: 0 10px; border-radius: 999px; font-size: 12px; font-weight: 600; letter-spacing: -0.01em; background: #f5f5f7; color: var(--dj-ink); }
.rs-cat { font-size: 12px; line-height: 1.33; font-weight: 700; letter-spacing: 0.02em; text-transform: uppercase; color: #6e6e73; }
.rs-article { transform: translateZ(0); transition: box-shadow .3s ease; }
.rs-article:hover { box-shadow: 2px 4px 16px rgba(0, 0, 0, .12); }
.rs-article:hover .rs-card-title { color: #0066cc; }
.rs-article .rs-card-title { font-size: 21px; line-height: 1.19; font-weight: 700; letter-spacing: 0.011em; transition: color .25s ease; }
.rs-clamp { display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden; }
.rs-meta { display: flex; justify-content: space-between; gap: 16px; width: 100%; font-size: 14px; font-weight: 600; letter-spacing: -0.016em; color: #6e6e73; }

.rs-quiz { display: grid; gap: 16px; margin-top: 48px; }
.rs-q { font-size: 21px; line-height: 1.19; letter-spacing: 0.011em; }
.rs-answers { display: flex; flex-wrap: wrap; gap: 12px; margin-top: 4px; }
.rs-yes { color: #008009; }
.rs-done { margin-top: 16px; align-items: center; text-align: center; gap: 16px; }

.rs-subsec { padding: clamp(48px, 6vw, 80px) 0; }
.rs-sub-row { display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between; gap: 20px 40px; padding: clamp(28px, 4vw, 48px); border-radius: 28px; background: #fff; }
@media (max-width: 767px) { .rs-sub-row { border-radius: 18px; margin: 0 16px; padding: 28px 20px; } }
.rs-sub-row > div { flex: 1 1 22rem; min-width: 0; }
.rs-sub-row .rs-text { margin-top: 8px; }
.rs-sub-form { display: flex; flex-wrap: wrap; gap: 10px; width: 100%; max-width: 28rem; }
.rs-sub-form .lead-consent, .rs-sub-form p { flex-basis: 100%; }
.rs-sub-form .rs-input { flex: 1; min-width: 0; }
.rs-sub-form .dj-btn { height: 48px; }
.rs-note-ok { display: inline-flex; align-items: center; gap: 6px; font-size: 14px; font-weight: 600; color: #008009; }

.rs-faqs { margin-top: 48px; border-top: 1px solid #d2d2d7; }
.rs-faq { border-bottom: 1px solid #d2d2d7; }
.rs-faq summary { display: flex; justify-content: space-between; align-items: center; gap: 16px; padding: 24px 0; cursor: pointer; list-style: none; font-weight: 600; font-size: 21px; line-height: 1.19; letter-spacing: 0.011em; color: var(--dj-ink); }
.rs-faq summary::-webkit-details-marker { display: none; }
.rs-faq summary:hover { color: #0066cc; }
.rs-faq summary svg { flex-shrink: 0; width: 20px; height: 20px; color: #6e6e73; transition: transform .35s var(--dj-ease); }
.rs-faq[open] summary svg { transform: rotate(180deg); }
.rs-faq .rs-text { margin: -8px 0 0; padding-bottom: 24px; max-width: 692px; }
@media (max-width: 767px) { .rs-faq summary { font-size: 19px; padding: 20px 0; } }

.rs-cta-actions { margin-top: 28px; }

.rs-modal { position: fixed; inset: 0; z-index: 50; display: flex; align-items: center; justify-content: center; padding: 16px; }
.rs-modal__backdrop { position: absolute; inset: 0; background: rgba(0, 0, 0, .48); backdrop-filter: blur(20px) saturate(180%); -webkit-backdrop-filter: blur(20px) saturate(180%); }
.rs-modal__panel { position: relative; display: grid; gap: 12px; width: 100%; max-width: 30rem; max-height: 100%; overflow-y: auto; padding: 48px 36px 36px; border-radius: 28px; background: #fff; text-align: center; box-shadow: 0 30px 60px -20px rgba(0, 0, 0, .35); animation: rs-in .5s var(--dj-ease) both; }
@keyframes rs-in { from { opacity: 0; transform: translateY(24px); } to { opacity: 1; transform: none; } }
.rs-modal__title { font-size: 28px; line-height: 1.14; letter-spacing: 0.007em; padding: 0 28px; }
.rs-modal__act { display: flex; justify-content: center; margin-top: 12px; }
.rs-modal__act .dj-btn { white-space: normal; height: auto; min-height: 44px; padding-top: 10px; padding-bottom: 10px; text-align: center; }
.rs-modal__close { position: absolute; top: 16px; right: 16px; width: 36px; height: 36px; display: grid; place-items: center; border-radius: 50%; background: #e8e8ed; color: #6e6e73; transition: background-color .2s ease, color .2s ease; }
.rs-modal__close:hover { background: #dcdce1; color: var(--dj-ink); }
.rs-modal__close svg { width: 16px; height: 16px; }
@media (prefers-reduced-motion: reduce) { .rs-modal__panel { animation: none; } .rs-faq summary svg { transition: none; } }
</style>
