<template>
  <div ref="container" class="w-full h-full"></div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import * as THREE from 'three'

const container = ref(null)
let scene, camera, renderer, particles, animationId
let isDragging = false, lastX = 0, lastY = 0

const init = async () => {
  if (!container.value) return
  
  const width = container.value.offsetWidth
  const height = container.value.offsetHeight
  
  scene = new THREE.Scene()
  scene.fog = new THREE.FogExp2(0x1A1A1A, 0.02)
  
  camera = new THREE.PerspectiveCamera(75, width/height, 0.1, 1000)
  camera.position.set(0, 10, 50)
  
  renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: "high-performance" })
  renderer.setSize(width, height)
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5))
  container.value.appendChild(renderer.domElement)
  
  const geometry = new THREE.BufferGeometry()
  const vertices = [], colors = []
  const cB = new THREE.Color(0x002366), cG = new THREE.Color(0x006039), cL = new THREE.Color(0x00D4FF)
  
  for (let i = 0; i < 8000; i++) {
    const layer = Math.floor(Math.random()*4)
    const t = Math.random()*Math.PI*2
    const r = 12 + layer*6 + Math.random()*4
    const x = Math.cos(t)*r + (Math.random()-0.5)*8
    const z = Math.sin(t)*r + (Math.random()-0.5)*8
    const y = layer*9 + (Math.random()-0.5)*6 + Math.sin(x*0.12)*3
    vertices.push(x, y, z)
    
    let col = layer===0 ? cB.clone() : layer===1 ? cB.clone().lerp(cL,0.4) : layer===2 ? cL.clone() : cG.clone()
    col.offsetHSL(0,0,(Math.random()-0.5)*0.1)
    colors.push(col.r, col.g, col.b)
  }
  
  geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3))
  geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3))
  
  const mat = new THREE.ShaderMaterial({
    uniforms: { time: {value:0}, pSize: {value:0.35} },
    vertexShader: `
      uniform float time, pSize;
      attribute vec3 color;
      varying vec3 vCol; varying float vDist;
      void main() {
        vCol = color;
        vec4 mv = modelViewMatrix * vec4(position, 1.0);
        vDist = length(mv.xyz);
        vec3 pos = position;
        pos.y += sin(pos.x*0.1 + time*0.5)*0.5;
        pos.z += cos(pos.y*0.08 + time*0.3)*0.3;
        mv = modelViewMatrix * vec4(pos, 1.0);
        gl_PointSize = pSize * (250.0 / vDist);
        gl_Position = projectionMatrix * mv;
      }
    `,
    fragmentShader: `
      varying vec3 vCol; varying float vDist;
      void main() {
        vec2 uv = gl_PointCoord - 0.5;
        float d = length(uv);
        if (d > 0.5) discard;
        float alpha = smoothstep(0.5, 0.1, d);
        alpha *= smoothstep(80.0, 25.0, vDist);
        vec3 col = vCol * (1.0 + 0.2*sin(gl_FragCoord.x*0.02));
        gl_FragColor = vec4(col, alpha * 0.9);
      }
    `,
    transparent: true, blending: THREE.AdditiveBlending, depthWrite: false
  })
  
  particles = new THREE.Points(geometry, mat)
  scene.add(particles)
  
  scene.add(new THREE.AmbientLight(0xffffff, 0.4))
  const pl = new THREE.PointLight(0x00D4FF, 0.8, 80); pl.position.set(20,20,20); scene.add(pl)
  
  container.value.addEventListener('mousedown', onStart)
  container.value.addEventListener('mousemove', onMove)
  container.value.addEventListener('mouseup', onEnd)
  container.value.addEventListener('mouseleave', onEnd)
  container.value.addEventListener('touchstart', onTouchStart, {passive:false})
  container.value.addEventListener('touchmove', onTouchMove, {passive:false})
  container.value.addEventListener('touchend', onEnd)
  window.addEventListener('resize', onResize)
  
  animate()
}

const onStart = (e) => { isDragging=true; lastX=e.clientX; lastY=e.clientY }
const onMove = (e) => {
  if(!isDragging||!particles) return
  const dx=e.clientX-lastX, dy=e.clientY-lastY
  particles.rotation.y+=dx*0.006; particles.rotation.x+=dy*0.006
  lastX=e.clientX; lastY=e.clientY
}
const onEnd = () => { isDragging=false }
const onTouchStart = (e) => { onStart(e.touches[0]); e.preventDefault() }
const onTouchMove = (e) => { onMove(e.touches[0]); e.preventDefault() }
const onResize = () => {
  if(!camera||!renderer) return
  camera.aspect = container.value.offsetWidth/container.value.offsetHeight
  camera.updateProjectionMatrix()
  renderer.setSize(container.value.offsetWidth, container.value.offsetHeight)
}

const animate = () => {
  animationId = requestAnimationFrame(animate)
  if(particles?.material?.uniforms?.time) particles.material.uniforms.time.value = performance.now()*0.001
  if(particles && !isDragging) particles.rotation.y += 0.002
  if(renderer && scene && camera) renderer.render(scene, camera)
}

const cleanup = () => {
  if(animationId) cancelAnimationFrame(animationId)
  if(particles) { particles.geometry?.dispose(); particles.material?.dispose() }
  if(renderer) {
    renderer.dispose()
    if(renderer.domElement?.parentNode) renderer.domElement.parentNode.removeChild(renderer.domElement)
  }
  scene=null; camera=null
  window.removeEventListener('resize', onResize)
}

onMounted(() => init())
onUnmounted(() => cleanup())
</script>