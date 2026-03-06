<template>
  <div ref="container" class="w-full h-full min-h-[400px] bg-esp-black rounded-none"></div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const container = ref(null)
let scene, camera, renderer, particles, animationId

// Функция инициализации (выполняется только в браузере)
const init = () => {
  if (!container.value) return
  
  // Динамический импорт Three.js (только на клиенте)
  import('three').then((THREE) => {
    // Scene
    scene = new THREE.Scene()
    scene.background = new THREE.Color(0x1A1A1A)

    // Camera
    camera = new THREE.PerspectiveCamera(
      75, 
      container.value.offsetWidth / container.value.offsetHeight, 
      0.1, 
      1000
    )
    camera.position.z = 50

    // Renderer
    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    renderer.setSize(container.value.offsetWidth, container.value.offsetHeight)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    container.value.appendChild(renderer.domElement)

    // Particles (30,000 точек как в брифе)
    const geometry = new THREE.BufferGeometry()
    const vertices = []

    for (let i = 0; i < 30000; i++) {
      vertices.push(
        (Math.random() - 0.5) * 100,
        (Math.random() - 0.5) * 100,
        (Math.random() - 0.5) * 100
      )
    }

    geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3))

    const material = new THREE.PointsMaterial({
      color: 0x002366, // Технологичный синий из брендбука
      size: 0.3,
      transparent: true,
      opacity: 0.9,
      sizeAttenuation: true
    })

    particles = new THREE.Points(geometry, material)
    scene.add(particles)

    // Анимация
    animate()
    
    // Обработчик ресайза
    window.addEventListener('resize', onResize)
  })
}

const onResize = () => {
  if (!container.value || !camera || !renderer) return
  camera.aspect = container.value.offsetWidth / container.value.offsetHeight
  camera.updateProjectionMatrix()
  renderer.setSize(container.value.offsetWidth, container.value.offsetHeight)
}

const animate = () => {
  animationId = requestAnimationFrame(animate)
  
  if (particles) {
    particles.rotation.x += 0.0005
    particles.rotation.y += 0.001
  }
  
  if (renderer && scene && camera) {
    renderer.render(scene, camera)
  }
}

const cleanup = () => {
  if (animationId) cancelAnimationFrame(animationId)
  if (renderer) {
    renderer.dispose()
    if (renderer.domElement?.parentNode) {
      renderer.domElement.parentNode.removeChild(renderer.domElement)
    }
  }
  window.removeEventListener('resize', onResize)
}

onMounted(() => {
  init()
})

onUnmounted(() => {
  cleanup()
})
</script>