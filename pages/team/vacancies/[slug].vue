<template>
  <div v-if="vacancy" class="ap">
    <section class="ap-sec ap-sec--first">
      <div class="ap-wrap">
        <div class="vc-crumbs">
          <Breadcrumb :items="[{ label: 'Команда', to: '/team' }, { label: vacancy.title }]" />
        </div>
        <span class="ap-eyebrow">Открытая вакансия</span>
        <h1 class="ap-title">{{ vacancy.title }}</h1>
        <p v-if="vacancy.mission" class="ap-lede">{{ vacancy.mission }}</p>

        <dl class="vc-facts">
          <div><dt>Локация</dt><dd>{{ vacancy.location }}</dd></div>
          <div><dt>Уровень</dt><dd>{{ vacancy.level }}</dd></div>
          <div><dt>Зарплата</dt><dd class="vc-salary">{{ vacancy.salary }}</dd></div>
          <div><dt>Занятость</dt><dd>{{ vacancy.type }}</dd></div>
        </dl>

        <div class="ap-actions">
          <a href="#apply" class="ap-btn">Откликнуться</a>
          <NuxtLink to="/team" class="ap-link">Все вакансии ›</NuxtLink>
        </div>
      </div>
    </section>

    <section class="ap-sec ap-sec--white">
      <div class="ap-wrap">
        <div class="ap-grid ap-grid--2 vc-cols">
          <div class="ap-card">
            <h2 class="ap-h3">Ключевые задачи</h2>
            <ol class="vc-tasks">
              <li v-for="(t, i) in vacancy.tasks" :key="i"><span>{{ i + 1 }}</span><p>{{ t }}</p></li>
            </ol>
          </div>
          <div class="ap-card">
            <h2 class="ap-h3">Требования</h2>
            <div class="vc-reqs">
              <div v-for="(r, i) in vacancy.requirements" :key="i">
                <b>{{ r.title }}</b>
                <p class="ap-small">{{ r.desc }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section id="apply" class="ap-sec">
      <div class="ap-wrap ap-wrap--narrow">
        <div class="ap-center">
          <h2 class="ap-h2">Отклик на вакансию</h2>
          <p class="ap-lede">Прикрепите резюме или ссылку на портфолио — отдел кадров ответит в течение 48 часов.</p>
        </div>
        <div v-if="sent" class="ap-note-ok vc-form">Отклик отправлен. Мы свяжемся с вами в ближайшее время.</div>
        <form v-else class="ap-form vc-form" @submit.prevent="apply">
          <div class="ap-form-row">
            <label><span class="ap-label">ФИО</span><input v-model="applyForm.name" name="name" required class="ap-input" autocomplete="name" /></label>
            <label><span class="ap-label">E-mail</span><input v-model="applyForm.email" name="email" required type="email" class="ap-input" autocomplete="email" /></label>
          </div>
          <label><span class="ap-label">Ссылка на портфолио или профессиональный профиль</span><input v-model="applyForm.link" name="link" class="ap-input" /></label>
          <label><span class="ap-label">Сопроводительное письмо</span><textarea v-model="applyForm.message" name="message" rows="3" class="ap-input"></textarea></label>
          <LeadConsent v-model="applyForm.consent" />
          <p v-if="applyLead.error.value" role="alert" style="font-size:13px;color:#b42318;margin:0">{{ applyLead.error.value }}</p>
          <button type="submit" class="ap-btn ap-btn--block" :disabled="applyLead.sending.value">{{ applyLead.sending.value ? 'Отправка…' : 'Отправить резюме' }}</button>
        </form>
      </div>
    </section>
  </div>
  <div v-else class="ap">
    <section class="ap-sec ap-sec--first ap-center">
      <div class="ap-wrap">
        <h1 class="ap-h2">Вакансия не найдена</h1>
        <div class="ap-actions"><NuxtLink to="/team" class="ap-btn">К списку вакансий</NuxtLink></div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import { vacanciesList } from '~/composables/useVacancies'

const route = useRoute()
const vacancies = useEditableList('vacancies', vacanciesList)
const vacancy = computed(() => vacancies.value.find(v => v.slug === route.params.slug))
const sent = ref(false)
const applyForm = ref({ name: '', email: '', link: '', message: '', consent: false })
const applyLead = useLead('career')
const apply = async (e) => {
  sent.value = await applyLead.send({ ...applyForm.value, position: vacancy.value?.title || '' }, [], e)
}

useHead(() => ({
  title: vacancy.value ? `${vacancy.value.title} | Карьера в ESP` : 'Вакансия не найдена | ESP',
  meta: [{ name: 'description', content: vacancy.value?.mission || '' }],
  link: [{ rel: 'canonical', href: vacancy.value ? `https://ecoservisproekt.by/team/vacancies/${vacancy.value.slug}` : '' }]
}))
</script>

<style scoped>
.vc-crumbs { margin-bottom: 1.5rem; font-size: 13px; }
.vc-facts { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 0.75rem; margin-top: 2rem; }
.vc-facts > div { padding: 1rem 1.15rem; border-radius: 14px; background: #fff; }
.vc-facts dt { font-size: 13px; color: var(--ap-muted); }
.vc-facts dd { margin-top: 0.2rem; font-size: 15px; font-weight: 600; line-height: 1.35; color: var(--ap-ink); }
.vc-facts .vc-salary { color: var(--ap-blue); }
.vc-cols { margin-top: 0; }
.vc-tasks { display: grid; gap: 0.85rem; margin-top: 1rem; }
.vc-tasks li { display: flex; gap: 0.75rem; font-size: 15px; line-height: 1.5; color: var(--ap-ink); }
.vc-tasks span { flex: 0 0 auto; display: inline-flex; align-items: center; justify-content: center; width: 24px; height: 24px; border-radius: 50%; background: var(--ap-blue); color: #fff; font-size: 12px; font-weight: 600; }
.vc-reqs { display: grid; gap: 1rem; margin-top: 1rem; }
.vc-reqs > div + div { padding-top: 1rem; border-top: 1px solid var(--ap-line); }
.vc-reqs b { font-size: 15px; font-weight: 600; }
.vc-reqs p { margin-top: 0.25rem; }
.vc-form { margin-top: 2rem; }
@media (max-width: 767px) {
  .vc-facts { grid-template-columns: 1fr 1fr; }
}
</style>
