<template>
  <div v-if="activeStage" class="bg-white">
    <section class="py-6 border-b border-esp-gray">
      <div class="container-custom">
        <Breadcrumb :items="[{ label: 'Услуги', to: '/services' }, { label: 'Процесс «под ключ»', to: '/services/process/idea-audit' }, { label: activeStage.title }]" />
      </div>
    </section>

    <section class="section-padding bg-white">
      <div class="container-custom">
        <span class="inline-block px-4 py-1.5 rounded-full bg-esp-blue/10 text-esp-blue text-sm font-medium mb-4 font-inter">
          Комплексный подход «под ключ»
        </span>
        <h1 class="font-rounded text-3xl md:text-5xl mb-4 text-esp-black">7 шагов от идеи до кристальной воды</h1>
        <p class="text-lg text-esp-black/70 max-w-2xl mb-12">
          Кликните на этап слева — справа обновится фото и подробности. Каждый этап имеет собственную страницу, которую можно сохранить или отправить коллегам.
        </p>

        <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <!-- Left: stage list -->
          <div class="lg:col-span-5 space-y-2">
            <NuxtLink
              v-for="stage in turnkeyStagesList"
              :key="stage.slug"
              :to="`/services/process/${stage.slug}`"
              class="flex items-center gap-4 p-4 border transition-all"
              :class="stage.slug === activeStage.slug
                ? 'bg-esp-blue text-white border-esp-blue'
                : 'bg-esp-gray/50 border-esp-gray hover:border-esp-blue text-esp-black'"
            >
              <span
                class="font-rounded font-bold text-lg w-9 h-9 flex-shrink-0 flex items-center justify-center"
                :class="stage.slug === activeStage.slug ? 'bg-white/15 text-white' : 'bg-white text-esp-blue'"
              >{{ stage.num }}</span>
              <div class="min-w-0">
                <h3 class="font-rounded font-semibold leading-tight">{{ stage.title }}</h3>
                <p class="text-sm truncate" :class="stage.slug === activeStage.slug ? 'text-white/70' : 'text-esp-black/50'">{{ stage.desc }}</p>
              </div>
            </NuxtLink>
          </div>

          <!-- Right: active stage image + details, changes with left click -->
          <div class="lg:col-span-7 lg:sticky lg:top-24">
            <Transition name="fade-swap" mode="out-in">
              <div :key="activeStage.slug">
                <div class="aspect-video bg-esp-gray overflow-hidden mb-6">
                  <img :src="activeStage.image" :alt="activeStage.title" class="w-full h-full object-cover" />
                </div>
                <span class="text-esp-blue text-sm font-semibold font-mono">Этап {{ activeStage.num }} / 07</span>
                <h2 class="font-rounded text-2xl md:text-3xl text-esp-black mt-1 mb-3">{{ activeStage.title }}</h2>
                <p class="text-esp-black/70 mb-6 leading-relaxed">{{ activeStage.desc }}</p>
                <ul class="space-y-3 mb-8">
                  <li v-for="d in activeStage.details" :key="d" class="flex gap-3 text-sm text-esp-black/80">
                    <span class="text-esp-green font-bold flex-shrink-0">✓</span>
                    <span>{{ d }}</span>
                  </li>
                </ul>
                <div class="flex flex-wrap gap-3">
                  <NuxtLink v-if="prevStage" :to="`/services/process/${prevStage.slug}`" class="px-5 py-3 border border-esp-gray text-esp-black text-sm font-medium hover:border-esp-blue transition">
                    ← {{ prevStage.title }}
                  </NuxtLink>
                  <NuxtLink v-if="nextStage" :to="`/services/process/${nextStage.slug}`" class="px-5 py-3 bg-esp-blue text-white text-sm font-medium hover:bg-esp-blue/90 transition">
                    {{ nextStage.title }} →
                  </NuxtLink>
                </div>
              </div>
            </Transition>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA -->
    <section class="section-padding text-white text-center" style="background: linear-gradient(135deg, #002366 0%, #000f33 100%)">
      <div class="container-custom max-w-3xl">
        <h2 class="font-rounded text-2xl md:text-3xl mb-4">Обсудите ваш проект с инженером ESP</h2>
        <p class="text-white/90 mb-8">Бесплатная консультация и предварительная оценка объекта.</p>
        <NuxtLink to="/contacts#contact-form" class="border-2 border-white text-white px-8 py-4 font-medium hover:bg-white hover:text-esp-blue transition inline-block">
          Запросить консультацию
        </NuxtLink>
      </div>
    </section>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { turnkeyStagesList } from '~/composables/useTurnkeyProcess'

const route = useRoute()
const activeStage = computed(() => turnkeyStagesList.find(s => s.slug === route.params.slug) || turnkeyStagesList[0])
const activeIndex = computed(() => turnkeyStagesList.findIndex(s => s.slug === activeStage.value.slug))
const prevStage = computed(() => activeIndex.value > 0 ? turnkeyStagesList[activeIndex.value - 1] : null)
const nextStage = computed(() => activeIndex.value < turnkeyStagesList.length - 1 ? turnkeyStagesList[activeIndex.value + 1] : null)

useHead(() => ({
  title: `${activeStage.value.title} | Процесс «под ключ» ESP`,
  meta: [{ name: 'description', content: activeStage.value.desc }]
}))
</script>

<style scoped>
.fade-swap-enter-active,
.fade-swap-leave-active {
  transition: opacity 0.25s ease;
}
.fade-swap-enter-from,
.fade-swap-leave-to {
  opacity: 0;
}
</style>
