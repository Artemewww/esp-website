<template>
  <div v-if="service" ref="root" class="dj sd">
    <!-- Шапка: крошки, иконка, крупный заголовок -->
    <section class="sd-hero">
      <div class="dj-wrap">
        <Breadcrumb class="sd-crumbs" :items="[{ label: 'Услуги', to: '/services' }, { label: service.title }]" />
        <div class="sd-hero-in">
          <ApIcon :name="serviceGlyphs[service.icon]" class="sd-ico" />
          <h1 class="sd-title">{{ service.title }}</h1>
          <p class="dj-lede sd-lede">{{ service.longDesc || service.desc }}</p>
          <div class="dj-links">
            <NuxtLink to="/contacts#contact-form" class="dj-btn dj-btn--lg">Заказать услугу</NuxtLink>
          </div>
        </div>
      </div>
    </section>

    <DjSubnav
      :title="service.title"
      :links="subLinks"
      :cta="{ to: '/contacts#contact-form', label: 'Заказать услугу' }"
    />

    <!-- Этапы выполнения: горизонтальная шкала -->
    <section id="stages" class="dj-sec sd-anchor">
      <div class="dj-wrap">
        <h2 class="dj-h2 dj-reveal">Этапы выполнения</h2>
        <ol class="sd-steps">
          <li v-for="(stage, i) in service.stages" :key="i" class="sd-step dj-reveal">
            <span class="sd-num">{{ String(i + 1).padStart(2, '0') }}</span>
            <h3 class="sd-h3">{{ stage.title }}</h3>
            <p class="sd-text">{{ stage.desc }}</p>
          </li>
        </ol>
      </div>
    </section>

    <!-- Что входит -->
    <section id="includes" class="dj-sec dj-sec--soft sd-anchor">
      <div class="dj-wrap sd-inc dj-reveal">
        <h2 class="dj-h2">Что входит</h2>
        <div>
          <ul class="sd-points">
            <li v-for="point in service.points" :key="point">{{ point }}</li>
          </ul>
          <NuxtLink to="/contacts#contact-form" class="dj-btn sd-inc-btn">Заказать услугу</NuxtLink>
        </div>
      </div>
    </section>

    <section v-if="relatedEquipment.length" id="equipment" class="sd-anchor sd-eq">
      <div class="dj-wrap dj-center dj-reveal">
        <h2 class="dj-h2">Применяемое оборудование</h2>
      </div>
      <div class="dj-tiles dj-tiles--2">
        <NuxtLink v-for="eq in relatedEquipment" :key="eq.slug" :to="`/equipment/${eq.slug}`" class="dj-tile dj-reveal">
          <h3 class="dj-tile__title">{{ eq.name }}</h3>
          <span class="dj-links"><span class="dj-more">Смотреть оборудование</span></span>
          <span class="dj-tile__media dj-tile__media--contain"><img :src="eq.image" :alt="eq.name" loading="lazy" /></span>
        </NuxtLink>
      </div>
    </section>

    <section class="dj-sec">
      <div class="dj-wrap">
        <div class="sd-head dj-reveal">
          <h2 class="dj-h2">Другие услуги</h2>
          <NuxtLink to="/services" class="dj-more">Все услуги</NuxtLink>
        </div>
      </div>
      <div class="sd-others">
        <NuxtLink v-for="s in otherServices" :key="s.slug" :to="`/services/${s.slug}`" class="sd-other dj-reveal">
          <ApIcon :name="serviceGlyphs[s.icon]" class="sd-other-ico" />
          <h3 class="sd-h3">{{ s.title }}</h3>
          <span class="dj-more sd-foot">Подробнее</span>
        </NuxtLink>
      </div>
    </section>
  </div>
  <div v-else class="dj">
    <section class="dj-sec dj-center">
      <div class="dj-wrap">
        <p class="dj-lede">Услуга не найдена.</p>
        <div class="dj-links"><NuxtLink to="/services" class="dj-more">Вернуться к услугам</NuxtLink></div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { servicesList, serviceGlyphs } from '~/composables/useServices'
import { equipmentList } from '~/composables/useEquipment'
import { useReveal } from '~/composables/useReveal'

const route = useRoute()
const root = ref(null)
useReveal(root)
const service = computed(() => servicesList.find(s => s.slug === route.params.slug))

const relatedEquipment = computed(() => {
  if (!service.value?.equipmentSlugs?.length) return []
  return equipmentList.filter(e => service.value.equipmentSlugs.includes(e.slug))
})

const subLinks = computed(() => [
  { href: '#stages', label: 'Этапы' },
  { href: '#includes', label: 'Что входит' },
  ...(relatedEquipment.value.length ? [{ href: '#equipment', label: 'Оборудование' }] : [])
])

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
.sd-anchor { scroll-margin-top: 120px; }
/* Длинное название услуги в подполосе обрезаем многоточием */
.sd :deep(.dsn-title) { min-width: 0; overflow: hidden; text-overflow: ellipsis; }
.sd :deep(.dsn-cta) { flex-shrink: 0; }
.sd-hero { padding: clamp(28px, 4vw, 40px) 0 clamp(48px, 7vw, 88px); background: #fff; }
.sd-crumbs { font-size: 13px; }
.sd-hero-in { display: flex; flex-direction: column; align-items: center; text-align: center; margin-top: clamp(28px, 5vw, 64px); }
.sd-ico { width: 52px; height: 52px; margin-bottom: 18px; color: var(--dj-ink); }
.sd-title { max-width: 20ch; font-size: clamp(34px, 5vw, 60px); line-height: 1.06; font-weight: 600; letter-spacing: -0.03em; color: var(--dj-ink); text-wrap: balance; overflow-wrap: break-word; hyphens: auto; }
.sd-lede { margin-top: 16px; max-width: 62ch; text-wrap: pretty; }
.sd-hero .dj-links { margin-top: 26px; }
.sd-h3 { font-size: clamp(18px, 1.5vw, 21px); line-height: 1.25; font-weight: 600; color: var(--dj-ink); letter-spacing: -0.01em; }
.sd-text { font-size: 15px; line-height: 1.55; color: var(--dj-text); }

/* Этапы — горизонтальная шкала */
.sd-steps { position: relative; display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 32px; margin: clamp(32px, 5vw, 52px) 0 0; padding: 0; list-style: none; }
.sd-steps::before { content: ''; position: absolute; left: 0; right: 0; top: 19px; height: 1px; background: var(--dj-line); }
.sd-step { position: relative; display: grid; gap: 8px; align-content: start; }
.sd-num { display: grid; place-items: center; width: 40px; height: 40px; margin-bottom: 10px; background: var(--dj-ink); color: #fff; font-size: 13px; font-weight: 600; font-variant-numeric: tabular-nums; }

/* Что входит */
.sd-inc { display: grid; grid-template-columns: minmax(0, 1fr) minmax(0, 1.4fr); gap: 24px 64px; align-items: start; }
.sd-points { display: grid; grid-template-columns: 1fr 1fr; gap: 0 32px; margin: 0; padding: 0; list-style: none; border-top: 1px solid #dcdfe3; }
.sd-points li { position: relative; padding: 16px 0 16px 26px; border-bottom: 1px solid #dcdfe3; font-size: 16px; line-height: 1.45; color: var(--dj-ink); }
.sd-points li::before { content: ''; position: absolute; left: 4px; top: 1.2em; width: 6px; height: 11px; border: solid var(--dj-accent); border-width: 0 1.5px 1.5px 0; transform: rotate(45deg); }
.sd-inc-btn { margin-top: 28px; }

.sd-eq { padding-top: clamp(56px, 8vw, 104px); }
.sd-eq .dj-tiles { margin-top: clamp(20px, 3vw, 32px); }

.sd-head { display: flex; align-items: flex-end; justify-content: space-between; gap: 16px 32px; flex-wrap: wrap; }
.sd-others { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 12px; max-width: 1440px; margin: clamp(28px, 4vw, 44px) auto 0; padding: 0 12px; }
.sd-other { display: flex; flex-direction: column; align-items: center; gap: 10px; min-height: 260px; padding: clamp(32px, 3.6vw, 48px) 24px; text-align: center; background: linear-gradient(180deg, #f6f7f9 0%, #e9ecef 100%); }
.sd-other-ico { width: 40px; height: 40px; margin-bottom: 8px; color: var(--dj-ink); transition: transform 0.6s var(--dj-ease); }
.sd-other:hover .sd-other-ico { transform: translateY(-4px); }
.sd-foot { margin-top: auto; padding-top: 12px; }

@media (max-width: 1023px) {
  .sd-inc { grid-template-columns: minmax(0, 1fr); }
  .sd-steps { grid-template-columns: 1fr 1fr; }
  .sd-steps::before { display: none; }
}
@media (max-width: 767px) {
  .sd-steps { grid-template-columns: minmax(0, 1fr); gap: 24px; }
  .sd-steps::before { display: block; left: 19px; right: auto; top: 0; bottom: 0; width: 1px; height: auto; }
  .sd-step { grid-template-columns: 40px minmax(0, 1fr); column-gap: 18px; }
  .sd-step > :not(.sd-num) { grid-column: 2; }
  .sd-num { grid-row: 1 / span 2; margin-bottom: 0; }
  .sd-points { grid-template-columns: minmax(0, 1fr); }
  .sd-others { grid-template-columns: minmax(0, 1fr); padding: 0 8px; gap: 8px; }
  .sd-other { min-height: 0; }
}
@media (prefers-reduced-motion: reduce) {
  .sd-other-ico { transition: none; }
}
</style>
