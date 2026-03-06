<template>
  <div>
  
    <!-- Hero Section -->
    <section class="relative h-screen flex items-center justify-center overflow-hidden">
      
      <!-- Video Background -->
      <div class="absolute inset-0 z-0">
        <video 
          autoplay 
          muted 
          loop 
          playsinline
          class="w-full h-full object-cover"
        >
          <source src="/videos/hero-water.mp4" type="video/mp4" />
        </video>
        <div class="absolute inset-0 bg-black bg-opacity-40"></div>
      </div>
      
      <!-- Content -->
      <div class="relative z-10 text-center text-white px-6">
        <h1 class="font-rounded text-4xl md:text-6xl lg:text-7xl mb-6 leading-tight">
          Архитекторы технологических<br />экосистем очистки воды
        </h1>
        <p class="text-lg md:text-xl mb-8 max-w-3xl mx-auto font-inter">
          18 лет опыта. 30 000 элементов под контролем. <br>Кристальная чистота 5 метров.
        </p>
        <div class="flex flex-col md:flex-row gap-4 justify-center">
          <NuxtLink to="/contacts" class="bg-esp-green text-white px-8 py-4 font-medium hover:bg-opacity-90 transition">
            Заказать технический аудит
          </NuxtLink>
          <NuxtLink to="/technologies" class="border-2 border-white text-white px-8 py-4 font-medium hover:bg-white hover:text-esp-black transition">
            Изучить технологии
          </NuxtLink>
        </div>
      </div>

      <!-- Scroll Indicator -->
      <div class="absolute bottom-10 left-1/2 transform -translate-x-1/2 animate-bounce">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2">
          <path d="M12 5v14M19 12l-7 7-7-7" />
        </svg>
      </div>
    </section>

    <!-- Trust Numbers -->
    <section class="py-20 px-6 bg-white">
      <div class="max-w-7xl mx-auto">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          <div>
            <div class="text-5xl md:text-6xl font-rounded font-bold text-esp-blue mb-4">18</div>
            <p class="text-lg text-esp-black">лет на рынке</p>
          </div>
          <div>
            <div class="text-5xl md:text-6xl font-rounded font-bold text-esp-blue mb-4">30 000</div>
            <p class="text-lg text-esp-black">элементов под контролем</p>
          </div>
          <div>
            <div class="text-5xl md:text-6xl font-rounded font-bold text-esp-green mb-4">5м</div>
            <p class="text-lg text-esp-black">кристальная чистота воды</p>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA Section -->
    <section class="py-20 px-6 bg-esp-black text-white text-center">
      <div class="max-w-4xl mx-auto">
        <h2 class="font-rounded text-3xl md:text-4xl mb-6">Готовы обсудить инженерную задачу?</h2>
        <p class="text-lg mb-8 text-gray-400">
          Главный инженер ESP проанализирует вашу систему и предложит решения
        </p>
        <NuxtLink to="/contacts" class="bg-esp-green text-white px-8 py-4 font-medium hover:bg-opacity-90 transition">
          Заказать технический аудит объекта
        </NuxtLink>
      </div>
    </section>
  </div>
</template>

<script setup>
// Простой компонент без сложных импортов для стабильности
</script>

<style scoped>
.font-rounded {
  font-family: 'SF Pro Rounded', system-ui, sans-serif;
}
.font-inter {
  font-family: 'Inter', system-ui, sans-serif;
}
</style>