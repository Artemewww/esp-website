<template>
  <div 
    ref="container" 
    class="fixed inset-0 z-50 bg-gradient-to-br from-gray-900 via-esp-black to-gray-900"
  >
    <!-- ESP Logo in Center - WHITE COLOR -->
    <div class="absolute inset-0 flex items-center justify-center pointer-events-none z-20">
      <svg 
        width="226" 
        height="155" 
        viewBox="0 0 226 155" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
        class="drop-shadow-2xl"
        style="filter: drop-shadow(0 0 25px rgba(255,255,255,0.4))"
      >
        <path d="M220.061 150.254C219.226 150.254 218.678 149.718 218.678 148.896V138.507H215.232C214.619 138.507 214.162 138.09 214.162 137.411C214.162 136.745 214.619 136.275 215.232 136.275H224.93C225.53 136.275 226 136.745 226 137.411C226 138.09 225.53 138.507 224.93 138.507H221.484V148.896C221.484 149.718 220.91 150.254 220.061 150.254Z" fill="white"/>
        <path d="M203.395 150.254C202.559 150.254 202.011 149.718 202.011 148.896V137.398C202.011 136.562 202.559 136.027 203.395 136.027C204.243 136.027 204.817 136.562 204.817 137.398V142.149H204.922L210.469 136.536C210.821 136.158 211.095 136.027 211.513 136.027C212.218 136.027 212.766 136.523 212.766 137.202C212.766 137.567 212.674 137.802 212.322 138.142L207.584 142.723L212.544 147.983C212.844 148.322 212.962 148.609 212.962 148.961C212.962 149.692 212.413 150.254 211.669 150.254C211.121 150.254 210.756 150.032 210.416 149.627L204.922 143.676H204.817V148.896C204.817 149.718 204.243 150.254 203.395 150.254Z" fill="white"/>
        <path d="M193.619 150.267C189.482 150.267 187.054 147.643 187.054 143.206C187.054 138.846 189.534 136.027 193.423 136.027C197.078 136.027 199.597 138.664 199.597 142.41C199.597 143.323 199.075 143.845 198.2 143.845H189.9V143.91C189.9 146.416 191.309 147.983 193.554 147.983C195.094 147.983 196.06 147.447 197.104 146.025C197.404 145.672 197.691 145.529 198.096 145.529C198.775 145.529 199.271 145.973 199.271 146.677C199.271 146.899 199.192 147.16 199.075 147.434C198.174 149.235 196.177 150.267 193.619 150.267ZM189.913 141.874H196.778C196.712 139.721 195.368 138.298 193.41 138.298C191.466 138.298 190.056 139.734 189.913 141.874Z" fill="white"/>
        <path d="M178.714 150.267C174.786 150.267 172.202 147.565 172.202 143.14C172.202 138.729 174.799 136.027 178.714 136.027C182.63 136.027 185.227 138.729 185.227 143.14C185.227 147.565 182.643 150.267 178.714 150.267ZM178.714 147.943C180.933 147.943 182.356 146.194 182.356 143.14C182.356 140.099 180.92 138.351 178.714 138.351C176.509 138.351 175.073 140.099 175.073 143.14C175.073 146.194 176.509 147.943 178.714 147.943Z" fill="white"/>
        <path d="M158.85 154.874C158.015 154.874 157.44 154.299 157.44 153.373V137.476C157.44 136.576 158.001 136.027 158.798 136.027C159.594 136.027 160.168 136.576 160.168 137.476V138.638H160.22C161.029 137.058 162.609 136.053 164.593 136.053C168.077 136.053 170.374 138.794 170.374 143.14C170.374 147.487 168.09 150.24 164.645 150.24C162.674 150.24 161.108 149.275 160.325 147.748H160.259V153.373C160.259 154.299 159.672 154.874 158.85 154.874ZM163.849 147.852C166.08 147.852 167.477 146.025 167.477 143.14C167.477 140.269 166.08 138.429 163.849 138.429C161.695 138.429 160.246 140.308 160.246 143.14C160.246 145.999 161.682 147.852 163.849 147.852Z" fill="white"/>
        <path d="M140.238 150.214C139.325 150.214 138.777 149.64 138.777 148.7V132.686C138.777 131.746 139.325 131.172 140.238 131.172H152.598C153.512 131.172 154.06 131.746 154.06 132.686V148.7C154.06 149.64 153.512 150.214 152.598 150.214C151.698 150.214 151.136 149.64 151.136 148.7V133.717H141.7V148.7C141.7 149.64 141.139 150.214 140.238 150.214Z" fill="white"/>
        <path d="M130.28 150.267C126.352 150.267 123.794 147.539 123.794 143.167C123.794 138.82 126.339 136.027 130.254 136.027C132.903 136.027 135.174 137.437 135.775 139.355C135.866 139.577 135.905 139.812 135.905 140.008C135.905 140.726 135.396 141.17 134.705 141.17C134.104 141.17 133.765 140.935 133.426 140.308C132.721 139.003 131.755 138.377 130.319 138.377C128.101 138.377 126.665 140.217 126.665 143.14C126.665 146.129 128.127 147.904 130.306 147.904C131.833 147.904 132.76 147.226 133.426 146.038C133.817 145.359 134.13 145.124 134.731 145.124C135.422 145.124 135.931 145.594 135.931 146.299C135.931 146.521 135.879 146.756 135.775 147.03C135.057 148.922 132.825 150.267 130.28 150.267Z" fill="white"/>
        <path d="M110.912 150.254C109.907 150.254 109.372 149.653 109.372 148.687V137.476C109.372 136.576 109.946 136.027 110.755 136.027C111.564 136.027 112.152 136.576 112.152 137.476V145.894H112.256L118.064 137.098C118.573 136.314 119.056 136.027 119.826 136.027C120.766 136.027 121.379 136.628 121.379 137.594V148.805C121.379 149.718 120.792 150.254 119.983 150.254C119.173 150.254 118.599 149.718 118.599 148.805V140.36H118.495L112.674 149.196C112.165 149.979 111.682 150.254 110.912 150.254Z" fill="white"/>
        <path d="M97.1816 150.006C96.268 150.006 95.7198 149.431 95.7198 148.492V137.802C95.7198 136.85 96.268 136.275 97.1816 136.275H101.958C104.634 136.275 106.252 137.607 106.252 139.773C106.252 141.196 105.234 142.488 103.916 142.736V142.84C105.691 143.075 106.866 144.328 106.866 146.051C106.866 148.466 105.012 150.006 102.037 150.006H97.1816ZM98.4998 141.927H101.11C102.702 141.927 103.499 141.313 103.499 140.099C103.499 138.964 102.755 138.324 101.384 138.324H98.4998V141.927ZM98.4998 147.957H101.606C103.198 147.957 104.06 147.252 104.06 145.934C104.06 144.576 103.146 143.897 101.293 143.897H98.4998V147.957Z" fill="white"/>
        <path d="M81.7676 154.874C80.9323 154.874 80.358 154.299 80.358 153.373V137.476C80.358 136.576 80.9192 136.027 81.7154 136.027C82.5115 136.027 83.0858 136.576 83.0858 137.476V138.638H83.138C83.9472 137.058 85.5264 136.053 87.5102 136.053C90.995 136.053 93.292 138.794 93.292 143.14C93.292 147.487 91.008 150.24 87.5624 150.24C85.5917 150.24 84.0255 149.275 83.2424 147.748H83.1771V153.373C83.1771 154.299 82.5898 154.874 81.7676 154.874ZM86.7663 147.852C88.9981 147.852 90.3946 146.025 90.3946 143.14C90.3946 140.269 88.9981 138.429 86.7663 138.429C84.6128 138.429 83.1641 140.308 83.1641 143.14C83.1641 145.999 84.5997 147.852 86.7663 147.852Z" fill="white"/>
        <path d="M71.9529 150.267C67.8156 150.267 65.388 147.643 65.388 143.206C65.388 138.846 67.8678 136.027 71.7572 136.027C75.4116 136.027 77.9305 138.664 77.9305 142.41C77.9305 143.323 77.4085 143.845 76.534 143.845H68.2333V143.91C68.2333 146.416 69.6428 147.983 71.8877 147.983C73.4278 147.983 74.3936 147.447 75.4377 146.025C75.7379 145.672 76.025 145.529 76.4296 145.529C77.1083 145.529 77.6042 145.973 77.6042 146.677C77.6042 146.899 77.5259 147.16 77.4085 147.434C76.5079 149.235 74.511 150.267 71.9529 150.267ZM68.2463 141.874H75.1114C75.0461 139.721 73.7018 138.298 71.7441 138.298C69.7994 138.298 68.3899 139.734 68.2463 141.874Z" fill="white"/>
        <path d="M55.4948 150.319C50.1698 150.319 46.8416 146.586 46.8416 140.583C46.8416 134.618 50.2089 130.859 55.4687 130.859C58.9273 130.859 61.6943 132.543 62.8689 135.323C63.0516 135.701 63.143 136.093 63.143 136.445C63.143 137.229 62.6209 137.738 61.8378 137.738C61.1461 137.738 60.6893 137.398 60.363 136.641C59.4886 134.54 57.6352 133.417 55.4687 133.417C52.0492 133.417 49.8304 136.224 49.8304 140.583C49.8304 144.981 52.0231 147.761 55.4817 147.761C57.7788 147.761 59.5408 146.782 60.4152 144.746C60.7285 144.054 61.1069 143.767 61.7465 143.767C62.5426 143.767 63.0908 144.316 63.0908 145.086C63.0908 145.49 62.9864 145.869 62.7775 146.299C61.5637 148.844 58.9926 150.319 55.4948 150.319Z" fill="white"/>
        <path d="M38.2279 150.267C34.2994 150.267 31.7152 147.565 31.7152 143.14C31.7152 138.729 34.3124 136.027 38.2279 136.027C42.1433 136.027 44.7406 138.729 44.7406 143.14C44.7406 147.565 42.1564 150.267 38.2279 150.267ZM38.2279 147.943C40.4466 147.943 41.8693 146.194 41.8693 143.14C41.8693 140.099 40.4336 138.351 38.2279 138.351C36.0222 138.351 34.5865 140.099 34.5865 143.14C34.5865 146.194 36.0222 147.943 38.2279 147.943Z" fill="white"/>
        <path d="M20.3865 150.254C19.5512 150.254 19.003 149.718 19.003 148.896V137.398C19.003 136.562 19.5512 136.027 20.3865 136.027C21.2348 136.027 21.8091 136.562 21.8091 137.398V142.149H21.9135L27.4604 136.536C27.8128 136.158 28.0869 136.027 28.5045 136.027C29.2093 136.027 29.7575 136.523 29.7575 137.202C29.7575 137.567 29.6661 137.802 29.3137 138.142L24.576 142.723L29.5356 147.983C29.8358 148.322 29.9532 148.609 29.9532 148.961C29.9532 149.692 29.4051 150.254 28.6611 150.254C28.113 150.254 27.7475 150.032 27.4082 149.627L21.9135 143.676H21.8091V148.896C21.8091 149.718 21.2348 150.254 20.3865 150.254Z" fill="white"/>
        <path d="M7.71353 150.358C3.9808 150.358 1.38354 148.714 0.221959 146.051C0.0653407 145.699 8.30637e-05 145.373 8.30637e-05 145.06C8.30637e-05 144.276 0.548247 143.702 1.33134 143.702C1.94476 143.702 2.32325 143.937 2.62344 144.524C3.65451 146.717 5.28595 147.761 7.70048 147.761C10.872 147.761 13.0647 145.334 13.2474 141.627H6.33007C5.57308 141.627 5.01187 141.144 5.01187 140.4C5.01187 139.656 5.56003 139.173 6.33007 139.173H13.2082C12.9211 135.702 10.7545 133.418 7.71353 133.418C5.45562 133.418 3.78502 134.501 2.83226 136.55C2.46682 137.294 2.08833 137.516 1.4749 137.516C0.665711 137.516 0.117547 136.981 0.117547 136.184C0.117547 135.897 0.169753 135.675 0.261113 135.401C1.08336 132.804 4.033 130.82 7.71353 130.82C12.9602 130.82 16.2884 134.579 16.2884 140.583C16.2884 146.626 12.9994 150.358 7.71353 150.358Z" fill="white"/>
        <path d="M118.737 2.43262C124.843 8.93303 138.751 24.3754 141.685 32.1212C142.811 35.0959 143.955 40.9109 139.258 41.2379C135.202 41.5202 134.345 35.7231 133.035 33.1561C132.039 31.2029 130.29 28.703 128.948 26.9424C125.121 21.9204 119.94 17.1537 115.965 12.1362L108.594 21.7412C94.6415 54.6464 144.96 49.7454 148.01 79.5505C151.294 111.658 110.37 123.933 90.4603 101.726L85.1081 94.9794C84.1884 95.1093 80.9 99.3115 79.7336 100.391C55.6871 122.585 17.9618 113.71 4.61963 84.559C-6.34037 60.6137 2.73539 31.6732 26.1897 19.5012C42.439 11.07 61.3622 13.6101 79.0471 13.9103C81.869 31.6419 78.2351 53.7728 64.4802 66.3167C55.5058 74.4998 43.7553 78.5336 31.7154 78.5961C29.2268 78.6091 27.4433 76.3193 27.8525 73.8689C28.1766 71.9277 29.7978 70.4718 31.7662 70.361C34.8837 70.1855 37.9968 69.9744 41.0662 69.3317C57.7224 65.8483 67.4908 52.6899 70.7767 37.42C72.6584 28.6758 64.9156 21.2218 55.9607 21.5082C48.9442 21.7322 41.9231 22.1444 35.2475 24.5322C15.2611 31.6956 4.87535 52.3616 9.47379 72.9739C9.76163 74.2603 10.1978 75.4953 10.6732 76.7162C11.1717 77.9964 13.5128 77.7752 13.664 76.41C14.7542 66.6124 19.0251 57.4105 25.9071 50.3546C32.3135 43.7825 41.4431 41.2066 49.1864 36.6773C51.6013 35.2624 53.6816 33.4796 56.0159 31.999C56.4046 31.7524 56.9068 31.7918 57.2625 32.0838C57.489 32.2696 57.635 32.5389 57.6428 32.8315C57.7332 36.2442 55.4612 39.2025 53.3048 41.6904C45.8352 50.3054 34.0856 50.5473 27.1767 61.6979C12.4617 85.4461 29.0385 109.96 56.674 103.747C67.7821 101.251 74.8121 94.1461 81.4832 85.5581C82.8313 83.8226 83.1613 81.208 86.3122 81.208C89.4631 81.208 90.8551 86.472 92.6137 90.1634C96.6738 98.6798 107.858 106.56 117.481 103.653C123.731 101.767 126.548 94.2223 125.521 88.1609C123.098 73.8699 93.834 70.8101 87.9883 52.2317C81.4339 31.4089 104.525 15.2901 115.072 0.439045L115.996 9.87879e-06C116.548 9.87879e-06 118.15 1.80543 118.737 2.42814V2.43262ZM98.3023 34.9705C96.1399 35.5484 95.3234 40.8706 95.1798 42.8149C93.484 65.3401 129.46 64.6412 133.192 85.8627C134 90.4591 133.125 92.8514 132.838 97.0671C132.681 99.3563 134.345 97.4254 135.032 96.5653C139.904 90.4502 141.407 80.5002 137.355 73.628C128.473 58.5619 98.6747 56.9133 98.3023 34.966V34.9705Z" fill="white"/>
        <path d="M178.43 109.124C171.385 116.604 157.127 112.756 156.019 101.872C154.102 83.0315 158.38 61.4285 179.203 55.8495C183.946 54.5803 188.69 54.9346 193.216 54.0735C200.618 52.6698 202.527 42.7764 196.169 38.6639C192.741 36.444 187.003 37.1391 184.521 40.5027C182.558 43.1576 182.929 48.5079 181.337 49.8982C179.972 51.0867 175.545 51.2616 173.623 51.8715C172.791 38.9061 181.482 26.1111 195.834 29.5778C213.411 33.8294 212.393 59.3924 194.41 62.4331C190.964 63.0161 187.306 62.4689 183.82 63.1237C174.817 64.8145 167.238 72.1336 165.244 80.9954C164.308 85.1662 163.829 97.2078 164.692 101.32C165.633 105.823 172.682 105.433 173.514 100.867C175.337 90.817 168.789 74.349 183.006 70.833C190.698 68.9315 197.838 71.0797 205.366 67.0344C223.951 57.0514 220.705 28.0306 200.171 22.5681C194.79 21.1375 177.146 21.2676 171.118 21.7968C166.673 22.1869 165.013 24.5325 164.593 28.7706C164.593 41.0063 164.593 47.4161 164.593 58.2712C159.647 62.4848 156.481 67.3203 156.481 67.3203C156.481 67.3203 156.481 67.3203 155.992 28.2997C156.702 19.3346 162.676 13.8363 171.561 13.2713C178.127 12.8542 187.591 12.8766 194.17 13.2713C233.859 15.6572 237.047 69.9091 200.27 77.6678C196.133 78.5423 184.873 77.3673 182.897 80.1433C178.963 85.6685 185.294 101.814 178.421 109.11L178.43 109.124Z" fill="white"/>
      </svg>
    </div>

    <!-- Status Text -->
    <div class="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-center z-30 pointer-events-none">
      <div class="flex items-center justify-center gap-3 mb-3">
        <div class="w-2 h-2 bg-esp-lidar rounded-full animate-pulse"></div>
        <span class="text-white/70 text-sm font-inter tracking-wider">
          {{ statusText }}
        </span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const props = defineProps({ 
  onComplete: Function 
})

const container = ref(null)
const statusText = ref('Загрузка экосистемы...')
const isTransitioning = ref(false)

let scene = null
let camera = null
let renderer = null
let particles = null
let animationId = null
let isDragging = false
let lastX = 0
let lastY = 0

// Initialize Three.js
const init = async () => {
  if (!container.value) return
  await new Promise(r => setTimeout(r, 100))
  
  const THREE = await import('three')
  const width = window.innerWidth
  const height = window.innerHeight
  
  // Scene
  scene = new THREE.Scene()
  scene.fog = new THREE.FogExp2(0x1A1A1A, 0.02)
  
  // Camera - START FROM SIDE VIEW (profile)
  camera = new THREE.PerspectiveCamera(75, width/height, 0.1, 1000)
  camera.position.set(150, 30, 0) // Side view: X=150, Y=30, Z=0
  camera.lookAt(0, 0, 0)
  
  // Renderer
  renderer = new THREE.WebGLRenderer({ 
    antialias: true, 
    alpha: true, 
    powerPreference: "high-performance" 
  })
  renderer.setSize(width, height)
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5))
  renderer.setClearColor(0x1A1A1A, 1)
  container.value.appendChild(renderer.domElement)
  
  // Create particles (YOUR STYLE)
  const total = 20000
  const positions = []
  const colors = []
  const cB = new THREE.Color(0x002366)
  const cG = new THREE.Color(0x006039)
  const cL = new THREE.Color(0x00D4FF)
  
  for (let i = 0; i < total; i++) {
    const layer = Math.floor(Math.random()*4)
    const t = Math.random()*Math.PI*2
    const r = 25 + layer*12 + Math.random()*10
    const x = Math.cos(t)*r + (Math.random()-0.5)*20
    const z = Math.sin(t)*r + (Math.random()-0.5)*20
    const y = layer*18 + (Math.random()-0.5)*15 + Math.sin(x*0.12)*5
    
    positions.push(x, y, z)
    
    let col = null
    if (layer === 0) col = cB.clone()
    else if (layer === 1) col = cB.clone().lerp(cL, 0.4)
    else if (layer === 2) col = cL.clone()
    else col = cG.clone()
    col.offsetHSL(0, 0, (Math.random()-0.5)*0.1)
    colors.push(col.r, col.g, col.b)
  }
  
  const geom = new THREE.BufferGeometry()
  geom.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3))
  geom.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3))
  
  // Shader material - FIXED ROUND POINTS, FIXED SIZE
  const mat = new THREE.ShaderMaterial({
    uniforms: { 
      time: { value: 0 }, 
      pSize: { value: 3.5 }
    },
    vertexShader: `
      uniform float time, pSize;
      attribute vec3 color;
      varying vec3 vCol;
      void main() {
        vCol = color;
        vec4 mv = modelViewMatrix * vec4(position, 1.0);
        vec3 pos = position;
        pos.y += sin(pos.x*0.1 + time*0.5)*0.5;
        pos.z += cos(pos.y*0.08 + time*0.3)*0.3;
        mv = modelViewMatrix * vec4(pos, 1.0);
        gl_PointSize = pSize;
        gl_Position = projectionMatrix * mv;
      }
    `,
    fragmentShader: `
      varying vec3 vCol;
      void main() {
        vec2 uv = gl_PointCoord - 0.5;
        float d = length(uv);
        if (d > 0.5) discard;
        float alpha = smoothstep(0.5, 0.1, d);
        vec3 col = vCol * (1.0 + 0.2*sin(gl_FragCoord.x*0.02));
        gl_FragColor = vec4(col, alpha * 0.95);
      }
    `,
    transparent: true,
    blending: THREE.AdditiveBlending,
    depthWrite: false
  })
  
  particles = new THREE.Points(geom, mat)
  scene.add(particles)
  
  // Lights
  scene.add(new THREE.AmbientLight(0xffffff, 0.4))
  const pl1 = new THREE.PointLight(0x00D4FF, 0.8, 200)
  pl1.position.set(50, 50, 50)
  scene.add(pl1)
  
  // Events for rotation
  container.value.addEventListener('mousedown', onStart)
  container.value.addEventListener('mousemove', onMove)
  container.value.addEventListener('mouseup', onEnd)
  container.value.addEventListener('mouseleave', onEnd)
  container.value.addEventListener('touchstart', onTouchStart, { passive: false })
  container.value.addEventListener('touchmove', onTouchMove, { passive: false })
  container.value.addEventListener('touchend', onEnd)
  window.addEventListener('resize', onResize)
  
  // Auto-transition sequence: side view → top view → main page
  setTimeout(startCameraTransition, 1200)
  
  animate()
}

// Mouse/touch handlers for manual rotation
const onStart = (e) => {
  isDragging = true
  lastX = e.clientX
  lastY = e.clientY
}

const onMove = (e) => {
  if (!isDragging || !particles) return
  const dx = e.clientX - lastX
  const dy = e.clientY - lastY
  particles.rotation.y += dx * 0.005
  particles.rotation.x += dy * 0.005
  lastX = e.clientX
  lastY = e.clientY
}

const onEnd = () => {
  isDragging = false
}

const onTouchStart = (e) => {
  onStart(e.touches[0])
  e.preventDefault()
}

const onTouchMove = (e) => {
  onMove(e.touches[0])
  e.preventDefault()
}

// Camera transition: Side view → Top view
const startCameraTransition = () => {
  if (isTransitioning.value) return
  statusText.value = 'Синхронизация завершена'
  
  const duration = 900
  const start = performance.now()
  const startPos = { x: camera.position.x, y: camera.position.y, z: camera.position.z }
  const endPos = { x: 0, y: 150, z: 0 } // Top view: directly above
  
  const animateCamera = (t) => {
    const e = t - start
    const rp = Math.min(e / duration, 1)
    
    // Smooth easing
    const ease = 1 - Math.pow(1 - rp, 3)
    
    // Interpolate camera position
    camera.position.x = startPos.x + (endPos.x - startPos.x) * ease
    camera.position.y = startPos.y + (endPos.y - startPos.y) * ease
    camera.position.z = startPos.z + (endPos.z - startPos.z) * ease
    camera.lookAt(0, 0, 0)
    
    if (rp < 1) {
      requestAnimationFrame(animateCamera)
    } else {
      // Camera reached top view → fade out and load main page
      setTimeout(transition, 300)
    }
  }
  requestAnimationFrame(animateCamera)
}

// Fade out and call callback
const transition = () => {
  if (isTransitioning.value) return
  isTransitioning.value = true
  statusText.value = 'Добро пожаловать'
  
  const fs = performance.now()
  const fd = 400
  
  const fade = (t) => {
    const e = t - fs
    const fp = Math.min(e / fd, 1)
    if (particles && particles.material) {
      particles.material.opacity = 1 - fp
    }
    if (fp < 1) {
      requestAnimationFrame(fade)
    } else {
      if (container.value) {
        container.value.style.opacity = '0'
        container.value.style.pointerEvents = 'none'
      }
      setTimeout(() => {
        if (props.onComplete) props.onComplete()
        cleanup()
      }, 300)
    }
  }
  requestAnimationFrame(fade)
}

const onResize = () => {
  if (!camera || !renderer) return
  camera.aspect = window.innerWidth / window.innerHeight
  camera.updateProjectionMatrix()
  renderer.setSize(window.innerWidth, window.innerHeight)
}

const animate = () => {
  animationId = requestAnimationFrame(animate)
  if (particles && particles.material && particles.material.uniforms && particles.material.uniforms.time) {
    particles.material.uniforms.time.value = performance.now() * 0.001
  }
  // Auto-rotate particles when not dragging and not transitioning
  if (particles && !isDragging && !isTransitioning.value) {
    particles.rotation.y += 0.002
  }
  if (renderer && scene && camera) {
    renderer.render(scene, camera)
  }
}

const cleanup = () => {
  if (animationId) cancelAnimationFrame(animationId)
  if (particles) {
    if (particles.geometry) particles.geometry.dispose()
    if (particles.material) particles.material.dispose()
  }
  if (renderer) {
    renderer.dispose()
    if (renderer.domElement && renderer.domElement.parentNode) {
      renderer.domElement.parentNode.removeChild(renderer.domElement)
    }
  }
  scene = null
  camera = null
  window.removeEventListener('resize', onResize)
}

onMounted(() => {
  init()
})

onUnmounted(() => {
  cleanup()
})

defineExpose({ 
  skip: () => isTransitioning.value ? null : startCameraTransition() 
})
</script>

<style scoped>
.fixed {
  transition: opacity 0.3s ease;
}
</style>