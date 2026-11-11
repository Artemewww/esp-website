<template>
  <div v-if="activeStage" class="dj pr">
    <section class="pr-sec">
      <div class="dj-wrap">
        <div class="pr-crumbs">
          <Breadcrumb :items="[{ label: 'Услуги', to: '/services' }, { label: 'Процесс под ключ', to: '/services/process/idea-audit' }, { label: activeStage.title }]" />
        </div>
        <div class="pr-head">
          <span class="dj-eyebrow">Комплексный подход под ключ</span>
          <h1 class="pr-h1">Семь этапов от идеи до пусконаладки</h1>
          <p class="dj-lede pr-lede">
            Выберите этап — справа обновятся фото и подробности. У каждого этапа своя страница: её можно сохранить или отправить коллегам.
          </p>
        </div>

        <!-- Горизонтальная шкала этапов: на всех ширинах, листается пальцем -->
        <nav class="pr-line" aria-label="Этапы">
          <NuxtLink
            v-for="stage in turnkeyStagesList"
            :key="stage.slug"
            :to="`/services/process/${stage.slug}`"
            class="pr-tab"
            :class="{ 'is-on': stage.slug === activeStage.slug }"
          >
            <span class="pr-dot" aria-hidden="true"></span>
            <span class="pr-num">{{ stage.num }}</span>
            <b>{{ stage.title }}</b>
            <span class="pr-item-desc">{{ stage.desc }}</span>
          </NuxtLink>
        </nav>

        <Transition name="fade-swap" mode="out-in">
          <div :key="activeStage.slug" class="pr-detail">
            <div class="pr-img">
              <img :src="activeStage.image" :alt="activeStage.title" />
            </div>
            <div class="pr-body">
              <span class="dj-eyebrow">Этап {{ activeStage.num }} / 07</span>
              <h2 class="dj-h2 pr-title">{{ activeStage.title }}</h2>
              <p class="pr-desc">{{ activeStage.desc }}</p>
              <ul class="pr-details">
                <li v-for="d in activeStage.details" :key="d">
                  <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.6" aria-hidden="true"><path d="M4 10.5l4 4 8-9" /></svg>
                  <span>{{ d }}</span>
                </li>
              </ul>
              <div class="pr-act">
                <NuxtLink v-if="nextStage" :to="`/services/process/${nextStage.slug}`" class="dj-btn">{{ nextStage.title }} ›</NuxtLink>
                <NuxtLink v-if="prevStage" :to="`/services/process/${prevStage.slug}`" class="pr-prev">‹ {{ prevStage.title }}</NuxtLink>
              </div>
            </div>
          </div>
        </Transition>
      </div>
    </section>

    <section class="dj-sec dj-sec--dark dj-center">
      <div class="dj-wrap">
        <h2 class="dj-h2">Обсудите проект с инженером ESP</h2>
        <p class="dj-lede pr-lede">Консультация бесплатная. Предварительная оценка объекта.</p>
        <div class="dj-links pr-cta-act">
          <NuxtLink to="/contacts#contact-form" class="dj-btn dj-btn--white dj-btn--lg">Обсудить проект</NuxtLink>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { computed, onMounted, watch, nextTick } from 'vue'
import { turnkeyStagesList } from '~/composables/useTurnkeyProcess'

const route = useRoute()
const activeStage = computed(() => turnkeyStagesList.find(s => s.slug === route.params.slug) || turnkeyStagesList[0])
const activeIndex = computed(() => turnkeyStagesList.findIndex(s => s.slug === activeStage.value.slug))
const prevStage = computed(() => activeIndex.value > 0 ? turnkeyStagesList[activeIndex.value - 1] : null)
const nextStage = computed(() => activeIndex.value < turnkeyStagesList.length - 1 ? turnkeyStagesList[activeIndex.value + 1] : null)

// Активный этап виден в ленте на узком экране
const centerTab = () => nextTick(() => {
  const nav = document.querySelector('.pr-line'); const on = nav && nav.querySelector('.is-on')
  if (nav && on) nav.scrollLeft = on.offsetLeft - (nav.clientWidth - on.clientWidth) / 2
})
onMounted(centerTab)
watch(() => route.params.slug, centerTab)

useHead(() => ({
  title: `${activeStage.value.title} | Процесс под ключ ESP`,
  meta: [{ name: 'description', content: activeStage.value.desc }]
}))
</script>

<style scoped>
/* Apple «Take a closer look»: заголовок по центру, лента этапов с круглыми
   маркерами, крупный кадр со скруглением и подписи справа. */
.pr-sec { padding: clamp(20px, 3vw, 32px) 0 clamp(56px, 8vw, 104px); background: #fff; }
.pr-crumbs { font-size: 12px; }
.pr-head { display: flex; flex-direction: column; align-items: center; text-align: center; margin-top: clamp(36px, 6vw, 72px); }
.pr-h1 { margin-top: 10px; max-width: 18ch; font-size: clamp(40px, 5.6vw, 80px); line-height: 1.05; font-weight: 600; letter-spacing: -0.015em; color: var(--dj-ink); text-wrap: balance; }
.pr-lede { margin-top: 18px; max-width: 40em; color: #5E5E5E; }
.dj-sec--dark .pr-lede { color: #8A8A8A; }

/* Шкала этапов */
.pr-line { display: grid; grid-template-columns: repeat(7, minmax(150px, 1fr)); gap: 0; margin-top: clamp(40px, 6vw, 72px); overflow-x: auto; scrollbar-width: none; scroll-snap-type: x proximity; }
.pr-line::-webkit-scrollbar { display: none; }
.pr-tab { position: relative; display: grid; align-content: start; gap: 4px; padding: 32px 16px 20px 0; color: #8A8A8A; scroll-snap-align: start; transition: color 0.3s ease; }
.pr-tab::before { content: ''; position: absolute; left: 0; right: 0; top: 6px; height: 1px; background: #D6D6D6; }
.pr-dot { position: absolute; left: 0; top: 0; width: 13px; height: 13px; border-radius: 50%; background: #D6D6D6; box-shadow: 0 0 0 3px #fff; transition: background-color 0.3s ease, transform 0.4s var(--dj-ease); }
.pr-tab:hover { color: var(--dj-ink); }
.pr-tab.is-on { color: var(--dj-ink); }
.pr-tab.is-on .pr-dot { background: var(--dj-blue); transform: scale(1.15); }
.pr-num { font-size: 12px; font-weight: 600; letter-spacing: -0.01em; font-variant-numeric: tabular-nums; }
.pr-tab b { font-size: 17px; font-weight: 600; line-height: 1.24; letter-spacing: -0.022em; }
.pr-item-desc { font-size: 14px; line-height: 1.43; letter-spacing: -0.016em; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }

/* Подробности этапа */
.pr-detail { display: grid; grid-template-columns: minmax(0, 7fr) minmax(0, 5fr); gap: clamp(28px, 4vw, 64px); align-items: center; margin-top: clamp(32px, 4vw, 56px); }
.pr-img { aspect-ratio: 16 / 10; overflow: hidden; border-radius: var(--r-lg); background: #EDEDED; }
.pr-img img { width: 100%; height: 100%; object-fit: cover; }
.pr-title { margin-top: 8px; font-size: clamp(28px, 2.8vw, 40px); line-height: 1.1; letter-spacing: 0; }
.pr-desc { margin-top: 14px; font-size: 17px; line-height: 1.47; letter-spacing: -0.022em; color: #5E5E5E; }
.pr-details { display: grid; gap: 14px; margin: 24px 0 0; padding: 0; list-style: none; }
.pr-details li { display: flex; gap: 12px; font-size: 17px; line-height: 1.47; letter-spacing: -0.022em; color: var(--dj-ink); }
.pr-details svg { flex: 0 0 auto; width: 18px; height: 18px; margin-top: 4px; color: var(--dj-blue); }
.pr-act { display: flex; flex-wrap: wrap; align-items: center; gap: 12px 24px; margin-top: 32px; }
.pr-prev { font-size: 17px; letter-spacing: -0.022em; color: #002366; }
.pr-prev:hover { text-decoration: underline; }
.pr-cta-act { margin-top: 30px; }

@media (max-width: 1023px) {
  .pr-detail { grid-template-columns: minmax(0, 1fr); }
  .pr-line { grid-template-columns: repeat(7, 200px); }
}
@media (max-width: 767px) {
  .pr-line { grid-template-columns: repeat(7, 72vw); margin-left: -16px; margin-right: -16px; padding: 0 16px; scroll-padding-left: 16px; }
  .pr-img { border-radius: var(--r-md); }
  .pr-act .dj-btn { white-space: normal; height: auto; min-height: 40px; padding: 10px 22px; }
}
@media (prefers-reduced-motion: reduce) {
  .pr-dot { transition: none; }
}

.fade-swap-enter-active,
.fade-swap-leave-active {
  transition: opacity 0.25s ease;
}
.fade-swap-enter-from,
.fade-swap-leave-to {
  opacity: 0;
}
</style>
