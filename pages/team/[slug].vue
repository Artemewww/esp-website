<template>
  <div v-if="expert" class="bg-white">
    <section class="py-6 border-b border-esp-gray">
      <div class="container-custom">
        <Breadcrumb :items="[{ label: 'Команда', to: '/team' }, { label: expert.name }]" />
      </div>
    </section>

    <!-- Компактная шапка: появляется, когда крупный заголовок ушёл за верх.
         На длинной странице читатель забывает, чью карточку листает. -->
    <div
      class="ex-sticky-head"
      :class="{ 'is-on': compact }"
      :style="{ top: barTop + 'px' }"
      aria-hidden="true"
    >
      <div class="container-custom ex-sticky-inner">
        <img :src="expert.photo" :alt="''" class="ex-sticky-photo" />
        <span class="ex-sticky-name font-rounded">{{ expert.name }}</span>
        <span class="ex-sticky-role">{{ expert.role }}</span>
      </div>
    </div>

    <section class="ex-hero">
      <div class="container-custom ex-grid">
        <!-- Портрет прилипает к верху экрана и держится, пока рядом идёт
             текст. Кадр вписан целиком: у людей разные пропорции снимков,
             и обрезка по краю резала головы. -->
        <aside class="ex-photo-col">
          <div class="ex-photo">
            <img :src="expert.photo" :alt="expert.name" class="ex-photo-img" />
          </div>
        </aside>

        <div class="ex-body">
          <header ref="headRef" class="ex-head">
            <span class="block text-esp-blue text-sm font-medium mb-3 font-inter">{{ expert.department }}</span>
            <h1 class="font-rounded text-4xl md:text-5xl text-esp-black leading-tight mb-3">{{ expert.name }}</h1>
            <p class="text-xl text-esp-black/60">{{ expert.role }}</p>
          </header>

          <p v-if="expert.philosophy" class="text-2xl text-esp-black/80 leading-relaxed font-rounded mt-10">
            {{ expert.philosophy }}
          </p>

          <div class="flex flex-col sm:flex-row gap-3 mt-10">
            <a v-if="expert.email" :href="`mailto:${expert.email}`" class="btn-primary text-center">Написать письмо</a>
            <NuxtLink to="/contacts#contact-form" class="border-2 border-esp-blue text-esp-blue px-8 py-4 font-medium hover:bg-esp-blue hover:text-white transition text-center">
              Задать вопрос эксперту
            </NuxtLink>
          </div>

          <ClientOnly>
            <ContactCard :expert="expert" class="mt-10" />
          </ClientOnly>

          <!-- Единая структура для всех карточек: этапы → компетенции →
               объекты. Данные приходят из анкеты, поэтому у кого-то этап один,
               а у кого-то пять — блоки просто не выводятся, если пусто. -->
          <section v-if="expert.bio?.length" class="ex-section">
            <h2 class="font-rounded text-2xl md:text-3xl text-esp-black mb-10">Этапы работы</h2>
            <div class="ex-steps">
              <div v-for="(b, i) in expert.bio" :key="i" class="ex-step">
                <span class="ex-step-mark font-mono">{{ b.year }}</span>
                <div class="ex-step-body">
                  <h3 class="font-rounded text-lg text-esp-black mb-1">{{ b.title }}</h3>
                  <p v-if="b.desc" class="text-esp-black/60 leading-relaxed">{{ b.desc }}</p>
                </div>
              </div>
            </div>
          </section>

          <!-- У Алексея Ивановича это инструменты с уровнем владения, у
               остальных — компетенции из анкеты. Вёрстка общая. -->
          <section v-if="expert.skills?.length || expert.competencies?.length" class="ex-section">
            <h2 class="font-rounded text-2xl md:text-3xl text-esp-black mb-8">
              {{ expert.skills?.length ? 'Владение инструментами' : 'Ключевые компетенции' }}
            </h2>
            <div v-if="expert.skills?.length" class="space-y-6">
              <div v-for="skill in expert.skills" :key="skill.title">
                <div class="flex justify-between text-sm mb-2">
                  <span class="text-esp-black font-medium">{{ skill.title }}</span>
                  <span class="text-esp-black/40">{{ skill.level }}%</span>
                </div>
                <div class="h-1 bg-esp-gray">
                  <div class="h-full bg-esp-blue" :style="{ width: skill.level + '%' }"></div>
                </div>
              </div>
            </div>
            <ul v-else class="ex-comps">
              <li v-for="(c, i) in expert.competencies" :key="i" class="ex-comp">
                <span class="ex-comp-num font-mono">{{ String(i + 1).padStart(2, '0') }}</span>
                <span class="ex-comp-text">{{ c }}</span>
              </li>
            </ul>
          </section>

          <!-- Объекты и проекты — одинаковыми плитками: у объектов из анкеты
               своей страницы нет, поэтому они без ссылки. -->
          <section v-if="relatedProjects.length || expert.objects?.length" class="ex-section">
            <h2 class="font-rounded text-2xl md:text-3xl text-esp-black mb-8">
              {{ relatedProjects.length ? 'Проекты с участием эксперта' : 'Объекты с участием' }}
            </h2>
            <div class="ex-projects">
              <NuxtLink
                v-for="(p, i) in relatedProjects"
                :key="p.slug"
                :to="`/projects/${p.slug}`"
                class="ex-project"
              >
                <video
                  class="ex-project-video"
                  autoplay
                  muted
                  loop
                  playsinline
                  preload="metadata"
                  :poster="projectPoster(i)"
                >
                  <source :src="projectClip(i)" type="video/mp4" />
                </video>
                <span class="ex-project-scrim"></span>
                <span class="ex-project-text">
                  <b class="font-rounded">{{ p.name }}</b>
                  <i>{{ p.location }}</i>
                </span>
              </NuxtLink>

              <div v-for="(o, i) in expert.objects" :key="'o' + i" class="ex-project is-static">
                <!-- Плиток бывает полтора десятка: ничего не тянем заранее,
                     браузер сам подхватит ролик, когда плитка окажется в кадре. -->
                <video
                  class="ex-project-video"
                  autoplay
                  muted
                  loop
                  playsinline
                  preload="none"
                >
                  <source :src="objectClip(i)" type="video/mp4" />
                </video>
                <span class="ex-project-scrim"></span>
                <span class="ex-project-text">
                  <b class="font-rounded">{{ o.name }}</b>
                  <i v-if="o.kind">{{ o.kind }}</i>
                </span>
              </div>
            </div>
          </section>

        </div>
      </div>
    </section>

    <!-- Остальная команда — та же сетка, что и на /team -->
    <section ref="othersRef" class="py-20 md:py-28 bg-white border-t border-esp-gray">
      <div class="container-custom">
        <h2 class="font-rounded text-3xl md:text-4xl text-esp-black mb-14">Команда ESP</h2>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-14">
          <NuxtLink
            v-for="ex in otherExperts"
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
          </NuxtLink>
        </div>
      </div>
    </section>
  </div>
  <div v-else class="section-padding text-center">
    <p class="text-esp-black/60">Эксперт не найден.</p>
    <NuxtLink to="/team" class="text-esp-blue hover:underline">Вернуться к команде</NuxtLink>
  </div>
</template>

<script setup>
import { computed, ref, onMounted, onUnmounted } from 'vue'
import { expertsList } from '~/composables/useExperts'
import { projectsList } from '~/composables/useProjects'

const route = useRoute()
const experts = useEditableList('team', expertsList)
const expert = computed(() => experts.value.find(e => e.slug === route.params.slug))

const relatedProjects = computed(() => {
  if (!expert.value?.relatedProjects?.length) return []
  return projectsList.filter(p => expert.value.relatedProjects.includes(p.slug))
})

const otherExperts = computed(() => experts.value.filter(e => e.slug !== route.params.slug))

// Компактная шапка включается, когда крупный заголовок уехал за верх экрана.
const headRef = ref(null)
const othersRef = ref(null)
const headGone = ref(false)
const othersSeen = ref(false)
// Полоска нужна ровно на карточке этого человека: до неё имя ещё видно,
// а на блоке «Другие руководители» речь идёт уже не о нём.
const compact = computed(() => headGone.value && !othersSeen.value)
// Шапка сайта прячется при скролле вниз, поэтому фиксированное значение
// отступа оставляло под ней пустую полосу. Держимся её реального низа:
// шапка ушла — полоска встаёт вплотную к верхнему краю.
const barTop = ref(0)
let barFrame = 0

function syncBarTop() {
  const header = document.querySelector('header')
  barTop.value = header ? Math.max(0, Math.round(header.getBoundingClientRect().bottom)) : 0
}

function onScroll() {
  if (barFrame) return
  barFrame = requestAnimationFrame(() => {
    barFrame = 0
    syncBarTop()
  })
}

let headObserver = null
let othersObserver = null

onMounted(() => {
  syncBarTop()
  window.addEventListener('scroll', onScroll, { passive: true })
  window.addEventListener('resize', onScroll, { passive: true })
  if (!('IntersectionObserver' in window)) return
  if (headRef.value) {
    headObserver = new IntersectionObserver(
      ([entry]) => { headGone.value = !entry.isIntersecting },
      { threshold: 0 }
    )
    headObserver.observe(headRef.value)
  }
  if (othersRef.value) {
    othersObserver = new IntersectionObserver(
      ([entry]) => { othersSeen.value = entry.isIntersecting },
      { rootMargin: '-10% 0px 0px 0px', threshold: 0 }
    )
    othersObserver.observe(othersRef.value)
  }
})

onUnmounted(() => {
  window.removeEventListener('scroll', onScroll)
  window.removeEventListener('resize', onScroll)
  if (barFrame) cancelAnimationFrame(barFrame)
  headObserver?.disconnect()
  othersObserver?.disconnect()
})

// На карточках объектов — только съёмка с дрона: готовый объект целиком.
// Цеховые и процессные кадры сюда не берём, у каждой плитки свой фрагмент,
// чтобы соседние не выглядели одинаково.
const PROJECT_CLIPS = [
  '/videos/mosaic/esp_drone1_200826.mp4',
  '/videos/mosaic/esp_drone2_200826.mp4',
  '/videos/mosaic/esp_drone3_200826.mp4',
  '/videos/mosaic/esp_drone4_200826.mp4',
  '/videos/mosaic/esp_drone5_200826.mp4',
  '/videos/mosaic/esp_drone6_200826.mp4'
]
const projectClip = (i) => PROJECT_CLIPS[i % PROJECT_CLIPS.length]
// Объекты из анкеты идут после проектов, поэтому смещаем выборку роликов —
// иначе соседние плитки крутили бы один и тот же фрагмент.
const objectClip = (i) => PROJECT_CLIPS[(i + relatedProjects.value.length) % PROJECT_CLIPS.length]
const projectPoster = (i) => relatedProjects.value[i]?.gallery?.[0] || '/images/team/office-poster.jpg'

useHead(() => ({
  title: expert.value ? `${expert.value.name} — ${expert.value.role} | ESP` : 'Эксперт не найден | ESP',
  meta: [
    { name: 'description', content: expert.value ? `Профиль эксперта ESP: ${expert.value.name}, ${expert.value.role}. Биография, компетенции, реализованные проекты.` : '' },
    { property: 'og:title', content: expert.value ? `${expert.value.name} — ${expert.value.role}` : '' },
    { property: 'og:image', content: expert.value ? `https://ecoservisproekt.com${expert.value.photo}` : '' }
  ],
  link: [{ rel: 'canonical', href: expert.value ? `https://ecoservisproekt.com/team/${expert.value.slug}` : '' }]
}))

useSchemaOrg([
  definePerson(() => ({
    name: expert.value?.name,
    jobTitle: expert.value?.role,
    image: expert.value ? `https://ecoservisproekt.com${expert.value.photo}` : undefined,
    worksFor: 'ЭкоСервисПроект (ESP)',
  })),
  defineBreadcrumb(() => ([
    { name: 'Команда', item: '/team' },
    { name: expert.value?.name }
  ]))
])
</script>

<style scoped>
/* Этапы работы: метка слева может быть и годом, и словом «Этап 3», поэтому
   колонка тянется по содержимому, а не прибита к ширине четырёх цифр. */
.ex-steps {
  display: flex;
  flex-direction: column;
  gap: 2.25rem;
}
.ex-step {
  display: grid;
  grid-template-columns: minmax(3.5rem, max-content) 1fr;
  gap: 1.5rem;
  align-items: start;
}
.ex-step-mark {
  color: #0057b8;
  font-size: 0.82rem;
  letter-spacing: 0.02em;
  padding-top: 0.3rem;
  white-space: nowrap;
}
.ex-step-body {
  border-left: 1px solid #ededed;
  padding-left: 1.5rem;
}

/* Компетенции: тот же ритм, что у шкал инструментов, но без придуманных
   процентов — в анкете их нет. */
.ex-comps {
  display: flex;
  flex-direction: column;
  gap: 0;
}
.ex-comp {
  display: grid;
  grid-template-columns: 2.5rem 1fr;
  gap: 1rem;
  align-items: baseline;
  padding: 0.9rem 0;
  border-top: 1px solid #ededed;
}
.ex-comp:last-child { border-bottom: 1px solid #ededed; }
.ex-comp-num {
  color: #0057b8;
  font-size: 0.78rem;
}
.ex-comp-text {
  color: rgba(26, 26, 26, 0.75);
  line-height: 1.55;
}
.ex-project.is-static { cursor: default; }

/* На этой странице секции не задают горизонтальных полей, и на телефоне
   текст упирался в края экрана. Гуттер держим на самих контейнерах. */
.container-custom {
  padding-left: 1.25rem;
  padding-right: 1.25rem;
}
@media (min-width: 640px) {
  .container-custom {
    padding-left: 1.5rem;
    padding-right: 1.5rem;
  }
}

/* Высота шапки сайта — на неё опираются оба липких элемента. */
.ex-hero { --site-header: 5.5rem; padding: 3.5rem 0 5rem; }

.ex-grid {
  display: grid;
  grid-template-columns: minmax(0, 5fr) minmax(0, 7fr);
  gap: clamp(2rem, 4vw, 4.5rem);
  align-items: start;
}

/* Портрет держится у верхнего края, пока рядом листается текст. */
.ex-photo-col {
  /* align-self обязателен: грид-элемент по умолчанию растягивается на всю
     высоту строки, и тогда прилипать ему просто некуда. */
  align-self: start;
  position: sticky;
  top: 6.5rem;
  /* Липкий блок обязан помещаться в экран: то, что выше вьюпорта, браузер
     прижимает низом, и портрет продолжает уезжать вверх. */
  max-height: calc(100vh - 7.5rem);
}
.ex-photo {
  background: #f1f3f5;
  border-radius: 0.25rem;
  overflow: hidden;
  /* Ограничиваем высотой экрана, ширину отдаём колонке: кадр вписывается
     целиком и не режется ни по вертикали, ни по горизонтали. */
  max-height: calc(100vh - 9rem);
  display: flex;
  align-items: center;
  justify-content: center;
}
.ex-photo-img {
  width: 100%;
  height: auto;
  max-height: calc(100vh - 9rem);
  object-fit: contain;
  display: block;
}

.ex-head { scroll-margin-top: 7rem; }
.ex-section {
  margin-top: clamp(2.5rem, 5vh, 4rem);
  padding-top: clamp(2rem, 4vh, 3rem);
  border-top: 1px solid #ededed;
}

/* ── Компактная шапка ── */
.ex-sticky-head {
  position: fixed;
  /* top задаётся из скрипта — по фактическому низу шапки сайта */
  left: 0;
  right: 0;
  z-index: 40;
  background: rgba(255, 255, 255, 0.92);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid #ededed;
  transform: translateY(-120%);
  opacity: 0;
  transition: transform 0.28s ease, opacity 0.28s ease;
  pointer-events: none;
}
.ex-sticky-head.is-on { transform: none; opacity: 1; }
.ex-sticky-inner {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  /* только по вертикали: шорткат обнулял боковые поля контейнера,
     и фото с именем упирались в край экрана */
  padding-top: 0.6rem;
  padding-bottom: 0.6rem;
}
.ex-sticky-photo {
  width: 34px;
  height: 34px;
  border-radius: 50%;
  object-fit: cover;
  object-position: center 20%;
  flex-shrink: 0;
}
.ex-sticky-name {
  font-size: 1rem;
  font-weight: 600;
  color: #1a1a1a;
  white-space: nowrap;
}
.ex-sticky-role {
  font-size: 0.85rem;
  color: rgba(26, 26, 26, 0.55);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* ── Карточки проектов ── */
.ex-projects {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(15rem, 1fr));
  gap: 1rem;
}
.ex-project {
  position: relative;
  display: block;
  aspect-ratio: 16 / 10;
  overflow: hidden;
  border-radius: 0.35rem;
  background: #0b0e13;
}
.ex-project-video {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  transition: transform 0.5s ease;
}
.ex-project:hover .ex-project-video { transform: scale(1.04); }
.ex-project-scrim {
  position: absolute;
  inset: 0;
  background: linear-gradient(to top, rgba(0, 0, 0, 0.78) 0%, rgba(0, 0, 0, 0) 58%);
}
.ex-project-text {
  position: absolute;
  left: 1rem;
  right: 1rem;
  bottom: 0.9rem;
  display: grid;
  gap: 0.15rem;
  color: #fff;
}
.ex-project-text b { font-size: 1rem; font-weight: 600; line-height: 1.25; }
.ex-project-text i { font-style: normal; font-size: 0.82rem; color: rgba(255, 255, 255, 0.7); }

@media (max-width: 900px) {
  .ex-grid { grid-template-columns: 1fr; }
  .ex-photo-col { position: static; }
  .ex-photo, .ex-photo-img { max-height: 70vh; }
  .ex-sticky-role { display: none; }
}

@media (prefers-reduced-motion: reduce) {
  .ex-sticky-head, .ex-project-video { transition: none; }
}
</style>
