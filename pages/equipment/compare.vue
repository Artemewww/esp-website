<template>
  <div class="cmp">
    <section class="cmp-top">
      <div class="dj-wrap">
        <Breadcrumb :items="[{ label: 'Оборудование', to: '/equipment' }, { label: 'Сравнение' }]" />
        <span class="dj-eyebrow cmp-eyebrow">Инженерный арбитраж</span>
        <h1 class="dj-h1">Сравнение оборудования</h1>
        <p class="dj-lede cmp-lede">
          Выберите до 4 моделей из каталога ESP, чтобы сравнить производительность, применение и гарантийные условия бок о бок.
        </p>

        <!-- Выбор моделей: список + капсулы -->
        <div class="cmp-picker">
          <div class="cmp-select">
            <select
              class="cmp-input"
              :disabled="selected.length >= 4"
              aria-label="Добавить модель к сравнению"
              @change="addFromSelect($event)"
            >
              <option value="">{{ selected.length >= 4 ? 'Максимум 4 модели' : '+ Добавить модель к сравнению' }}</option>
              <option v-for="eq in availableToAdd" :key="eq.slug" :value="eq.slug">{{ eq.name }}</option>
            </select>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.6" aria-hidden="true"><path d="M6 9l6 6 6-6" /></svg>
          </div>
          <p class="cmp-small">Выбрано: <strong>{{ selected.length }}</strong> / 4</p>
        </div>

        <div v-if="selected.length" class="cmp-chips">
          <span v-for="eq in comparedModels" :key="eq.slug" class="cmp-chip">
            {{ eq.name }}
            <button type="button" class="cmp-chip-x" aria-label="Убрать из сравнения" @click="toggle(eq.slug)">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.6" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18" /></svg>
            </button>
          </span>
        </div>
      </div>
    </section>

    <!-- Таблица сравнения -->
    <section class="cmp-tbl-sec">
      <div class="dj-wrap">
        <div class="cmp-scroll">
          <table class="cmp-table">
            <thead>
              <tr>
                <th class="cmp-param" scope="col">Параметр</th>
                <th v-for="m in comparedModels" :key="m.slug" class="cmp-model" scope="col">
                  <NuxtLink :to="`/equipment/${m.slug}`" class="cmp-img" tabindex="-1" :aria-label="m.name">
                    <EquipShot :item="m" :caption="false" />
                  </NuxtLink>
                  <NuxtLink :to="`/equipment/${m.slug}`" class="cmp-name">{{ m.name }}</NuxtLink>
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <th class="cmp-param" scope="row">Категория</th>
                <td v-for="m in comparedModels" :key="m.slug + 'cat'">{{ m.category }}</td>
              </tr>
              <tr>
                <th class="cmp-param" scope="row">Производительность</th>
                <td v-for="m in comparedModels" :key="m.slug + 'cap'" class="cmp-strong">{{ m.capacity }}</td>
              </tr>
              <tr>
                <th class="cmp-param" scope="row">Применение</th>
                <td v-for="m in comparedModels" :key="m.slug + 'app'">{{ m.application }}</td>
              </tr>
              <tr>
                <th class="cmp-param" scope="row">Гарантия</th>
                <td v-for="m in comparedModels" :key="m.slug + 'war'" class="cmp-strong">{{ warranty(m) }}</td>
              </tr>
              <tr>
                <th class="cmp-param" scope="row">Ключевые характеристики</th>
                <td v-for="m in comparedModels" :key="m.slug + 'specs'">
                  <ul class="cmp-specs">
                    <li v-for="spec in (m.specs || []).slice(0, 4)" :key="spec.label">
                      <span>{{ spec.label }}:</span> {{ spec.value }}
                    </li>
                  </ul>
                </td>
              </tr>
              <tr>
                <th class="cmp-param" scope="row"></th>
                <td v-for="m in comparedModels" :key="m.slug + 'cta'">
                  <NuxtLink :to="`/equipment/${m.slug}`" class="dj-btn">Подробнее</NuxtLink>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <p v-if="!comparedModels.length" class="cmp-empty">Выберите оборудование выше, чтобы начать сравнение</p>
      </div>
    </section>

    <!-- Запрос расчёта -->
    <section class="dj-sec dj-sec--soft">
      <div class="dj-wrap cmp-req">
        <div class="dj-center">
          <h2 class="dj-h2">Запросить расчёт по выбранным моделям</h2>
          <p class="dj-lede cmp-req-lede">Отправим сравнительное КП с учётом параметров вашего объекта.</p>
        </div>
        <form v-if="!sent" class="cmp-form" @submit.prevent="sent = true">
          <div>
            <label class="cmp-label" for="cm-name">Ваше имя</label>
            <input id="cm-name" v-model="form.name" required type="text" placeholder="Ваше имя" class="cmp-input" />
          </div>
          <div>
            <label class="cmp-label" for="cm-email">E-mail</label>
            <input id="cm-email" v-model="form.email" required type="email" placeholder="E-mail" class="cmp-input" />
          </div>
          <button type="submit" class="dj-btn dj-btn--lg cmp-submit">Отправить запрос</button>
        </form>
        <div v-else class="cmp-form cmp-ok" role="status">
          Запрос отправлен. Инженер ESP свяжется с вами.
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

useHead({
  title: 'Сравнение оборудования ESP | Подберите оптимальную модель',
  meta: [
    { name: 'description', content: 'Сравните до 4 моделей оборудования ESP по производительности, применению, гарантии и техническим характеристикам.' }
  ]
})

const { equipment } = useEquipment()

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

const availableToAdd = computed(() => equipment.value.filter(e => !selected.value.includes(e.slug)))
const comparedModels = computed(() => equipment.value.filter(e => selected.value.includes(e.slug)))
const warranty = (m) => (m.specs || []).find(s => s.label.toLowerCase().includes('гарант'))?.value || '—'

const form = ref({ name: '', email: '' })
const sent = ref(false)
</script>

<style scoped>
.cmp { background: #fff; color: var(--dj-text); }
.cmp-top { padding: clamp(28px, 4vw, 48px) 0 0; }
.cmp-eyebrow { margin-top: 28px; margin-bottom: 8px; }
.cmp-lede { max-width: 60ch; margin-top: 14px; }

.cmp-picker { display: flex; flex-wrap: wrap; align-items: center; gap: 12px 20px; margin-top: 32px; }
.cmp-select { position: relative; width: 100%; max-width: 400px; }
.cmp-select select { appearance: none; padding-right: 44px; cursor: pointer; }
.cmp-select select:disabled { cursor: not-allowed; color: var(--dj-muted); }
.cmp-select svg { position: absolute; right: 16px; top: 50%; width: 16px; height: 16px; transform: translateY(-50%); color: var(--dj-muted); pointer-events: none; }
.cmp-small { font-size: 14px; color: var(--dj-muted); }
.cmp-small strong { color: var(--dj-ink); }

.cmp-input { width: 100%; height: 48px; padding: 0 16px; font: inherit; font-size: 15px; color: var(--dj-ink); background: var(--dj-soft); border: 1px solid transparent; border-radius: 0; outline: none; transition: border-color 0.2s ease, background-color 0.2s ease; }
.cmp-input:focus { border-color: var(--dj-ink); background: #fff; }
.cmp-label { display: block; margin-bottom: 8px; font-size: 13px; font-weight: 500; color: var(--dj-muted); }

.cmp-chips { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 16px; }
.cmp-chip { display: inline-flex; align-items: center; gap: 6px; max-width: 100%; padding: 6px 6px 6px 16px; border-radius: 999px; background: var(--dj-soft); font-size: 14px; color: var(--dj-ink); }
.cmp-chip-x { flex: 0 0 auto; display: grid; place-items: center; width: 24px; height: 24px; border-radius: 999px; color: var(--dj-muted); background: rgba(0, 0, 0, 0.06); }
.cmp-chip-x:hover { color: var(--dj-ink); background: rgba(0, 0, 0, 0.12); }
.cmp-chip-x svg { width: 11px; height: 11px; }

.cmp-tbl-sec { padding: 40px 0 clamp(56px, 7vw, 96px); }
.cmp-scroll { overflow-x: auto; -webkit-overflow-scrolling: touch; }
.cmp-table { width: 100%; min-width: 640px; border-collapse: separate; border-spacing: 0; font-size: 15px; color: var(--dj-ink); }
.cmp-table th, .cmp-table td { padding: 18px 20px; text-align: left; vertical-align: top; border-bottom: 1px solid var(--dj-line); }
.cmp-table tbody tr:last-child th, .cmp-table tbody tr:last-child td { border-bottom: 0; }
.cmp-param { position: sticky; left: 0; z-index: 1; width: 11rem; min-width: 9rem; background: #fff; font-size: 13px; font-weight: 500; color: var(--dj-muted); }
thead .cmp-param { vertical-align: bottom; }
.cmp-model { min-width: 200px; max-width: 260px; font-weight: 600; }
.cmp-img { display: block; aspect-ratio: 1 / 1; margin-bottom: 14px; }
.cmp-img:hover :deep(.esh-img) { transform: scale(1.04); }
.cmp-name { font-size: 16px; line-height: 1.3; color: var(--dj-ink); }
.cmp-name:hover { color: var(--dj-link); }
.cmp-strong { font-weight: 600; }
.cmp-specs { display: grid; gap: 6px; margin: 0; padding: 0; list-style: none; font-size: 13px; line-height: 1.45; color: var(--dj-ink); }
.cmp-specs span { color: var(--dj-muted); }
.cmp-empty { padding: 40px 24px; text-align: center; color: var(--dj-muted); background: var(--dj-soft); }

.cmp-req { max-width: 640px; }
.cmp-req-lede { margin-top: 12px; }
.cmp-form { display: grid; gap: 16px; margin-top: 36px; }
.cmp-form .cmp-input { background: #fff; }
.cmp-submit { width: 100%; margin-top: 8px; }
.cmp-ok { padding: 24px; text-align: center; font-size: 16px; color: var(--dj-ink); background: #fff; }

@media (max-width: 767px) {
  .cmp-param { width: 7.5rem; min-width: 7.5rem; }
  .cmp-table th, .cmp-table td { padding: 14px 12px; }
}
</style>
