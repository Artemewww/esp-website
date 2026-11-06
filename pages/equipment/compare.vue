<template>
  <div class="ap">
    <section class="ap-sec ap-sec--first">
      <div class="ap-wrap">
        <Breadcrumb :items="[{ label: 'Оборудование', to: '/equipment' }, { label: 'Сравнение' }]" />
        <span class="ap-eyebrow cm-eyebrow">Инженерный арбитраж</span>
        <h1 class="ap-title">Сравнение оборудования</h1>
        <p class="ap-lede">
          Выберите до 4 моделей из каталога ESP, чтобы сравнить производительность, применение и гарантийные условия бок о бок.
        </p>

        <!-- Выбор моделей: список + капсулы -->
        <div class="cm-picker">
          <div class="cm-select">
            <select
              class="ap-input"
              :disabled="selected.length >= 4"
              aria-label="Добавить модель к сравнению"
              @change="addFromSelect($event)"
            >
              <option value="">{{ selected.length >= 4 ? 'Максимум 4 модели' : '+ Добавить модель к сравнению' }}</option>
              <option v-for="eq in availableToAdd" :key="eq.slug" :value="eq.slug">{{ eq.name }}</option>
            </select>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M6 9l6 6 6-6" /></svg>
          </div>
          <p class="ap-small">Выбрано: <strong class="cm-count">{{ selected.length }}</strong> / 4</p>
        </div>

        <div v-if="selected.length" class="cm-chips">
          <span v-for="eq in comparedModels" :key="eq.slug" class="cm-chip">
            {{ eq.name }}
            <button type="button" class="cm-chip-x" aria-label="Убрать из сравнения" @click="toggle(eq.slug)">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18" /></svg>
            </button>
          </span>
        </div>

        <!-- Таблица сравнения -->
        <div class="cm-box">
          <div class="cm-scroll">
            <table class="cm-table">
              <thead>
                <tr>
                  <th class="cm-param" scope="col">Параметр</th>
                  <th v-for="m in comparedModels" :key="m.slug" class="cm-model" scope="col">
                    <div class="cm-img">
                      <img :src="m.image" :alt="m.name" loading="lazy" />
                    </div>
                    <NuxtLink :to="`/equipment/${m.slug}`" class="cm-name">{{ m.name }}</NuxtLink>
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <th class="cm-param" scope="row">Категория</th>
                  <td v-for="m in comparedModels" :key="m.slug + 'cat'">{{ m.category }}</td>
                </tr>
                <tr>
                  <th class="cm-param" scope="row">Производительность</th>
                  <td v-for="m in comparedModels" :key="m.slug + 'cap'" class="cm-strong">{{ m.capacity }}</td>
                </tr>
                <tr>
                  <th class="cm-param" scope="row">Применение</th>
                  <td v-for="m in comparedModels" :key="m.slug + 'app'">{{ m.application }}</td>
                </tr>
                <tr>
                  <th class="cm-param" scope="row">Гарантия</th>
                  <td v-for="m in comparedModels" :key="m.slug + 'war'" class="cm-strong">{{ warranty(m) }}</td>
                </tr>
                <tr>
                  <th class="cm-param" scope="row">Ключевые характеристики</th>
                  <td v-for="m in comparedModels" :key="m.slug + 'specs'">
                    <ul class="cm-specs">
                      <li v-for="spec in m.specs.slice(0, 4)" :key="spec.label">
                        <span>{{ spec.label }}:</span> {{ spec.value }}
                      </li>
                    </ul>
                  </td>
                </tr>
                <tr>
                  <th class="cm-param" scope="row"></th>
                  <td v-for="m in comparedModels" :key="m.slug + 'cta'">
                    <NuxtLink :to="`/equipment/${m.slug}`" class="ap-btn">Подробнее</NuxtLink>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <p v-if="!comparedModels.length" class="ap-text cm-empty">Выберите оборудование выше, чтобы начать сравнение</p>
        </div>
      </div>
    </section>

    <!-- Запрос расчёта -->
    <section class="ap-sec ap-sec--white">
      <div class="ap-wrap ap-wrap--narrow">
        <div class="ap-center">
          <h2 class="ap-h2">Запросить расчёт по выбранным моделям</h2>
          <p class="ap-lede">Отправим сравнительное КП с учётом параметров вашего объекта.</p>
        </div>
        <form v-if="!sent" class="ap-form cm-form" @submit.prevent="sent = true">
          <div>
            <label class="ap-label" for="cm-name">Ваше имя</label>
            <input id="cm-name" v-model="form.name" required type="text" placeholder="Ваше имя" class="ap-input" />
          </div>
          <div>
            <label class="ap-label" for="cm-email">E-mail</label>
            <input id="cm-email" v-model="form.email" required type="email" placeholder="E-mail" class="ap-input" />
          </div>
          <button type="submit" class="ap-btn ap-btn--block">Отправить запрос</button>
        </form>
        <div v-else class="ap-note-ok cm-form">
          Запрос отправлен. Инженер ESP свяжется с вами.
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { equipmentList } from '~/composables/useEquipment'

useHead({
  title: 'Сравнение оборудования ESP | Подберите оптимальную модель',
  meta: [
    { name: 'description', content: 'Сравните до 4 моделей оборудования ESP по производительности, применению, гарантии и техническим характеристикам.' }
  ]
})

const selected = ref(['flotation-units', 'kns-kvatro'])
const toggle = (slug) => {
  if (selected.value.includes(slug)) {
    selected.value = selected.value.filter(s => s !== slug)
  } else {
    if (selected.value.length >= 4) return
    selected.value = [...selected.value, slug]
  }
}

const addFromSelect = (e) => {
  const slug = e.target.value
  if (slug) toggle(slug)
  e.target.value = ''
}

const availableToAdd = computed(() => equipmentList.filter(e => !selected.value.includes(e.slug)))
const comparedModels = computed(() => equipmentList.filter(e => selected.value.includes(e.slug)))
const warranty = (m) => m.specs.find(s => s.label.toLowerCase().includes('гарант'))?.value || '—'

const form = ref({ name: '', email: '' })
const sent = ref(false)
</script>

<style scoped>
.cm-eyebrow { margin-top: 1.5rem; }
.cm-picker { display: flex; flex-wrap: wrap; align-items: center; gap: 0.75rem 1.25rem; margin-top: 2rem; }
.cm-select { position: relative; width: 100%; max-width: 24rem; }
.cm-select select { appearance: none; padding-right: 2.6rem; cursor: pointer; }
.cm-select select:disabled { cursor: not-allowed; color: var(--ap-muted); }
.cm-select svg { position: absolute; right: 1rem; top: 50%; width: 16px; height: 16px; transform: translateY(-50%); color: var(--ap-muted); pointer-events: none; }
.cm-count { color: var(--ap-ink); }
.cm-chips { display: flex; flex-wrap: wrap; gap: 0.5rem; margin-top: 1rem; }
.cm-chip { display: inline-flex; align-items: center; gap: 0.4rem; padding: 0.4rem 0.45rem 0.4rem 0.95rem; border-radius: 999px; background: #fff; font-size: 14px; color: var(--ap-ink); }
.cm-chip-x { display: grid; place-items: center; width: 22px; height: 22px; border-radius: 999px; color: var(--ap-muted); background: rgba(0, 0, 0, 0.05); }
.cm-chip-x:hover { color: var(--ap-ink); background: rgba(0, 0, 0, 0.1); }
.cm-chip-x svg { width: 11px; height: 11px; }

.cm-box { margin-top: 2rem; border-radius: 18px; background: #fff; overflow: hidden; }
.cm-scroll { overflow-x: auto; -webkit-overflow-scrolling: touch; }
.cm-table { width: 100%; min-width: 640px; border-collapse: separate; border-spacing: 0; font-size: 15px; color: var(--ap-ink); }
.cm-table th, .cm-table td { padding: 1.1rem 1.25rem; text-align: left; vertical-align: top; border-bottom: 1px solid var(--ap-line); }
.cm-table tbody tr:last-child th, .cm-table tbody tr:last-child td { border-bottom: 0; }
.cm-param { position: sticky; left: 0; z-index: 1; width: 11rem; min-width: 9rem; background: #fff; font-size: 13px; font-weight: 500; color: var(--ap-muted); }
thead .cm-param { vertical-align: bottom; }
.cm-model { min-width: 200px; max-width: 240px; font-weight: 600; }
.cm-img { display: flex; align-items: center; justify-content: center; aspect-ratio: 1; margin-bottom: 0.9rem; border-radius: 14px; background: var(--ap-bg); overflow: hidden; }
.cm-img img { width: 100%; height: 100%; object-fit: contain; padding: 1rem; }
.cm-name { font-size: 16px; line-height: 1.3; color: var(--ap-ink); }
.cm-name:hover { color: var(--ap-link); }
.cm-strong { font-weight: 600; }
.cm-specs { display: grid; gap: 0.3rem; font-size: 13px; line-height: 1.45; color: var(--ap-ink); }
.cm-specs span { color: var(--ap-muted); }
.cm-empty { padding: 2.5rem 1.5rem; text-align: center; }
.cm-form { margin-top: 2.5rem; }
@media (max-width: 767px) {
  .cm-param { width: 7.5rem; min-width: 7.5rem; }
  .cm-table th, .cm-table td { padding: 0.95rem 0.9rem; }
}
</style>
