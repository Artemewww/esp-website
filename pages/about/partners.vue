<template>
  <div class="ap">
    <section class="ap-sec ap-sec--first">
      <div class="ap-wrap">
        <Breadcrumb :items="[{ label: 'О компании', to: '/about' }, { label: 'Партнёры' }]" />
        <span class="ap-eyebrow ap2-eyebrow">Партнёрская сеть</span>
        <h1 class="ap-title">Наши партнёры</h1>
        <p class="ap-lede">
          За 17 лет работы ESP выстроила партнёрскую сеть из проектных институтов, промышленных предприятий, госучреждений и зарубежных компаний.
        </p>
        <div class="ap2-search">
          <input
            v-model="search"
            type="search"
            placeholder="Найти партнёра по названию…"
            aria-label="Поиск партнёра"
            class="ap-input"
          />
        </div>

        <div class="ap-grid ap-grid--3 ap2-grid">
          <component
            :is="p.site ? 'a' : 'div'"
            v-for="(p, i) in filteredPartners"
            :key="i"
            :href="p.site ? `https://${p.site}` : undefined"
            :target="p.site ? '_blank' : undefined"
            rel="noopener"
            class="ap-card ap2-card"
          >
            <span class="ap2-name">{{ p.name }}</span>
            <span v-if="p.site" class="ap2-site">{{ p.site }}</span>
          </component>
        </div>
        <p v-if="!filteredPartners.length" class="ap-text ap2-empty">Партнёры не найдены</p>
      </div>
    </section>

    <AppleCta title="Стать партнёром ESP" lede="Проектным организациям и региональным дилерам — выгодные условия сотрудничества.">
      <NuxtLink to="/about/cooperation" class="ax-btn">Условия сотрудничества</NuxtLink>
      <NuxtLink to="/contacts#contact-form" class="ax-link">Обсудить проект</NuxtLink>
    </AppleCta>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { partnersList } from '~/composables/usePartners'
const partners = useEditableList('partners', partnersList)

const search = ref('')
const filteredPartners = computed(() => {
  if (!search.value.trim()) return partners.value
  const q = search.value.toLowerCase()
  return partners.value.filter(p => p.name.toLowerCase().includes(q))
})

useHead({
  title: 'Партнёры | ESP',
  meta: [
    { name: 'description', content: 'Партнёрская сеть ЭкоСервисПроект: проектные институты, промышленные предприятия, госучреждения Беларуси и зарубежные компании.' }
  ]
})
</script>

<style scoped>
.ap2-eyebrow { margin-top: 1.5rem; }
.ap2-search { max-width: 28rem; margin-top: 2rem; }
.ap2-grid { gap: 0.75rem; margin-top: 2rem; }
.ap2-card { padding: 1.25rem 1.4rem; gap: 0.25rem; }
a.ap2-card:hover .ap2-name { color: var(--ap-link); }
.ap2-name { font-size: 15px; font-weight: 600; line-height: 1.35; color: var(--ap-ink); transition: color 0.2s ease; }
.ap2-site { font-size: 13px; color: var(--ap-link); word-break: break-all; }
.ap2-empty { padding: 2.5rem 0; text-align: center; }
</style>
