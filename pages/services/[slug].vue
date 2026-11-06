<template>
  <div v-if="service" class="ap">
    <!-- Шапка: крошки, тихая иконка, крупный заголовок -->
    <section class="ap-sec ap-sec--first">
      <div class="ap-wrap">
        <Breadcrumb class="sd-crumbs" :items="[{ label: 'Услуги', to: '/services' }, { label: service.title }]" />
        <svg class="sd-ico" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true" v-html="serviceIcons[service.icon]"></svg>
        <h1 class="ap-title">{{ service.title }}</h1>
        <p class="ap-lede">{{ service.longDesc || service.desc }}</p>
        <div class="ap-actions">
          <NuxtLink to="/contacts#contact-form" class="ap-btn">Заказать услугу</NuxtLink>
        </div>
      </div>
    </section>

    <section class="ap-sec ap-sec--white">
      <div class="ap-wrap sd-layout">
        <div class="sd-main">
          <h2 class="ap-h2">Этапы выполнения</h2>
          <ol class="sd-steps">
            <li v-for="(stage, i) in service.stages" :key="i" class="ap-card sd-step">
              <span class="sd-num">{{ i + 1 }}</span>
              <h3 class="ap-h3">{{ stage.title }}</h3>
              <p class="ap-text">{{ stage.desc }}</p>
            </li>
          </ol>

          <div v-if="relatedEquipment.length" class="sd-eq">
            <h2 class="ap-h2">Применяемое оборудование</h2>
            <div class="ap-grid ap-grid--2">
              <NuxtLink
                v-for="eq in relatedEquipment"
                :key="eq.slug"
                :to="`/equipment/${eq.slug}`"
                class="ap-card ap-card--media"
              >
                <div class="sd-eq-tile">
                  <img :src="eq.image" :alt="eq.name" loading="lazy" class="sd-eq-img" />
                </div>
                <div class="ap-card-body">
                  <h3 class="ap-h3">{{ eq.name }}</h3>
                  <span class="ap-card-foot ap-link">Смотреть оборудование ›</span>
                </div>
              </NuxtLink>
            </div>
          </div>
        </div>

        <aside class="ap-card sd-aside">
          <h3 class="ap-h3">Что входит</h3>
          <ul class="sd-points">
            <li v-for="point in service.points" :key="point">{{ point }}</li>
          </ul>
          <NuxtLink to="/contacts#contact-form" class="ap-btn ap-btn--block">
            Заказать услугу
          </NuxtLink>
        </aside>
      </div>
    </section>

    <section class="ap-sec">
      <div class="ap-wrap">
        <div class="ap-head">
          <h2 class="ap-h2">Другие услуги</h2>
          <NuxtLink to="/services" class="ap-link">Все услуги ›</NuxtLink>
        </div>
        <div class="ap-grid ap-grid--3">
          <NuxtLink
            v-for="s in otherServices"
            :key="s.slug"
            :to="`/services/${s.slug}`"
            class="ap-card"
          >
            <svg class="ap-ico" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true" v-html="serviceIcons[s.icon]"></svg>
            <h3 class="ap-h3">{{ s.title }}</h3>
            <span class="ap-card-foot ap-link">Подробнее ›</span>
          </NuxtLink>
        </div>
      </div>
    </section>
  </div>
  <div v-else class="ap">
    <section class="ap-sec ap-sec--first ap-center">
      <div class="ap-wrap">
        <p class="ap-lede">Услуга не найдена.</p>
        <div class="ap-actions"><NuxtLink to="/services" class="ap-link">Вернуться к услугам ›</NuxtLink></div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { servicesList, serviceIcons } from '~/composables/useServices'
import { equipmentList } from '~/composables/useEquipment'

const route = useRoute()
const service = computed(() => servicesList.find(s => s.slug === route.params.slug))

const relatedEquipment = computed(() => {
  if (!service.value?.equipmentSlugs?.length) return []
  return equipmentList.filter(e => service.value.equipmentSlugs.includes(e.slug))
})

const otherServices = computed(() =>
  servicesList.filter(s => s.slug !== route.params.slug).slice(0, 3)
)

useHead(() => ({
  title: service.value ? `${service.value.title} | Услуги ESP` : 'Услуга не найдена | ESP',
  meta: [
    { name: 'description', content: service.value ? service.value.desc : '' }
  ]
}))
</script>

<style scoped>
.sd-crumbs { margin-bottom: 1.75rem; }
.sd-ico { width: 40px; height: 40px; margin-bottom: 1rem; color: var(--ap-blue); }
.sd-ico :deep(path), .ap-ico :deep(path) { stroke-width: 1.5; }

.sd-layout { display: grid; grid-template-columns: minmax(0, 2fr) minmax(0, 1fr); gap: 3rem; align-items: start; }
.sd-steps { display: grid; gap: 1rem; margin-top: 2rem; list-style: none; padding: 0; }
.sd-step { position: relative; padding-left: 4.5rem; }
.sd-num { position: absolute; left: 1.6rem; top: 1.6rem; width: 2rem; height: 2rem; display: grid; place-items: center; border-radius: 50%; background: var(--ap-blue); color: #fff; font-size: 14px; font-weight: 600; }

.sd-eq { margin-top: 4rem; }
.sd-eq-tile { display: grid; place-items: center; aspect-ratio: 4 / 3; background: #fff; }
.sd-eq-img { width: 80%; height: 80%; object-fit: contain; mix-blend-mode: multiply; }

.sd-aside { position: sticky; top: 6rem; gap: 1rem; }
.sd-points { display: grid; gap: 0.55rem; list-style: none; padding: 0; margin-bottom: 0.5rem; }
.sd-points li { position: relative; padding-left: 1.2rem; font-size: 14px; line-height: 1.45; color: var(--ap-muted); }
.sd-points li::before { content: ''; position: absolute; left: 0.15rem; top: 0.4em; width: 0.4rem; height: 0.7rem; border: solid var(--ap-accent); border-width: 0 1.5px 1.5px 0; transform: rotate(45deg); }

@media (max-width: 1023px) {
  .sd-layout { grid-template-columns: 1fr; }
  .sd-aside { position: static; }
}
@media (max-width: 767px) {
  .sd-step { padding-left: 1.75rem; padding-top: 4rem; }
  .sd-num { left: 1.75rem; top: 1.5rem; }
}
</style>
