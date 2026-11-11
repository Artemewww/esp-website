<template>
  <!-- Облако точек очистных сооружений на всю ширину экрана.
       Пока не активировано — медленно облетает объект и не мешает прокрутке;
       клик/тап включает управление (вращение, зум, сдвиг). -->
  <div ref="wrap" class="pc" :class="{ 'is-active': active, 'is-full': full }" @click="activate">
    <div ref="stage" class="pc-stage" aria-label="Облако точек очистных сооружений" role="img"></div>

    <div class="pc-meta">
      <span>{{ countLabel }} точек</span>
      <span>Точность до 1 мм</span>
    </div>

    <div class="pc-tools" @click.stop>
      <button type="button" aria-label="Приблизить" @click="zoom(0.75)"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M12 5v14M5 12h14" /></svg></button>
      <button type="button" aria-label="Отдалить" @click="zoom(1.33)"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M5 12h14" /></svg></button>
      <button type="button" aria-label="Исходный вид" @click="reset"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 12a9 9 0 1 0 3-6.7L3 8M3 3v5h5" /></svg></button>
      <button type="button" :aria-label="full ? 'Свернуть' : 'На весь экран'" @click="toggleFull">
        <svg v-if="!full" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5" /></svg>
        <svg v-else viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 4v5H4M15 4v5h5M9 20v-5H4M15 20v-5h5" /></svg>
      </button>
    </div>

    <span class="pc-hint">{{ active ? hintActive : 'Нажмите, чтобы управлять моделью' }}</span>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'

const wrap = ref(null)
const stage = ref(null)
const active = ref(false)
const full = ref(false)
const count = ref(0)
const countLabel = computed(() => (count.value ? `${Math.round(count.value / 1000)} 000+` : '150 000+'))
const hintActive = 'Вращайте · колесо или щипок — зум · правой кнопкой / двумя пальцами — сдвиг'

let api = null
let io = null

const HOME = { pos: [105, 68, 118], target: [0, 0, 0] }

async function init() {
  const THREE = await import('three')
  const { OrbitControls } = await import('three/examples/jsm/controls/OrbitControls.js')
  const { buildPlantCloud } = await import('./plantCloud.js')
  const el = stage.value
  if (!el) return
  const mobile = window.matchMedia('(max-width: 734px)').matches
  const data = buildPlantCloud({ density: mobile ? 0.6 : 1 })
  count.value = data.count

  const scene = new THREE.Scene()
  scene.fog = new THREE.Fog(0x05080f, 260, 520)
  const camera = new THREE.PerspectiveCamera(42, el.clientWidth / el.clientHeight, 0.5, 2000)
  camera.position.set(...HOME.pos)
  const renderer = new THREE.WebGLRenderer({ antialias: false, alpha: false, powerPreference: 'high-performance' })
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
  renderer.setSize(el.clientWidth, el.clientHeight)
  renderer.setClearColor(0x05080f, 1)
  renderer.domElement.style.touchAction = 'pan-y'
  el.appendChild(renderer.domElement)

  const geo = new THREE.BufferGeometry()
  geo.setAttribute('position', new THREE.BufferAttribute(data.positions, 3))
  geo.setAttribute('color', new THREE.BufferAttribute(data.colors, 3))
  const mat = new THREE.ShaderMaterial({
    uniforms: { size: { value: mobile ? 1.6 : 1.9 }, dpr: { value: renderer.getPixelRatio() }, scan: { value: -200 } },
    vertexShader: `
      uniform float size, dpr, scan;
      attribute vec3 color;
      varying vec3 vColor;
      varying float vGlow;
      void main() {
        vec4 mv = modelViewMatrix * vec4(position, 1.0);
        gl_Position = projectionMatrix * mv;
        // мелкие точки; при приближении растут умеренно
        gl_PointSize = clamp(size * dpr * (160.0 / -mv.z), 1.0 * dpr, 4.0 * dpr);
        float d = abs(position.x - scan);
        vGlow = smoothstep(4.0, 0.0, d);
        vColor = color;
      }`,
    fragmentShader: `
      varying vec3 vColor;
      varying float vGlow;
      void main() {
        vec2 uv = gl_PointCoord - 0.5;
        if (dot(uv, uv) > 0.25) discard;
        vec3 c = mix(vColor, vec3(0.55, 0.85, 1.0), vGlow * 0.85);
        gl_FragColor = vec4(c, 1.0);
      }`,
    fog: false
  })
  const points = new THREE.Points(geo, mat)
  scene.add(points)

  const controls = new OrbitControls(camera, renderer.domElement)
  controls.target.set(...HOME.target)
  controls.enableDamping = true
  controls.dampingFactor = 0.08
  controls.minDistance = 12
  controls.maxDistance = 380
  controls.maxPolarAngle = Math.PI * 0.47
  controls.autoRotate = true
  controls.autoRotateSpeed = 0.35
  controls.enabled = false
  controls.update()

  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  if (reduce) controls.autoRotate = false

  let raf = 0, visible = true
  const vis = new IntersectionObserver(([e]) => { visible = e.isIntersecting })
  vis.observe(el)

  const onResize = () => {
    const w = el.clientWidth, h = el.clientHeight
    if (!w || !h) return
    camera.aspect = w / h
    camera.updateProjectionMatrix()
    renderer.setSize(w, h)
  }
  const ro = new ResizeObserver(onResize)
  ro.observe(el)

  const t0 = performance.now()
  const tick = () => {
    raf = requestAnimationFrame(tick)
    if (!visible) return
    // луч сканера проходит по объекту каждые 7 с
    if (!reduce) mat.uniforms.scan.value = -140 + (((performance.now() - t0) / 7000) % 1) * 280
    controls.update()
    renderer.render(scene, camera)
  }
  tick()

  const setActive = (on) => {
    controls.enabled = on
    controls.autoRotate = !on && !reduce
    renderer.domElement.style.touchAction = on ? 'none' : 'pan-y'
  }

  const zoomBy = (k) => {
    const dir = camera.position.clone().sub(controls.target)
    const len = Math.min(controls.maxDistance, Math.max(controls.minDistance, dir.length() * k))
    camera.position.copy(controls.target).add(dir.setLength(len))
  }
  const resetView = () => {
    camera.position.set(...HOME.pos)
    controls.target.set(...HOME.target)
  }

  api = {
    setActive, zoomBy, resetView,
    dispose() {
      cancelAnimationFrame(raf)
      vis.disconnect(); ro.disconnect()
      controls.dispose(); geo.dispose(); mat.dispose(); renderer.dispose()
      renderer.domElement.remove()
    }
  }
}

const activate = () => {
  if (active.value) return
  active.value = true
  api?.setActive(true)
}
const deactivate = () => {
  if (!active.value || full.value) return
  active.value = false
  api?.setActive(false)
}
const zoom = (k) => { activate(); api?.zoomBy(k) }
const reset = () => api?.resetView()

const toggleFull = async () => {
  const el = wrap.value
  if (!el) return
  if (document.fullscreenElement) { await document.exitFullscreen(); return }
  if (el.requestFullscreen) {
    try { await el.requestFullscreen() } catch { full.value = !full.value }
  } else full.value = !full.value // iOS Safari: «псевдо-полноэкранный» режим
  activate()
}
const onFs = () => { full.value = document.fullscreenElement === wrap.value }
const onDocDown = (e) => { if (wrap.value && !wrap.value.contains(e.target)) deactivate() }
const onKey = (e) => {
  if (e.key !== 'Escape') return
  if (full.value && !document.fullscreenElement) full.value = false
  deactivate()
}

onMounted(() => {
  io = new IntersectionObserver(([e]) => {
    if (!e.isIntersecting || api) return
    io.disconnect()
    init()
  }, { rootMargin: '400px 0px' })
  io.observe(wrap.value)
  document.addEventListener('pointerdown', onDocDown)
  document.addEventListener('fullscreenchange', onFs)
  window.addEventListener('keydown', onKey)
})
onUnmounted(() => {
  io?.disconnect()
  api?.dispose()
  document.removeEventListener('pointerdown', onDocDown)
  document.removeEventListener('fullscreenchange', onFs)
  window.removeEventListener('keydown', onKey)
})
</script>

<style scoped>
.pc { position: relative; width: 100%; height: min(88vh, 900px); min-height: 460px; overflow: hidden; background: radial-gradient(120% 80% at 50% 0%, #0d1a33 0%, #05080f 70%); font-family: var(--dj-font); cursor: pointer; }
.pc.is-active { cursor: grab; }
.pc.is-active:active { cursor: grabbing; }
.pc.is-full { position: fixed; inset: 0; z-index: 200; height: 100%; min-height: 0; }
.pc:fullscreen { height: 100%; }
.pc-stage { position: absolute; inset: 0; }
.pc-stage :deep(canvas) { display: block; width: 100% !important; height: 100% !important; }
.pc-meta { position: absolute; top: 24px; left: max(24px, calc((100% - 1260px) / 2)); display: flex; flex-wrap: wrap; gap: 8px; pointer-events: none; }
.pc-meta span, .pc-hint { padding: 8px 16px; border-radius: 980px; font-size: 14px; letter-spacing: -0.016em; color: #f5f5f7; background: rgba(66, 66, 69, 0.6); backdrop-filter: blur(20px); -webkit-backdrop-filter: blur(20px); }
.pc-hint { position: absolute; bottom: 24px; left: 50%; transform: translateX(-50%); max-width: calc(100% - 32px); text-align: center; pointer-events: none; transition: background-color 0.3s ease; }
.pc:not(.is-active) .pc-hint { background: rgba(10, 58, 140, 0.85); }
.pc-tools { position: absolute; top: 24px; right: max(24px, calc((100% - 1260px) / 2)); display: flex; flex-direction: column; gap: 8px; }
.pc-tools button { display: grid; place-items: center; width: 44px; height: 44px; border-radius: 50%; color: #f5f5f7; background: rgba(66, 66, 69, 0.6); backdrop-filter: blur(20px); -webkit-backdrop-filter: blur(20px); transition: background-color 0.2s ease; }
.pc-tools button:hover { background: rgba(90, 90, 94, 0.8); }
.pc-tools svg { width: 20px; height: 20px; }
@media (max-width: 734px) {
  .pc { height: 72vh; min-height: 420px; }
  .pc-meta { top: 16px; left: 16px; }
  .pc-meta span, .pc-hint { font-size: 12px; padding: 7px 12px; }
  .pc-tools { top: 16px; right: 16px; }
  .pc-tools button { width: 40px; height: 40px; }
  .pc-hint { bottom: 16px; }
}
</style>
