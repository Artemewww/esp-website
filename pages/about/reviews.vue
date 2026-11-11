<template>
  <div class="rv">
    <div class="dj-wrap rv-crumb"><Breadcrumb :items="[{ label: 'О компании', to: '/about' }, { label: 'Отзывы клиентов' }]" /></div>
    <DjPageHero
      eyebrow="Заказчики"
      title="Отзывы клиентов"
      :lede="`${objectsCount} объектов по всей Беларуси и более 600 организаций-заказчиков — от муниципальных водоканалов и промышленных предприятий до монастырей и санаториев. Письмо открывается в полном размере по нажатию.`"
    />

    <div class="dj-wrap"><AboutTrustTabs /></div>

    <section class="rv-sec">
      <div class="dj-wrap">
        <div class="rv-sum">
          <h2 class="rv-h">Благодарственные письма</h2>
          <span class="rv-num">{{ letters.length }} писем</span>
        </div>
        <div class="rv-grid">
          <button v-for="(r, i) in letters" :key="r.id" type="button" class="rv-doc" @click="active = r">
            <span class="rv-thumb"><img :src="r.img" :alt="`Благодарственное письмо заказчика ESP, № ${i + 1}`" loading="lazy" /></span>
            <span class="dj-more rv-open">Открыть</span>
          </button>
        </div>
      </div>
    </section>

    <section class="rv-sec rv-sec--soft">
      <div class="dj-wrap">
        <div class="rv-sum">
          <h2 class="rv-h">С нами работают</h2>
          <span class="rv-num">часть заказчиков</span>
        </div>
        <div class="rv-logos">
          <span v-for="(l, i) in logos" :key="i" class="rv-logo"><img :src="l.src" :alt="l.name" :width="l.w" :height="l.h" loading="lazy" /></span>
        </div>
        <ul class="rv-orgs">
          <li v-for="(org, i) in clientOrganizationsList" :key="i">{{ org }}</li>
        </ul>
      </div>
    </section>

    <section class="rv-sec">
      <div class="dj-wrap rv-form-wrap">
        <h2 class="rv-h">Оставить отзыв</h2>
        <p class="rv-lede">Работали с ESP? Поделитесь опытом.</p>
        <div v-if="sent" class="ap-note-ok rv-form">Спасибо. Ваш отзыв отправлен на модерацию.</div>
        <form v-else class="ap-form rv-form" @submit.prevent="submitReview">
          <div class="ap-form-row">
            <input v-model="rf.name" required placeholder="Ваше имя" aria-label="Ваше имя" autocomplete="name" class="ap-input" />
            <input v-model="rf.company" required placeholder="Организация" aria-label="Организация" autocomplete="organization" class="ap-input" />
          </div>
          <input v-model="rf.email" required type="email" placeholder="E-mail" aria-label="E-mail" autocomplete="email" class="ap-input" />
          <textarea v-model="rf.message" required rows="4" placeholder="Ваш отзыв о работе с ESP" aria-label="Ваш отзыв" class="ap-input"></textarea>
          <LeadConsent v-model="rf.consent" />
          <p v-if="error" class="rv-err" role="alert">{{ error }}</p>
          <button type="submit" class="ap-btn ap-btn--block" :disabled="sending">{{ sending ? 'Отправляем…' : 'Отправить отзыв' }}</button>
        </form>
      </div>
    </section>

    <AppleCta title="Обсудим ваш объект" lede="Опишите объект — инженер ESP подготовит решение и оценку в течение 48 часов." />

    <div v-if="active" class="rv-lb" role="dialog" aria-modal="true" @click.self="active = null">
      <div class="rv-lb-in">
        <div class="rv-lb-bar">
          <span>Благодарственное письмо</span>
          <button type="button" class="rv-lb-x" @click="active = null">Закрыть</button>
        </div>
        <img :src="active.full" alt="Благодарственное письмо заказчика ESP" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { clientOrganizationsList } from '~/composables/useReviews'
import { reviewLetters, clientLogos, objectsCount } from '~/composables/useTrust'

const letters = reviewLetters
const logos = clientLogos
const rf = ref({ name: '', company: '', email: '', message: '', consent: false })
const { send, sending, sent, error } = useLead('contact')
const submitReview = (e) => send({ ...rf.value, topic: 'Отзыв о работе ESP' }, [], e)
const active = ref(null)
const onKey = (e) => { if (e.key === 'Escape') active.value = null }
onMounted(() => window.addEventListener('keydown', onKey))
onBeforeUnmount(() => window.removeEventListener('keydown', onKey))

useHead({
  title: 'Отзывы клиентов | ESP',
  meta: [
    { name: 'description', content: 'Благодарственные письма заказчиков ЭкоСервисПроект: водоканалы, агрохолдинги, промышленные предприятия, учреждения. 240 объектов по всей Беларуси.' }
  ]
})
</script>

<style scoped>
.rv-err { margin: 0; font-size: 14px; color: #c62828; }
.rv-crumb { padding-top: 20px; }
.rv-sec { padding: clamp(40px, 6vw, 72px) 0; }
.rv-sec--soft { background: #EDEDED; }
.rv-sum { display: flex; align-items: flex-end; justify-content: space-between; gap: 16px; padding-bottom: 20px; border-bottom: 1px solid #D6D6D6; }
.rv-h { font-size: clamp(24px, 2.4vw, 32px); line-height: 1.125; font-weight: 600; letter-spacing: 0.004em; color: var(--dj-ink); }
.rv-num { flex-shrink: 0; font-size: 14px; color: #5E5E5E; }
.rv-lede { margin-top: 8px; font-size: 17px; line-height: 1.47; color: #5E5E5E; }
.rv-grid { display: grid; grid-template-columns: repeat(5, minmax(0, 1fr)); gap: 24px 16px; margin-top: 24px; }
.rv-doc { display: flex; flex-direction: column; align-items: flex-start; gap: 10px; text-align: left; }
.rv-thumb { display: block; width: 100%; aspect-ratio: 3 / 4; padding: 10%; border-radius: var(--r-md); background: #EDEDED; box-shadow: inset 0 0 0 .5px rgba(0, 0, 0, .14); overflow: hidden; }
.rv-thumb img { width: 100%; height: 100%; object-fit: cover; object-position: top; background: #fff; box-shadow: 0 0 0 .5px rgba(0, 0, 0, .12), 0 6px 16px rgba(0, 0, 0, .08); transition: transform .8s var(--dj-ease); }
.rv-doc:hover .rv-thumb img { transform: scale(1.04); }
.rv-open { font-size: 14px; color: #002366; }
.rv-logos { display: grid; grid-template-columns: repeat(auto-fill, minmax(150px, 1fr)); gap: 12px; margin-top: 24px; }
.rv-logo { display: grid; place-items: center; height: 88px; padding: 16px 20px; border-radius: var(--r-sm); background: #fff; }
.rv-logo img { max-width: 100%; max-height: 100%; object-fit: contain; }
.rv-orgs { columns: 3 260px; column-gap: 32px; margin: 32px 0 0; padding: 0; list-style: none; }
.rv-orgs li { break-inside: avoid; padding: 10px 0; border-bottom: 1px solid #EDEDED; font-size: 15px; line-height: 1.4; color: var(--dj-ink); }
.rv-form-wrap { max-width: 680px; }
.rv-form { margin-top: 24px; }
.rv-lb { position: fixed; inset: 0; z-index: 1000; display: flex; align-items: center; justify-content: center; padding: 16px; background: rgba(11, 13, 16, .88); backdrop-filter: blur(8px); font-family: var(--dj-font); }
.rv-lb-in { width: 100%; max-width: 44rem; }
.rv-lb-bar { display: flex; align-items: center; gap: 20px; margin-bottom: 12px; font-size: 14px; color: rgba(255, 255, 255, .8); }
.rv-lb-bar > span { margin-right: auto; }
.rv-lb-x { height: 36px; padding: 0 16px; border-radius: var(--r-pill); background: rgba(255, 255, 255, .16); color: #fff; font-size: 14px; }
.rv-lb-in img { display: block; width: 100%; max-height: 82vh; object-fit: contain; border-radius: var(--r-sm); background: #fff; }
@media (max-width: 1023px) { .rv-grid { grid-template-columns: repeat(3, minmax(0, 1fr)); } }
@media (max-width: 767px) {
  .rv-sum { flex-direction: column; align-items: flex-start; }
  .rv-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
  .rv-logos { grid-template-columns: repeat(2, minmax(0, 1fr)); }
}
</style>
