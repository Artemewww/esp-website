<template>
  <div ref="containerRef" class="pointer-events-none absolute inset-0 -z-0 overflow-hidden"></div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import * as THREE from 'three'

const containerRef = ref(null)
let scene, camera, renderer, points, animationId

onMounted(() => {
  if (!containerRef.value) return

  const SEPARATION = 150
  const AMOUNTX = 30
  const AMOUNTY = 24

  const width = containerRef.value.clientWidth
  const height = containerRef.value.clientHeight

  scene = new THREE.Scene()
  scene.fog = new THREE.Fog(0x000000, 1800, 8000)

  camera = new THREE.PerspectiveCamera(60, width / height, 1, 10000)
  camera.position.set(0, 355, 1000)

  renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true })
  renderer.setPixelRatio(window.devicePixelRatio)
  renderer.setSize(width, height)
  renderer.setClearColor(0x000000, 0)
  containerRef.value.appendChild(renderer.domElement)

  const positions = []
  const colors = []

  for (let ix = 0; ix < AMOUNTX; ix++) {
    for (let iy = 0; iy < AMOUNTY; iy++) {
      const x = ix * SEPARATION - (AMOUNTX * SEPARATION) / 2
      const z = iy * SEPARATION - (AMOUNTY * SEPARATION) / 2
      positions.push(x, 0, z)
      colors.push(0.78, 0.86, 1)
    }
  }

  const geometry = new THREE.BufferGeometry()
  geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3))
  geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3))

  const material = new THREE.PointsMaterial({
    size: 6,
    vertexColors: true,
    transparent: true,
    opacity: 0.5,
    sizeAttenuation: true
  })

  points = new THREE.Points(geometry, material)
  scene.add(points)

  let count = 0
  const animate = () => {
    animationId = requestAnimationFrame(animate)
    const positionAttribute = geometry.attributes.position
    const pos = positionAttribute.array
    let i = 0
    for (let ix = 0; ix < AMOUNTX; ix++) {
      for (let iy = 0; iy < AMOUNTY; iy++) {
        const index = i * 3
        pos[index + 1] = Math.sin((ix + count) * 0.3) * 30 + Math.sin((iy + count) * 0.5) * 30
        i++
      }
    }
    positionAttribute.needsUpdate = true
    renderer.render(scene, camera)
    count += 0.06
  }

  const handleResize = () => {
    if (!containerRef.value) return
    const w = containerRef.value.clientWidth
    const h = containerRef.value.clientHeight
    camera.aspect = w / h
    camera.updateProjectionMatrix()
    renderer.setSize(w, h)
  }
  window.addEventListener('resize', handleResize)
  animate()

  onUnmounted(() => {
    window.removeEventListener('resize', handleResize)
    cancelAnimationFrame(animationId)
    geometry.dispose()
    material.dispose()
    renderer.dispose()
    if (containerRef.value && renderer.domElement) {
      containerRef.value.removeChild(renderer.domElement)
    }
  })
})
</script>
