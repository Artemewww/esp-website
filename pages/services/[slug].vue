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
            <NuxtLink to="/contacts#contact-form" class="dj-btn dj-btn--lg">Обсудить проект</NuxtLink>
          </div>
        </div>
      </div>
    </section>

    <DjSubnav
      :title="service.title"
      :links="subLinks"
      :cta="{ to: '/contacts#contact-form', label: 'Обсудить проект' }"
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
          <NuxtLink to="/contacts#contact-form" class="dj-btn sd-inc-btn">Обсудить проект</NuxtLink>
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
          <span class="dj-links"><span class="dj-more">Подробнее об оборудовании</span></span>
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
        <div class="dj-links"><NuxtLink to="/services" class="dj-more">Вернуться к услугам</NuxtLink></div>
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
/* Apple product page: hero по центру, «highlights»-карточки этапов,
   список «Что входит» как Tech Specs, карточки-ссылки со скруглением. */
.sd-anchor { scroll-margin-top: 120px; }
/* Длинное название услуги в подполосе обрезаем многоточием */
.sd :deep(.dsn-title) { min-width: 0; overflow: hidden; text-overflow: ellipsis; }
.sd :deep(.dsn-cta) { flex-shrink: 0; }
.sd-hero { padding: clamp(20px, 3vw, 32px) 0 clamp(56px, 8vw, 100px); background: #fff; }
.sd-crumbs { font-size: 12px; }
.sd-hero-in { display: flex; flex-direction: column; align-items: center; text-align: center; margin-top: clamp(36px, 6vw, 80px); }
.sd-ico { width: 56px; height: 56px; margin-bottom: 20px; color: var(--dj-ink); }
.sd-title { max-width: 18ch; font-size: clamp(40px, 5.6vw, 80px); line-height: 1.05; font-weight: 600; letter-spacing: -0.015em; color: var(--dj-ink); text-wrap: balance; overflow-wrap: break-word; hyphens: auto; }
.sd-lede { margin-top: 18px; max-width: 40em; color: #6e6e73; text-wrap: pretty; }
.sd-hero .dj-links { margin-top: 30px; }
.sd-h3 { font-size: clamp(19px, 1.6vw, 24px); line-height: 1.17; font-weight: 600; color: var(--dj-ink); letter-spacing: 0.009em; }
.sd-text { font-size: 17px; line-height: 1.47; letter-spacing: -0.022em; color: #6e6e73; }

/* Этапы — карточки «Get the highlights» */
.sd-steps { display: grid; grid-template-columns: repeat(auto-fit, minmax(230px, 1fr)); gap: 20px; margin: clamp(32px, 5vw, 56px) 0 0; padding: 0; list-style: none; }
.sd-step { display: grid; gap: 10px; align-content: start; padding: clamp(28px, 3vw, 40px) clamp(24px, 2.4vw, 32px); border-radius: 28px; background: #f5f5f7; }
.sd-num { display: block; margin-bottom: 18px; font-size: clamp(40px, 4vw, 56px); line-height: 1; font-weight: 600; letter-spacing: -0.005em; color: var(--dj-blue); font-variant-numeric: tabular-nums; }

/* Что входит — список с волосяными линиями, как Tech Specs */
.sd-inc { display: grid; grid-template-columns: minmax(0, 1fr) minmax(0, 1.5fr); gap: 24px 64px; align-items: start; }
.sd-points { display: grid; grid-template-columns: 1fr 1fr; gap: 0 40px; margin: 0; padding: 0; list-style: none; border-top: 1px solid #d2d2d7; }
.sd-points li { position: relative; padding: 18px 0 18px 28px; border-bottom: 1px solid #d2d2d7; font-size: 17px; line-height: 1.47; letter-spacing: -0.022em; color: var(--dj-ink); }
.sd-points li::before { content: ''; position: absolute; left: 4px; top: 1.3em; width: 6px; height: 11px; border: solid var(--dj-blue); border-width: 0 1.5px 1.5px 0; transform: rotate(45deg); }
.sd-inc-btn { margin-top: 32px; }

.sd-eq { padding-top: clamp(56px, 8vw, 104px); }
.sd-eq .dj-tiles { margin-top: clamp(20px, 3vw, 32px); }
.sd-eq .dj-tile__title { letter-spacing: -0.005em; }

.sd-head { display: flex; align-items: baseline; justify-content: space-between; gap: 16px 32px; flex-wrap: wrap; }
.sd-head .dj-more { font-size: 17px; }
.sd-others { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 20px; max-width: 1200px; margin: clamp(28px, 4vw, 44px) auto 0; padding: 0 24px; }
.sd-other { display: flex; flex-direction: column; align-items: flex-start; gap: 10px; min-height: 240px; padding: clamp(28px, 3vw, 40px) clamp(24px, 2.4vw, 32px); border-radius: 18px; background: #fff; box-shadow: 2px 4px 12px rgba(0, 0, 0, 0.08); transition: box-shadow 0.3s cubic-bezier(0, 0, 0.5, 1), transform 0.3s cubic-bezier(0, 0, 0.5, 1); }
.sd-other:hover { box-shadow: 2px 4px 16px rgba(0, 0, 0, 0.16); transform: scale(1.01); }
.sd-other-ico { width: 40px; height: 40px; margin-bottom: 8px; color: var(--dj-ink); }
.sd-foot { margin-top: auto; padding-top: 12px; font-size: 17px; }

@media (max-width: 1023px) {
  .sd-inc { grid-template-columns: minmax(0, 1fr); }
  .sd-steps { grid-template-columns: 1fr 1fr; }
}
@media (max-width: 767px) {
  .sd-steps { grid-template-columns: minmax(0, 1fr); gap: 12px; }
  .sd-step { border-radius: 18px; }
  .sd-points { grid-template-columns: minmax(0, 1fr); }
  .sd-others { grid-template-columns: minmax(0, 1fr); padding: 0 16px; gap: 12px; }
  .sd-other { min-height: 0; }
}
@media (prefers-reduced-motion: reduce) {
  .sd-other { transition: none; }
  .sd-other:hover { transform: none; }
}
</style>
