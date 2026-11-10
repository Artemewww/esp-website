<template>
  <!-- О компании: сначала история «Путь воды ESP» (подача jazakvoda: спуск из
       облаков, земля смыкается слоями, белорусский лес, капля ESP), затем —
       разделы в стиле DJI/Apple с содержанием прежней страницы «О компании». -->
  <div class="ab">
    <div ref="root" class="hs">
      <StoryDropLoader
        v-if="!loaderGone"
        :assets="preload"
        bg="/images/story/water-sm.webp"
        bright
        caption="Произведено в Республике Беларусь"
        :min-time="seen ? 800 : 2400"
        @done="onLoaded"
      />

      <button
        v-show="!pastStory"
        type="button"
        class="hs-sound"
        :class="{ 'is-on': soundOn, 'is-docked': !inIntro }"
        :aria-pressed="soundOn"
        :aria-label="soundOn ? 'Выключить звук' : 'Включить звук'"
        @click="toggleSound"
      >
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <line v-for="(x, i) in [5, 9, 13, 17, 21]" :key="x" :x1="x" :x2="x" y1="6" y2="18" :style="{ animationDelay: `${i * 0.12}s` }" />
        </svg>
      </button>

      <!-- ===== Акты 1–5: одна липкая сцена, много слоёв ===== -->
      <section ref="stageWrap" class="hs-wrap">
        <div class="hs-stage">
          <!-- 1. Вода сверху и облака -->
          <div ref="waterEl" class="hs-l hs-water">
            <img src="/images/story/water.webp" srcset="/images/story/water-sm.webp 960w, /images/story/water.webp 1920w" sizes="130vw" alt="Бурная синяя вода, вид сверху" fetchpriority="high" />
          </div>
          <img v-for="n in 4" :key="`c${n}`" :ref="(el) => (clouds[n - 1] = el)" :src="`/images/about-story/cloud-${n % 2 ? 'a' : 'b'}.webp`" alt="" class="hs-cloud" :class="`hs-cloud--${n}`" />

          <!-- 2. Портал: земля смыкается слоями -->
          <div ref="pShade" class="hs-l hs-pshade" />
          <img ref="p1" src="/images/story/ring.webp" alt="" class="hs-l hs-portal hs-portal--1" />
          <img ref="p2" src="/images/story/pit.webp" alt="" class="hs-l hs-portal hs-portal--2" />
          <img ref="p3" src="/images/story/ring3.webp" alt="" class="hs-l hs-portal hs-portal--3" />
          <img ref="p4" src="/images/story/ring4.webp" alt="" class="hs-l hs-portal hs-portal--4" />
          <div ref="strataEl" class="hs-l hs-strata"><img src="/images/story/strata.webp" srcset="/images/story/strata-sm.webp 960w, /images/story/strata.webp 1600w" sizes="110vw" alt="" /></div>

          <!-- 3. Отъезд: каменная толща уходит вниз, лес на кромке, небо -->
          <div ref="mountEl" class="hs-l hs-mount">
            <img src="/images/story/sky.webp" alt="" class="hs-mount__sky" />
            <img src="/images/about-story/cloud-a.webp" alt="" class="hs-scloud hs-scloud--1" />
            <img src="/images/about-story/cloud-b.webp" alt="" class="hs-scloud hs-scloud--2" />
            <img ref="mountImg" src="/images/story/massif.webp" alt="Каменная толща с лесом на кромке" class="hs-mount__body" />
          </div>

          <!-- 4. Белорусский лес -->
          <div ref="forestEl" class="hs-l hs-forest">
            <img ref="forestBg" src="/images/story/forest.webp" srcset="/images/story/forest-sm.webp 960w, /images/story/forest.webp 1600w" sizes="120vw" alt="" class="hs-forest__bg" />
            <img ref="bushEl" src="/images/story/bush-warm.webp" alt="" class="hs-fbush" />
            <img ref="fernEl" src="/images/story/fern-sun.webp" alt="" class="hs-ffern" />
            <img ref="forestBush" src="/images/story/bushwall.webp" alt="" class="hs-fhedge" />
            <img v-for="n in 4" :key="`f${n}`" :src="`/images/about-story/leaf-${n + 2}.webp`" alt="" class="hs-fall" :class="`hs-fall--${n}`" />
            <img ref="flyEl" src="/images/story/butterfly.webp" alt="" class="hs-fly" />
          </div>

          <!-- Переход: кусты поднимаются и закрывают кадр -->
          <img ref="riseBack" src="/images/story/bushwall.webp" alt="" class="hs-rise hs-rise--back" />
          <img ref="riseFront" src="/images/story/leavesfront.webp" alt="" class="hs-rise hs-rise--front" />
          <img ref="riseBranch" src="/images/about-story/branch.webp" alt="" class="hs-rise hs-rise--branch" />

          <!-- 5. Чаща раскрывается: капля ESP с лесным каскадом -->
          <div ref="dropScene" class="hs-l hs-dropscene">
            <img src="/images/story/pushcha.webp" srcset="/images/story/pushcha-sm.webp 960w, /images/story/pushcha.webp 1600w" sizes="110vw" alt="" class="hs-dropscene__bg" />
            <div ref="dropEl" class="hs-dropback">
              <img ref="cascadeEl" src="/images/story/drop-interior.webp" alt="Водопад в зелёном ущелье с бирюзовой чашей — кристально чистая вода" class="hs-dropin" />
              <img v-for="n in 3" :key="`bf${n}`" src="/images/story/butterfly.webp" alt="" class="hs-bfly" :class="`hs-bfly--${n}`" />
            </div>
            <div ref="dropFrame" class="hs-dropframe">
              <img src="/images/story/dropframe.webp" alt="" />
              <span ref="dropLogo" class="hs-drop__logo" role="img" aria-label="ESP" />
            </div>
            <img ref="closeL" src="/images/story/canopy.webp" alt="" class="hs-close hs-close--cl" />
            <img ref="closeR" src="/images/story/canopy.webp" alt="" class="hs-close hs-close--cr" />
            <img ref="closeB" src="/images/story/leavesfront.webp" alt="" class="hs-close hs-close--b" />
            <div ref="vignetteEl" class="hs-vignette" />
          </div>

          <!-- Тексты актов: заголовок, линия, абзац -->
          <div class="hs-texts">
            <article v-for="(t, i) in acts" :key="i" class="hs-say" :class="[`hs-say--${t.side}`, { 'is-on': act === i, 'is-deep': act === i && deep }]" :aria-hidden="act !== i">
              <component :is="i === 0 ? 'h1' : 'h2'" class="hs-say__h">{{ t.h }}</component>
              <span class="hs-say__line" aria-hidden="true"><i /><b /><i /></span>
              <p class="hs-say__p">{{ t.p }}</p>
            </article>
          </div>
          <span class="hs-hint" :class="{ 'is-off': act > 0 || deep }" aria-hidden="true">Прокрутите</span>
        </div>
      </section>

      <!-- ===== Акт 6: тёмная пуща — полный цикл ===== -->
      <div id="full-cycle" class="hs-dark">
        <div class="hs-dark__bg" aria-hidden="true"><img src="/images/story/pushcha.webp" alt="" loading="lazy" /></div>

        <section class="hs-textbeat hs-wrap6">
          <div class="hs-cols hs-up">
            <h2 class="hs-label">Решения на базе USBF</h2>
            <div class="hs-copy">
              <p class="hs-copy__lead">Технология USBF</p>
              <p>Внедряем технологию USBF под задачи конкретного объекта. Опираемся на 28 лет практики в биологической очистке сточных вод. Используем передовые разработки.</p>
            </div>
          </div>
        </section>

        <!-- Производство: машины ESP на замшелом валуне, листаются стрелками -->
        <section class="hs-comp hs-comp--prod">
          <div class="hs-comp__art" data-art>
            <img src="/images/story/platform.webp" alt="" class="hs-prod__stone" loading="lazy" data-depth="0" />
            <div class="hs-prod__stage" data-depth="0.25">
              <Transition name="hs-swap" mode="out-in">
                <NuxtLink :key="machine.slug" :to="`/equipment/${machine.slug}`" class="hs-prod__machine">
                  <img :src="machine.src" :alt="machine.name" loading="lazy" />
                </NuxtLink>
              </Transition>
            </div>
            <p class="hs-prod__name"><span>{{ String(machineIdx + 1).padStart(2, '0') }} / {{ String(machines.length).padStart(2, '0') }}</span>{{ machine.name }}</p>
            <button type="button" class="hs-arrow hs-arrow--prev" aria-label="Предыдущая машина" @click="shiftMachine(-1)"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M14.5 6l-6 6 6 6" /></svg></button>
            <button type="button" class="hs-arrow hs-arrow--next" aria-label="Следующая машина" @click="shiftMachine(1)"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9.5 6l6 6-6 6" /></svg></button>
          </div>
          <div class="hs-cols hs-wrap6 hs-up">
            <h3 class="hs-label">Производство</h3>
            <div class="hs-copy">
              <p class="hs-copy__lead">Собственный цех</p>
              <p>Точность в каждой детали. Качество в каждом узле.</p>
              <NuxtLink to="/equipment" class="hs-more">Каталог оборудования ›</NuxtLink>
            </div>
          </div>
        </section>

        <!-- Инжиниринг: под аркой упавшего дуба светится модель станции -->
        <section class="hs-comp hs-comp--eng">
          <div class="hs-comp__art" data-art>
            <img src="/images/story/arch.webp" alt="" class="hs-eng__arch" loading="lazy" data-depth="0" />
            <img src="/images/story/bim-glow.webp" alt="BIM-модель станции ESP" class="hs-eng__bim" loading="lazy" data-depth="0.5" />
            <div class="hs-spot" style="left: 50%; top: 52%">
              <button type="button" class="hs-hot hs-hot--warm" :class="{ 'is-open': openSpot === 'eng' }" :aria-expanded="openSpot === 'eng'" aria-label="Лидарное сканирование" @click="toggleSpot('eng')">
                <svg viewBox="0 0 60 60" aria-hidden="true"><circle class="hs-hot__big" cx="30" cy="30" r="26" /><circle class="hs-hot__small" cx="30" cy="30" r="13" /><circle class="hs-hot__dot" cx="30" cy="30" r="5" /><path class="hs-hot__x" d="M25 25l10 10M35 25L25 35" /></svg>
              </button>
              <p class="hs-hot__card" :class="{ 'is-open': openSpot === 'eng' }"><b>Лидарное сканирование</b>Дрон с лидаром облетает площадку и собирает облако из миллионов точек с сантиметровой точностью.</p>
            </div>
          </div>
          <div class="hs-cols hs-wrap6 hs-up">
            <h3 class="hs-label">Инжиниринг</h3>
            <div class="hs-copy">
              <p class="hs-copy__lead">Проектирование</p>
              <p>Проектируем будущее с точностью до миллиметра.</p>
              <p>На облаке точек рисуем линии новой станции: она встаёт на место старых сооружений и занимает в разы меньше площади. Жизнеспособное оставляем, остальное — под демонтаж.</p>
            </div>
          </div>
        </section>

        <!-- Эталон качества: знак-капля поднимается из дупла -->
        <section class="hs-comp hs-comp--sign">
          <div class="hs-comp__art" data-art>
            <img src="/images/story/hollow.webp" alt="" class="hs-sign__oak" loading="lazy" data-depth="0" />
            <img ref="signDrop" src="/images/story/kapla-sign.webp" alt="Знак качества ESP — капля" class="hs-sign__drop" loading="lazy" />
            <img src="/images/about-story/fern.webp" alt="" class="hs-sign__fern" loading="lazy" data-depth="-0.4" />
          </div>
          <div class="hs-cols hs-wrap6 hs-up">
            <h3 class="hs-label">Эталон качества</h3>
            <div class="hs-copy">
              <p class="hs-copy__lead">Кристальный просвет — стандарт прозрачности очищенной воды</p>
              <a href="#quality" class="hs-more" @click.prevent="jumpTo('#quality')">Подробнее о знаке ›</a>
            </div>
          </div>
        </section>
        <div class="hs-dark__fade" aria-hidden="true" />
      </div>
    </div>

    <!-- ===== Разделы в стиле DJI/Apple: содержание прежней страницы ===== -->
    <div ref="rest" class="ab-rest">
      <DjSubnav title="О компании" :links="subnav" :cta="{ to: '/contacts', label: 'Обсудить проект' }" />

      <!-- Инженерия, которой доверяют (прежний первый экран) -->
      <section id="about-intro" class="dj-sec ab-intro">
        <div class="dj-wrap dj-center">
          <span class="dj-eyebrow dj-reveal">28 лет опыта</span>
          <h2 class="dj-h1 ab-intro__h dj-reveal">Инженерия, которой доверяют</h2>
          <p class="dj-lede ab-intro__p dj-reveal">
            28 лет практики: от подрядных работ до собственного инжиниринга и производства. Проектируем, изготавливаем и запускаем очистные сооружения, отвечая за результат целиком.
          </p>
          <div class="ab-intro__btns dj-reveal">
            <a href="#history" class="dj-btn dj-btn--line" @click.prevent="jumpTo('#history')">Наша история</a>
            <a href="#ecosystem" class="dj-btn" @click.prevent="jumpTo('#ecosystem')">Экосистема ESP</a>
          </div>
        </div>
        <!-- Ролик из админки (раздел «about-hero»: video, poster) -->
        <div class="dj-wrap dj-wrap--wide">
          <div class="ab-film dj-reveal">
            <video ref="brandVideo" :key="aboutHero.video" :poster="aboutHero.poster" muted loop playsinline preload="none">
              <source :src="aboutHero.video" type="video/mp4" />
            </video>
          </div>
        </div>
      </section>

      <!-- Путь компании -->
      <section id="history" class="dj-sec dj-sec--soft">
        <div class="dj-wrap">
          <div class="dj-center ab-head">
            <h2 class="dj-h2 dj-reveal">Путь компании</h2>
            <p class="dj-lede dj-reveal">28 лет практики: от подрядных работ до собственного инжиниринга и производства</p>
          </div>
          <div class="ab-narrow dj-reveal">
            <div class="tl mb-12" :class="{ 'tl--open': futureEvent }">
              <div class="tl-rail">
                <span class="tl-line" aria-hidden="true"></span>
                <span class="tl-line tl-line--done" :style="{ width: progressWidth }" aria-hidden="true"></span>
                <span v-if="futureEvent" class="tl-future" :class="{ 'is-active': activeIsFuture }" aria-hidden="true">
                  <svg class="tl-arrow" viewBox="0 0 14 14"><path d="M2 2l9 5-9 5" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" /></svg>
                </span>
                <button
                  v-for="(ev, i) in timelineEvents"
                  :key="`${ev.year}-${i}`"
                  type="button"
                  class="tl-stop"
                  :class="{ 'is-passed': i <= activeYearIndex, 'is-active': i === activeYearIndex, 'tl-stop--future': isFuture(ev) }"
                  :style="{ left: stopLeft(i) }"
                  :aria-pressed="i === activeYearIndex"
                  @click="activeYearIndex = i"
                >
                  <span class="tl-dot" aria-hidden="true"></span>
                  <span class="tl-year">{{ ev.year }}</span>
                </button>
              </div>
            </div>
            <Transition name="ab-fade" mode="out-in">
              <div v-if="activeEvent" :key="activeYearIndex" class="tl-card" :class="{ 'tl-card--future': activeIsFuture }">
                <h3 class="dj-h3 ab-card__h">{{ activeEvent.title }}</h3>
                <p class="ab-card__p">{{ activeEvent.text }}</p>
              </div>
            </Transition>
          </div>
        </div>
      </section>

      <!-- Одна система ESP -->
      <section id="ecosystem" class="dj-sec">
        <div class="dj-wrap">
          <div class="dj-center ab-head">
            <h2 class="dj-h2 dj-reveal">Одна система ESP</h2>
            <p class="dj-lede dj-reveal">
              Проектирование и производство работают внутри одной компании: то, что рассчитали инженеры, изготавливается на нашем заводе и запускается той же командой.
            </p>
          </div>

          <div class="sys dj-reveal">
            <div class="sys-parts">
              <article class="sys-part sys-part--eng">
                <span class="sys-part-num">01 · Проектируем</span>
                <h3 class="sys-part-title">Инжиниринговый центр</h3>
                <p class="sys-part-text">
                  Расчёты, технологические решения и рабочая документация. Модель объекта
                  собирается до начала стройки — 30 000 элементов стыкуются ещё на этапе проекта.
                </p>
              </article>
              <div class="sys-link" aria-hidden="true">
                <span class="sys-link-node"><img src="/logo-esp.svg" alt="" width="56" height="28" /></span>
              </div>
              <article class="sys-part sys-part--prod">
                <span class="sys-part-num">02 · Изготавливаем</span>
                <h3 class="sys-part-title">Производственная база</h3>
                <p class="sys-part-text">
                  Собственное производство в Заславле. Оборудование выпускается по нашей же
                  документации, каждый узел проверяется до отгрузки на объект.
                </p>
              </article>
            </div>
            <div class="sys-caps">
              <h4 class="sys-caps-title">Что даёт одна система</h4>
              <ul class="sys-caps-list">
                <li v-for="cap in systemCaps" :key="cap">
                  <svg viewBox="0 0 16 16" aria-hidden="true"><path d="M3 8.5l3 3 7-7" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" /></svg>
                  <span>{{ cap }}</span>
                </li>
              </ul>
            </div>
          </div>

          <div class="ab-flow dj-reveal">
            <h3 class="dj-h3 ab-flow__h">Как проходит объект</h3>
            <EcosystemFlow />
          </div>
        </div>
      </section>

      <!-- Эталон качества -->
      <section id="quality" class="dj-sec dj-sec--soft">
        <div class="dj-wrap">
          <div class="ql-lead">
            <figure class="ql-drop dj-reveal">
              <img src="/images/quality-sign.jpg" alt="Знак качества ESP — фирменная капля «Эталон качества»" width="540" height="760" decoding="async" loading="lazy" />
            </figure>
            <div class="ql-lead-text dj-reveal">
              <span class="ql-kicker">Эталон качества</span>
              <h2 class="dj-h2 mb-5">Знак, который ставится на объекте</h2>
              <p class="ql-lede">
                Знак качества ESP, разработанный для экологических объектов.
                Подтверждает надёжность и экологичность объекта.
              </p>
              <ul class="ql-facts">
                <li><b>5 м</b><span>кристальный просвет — стандарт прозрачности очищенной воды</span></li>
                <li><b>ISO 9001</b><span>система менеджмента качества, эко-сертификация, патенты</span></li>
                <li><b>100%</b><span>ответственность за результат: проект, оборудование, пусконаладка</span></li>
              </ul>
            </div>
          </div>

          <figure class="ql-proof dj-reveal">
            <img src="/images/team/quality-standard.png" alt="Фирменная капля ESP на здании управления очистных сооружений" loading="lazy" />
            <figcaption>
              <b>Очистные сооружения после пусконаладки.</b>
              Капля на фасаде — отметка о том, что объект принят по внутреннему стандарту ESP.
            </figcaption>
          </figure>

          <div class="ql-stages dj-reveal">
            <div class="ql-stages-head">
              <h3>Путь к кристальной чистоте</h3>
              <p>Шесть контролируемых ступеней — от механической очистки до обеззараживания.
                Показатели на каждой фиксируются лабораторно.</p>
            </div>
            <div class="ql-track">
              <div v-for="(stage, i) in clarityStages" :key="stage.label" class="ql-stage">
                <span class="ql-stage-num" :class="{ 'is-final': i === clarityStages.length - 1 }">{{ i + 1 }}</span>
                <span class="ql-stage-bar">
                  <span class="ql-stage-fill" :class="{ 'is-final': i === clarityStages.length - 1 }" :style="{ width: `${((i + 1) / clarityStages.length) * 100}%` }"></span>
                </span>
                <b class="ql-stage-label">{{ stage.label }}</b>
                <i class="ql-stage-result">{{ stage.result }}</i>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- География работ -->
      <section id="map" class="dj-sec">
        <div class="dj-wrap">
          <div class="dj-center ab-head">
            <h2 class="dj-h2 dj-reveal">География работ</h2>
            <p class="dj-lede dj-reveal">Объекты, которые мы спроектировали, изготовили и запустили</p>
          </div>
          <div class="ab-map dj-reveal">
            <ClientOnly>
              <ProjectsMap :points="mapPoints" class="w-full aspect-video" />
              <template #fallback>
                <div class="w-full aspect-video flex items-center justify-center text-esp-black/40 text-sm">Загрузка карты…</div>
              </template>
            </ClientOnly>
          </div>
          <p class="ab-map__note">
            150+ проектов по всей Беларуси — <NuxtLink to="/projects" class="dj-more">смотреть полный список ›</NuxtLink>
          </p>
        </div>
      </section>

      <!-- Медиа-центр -->
      <section id="media" class="dj-sec dj-sec--soft">
        <div class="dj-wrap">
          <div class="dj-center ab-head">
            <h2 class="dj-h2 dj-reveal">Медиа-центр</h2>
            <p class="dj-lede dj-reveal">Видео о компании и презентации для заказчиков и партнёров</p>
          </div>
          <div class="ab-media">
            <template v-for="(item, i) in media" :key="`${item.title}-${i}`">
              <div v-if="item.kind !== 'presentation'" class="ab-mcard dj-reveal">
                <div class="ab-mcard__thumb">
                  <video
                    :ref="(el) => { mediaVideos[i] = el }"
                    :src="item.file"
                    :poster="item.poster || undefined"
                    muted
                    loop
                    playsinline
                    preload="metadata"
                    @pause="mediaPlaying[i] = false"
                  ></video>
                  <div class="ab-mcard__veil" :class="{ 'is-off': mediaPlaying[i] }" @click="mediaPlaying[i] && toggleMedia(i)">
                    <button type="button" class="ab-play" :aria-label="mediaPlaying[i] ? `Пауза: ${item.title}` : `Смотреть: ${item.title}`" @click.stop="toggleMedia(i)">
                      <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5.5v13l11-6.5z" /></svg>
                    </button>
                  </div>
                </div>
                <div class="ab-mcard__body">
                  <h3 class="ab-mcard__h">{{ item.title }}</h3>
                  <p class="ab-mcard__p">{{ item.desc }}</p>
                  <span v-if="item.duration" class="ab-mcard__meta"><Icon name="clock" cls="w-3.5 h-3.5" />{{ item.duration }}</span>
                </div>
              </div>
              <a v-else :href="item.file" download target="_blank" rel="noopener" class="ab-mcard dj-reveal">
                <div class="ab-mcard__thumb ab-mcard__thumb--doc">
                  <img v-if="item.poster" :src="item.poster" :alt="item.title" loading="lazy" />
                  <img v-else src="/logo-esp.svg" alt="" class="ab-mcard__logo" />
                </div>
                <div class="ab-mcard__body">
                  <h3 class="ab-mcard__h">{{ item.title }}</h3>
                  <p class="ab-mcard__p">{{ item.desc }}</p>
                  <span class="ab-mcard__meta"><Icon name="download" cls="w-3.5 h-3.5" />{{ item.duration || 'Скачать презентацию' }}</span>
                </div>
              </a>
            </template>
          </div>
        </div>
      </section>
    </div>

    <!-- Финал в пуще: светлячки, камыш — призыв из прежней страницы -->
    <section class="hs hs-final">
      <img src="/images/about-story/fern.webp" alt="" class="hs-final__fern" loading="lazy" />
      <div class="hs-final__in hs-fin">
        <span class="hs-say__line hs-say__line--static" aria-hidden="true"><i /><b /><i /></span>
        <h2 class="hs-final__h">Готовы создать Эталон качества?</h2>
        <p class="hs-final__p">Обсудим ваш объект и подготовим решение — от обследования площадки до запуска очистных сооружений</p>
        <div class="hs-final__btns">
          <NuxtLink to="/contacts" class="hs-btn">Обсудить проект</NuxtLink>
          <NuxtLink to="/projects" class="hs-btn hs-btn--ghost">Посмотреть кейсы</NuxtLink>
        </div>
      </div>
      <i v-for="n in 14" :key="`ff${n}`" class="hs-firefly" :style="fireflyStyle(n)" />
      <img src="/images/about-story/reeds.webp" alt="" class="hs-final__reeds" loading="lazy" />
    </section>
  </div>
</template>

<script setup>
import { ref, reactive, computed, watch, onMounted, onBeforeUnmount, nextTick } from 'vue'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useProjectGeo } from '~/composables/useProjectGeo'
import { useReveal } from '~/composables/useReveal'

const { on: soundOn, toggle: toggleSound, setScene, dispose: disposeSound } = useDropAmbience()
const { getBySlug } = useEquipment()
const { mapPoints } = useProjectGeo()
const { timeline } = useTimeline()
const { media } = useMediaCenter()

// ===== Тексты актов истории =====
const acts = [
  { side: 'c', h: 'Мы архитекторы технологий очистки воды', p: '28 лет опыта. Экосистема, состоящая из 30 000 элементов.' },
  { side: 'c', h: 'Природа очищает воду слой за слоем', p: 'Песок, глина и корни фильтруют её веками. Мы переняли этот принцип у самой земли.' },
  { side: 'r', h: 'И природа возвращается', p: 'Старые поля фильтрации рекультивируем — на их месте лес или поле. Станцией управляет ИИ 24/7.' },
  { side: 'l', h: 'Кристальная чистота воды с просветом 4 метра', p: 'Произведено в Республике Беларусь.' }
]
// Время актов на общей шкале сцены (1 = экран прокрутки)
const ACTS = [[0, 2.7], [5.9, 7.5], [9.0, 11.2], [13.1, 15.0]]
const TOTAL = 15.3

// ===== Машины ESP на валуне =====
const machines = [
  ['flotation', 'flotation-units'], ['microfilter', 'microfilters-sand-traps'], ['polymer-station', 'polymer-dosing-station'],
  ['belt-filter-press', 'filter-press'], ['rotary-drum-sieve', 'rotary-drum-sieve'], ['sand-separator', 'sand-separator'], ['screw-conveyor', 'screw-conveyor']
].map(([file, slug]) => ({ src: `/images/story/equip/${file}.webp`, slug, name: getBySlug(slug)?.name || '' }))
const machineIdx = ref(0)
const machine = computed(() => machines[machineIdx.value])
const shiftMachine = (d) => { machineIdx.value = (machineIdx.value + d + machines.length) % machines.length }

// ===== Разделы после истории =====
const subnav = [
  { href: '#history', label: 'История' },
  { href: '#ecosystem', label: 'Система ESP' },
  { href: '#quality', label: 'Качество' },
  { href: '#map', label: 'География' },
  { href: '#media', label: 'Медиа' }
]

// Ролик из админки (раздел «about-hero»); пока раздела нет — ролик из сборки
const aboutHeroList = useEditableList('about-hero', [
  { video: '/videos/hero/about-water.mp4', poster: '/images/hero-bg.jpg' }
])
const aboutHero = computed(() => {
  const item = aboutHeroList.value.find((h) => h && h.video) || {}
  return { video: item.video || '/videos/hero/about-water.mp4', poster: item.poster || '/images/hero-bg.jpg' }
})

// Путь компании: годы из админки + «вектор в будущее»
const isFuture = (ev) => !/^\d{4}$/.test(String(ev?.year ?? '').trim())
const pastEvents = computed(() => timeline.value.filter((ev) => ev && !isFuture(ev)))
const futureEvent = computed(() => timeline.value.find((ev) => ev && isFuture(ev)) || null)
const timelineEvents = computed(() => (futureEvent.value ? [...pastEvents.value, futureEvent.value] : pastEvents.value))
const activeYearIndex = ref(Math.max(pastEvents.value.length - 1, 0))
watch(() => pastEvents.value.length, (n) => { activeYearIndex.value = Math.max(n - 1, 0) })
const activeEvent = computed(() => timelineEvents.value[activeYearIndex.value] || timelineEvents.value[0])
const activeIsFuture = computed(() => !!activeEvent.value && isFuture(activeEvent.value))
const stopLeft = (i) => {
  const n = pastEvents.value.length
  if (i >= n) return '100%'
  const frac = n > 1 ? i / (n - 1) : 0
  return futureEvent.value ? `calc((100% - var(--tl-tail)) * ${frac})` : `${frac * 100}%`
}
const progressWidth = computed(() =>
  activeYearIndex.value >= pastEvents.value.length ? 'calc(100% - var(--tl-tail))' : stopLeft(activeYearIndex.value)
)

const systemCaps = [
  '3D-проектирование и BIM-модель объекта',
  'Лидарное сканирование площадки с точностью до миллиметра',
  'Цифровой двойник для простой эксплуатации',
  'Собственное производство в Заславле',
  'Локализация узлов и импортозамещение',
  'Бережливое производство по принципам Lean',
  'Контроль качества на каждом этапе',
  '100+ специалистов в штате'
]

const clarityStages = [
  { label: 'Механическая', result: 'Отделение крупных примесей и песка' },
  { label: 'Физико-химическая', result: 'Связывание фосфора и тонкой взвеси' },
  { label: 'Биологическая USBF', result: 'Удаление органики и азота' },
  { label: 'Механическое обезвоживание осадков', result: 'Сокращение объёма осадка' },
  { label: 'Микрофильтрация', result: 'Доочистка от мельчайших частиц' },
  { label: 'Обеззараживание', result: 'Безопасная вода на выпуске' }
]

// Медиа-центр: видео по клику на ▶
const mediaVideos = {}
const mediaPlaying = reactive({})
const toggleMedia = (i) => {
  const el = mediaVideos[i]
  if (!el) return
  if (el.paused) el.play().then(() => { mediaPlaying[i] = true }).catch(() => {})
  else { el.pause(); mediaPlaying[i] = false }
}

const jumpTo = (href) => {
  const el = document.querySelector(href)
  if (!el) return
  window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 56 - 52, behavior: 'smooth' })
}

// ===== Состояние истории =====
const preload = ['/images/story/water.webp', '/images/about-story/cloud-a.webp', '/images/about-story/cloud-b.webp', '/images/story/ring.webp', '/images/story/pit.webp', '/images/story/strata.webp', '/images/story/sky.webp']
const root = ref(null)
const rest = ref(null)
const stageWrap = ref(null)
const waterEl = ref(null)
const clouds = []
const p1 = ref(null); const p2 = ref(null); const p3 = ref(null); const p4 = ref(null); const pShade = ref(null)
const strataEl = ref(null); const mountEl = ref(null); const mountImg = ref(null)
const forestEl = ref(null); const forestBg = ref(null); const bushEl = ref(null); const fernEl = ref(null); const flyEl = ref(null); const forestBush = ref(null)
const riseBack = ref(null); const riseFront = ref(null); const riseBranch = ref(null)
const dropScene = ref(null); const dropEl = ref(null); const cascadeEl = ref(null); const dropLogo = ref(null); const dropFrame = ref(null)
const closeL = ref(null); const closeR = ref(null); const closeB = ref(null); const vignetteEl = ref(null)
const signDrop = ref(null)
const brandVideo = ref(null)

const loaderGone = ref(false)
const seen = ref(false)
const inIntro = ref(true)
const pastStory = ref(false)
const act = ref(0)
const deep = ref(false)
const openSpot = ref(null)
const toggleSpot = (id) => { openSpot.value = openSpot.value === id ? null : id }

const fireflyStyle = (n) => {
  const r = (k) => Math.round((((Math.sin(n * 12.9898 + k * 78.233) * 43758.5453) % 1 + 1) % 1) * 1000) / 1000
  return { left: `${(6 + r(1) * 88).toFixed(1)}%`, top: `${(20 + r(2) * 60).toFixed(1)}%`, animationDelay: `${(r(3) * 6).toFixed(2)}s`, animationDuration: `${(5 + r(4) * 5).toFixed(2)}s` }
}

// Пока идёт загрузка — прокрутка документа заблокирована (без Lenis: нативный скролл)
const lockScroll = (v) => { document.documentElement.style.overflow = v ? 'hidden' : '' }
const onLoaded = () => {
  loaderGone.value = true
  lockScroll(false)
  try { sessionStorage.setItem('hs-seen', '1') } catch {}
  ScrollTrigger.refresh()
}

let lastScene = ''
const onStage = (t) => {
  const i = ACTS.findIndex(([a, b]) => t >= a && t <= b)
  act.value = i
  deep.value = i >= 0 && t > ACTS[i][0] + (ACTS[i][1] - ACTS[i][0]) * 0.42
  const scene = t < 3 ? 'water' : t < 8.6 ? 'earth' : t < 12.3 ? 'forest' : 'drop'
  if (scene !== lastScene) { lastScene = scene; setScene(scene) }
}

useReveal(rest)

let ctx = null
let prevRestoration = 'auto'
let filmIo = null

onMounted(async () => {
  try { seen.value = sessionStorage.getItem('hs-seen') === '1' } catch {}
  prevRestoration = history.scrollRestoration
  history.scrollRestoration = 'manual'
  window.scrollTo(0, 0)
  lockScroll(true)
  await nextTick()

  // Ролик о компании играет только в кадре
  if (brandVideo.value && 'IntersectionObserver' in window) {
    filmIo = new IntersectionObserver(([e]) => {
      const v = brandVideo.value
      if (!v) return
      if (e.isIntersecting) v.play().catch(() => {})
      else v.pause()
    }, { threshold: 0.25 })
    filmIo.observe(brandVideo.value)
  }

  gsap.registerPlugin(ScrollTrigger)
  // Шапка сайта фиксирована (56px): сцена липнет под ней
  const headH = () => parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--dj-header-h')) || 56

  ctx = gsap.context(() => {
    const mm = gsap.matchMedia()
    mm.add({ desk: '(min-width: 768px)', mob: '(max-width: 767px)', still: '(prefers-reduced-motion: reduce)' }, (c) => {
      const { desk, still } = c.conditions
      if (still) { act.value = 0; deep.value = true; return }

      const tl = gsap.timeline({
        defaults: { ease: 'none' },
        scrollTrigger: {
          trigger: stageWrap.value,
          start: () => `top ${headH()}px`,
          end: 'bottom bottom',
          scrub: 1,
          invalidateOnRefresh: true,
          onUpdate: (s) => onStage(s.progress * TOTAL),
          onLeave: () => { inIntro.value = false; act.value = -1; setScene('dark') },
          onEnterBack: () => { inIntro.value = true }
        }
      })

      // 1. Вода: камера медленно снижается, облака уходят вверх с разной скоростью
      tl.fromTo(waterEl.value, { scale: 1.08 }, { scale: 1.16, duration: 5 }, 0)
        .to(waterEl.value, { yPercent: 7, duration: 3.0 }, 2.5)
      const cm = desk
        ? [{ y: '-115vh', x: '-4vw' }, { y: '-70vh', x: '5vw' }, { y: '-95vh', x: '3vw' }, { y: '-160vh', x: '6vw' }]
        : [{ y: '-120vh' }, { y: '-80vh' }, { y: '-100vh' }, { y: '-170vh' }]
      clouds.forEach((el, i) => el && tl.to(el, { ...cm[i], duration: 3.2 }, 0))

      // 2. Портал: слои земли смыкаются, отверстие сужается и закрывается
      tl.fromTo(pShade.value, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.7 }, 2.6)
      tl.fromTo(p1.value, { scale: 2.6, autoAlpha: 0 }, { scale: 1, autoAlpha: 1, duration: 1.3, ease: 'power1.out' }, 2.5)
        .fromTo(p2.value, { scale: 2.5, autoAlpha: 0 }, { scale: 1, autoAlpha: 1, duration: 1.2, ease: 'power1.out' }, 3.1)
        .fromTo(p3.value, { scale: 2.3, autoAlpha: 0 }, { scale: 1, autoAlpha: 1, duration: 1.15, ease: 'power1.out' }, 3.7)
        .fromTo(p4.value, { scale: 2.1, autoAlpha: 0 }, { scale: 1, autoAlpha: 1, duration: 1.05, ease: 'power1.out' }, 4.3)
        .fromTo(strataEl.value, { scale: 1.6, autoAlpha: 0 }, { scale: 1.06, autoAlpha: 1, duration: 0.7 }, 4.95)
        .set([waterEl.value, ...clouds, p1.value, p2.value, p3.value, p4.value], { autoAlpha: 0 }, 5.5)

      // 3. Небо с облаками; каменная масса уезжает вниз единым слоем
      tl.fromTo(mountEl.value, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.25 }, 5.5)
        .fromTo(mountImg.value, { yPercent: -6 }, { yPercent: 62, duration: 1.8, ease: 'none' }, 5.55)
        .to(strataEl.value, { autoAlpha: 0, duration: 0.3 }, 5.6)
        .fromTo('.hs-scloud--1', { xPercent: 10 }, { xPercent: -16, duration: 3.4 }, 5.6)
        .fromTo('.hs-scloud--2', { xPercent: -6 }, { xPercent: 12, duration: 3.4 }, 5.6)

      // Зелень закрывает небо
      tl.fromTo(riseBack.value, { yPercent: 100 }, { yPercent: 0, duration: 1.1, ease: 'power1.out' }, 7.5)
        .fromTo(riseFront.value, { yPercent: 110 }, { yPercent: 6, duration: 1.0, ease: 'power1.out' }, 7.7)
        .fromTo(riseBranch.value, { xPercent: -130, rotation: -14 }, { xPercent: 0, rotation: 0, duration: 1.0, ease: 'power2.out' }, 7.8)
        .to(mountImg.value, { yPercent: 130, duration: 1.2, ease: 'power1.in' }, 7.6)
        .set(forestEl.value, { autoAlpha: 1 }, 8.6)
        .set(mountEl.value, { autoAlpha: 0 }, 8.65)
        .to(riseBack.value, { yPercent: -135, duration: 1.0, ease: 'power1.in' }, 8.75)
        .to(riseFront.value, { yPercent: -170, duration: 0.9, ease: 'power1.in' }, 8.7)
        .to(riseBranch.value, { yPercent: -220, duration: 0.9, ease: 'power1.in' }, 8.75)

      // 4. Лес
      tl.fromTo(forestBg.value, { scale: 1.28 }, { scale: 1.04, duration: 3.2 }, 8.6)
        .fromTo(bushEl.value, { xPercent: -80 }, { xPercent: 0, duration: 1.2, ease: 'power2.out' }, 9.0)
        .fromTo(fernEl.value, { yPercent: 60, rotation: -10 }, { yPercent: 0, rotation: 0, duration: 1.1, ease: 'power2.out' }, 9.2)
        .fromTo(flyEl.value, { x: '-15vw', y: '55vh', rotation: 30 }, { x: '105vw', y: '8vh', rotation: -8, duration: 2.4, ease: 'sine.inOut' }, 9.1)
        .fromTo(forestBush.value, { yPercent: 45 }, { yPercent: 0, duration: 1.2, ease: 'power2.out' }, 8.85)

      // 5. Крона смыкается — и раскрывает каплю
      tl.set(dropScene.value, { autoAlpha: 1 }, 11.15)
        .fromTo(closeL.value, { xPercent: -108 }, { xPercent: 0, duration: 0.9, ease: 'power2.out' }, 11.15)
        .fromTo(closeR.value, { xPercent: 108 }, { xPercent: 0, duration: 0.9, ease: 'power2.out' }, 11.2)
        .fromTo(closeB.value, { yPercent: 120 }, { yPercent: 12, duration: 0.9, ease: 'power2.out' }, 11.25)
        .set(forestEl.value, { autoAlpha: 0 }, 12.15)
        .fromTo(dropEl.value, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.3 }, 12.25)
        .fromTo(dropFrame.value, { scale: 2.6, autoAlpha: 0 }, { scale: 2.6, autoAlpha: 1, duration: 0.3 }, 12.25)
        .to(dropFrame.value, { scale: 1.16, duration: 1.6, ease: 'power1.inOut' }, 12.4)
        .to(closeL.value, { xPercent: -118, duration: 1.3, ease: 'power1.inOut' }, 12.5)
        .to(closeR.value, { xPercent: 118, duration: 1.3, ease: 'power1.inOut' }, 12.5)
        .to(closeB.value, { yPercent: 135, duration: 1.2, ease: 'power1.inOut' }, 12.5)
        .fromTo(cascadeEl.value, { yPercent: -10, scale: 1.3 }, { yPercent: 2, scale: 1.02, duration: 2.5 }, 12.35)
        .fromTo(dropLogo.value, { autoAlpha: 0, scale: 0.82 }, { autoAlpha: 1, scale: 1, duration: 0.5, ease: 'power2.out' }, 13.6)
        .to(vignetteEl.value, { opacity: 1, duration: 1 }, 14.4)
        .to(dropFrame.value, { scale: 1.22, duration: 1 }, 14.4)
        .set({}, {}, TOTAL)

      // ===== Акт 6: композиции с глубиной, появление текста =====
      gsap.utils.toArray('[data-art]').forEach((art) => {
        art.querySelectorAll('[data-depth]').forEach((el) => {
          const d = parseFloat(el.dataset.depth)
          gsap.fromTo(el, { yPercent: 14 * d }, { yPercent: -14 * d, ease: 'none', scrollTrigger: { trigger: art, start: 'top bottom', end: 'bottom top', scrub: true } })
        })
        gsap.fromTo(art, { autoAlpha: 0, scale: 0.92 }, { autoAlpha: 1, scale: 1, duration: 1.2, ease: 'power3.out', scrollTrigger: { trigger: art, start: 'top 80%', once: true } })
      })
      gsap.fromTo(signDrop.value, { yPercent: 70, scale: 0.4, autoAlpha: 0 }, { yPercent: 0, scale: 1, autoAlpha: 1, ease: 'power2.out', scrollTrigger: { trigger: '.hs-comp--sign', start: 'top 70%', end: 'center 42%', scrub: 1 } })
      gsap.utils.toArray('.hs-up').forEach((el) => {
        gsap.from(el, { autoAlpha: 0, y: 40, duration: 1, ease: 'power3.out', scrollTrigger: { trigger: el, start: 'top 88%', once: true } })
      })
    })

    // Звук и кнопка — только в пределах истории
    ScrollTrigger.create({
      trigger: root.value,
      start: 'top top',
      end: 'bottom 60%',
      onLeave: () => { pastStory.value = true; if (soundOn.value) toggleSound() },
      onEnterBack: () => { pastStory.value = false }
    })
  }, root.value)
})

onBeforeUnmount(() => {
  ctx?.revert()
  filmIo?.disconnect()
  disposeSound()
  lockScroll(false)
  history.scrollRestoration = prevRestoration
})

const ogOrigin = useRuntimeConfig().public.ogOrigin
useHead({
  title: 'О компании ESP | EcoServiceProject — 28 лет опыта, 30 000 элементов',
  meta: [
    { name: 'description', content: 'История EcoServiceProject с 1999 года: собственный инжиниринг и производство очистных сооружений, таймлайн компании, сертификаты качества.' },
    { property: 'og:title', content: 'О компании ESP | 28 лет опыта' },
    { property: 'og:description', content: 'История EcoServiceProject с 1999 года: собственный инжиниринг и производство, сертификаты качества, 150+ объектов в Беларуси.' },
    { property: 'og:image', content: `${ogOrigin}/images/og-esp.png` }
  ],
  link: [
    { rel: 'canonical', href: 'https://ecoservisproekt.by/about' },
    { rel: 'preload', as: 'image', href: '/images/story/water.webp', fetchpriority: 'high' }
  ]
})
</script>

<style scoped>
.hs {
  --hs-ink: #04110a;
  --hs-cream: #f3efe4;
  --hs-blue: #4aa3ff;
  --hs-warm: #ffb547;
  --hs-navy: #002366;
  background: var(--hs-ink);
  color: var(--hs-cream);
  overflow-x: clip;
}

/* ---------- Кнопки поверх ---------- */
.hs-sound {
  position: fixed; z-index: 110; color: #fff;
  border: 1.5px solid rgba(255, 255, 255, 0.85);
  background: rgba(0, 0, 0, 0.14); backdrop-filter: blur(6px); -webkit-backdrop-filter: blur(6px);
}
.hs-sound { top: calc(var(--dj-header-h, 56px) + 16px); right: 24px; width: 48px; height: 48px; border-radius: 50%; display: grid; place-items: center; transition: top 0.5s ease, background-color 0.3s ease; }
.hs-sound.is-docked { top: calc(100% - 72px); background: rgba(4, 17, 10, 0.82); }
.hs-sound svg { width: 22px; height: 22px; stroke: currentColor; stroke-width: 2; stroke-linecap: round; }
.hs-sound line { transform-origin: center; transform: scaleY(0.25); transition: transform 0.3s ease; }
.hs-sound.is-on line { animation: hs-bars 0.9s ease-in-out infinite alternate; }
@keyframes hs-bars { from { transform: scaleY(0.25); } to { transform: scaleY(1); } }

/* ---------- Сцена ---------- */
.hs-wrap { height: 1800vh; position: relative; }
.hs-stage { position: sticky; top: var(--dj-header-h, 56px); height: calc(100vh - var(--dj-header-h, 56px)); height: calc(100svh - var(--dj-header-h, 56px)); overflow: hidden; background: #0b3c86; }
.hs-l { position: absolute; inset: 0; will-change: transform; }
.hs-water { inset: -8%; }
.hs-water img, .hs-strata img { width: 100%; height: 100%; object-fit: cover; }
.hs-water img { position: absolute; inset: 0; }
.hs-cloud { position: absolute; max-width: none; pointer-events: none; will-change: transform; animation: hs-float 18s ease-in-out infinite alternate; }
.hs-cloud--1 { left: -18%; top: 34%; width: 70vw; }
.hs-cloud--2 { right: -14%; top: -12%; width: 72vw; scale: -1 1; animation-duration: 22s; }
.hs-cloud--3 { left: -22%; top: -10%; width: 58vw; scale: -1 -1; animation-duration: 26s; }
.hs-cloud--4 { left: 8%; top: 74%; width: 110vw; scale: 1 -1; animation-duration: 20s; }
@keyframes hs-float { to { translate: 3vw 0; } }
.hs-portal { width: 100%; height: 100%; object-fit: cover; visibility: hidden; }
/* Слой ПОД слоем: каждое следующее кольцо рисуется под предыдущим */
.hs-portal--1 { z-index: 14; }
.hs-portal--2 { z-index: 13; }
.hs-portal--3 { z-index: 12; }
.hs-portal--4 { z-index: 11; }
.hs-strata { z-index: 15; }
.hs-mount { z-index: 15; }
.hs-forest { z-index: 17; }
.hs-rise--back { z-index: 18; }
.hs-rise--front { z-index: 19; }
.hs-dropscene { z-index: 20; }
.hs-pshade { visibility: hidden; pointer-events: none; background: radial-gradient(ellipse 44% 46% at 50% 50%, transparent 52%, rgba(4, 8, 14, 0.6) 100%); }
.hs-strata { visibility: hidden; }
.hs-mount { visibility: hidden; background: #8cc3f0; }
.hs-mount__sky { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; }
.hs-mount__body { position: absolute; left: 50%; top: 0; translate: -50% 0; width: 118vw; max-width: none; will-change: transform; }
.hs-scloud { position: absolute; max-width: none; will-change: transform; }
.hs-scloud--1 { left: 5%; top: 9%; width: 44vw; }
.hs-scloud--2 { right: 3%; top: 26%; width: 36vw; opacity: 0.9; }
.hs-land { visibility: hidden; background: #8cc3f0; }
.hs-sky { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; will-change: transform; }
.hs-section { position: absolute; left: 50%; bottom: -2%; width: max(98vw, 152vh); translate: -50% 0; transform-origin: 50% 82%; will-change: transform; }
.hs-section > img { display: block; width: 100%; height: auto; }
.hs-fillwrap { position: absolute; left: 33.0%; top: 60.5%; width: 34.5%; height: 27.5%; overflow: hidden; pointer-events: none; }
.hs-fill { position: absolute; inset: 0; transform-origin: top; background: linear-gradient(rgba(64, 50, 32, 0.94), rgba(42, 33, 22, 0.97)); box-shadow: inset 0 -14px 26px rgba(0, 0, 0, 0.55); will-change: transform; }
.hs-fill::after { content: ''; position: absolute; left: 0; right: 0; bottom: -2px; height: 6px; background: rgba(235, 250, 255, 0.8); filter: blur(2px); }
.hs-spots { position: absolute; inset: 0; opacity: 0; pointer-events: none; transition: opacity 0.5s ease; }
.hs-spots.is-on { opacity: 1; pointer-events: auto; }

.hs-forest { visibility: hidden; }
.hs-forest__bg { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; will-change: transform; }
.hs-fbush { position: absolute; left: -6vw; bottom: -6%; height: 92%; width: auto; max-width: none; will-change: transform; }
.hs-ffern { position: absolute; left: 22vw; bottom: -8%; width: 34vw; max-width: none; will-change: transform; }
.hs-fhedge { position: absolute; left: -6%; bottom: -14%; width: 112%; max-width: none; filter: brightness(0.5) saturate(1.05); will-change: transform; }
.hs-fall { position: absolute; width: clamp(38px, 3.2vw, 60px); pointer-events: none; animation: hs-fall 9s linear infinite; }
.hs-fall--1 { left: 18%; top: -10%; animation-delay: -1s; }
.hs-fall--2 { left: 46%; top: -10%; animation-delay: -4s; animation-duration: 11s; }
.hs-fall--3 { left: 70%; top: -10%; animation-delay: -7s; animation-duration: 10s; }
.hs-fall--4 { left: 84%; top: -10%; animation-delay: -2.5s; animation-duration: 12s; }
@keyframes hs-fall { 0% { transform: translate(0, 0) rotate(0); opacity: 0; } 8% { opacity: 1; } 50% { transform: translate(-6vw, 60vh) rotate(160deg); } 92% { opacity: 1; } 100% { transform: translate(4vw, 120vh) rotate(320deg); opacity: 0; } }
.hs-fly { position: absolute; left: 0; top: 0; width: clamp(54px, 4.6vw, 86px); will-change: transform; animation: hs-flap 0.32s ease-in-out infinite alternate; }
@keyframes hs-flap { to { scale: 0.45 1; } }

.hs-rise { position: absolute; left: 50%; bottom: 0; translate: -50% 0; max-width: none; pointer-events: none; will-change: transform; }
.hs-rise--back { width: max(160vw, 230vh); }
.hs-rise--front { width: max(130vw, 190vh); bottom: -12%; }
.hs-rise--branch { left: -4vw; top: -6%; bottom: auto; translate: 0 0; width: 44vw; z-index: 19; transform-origin: top left; }

.hs-dropscene { visibility: hidden; }
.hs-dropscene__bg { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; }
.hs-dropback { position: absolute; left: 50%; top: 50%; width: min(64vw, 115vh); height: 106%; translate: -50% -50%; overflow: hidden; visibility: hidden; }
.hs-dropback .hs-dropin { width: 100%; height: 100%; object-fit: cover; will-change: transform; }
.hs-dropframe { position: absolute; left: -2%; top: -2%; width: 104%; height: 104%; will-change: transform; visibility: hidden; }
.hs-dropframe > img { width: 100%; height: 100%; object-fit: cover; }
/* Премиальный сумрак по краям кадра — капля остаётся единственным светом */
.hs-dropframe::after { content: ''; position: absolute; inset: 0; background: radial-gradient(ellipse 42% 54% at 50% 47%, transparent 52%, rgba(3, 12, 8, 0.3) 80%, rgba(2, 8, 5, 0.55) 100%); }
.hs-drop__logo { position: absolute; left: 50%; top: 27%; width: min(13.5vw, 24vh); aspect-ratio: 120 / 61; translate: -50% -50%; background: #002366; -webkit-mask: url(/logo-esp.svg) center / contain no-repeat; mask: url(/logo-esp.svg) center / contain no-repeat; filter: drop-shadow(0 0 2px rgba(255, 255, 255, 0.9)) drop-shadow(0 0 14px rgba(255, 255, 255, 0.45)) drop-shadow(0 8px 24px rgba(0, 20, 50, 0.4)); visibility: hidden; }
.hs-bfly { position: absolute; width: 6%; animation: hs-flap 0.42s ease-in-out infinite alternate, hs-bdrift 9s ease-in-out infinite alternate; }
.hs-bfly--1 { left: 24%; top: 50%; }
.hs-bfly--2 { right: 22%; top: 42%; scale: -1 1; width: 5%; animation-duration: 0.36s, 11s; }
.hs-bfly--3 { left: 37%; top: 64%; width: 4%; animation-duration: 0.5s, 8s; }
@keyframes hs-bdrift { to { translate: 2vw -3vh; } }
.hs-close { position: absolute; max-width: none; pointer-events: none; will-change: transform; }
.hs-close--cl { left: -6%; top: -5%; width: 72%; height: 110%; object-fit: cover; }
.hs-close--cr { right: -6%; top: -5%; width: 72%; height: 110%; object-fit: cover; scale: -1 1; }
.hs-close--b { left: 50%; bottom: -10%; width: max(140vw, 200vh); translate: -50% 0; }
.hs-vignette { position: absolute; inset: 0; opacity: 0; pointer-events: none; background: radial-gradient(ellipse 46% 58% at 50% 48%, transparent 0%, rgba(4, 17, 10, 0.78) 62%, var(--hs-ink) 100%); }

/* Тексты актов */
.hs-texts { position: absolute; inset: 0; pointer-events: none; z-index: 30; }
.hs-say { position: absolute; top: 13vh; bottom: 12vh; width: min(30rem, 34vw); display: flex; flex-direction: column; align-items: flex-start; color: #fff; }
.hs-say--r { left: 58vw; }
.hs-say--l { left: 9vw; }
/* Как у аналога: вертикальная линия по центру экрана, текст справа от неё */
.hs-say--c { left: 50%; translate: 0 0; width: min(38rem, 44vw); top: 0; bottom: 11vh; align-items: flex-start; text-align: left; padding: 15vh 0 0 2.6rem; }
.hs-say--c .hs-say__line { position: absolute; left: 0; top: -1vh; bottom: 0; margin: 0; }
.hs-say--c .hs-say__line i:first-child { opacity: 0 !important; }
.hs-say--c .hs-say__p { max-width: 24rem; margin-top: auto; margin-bottom: 4vh; }
.hs-say--c .hs-actyears { justify-content: flex-start; }
.hs-actyears { display: flex; flex-wrap: wrap; justify-content: center; gap: 0.5rem 1.4rem; margin-top: 1.1rem; padding: 0; list-style: none; font-size: 12px; font-weight: 700; letter-spacing: 0.14em; color: rgba(255, 255, 255, 0.9); text-shadow: 0 1px 10px rgba(0, 12, 30, 0.6); opacity: 0; transform: translateY(14px); transition: opacity 0.6s ease, transform 0.8s cubic-bezier(0.16, 1, 0.3, 1); }
.hs-say.is-deep .hs-actyears { opacity: 1; transform: none; transition-delay: 1.15s; }
.hs-say__h { font-family: var(--font-display); font-weight: 700; font-size: clamp(1.45rem, 2.1vw, 2.2rem); line-height: 1.12; text-transform: uppercase; letter-spacing: 0.01em; text-shadow: 0 2px 24px rgba(0, 12, 30, 0.55); opacity: 0; transform: translateY(26px); transition: opacity 0.7s ease, transform 0.9s cubic-bezier(0.16, 1, 0.3, 1); }
.hs-say__line { display: flex; flex-direction: column; align-items: center; gap: 0; margin: 1.2rem 0 0 0.5rem; flex: 1 1 auto; }
.hs-say__line i { width: 7px; height: 7px; border-radius: 50%; background: #fff; flex: none; opacity: 0; transition: opacity 0.4s ease 0.3s; }
.hs-say__line b { width: 1px; flex: 1 1 auto; background: rgba(255, 255, 255, 0.85); transform-origin: top; transform: scaleY(0); transition: transform 1.1s cubic-bezier(0.65, 0, 0.35, 1) 0.15s; }
.hs-say__p { max-width: 24rem; margin-top: 1rem; font-size: 15px; font-weight: 600; line-height: 1.55; text-shadow: 0 1px 14px rgba(0, 12, 30, 0.6); opacity: 0; transform: translateY(16px); transition: opacity 0.6s ease, transform 0.8s cubic-bezier(0.16, 1, 0.3, 1); }
.hs-say.is-on .hs-say__h { opacity: 1; transform: none; }
.hs-say.is-on .hs-say__line i:first-child { opacity: 1; }
.hs-say.is-on .hs-say__line b { transform: scaleY(0.35); }
.hs-say.is-deep .hs-say__line b { transform: scaleY(1); }
.hs-say.is-deep .hs-say__line i:last-child { opacity: 1; transition-delay: 1s; }
.hs-say.is-deep .hs-say__p { opacity: 1; transform: none; transition-delay: 0.9s; }
.hs-hint { position: absolute; left: 50%; bottom: 26px; translate: -50% 0; z-index: 31; font-size: 11px; font-weight: 700; letter-spacing: 0.3em; text-transform: uppercase; color: #fff; transition: opacity 0.5s ease; }
.hs-hint::after { content: ''; display: block; width: 1px; height: 36px; margin: 10px auto 0; background: #fff; animation: hs-hint 1.8s ease-in-out infinite; transform-origin: top; }
.hs-hint.is-off { opacity: 0; }
@keyframes hs-hint { 0% { transform: scaleY(0); } 50% { transform: scaleY(1); } 100% { transform: scaleY(1); opacity: 0; } }

/* Горячие точки */
.hs-spot { position: absolute; width: 0; height: 0; z-index: 3; }
.hs-hot { position: absolute; left: -24px; top: -24px; width: 48px; height: 48px; }
.hs-hot svg { width: 100%; height: 100%; overflow: visible; }
.hs-hot__big { fill: none; stroke: rgba(255, 255, 255, 0.9); stroke-width: 2; transform-origin: center; animation: hs-pulse 2.2s ease-out infinite; }
.hs-hot__small { fill: rgba(255, 255, 255, 0.25); stroke: #fff; stroke-width: 2; }
.hs-hot__dot { fill: #fff; transition: opacity 0.2s ease; }
.hs-hot__x { stroke: #fff; stroke-width: 2.4; stroke-linecap: round; opacity: 0; transition: opacity 0.2s ease; }
.hs-hot--warm .hs-hot__big { stroke: var(--hs-warm); }
.hs-hot--warm .hs-hot__small { stroke: var(--hs-warm); fill: rgba(255, 181, 71, 0.2); }
.hs-hot--warm .hs-hot__dot { fill: var(--hs-warm); }
.hs-hot--warm .hs-hot__x { stroke: var(--hs-warm); }
.hs-hot.is-open .hs-hot__dot { opacity: 0; }
.hs-hot.is-open .hs-hot__x { opacity: 1; }
@keyframes hs-pulse { from { transform: scale(0.55); opacity: 1; } to { transform: scale(1.4); opacity: 0; } }
.hs-hot__card { position: absolute; left: 34px; top: -20px; width: 260px; padding: 0.9rem 1.1rem; border-radius: 14px; background: rgba(4, 17, 10, 0.86); backdrop-filter: blur(8px); -webkit-backdrop-filter: blur(8px); color: var(--hs-cream); font-size: 13px; line-height: 1.5; opacity: 0; transform: translateY(6px); pointer-events: none; transition: opacity 0.3s ease, transform 0.3s ease; }
.hs-hot__card b { display: block; margin-bottom: 0.3rem; font-size: 12px; letter-spacing: 0.1em; text-transform: uppercase; color: var(--hs-blue); }
.hs-hot__card.is-left { left: auto; right: 34px; }
.hs-hot__card.is-open { opacity: 1; transform: none; pointer-events: auto; }

/* ---------- Акт 6: тёмная пуща ---------- */
.hs-dark { position: relative; background: var(--hs-ink); }
.hs-dark__bg { position: sticky; top: 0; height: 100vh; height: 100svh; margin-bottom: -100vh; margin-bottom: -100svh; overflow: hidden; }
.hs-dark__bg img { width: 100%; height: 100%; object-fit: cover; opacity: 0.55; }
.hs-dark__bg::after { content: ''; position: absolute; inset: 0; background: radial-gradient(ellipse 60% 65% at 50% 45%, transparent 0%, rgba(4, 17, 10, 0.7) 60%, var(--hs-ink) 100%); }
.hs-wrap6 { position: relative; max-width: 74rem; margin: 0 auto; padding: 0 1.5rem; }
.hs-intro6 { padding: 22vh 1.5rem 8vh; }
.hs-cols { display: grid; grid-template-columns: minmax(0, 4fr) minmax(0, 6fr); gap: 2rem 5vw; align-items: start; }
.hs-label { font-family: var(--font-display); font-size: clamp(1.05rem, 1.4vw, 1.35rem); font-weight: 700; line-height: 1.25; letter-spacing: 0.04em; text-transform: uppercase; color: var(--hs-blue); }
.hs-label--center { text-align: center; }
.hs-copy { display: grid; gap: 0.9rem; font-size: 15px; line-height: 1.6; color: rgba(243, 239, 228, 0.82); }
.hs-copy__lead { font-family: var(--font-display); font-size: 1.25rem; font-weight: 700; color: #fff; }
.hs-copy__small { font-size: 13px; color: rgba(243, 239, 228, 0.6); }
.hs-more { justify-self: start; font-size: 14px; font-weight: 600; color: var(--hs-blue); }
.hs-more:hover { text-decoration: underline; }
.hs-metrics { list-style: none; padding: 0; margin: 0; display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 1.5rem; }
.hs-metrics b { display: block; font-family: var(--font-display); font-size: clamp(2.4rem, 4.4vw, 4.2rem); font-weight: 700; line-height: 1; color: #fff; font-variant-numeric: tabular-nums; }
.hs-metrics span { display: block; margin-top: 0.5rem; font-size: 13px; color: rgba(243, 239, 228, 0.65); }

.hs-years { display: flex; flex-wrap: wrap; gap: 1.5rem 3rem; list-style: none; margin: 4.5rem 0 0; padding: 2rem 0 0; border-top: 1px solid rgba(243, 239, 228, 0.18); }
.hs-years li { display: grid; gap: 0.25rem; }
.hs-years b { font-family: var(--font-display); font-size: 1.5rem; font-weight: 700; color: transparent; -webkit-text-stroke: 1px rgba(243, 239, 228, 0.65); }
.hs-years li:last-child b { color: var(--hs-blue); -webkit-text-stroke: 0; }
.hs-years span { max-width: 11rem; font-size: 12px; line-height: 1.4; color: rgba(243, 239, 228, 0.6); }
.hs-textbeat { padding: 20vh 1.5rem 12vh; }
.hs-comp { position: relative; padding: 10vh 0 14vh; }
.hs-comp__art { position: relative; width: min(1100px, 94vw); margin: 0 auto 6vh; }
.hs-comp__art img { display: block; max-width: none; }
/* 6.1 */
.hs-comp--usbf .hs-comp__art { width: min(520px, 70vw); aspect-ratio: 720 / 1080; }
.hs-usbf__oak { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: contain; z-index: 2; -webkit-mask-image: linear-gradient(#000 78%, transparent); mask-image: linear-gradient(#000 78%, transparent); }
.hs-usbf__inner { position: absolute; left: 36%; top: 10%; width: 29%; height: 47%; object-fit: cover; z-index: 1; }
.hs-usbf__fern { position: absolute; right: -38%; bottom: -6%; width: 70%; z-index: 3; scale: -1 1; }
/* 6.2 */
/* Края композиций растворяются в темноте пущи, как у jazakvoda */
.hs-eng__arch { width: 100%; height: auto; position: relative; z-index: 2; -webkit-mask-image: radial-gradient(ellipse 52% 56% at 50% 52%, #000 64%, transparent 100%); mask-image: radial-gradient(ellipse 52% 56% at 50% 52%, #000 64%, transparent 100%); }
.hs-eng__bim { position: absolute; left: 31%; top: 27%; width: 38%; z-index: 3; filter: drop-shadow(0 0 6px rgba(90, 180, 255, 0.9)) drop-shadow(0 0 18px rgba(60, 150, 255, 0.5)); animation: hs-bob 6s ease-in-out infinite alternate; }
@keyframes hs-bob { to { translate: 0 -10px; } }
/* 6.3 */
.hs-comp--prod .hs-comp__art { width: min(1040px, 94vw); margin-top: 8vh; }
.hs-prod__stone { width: 100%; height: auto; position: relative; z-index: 1; -webkit-mask-image: radial-gradient(ellipse 54% 62% at 50% 42%, #000 66%, transparent 100%); mask-image: radial-gradient(ellipse 54% 62% at 50% 42%, #000 66%, transparent 100%); }
.hs-prod__stage { position: absolute; left: 33%; right: 33%; bottom: 33.5%; height: 36%; z-index: 2; display: grid; place-items: end center; }
.hs-prod__stage::before { content: ''; position: absolute; left: 10%; right: 10%; bottom: -3.5%; height: 9%; border-radius: 50%; background: radial-gradient(ellipse at center, rgba(0, 0, 0, 0.55), transparent 70%); }
.hs-prod__machine { display: block; position: relative; width: 100%; height: 100%; }
.hs-prod__machine img { width: 100%; height: 100%; object-fit: contain; object-position: center bottom; filter: drop-shadow(0 18px 18px rgba(0, 0, 0, 0.45)); }
.hs-prod__name { position: absolute; left: 78%; top: 20%; z-index: 3; display: grid; gap: 0.3rem; max-width: 14rem; font-size: 13px; font-weight: 700; line-height: 1.35; text-transform: uppercase; letter-spacing: 0.06em; color: #fff; }
.hs-prod__name span { font-size: 11px; color: var(--hs-warm); letter-spacing: 0.2em; }
.hs-swap-enter-active, .hs-swap-leave-active { transition: opacity 0.35s ease, transform 0.45s cubic-bezier(0.16, 1, 0.3, 1); }
.hs-swap-enter-from { opacity: 0; transform: translateY(18px) scale(0.96); }
.hs-swap-leave-to { opacity: 0; transform: translateY(-10px) scale(1.02); }
/* 6.4 */
.hs-comp--run .hs-comp__art { width: min(640px, 86vw); aspect-ratio: 1; margin-bottom: calc(6vh + 4.5rem); }
.hs-run__ring { position: absolute; inset: 0; width: 100%; height: 100%; z-index: 2; }
.hs-run__pic { position: absolute; left: 19%; top: 19%; width: 62%; height: 62%; border-radius: 50%; overflow: hidden; z-index: 1; background: #0b2016; }
.hs-run__pic img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; }
.hs-fade-enter-active, .hs-fade-leave-active { transition: opacity 0.6s ease; }
.hs-fade-enter-from, .hs-fade-leave-to { opacity: 0; }
.hs-run__tag { position: absolute; left: 50%; bottom: -3.5rem; translate: -50% 0; z-index: 3; display: grid; gap: 0.2rem; width: max-content; max-width: 90vw; text-align: center; color: #fff; }
.hs-run__tag span { font-size: 11px; font-weight: 700; letter-spacing: 0.2em; text-transform: uppercase; color: var(--hs-warm); }
.hs-run__tag b { font-size: 14px; font-weight: 700; }
.hs-run__tag:hover b { text-decoration: underline; }

.hs-arrow { position: absolute; top: 50%; z-index: 4; width: 46px; height: 46px; margin-top: -23px; border-radius: 50%; display: grid; place-items: center; color: #fff; border: 1.5px solid rgba(255, 255, 255, 0.6); background: rgba(4, 17, 10, 0.35); transition: background-color 0.2s ease, color 0.2s ease; }
.hs-arrow:hover { background: #fff; color: var(--hs-ink); }
.hs-arrow svg { width: 18px; height: 18px; fill: none; stroke: currentColor; stroke-width: 2.2; }
.hs-arrow--prev { left: 2%; }
.hs-arrow--next { right: 2%; }
.hs-comp--run .hs-arrow--prev { left: -12%; }
.hs-comp--run .hs-arrow--next { right: -12%; }

.hs-comp--sign .hs-comp__art { width: min(430px, 62vw); aspect-ratio: 720 / 1080; }
.hs-sign__oak { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: contain; z-index: 1; -webkit-mask-image: linear-gradient(#000 78%, transparent); mask-image: linear-gradient(#000 78%, transparent); }
.hs-sign__drop { position: absolute; left: 50%; top: 0; width: 46%; translate: -50% 0; z-index: 2; filter: drop-shadow(0 18px 34px rgba(0, 0, 0, 0.55)); will-change: transform; }
.hs-sign__fern { position: absolute; left: -18%; bottom: -5%; width: 56%; z-index: 3; }
.hs-lean { padding: 8vh 1.5rem 12vh; }
.hs-tags { display: flex; flex-wrap: wrap; gap: 0.5rem; }
.hs-tags span { padding: 0.3rem 0.75rem; border-radius: 999px; background: rgba(74, 163, 255, 0.14); color: var(--hs-blue); font-size: 13px; font-weight: 600; }
.hs-lean__list { list-style: none; padding: 0; margin: 4rem 0 0; display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 1.5rem; }
.hs-lean__list li { display: grid; gap: 0.5rem; padding-top: 1rem; border-top: 1px solid rgba(243, 239, 228, 0.2); }
.hs-lean__list b { font-family: var(--font-display); font-size: 1.05rem; color: #fff; }
.hs-lean__list span { font-size: 14px; line-height: 1.55; color: rgba(243, 239, 228, 0.7); }

.hs-final { position: relative; padding: 16vh 1.5rem 30vw; text-align: center; overflow: hidden; }
.hs-final__in { position: relative; z-index: 3; max-width: 46rem; margin: 0 auto; display: grid; justify-items: center; }
.hs-say__line--static { height: 90px; margin: 0 0 1.5rem; }
.hs-say__line--static i { opacity: 1; background: var(--hs-blue); }
.hs-say__line--static b { transform: none; background: var(--hs-blue); }
.hs-final__h { margin-top: 0.8rem; font-family: var(--font-display); font-size: clamp(2.2rem, 4.6vw, 4.4rem); font-weight: 700; line-height: 1.04; text-transform: uppercase; color: #fff; }
.hs-final__p { margin-top: 1.4rem; font-size: 1.05rem; line-height: 1.6; color: rgba(243, 239, 228, 0.78); }
.hs-final__btns { display: flex; flex-wrap: wrap; justify-content: center; gap: 0.8rem; margin-top: 2.2rem; }
.hs-btn { padding: 0.95rem 1.7rem; border-radius: 999px; background: #1f6fd6; color: #fff; font-weight: 600; transition: background-color 0.2s ease; }
.hs-btn:hover { background: #185bb2; }
.hs-btn--ghost { background: transparent; box-shadow: inset 0 0 0 1.5px rgba(243, 239, 228, 0.6); color: var(--hs-cream); }
.hs-btn--ghost:hover { background: rgba(243, 239, 228, 0.1); }
.hs-final__fern { position: absolute; left: -6vw; bottom: 8vw; width: 32vw; max-width: none; z-index: 1; opacity: 0.85; }
.hs-final__reeds { position: absolute; left: 0; bottom: -27vw; width: 100%; max-width: none; z-index: 2; filter: brightness(0.62); }
.hs-firefly { position: absolute; z-index: 2; width: 5px; height: 5px; border-radius: 50%; background: #ffe9a3; box-shadow: 0 0 12px 3px rgba(255, 220, 120, 0.7); animation: hs-firefly 7s ease-in-out infinite; opacity: 0; }
@keyframes hs-firefly { 0%, 100% { opacity: 0; transform: translate(0, 0); } 30% { opacity: 1; } 50% { transform: translate(18px, -26px); } 70% { opacity: 0.8; } }

@media (max-width: 1023px) {
  .hs-lean__list { grid-template-columns: repeat(2, minmax(0, 1fr)); }
}
@media (max-width: 767px) {
  .hs-sound { top: calc(var(--dj-header-h, 56px) + 12px); right: 16px; width: 42px; height: 42px; }
  .hs-sound.is-docked { top: calc(100% - 62px); }
  .hs-wrap { height: 1500vh; }
  .hs-cloud--1 { width: 130vw; left: -40%; }
  .hs-cloud--2 { width: 130vw; right: -50%; }
  .hs-cloud--3 { width: 110vw; }
  .hs-cloud--4 { width: 170vw; left: -30%; }
  .hs-mount__body { width: 200vw; }
  .hs-say, .hs-say--r, .hs-say--l { left: 7vw; width: 86vw; top: 12vh; bottom: 14vh; }
  .hs-say--c { left: 10vw; width: 86vw; padding: 13vh 0 0 1.4rem; }
  /* Капля: текст под логотипом, а не поверх него */
  .hs-say--l { top: 50vh; bottom: 10vh; }
  .hs-fbush { left: -30vw; height: 70%; }
  .hs-ffern { left: 10vw; width: 70vw; }
  .hs-rise--branch { width: 82vw; }
  .hs-dropback { width: 150vw; }
  .hs-bfly { width: 9%; }
  .hs-drop__logo { width: 36vw; top: 32%; }
  .hs-cols { grid-template-columns: 1fr; }
  .hs-metrics { grid-template-columns: 1fr 1fr 1fr; gap: 0.8rem; }
  .hs-metrics b { font-size: 2rem; }
  .hs-prod__name { left: 50%; top: auto; bottom: -2.6rem; translate: -50% 0; text-align: center; max-width: 80vw; }
  .hs-comp--prod .hs-comp__art { margin-bottom: calc(6vh + 3.5rem); }
  .hs-comp--run .hs-arrow--prev { left: -4%; }
  .hs-comp--run .hs-arrow--next { right: -4%; }
  .hs-hot__card { width: 200px; }
  .hs-lean__list { grid-template-columns: 1fr; }
  .hs-final { padding-bottom: 40vw; }
  .hs-final__fern { width: 60vw; }
}
@media (prefers-reduced-motion: reduce) {
  .hs-wrap { height: auto; }
  .hs-say__h, .hs-say__p, .hs-say__line i, .hs-say__line b { transition: none !important; }
  .hs-cloud, .hs-fall, .hs-fly, .hs-hot__big, .hs-eng__bim, .hs-firefly, .hs-hint::after { animation: none; }
}

/* ===== Прежние блоки «О компании»: линия лет, система, качество ===== */
/* ===== ПУТЬ КОМПАНИИ: линия с «вектором в будущее» ===== */
.tl {
  --tl-tail: 0px;
  position: relative;
  height: 3.5rem;
  padding: 0 1.25rem;
}
.tl--open { --tl-tail: clamp(5rem, 16%, 8rem); }
.tl-rail {
  position: relative;
  height: 100%;
}
.tl-line {
  position: absolute;
  left: 0;
  top: 7px;
  height: 2px;
  width: calc(100% - var(--tl-tail));
  background: #ededed;
}
.tl-line--done {
  background: #006039;
  transition: width 0.5s ease;
}
/* Хвост за последним годом: пунктир и стрелка — линия не заканчивается */
.tl-future {
  position: absolute;
  top: 0;
  right: -2px;
  height: 16px;
  width: var(--tl-tail);
  color: rgba(26, 26, 26, 0.35);
  transition: color 0.3s ease;
}
.tl-future::before {
  content: '';
  position: absolute;
  left: 0;
  right: 8px;
  top: 7px;
  border-top: 2px dashed currentColor;
}
.tl-future.is-active { color: #006039; }
.tl-arrow {
  position: absolute;
  right: 0;
  top: 1px;
  width: 14px;
  height: 14px;
}
.tl-stop {
  position: absolute;
  top: 0;
  transform: translateX(-50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.6rem;
  padding: 0 0.25rem;
  background: none;
  border: 0;
  cursor: pointer;
}
.tl-dot {
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: #ededed;
  border: 4px solid #fff;
  box-shadow: 0 0 0 1px #ededed;
  transition: background 0.3s ease, transform 0.3s ease;
}
.tl-stop:hover .tl-dot { background: rgba(0, 35, 102, 0.4); }
.tl-stop.is-passed .tl-dot { background: #006039; box-shadow: 0 0 0 1px #006039; }
.tl-stop.is-active .tl-dot { transform: scale(1.25); }
.tl-year {
  font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
  font-size: 0.8125rem;
  font-weight: 700;
  color: rgba(26, 26, 26, 0.45);
  white-space: nowrap;
  transition: color 0.3s ease;
}
.tl-stop:hover .tl-year { color: #1a1a1a; }
.tl-stop.is-active .tl-year { color: #006039; }
/* У будущего нет точки: метка стоит под острием стрелки */
.tl-stop--future {
  transform: translateX(-100%);
  align-items: flex-end;
  padding-right: 0;
}
.tl-stop--future .tl-dot { visibility: hidden; }
.tl-card {
  background: rgba(237, 237, 237, 0.6);
  padding: clamp(1.75rem, 4vw, 2.5rem);
  text-align: center;
  border-top: 2px solid transparent;
}
.tl-card--future { border-top-color: #006039; }

/* ===== ОДНА СИСТЕМА ESP ===== */
.sys {
  background: #fff;
  box-shadow: 0 24px 60px -32px rgba(26, 26, 26, 0.25);
}
.sys-parts {
  display: grid;
  grid-template-columns: 1fr;
  position: relative;
}
@media (min-width: 900px) {
  .sys-parts { grid-template-columns: minmax(0, 1fr) 0 minmax(0, 1fr); }
}
.sys-part {
  padding: clamp(1.75rem, 4vw, 3rem);
  border-top: 3px solid #002366;
}
.sys-part--prod { border-top-color: #006039; }
@media (max-width: 899px) {
  .sys-part--prod { padding-top: 3.25rem; }
}
.sys-part-num {
  display: block;
  font-size: 0.75rem;
  font-weight: 600;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: #002366;
  margin-bottom: 0.9rem;
}
.sys-part--prod .sys-part-num { color: #006039; }
.sys-part-title {
  font-family: 'SF Pro Rounded', system-ui, sans-serif;
  font-size: clamp(1.35rem, 2vw, 1.75rem);
  font-weight: 600;
  color: #1a1a1a;
  margin-bottom: 0.8rem;
}
.sys-part-text {
  font-size: 1rem;
  line-height: 1.65;
  color: rgba(26, 26, 26, 0.7);
  max-width: 34rem;
}
/* Узел-связка: знак ESP на стыке двух направлений */
.sys-link {
  position: relative;
  height: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1;
}
.sys-link-node {
  width: 4.5rem;
  height: 4.5rem;
  border-radius: 50%;
  background: #fff;
  border: 1px solid #ededed;
  box-shadow: 0 10px 30px -12px rgba(26, 26, 26, 0.3);
  display: flex;
  align-items: center;
  justify-content: center;
}
.sys-link-node img { width: 2.75rem; height: auto; }
@media (min-width: 900px) {
  .sys-link { height: auto; align-items: flex-start; }
  .sys-link::before {
    content: '';
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    border-left: 1px solid #ededed;
  }
  .sys-link-node { position: absolute; top: calc(50% - 2.25rem); left: -2.25rem; }
}
.sys-caps {
  border-top: 1px solid #ededed;
  padding: clamp(1.75rem, 4vw, 2.5rem) clamp(1.75rem, 4vw, 3rem);
  background: rgba(237, 237, 237, 0.35);
}
.sys-caps-title {
  font-size: 0.75rem;
  font-weight: 600;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: rgba(26, 26, 26, 0.55);
  margin-bottom: 1.25rem;
}
.sys-caps-list {
  display: grid;
  grid-template-columns: 1fr;
  gap: 0.9rem 2rem;
}
@media (min-width: 640px) { .sys-caps-list { grid-template-columns: repeat(2, minmax(0, 1fr)); } }
@media (min-width: 1100px) { .sys-caps-list { grid-template-columns: repeat(4, minmax(0, 1fr)); } }
.sys-caps-list li {
  display: flex;
  align-items: flex-start;
  gap: 0.6rem;
  font-size: 0.95rem;
  line-height: 1.45;
  color: rgba(26, 26, 26, 0.8);
}
.sys-caps-list svg {
  flex: none;
  width: 1rem;
  height: 1rem;
  margin-top: 0.15rem;
  color: #006039;
}

/* ===== ЭТАЛОН КАЧЕСТВА ===== */
.ql-lead {
  display: grid;
  grid-template-columns: 1fr;
  gap: clamp(2rem, 4vw, 3.5rem);
  align-items: center;
  margin-bottom: clamp(3rem, 6vw, 5rem);
}
@media (min-width: 900px) {
  .ql-lead { grid-template-columns: minmax(0, 5fr) minmax(0, 7fr); }
}

/* Капля лежит на мягком световом пятне, а не на пустом белом: рендер
   сделан на прозрачном фоне и без подложки выглядит вырезанным. */
/* Фон рендера запечён белым, поэтому секция тоже белая — кадр читается
   как студийный снимок, без видимой рамки вокруг картинки. */
.ql-drop {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: clamp(0.5rem, 2vw, 1.5rem);
}
.ql-drop img {
  position: relative;
  width: 100%;
  max-width: clamp(220px, 60vw, 300px);
  height: auto;
  /* Края кадра (постамент, лёгкая виньетка рендера) растворяем в белом —
     остаётся только знак */
  -webkit-mask-image: radial-gradient(ellipse 58% 56% at 50% 46%, #000 78%, transparent 100%);
  mask-image: radial-gradient(ellipse 58% 56% at 50% 46%, #000 78%, transparent 100%);
}

.ql-kicker {
  display: inline-block;
  font-size: 0.75rem;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: #002366;
  font-weight: 600;
  margin-bottom: 0.9rem;
}
.ql-lede {
  font-size: clamp(1rem, 1.15vw, 1.12rem);
  line-height: 1.65;
  color: rgba(26, 26, 26, 0.72);
  margin-bottom: 2rem;
}

/* Факты — строками с крупным значением слева: три равные плитки читались
   как реклама, строки читаются как характеристики. */
.ql-facts {
  display: grid;
  gap: 0;
  border-top: 1px solid #ededed;
}
.ql-facts li {
  display: grid;
  grid-template-columns: minmax(4.5rem, max-content) 1fr;
  gap: 1.25rem;
  align-items: baseline;
  padding: 1rem 0;
  border-bottom: 1px solid #ededed;
}
.ql-facts b {
  font-family: 'SF Pro Rounded', system-ui, sans-serif;
  font-size: 1.35rem;
  color: #002366;
  white-space: nowrap;
}
.ql-facts span {
  font-size: 0.93rem;
  line-height: 1.5;
  color: rgba(26, 26, 26, 0.65);
}

/* ===== Доказательство на объекте ===== */
.ql-proof {
  position: relative;
  margin-bottom: clamp(3rem, 6vw, 5rem);
  overflow: hidden;
}
.ql-proof img {
  width: 100%;
  height: clamp(260px, 42vw, 520px);
  object-fit: cover;
  display: block;
}
.ql-proof figcaption {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  padding: clamp(1.2rem, 3vw, 2rem);
  background: linear-gradient(to top, rgba(26, 26, 26, 0.88), rgba(26, 26, 26, 0));
  color: rgba(255, 255, 255, 0.85);
  font-size: 0.92rem;
  line-height: 1.55;
}
.ql-proof figcaption b {
  color: #fff;
  font-weight: 600;
}

/* ===== Ступени очистки ===== */
.ql-stages {
  border: 1px solid #ededed;
  padding: clamp(1.5rem, 4vw, 2.5rem);
}
.ql-stages-head { margin-bottom: 2.25rem; max-width: 46rem; }
.ql-stages-head h3 {
  font-family: 'SF Pro Rounded', system-ui, sans-serif;
  font-size: clamp(1.25rem, 2vw, 1.6rem);
  color: #1a1a1a;
  margin-bottom: 0.6rem;
}
.ql-stages-head p {
  font-size: 0.94rem;
  line-height: 1.6;
  color: rgba(26, 26, 26, 0.6);
}

.ql-track {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.5rem;
}
@media (min-width: 760px) {
  .ql-track { grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 1.75rem 1.25rem; }
}
@media (min-width: 1100px) {
  .ql-track { grid-template-columns: repeat(6, minmax(0, 1fr)); gap: 1rem; }
}

.ql-stage {
  display: grid;
  gap: 0.5rem;
  align-content: start;
}
.ql-stage-num {
  width: 2rem;
  height: 2rem;
  border-radius: 50%;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  font-weight: 700;
  font-size: 0.85rem;
  background: #002366;
}
.ql-stage-num.is-final { background: #006039; }
.ql-stage-bar {
  display: block;
  height: 4px;
  background: #ededed;
  overflow: hidden;
}
.ql-stage-fill {
  display: block;
  height: 100%;
  background: #002366;
  transition: width 1s ease;
}
.ql-stage-fill.is-final { background: #006039; }
.ql-stage-label {
  font-size: 0.92rem;
  font-weight: 600;
  color: #1a1a1a;
}
.ql-stage-result {
  font-style: normal;
  font-size: 0.82rem;
  line-height: 1.45;
  color: rgba(26, 26, 26, 0.6);
}


/* ===== Разделы после истории (DJI/Apple) ===== */
.ab { overflow-x: clip; }
.ab-rest { position: relative; background: #fff; }
.hs-dark__fade { height: 14vh; }
.ab-head { max-width: 46rem; margin: 0 auto clamp(36px, 5vw, 64px); display: grid; gap: 14px; }
.ab-narrow { max-width: 56rem; margin: 0 auto; }
.ab-intro { padding-bottom: 0; }
.ab-intro__h { margin: 10px auto 0; max-width: 18ch; }
.ab-intro__p { max-width: 40rem; margin-top: 18px; }
.ab-intro__btns { display: flex; flex-wrap: wrap; justify-content: center; gap: 12px; margin-top: 28px; }
.ab-film { margin-top: clamp(40px, 6vw, 72px); border-radius: 28px; overflow: hidden; aspect-ratio: 21 / 9; background: #0b0d10; }
.ab-film video { width: 100%; height: 100%; object-fit: cover; display: block; }
.ab-card__h { margin-bottom: 10px; }
.ab-card__p { max-width: 40rem; margin: 0 auto; color: var(--dj-muted); line-height: 1.6; }
.tl-card { text-align: center; }
.ab-flow { margin-top: clamp(48px, 6vw, 80px); padding: clamp(24px, 4vw, 48px); border-radius: 28px; background: #0b0d10; }
.ab-flow__h { color: #fff !important; margin-bottom: 32px; }
.ab-map { overflow: hidden; border-radius: 28px; background: #fff; box-shadow: 0 30px 60px -30px rgba(0, 0, 0, 0.25); }
.ab-map__note { margin-top: 20px; text-align: center; font-size: 14px; color: var(--dj-muted); }
.ab-media { display: grid; gap: 24px; grid-template-columns: repeat(3, minmax(0, 1fr)); }
.ab-mcard { display: block; overflow: hidden; border-radius: 24px; background: #fff; transition: transform 0.4s var(--dj-ease), box-shadow 0.4s var(--dj-ease); }
.ab-mcard:hover { transform: translateY(-4px); box-shadow: 0 24px 48px -24px rgba(0, 0, 0, 0.25); }
.ab-mcard__thumb { position: relative; aspect-ratio: 16 / 9; overflow: hidden; background: #0b0d10; }
.ab-mcard__thumb--doc { display: grid; place-items: center; background: #002366; }
.ab-mcard__thumb video, .ab-mcard__thumb img { width: 100%; height: 100%; object-fit: cover; display: block; }
.ab-mcard__thumb .ab-mcard__logo { width: 50%; max-height: 64px; object-fit: contain; filter: brightness(0) invert(1); }
.ab-mcard__veil { position: absolute; inset: 0; display: grid; place-items: center; background: rgba(0, 0, 0, 0.28); transition: opacity 0.3s ease; }
.ab-mcard__veil.is-off { opacity: 0; }
.ab-play { width: 60px; height: 60px; border-radius: 50%; display: grid; place-items: center; background: rgba(255, 255, 255, 0.92); color: var(--dj-ink); transition: transform 0.3s var(--dj-ease); }
.ab-play:hover { transform: scale(1.08); }
.ab-play svg { width: 22px; height: 22px; fill: currentColor; margin-left: 3px; }
.ab-mcard__body { padding: 22px 24px 26px; display: grid; gap: 8px; }
.ab-mcard__h { font-size: 18px; font-weight: 600; color: var(--dj-ink); }
.ab-mcard__p { font-size: 14px; line-height: 1.55; color: var(--dj-muted); }
.ab-mcard__meta { display: inline-flex; align-items: center; gap: 6px; font-size: 12px; color: var(--dj-muted); }
.ab-fade-enter-active, .ab-fade-leave-active { transition: opacity 0.35s ease, transform 0.35s ease; }
.ab-fade-enter-from { opacity: 0; transform: translateY(10px); }
.ab-fade-leave-to { opacity: 0; transform: translateY(-10px); }
.ql-drop img, .ql-proof img { border-radius: 22px; }
.tl-card, .sys, .ql-stages { border-radius: 22px; }
.sys-caps { border-radius: 16px; }
.ql-facts { border-radius: 14px; }
@media (max-width: 899px) {
  .ab-media { grid-template-columns: 1fr; }
  .ab-film { aspect-ratio: 4 / 3; border-radius: 20px; }
}
</style>
