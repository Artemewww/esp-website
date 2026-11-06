// Звуковой фон страницы «О компании», как у jazakvoda: несколько дорожек
// (ветер, вода, низкий гул) плавно перетекают друг в друга по сценам.
// Звук синтезируется в браузере из шума — без аудиофайлов и лицензий.
import { ref } from 'vue'

const SCENES = {
  sky: { wind: 0.55, water: 0.04, hum: 0 },
  layers: { wind: 0.12, water: 0, hum: 0.3 },
  nature: { wind: 0.18, water: 0.5, hum: 0 },
  quality: { wind: 0.08, water: 0.32, hum: 0 },
  calm: { wind: 0.06, water: 0.14, hum: 0.04 }
}

const noiseBuffer = (ctx, kind) => {
  const len = ctx.sampleRate * 4
  const buf = ctx.createBuffer(1, len, ctx.sampleRate)
  const d = buf.getChannelData(0)
  let last = 0, b0 = 0, b1 = 0, b2 = 0
  for (let i = 0; i < len; i++) {
    const w = Math.random() * 2 - 1
    if (kind === 'brown') { last = (last + 0.02 * w) / 1.02; d[i] = last * 3.5 }
    else { b0 = 0.99765 * b0 + w * 0.099; b1 = 0.963 * b1 + w * 0.2965; b2 = 0.57 * b2 + w * 1.0526; d[i] = (b0 + b1 + b2 + w * 0.1848) * 0.11 }
  }
  return buf
}

export const useStoryAmbience = () => {
  const on = ref(false)
  let ctx = null
  let master = null
  const gains = {}
  let scene = 'sky'

  const source = (kind) => {
    const s = ctx.createBufferSource()
    s.buffer = noiseBuffer(ctx, kind)
    s.loop = true
    s.start()
    return s
  }
  const lfo = (freq, depth, target) => {
    const o = ctx.createOscillator()
    const g = ctx.createGain()
    o.frequency.value = freq
    g.gain.value = depth
    o.connect(g).connect(target)
    o.start()
  }

  const build = () => {
    ctx = new (window.AudioContext || window.webkitAudioContext)()
    master = ctx.createGain()
    master.gain.value = 0
    master.connect(ctx.destination)
    for (const k of ['wind', 'water', 'hum']) { gains[k] = ctx.createGain(); gains[k].gain.value = 0; gains[k].connect(master) }

    // Ветер: розовый шум через «дышащий» фильтр
    const wf = ctx.createBiquadFilter()
    wf.type = 'lowpass'; wf.frequency.value = 520; wf.Q.value = 0.8
    lfo(0.07, 320, wf.frequency)
    source('pink').connect(wf).connect(gains.wind)

    // Вода: коричневый шум в полосе ручья + журчание сверху
    const bf = ctx.createBiquadFilter()
    bf.type = 'bandpass'; bf.frequency.value = 900; bf.Q.value = 0.6
    source('brown').connect(bf).connect(gains.water)
    const hf = ctx.createBiquadFilter()
    hf.type = 'highpass'; hf.frequency.value = 2400
    const sparkle = ctx.createGain(); sparkle.gain.value = 0.12
    lfo(0.9, 0.08, sparkle.gain)
    source('pink').connect(hf).connect(sparkle).connect(gains.water)

    // Гул: низкий фон «внутри» модели объекта
    const lf = ctx.createBiquadFilter()
    lf.type = 'lowpass'; lf.frequency.value = 140
    source('brown').connect(lf).connect(gains.hum)
  }

  const apply = (time = 1.2) => {
    if (!ctx) return
    const mix = SCENES[scene] || SCENES.calm
    for (const k in gains) gains[k].gain.setTargetAtTime(mix[k], ctx.currentTime, time / 3)
  }

  const setScene = (name) => { scene = name; apply() }

  const toggle = async () => {
    if (!ctx) build()
    if (on.value) {
      master.gain.setTargetAtTime(0, ctx.currentTime, 0.2)
      on.value = false
    } else {
      await ctx.resume()
      apply(0.1)
      master.gain.setTargetAtTime(0.7, ctx.currentTime, 0.4)
      on.value = true
    }
  }

  const dispose = () => { ctx?.close(); ctx = null }

  return { on, toggle, setScene, dispose }
}
