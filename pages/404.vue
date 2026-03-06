<template>
  <div class="relative h-screen w-full bg-gradient-to-br from-gray-900 via-esp-black to-gray-900 overflow-hidden">
    
    <!-- 3D Point Cloud Background (Auto-rotating, top view) -->
    <div ref="container" class="absolute inset-0 w-full h-full"></div>
    
    <!-- Content Overlay -->
    <div class="absolute inset-0 flex items-center justify-center z-10">
      <div class="text-center max-w-3xl px-6">
        
        <!-- 404 Number with Glow Effect -->
        <div class="mb-8 relative">
          <h1 class="font-rounded text-[100px] md:text-[160px] lg:text-[220px] font-bold text-white/5 leading-none select-none">
            404
          </h1>
          <div class="absolute inset-0 flex items-center justify-center">
            <div class="w-32 h-32 md:w-48 md:h-48 lg:w-64 lg:h-64 rounded-full bg-esp-lidar/10 blur-3xl animate-pulse"></div>
          </div>
        </div>
        
        <!-- Title -->
        <h2 class="font-rounded text-3xl md:text-5xl lg:text-6xl text-white mb-6 leading-tight">
          Потеря видимости
        </h2>
        
        <!-- Description -->
        <p class="text-lg md:text-xl text-white/70 font-inter leading-relaxed mb-10 max-w-2xl mx-auto">
          В своих проектах мы гарантируем кристальный просвет в 5 метров, 
          но на этой странице данные пока отсутствуют. 
          Давайте вернемся к прозрачным решениям.
        </p>
        
        <!-- CTA Button -->
        <NuxtLink to="/" class="btn btn-lidar inline-flex items-center gap-2 px-10 py-5 text-lg">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path>
          </svg>
          <span>На главную</span>
        </NuxtLink>
      </div>
    </div>
    
    <!-- Status Badge (Top Right) -->
    <div class="absolute top-6 right-6 z-20">
      <div class="glass-dark px-4 py-2 rounded-lg border border-white/10 backdrop-blur-md">
        <div class="flex items-center gap-2">
          <div class="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
          <span class="text-white/70 text-xs font-inter font-medium">Ошибка 404</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import * as THREE from 'three'

definePageMeta({
  layout: false // No header/footer on 404 page
})

const container = ref(null)
let scene, camera, renderer, particles, animationId

const init = async () => {
  if (!container.value) return
  
  await new Promise(resolve => setTimeout(resolve, 100))
  
  const width = window.innerWidth
  const height = window.innerHeight
  
  scene = new THREE.Scene()
  scene.fog = new THREE.FogExp2(0x1A1A1A, 0.015)
  
  // TOP VIEW: Camera positioned directly above
  camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000)
  camera.position.set(0, 100, 0) // Directly above
  camera.lookAt(0, 0, 0) // Looking down
  
  renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: "high-performance" })
  renderer.setSize(width, height)
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5))
  renderer.setClearColor(0x1A1A1A, 1)
  container.value.appendChild(renderer.domElement)
  
  // Create particles (same as preloader)
  const geometry = new THREE.BufferGeometry()
  const vertices = [], colors = []
  const cB = new THREE.Color(0x002366), cG = new THREE.Color(0x006039), cL = new THREE.Color(0x00D4FF)
  
  for (let i = 0; i < 25000; i++) {
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
    uniforms: { time: { value: 0 }, pointSize: { value: 0.4 } },
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
        gl_FragColor = vec4(col, alpha * 0.9);
      }
    `,
    transparent: true, blending: THREE.AdditiveBlending, depthWrite: false
  })
  
  particles = new THREE.Points(geometry, material)
  scene.add(particles)
  
  scene.add(new THREE.AmbientLight(0xffffff, 0.4))
  const pl = new THREE.PointLight(0x00D4FF, 0.8, 100); pl.position.set(30, 30, 30); scene.add(pl)
  
  // NO event listeners - no interactivity
  window.addEventListener('resize', onResize)
  
  animate()
}

const onResize = () => {
  if (!camera || !renderer) return
  camera.aspect = window.innerWidth / window.innerHeight
  camera.updateProjectionMatrix()
  renderer.setSize(window.innerWidth, window.innerHeight)
}

const animate = () => {
  animationId = requestAnimationFrame(animate)
  if (particles?.material?.uniforms?.time) particles.material.uniforms.time.value = performance.now() * 0.001
  // Auto-rotate only (no user interaction)
  if (particles) { particles.rotation.y += 0.002 }
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
/* Glass effect */
.glass-dark {
  background: rgba(26, 26, 26, 0.8);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
}

/* Button */
.btn {
  @apply rounded-xl font-medium transition-all duration-300 text-base;
}

.btn-lidar {
  @apply bg-esp-lidar text-esp-black hover:bg-opacity-90 hover:shadow-lg hover:shadow-esp-lidar/20;
}

/* Large text on mobile */
@media (max-width: 768px) {
  h1 {
    font-size: 80px;
  }
}
</style>