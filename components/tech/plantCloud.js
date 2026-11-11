// Процедурное облако точек очистных сооружений ESP (как результат LiDAR-съёмки).
// Равнина: поля, лесополосы (сосна, берёза), площадка с ограждением, дороги,
// ПРЯМОУГОЛЬНЫЕ первичные отстойники, блок аэротенков, вторичные отстойники,
// иловые карты, здания, эстакада трубопроводов. Никаких круглых ёмкостей.
// Точки распределяются по площадям поверхностей (весовой сэмплинг) прямо
// в typed arrays: positions Float32 xyz, colors Uint8 rgba (a = случайное
// зерно для анимации сборки). Единицы — метры, Y вверх.
//
// ВАЖНО: функция полностью самодостаточна (без внешних ссылок) — её исходник
// передаётся в Web Worker через Function.toString().

export function buildPlantCloud({ count = 1500000, seed = 20260611 } = {}) {
  let s = seed >>> 0
  const rnd = () => {
    s = (s + 0x6d2b79f5) | 0
    let t = Math.imul(s ^ (s >>> 15), 1 | s)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
  const N = Math.max(2000, count | 0)
  const pos = new Float32Array(N * 3)
  const col = new Uint8Array(N * 4)
  let k = 0

  // ── палитра: фирменный синий (#0a3a8c → #2e7cf6 → белый), вода — бирюза ──
  const GROUND = [0.05, 0.15, 0.36]
  const FIELD_A = [0.04, 0.12, 0.3]
  const FIELD_B = [0.07, 0.2, 0.46]
  const PAD = [0.08, 0.2, 0.44]
  const ROAD = [0.24, 0.32, 0.48]
  const CONC = [0.18, 0.49, 0.96]
  const RIM = [0.6, 0.78, 1]
  const WATER = [0.12, 0.72, 0.86]
  const WATER2 = [0.1, 0.55, 0.78]
  const SLUDGE = [0.12, 0.22, 0.42]
  const METAL = [0.88, 0.94, 1]
  const WALL = [0.42, 0.62, 1]
  const GLASS = [0.1, 0.24, 0.6]
  const ROOF = [0.8, 0.9, 1]
  const PIPE = [0.35, 0.8, 1]
  const PINE = [0.1, 0.3, 0.62]
  const BIRCH = [0.2, 0.42, 0.78]
  const TRUNK = [0.16, 0.26, 0.48]
  const BIRCH_TRUNK = [0.7, 0.8, 0.95]

  const put = (x, y, z, c) => {
    if (k >= N) return
    const i = k * 3, j = k * 4
    pos[i] = x; pos[i + 1] = y; pos[i + 2] = z
    const h = y > 0.5 ? Math.min(1, y / 20) * 0.28 : 0
    const v = 0.8 + rnd() * 0.4
    col[j] = Math.min(255, (c[0] + (1 - c[0]) * h) * v * 255)
    col[j + 1] = Math.min(255, (c[1] + (1 - c[1]) * h) * v * 255)
    col[j + 2] = Math.min(255, (c[2] + (1 - c[2]) * h) * v * 255)
    col[j + 3] = rnd() * 255
    k++
  }

  // ── реестр поверхностей: площадь × вес → доля точек ──
  const prims = []
  const add = (area, w, fn) => { if (area > 0) prims.push({ a: area * w, fn }) }

  // параллелограмм o + u·a + v·b; mask(a,b) → цвет (или null — пропустить)
  const quad = (o, u, v, c, w = 1, mask) => {
    const cx = u[1] * v[2] - u[2] * v[1], cy = u[2] * v[0] - u[0] * v[2], cz = u[0] * v[1] - u[1] * v[0]
    add(Math.hypot(cx, cy, cz), w, (n) => {
      for (let i = 0; i < n; i++) {
        const a = rnd(), b = rnd()
        put(o[0] + u[0] * a + v[0] * b, o[1] + u[1] * a + v[1] * b, o[2] + u[2] * a + v[2] * b, mask ? mask(a, b) : c)
      }
    })
  }
  const hq = (x0, x1, z0, z1, y, c, w, m) => quad([x0, y, z0], [x1 - x0, 0, 0], [0, 0, z1 - z0], c, w, m)
  const wx = (x0, x1, z, y0, y1, c, w, m) => quad([x0, y0, z], [x1 - x0, 0, 0], [0, y1 - y0, 0], c, w, m)
  const wz = (z0, z1, x, y0, y1, c, w, m) => quad([x, y0, z0], [0, 0, z1 - z0], [0, y1 - y0, 0], c, w, m)

  // цилиндр по произвольной оси (трубы, перила, стойки)
  const cyl = (a, b, r, c, w = 1) => {
    const dx = b[0] - a[0], dy = b[1] - a[1], dz = b[2] - a[2]
    const L = Math.hypot(dx, dy, dz)
    if (!L) return
    const ax = dx / L, ay = dy / L, az = dz / L
    // ортонормальный базис
    let px = -az, py = 0, pz = ax
    if (Math.abs(ay) > 0.9) { px = 1; py = 0; pz = 0 }
    const pl = Math.hypot(px, py, pz); px /= pl; py /= pl; pz /= pl
    const qx = ay * pz - az * py, qy = az * px - ax * pz, qz = ax * py - ay * px
    add(6.2832 * r * L, w, (n) => {
      for (let i = 0; i < n; i++) {
        const t = rnd() * L, g = rnd() * 6.2832, cs = Math.cos(g) * r, sn = Math.sin(g) * r
        put(a[0] + ax * t + px * cs + qx * sn, a[1] + ay * t + py * cs + qy * sn, a[2] + az * t + pz * cs + qz * sn, c)
      }
    })
  }
  const rail = (a, b, c = METAL) => cyl(a, b, 0.04, c, 34)

  // ── рельеф: равнина Беларуси, перепад ±0.5 м ──
  const SX = 150, SZ = 112 // полуразмеры участка съёмки
  const PX = 80, PZ = 56 // площадка за ограждением
  const groundY = (x, z) => {
    const dx = Math.max(0, Math.abs(x) - PX), dz = Math.max(0, Math.abs(z) - PZ)
    const kk = Math.min(1, Math.hypot(dx, dz) / 20)
    return (0.45 * Math.sin(x * 0.031 + 1.3) * Math.cos(z * 0.027) + 0.25 * Math.sin(z * 0.06 + x * 0.017)) * kk
  }
  const foot = [] // пятна застройки — без земли под ними
  const isRoad = (x, z) =>
    (Math.abs(z + 8) < 3.5 && Math.abs(x) < PX - 4) ||
    (Math.abs(x - 6) < 3.5 && z > -8 && z < SZ) ||
    (Math.abs(x + 72) < 3 && Math.abs(z) < PZ - 4) ||
    (Math.abs(z - 8) < 3 && x > -72 && x < 6)

  add(SX * SZ * 4, 0.42, (n) => {
    for (let i = 0; i < n; i++) {
      let x = 0, z = 0, ok = false
      for (let tr = 0; tr < 12 && !ok; tr++) {
        x = (rnd() * 2 - 1) * SX; z = (rnd() * 2 - 1) * SZ
        const e = Math.max(Math.abs(x) / SX, Math.abs(z) / SZ)
        if (e > 0.78 && rnd() < (e - 0.78) / 0.22) continue // мягкий край съёмки
        ok = true
        for (let f = 0; f < foot.length; f++) {
          const F = foot[f]
          if (x > F[0] && x < F[1] && z > F[2] && z < F[3]) { ok = false; break }
        }
      }
      const inPad = Math.abs(x) < PX && Math.abs(z) < PZ
      let c
      if (isRoad(x, z)) c = ROAD
      else if (inPad) c = PAD
      else if (Math.abs(z) > PZ + 32 || Math.abs(x) > PX + 34) c = (Math.floor((x * 0.8 + z * 0.15) / 2.4) & 1) ? FIELD_A : FIELD_B // пашня полосами
      else c = GROUND
      put(x, groundY(x, z) + (rnd() - 0.5) * 0.06, z, c)
    }
  })

  // ── прямоугольная ёмкость: стены, борт, вода, перегородки, перила, мостик ──
  const tank = (cx, cz, w, d, o = {}) => {
    const h = o.h ?? 3.4, cells = o.cells ?? 1, water = o.water ?? WATER
    const x0 = cx - w / 2, x1 = cx + w / 2, z0 = cz - d / 2, z1 = cz + d / 2
    const wl = h - 0.6
    foot.push([x0 - 0.5, x1 + 0.5, z0 - 0.5, z1 + 0.5])
    wx(x0, x1, z0, 0, h, CONC, 1.5); wx(x0, x1, z1, 0, h, CONC, 1.5)
    wz(z0, z1, x0, 0, h, CONC, 1.5); wz(z0, z1, x1, 0, h, CONC, 1.5)
    wx(x0, x1, z0 + 0.35, wl, h, CONC, 1.5); wx(x0, x1, z1 - 0.35, wl, h, CONC, 1.5)
    wz(z0, z1, x0 + 0.35, wl, h, CONC, 1.5); wz(z0, z1, x1 - 0.35, wl, h, CONC, 1.5)
    hq(x0, x1, z0, z0 + 0.35, h, RIM, 6); hq(x0, x1, z1 - 0.35, z1, h, RIM, 6)
    hq(x0, x0 + 0.35, z0, z1, h, RIM, 6); hq(x1 - 0.35, x1, z0, z1, h, RIM, 6)
    const cw = d / cells
    const aer = o.aer
    hq(x0 + 0.35, x1 - 0.35, z0 + 0.35, z1 - 0.35, wl, water, 1.25, aer ? (a, b) => {
      // аэрация: пятна пузырей над решёткой диффузоров
      const u = (a * w) % 2.2 - 1.1, v = ((b * d) % (cw / 3)) - cw / 6
      return u * u + v * v < 0.35 ? RIM : water
    } : null)
    for (let c = 1; c < cells; c++) {
      const z = z0 + cw * c
      wx(x0, x1, z, wl, h, CONC, 1.5); hq(x0, x1, z - 0.2, z + 0.2, h, RIM, 6)
    }
    // перила по периметру
    for (const z of [z0 + 0.15, z1 - 0.15]) {
      rail([x0, h + 1.1, z], [x1, h + 1.1, z]); rail([x0, h + 0.55, z], [x1, h + 0.55, z])
      for (let x = x0; x <= x1 + 0.01; x += 2) rail([x, h, z], [x, h + 1.1, z])
    }
    for (const x of [x0 + 0.15, x1 - 0.15]) {
      rail([x, h + 1.1, z0], [x, h + 1.1, z1]); rail([x, h + 0.55, z0], [x, h + 0.55, z1])
      for (let z = z0; z <= z1 + 0.01; z += 2) rail([x, h, z], [x, h + 1.1, z])
    }
    // поперечные мостики (у отстойников — скребковый мост)
    for (const bf of o.bridges ?? [0.3]) {
      const bx = x0 + w * bf
      hq(bx - 0.8, bx + 0.8, z0 - 0.3, z1 + 0.3, h + 0.08, METAL, 7)
      for (const sd of [-0.8, 0.8]) {
        rail([bx + sd, h + 1.15, z0], [bx + sd, h + 1.15, z1])
        for (let z = z0; z <= z1 + 0.01; z += 1.6) rail([bx + sd, h, z], [bx + sd, h + 1.15, z])
      }
      if (o.scraper) wx(bx - 0.6, bx + 0.6, z0, h + 0.1, h + 1.6, METAL, 5) // привод скребка
    }
    if (o.pipe) cyl([x0, h + 0.5, z0 - 0.8], [x1, h + 0.5, z0 - 0.8], 0.3, PIPE, 3)
  }

  // ── здание: стены с окнами, кровля (двускатная или плоская с парапетом) ──
  const building = (cx, cz, w, d, h, o = {}) => {
    const x0 = cx - w / 2, x1 = cx + w / 2, z0 = cz - d / 2, z1 = cz + d / 2
    foot.push([x0, x1, z0, z1])
    const floors = Math.max(1, Math.floor(h / 3.4))
    const win = (len) => (a, b) => {
      const fy = (b * h) % (h / floors) / (h / floors), u = (a * len) % 3.2
      return fy > 0.35 && fy < 0.78 && u > 0.9 && u < 2.4 && a * len > 1.5 && a * len < len - 1.5 ? GLASS : WALL
    }
    wx(x0, x1, z0, 0, h, WALL, 1.4, win(w)); wx(x0, x1, z1, 0, h, WALL, 1.4, win(w))
    wz(z0, z1, x0, 0, h, WALL, 1.4, win(d)); wz(z0, z1, x1, 0, h, WALL, 1.4, win(d))
    if (o.flat) {
      hq(x0, x1, z0, z1, h, ROOF, 1.2)
      wx(x0, x1, z0, h, h + 0.7, WALL, 2); wx(x0, x1, z1, h, h + 0.7, WALL, 2)
      wz(z0, z1, x0, h, h + 0.7, WALL, 2); wz(z0, z1, x1, h, h + 0.7, WALL, 2)
      // вентустановки на кровле
      for (let i = 0; i < (o.units ?? 2); i++) {
        const ux = x0 + w * (0.25 + 0.5 * i / Math.max(1, (o.units ?? 2) - 1)), uz = cz
        hq(ux - 1.2, ux + 1.2, uz - 1, uz + 1, h + 1.6, METAL, 4)
        wx(ux - 1.2, ux + 1.2, uz - 1, h, h + 1.6, METAL, 4); wx(ux - 1.2, ux + 1.2, uz + 1, h, h + 1.6, METAL, 4)
        wz(uz - 1, uz + 1, ux - 1.2, h, h + 1.6, METAL, 4); wz(uz - 1, uz + 1, ux + 1.2, h, h + 1.6, METAL, 4)
      }
    } else {
      const r = o.ridge ?? Math.min(3, d * 0.18)
      // скаты вдоль X, свес 0.5 м
      quad([x0 - 0.5, h - 0.15, z0 - 0.5], [w + 1, 0, 0], [0, r + 0.15, d / 2 + 0.5], ROOF, 1.3)
      quad([x0 - 0.5, h - 0.15, z1 + 0.5], [w + 1, 0, 0], [0, r + 0.15, -d / 2 - 0.5], ROOF, 1.3)
      rail([x0 - 0.5, h + r, cz], [x1 + 0.5, h + r, cz], ROOF)
      // фронтоны (треугольники — отбраковкой половины параллелограмма)
      for (const x of [x0, x1]) {
        add(d * r / 2, 1.4, (n) => {
          for (let i = 0; i < n; i++) {
            let a = rnd(), b = rnd()
            if (a + b > 1) { a = 1 - a; b = 1 - b }
            put(x, h + b * r, z0 + a * d + b * d / 2, WALL)
          }
        })
      }
    }
    // ворота/двери
    if (o.gate) wx(cx - 2, cx + 2, z1 + 0.05, 0, 4, METAL, 3)
  }

  // ── деревья: сосна (конус) и берёза (эллипсоид, светлый ствол) ──
  const tree = (x, z, sc, pine) => {
    const y0 = groundY(x, z)
    const H = (pine ? 16 : 13) * sc * (0.85 + rnd() * 0.3)
    const R = pine ? H * 0.17 : H * 0.24
    cyl([x, y0, z], [x, y0 + H * (pine ? 0.55 : 0.45), z], 0.16 * sc, pine ? TRUNK : BIRCH_TRUNK, 3)
    if (pine) {
      const c0 = y0 + H * 0.45, ch = H * 0.55
      add(3.1416 * R * Math.hypot(R, ch), 0.75, (n) => {
        for (let i = 0; i < n; i++) {
          const t = Math.pow(rnd(), 1.4), rr = R * (1 - t) * Math.pow(rnd(), 0.25), g = rnd() * 6.2832
          put(x + Math.cos(g) * rr, c0 + t * ch, z + Math.sin(g) * rr, PINE)
        }
      })
    } else {
      const cy = y0 + H * 0.68
      add(4 * 3.1416 * R * R * 0.8, 0.75, (n) => {
        for (let i = 0; i < n; i++) {
          const g = rnd() * 6.2832, b = Math.acos(2 * rnd() - 1), rr = R * Math.pow(rnd(), 0.22)
          put(x + Math.sin(b) * Math.cos(g) * rr, cy + Math.cos(b) * rr * 1.3, z + Math.sin(b) * Math.sin(g) * rr, BIRCH)
        }
      })
    }
  }

  // ── генплан (поток воды запад → восток по южной половине) ──
  building(-64, -36, 16, 12, 7, { gate: true }) // здание решёток и песколовок
  tank(-42, -40, 20, 9, { h: 3, bridges: [0.5], scraper: true }) // первичные отстойники
  tank(-42, -27, 20, 9, { h: 3, bridges: [0.5], scraper: true })
  tank(-6, -32, 40, 30, { h: 3.8, cells: 4, aer: true, bridges: [0.22, 0.78], pipe: true }) // блок аэротенков
  for (const [x, z] of [[31, -40], [51, -40], [31, -26], [51, -26]]) tank(x, z, 18, 10, { h: 3.2, water: WATER2, bridges: [0.35], scraper: true }) // вторичные
  tank(70, -33, 7, 24, { h: 2.6, cells: 3, water: WATER, bridges: [] }) // контактный резервуар УФ
  // северная половина: вспомогательные здания и иловые карты
  building(-54, 32, 26, 14, 8.4, { ridge: 3 }) // АБК с лабораторией
  building(-22, 26, 16, 10, 6, { flat: true, units: 2 }) // воздуходувная станция
  building(62, 26, 18, 12, 9, { flat: true, units: 3, gate: true }) // цех обезвоживания осадка
  building(62, 46, 12, 8, 5, { ridge: 1.6 }) // склад реагентов
  building(6, 50, 5, 4, 3, { ridge: 1 }) // КПП
  for (let i = 0; i < 3; i++) for (let j = 0; j < 2; j++) { // иловые карты — низкие прямоугольные ячейки
    const cx = 16 + i * 12, cz = 22 + j * 15
    const x0 = cx - 5.5, x1 = cx + 5.5, z0 = cz - 6.5, z1 = cz + 6.5
    foot.push([x0, x1, z0, z1])
    hq(x0, x1, z0, z1, 0.25, SLUDGE, 0.9)
    wx(x0, x1, z0, 0, 1, CONC, 2); wx(x0, x1, z1, 0, 1, CONC, 2)
    wz(z0, z1, x0, 0, 1, CONC, 2); wz(z0, z1, x1, 0, 1, CONC, 2)
  }
  // эстакада трубопроводов вдоль технологической линии
  for (let x = -60; x <= 62; x += 6) {
    rail([x, 0, -15.6], [x, 3.6, -15.6], METAL); rail([x, 0, -12.4], [x, 3.6, -12.4], METAL)
    rail([x, 3.6, -15.6], [x, 3.6, -12.4], METAL)
  }
  cyl([-60, 4.0, -14.6], [62, 4.0, -14.6], 0.32, PIPE, 3)
  cyl([-60, 4.0, -13.4], [62, 4.0, -13.4], 0.22, PIPE, 3)
  cyl([-22, 4.0, 21], [-22, 4.0, -14], 0.35, PIPE, 3) // воздуховод от воздуходувной
  cyl([-60, 1.2, -36], [-52, 1.2, -36], 0.3, PIPE, 3)
  cyl([62, 1.2, 20], [62, 1.2, -21], 0.25, PIPE, 3) // подача осадка

  // ограждение площадки с воротами
  const fen = [[-PX, -PZ], [PX, -PZ], [PX, PZ], [-PX, PZ], [-PX, -PZ]]
  for (let sI = 0; sI < 4; sI++) {
    const [ax, az] = fen[sI], [bx, bz] = fen[sI + 1]
    const L = Math.hypot(bx - ax, bz - az)
    const seg = (t0, t1) => {
      const p = (t) => [ax + ((bx - ax) * t) / L, az + ((bz - az) * t) / L]
      const [x0, z0] = p(t0), [x1, z1] = p(t1)
      rail([x0, 2, z0], [x1, 2, z1]); rail([x0, 0.1, z0], [x1, 0.1, z1])
      quad([x0, 0.1, z0], [x1 - x0, 0, z1 - z0], [0, 1.9, 0], METAL, 0.18) // сетка
    }
    if (sI === 2) { seg(0, PX - 10); seg(PX - 2, L) } else seg(0, L) // ворота у въезда
    for (let t = 0; t <= L; t += 3) {
      const x = ax + ((bx - ax) * t) / L, z = az + ((bz - az) * t) / L
      if (sI === 2 && Math.abs(x - 6) < 4) continue
      rail([x, 0, z], [x, 2.1, z])
    }
  }

  // лесополосы вокруг площадки и группы деревьев
  for (let i = 0; i < 420; i++) {
    let x, z
    const side = rnd()
    if (side < 0.32) { x = (rnd() * 2 - 1) * (PX + 26); z = -(PZ + 6 + rnd() * 22) }
    else if (side < 0.58) { x = (rnd() * 2 - 1) * (PX + 26); z = PZ + 6 + rnd() * 22 }
    else if (side < 0.79) { x = -(PX + 6 + rnd() * 22); z = (rnd() * 2 - 1) * PZ }
    else { x = PX + 6 + rnd() * 22; z = (rnd() * 2 - 1) * PZ }
    if (Math.abs(x - 6) < 7 && z > 0) continue // въездная дорога
    tree(x, z, 0.8 + rnd() * 0.45, rnd() < 0.7)
  }
  for (let i = 0; i < 26; i++) tree(-72 + rnd() * 34, 44 + rnd() * 8, 0.6 + rnd() * 0.3, false) // берёзы у АБК
  for (let i = 0; i < 40; i++) tree(-SX * 0.7 + rnd() * 50, SZ * 0.55 + rnd() * 25, 0.9 + rnd() * 0.4, true) // перелесок

  // ── распределение точек пропорционально взвешенной площади ──
  let total = 0
  for (const p of prims) total += p.a
  let acc = 0, done = 0
  for (const p of prims) {
    acc += p.a
    const target = Math.round((acc / total) * N)
    const n = target - done
    if (n > 0) p.fn(n)
    done = target
  }
  // добивка (если где-то были отбраковки)
  while (k < N) put((rnd() * 2 - 1) * PX, 0, (rnd() * 2 - 1) * PZ, PAD)

  return { positions: pos, colors: col, count: k }
}
