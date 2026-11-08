<template>
  <div v-if="activeStage" class="ap">
    <section class="ap-sec ap-sec--first">
      <div class="ap-wrap">
        <div class="pr-crumbs">
          <Breadcrumb :items="[{ label: 'Услуги', to: '/services' }, { label: 'Процесс «под ключ»', to: '/services/process/idea-audit' }, { label: activeStage.title }]" />
        </div>
        <span class="ap-eyebrow">Комплексный подход «под ключ»</span>
        <h1 class="ap-title">7 шагов от идеи до кристальной воды</h1>
        <p class="ap-lede">
          Выберите этап — справа обновятся фото и подробности. У каждого этапа своя страница: её можно сохранить или отправить коллегам.
        </p>

        <!-- Телефон: этапы лентой капсул, без длинного списка над содержимым -->
        <nav class="ap-tabs pr-tabs" aria-label="Этапы">
          <NuxtLink
            v-for="stage in turnkeyStagesList"
            :key="stage.slug"
            :to="`/services/process/${stage.slug}`"
            class="ap-tab"
            :class="{ 'is-on': stage.slug === activeStage.slug }"
          >{{ stage.num }} · {{ stage.title }}</NuxtLink>
        </nav>

        <div class="pr-grid">
          <!-- Десктоп: список этапов слева -->
          <div class="pr-list ap-rows">
            <NuxtLink
              v-for="stage in turnkeyStagesList"
              :key="stage.slug"
              :to="`/services/process/${stage.slug}`"
              class="ap-row pr-item"
              :class="{ 'is-on': stage.slug === activeStage.slug }"
            >
              <span class="pr-num">{{ stage.num }}</span>
              <span class="pr-item-body">
                <b>{{ stage.title }}</b>
                <span class="ap-small pr-item-desc">{{ stage.desc }}</span>
              </span>
            </NuxtLink>
          </div>

          <div class="pr-detail">
            <Transition name="fade-swap" mode="out-in">
              <div :key="activeStage.slug">
                <div class="pr-img">
                  <img :src="activeStage.image" :alt="activeStage.title" />
                </div>
                <span class="ap-eyebrow pr-step">Этап {{ activeStage.num }} / 07</span>
                <h2 class="ap-h2 pr-title">{{ activeStage.title }}</h2>
                <p class="ap-text pr-desc">{{ activeStage.desc }}</p>
                <ul class="pr-details">
                  <li v-for="d in activeStage.details" :key="d">
                    <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.6" aria-hidden="true"><path d="M4 10.5l4 4 8-9" /></svg>
                    <span>{{ d }}</span>
                  </li>
                </ul>
                <div class="ap-actions">
                  <NuxtLink v-if="nextStage" :to="`/services/process/${nextStage.slug}`" class="ap-btn">{{ nextStage.title }} ›</NuxtLink>
                  <NuxtLink v-if="prevStage" :to="`/services/process/${prevStage.slug}`" class="ap-link">‹ {{ prevStage.title }}</NuxtLink>
                </div>
              </div>
            </Transition>
          </div>
        </div>
      </div>
    </section>

    <section class="ap-sec ap-sec--white ap-cta">
      <div class="ap-wrap">
        <h2 class="ap-h2">Обсудите ваш проект с инженером ESP</h2>
        <p class="ap-lede">Бесплатная консультация и предварительная оценка объекта.</p>
        <div class="ap-actions">
          <NuxtLink to="/contacts#contact-form" class="ap-btn">Запросить консультацию</NuxtLink>
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

// Активная капсула этапа видна в ленте на телефоне
const centerTab = () => nextTick(() => {
  const nav = document.querySelector('.pr-tabs'); const on = nav && nav.querySelector('.is-on')
  if (nav && on) nav.scrollLeft = on.offsetLeft - (nav.clientWidth - on.clientWidth) / 2
})
onMounted(centerTab)
watch(() => route.params.slug, centerTab)

useHead(() => ({
  title: `${activeStage.value.title} | Процесс «под ключ» ESP`,
  meta: [{ name: 'description', content: activeStage.value.desc }]
}))
</script>

<style scoped>
.pr-crumbs { margin-bottom: 1.5rem; font-size: 13px; }
.pr-tabs { display: none; }
.pr-grid { display: grid; grid-template-columns: minmax(0, 5fr) minmax(0, 7fr); gap: 2.5rem; align-items: start; margin-top: 2.5rem; }
.pr-list { margin-top: 0; padding: 0.4rem 0.6rem; }
.pr-item { flex-wrap: nowrap; justify-content: flex-start; gap: 1rem; padding: 0.85rem 0.8rem; border-radius: 12px; transition: background-color 0.2s ease; }
.pr-item + .pr-item { border-top: 0; }
.pr-item:hover { background: var(--ap-bg); }
.pr-item.is-on { background: var(--ap-ink); color: #fff; }
.pr-item.is-on .pr-item-desc { color: rgba(255, 255, 255, 0.65); }
.pr-num { flex: 0 0 auto; width: 2rem; font-size: 14px; font-weight: 600; font-variant-numeric: tabular-nums; color: var(--ap-accent); }
.pr-item.is-on .pr-num { color: rgba(255, 255, 255, 0.7); }
.pr-item-body { display: grid; gap: 0.15rem; min-width: 0; }
.pr-item-desc { overflow: hidden; white-space: nowrap; text-overflow: ellipsis; }
.pr-detail { position: sticky; top: 6rem; }
.pr-img { aspect-ratio: 16 / 10; border-radius: 18px; overflow: hidden; background: #ebebef; margin-bottom: 1.5rem; }
.pr-img img { width: 100%; height: 100%; object-fit: cover; }
.pr-title { font-size: clamp(1.6rem, 2.6vw, 2.2rem); }
.pr-desc { margin-top: 0.75rem; font-size: 16px; }
.pr-details { display: grid; gap: 0.7rem; margin-top: 1.25rem; }
.pr-details li { display: flex; gap: 0.7rem; font-size: 15px; line-height: 1.5; color: var(--ap-ink); }
.pr-details svg { flex: 0 0 auto; width: 18px; height: 18px; margin-top: 0.15rem; color: var(--ap-blue); }
@media (max-width: 1023px) {
  .pr-tabs { display: flex; }
  .pr-grid { grid-template-columns: minmax(0, 1fr); margin-top: 1.5rem; }
  .pr-list { display: none; }
  .pr-detail { position: static; }
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
