// Процедурное облако точек очистных сооружений (как результат LiDAR-съёмки):
// рельеф, дороги, прямоугольные аэротенки и отстойники с мостиками и
// перилами, здания с двускатной кровлей, трубопроводы, ограждение и деревья.
// Только прямоугольные сооружения. Единицы — метры, Y вверх.

const mulberry = (seed) => () => {
  seed |= 0; seed = (seed + 0x6d2b79f5) | 0
  let t = Math.imul(seed ^ (seed >>> 15), 1 | seed)
  t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296
}

export function buildPlantCloud({ density = 1 } = {}) {
  const rnd = mulberry(20260611)
  const P = []
  const C = []
  const jit = (a) => (rnd() - 0.5) * a
  const push = (x, y, z, c, v = 0.06) => {
    P.push(x, y, z)
    const k = 1 + jit(v * 2)
    C.push(Math.min(1, c[0] * k), Math.min(1, c[1] * k), Math.min(1, c[2] * k))
  }
  const n = (area, perM2) => Math.max(1, Math.round(area * perM2 * density))

  // --- палитра (линейные 0..1) ---
  const GRASS = [0.33, 0.52, 0.27]
  const GRASS2 = [0.42, 0.58, 0.3]
  const SOIL = [0.48, 0.42, 0.32]
  const ROAD = [0.5, 0.52, 0.55]
  const CONC = [0.78, 0.79, 0.8]
  const WATER = [0.16, 0.36, 0.55]
  const WATER2 = [0.32, 0.5, 0.42]
  const METAL = [0.86, 0.88, 0.9]
  const WALL = [0.92, 0.93, 0.94]
  const ROOF = [0.12, 0.38, 0.78]
  const PIPE = [0.2, 0.45, 0.85]
  const TRUNK = [0.36, 0.27, 0.2]
  const PINE = [0.14, 0.32, 0.18]
  const LEAF = [0.24, 0.44, 0.22]

  // --- рельеф: пологие холмы снаружи площадки, ровная площадка внутри ---
  const SX = 130, SZ = 95 // полуразмеры участка
  const PX = 78, PZ = 54 // полуразмеры площадки
  const hill = (x, z) => 2.2 * Math.sin(x * 0.035 + 1.3) * Math.cos(z * 0.04) + 1.2 * Math.sin(z * 0.07 + x * 0.02)
  const groundY = (x, z) => {
    const dx = Math.max(0, Math.abs(x) - PX), dz = Math.max(0, Math.abs(z) - PZ)
    const d = Math.hypot(dx, dz)
    const k = Math.min(1, d / 22)
    return hill(x, z) * k * k
  }
  const isRoad = (x, z) =>
    (Math.abs(z + 3) < 3.5 && Math.abs(x) < PX) || // центральный проезд
    (Math.abs(x + 42) < 3 && Math.abs(z) < PZ) || // поперечный проезд
    (Math.abs(x - 6) < 3 && z > 30 && z < SZ) // въезд
  for (let i = 0, N = n(SX * SZ * 4, 1.5); i < N; i++) {
    const x = jit(SX * 2), z = jit(SZ * 2)
    const y = groundY(x, z)
    const inPad = Math.abs(x) < PX && Math.abs(z) < PZ
    const c = isRoad(x, z) ? ROAD : inPad ? (rnd() < 0.5 ? GRASS2 : GRASS) : (rnd() < 0.12 ? SOIL : GRASS)
    push(x, y + jit(0.08), z, c, 0.1)
  }

  // площадка плотнее (там объект съёмки)
  for (let i = 0, N = n(PX * PZ * 4, 1.8); i < N; i++) {
    const x = jit(PX * 2), z = jit(PZ * 2)
    push(x, jit(0.06), z, isRoad(x, z) ? ROAD : (rnd() < 0.5 ? GRASS2 : GRASS), 0.08)
  }

  // --- примитивы ---
  const rectH = (x0, x1, z0, z1, y, c, d = 2) => { // горизонтальная плоскость
    for (let i = 0, N = n((x1 - x0) * (z1 - z0), d); i < N; i++) push(x0 + rnd() * (x1 - x0), y, z0 + rnd() * (z1 - z0), c)
  }
  const wallX = (x0, x1, z, y0, y1, c, d = 3) => { // стена вдоль X
    for (let i = 0, N = n((x1 - x0) * (y1 - y0), d); i < N; i++) push(x0 + rnd() * (x1 - x0), y0 + rnd() * (y1 - y0), z, c)
  }
  const wallZ = (z0, z1, x, y0, y1, c, d = 3) => {
    for (let i = 0, N = n((z1 - z0) * (y1 - y0), d); i < N; i++) push(x, y0 + rnd() * (y1 - y0), z0 + rnd() * (z1 - z0), c)
  }
  const line = (a, b, c, step = 0.12) => { // отрезок (перила, трубы, стойки)
    const L = Math.hypot(b[0] - a[0], b[1] - a[1], b[2] - a[2])
    for (let i = 0, N = Math.max(2, Math.round((L / step) * density)); i <= N; i++) {
      const t = i / N
      push(a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t, c, 0.03)
    }
  }
  const pipe = (a, b, r, c) => { // цилиндр вдоль отрезка (оси X или Z)
    const L = Math.hypot(b[0] - a[0], b[2] - a[2])
    const alongX = Math.abs(b[0] - a[0]) > Math.abs(b[2] - a[2])
    for (let i = 0, N = n(L * r * 6.28, 6); i < N; i++) {
      const t = rnd(), ang = rnd() * Math.PI * 2
      const x = a[0] + (b[0] - a[0]) * t, z = a[2] + (b[2] - a[2]) * t, y = a[1] + Math.sin(ang) * r
      push(alongX ? x : x + Math.cos(ang) * r, y, alongX ? z + Math.cos(ang) * r : z, c)
    }
  }

  // Прямоугольная ёмкость: стены над землёй, борт, вода, перегородки, мостик с перилами
  const tank = (cx, cz, w, d, { h = 3.2, cells = 1, water = WATER, bridge = true } = {}) => {
    const x0 = cx - w / 2, x1 = cx + w / 2, z0 = cz - d / 2, z1 = cz + d / 2, top = h
    wallX(x0, x1, z0, 0, top, CONC); wallX(x0, x1, z1, 0, top, CONC)
    wallZ(z0, z1, x0, 0, top, CONC); wallZ(z0, z1, x1, 0, top, CONC)
    // борт шириной 0.5 м
    rectH(x0 - 0.5, x1 + 0.5, z0 - 0.5, z0, top, CONC, 5); rectH(x0 - 0.5, x1 + 0.5, z1, z1 + 0.5, top, CONC, 5)
    rectH(x0 - 0.5, x0, z0, z1, top, CONC, 5); rectH(x1, x1 + 0.5, z0, z1, top, CONC, 5)
    rectH(x0, x1, z0, z1, top - 0.7, water, 4) // зеркало воды
    for (let k = 1; k < cells; k++) { // продольные перегородки
      const z = z0 + (d * k) / cells
      wallX(x0, x1, z, top - 0.7, top, CONC, 4); rectH(x0, x1, z - 0.2, z + 0.2, top, CONC, 6)
    }
    if (bridge) { // поперечный мостик через ёмкость
      const bx = cx + w * 0.18
      rectH(bx - 0.8, bx + 0.8, z0 - 0.5, z1 + 0.5, top + 0.05, METAL, 8)
      for (const s of [-0.8, 0.8]) {
        line([bx + s, top + 1.1, z0 - 0.5], [bx + s, top + 1.1, z1 + 0.5], METAL)
        line([bx + s, top + 0.55, z0 - 0.5], [bx + s, top + 0.55, z1 + 0.5], METAL, 0.2)
        for (let z = z0; z <= z1 + 0.1; z += 2) line([bx + s, top, z], [bx + s, top + 1.1, z], METAL, 0.15)
      }
    }
    // перила по периметру
    for (const z of [z0 - 0.3, z1 + 0.3]) line([x0, top + 1.1, z], [x1, top + 1.1, z], METAL, 0.18)
    for (const x of [x0 - 0.3, x1 + 0.3]) line([x, top + 1.1, z0], [x, top + 1.1, z1], METAL, 0.18)
    // трубопровод вдоль длинной стороны
    pipe([x0, top + 0.4, z0 - 1.2], [x1, top + 0.4, z0 - 1.2], 0.35, PIPE)
  }

  // Здание: стены с проёмами окон, двускатная кровля
  const building = (cx, cz, w, d, h, { ridge = 2.2, roof = ROOF } = {}) => {
    const x0 = cx - w / 2, x1 = cx + w / 2, z0 = cz - d / 2, z1 = cz + d / 2
    const win = (u, y) => (y > h * 0.35 && y < h * 0.75 && (u % 4) > 1.2 && (u % 4) < 2.8)
    for (let i = 0, N = n((w + d) * 2 * h, 3.2); i < N; i++) {
      const y = rnd() * h
      const side = rnd() * (w + d) * 2
      let x, z, u
      if (side < w) { x = x0 + side; z = z0; u = side } else if (side < w * 2) { x = x0 + side - w; z = z1; u = side - w } else if (side < w * 2 + d) { x = x0; z = z0 + side - w * 2; u = side - w * 2 } else { x = x1; z = z0 + side - w * 2 - d; u = side - w * 2 - d }
      if (win(u, y)) continue
      push(x, y, z, WALL)
    }
    // двускатная кровля по длинной оси X
    for (let i = 0, N = n(w * d * 1.1, 3.5); i < N; i++) {
      const x = x0 - 0.4 + rnd() * (w + 0.8), t = rnd() * 2 - 1
      const z = cz + t * (d / 2 + 0.4)
      push(x, h + ridge * (1 - Math.abs(t)), z, roof)
    }
    // фронтоны
    for (const x of [x0, x1]) for (let i = 0, N = n(d * ridge * 0.5, 3); i < N; i++) {
      const t = rnd() * 2 - 1, yy = rnd() * ridge * (1 - Math.abs(t))
      push(x, h + yy, cz + t * d / 2, WALL)
    }
  }

  // Дерево: хвойное (конус) или лиственное (эллипсоид)
  const tree = (x, z, s = 1, pine = rnd() < 0.65) => {
    const y0 = groundY(x, z)
    const H = (pine ? 11 : 8) * s * (0.8 + rnd() * 0.4)
    line([x, y0, z], [x, y0 + H * 0.35, z], TRUNK, 0.15)
    const N = Math.round(260 * s * s * density)
    for (let i = 0; i < N; i++) {
      if (pine) {
        const t = Math.pow(rnd(), 0.8), r = (1 - t) * H * 0.28 * Math.sqrt(rnd()), a = rnd() * 6.283
        push(x + Math.cos(a) * r, y0 + H * 0.22 + t * H * 0.78, z + Math.sin(a) * r, PINE, 0.15)
      } else {
        const a = rnd() * 6.283, b = Math.acos(2 * rnd() - 1), r = H * 0.3 * Math.cbrt(rnd())
        push(x + Math.sin(b) * Math.cos(a) * r, y0 + H * 0.62 + Math.cos(b) * r * 0.8, z + Math.sin(b) * Math.sin(a) * r, LEAF, 0.15)
      }
    }
  }

  // --- генплан ---
  // блок аэротенков: 2 ряда по 2 секции, коридорные перегородки
  for (let r = 0; r < 2; r++) for (let k = 0; k < 2; k++) tank(-18 + k * 36, -32 + r * 17, 32, 13, { cells: 3, h: 3.6 })
  // вторичные отстойники (прямоугольные)
  for (let k = 0; k < 3; k++) tank(-26 + k * 22, 14, 20, 11, { cells: 1, h: 3, water: WATER2 })
  // пруды-накопители очищенной воды
  tank(52, 34, 30, 16, { cells: 2, h: 2.2, water: WATER, bridge: false })
  tank(52, 12, 30, 16, { cells: 2, h: 2.2, water: WATER, bridge: false })
  // производственно-вспомогательный корпус, воздуходувная, КПП, блок УФ
  building(-60, 28, 24, 14, 7.5)
  building(42, -36, 14, 9, 5, { ridge: 1.4 })
  building(-62, -32, 12, 10, 5.5, { ridge: 1.4 })
  building(14, 46, 6, 5, 3, { ridge: 0.8 })
  // магистральный трубопровод между сооружениями
  pipe([-34, 1.2, -7], [60, 1.2, -7], 0.45, PIPE)
  pipe([-60, 1.2, 21], [-60, 1.2, -24], 0.4, PIPE)

  // ограждение площадки
  const fence = [[-PX, -PZ], [PX, -PZ], [PX, PZ], [-PX, PZ], [-PX, -PZ]]
  for (let s = 0; s < 4; s++) {
    const [ax, az] = fence[s], [bx, bz] = fence[s + 1]
    const L = Math.hypot(bx - ax, bz - az)
    for (let t = 0; t <= L; t += 3) {
      const x = ax + ((bx - ax) * t) / L, z = az + ((bz - az) * t) / L
      if (Math.abs(x - 6) < 4 && z > PZ - 1) continue // ворота
      line([x, 0, z], [x, 2, z], METAL, 0.12)
    }
    line([ax, 2, az], [bx, 2, bz], METAL, 0.25)
    line([ax, 1, az], [bx, 1, bz], METAL, 0.35)
  }

  // деревья: лесополоса вокруг, группы внутри
  for (let i = 0; i < 150; i++) {
    const a = rnd() * 6.283
    const rx = PX + 8 + rnd() * (SX - PX - 12), rz = PZ + 8 + rnd() * (SZ - PZ - 12)
    let x = Math.cos(a) * rx, z = Math.sin(a) * rz
    if (Math.abs(x - 6) < 8 && z > 0) x += 16 // не сажаем на въезд
    tree(x, z, 0.8 + rnd() * 0.5)
  }
  for (let i = 0; i < 18; i++) tree(-74 + rnd() * 6, -50 + rnd() * 100, 0.6 + rnd() * 0.3, false)

  return { positions: new Float32Array(P), colors: new Float32Array(C), count: P.length / 3 }
}
