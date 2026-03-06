<template>
  <div>
    <!-- Hero -->
    <section class="section-padding bg-white">
      <div class="container-custom">
        <h1 class="font-rounded text-5xl md:text-6xl mb-6 text-esp-black">
          Реализованные объекты
        </h1>
        <p class="text-xl text-esp-black max-w-3xl">
          Наследие и масштаб. География проектов ESP в Беларуси и СНГ.
        </p>
      </div>
    </section>

    <!-- Projects Grid -->
    <section class="section-padding bg-esp-gray">
      <div class="container-custom">
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div v-for="project in projects" :key="project.id" class="bg-white rounded-none overflow-hidden shadow-sm">
            <div class="h-64 bg-esp-black flex items-center justify-center">
              <span class="text-white">Project Image</span>
            </div>
            <div class="p-6">
              <h3 class="font-rounded text-xl mb-3 text-esp-black">{{ project.name }}</h3>
              <p class="text-esp-black mb-4">{{ project.location }}</p>
              <div class="flex items-center justify-between">
                <span class="text-esp-green font-medium">{{ project.result }}</span>
                <NuxtLink :to="`/projects/${project.slug}`" class="text-esp-blue font-medium hover:underline">
                  Кейс →
                </NuxtLink>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
const projects = [
  {
    id: 1,
    name: 'Модернизация очистных сооружений',
    location: 'Минск, Беларусь',
    result: 'Чистота 5м',
    slug: 'minsk-water'
  },
  {
    id: 2,
    name: 'Система очистки для АПК',
    location: 'Гродненская область',
    result: 'Экономия 40%',
    slug: 'apk-grodno'
  },
  {
    id: 3,
    name: 'Промышленные стоки',
    location: 'Россия, Москва',
    result: '0 сбоев',
    slug: 'moscow-industry'
  }
]
</script>