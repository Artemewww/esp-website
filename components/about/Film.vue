<template>
  <!-- Фильм о компании в подаче apple.com: крупный кадр-постер, круглая кнопка ▶,
       по клику ролик играет прямо в кадре со штатными элементами управления. -->
  <section :id="id" class="af">
    <div class="dj-wrap af-head">
      <span class="dj-eyebrow af-eyebrow dj-reveal">{{ eyebrow }}</span>
      <h2 class="af-h dj-reveal">{{ title }}</h2>
      <p v-if="lede" class="dj-lede af-lede dj-reveal">{{ lede }}</p>
    </div>
    <div class="af-frame dj-reveal" :class="{ 'is-on': playing }">
      <video
        ref="video"
        :poster="poster"
        :controls="started"
        playsinline
        preload="none"
        @play="playing = true"
        @pause="playing = false"
        @ended="playing = false"
      >
        <source :src="src" type="video/mp4" />
      </video>
      <button v-if="!started" type="button" class="af-play" :aria-label="`Смотреть: ${title}`" @click="start">
        <span class="af-play__btn"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5.5v13l11-6.5z" /></svg></span>
        <span class="af-play__txt">Смотреть фильм<small v-if="duration"> · {{ duration }}</small></span>
      </button>
    </div>
  </section>
</template>

<script setup>
import { ref } from 'vue'

defineProps({
  id: { type: String, default: 'film' },
  src: { type: String, required: true },
  poster: { type: String, default: '' },
  eyebrow: { type: String, default: 'Фильм о компании' },
  title: { type: String, required: true },
  lede: { type: String, default: '' },
  duration: { type: String, default: '' }
})

const video = ref(null)
const started = ref(false)
const playing = ref(false)
const start = () => {
  started.value = true
  video.value?.play().catch(() => {})
}
</script>

<style scoped>
.af { padding: clamp(80px, 11vw, 160px) 0 clamp(48px, 6vw, 88px); background: #fff; }
.af-head { text-align: center; }
.af-eyebrow { color: var(--dj-blue); }
.af-h { margin: 10px auto 0; max-width: 18ch; font-size: clamp(36px, 5.6vw, 80px); line-height: 1.05; font-weight: 600; letter-spacing: -0.015em; color: var(--dj-ink); }
.af-lede { margin: 20px auto 0; max-width: 52ch; font-size: clamp(17px, 1.5vw, 21px); }
.af-frame { position: relative; width: min(1200px, calc(100% - 48px)); margin: clamp(40px, 5vw, 64px) auto 0; aspect-ratio: 16 / 9; border-radius: 28px; overflow: hidden; background: #0b0d10; box-shadow: 0 40px 80px -48px rgba(0, 35, 102, 0.55); }
.af-frame video { width: 100%; height: 100%; object-fit: cover; display: block; }
.af-frame.is-on video { object-fit: contain; }
.af-play { position: absolute; inset: 0; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 16px; color: #fff; background: linear-gradient(180deg, rgba(0, 0, 0, 0.05) 0%, rgba(0, 10, 30, 0.35) 100%); cursor: pointer; }
.af-play__btn { display: grid; place-items: center; width: clamp(64px, 7vw, 88px); height: clamp(64px, 7vw, 88px); border-radius: 50%; background: rgba(255, 255, 255, 0.86); color: #111; backdrop-filter: blur(14px); -webkit-backdrop-filter: blur(14px); transition: transform 0.4s var(--dj-ease); }
.af-play__btn svg { width: 40%; height: 40%; fill: currentColor; margin-left: 6%; }
.af-play:hover .af-play__btn, .af-play:focus-visible .af-play__btn { transform: scale(1.08); }
.af-play__txt { font-size: 17px; font-weight: 600; letter-spacing: -0.01em; text-shadow: 0 1px 12px rgba(0, 0, 0, 0.35); }
.af-play__txt small { font-size: inherit; font-weight: 400; opacity: 0.85; }
@media (max-width: 767px) {
  .af-frame { width: calc(100% - 32px); border-radius: 20px; }
  .af-h { overflow-wrap: break-word; }
}
</style>
