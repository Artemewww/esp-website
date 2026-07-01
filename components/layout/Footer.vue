<template>
  <footer class="relative bg-esp-black text-white pt-12 pb-8 overflow-hidden">
    
    <!-- 3D Point Cloud Background -->
    <div ref="container" class="absolute inset-0 w-full h-full z-0"></div> 
    
    <!-- Content Overlay -->
    <div class="relative z-10">
      <div class="max-w-[1600px] mx-auto px-6">
        
        <!-- Top Section: Logo + Main Links -->
        <div class="grid grid-cols-1 lg:grid-cols-5 gap-8 pb-8 border-b border-white/10">
          
          <!-- Column 1: Logo & Info -->
          <div class="lg:col-span-1">
            <NuxtLink to="/" class="inline-block mb-4">
              <svg width="100" height="51" viewBox="0 0 120 61" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M63.0562 1.29415C66.2988 4.75237 73.6844 12.9677 75.2426 17.0885C75.8406 18.671 76.4481 21.7646 73.9536 21.9386C71.7999 22.0887 71.3448 19.0047 70.6491 17.6391C70.1202 16.5999 69.1911 15.27 68.4787 14.3334C66.4465 11.6617 63.6947 9.12579 61.5838 6.45645L57.6694 11.5663C50.2599 29.0719 76.9818 26.4645 78.6018 42.3209C80.3458 59.4022 58.6129 65.9325 48.0395 54.1184L45.1972 50.5291C44.7088 50.5982 42.9624 52.8337 42.343 53.4081C29.5729 65.2152 9.53871 60.4938 2.45324 44.9854C-3.36714 32.2465 1.4526 16.8502 13.9082 10.3747C22.5375 5.88922 32.5868 7.24057 41.9785 7.40025C43.477 16.8335 41.5472 28.6072 34.2426 35.2805C29.4767 39.6339 23.2365 41.7799 16.8427 41.8132C15.5211 41.82 14.5739 40.6019 14.7912 39.2983C14.9634 38.2655 15.8243 37.491 16.8696 37.432C18.5252 37.3387 20.1784 37.2264 21.8084 36.8845C30.6538 35.0313 35.8414 28.031 37.5864 19.9074C38.5857 15.2555 34.4738 11.29 29.7183 11.4424C25.9921 11.5616 22.2635 11.7808 18.7184 13.0511C8.10447 16.8621 2.58904 27.8564 5.03108 38.8221C5.18393 39.5065 5.41556 40.1635 5.66802 40.813C5.93275 41.4941 7.17602 41.3764 7.25631 40.6501C7.83525 35.4378 10.1034 30.5424 13.7581 26.7887C17.1602 23.2923 22.0086 21.9219 26.1207 19.5124C27.4032 18.7596 28.5079 17.8111 29.7476 17.0235C29.954 16.8923 30.2207 16.9132 30.4096 17.0686C30.5299 17.1675 30.6074 17.3107 30.6115 17.4663C30.6595 19.2819 29.453 20.8557 28.3078 22.1793C24.341 26.7625 18.1013 26.8912 14.4323 32.8233C6.6178 45.4573 15.421 58.4989 30.0971 55.1932C35.9961 53.8657 39.7294 50.0858 43.2721 45.5169C43.988 44.5937 44.1633 43.2027 45.8366 43.2027C47.5099 43.2027 48.2491 46.0031 49.1831 47.967C51.3392 52.4977 57.2787 56.69 62.3891 55.1432C65.7079 54.1398 67.2041 50.1263 66.6585 46.9016C65.372 39.2988 49.8311 37.671 46.7267 27.7873C43.2459 16.7096 55.5085 8.13432 61.1097 0.233567L61.6005 0C61.8936 0 62.7441 0.960484 63.0562 1.29177V1.29415ZM52.204 18.6043C51.0557 18.9118 50.6221 21.7432 50.5458 22.7775C49.6453 34.7609 68.7503 34.3891 70.7325 45.679C71.1614 48.1243 70.6968 49.397 70.5443 51.6397C70.4609 52.8576 71.3448 51.8304 71.7093 51.3728C74.2967 48.1195 75.0948 42.8261 72.9435 39.1701C68.2262 31.1549 52.4018 30.2779 52.204 18.6019V18.6043Z" fill="#FFFFFF"/>
                <path d="M94.9361 58.0852C91.2242 62.0606 83.7123 60.0157 83.1286 54.2313C82.1184 44.2189 84.3722 32.7384 95.3435 29.7735C97.8427 29.0991 100.342 29.2873 102.727 28.8297C106.627 28.0838 107.632 22.8261 104.283 20.6406C102.477 19.4609 99.4533 19.8303 98.1453 21.6178C97.1113 23.0287 97.3067 25.872 96.468 26.6109C95.7485 27.2424 93.4161 27.3354 92.4035 27.6595C91.9652 20.7693 96.5443 13.9697 104.106 15.812C113.367 18.0714 112.831 31.6564 103.356 33.2723C101.54 33.5821 99.6129 33.2913 97.776 33.6393C93.0325 34.5378 89.0395 38.4274 87.9888 43.1369C87.4956 45.3534 87.2431 51.7527 87.6982 53.9382C88.1937 56.331 91.908 56.1237 92.3463 53.6975C93.3065 48.3564 89.8567 39.6048 97.3472 37.7363C101.4 36.7257 105.162 37.8674 109.128 35.7176C118.92 30.4123 117.21 14.9897 106.391 12.0868C103.556 11.3265 94.2595 11.3957 91.0836 11.6769C88.7417 11.8842 87.8673 13.1307 87.6457 15.383C87.6457 21.8854 87.6457 25.2918 87.6457 31.0605C85.0398 33.2998 83.3716 35.8695 83.3716 35.8695C83.3716 35.8695 83.3716 35.8695 83.1143 15.1327C83.4883 10.3684 86.6356 7.44647 91.3171 7.14617C94.7765 6.92452 99.763 6.93644 103.229 7.14617C124.14 8.41411 125.82 37.2453 106.443 41.3685C104.263 41.8332 98.3311 41.2088 97.29 42.6841C95.2172 45.6203 98.5527 54.2003 94.9313 58.078L94.9361 58.0852Z" fill="#FFFFFF"/>
              </svg>
            </NuxtLink>
            <p class="text-white/60 text-sm leading-relaxed mb-4">
              Архитекторы технологических экосистем очистки воды
            </p>
            <div class="flex items-center gap-3">
              <a href="#" class="w-8 h-8 bg-white/10 hover:bg-esp-blue rounded-lg flex items-center justify-center transition-colors">
                <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>
              </a>
              <a href="#" class="w-8 h-8 bg-white/10 hover:bg-esp-blue rounded-lg flex items-center justify-center transition-colors">
                <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/></svg>
              </a>
              <a href="#" class="w-8 h-8 bg-white/10 hover:bg-esp-blue rounded-lg flex items-center justify-center transition-colors">
                <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
              </a>
            </div>
          </div>

          <!-- Column 2: Company -->
          <div>
            <h4 class="font-semibold text-white text-sm mb-3 uppercase tracking-wider">Компания</h4>
            <ul class="space-y-2 text-sm">
              <li><NuxtLink to="/about" class="text-white/60 hover:text-white transition-colors">О компании</NuxtLink></li>
              <li><NuxtLink to="/team" class="text-white/60 hover:text-white transition-colors">Команда</NuxtLink></li>
              <li><NuxtLink to="/webinars" class="text-white/60 hover:text-white transition-colors">Вебинары и события</NuxtLink></li>
              <li><NuxtLink to="/technologies" class="text-white/60 hover:text-white transition-colors">Технологии</NuxtLink></li>
              <li><NuxtLink to="/equipment" class="text-white/60 hover:text-white transition-colors">Оборудование</NuxtLink></li>
              <li><NuxtLink to="/projects" class="text-white/60 hover:text-white transition-colors">Проекты (Кейсы)</NuxtLink></li>
            </ul>
          </div>

          <!-- Column 3: Services -->
          <div>
            <h4 class="font-semibold text-white text-sm mb-3 uppercase tracking-wider">Услуги</h4>
            <ul class="space-y-2 text-sm">
              <li><NuxtLink to="/technologies" class="text-white/60 hover:text-white transition-colors">3D-проектирование</NuxtLink></li>
              <li><NuxtLink to="/technologies" class="text-white/60 hover:text-white transition-colors">LiDAR-сканирование</NuxtLink></li>
              <li><NuxtLink to="/technologies" class="text-white/60 hover:text-white transition-colors">Цифровые двойники</NuxtLink></li>
              <li><NuxtLink to="/contacts" class="text-white/60 hover:text-white transition-colors">Аудит</NuxtLink></li>
            </ul>
          </div>

          <!-- Column 4: Support -->
          <div>
            <h4 class="font-semibold text-white text-sm mb-3 uppercase tracking-wider">Поддержка</h4>
            <ul class="space-y-2 text-sm">
              <li><NuxtLink to="/contacts" class="text-white/60 hover:text-white transition-colors">Контакты</NuxtLink></li>
              <li><a href="tel:+375172152276" class="text-white/60 hover:text-white transition-colors">+375 (17) 215-22-76</a></li>
              <li><a href="mailto:info@ecoservisproekt.com" class="text-white/60 hover:text-white transition-colors">info@ecoservisproekt.com</a></li>
            </ul>
          </div>

          <!-- Column 5: Contacts -->
          <div>
            <h4 class="font-semibold text-white text-sm mb-3 uppercase tracking-wider">Контакты</h4>
            <ul class="space-y-2 text-sm text-white/60">
              <li>220076, г. Минск, ул. Петра Мстиславца, 20, пом. 236</li>
              <li>Пн-Пт: 9:00 — 18:00</li>
            </ul>
          </div>
        </div>

        <!-- Bottom Section: Copyright & Legal -->
        <div class="pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-white/40">
          <p>© 2026 ESP (EcoServiceProject). Все права защищены.</p>
          <div class="flex items-center gap-6">
            <NuxtLink to="/privacy" class="hover:text-white/60 transition-colors">Конфиденциальность</NuxtLink>
            <NuxtLink to="/terms" class="hover:text-white/60 transition-colors">Условия</NuxtLink>
          </div>
          <p class="hidden md:block">Сделано в Беларуси 🇧🇾</p>
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import * as THREE from 'three'

const container = ref(null)
let scene, camera, renderer, particles, animationId

const init = async () => {
  if (!container.value) return
  
  await new Promise(resolve => setTimeout(resolve, 100))
  
  const width = container.value.offsetWidth
  const height = container.value.offsetHeight
  
  scene = new THREE.Scene()
  scene.fog = new THREE.FogExp2(0x1A1A1A, 0.02)
  
  camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000)
  camera.position.set(0, 50, 0) // Top view
  camera.lookAt(0, 0, 0)
  
  renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: "high-performance" })
  renderer.setSize(width, height)
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1)) // Lower for performance
  renderer.setClearColor(0x1A1A1A, 0) // Transparent background
  container.value.appendChild(renderer.domElement)
  
  // Create particles (fewer for footer performance)
  const geometry = new THREE.BufferGeometry()
  const vertices = [], colors = []
  const cB = new THREE.Color(0x002366), cG = new THREE.Color(0x006039), cL = new THREE.Color(0x00D4FF)
  
  for (let i = 0; i < 15000; i++) { // Fewer particles for footer
    const layer = Math.floor(Math.random() * 4)
    const t = Math.random() * Math.PI * 2
    const r = 15 + layer * 8 + Math.random() * 5
    const x = Math.cos(t) * r + (Math.random() - 0.5) * 12
    const z = Math.sin(t) * r + (Math.random() - 0.5) * 12
    const y = layer * 12 + (Math.random() - 0.5) * 8 + Math.sin(x * 0.15) * 3
    vertices.push(x, y, z)
    
    let col = layer === 0 ? cB.clone() : layer === 1 ? cB.clone().lerp(cL, 0.4) : layer === 2 ? cL.clone() : cG.clone()
    col.offsetHSL(0, 0, (Math.random() - 0.5) * 0.1)
    colors.push(col.r, col.g, col.b)
  }
  
  geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3))
  geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3))
  
  const material = new THREE.ShaderMaterial({
    uniforms: { time: { value: 0 }, pointSize: { value: 0.3 } }, // Smaller points
    vertexShader: `
      uniform float time, pointSize;
      attribute vec3 color;
      varying vec3 vColor;
      varying float vDistance;
      void main() {
        vColor = color;
        vec4 mv = modelViewMatrix * vec4(position, 1.0);
        vDistance = length(mv.xyz);
        vec3 pos = position;
        pos.y += sin(pos.x * 0.1 + time * 0.5) * 0.5;
        pos.z += cos(pos.y * 0.08 + time * 0.3) * 0.3;
        mv = modelViewMatrix * vec4(pos, 1.0);
        gl_PointSize = pointSize * (300.0 / vDistance);
        gl_Position = projectionMatrix * mv;
      }
    `,
    fragmentShader: `
      varying vec3 vColor;
      varying float vDistance;
      void main() {
        vec2 uv = gl_PointCoord - 0.5;
        float d = length(uv);
        if (d > 0.5) discard;
        float alpha = smoothstep(0.5, 0.1, d);
        alpha *= smoothstep(100.0, 30.0, vDistance);
        vec3 col = vColor * (1.0 + 0.3 * sin(gl_FragCoord.x * 0.01));
        gl_FragColor = vec4(col, alpha * 0.6); // More transparent
      }
    `,
    transparent: true, blending: THREE.AdditiveBlending, depthWrite: false
  })
  
  particles = new THREE.Points(geometry, material)
  scene.add(particles)
  
  scene.add(new THREE.AmbientLight(0xffffff, 0.4))
  const pl = new THREE.PointLight(0x00D4FF, 0.8, 100); pl.position.set(30, 30, 30); scene.add(pl)
  
  window.addEventListener('resize', onResize)
  
  animate()
}

const onResize = () => {
  if (!camera || !renderer) return
  camera.aspect = container.value.offsetWidth / container.value.offsetHeight
  camera.updateProjectionMatrix()
  renderer.setSize(container.value.offsetWidth, container.value.offsetHeight)
}

const animate = () => {
  animationId = requestAnimationFrame(animate)
  if (particles?.material?.uniforms?.time) particles.material.uniforms.time.value = performance.now() * 0.001
  if (particles) { particles.rotation.y += 0.001 } // Slower rotation for footer
  if (renderer && scene && camera) renderer.render(scene, camera)
}

const cleanup = () => {
  if (animationId) cancelAnimationFrame(animationId)
  if (particles) { particles.geometry?.dispose(); particles.material?.dispose() }
  if (renderer) {
    renderer.dispose()
    if (renderer.domElement?.parentNode) renderer.domElement.parentNode.removeChild(renderer.domElement)
  }
  scene = null; camera = null
  window.removeEventListener('resize', onResize)
}

onMounted(() => {
  init()
})

onUnmounted(() => {
  cleanup()
})
</script>

<style scoped>
/* Hover transitions */
a {
  transition: color 0.2s ease;
}

/* Social icon hover */
a[class*="w-8"] {
  transition: all 0.3s ease;
}

a[class*="w-8"]:hover {
  transform: translateY(-2px);
}
</style>