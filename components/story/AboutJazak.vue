<template>
  <!-- История «О компании» по механике jazakvoda.rs (спека: jazak_MOTION_SPEC.md,
       чертёж: docs/about-jazak-blueprint.md). Слои — из Figma (см. LAYERS в скрипте).
       Сцена A: море → тоннель из колец породы → небо опускается, облака.
       Сцена B: кусты опускаются, лес, дерево/папоротник/кусты проходят поперёк.
       Контент: окно в листве со знаком ESP, тексты, оборудование ESP у ручья, финал со знаком. -->
  <div ref="root" class="jz" :class="{ 'is-ready': ready }">
    <StoryDropLoader
      v-if="!loaderGone"
      :assets="preload"
      :bg="LAYERS.seaSm"
      bright
      caption="Произведено в Республике Беларусь"
      :min-time="seen ? 700 : 2000"
      @done="onLoaded"
    />

    <button
      v-show="!pastStory"
      type="button"
      class="jz-sound"
      :class="{ 'is-on': soundOn }"
      :aria-pressed="soundOn"
      :aria-label="soundOn ? 'Выключить звук' : 'Включить звук'"
      @click="toggleSound"
    >
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <line v-for="(x, i) in [5, 9, 13, 17, 21]" :key="x" :x1="x" :x2="x" y1="6" y2="18" :style="{ animationDelay: `${i * 0.12}s` }" />
      </svg>
    </button>

    <!-- ================= ДЕСКТОП: сцены A и B (закреплённые) ================= -->
    <div class="jz-intro">
      <section ref="seaSec" class="jz-sea">
        <div ref="seaBox" class="jz-sea__box">
          <img ref="seaImg" class="jz-sea__img" :src="LAYERS.sea" :srcset="`${LAYERS.seaSm} 1200w, ${LAYERS.sea} 2401w`" sizes="140vw" alt="Бурная синяя вода, вид сверху" fetchpriority="high" />
          <img v-for="n in 4" :key="`c${n}`" :ref="(el) => (clouds[n - 1] = el)" class="jz-cloud" :class="`jz-cloud--${n}`" :src="n % 2 ? LAYERS.cloudOne : LAYERS.cloudTwo" alt="" />

          <article ref="seaText" class="jz-say jz-say--sea" :class="seaStep">
            <h1 class="jz-say__h">Мы архитекторы технологий очистки воды</h1>
            <span class="jz-say__break" aria-hidden="true"><i /><b /><i /></span>
            <p class="jz-say__p">28 лет опыта. Экосистема, состоящая из 30&nbsp;000 элементов.</p>
          </article>

          <div ref="rocksEl" class="jz-rocks" aria-hidden="true">
            <div ref="rockBack" class="jz-rocks__back" />
            <div ref="rockCap" class="jz-rocks__cap" />
            <div v-for="(r, i) in rocks" :key="`r${i}`" :ref="(el) => (rockBoxes[i] = el)" class="jz-rock" :class="`jz-rock--${i}`" :style="r.box">
              <img :ref="(el) => (rockImgs[i] = el)" :src="r.src" alt="" />
            </div>
          </div>

          <!-- Небо (sky.png): градиент неба, облака, кромка леса снизу -->
          <div ref="skyEl" class="jz-sky" aria-hidden="true">
            <img class="jz-sky__cloud jz-sky__cloud--a" :src="LAYERS.cloudOne" alt="" />
            <img class="jz-sky__cloud jz-sky__cloud--b" :src="LAYERS.cloudTwo" alt="" />
            <img class="jz-sky__crest" :src="LAYERS.bushBottom" alt="" />
          </div>
          <img ref="cloudStrip" class="jz-clouds" :src="LAYERS.cloudOne" alt="" />

          <article ref="rockText" class="jz-say jz-say--rock" :class="[rockStep, { 'is-active': rockActive }]">
            <h2 class="jz-say__h">Природа очищает воду слой за слоем</h2>
            <span class="jz-say__break" aria-hidden="true"><i /><b /><i /></span>
            <p class="jz-say__p">Песок, глина и корни фильтруют её веками. Мы переняли этот принцип у самой земли.</p>
          </article>
        </div>
      </section>

      <section ref="bushSec" class="jz-bushes" :class="{ 'is-hide': bushesHidden }">
        <div ref="bushBox" class="jz-bushes__box">
          <article class="jz-say jz-say--bush" :class="[bushStep, { 'is-active': bushActive }]">
            <h2 class="jz-say__h">И природа возвращается</h2>
            <span class="jz-say__break" aria-hidden="true"><i /><b /><i /></span>
            <p class="jz-say__p">Старые поля фильтрации рекультивируем — на их месте лес или поле. Станцией управляет ИИ 24/7.</p>
          </article>

          <img ref="bushPlate" class="jz-bplate" :src="LAYERS.bushes" alt="" loading="lazy" />
          <!-- Лес-подложка (jungle.png нет в снимке): крона, кусты, трава -->
          <div ref="jungle" class="jz-jungle" aria-hidden="true">
            <img class="jz-jungle__crown" :src="LAYERS.krosnja" alt="" loading="lazy" />
            <img class="jz-jungle__tree jz-jungle__tree--l" :src="LAYERS.bannerTreeLeft" alt="" loading="lazy" />
            <img class="jz-jungle__tree jz-jungle__tree--r" :src="LAYERS.bannerTreeRight" alt="" loading="lazy" />
            <img class="jz-jungle__floor" :src="LAYERS.bushBottom" alt="" loading="lazy" />
          </div>
          <img ref="tree" class="jz-tree" :src="LAYERS.bannerTreeRight" alt="" loading="lazy" />
          <img ref="fern" class="jz-fern" :src="LAYERS.fern" alt="" loading="lazy" />
          <div ref="leftBushBox" class="jz-lbush"><img ref="leftBush" :src="LAYERS.bannerTreeLeft" alt="" loading="lazy" /></div>
          <img ref="rightBush" class="jz-rbush" :src="LAYERS.zbun1" alt="" loading="lazy" />
        </div>
      </section>
    </div>

    <!-- ================= МОБИЛЬНЫЙ / reduced-motion: та же история без закрепления ================= -->
    <div class="jz-flat">
      <section class="jzf jzf--sea">
        <img class="jzf__bg" :src="LAYERS.seaSm" alt="Бурная синяя вода, вид сверху" loading="lazy" />
        <img class="jzf__cloud jzf__cloud--a" :src="LAYERS.cloudOne" alt="" loading="lazy" />
        <img class="jzf__cloud jzf__cloud--b" :src="LAYERS.cloudTwo" alt="" loading="lazy" />
        <article class="jzf__say">
          <h1 class="jz-say__h">Мы архитекторы технологий очистки воды</h1>
          <span class="jz-say__break" aria-hidden="true"><i /><b /><i /></span>
          <p class="jz-say__p">28 лет опыта. Экосистема, состоящая из 30&nbsp;000 элементов.</p>
        </article>
      </section>
      <section class="jzf jzf--rock">
        <img class="jzf__bg" :src="LAYERS.seaSm" alt="" loading="lazy" />
        <span class="jzf__back" aria-hidden="true" />
        <img v-for="n in 5" :key="`fr${n}`" class="jzf__ring" :style="{ zIndex: 9 - n, '--s': Math.pow(0.82, n - 1) }" :src="n % 2 ? LAYERS.rockZero : LAYERS.rockOne" alt="" loading="lazy" />
        <article class="jzf__say">
          <h2 class="jz-say__h">Природа очищает воду слой за слоем</h2>
          <span class="jz-say__break" aria-hidden="true"><i /><b /><i /></span>
          <p class="jz-say__p">Песок, глина и корни фильтруют её веками. Мы переняли этот принцип у самой земли.</p>
        </article>
      </section>
      <section class="jzf jzf--forest">
        <img class="jzf__bg" :src="LAYERS.bushes" alt="" loading="lazy" />
        <img class="jzf__fern" :src="LAYERS.fern" alt="" loading="lazy" />
        <article class="jzf__say">
          <h2 class="jz-say__h">И природа возвращается</h2>
          <span class="jz-say__break" aria-hidden="true"><i /><b /><i /></span>
          <p class="jz-say__p">Старые поля фильтрации рекультивируем — на их месте лес или поле. Станцией управляет ИИ 24/7.</p>
        </article>
      </section>
    </div>

    <!-- ================= КОНТЕНТ (закреплён на 80vw под уходящими кустами) ================= -->
    <div class="jz-content-fix">
      <div ref="content" class="jz-content">
        <div class="jz-content__overlay" aria-hidden="true" />

        <!-- Баннер: окно в листве, водопад, облака, знак ESP (вместо логотипа Jazak) -->
        <section class="jz-banner">
          <div class="jz-banner__hero">
            <div class="jz-banner__clouds" aria-hidden="true">
              <img ref="heroCloud1" class="jz-banner__cloud jz-banner__cloud--1" :src="LAYERS.heroClouds" alt="" loading="lazy" />
              <img ref="heroCloud2" class="jz-banner__cloud jz-banner__cloud--2" :src="LAYERS.heroClouds" alt="" loading="lazy" />
            </div>
            <img class="jz-banner__back" :src="LAYERS.heroBack" alt="" loading="lazy" />
            <div class="jz-banner__front-box">
              <img class="jz-banner__front" :src="LAYERS.heroFront" alt="Окно в густой листве и водопад" loading="lazy" />
              <span class="jz-banner__water" :style="{ backgroundImage: `url(${LAYERS.heroFrontWater})` }" aria-hidden="true" />
            </div>
            <img class="jz-banner__logo" :class="{ 'is-active': logoOn }" src="/logo-esp.svg" alt="ESP" />
          </div>
          <img class="jz-banner__tree jz-banner__tree--l" :src="LAYERS.bannerTreeLeft" alt="" loading="lazy" />
          <img class="jz-banner__tree jz-banner__tree--r" :src="LAYERS.bannerTreeRight" alt="" loading="lazy" />
          <div ref="bannerBush" class="jz-banner__bush" aria-hidden="true">
            <img class="jz-banner__bush-img" :src="LAYERS.bannerBush" alt="" loading="lazy" />
            <img class="jz-banner__branch jz-banner__branch--r" :class="{ 'is-shake': branchShake }" :src="LAYERS.bannerBranchRight" alt="" loading="lazy" />
            <img class="jz-banner__branch jz-banner__branch--l" :src="LAYERS.bannerBranchLeft" alt="" loading="lazy" />
          </div>
        </section>

        <!-- Текст 1 -->
        <section class="jz-about jz-about--one" data-about>
          <img class="jz-about__frame" :src="LAYERS.krosnja" alt="" loading="lazy" />
          <div class="jz-about__inner">
            <h2 class="jz-about__heading">Решения<br />на базе USBF</h2>
            <div class="jz-about__right">
              <p><b>Технология USBF</b></p>
              <p>Внедряем технологию USBF под задачи конкретного объекта. Опираемся на 28 лет практики в биологической очистке сточных вод. Используем передовые разработки.</p>
              <p>Мы архитекторы технологий очистки воды: 28 лет опыта и экосистема из 30&nbsp;000 элементов.</p>
            </div>
          </div>
          <div class="jz-about__leafs" aria-hidden="true">
            <img v-for="n in 8" :key="`l${n}`" :class="`jz-leaf jz-leaf--${n}`" :src="n % 2 ? LAYERS.bannerBranchLeft : LAYERS.bannerBranchRight" alt="" loading="lazy" />
          </div>
          <img class="jz-about__branch" :src="LAYERS.bannerBranchRight" alt="" loading="lazy" />
        </section>

        <!-- Ручей и оборудование ESP на мшистой кочке (место бутылки vitaminska) -->
        <section ref="streamSec" class="jz-stream" :class="{ 'is-live': prodLive }">
          <img class="jz-stream__branch" :src="LAYERS.streamBranch" alt="" loading="lazy" />
          <span class="jz-stream__water" :style="{ backgroundImage: `url(${LAYERS.streamWater})` }" aria-hidden="true" />
          <img class="jz-stream__fern" :src="LAYERS.fern" alt="" loading="lazy" />
          <img class="jz-stream__bush jz-stream__bush--l" :src="LAYERS.negBushBottom" alt="" loading="lazy" />
          <img class="jz-stream__bush jz-stream__bush--r" :src="LAYERS.zbun2" alt="" loading="lazy" />

          <div
            class="jz-prod"
            @pointerdown="dragStart"
            @pointermove="dragMove"
            @pointerup="dragEnd"
            @pointercancel="dragEnd"
            @pointerleave="dragEnd"
          >
            <img class="jz-prod__moss" :src="LAYERS.trava" alt="" loading="lazy" draggable="false" />
            <span class="jz-prod__shadow" :class="{ 'is-on': prodLive }" :key="`sh${prodIdx}`" aria-hidden="true" />
            <div class="jz-prod__mask">
              <NuxtLink
                v-for="(p, i) in products"
                :key="p.slug"
                :to="`/equipment/${p.slug}`"
                class="jz-prod__slide"
                :class="{ 'is-active': prodLive && i === prodIdx, 'was-active': i === prevIdx }"
                :tabindex="i === prodIdx ? 0 : -1"
                :aria-hidden="i !== prodIdx"
                draggable="false"
              >
                <img :src="p.src" :alt="p.name" loading="lazy" draggable="false" />
              </NuxtLink>
            </div>
            <img class="jz-prod__front" :src="LAYERS.bushBottom" alt="" loading="lazy" draggable="false" />
            <div class="jz-prod__leafs" :class="{ 'is-active': leafPuff }" aria-hidden="true">
              <img v-for="n in 5" :key="`pl${n}`" :class="`jz-pleaf jz-pleaf--${n}`" :src="n % 2 ? LAYERS.bannerBranchLeft : LAYERS.bannerBranchRight" alt="" loading="lazy" />
            </div>
            <p class="jz-prod__title">
              <span>{{ String(prodIdx + 1).padStart(2, '0') }} / {{ String(products.length).padStart(2, '0') }}</span>
              {{ products[prodIdx].name }}
            </p>
            <button type="button" class="jz-prod__arrow jz-prod__arrow--l" aria-label="Предыдущее оборудование" @click="shift(-1)">
              <svg viewBox="0 0 31 55" aria-hidden="true"><path d="M29 2L3 27.5 29 53" /></svg>
            </button>
            <button type="button" class="jz-prod__arrow jz-prod__arrow--r" aria-label="Следующее оборудование" @click="shift(1)">
              <svg viewBox="0 0 31 55" aria-hidden="true"><path d="M2 2l26 25.5L2 53" /></svg>
            </button>
          </div>

          <div class="jz-spot">
            <button type="button" class="jz-hot" :class="{ 'is-open': spot }" :aria-expanded="spot" aria-label="Собственный цех" @click="spot = !spot">
              <svg viewBox="0 0 47 47" aria-hidden="true"><circle class="jz-hot__big" cx="23.5" cy="23.5" r="22" /><circle class="jz-hot__small" cx="23.5" cy="23.5" r="13" /><circle class="jz-hot__dot" cx="23.5" cy="23.5" r="5" /><path class="jz-hot__x" d="M18 18l11 11M29 18L18 29" /></svg>
            </button>
            <p class="jz-hot__card" :class="{ 'is-open': spot }"><b>Собственный цех</b>Оборудование ESP производится в Заславле. Точность в каждой детали. Качество в каждом узле.</p>
          </div>
        </section>

        <!-- Текст 2 -->
        <section class="jz-about jz-about--two" data-about>
          <img class="jz-about__frame jz-about__frame--low" :src="LAYERS.zbun1" alt="" loading="lazy" />
          <div class="jz-about__inner">
            <h2 class="jz-about__heading">Производство<br />и инжиниринг</h2>
            <div class="jz-about__right">
              <p><b>Собственный цех</b></p>
              <p>Точность в каждой детали. Качество в каждом узле. <NuxtLink to="/equipment" class="jz-more">Каталог оборудования ›</NuxtLink></p>
              <p><b>Проектирование</b></p>
              <p>Проектируем будущее с точностью до миллиметра. Дрон с лидаром облетает площадку и собирает облако из миллионов точек с сантиметровой точностью.</p>
              <p>На облаке точек рисуем линии новой станции: она встаёт на место старых сооружений и занимает в разы меньше площади. Жизнеспособное оставляем, остальное — под демонтаж.</p>
            </div>
          </div>
          <div class="jz-about__leafs" aria-hidden="true">
            <img v-for="n in 8" :key="`m${n}`" :class="`jz-leaf jz-leaf--${n}`" :src="n % 2 ? LAYERS.bannerBranchRight : LAYERS.bannerBranchLeft" alt="" loading="lazy" />
          </div>
        </section>

        <!-- Финал (imuno): знак ESP поднимается из-за кустов под кроной -->
        <section ref="signSec" class="jz-sign">
          <img class="jz-sign__crown" :src="LAYERS.krosnja" alt="" loading="lazy" />
          <div class="jz-sign__inner">
            <img class="jz-sign__lijana" :src="LAYERS.lijana" alt="" loading="lazy" />
            <img class="jz-sign__trava" :src="LAYERS.trava" alt="" loading="lazy" />
            <div class="jz-sign__drop" :class="{ 'is-hidden': !signOn }">
              <img src="/logo-esp.svg" alt="Знак ESP" />
            </div>
            <img class="jz-sign__zbun2" :src="LAYERS.zbun2" alt="" loading="lazy" />
            <img class="jz-sign__zbun1 jz-sign__zbun1--a" :src="LAYERS.zbun1" alt="" loading="lazy" />
            <img class="jz-sign__zbun1 jz-sign__zbun1--b" :src="LAYERS.zbun1" alt="" loading="lazy" />
            <div class="jz-sign__title" :class="{ 'is-hidden': !signOn }">
              <b>Эталон качества</b>
              Кристальный просвет — стандарт прозрачности очищенной воды
            </div>
          </div>
          <div class="jz-about jz-about--four" data-about>
            <div class="jz-about__inner jz-about__inner--static">
              <h2 class="jz-about__heading">Кристальная чистота воды с&nbsp;просветом 4&nbsp;метра</h2>
              <div class="jz-about__right">
                <p>Произведено в Республике Беларусь.</p>
                <p><a href="#quality" class="jz-more" @click.prevent="emit('jump', '#quality')">Подробнее о знаке ›</a></p>
              </div>
            </div>
          </div>
        </section>
        <div class="jz-content__fade" aria-hidden="true" />
      </div>
    </div>

    <svg class="jz-filters" aria-hidden="true" width="0" height="0">
      <filter id="jz-turb">
        <feTurbulence type="turbulence" baseFrequency="0.02 0.05" numOctaves="1" seed="2" result="t">
          <animate attributeName="baseFrequency" dur="60s" keyTimes="0;0.5;1" values="0.02 0.25;0.02 0.55;0.02 0.25" repeatCount="indefinite" />
        </feTurbulence>
        <feDisplacementMap in="SourceGraphic" in2="t" scale="30" />
      </filter>
      <filter id="jz-turb2">
        <feTurbulence type="turbulence" baseFrequency="0.01 0.01" numOctaves="1" seed="0" result="t">
          <animate attributeName="baseFrequency" dur="60s" values="0.02 0.2;0.02 0.5;0.02 0.2" repeatCount="indefinite" />
        </feTurbulence>
        <feDisplacementMap in="SourceGraphic" in2="t" scale="10" xChannelSelector="R" yChannelSelector="G" />
      </filter>
    </svg>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, nextTick } from 'vue'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

const emit = defineEmits(['jump'])

// ===== Слои сцены =====
// Временные слои-референс jazakvoda: перед публикацией заменить своими или получить разрешение правообладателя.
// Источник: Figma CDYW4Z1KRNKjTRqItstupe, секция 1:28131 (id узлов — в комментариях). Бутылки и логотип Jazak исключены.
const J = '/images/about-jz/'
const LAYERS = {
  sea: `${J}sea.webp`, // More 1:28137
  seaSm: `${J}sea-sm.webp`,
  cloudOne: `${J}cloud-one.webp`, // Oblak 1:28138 / 1:28140
  cloudTwo: `${J}cloud-two.webp`, // Oblak 1:28139 / 1:28141
  rockZero: `${J}rock-zero.webp`, // Stena 1:28151
  rockOne: `${J}rock-one.webp`, // Stena 1:28152
  bushes: `${J}bushes.webp`, // Zbunje 1:28342
  heroFront: `${J}hero-front.webp`, // Zbunje 1:28163
  heroFrontWater: `${J}hero-front-water.webp`, // 1:28164
  heroBack: `${J}hero-back.webp`, // Zbunje 1:28157
  heroClouds: `${J}hero-clouds.webp`, // Oblaci 1:28160 / 1:28161
  bannerTreeLeft: `${J}banner-tree-left.webp`, // Zbunje 1:28165
  bannerTreeRight: `${J}banner-tree-right.webp`, // Zbunje 1:28166
  bannerBush: `${J}banner-bush.webp`, // Zbun 1:28168
  bannerBranchLeft: `${J}banner-branch-left.webp`, // Grana 1:28170
  bannerBranchRight: `${J}banner-branch-right.webp`, // Grana 1:28169
  krosnja: `${J}imuno-krosnja.webp`, // Zbunje 1:28270
  zbun1: `${J}imuno-zbun1.webp`, // Zbunje 1:28268 / 1:28269
  zbun2: `${J}imuno-zbun2.webp`, // Zbunje 1:28266
  trava: `${J}trava.webp`, // Zbunje 1:28267
  lijana: `${J}lijana.webp`, // Zbunje 1:28276
  fern: `${J}vitaminska-fern.webp`, // Paprat 1:28320
  bushBottom: `${J}vitaminska-bush-bottom.webp`, // Zbunje 1:28338
  negBushBottom: `${J}negazirana-bush-bottom.webp`, // Zbunje 1:28216
  streamBranch: `${J}stream-branch.webp`, // Grana 1:28236
  streamWater: `${J}stream-water.webp` // 1:28239
}

// ===== Герой сцены у ручья (вместо бутылки): оборудование ESP =====
// Для 3D-рендеров поменяйте HERO_PRODUCT_DIR (прозрачные webp, обрезанные по краю); первый в списке — главный.
const HERO_PRODUCT_DIR = '/images/equipment/cut/'
const HERO_PRODUCTS = [
  ['flotation', 'flotation-units'],
  ['polymer-station', 'polymer-dosing-station'],
  ['microfilter', 'microfilters-sand-traps'],
  ['belt-filter-press', 'filter-press'],
  ['rotary-drum-sieve', 'rotary-drum-sieve'],
  ['sand-separator', 'sand-separator'],
  ['screw-conveyor', 'screw-conveyor']
]
const { getBySlug } = useEquipment()
const products = HERO_PRODUCTS.map(([file, slug]) => ({ src: `${HERO_PRODUCT_DIR}${file}.webp`, slug, name: getBySlug(slug)?.name || '' }))

const { on: soundOn, toggle: toggleSound, setScene, dispose: disposeSound } = useDropAmbience()

// ===== 15 колец породы (jazak rock-zero…fourteen) =====
// В снимке Figma есть только два кольца (Stena); остальные — те же кольца с поворотом/зеркалом
// и масштабом 0.9^i, чтобы тоннель сужался так же, как у jazak.
const rockPos = [
  ['calc(50vw - .1042vw)', 50, 24], ['calc(50vw - .1042vw)', 50, 23], ['calc(50vw - .1042vw)', 50, 21],
  ['50vw', 50, 20], ['50vw', 50, 19], ['50vw', 47, 18], ['53vw', 46, 17], ['51vw', 50, 16], ['50vw', 50, 15],
  ['50vw', 49, 14], ['50vw', 49, 13], ['50vw', 50, 12], ['50vw', 50, 11], ['51vw', 52, 10], ['51vw', 52, 9]
]
const FLIPS = ['', 'r', 'm', 'rm']
const rocks = rockPos.map(([left, top, z], i) => {
  const f = FLIPS[i % 4]
  return {
    src: i % 2 ? LAYERS.rockOne : LAYERS.rockZero,
    end: i < 13 ? Math.pow(0.9, i) : Math.pow(0.9, 12) * 0.7,
    box: { left, top: `${top}vh`, zIndex: z, transform: `translate(-50%, -50%)${f.includes('r') ? ' rotate(180deg)' : ''}${f.includes('m') ? ' scaleX(-1)' : ''}` }
  }
})

const preload = [LAYERS.sea, LAYERS.cloudOne, LAYERS.cloudTwo, LAYERS.rockZero, LAYERS.rockOne, LAYERS.bushBottom]

// ===== Refs =====
const root = ref(null)
const seaSec = ref(null); const seaBox = ref(null); const seaImg = ref(null); const seaText = ref(null)
const clouds = []
const rocksEl = ref(null); const rockBack = ref(null); const rockCap = ref(null); const rockBoxes = []; const rockImgs = []
const skyEl = ref(null); const cloudStrip = ref(null); const rockText = ref(null)
const bushSec = ref(null); const bushBox = ref(null); const bushPlate = ref(null); const jungle = ref(null)
const tree = ref(null); const fern = ref(null); const leftBushBox = ref(null); const leftBush = ref(null); const rightBush = ref(null)
const content = ref(null); const heroCloud1 = ref(null); const heroCloud2 = ref(null); const bannerBush = ref(null)
const streamSec = ref(null); const signSec = ref(null)

// ===== Состояние (классы-«биты», как .show-first/.show-second/.active у jazak) =====
const loaderGone = ref(false)
const seen = ref(false)
const ready = ref(false)
const seaStep = ref('show-first')
const rockStep = ref('show-first')
const rockActive = ref(false)
const bushStep = ref('show-first')
const bushActive = ref(false)
const bushesHidden = ref(false)
const logoOn = ref(false)
const branchShake = ref(false)
const pastStory = ref(false)
const signOn = ref(false)
const spot = ref(false)

// ===== Слайдер оборудования (jazak slider.js) =====
const prodIdx = ref(0)
const prevIdx = ref(-1)
const prodLive = ref(false)
const leafPuff = ref(false)
let puffT = 0
const shift = (d) => {
  if (!leafPuff.value) {
    leafPuff.value = true
    clearTimeout(puffT)
    puffT = setTimeout(() => { leafPuff.value = false }, 1000)
  }
  prevIdx.value = prodIdx.value
  prodIdx.value = (prodIdx.value + d + products.length) % products.length
}
let dragX = null
const dragStart = (e) => { if (e.pointerType === 'mouse' && e.button !== 0) return; dragX = e.clientX }
const dragMove = (e) => {
  if (dragX === null) return
  const dx = e.clientX - dragX
  if (Math.abs(dx) > 100) { shift(dx > 0 ? -1 : 1); dragX = null }
}
const dragEnd = () => { dragX = null }

// ===== Загрузка =====
const lockScroll = (v) => { document.documentElement.style.overflow = v ? 'hidden' : '' }
const onLoaded = () => {
  loaderGone.value = true
  ready.value = true
  lockScroll(false)
  try { sessionStorage.setItem('jz-seen', '1') } catch {}
  ScrollTrigger.refresh()
}

let ctx = null
let mm = null
let prevRestoration = 'auto'

onMounted(async () => {
  try { seen.value = sessionStorage.getItem('jz-seen') === '1' } catch {}
  prevRestoration = history.scrollRestoration
  history.scrollRestoration = 'manual'
  window.scrollTo(0, 0)
  lockScroll(true)
  await nextTick()

  gsap.registerPlugin(ScrollTrigger)
  const W = () => window.innerWidth
  const vw = (n) => (n * W()) / 100
  // Начало истории в документе (под шапкой может быть отступ)
  const S0 = () => (root.value ? root.value.getBoundingClientRect().top + window.scrollY : 0)
  const SCRUB = 0.6 // мягкость, близкая к Locomotive lerp 0.1 на нативном скролле
  // Отрезок прокрутки «маркер jazak»: начало и длина в vw от верха истории
  const at = (startVw, lenVw, extra = {}) => ({
    start: () => S0() + vw(startVw),
    end: () => S0() + vw(startVw + lenVw),
    scrub: SCRUB,
    invalidateOnRefresh: true,
    ...extra
  })
  // Переключатель-бит (end: +10px у jazak)
  const beat = (startPx, onOn, onOff) => ScrollTrigger.create({ start: startPx, end: () => startPx() + 10, onEnter: onOn, onLeaveBack: onOff })

  ctx = gsap.context(() => {
    mm = gsap.matchMedia()

    // Звук/кнопка — пока идёт история
    ScrollTrigger.create({
      trigger: content.value,
      start: 'bottom 60%',
      onEnter: () => { pastStory.value = true; setScene('dark'); if (soundOn.value) toggleSound() },
      onLeaveBack: () => { pastStory.value = false }
    })

    // Появление текстовых блоков (about-text: заголовок .3s, абзацы .5s со сдвигом .1s, листопад)
    gsap.utils.toArray('[data-about]').forEach((el) => {
      ScrollTrigger.create({ trigger: el, start: 'top 62%', once: true, onEnter: () => el.classList.add('is-active') })
    })
    // Слайдер «оживает» при входе в кадр — первая машина выпрыгивает на камень
    ScrollTrigger.create({ trigger: streamSec.value, start: 'top 55%', once: true, onEnter: () => { prodLive.value = true } })
    // Знак качества поднимается (imuno: 2s jumpUp)
    ScrollTrigger.create({ trigger: signSec.value, start: 'top 45%', once: true, onEnter: () => { signOn.value = true } })

    mm.add({ desk: '(min-width: 768px) and (prefers-reduced-motion: no-preference)', wide: '(min-width: 1501px)' }, (c) => {
      const { desk, wide } = c.conditions
      if (!desk) { logoOn.value = true; return }

      // ---------------- СЦЕНА A ----------------
      const SEA = 494.79
      ScrollTrigger.create({ trigger: seaBox.value, start: () => S0(), end: () => S0() + vw(SEA), pin: true, pinSpacing: false, invalidateOnRefresh: true })
      ScrollTrigger.create({ start: () => S0(), end: () => S0() + vw(SEA), onEnter: () => setScene('water'), onEnterBack: () => setScene('water') })

      // A2: вода дрейфует вверх-вправо и наклоняется
      gsap.to(seaImg.value, { y: -320, x: 180, rotation: -3, ease: 'none', scrollTrigger: at(0, 260.42) })
      // A3–A6: облака с разной глубиной
      const cl = [[312.5, -78.125, 0], [208.33, -20.8333, 2.6042], [312.5, -41.6667, 5.2083], [312.5, -104.1667, 5.2083]]
      cl.forEach(([len, y, x], i) => gsap.to(clouds[i], { y: () => vw(y), x: () => vw(x), ease: 'none', scrollTrigger: at(0, len) }))
      // A7: текст воды уезжает вверх — открывается абзац
      beat(() => S0() + vw(83.7), () => { seaStep.value = 'show-second' }, () => { seaStep.value = 'show-first' })

      // Кольца породы: каждое сжимается к камере за 7.8125vw прокрутки
      rockImgs.forEach((el, i) => gsap.set(el, { scale: i < 2 ? 3 : i < 13 ? 2 * rocks[i].end : rocks[i].end }))
      gsap.set(rockImgs[13], { x: () => vw(4.63542) })
      gsap.set(rockImgs[14], { x: () => vw(-4.63542) })
      gsap.set(rockBoxes.slice(2), { autoAlpha: 0 })
      for (let i = 0; i < 15; i++) {
        const mark = i < 13 ? 120.4167 + i * 7.78125 : 221.57
        const box = rockBoxes[i]
        const toVars = i < 13 ? { scale: rocks[i].end } : { x: 0, y: 0 }
        gsap.to(rockImgs[i], {
          ...toVars,
          ease: 'none',
          scrollTrigger: at(mark, 7.8125, {
            onEnter: () => { if (i >= 2) gsap.set(box, { autoAlpha: 1 }); if (i === 2) setScene('earth') },
            onLeaveBack: () => { if (i >= 2) gsap.set(box, { autoAlpha: 0 }); if (i === 2) setScene('water') }
          })
        })
      }

      // Тёмная порода между кольцами (в снимке только два кольца — подложка закрывает зазоры)
      gsap.fromTo(rockBack.value, { autoAlpha: 0, scale: 2.2 }, { autoAlpha: 1, scale: 1, ease: 'none', scrollTrigger: at(128.2, 100) })

      // Кольца 13–14 смыкаются — отверстие закрывается породой
      gsap.fromTo(rockCap.value, { scale: 0 }, { scale: 1, ease: 'none', scrollTrigger: at(221.57, 7.8125) })

      // Небо со стеной опускается сверху; кольца проседают; полоса облаков
      gsap.fromTo(skyEl.value, { yPercent: -100 }, {
        yPercent: 0,
        ease: 'none',
        scrollTrigger: at(229.35, 416.67, { onEnter: () => { rockActive.value = true }, onLeaveBack: () => { rockActive.value = false } })
      })
      gsap.fromTo(skyEl.value, { autoAlpha: 0 }, { autoAlpha: 1, ease: 'none', immediateRender: true, scrollTrigger: at(229.35, 14) })
      gsap.to(rocksEl.value, { y: () => vw(10.8333), ease: 'power1.in', scrollTrigger: at(229.35, 182.29) })
      gsap.fromTo(cloudStrip.value, { xPercent: -100, y: () => vw(-58.177), autoAlpha: 0 }, {
        xPercent: 0,
        y: () => vw(-33),
        ease: 'none',
        scrollTrigger: at(245.71, 286.46, { onEnter: () => gsap.set(cloudStrip.value, { autoAlpha: 1 }), onLeaveBack: () => gsap.set(cloudStrip.value, { autoAlpha: 0 }) })
      })
      beat(() => S0() + vw(313.98), () => { rockStep.value = 'show-second' }, () => { rockStep.value = 'show-first' })

      // ---------------- СЦЕНА B ----------------
      const B = SEA - 24.0417 // верх блока кустов в документе
      ScrollTrigger.create({ trigger: bushBox.value, start: () => S0() + vw(B), end: () => S0() + vw(B + 386.46), pin: true, pinSpacing: false, invalidateOnRefresh: true })

      // B2: стена кустов уходит вниз, открывая лес
      gsap.to(bushPlate.value, {
        y: () => vw(wide ? 82 : 89),
        ease: 'none',
        scrollTrigger: at(B + 4.1667, 182.29, {
          onEnter: () => { bushActive.value = true; gsap.set(seaBox.value, { autoAlpha: 0 }); gsap.set(jungle.value, { autoAlpha: 1 }); setScene('forest') },
          onLeaveBack: () => { bushActive.value = false; gsap.set(seaBox.value, { autoAlpha: 1 }); gsap.set(jungle.value, { autoAlpha: 0 }); setScene('earth') }
        })
      })
      // B3: лес медленно уезжает вправо
      gsap.set(jungle.value, { autoAlpha: 0 })
      gsap.to(jungle.value, { xPercent: 50, ease: 'none', scrollTrigger: at(B + 4.1667, 442.71) })
      beat(() => S0() + vw(B + 66.6667), () => { bushStep.value = 'show-second' }, () => { bushStep.value = 'show-first' })
      // B4–B6: сосна, папоротник, куст проходят поперёк (из -100% в 150vw)
      gsap.set([tree.value, fern.value, rightBush.value, leftBush.value], { autoAlpha: 0 })
      gsap.fromTo(tree.value, { x: () => -tree.value.offsetWidth }, {
        x: () => vw(150), ease: 'none',
        scrollTrigger: at(B + 77.0833, 156.25, { onEnter: () => gsap.set(tree.value, { autoAlpha: 1 }), onLeaveBack: () => gsap.set(tree.value, { autoAlpha: 0 }) })
      })
      gsap.fromTo(fern.value, { x: () => -fern.value.offsetWidth }, {
        x: () => vw(150), ease: 'none',
        scrollTrigger: at(B + 77.0833, 156.25, { onEnter: () => gsap.set(fern.value, { autoAlpha: 1 }), onLeaveBack: () => gsap.set(fern.value, { autoAlpha: 0 }) })
      })
      gsap.fromTo(rightBush.value, { x: () => -rightBush.value.offsetWidth }, {
        x: () => vw(150), ease: 'none',
        scrollTrigger: at(B + 85.1458, 286.46, {
          onEnter: () => { gsap.set(rightBush.value, { autoAlpha: 1 }); gsap.set([seaText.value, rockText.value], { display: 'none' }) },
          onLeaveBack: () => { gsap.set(rightBush.value, { autoAlpha: 0 }); gsap.set([seaText.value, rockText.value], { display: '' }) },
          onLeave: () => { branchShake.value = true }
        })
      })
      // B7: левый куст накрывает кадр слева направо
      gsap.fromTo(leftBushBox.value, { x: () => -leftBushBox.value.offsetWidth }, {
        x: () => vw(150), ease: 'none',
        scrollTrigger: at(B + 138.2083, 260.42, {
          onEnter: () => { bushActive.value = false; gsap.set(leftBush.value, { autoAlpha: 1 }) },
          onLeaveBack: () => { bushActive.value = true; gsap.set(leftBush.value, { autoAlpha: 0 }) }
        })
      })
      // B8: …и уходит обратно влево, растворяясь; появляется знак ESP
      gsap.to(leftBush.value, {
        x: () => vw(-300),
        ease: 'none',
        scrollTrigger: at(B + 179.2, 260.42, {
          onUpdate: (s) => {
            gsap.set(leftBush.value, { opacity: Math.max(0, Math.min(1, 1.25 - 2 * s.progress)) })
            if (s.progress > 0.1 && !logoOn.value) {
              logoOn.value = true
            }
          },
          onEnter: () => { gsap.set([jungle.value, bushPlate.value], { autoAlpha: 0 }); setScene('drop') },
          onLeaveBack: () => {
            gsap.set([jungle.value, bushPlate.value], { autoAlpha: 1 })
            logoOn.value = false
            setScene('forest')
          }
        })
      })

      // ---------------- КОНТЕНТ ----------------
      ScrollTrigger.create({
        trigger: content.value, start: 'top top', end: () => `+=${vw(80)}`, pin: true, invalidateOnRefresh: true,
        onLeave: () => { bushesHidden.value = true }, onEnterBack: () => { bushesHidden.value = false }
      })
      gsap.fromTo(bannerBush.value, { y: () => vw(-4.6875) }, { y: 0, ease: 'none', scrollTrigger: at(B + 179.2, 33.08) })
      gsap.to([heroCloud1.value, heroCloud2.value], { xPercent: 40, ease: 'none', scrollTrigger: at(B + 179.2, 625) })
    })
  }, root.value)
})

onBeforeUnmount(() => {
  mm?.revert()
  ctx?.revert()
  clearTimeout(puffT)
  disposeSound()
  lockScroll(false)
  history.scrollRestoration = prevRestoration
})
</script>


<style scoped>
/* Все размеры — в vw от макета 1920 (как у jazak и в Figma: px / 19.2). */
.jz {
  --jz-blue: #2995d3;
  --jz-cream: #dde7cf;
  --jz-ink: #050c07;
  position: relative;
  background: var(--jz-ink);
  color: #fff;
  overflow: clip;
  width: 100%;
}
.jz img { user-select: none; -webkit-user-drag: none; max-width: none; }

/* Звук */
.jz-sound {
  position: fixed; z-index: 95; top: calc(var(--dj-header-h, 56px) + 16px); right: 24px;
  width: 48px; height: 48px; border-radius: 50%; display: grid; place-items: center; color: #fff;
  border: 2px solid #fff; background: transparent; opacity: 0.5; transition: opacity 0.3s;
}
.jz-sound:hover, .jz-sound.is-on { opacity: 1; }
.jz-sound svg { width: 22px; height: 22px; stroke: currentColor; stroke-width: 2; stroke-linecap: round; }
.jz-sound line { transform-origin: center; transform: scaleY(0.25); transition: transform 0.3s; }
.jz-sound.is-on line { animation: jz-bars 0.9s ease-in-out infinite alternate; }
@keyframes jz-bars { from { transform: scaleY(0.25); } to { transform: scaleY(1); } }

/* ================= Сцена A ================= */
.jz-sea { position: relative; height: 494.79vw; z-index: 2; }
.jz-sea__box { position: relative; width: 100vw; height: 100vh; overflow: hidden; background: #0a3a6b; }
.jz-sea__img { position: absolute; top: 0; right: 0; width: 125vw; height: 80.5208vw; object-fit: cover; will-change: transform; }
.jz-cloud { position: absolute; mix-blend-mode: luminosity; will-change: transform; pointer-events: none; }
.jz-cloud--1 { left: -51.0417vw; top: 21.0938vw; width: 95.2083vw; height: 56.25vw; }
.jz-cloud--2 { left: 11.4583vw; top: -11.9792vw; width: 25.1563vw; height: 27.3438vw; }
.jz-cloud--3 { right: -59.375vw; top: -8.3333vw; width: 95.2083vw; height: 56.25vw; }
.jz-cloud--4 { left: 14.5833vw; top: 96.3542vw; width: 25.1563vw; height: 27.3438vw; }

/* Тексты сцен (sea__text): заголовок, точки с линией, абзац; .show-second уводит блок вверх */
.jz-say { position: absolute; left: 44.7917vw; top: 13.0208vw; z-index: 5; max-width: 48vw; transition: transform 0.7s, opacity 0.6s, visibility 0.5s; }
.jz-say--sea { transition: transform 0.7s, opacity 0.3s; }
.jz-say.show-second { transform: translateY(-37.208vw); }
.jz-say__h { font-family: var(--font-display, inherit); font-size: 3.125vw; font-weight: 700; letter-spacing: -0.0521vw; line-height: 1.12; text-transform: uppercase; color: #fff; }
.jz-say__p { font-size: 2vw; font-weight: 700; line-height: 1.2; padding: 0.5208vw 0; color: #fff; max-width: 40vw; }
.jz-say__break { display: flex; flex-direction: column; align-items: flex-start; padding-left: 5.2083vw; }
.jz-say__break i { width: 0.8333vw; height: 0.8333vw; min-width: 7px; min-height: 7px; border-radius: 50%; background: #fff; }
.jz-say__break b { width: 0.1042vw; min-width: 1px; height: 55vh; background: #fff; margin-left: 0.3646vw; transition: 0.5s; }
.jz-say--rock, .jz-say--bush { opacity: 0; visibility: hidden; z-index: 7; }
.jz-say--rock.is-active, .jz-say--bush.is-active { opacity: 1; visibility: visible; }

/* 15 колец породы */
.jz-rocks { position: relative; z-index: 6; top: 0; left: 0; will-change: transform; }
.jz-rocks__back {
  position: absolute; left: 50vw; top: 50vh; width: 104.5833vw; height: max(58.8542vw, 110vh); transform: translate(-50%, -50%);
  background: radial-gradient(ellipse 13% 13% at 50% 50%, transparent 70%, #3b3632 100%), radial-gradient(ellipse at center, #4a443e, #26221f 75%);
  -webkit-mask-image: radial-gradient(ellipse 13% 13% at 50% 50%, transparent 72%, #000 100%); mask-image: radial-gradient(ellipse 13% 13% at 50% 50%, transparent 72%, #000 100%);
  will-change: transform, opacity; z-index: 1;
}
.jz-rocks__cap {
  position: absolute; left: 50vw; top: 51vh; width: 34vw; height: 30vw; transform: translate(-50%, -50%) scale(0); z-index: 8; border-radius: 50%;
  background: radial-gradient(closest-side, #2a2521 55%, #3b3632 80%, transparent); will-change: transform;
}
.jz-rock { position: absolute; pointer-events: none; }
.jz-rock img { display: block; width: 104.5833vw; height: 58.8542vw; min-height: 110vh; object-fit: fill; will-change: transform; }
.jz-rock--13 img, .jz-rock--14 img { min-height: 120vh; }

/* Небо (sky.png): опускается сверху, кромка леса — нижний край */
.jz-sky {
  position: absolute; top: 0; left: 0; z-index: 6; width: 100.4688vw; height: 83.9063vw; pointer-events: none; will-change: transform;
  background: linear-gradient(#3d8fd6 0%, #79b8ec 45%, #b9dcf5 78%, #d8ecf8 100%);
}
.jz-sky__cloud { position: absolute; opacity: 0.95; }
.jz-sky__cloud--a { left: -18vw; top: 26vw; width: 70vw; }
.jz-sky__cloud--b { right: 6vw; top: 40vw; width: 22vw; }
.jz-sky__crest { position: absolute; left: -2vw; bottom: -12vw; width: 104vw; height: auto; }
.jz-clouds { position: absolute; top: 0; left: 0; z-index: 6; width: 166.04vw; height: 63.18vw; object-fit: contain; mix-blend-mode: screen; pointer-events: none; will-change: transform; }

/* ================= Сцена B ================= */
.jz-bushes { position: relative; z-index: 40; top: -24.0417vw; height: 0; }
.jz-bushes.is-hide { pointer-events: none; }
.jz-bushes__box { position: relative; width: 100vw; height: 100vh; }
.jz-bplate { position: relative; top: -18.75vw; z-index: 6; display: block; width: 100vw; min-width: 100vw; height: 71vw; min-height: 156vh; object-fit: cover; object-position: center top; will-change: transform; }
.jz-jungle { position: absolute; right: 0; bottom: 0; width: 145vw; height: 77.34vw; min-height: 100vh; overflow: hidden; pointer-events: none; will-change: transform; background: radial-gradient(80% 70% at 50% 40%, #2d5a23, #0c2010 75%); }
.jz-jungle__crown { position: absolute; top: -6vw; left: 0; width: 100%; height: auto; }
.jz-jungle__tree { position: absolute; bottom: 10vw; width: 40vw; height: auto; filter: brightness(0.8); }
.jz-jungle__tree--l { left: 20vw; }
.jz-jungle__tree--r { left: 70vw; }
.jz-jungle__floor { position: absolute; left: 0; bottom: -4vw; width: 100%; height: auto; }
.jz-tree { position: absolute; left: 0; top: 0; z-index: 3; width: 39.53vw; height: 56.61vw; min-height: 100vh; object-fit: cover; object-position: center top; will-change: transform; }
.jz-fern { position: absolute; left: 0; bottom: 0; z-index: 5; width: 94.375vw; height: 36.98vw; object-fit: contain; object-position: bottom; will-change: transform; }
.jz-lbush { position: absolute; left: 0; top: 0; z-index: 2; pointer-events: none; will-change: transform; }
.jz-lbush img { display: block; width: 64.17vw; height: 53.18vw; min-height: 100vh; object-fit: cover; will-change: transform, opacity; }
.jz-rbush { position: absolute; left: 0; bottom: -2vw; z-index: 1; width: 124.84vw; height: auto; will-change: transform; }

.jz-flat { display: none; }

/* ================= Контент ================= */
.jz-content-fix { position: relative; z-index: 1; }
.jz-content {
  position: relative; min-width: 100%; margin-top: 155.052vw; z-index: 1; padding-bottom: 6vw;
  background: radial-gradient(120% 60% at 50% 10%, #183a1b, #0a1a0c 55%, #050c07 100%);
}
.jz-content__overlay { position: absolute; inset: 0; z-index: 15; pointer-events: none; background: radial-gradient(140% 100% at 50% 50%, transparent 55%, rgba(0, 0, 0, 0.55)); }
.jz-content__fade { position: relative; z-index: 16; height: 10vw; margin-top: -10vw; background: linear-gradient(transparent, var(--jz-ink)); pointer-events: none; }

/* Баннер (banner) — размеры и места из Figma 1:28155 */
.jz-banner { display: flex; justify-content: center; position: relative; height: 45.52vw; z-index: 2; }
.jz-banner__hero { position: relative; z-index: 1; width: 61.82vw; height: 45.52vw; }
.jz-banner__front-box { position: relative; z-index: 2; width: 100%; height: 100%; }
.jz-banner__front { display: block; width: 61.82vw; height: 45.52vw; }
.jz-banner__water {
  position: absolute; left: 50%; bottom: 1.9vw; width: 19.74vw; height: 5.4167vw; transform: translateX(-50%);
  background-size: cover; filter: url(#jz-turb);
}
.jz-banner__back { position: absolute; z-index: -1; left: 50%; top: 0; transform: translateX(-50%); width: 14.1667vw; height: 29.84vw; }
.jz-banner__clouds { position: absolute; top: 0; left: 50%; transform: translateX(-50%); width: 18.229vw; height: 100vh; overflow: hidden; z-index: 0; pointer-events: none; }
.jz-banner__cloud { position: absolute; z-index: 1; left: 50%; width: 17.86vw; height: 8.698vw; will-change: transform; }
.jz-banner__cloud--1 { top: 15.625vw; transform: translate(-120%); }
.jz-banner__cloud--2 { top: 7.8125vw; transform: translate(-40%); }
.jz-banner__logo {
  position: absolute; top: 17.97vw; left: calc(50% + 0.4688vw); z-index: 4; width: 7.6vw; height: auto; opacity: 0;
  transform: translate(-50%, 1.04167vw); filter: brightness(0) invert(1) drop-shadow(0 0.2vw 0.6vw rgba(0, 30, 80, 0.45));
  transition: opacity 0.3s 0.1s, transform 0.3s 0.1s;
}
.jz-banner__logo.is-active { opacity: 1; transform: translate(-50%); }
.jz-banner__tree { position: absolute; top: 0; z-index: 5; pointer-events: none; }
.jz-banner__tree--l { left: 0; width: 42.08vw; height: 45.99vw; }
.jz-banner__tree--r { right: 0; width: 40.94vw; height: 46.67vw; }
.jz-banner__bush { position: absolute; bottom: -10.4167vw; left: 50%; z-index: 7; transform: translate(-50%, -4.6875vw); }
.jz-banner__bush-img { display: block; width: 43.54vw; height: 18.85vw; }
.jz-banner__branch { position: absolute; }
.jz-banner__branch--r { bottom: 8.333vw; right: 0; z-index: 2; transform-origin: 24% 76%; width: 6.77vw; height: 5.47vw; }
.jz-banner__branch--l { bottom: 11.98vw; left: 7.8125vw; transform-origin: 25% 100%; width: 6.15vw; height: 7.03vw; }
.jz-banner__branch--r.is-shake { animation: jz-shake 1.8s; }
@keyframes jz-shake { 0% { rotate: 0deg; } 10% { rotate: -10deg; } 30% { rotate: 7deg; } 45% { rotate: -3deg; } 60% { rotate: 1deg; } 70%, 100% { rotate: 0deg; } }

/* Текстовые блоки (about-text) */
.jz-about { position: relative; display: flex; flex-direction: column; align-items: center; justify-content: center; min-height: 40vw; z-index: 3; }
.jz-about__frame { position: absolute; top: 0; left: 50%; width: 70.57vw; transform: translateX(-50%); opacity: 0.55; pointer-events: none; z-index: -1; }
.jz-about__frame--low { top: auto; bottom: -4vw; width: 75.52vw; opacity: 0.7; }
.jz-about__inner { position: relative; display: flex; justify-content: space-between; gap: 4vw; width: 100%; max-width: 50vw; z-index: 21; }
.jz-about__heading {
  font-family: var(--font-display, inherit); font-weight: 700; font-size: 1.4583vw; letter-spacing: 1px; line-height: 1.25;
  text-transform: uppercase; color: var(--jz-blue); opacity: 0; transform: translateY(1.5625vw); transition: 0.3s; will-change: transform, opacity; flex: none; max-width: 20vw;
}
.jz-about__right { max-width: 24.479vw; font-size: 0.8333vw; line-height: 175%; color: var(--jz-cream); }
.jz-about__right p { margin-bottom: 1.302vw; opacity: 0; transform: translateY(1.5625vw); transition: 0.5s; }
.jz-about__right p:nth-child(2) { transition-delay: 0.1s; }
.jz-about__right p:nth-child(3) { transition-delay: 0.2s; }
.jz-about__right p:nth-child(4) { transition-delay: 0.3s; }
.jz-about__right p:nth-child(5) { transition-delay: 0.4s; }
.jz-about__right b { color: #fff; font-weight: 700; }
.jz-about.is-active .jz-about__heading, .jz-about.is-active .jz-about__right p { opacity: 1; transform: translateY(0); }
.jz-more { color: var(--jz-blue); font-weight: 600; white-space: nowrap; }
.jz-more:hover { color: #fff; }
.jz-about__branch { position: absolute; z-index: 3; bottom: 3.6458vw; left: 33%; width: 8vw; height: auto; transform-origin: 15% 70%; }
.jz-about.is-active .jz-about__branch { animation: jz-shake 1.8s; }

/* Листопад */
.jz-about__leafs { position: absolute; width: 31.25vw; height: 20.833vw; top: 30%; left: 50%; transform: translate(-50%, -50%); z-index: 3; pointer-events: none; }
.jz-leaf { position: absolute; width: 2vw; height: auto; opacity: 0; display: none; }
.jz-about.is-active .jz-leaf { display: block; }
.jz-leaf--1 { left: 8%; top: 10%; animation: jz-leaf 1.2s linear 0.3s forwards; }
.jz-leaf--2 { left: 22%; top: 30%; animation: jz-leaf3 1.2s linear forwards; }
.jz-leaf--3 { left: 40%; top: 5%; animation: jz-leaf2 1.2s linear 0.4s forwards; }
.jz-leaf--4 { left: 55%; top: 25%; animation: jz-leaf4 1.2s linear 0.6s forwards; }
.jz-leaf--5 { left: 68%; top: 12%; animation: jz-leaf5 1.2s linear forwards; }
.jz-leaf--6 { left: 80%; top: 35%; animation: jz-leaf6 1.2s linear 0.25s forwards; }
.jz-leaf--7 { left: 92%; top: 8%; animation: jz-leaf7 1.2s linear 0.3s forwards; }
.jz-leaf--8 { left: 33%; top: 45%; animation: jz-leaf 1.2s linear forwards; }
@keyframes jz-leaf { 0% { opacity: 0; transform: translateY(-4.16667vw); } 50% { opacity: 1; transform: translateY(1.04167vw) rotate(-45deg); } 100% { opacity: 0; transform: translateY(6.25vw); } }
@keyframes jz-leaf2 { 0% { opacity: 0; transform: translateY(-3.64583vw); } 50% { opacity: 1; transform: translateY(1.04167vw) rotate(75deg); } 100% { opacity: 0; transform: translateY(8.85417vw); } }
@keyframes jz-leaf3 { 0% { opacity: 0; transform: translateY(-3.125vw) rotate(-25deg); } 50% { opacity: 1; transform: translateY(1.5625vw) rotate(-15deg); } 100% { opacity: 0; transform: translateY(6.25vw); } }
@keyframes jz-leaf4 { 0% { opacity: 0; transform: translateY(-2.60417vw) rotate(85deg); } 50% { opacity: 1; transform: translateY(1.5625vw) rotate(45deg); } 100% { opacity: 0; transform: translateY(5.72917vw); } }
@keyframes jz-leaf5 { 0% { opacity: 0; transform: translateY(-2.60417vw) rotate(-45deg); } 50% { opacity: 1; transform: translateY(1.5625vw); } 100% { opacity: 0; transform: translateY(5.72917vw) rotate(-45deg); } }
@keyframes jz-leaf6 { 0% { opacity: 0; transform: translateY(-3.125vw) rotate(90deg); } 50% { opacity: 1; transform: translateY(1.5625vw); } 100% { opacity: 0; transform: translateY(6.25vw) rotate(90deg); } }
@keyframes jz-leaf7 { 0% { opacity: 0; transform: translateY(-3.64583vw) rotate(80deg); } 50% { opacity: 1; transform: translateY(1.5625vw); } 100% { opacity: 0; transform: translateY(6.77083vw) rotate(-80deg); } }

/* Ручей + оборудование (vitaminska 1:28317 + stream 1:28235) */
.jz-stream { position: relative; height: 62.9vw; z-index: 4; }
.jz-stream__branch { position: absolute; top: -4vw; left: 19.79vw; width: 62.34vw; height: 35.68vw; z-index: 0; filter: brightness(0.8); }
.jz-stream__water { position: absolute; left: 32.9vw; top: 10vw; width: 34.22vw; height: 20.16vw; z-index: 1; background-size: contain; background-repeat: no-repeat; filter: url(#jz-turb2); }
.jz-stream__fern { position: absolute; left: 23.18vw; top: 9vw; width: 50.52vw; height: 22.55vw; z-index: 2; }
.jz-stream__bush { position: absolute; z-index: 1; height: auto; pointer-events: none; }
.jz-stream__bush--l { left: 5vw; top: 11.6vw; width: 45.9vw; }
.jz-stream__bush--r { right: 2vw; top: 16.3vw; width: 34.7vw; }

.jz-prod { position: absolute; left: 50%; top: 0; width: 52.083vw; height: 62.9vw; transform: translateX(-50%); z-index: 5; touch-action: pan-y; cursor: grab; }
.jz-prod:active { cursor: grabbing; }
/* Мшистая кочка на месте камня/мха (Mahovina/Kamen нет в снимке) */
.jz-prod__moss { position: absolute; left: 50%; top: 23.6vw; width: 41.72vw; height: 21.35vw; transform: translateX(-50%); z-index: 1; pointer-events: none; }
.jz-prod__shadow {
  position: absolute; left: 50%; top: 29.2vw; width: 26vw; height: 2.6vw; z-index: 2; border-radius: 50%;
  background: radial-gradient(closest-side, rgba(0, 0, 0, 0.75), rgba(0, 0, 0, 0.35) 55%, transparent);
  transform: translateX(-50%) scale(0); filter: blur(0.25vw);
}
.jz-prod__shadow.is-on { animation: jz-shadow 1.2s forwards; }
@keyframes jz-shadow { 0%, 10% { transform: translateX(-50%) scale(0); } 30% { transform: translateX(-50%) scale(0.8); } 50%, 100% { transform: translateX(-50%) scale(1); } }
/* Маска: машина выпрыгивает снизу, как бутылка (jumpUp) */
.jz-prod__mask { position: absolute; left: 50%; top: 4vw; width: 40vw; height: 26.6vw; transform: translateX(-50%); overflow: hidden; z-index: 3; }
.jz-prod__slide { position: absolute; left: 0; right: 0; bottom: 0; display: flex; justify-content: center; align-items: flex-end; pointer-events: none; }
.jz-prod__slide.is-active { pointer-events: auto; }
.jz-prod__slide img {
  width: 27vw; height: auto; max-height: 17vw; object-fit: contain; object-position: bottom; transform: translateY(110%);
  transform-origin: bottom center; will-change: transform; filter: drop-shadow(0 0.5vw 0.6vw rgba(0, 0, 0, 0.5)) brightness(0.92) saturate(0.95);
}
.jz-prod__slide.was-active:not(.is-active) img { animation: jz-fadeout 0.3s forwards; transform: translateY(0); }
.jz-prod__slide.is-active img { animation: jz-jump 1.2s forwards; }
@keyframes jz-jump { 0%, 10% { transform: translateY(100%); } 30% { transform: translateY(-3.20833vw); } 50%, 100% { transform: translateY(0); } }
@keyframes jz-fadeout { 0% { opacity: 1; transform: scale(1); } 100% { opacity: 0; transform: scale(0.5); } }
.jz-prod__front { position: absolute; left: 50%; top: 27.4vw; width: 98.65vw; height: 32.29vw; transform: translateX(-50%); z-index: 7; pointer-events: none; }
.jz-prod__leafs { position: absolute; left: 50%; top: 4vw; width: 26.04vw; height: 15.625vw; transform: translateX(-50%); z-index: 9; pointer-events: none; }
.jz-pleaf { position: absolute; width: 2vw; height: auto; opacity: 0; }
.jz-pleaf--1 { left: 10%; top: 20%; } .jz-pleaf--2 { left: 30%; top: 0; } .jz-pleaf--3 { left: 52%; top: 10%; } .jz-pleaf--4 { left: 72%; top: 0; } .jz-pleaf--5 { left: 90%; top: 22%; }
.jz-prod__leafs.is-active .jz-pleaf--1 { animation: jz-leafup1 1.2s forwards; }
.jz-prod__leafs.is-active .jz-pleaf--2 { animation: jz-leafup2 1.2s forwards; }
.jz-prod__leafs.is-active .jz-pleaf--3 { animation: jz-leafup3 1.2s forwards; }
.jz-prod__leafs.is-active .jz-pleaf--4 { animation: jz-leafup4 1.2s forwards; }
.jz-prod__leafs.is-active .jz-pleaf--5 { animation: jz-leafup5 1.2s forwards; }
@keyframes jz-leafup1 { 0% { opacity: 1; transform: translate(-4.167vw, 7.8vw); } 100% { opacity: 0; transform: translate(0, 0); } }
@keyframes jz-leafup2 { 0% { opacity: 1; transform: translate(-2.6vw, 10.4vw); } 100% { opacity: 0; transform: translate(0, 0); } }
@keyframes jz-leafup3 { 0% { opacity: 1; transform: translate(0, 12.8vw); } 100% { opacity: 0; transform: translate(0, 0) rotate(40deg); } }
@keyframes jz-leafup4 { 0% { opacity: 1; transform: translate(2.6vw, 10.4vw); } 100% { opacity: 0; transform: translate(0, 0); } }
@keyframes jz-leafup5 { 0% { opacity: 1; transform: translate(4.167vw, 7.8vw); } 100% { opacity: 0; transform: translate(0, 0); } }
.jz-prod__title {
  position: absolute; left: 70%; top: 19.5vw; width: 15.625vw; z-index: 9; font-family: var(--font-display, inherit); font-weight: 700;
  text-transform: uppercase; letter-spacing: 1px; font-size: 1.0417vw; line-height: 1.3; color: var(--jz-cream); pointer-events: none;
}
.jz-prod__title span { display: block; color: var(--jz-blue); font-size: 0.8vw; margin-bottom: 0.4vw; }
.jz-prod__arrow { position: absolute; top: 13vw; z-index: 10; width: 1.6146vw; min-width: 18px; color: #fff; }
.jz-prod__arrow svg { width: 100%; height: auto; fill: none; stroke: currentColor; stroke-width: 2; transition: transform 0.3s cubic-bezier(0.75, -0.5, 0, 1.75); }
.jz-prod__arrow:hover svg { transform: scale(1.1, 1.2); }
.jz-prod__arrow:active svg { transform: scale(0.9, 0.8); }
.jz-prod__arrow--l { left: 0; }
.jz-prod__arrow--r { right: 0; }

/* Хотспот (hotspot) */
.jz-spot { position: absolute; left: 35.94vw; top: 20.3vw; z-index: 31; }
.jz-hot { display: block; width: 2.45vw; min-width: 24px; color: #fff; }
.jz-hot svg { display: block; width: 100%; height: auto; overflow: visible; }
.jz-hot__dot { fill: #fff; }
.jz-hot__small, .jz-hot__big { fill: none; stroke: #fff; stroke-width: 1.5; transform-origin: center; transform-box: fill-box; }
.jz-hot__big { animation: jz-pulse 2.5s 0.6s infinite; }
.jz-hot__small { animation: jz-pulse2 2.5s 0.8s infinite; }
.jz-hot__x { stroke: #fff; stroke-width: 2; opacity: 0; transition: 0.3s; }
.jz-hot.is-open .jz-hot__small, .jz-hot.is-open .jz-hot__big, .jz-hot.is-open .jz-hot__dot { opacity: 0; animation: none; }
.jz-hot.is-open .jz-hot__x { opacity: 1; }
@keyframes jz-pulse { 0%, 40% { opacity: 1; transform: scale(0); } 70% { opacity: 1; } 100% { opacity: 0; transform: scale(1); } }
@keyframes jz-pulse2 { 0%, 40% { opacity: 1; transform: scale(0); } 70% { opacity: 1; } 100% { opacity: 0; transform: scale(1.2); } }
.jz-hot__card {
  position: absolute; bottom: -0.3125vw; left: 3vw; width: 16.5625vw; min-width: 240px; padding: 1.5625vw; z-index: -1;
  font-size: max(0.7292vw, 13px); line-height: 1.3; color: var(--jz-cream); opacity: 0; visibility: hidden; transform: translateY(0.52083vw); transition: 0.3s;
}
.jz-hot__card::after { content: ''; position: absolute; inset: 0; z-index: -1; background: #050804; opacity: 0.7; border-radius: 1.0417vw; }
.jz-hot__card b { display: block; color: #fff; margin-bottom: 0.4em; }
.jz-hot__card.is-open { opacity: 1; visibility: visible; transform: none; }

/* Финал (imuno 1:28256): знак ESP вместо бутылки 0,75 */
.jz-sign { position: relative; margin-top: 2vw; }
.jz-sign__crown { position: absolute; top: -22.06vw; left: 0; width: 100%; height: 56.2vw; opacity: 0.35; z-index: 8; pointer-events: none; }
.jz-sign__inner { position: relative; z-index: 3; width: 100%; height: 63.2vw; overflow: hidden; }
.jz-sign__lijana { position: absolute; left: 57vw; top: 19vw; width: 14.375vw; height: auto; z-index: 1; }
.jz-sign__trava { position: absolute; left: 39vw; top: 36.8vw; width: 41.72vw; height: 21.35vw; z-index: 4; }
.jz-sign__drop { position: absolute; left: 48.5vw; top: 18vw; width: 13vw; z-index: 2; transform: translateX(-50%); animation: jz-jump-sign 2s forwards; }
.jz-sign__drop img { display: block; width: 100%; height: auto; filter: brightness(0) invert(1) drop-shadow(0 0.6vw 1.2vw rgba(0, 0, 0, 0.5)); }
.jz-sign__drop.is-hidden { animation: none; transform: translate(-50%, 110%); }
@keyframes jz-jump-sign { 0%, 10% { transform: translate(-50%, 100%); } 30% { transform: translate(-50%, -3.20833vw); } 50%, 100% { transform: translate(-50%, 0); } }
.jz-sign__zbun2 { position: absolute; left: 24vw; top: 40.6vw; width: 34.69vw; height: 18.54vw; z-index: 3; }
.jz-sign__zbun1 { position: absolute; left: 17vw; width: 75.52vw; height: 22.66vw; z-index: 5; }
.jz-sign__zbun1--a { top: 45vw; }
.jz-sign__zbun1--b { top: 48vw; }
.jz-sign__title {
  position: absolute; left: 58%; top: 38%; width: 15.625vw; z-index: 8; font-family: var(--font-display, inherit); font-weight: 600; font-size: 0.95vw; line-height: 1.35;
  color: var(--jz-cream); transition: opacity 0.3s 0.3s, transform 0.3s 0.3s;
}
.jz-sign__title b { display: block; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; font-size: 1.0417vw; color: #fff; margin-bottom: 0.3vw; }
.jz-sign__title.is-hidden { opacity: 0; transform: translateY(20px); }
.jz-about--four { min-height: 20vw; margin-top: 2vw; }
.jz-about__inner--static { align-items: flex-start; }
.jz-filters { position: absolute; width: 0; height: 0; }

/* ======== ≤1550 / ≤1500: переключения как у jazak ======== */
@media (max-width: 1550px) {
  .jz-sea__img { width: 140vw; height: 90.16vw; min-height: 132vh; }
  .jz-say__break b { height: 65vh; }
}
@media (max-width: 1500px) {
  .jz-bplate { top: -25vw; }
  .jz-about__inner { max-width: 59vw; }
  .jz-about__heading { font-size: 24px; max-width: 24vw; }
  .jz-about__right { font-size: 14px; max-width: 27.48vw; }
  .jz-prod__title { font-size: 14px; }
  .jz-prod__title span { font-size: 12px; }
  .jz-sign__title { font-size: 14px; }
  .jz-sign__title b { font-size: 15px; }
}
@media (max-width: 1200px) {
  .jz-about__inner { max-width: 70vw; }
  .jz-about__right { max-width: 36vw; }
}

/* ======== Мобильная (≤767) и reduced-motion: без закрепления ======== */
@media (max-width: 767px), (prefers-reduced-motion: reduce) {
  .jz-intro { display: none; }
  .jz-flat { display: block; }
  .jz-content { margin-top: 0; }
  .jzf { position: relative; min-height: 100svh; overflow: hidden; display: flex; align-items: center; }
  .jzf__bg { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; }
  .jzf__say { position: relative; z-index: 12; padding: 0 7vw 0 10vw; }
  .jzf .jz-say__h { font-size: clamp(26px, 7.4vw, 44px); }
  .jzf .jz-say__p { font-size: clamp(17px, 4.6vw, 26px); max-width: none; }
  .jzf .jz-say__break { padding-left: 2vw; }
  .jzf .jz-say__break b { height: 18vh; }
  .jzf__cloud { position: absolute; z-index: 2; mix-blend-mode: luminosity; pointer-events: none; }
  .jzf__cloud--a { left: -60vw; bottom: 4vh; width: 130vw; }
  .jzf__cloud--b { right: -20vw; top: 6vh; width: 60vw; }
  .jzf__back { position: absolute; inset: 0; z-index: 1; background: radial-gradient(circle at 50% 50%, transparent 14vw, #3b3632 22vw, #26221f 70%); }
  .jzf__ring { position: absolute; left: 50%; top: 50%; width: 130vw; height: 100svh; object-fit: fill; transform: translate(-50%, -50%) scale(var(--s)); }
  .jzf--forest .jzf__bg { object-position: center top; }
  .jzf__fern { position: absolute; right: -30vw; bottom: -4vh; width: 130vw; z-index: 4; }
  .jzf--forest::after { content: ''; position: absolute; inset: 0; z-index: 5; background: linear-gradient(rgba(0, 0, 0, 0.15), rgba(4, 12, 6, 0.55)); }

  .jz-banner { height: auto; overflow: hidden; padding-bottom: 6vw; }
  .jz-banner__hero { width: 100vw; height: 73.6vw; }
  .jz-banner__front { width: 100vw; height: 73.6vw; }
  .jz-banner__back { width: 22.9vw; height: 48.3vw; }
  .jz-banner__clouds { width: 29.5vw; }
  .jz-banner__cloud { width: 28.9vw; height: 14vw; }
  .jz-banner__cloud--1 { top: 25vw; }
  .jz-banner__cloud--2 { top: 12.6vw; }
  .jz-banner__water { width: 32vw; height: 8.8vw; bottom: 3vw; }
  .jz-banner__logo { top: 29vw; width: 14vw; left: calc(50% + 0.75vw); }
  .jz-banner__tree { display: none; }
  .jz-banner__bush { bottom: -6vw; transform: translate(-50%, 0); }
  .jz-banner__bush-img { width: 80vw; height: 34.6vw; }
  .jz-banner__branch--r { width: 12vw; height: 9.7vw; bottom: 15vw; }
  .jz-banner__branch--l { width: 11vw; height: 12.6vw; bottom: 22vw; left: 14vw; }
  .jz-about { min-height: 0; padding: 22vw 0 10vw; }
  .jz-about__frame { width: 160vw; }
  .jz-about__inner { flex-direction: column; max-width: none; padding: 0 7vw; gap: 5vw; }
  .jz-about__heading { font-size: 22px; max-width: none; }
  .jz-about__right { max-width: none; font-size: 15px; }
  .jz-about__right p { margin-bottom: 0.9em; }
  .jz-about__leafs { width: 80vw; height: 50vw; }
  .jz-leaf { width: 6vw; }
  .jz-about__branch { width: 18vw; left: 60%; bottom: 0; }
  .jz-stream { height: 150vw; }
  .jz-stream__branch { width: 130vw; height: 74.4vw; left: -15vw; top: 0; }
  .jz-stream__water { width: 70vw; height: 41.2vw; left: 15vw; top: 26vw; }
  .jz-stream__fern { width: 110vw; height: 49vw; left: -5vw; top: 30vw; }
  .jz-stream__bush--l { width: 80vw; left: -30vw; top: 40vw; }
  .jz-stream__bush--r { width: 70vw; right: -30vw; top: 48vw; }
  .jz-prod { width: 100vw; height: 150vw; }
  .jz-prod__moss { width: 92vw; height: 47vw; top: 66vw; }
  .jz-prod__shadow { width: 62vw; height: 6vw; top: 74vw; }
  .jz-prod__mask { width: 96vw; height: 56vw; top: 21vw; }
  .jz-prod__slide img { width: 70vw; max-height: 44vw; }
  @keyframes jz-jump { 0%, 10% { transform: translateY(100%); } 30% { transform: translateY(-7vw); } 50%, 100% { transform: translateY(0); } }
  .jz-prod__front { width: 190vw; height: 62vw; top: 84vw; }
  .jz-prod__leafs { width: 70vw; height: 40vw; top: 20vw; }
  .jz-pleaf { width: 6vw; }
  .jz-prod__title { left: 0; right: 0; top: 122vw; width: auto; text-align: center; font-size: 15px; }
  .jz-prod__title span { font-size: 12px; }
  .jz-prod__arrow { top: 40vw; width: 9vw; padding: 1vw; }
  .jz-prod__arrow--l { left: 3vw; }
  .jz-prod__arrow--r { right: 3vw; }
  .jz-spot { left: 12vw; top: 12vw; }
  .jz-hot { width: 26px; }
  .jz-hot__card { width: 70vw; min-width: 0; padding: 14px; font-size: 13px; border-radius: 10px; }
  .jz-sign__inner { height: 130vw; }
  .jz-sign__crown { width: 200vw; height: auto; left: -50vw; top: -20vw; }
  .jz-sign__lijana { left: 70vw; top: 30vw; width: 26vw; }
  .jz-sign__drop { width: 34vw; left: 50vw; top: 46vw; }
  .jz-sign__trava { width: 90vw; height: 46vw; left: 14vw; top: 78vw; }
  .jz-sign__zbun2 { width: 70vw; height: 37vw; left: -6vw; top: 84vw; }
  .jz-sign__zbun1 { width: 160vw; height: 48vw; left: -30vw; }
  .jz-sign__zbun1--a { top: 92vw; }
  .jz-sign__zbun1--b { top: 100vw; }
  .jz-sign__title { left: 8vw; top: 8vw; width: 60vw; font-size: 14px; }
  .jz-sign__title b { font-size: 15px; }
  .jz-sound { top: calc(var(--dj-header-h, 56px) + 12px); right: 16px; width: 42px; height: 42px; }
}
@media (prefers-reduced-motion: reduce) {
  .jz *, .jz *::before, .jz *::after { animation-duration: 0.01ms !important; animation-iteration-count: 1 !important; transition-duration: 0.01ms !important; }
}
</style>
