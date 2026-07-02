<template>
  <div class="bg-white">
    <section class="py-6 border-b border-esp-gray">
      <div class="container-custom">
        <Breadcrumb :items="[{ label: 'О компании', to: '/about' }, { label: 'Новости' }]" />
      </div>
    </section>

    <section class="section-padding bg-white">
      <div class="container-custom">
        <span class="inline-block px-4 py-1.5 rounded-full bg-esp-blue/10 text-esp-blue text-sm font-medium mb-4 font-inter">
          Хроника компании
        </span>
        <h1 class="font-rounded text-4xl md:text-5xl mb-6 text-esp-black">Новости</h1>
        <p class="text-xl text-esp-black/70 max-w-3xl mb-16">
          Ключевые события в истории ESP: запуски объектов, участие в отраслевых семинарах и развитие компании с 2016 года.
        </p>

        <div class="max-w-3xl">
          <div v-for="n in newsList" :key="n.date" class="flex gap-6 py-8 border-b border-esp-gray">
            <span class="font-mono text-esp-blue text-sm flex-shrink-0 w-32 pt-1">{{ n.dateLabel }}</span>
            <div>
              <h3 class="font-rounded text-lg text-esp-black mb-2">{{ n.title }}</h3>
              <p class="text-esp-black/60 leading-relaxed text-sm">{{ n.text }}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { newsList } from '~/composables/useNews'

useHead({
  title: 'Новости | ESP',
  meta: [
    { name: 'description', content: 'Хроника событий ЭкоСервисПроект: запуски очистных сооружений, участие в отраслевых семинарах и развитие компании.' }
  ]
})
</script>
