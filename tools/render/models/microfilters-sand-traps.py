# ESP — барабанный микрофильтр (microfilters-sand-traps). Модель по CAD-рендеру public/images/equipment/microfilter.webp
# Запуск: Blender -b -P tools/render/models/microfilters-sand-traps.py [-- --save]
# Оси: X — вдоль барабана (0 = дальний торец, L = торец с приводом), Y — ширина (0 = лицевая открытая сторона), Z — вверх. Метры.
import bpy, bmesh, math, os, sys
from mathutils import Vector, Matrix

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.abspath(os.path.join(HERE, '..', '..', '..'))
SLUG = 'microfilters-sand-traps'

# ---------- габариты (подбор камеры + совмещение силуэта с вырезкой, IoU 0.93; высота рамы принята 1.2 м) ----------
L, W, H = 1.76, 1.25, 1.20     # рама
T = 0.06                       # квадратная труба рамы
DY, DZ, DR = 0.625, 0.556, 0.525  # ось и радиус барабана
DX0, DX1 = 0.10, 1.77          # барабан по длине
BX0, BX1, BY0, BY1, BH = 1.91, 3.16, -0.195, 0.25, 0.72   # выходная камера
KX, KY, KR = 3.08, 0.56, 0.15                            # корзина
import json as _json
globals().update(_json.loads(os.environ.get('ESP_PARAMS', '{}')))   # подстройка при подборе по силуэту
DX1 = L - 0.08

# ---------- геометрия: накопление в bmesh по именам объектов ----------
BM = {}
def bm_of(name):
    if name not in BM: BM[name] = bmesh.new()
    return BM[name]

def box(name, a, b):
    x0, y0, z0 = (min(a[i], b[i]) for i in range(3)); x1, y1, z1 = (max(a[i], b[i]) for i in range(3))
    bm = bm_of(name)
    vs = [bm.verts.new((x, y, z)) for x in (x0, x1) for y in (y0, y1) for z in (z0, z1)]
    idx = [(0, 1, 3, 2), (4, 6, 7, 5), (0, 4, 5, 1), (2, 3, 7, 6), (0, 2, 6, 4), (1, 5, 7, 3)]
    for f in idx: bm.faces.new([vs[i] for i in f])

def obox(name, c, ax, ay, az, sx, sy, sz):
    """ориентированный параллелепипед: центр c, оси ax/ay/az, полуразмеры."""
    bm = bm_of(name); c = Vector(c); ax, ay, az = Vector(ax).normalized(), Vector(ay).normalized(), Vector(az).normalized()
    vs = [bm.verts.new(c + ax * (sx * i) + ay * (sy * j) + az * (sz * k)) for i in (-1, 1) for j in (-1, 1) for k in (-1, 1)]
    idx = [(0, 1, 3, 2), (4, 6, 7, 5), (0, 4, 5, 1), (2, 3, 7, 6), (0, 2, 6, 4), (1, 5, 7, 3)]
    for f in idx: bm.faces.new([vs[i] for i in f])

def cyl(name, p0, p1, r, seg=24, cap=True, r1=None):
    bm = bm_of(name); p0, p1 = Vector(p0), Vector(p1); d = (p1 - p0).normalized()
    t = d.orthogonal().normalized(); u = d.cross(t)
    r1 = r if r1 is None else r1
    ring0 = [bm.verts.new(p0 + (t * math.cos(2 * math.pi * i / seg) + u * math.sin(2 * math.pi * i / seg)) * r) for i in range(seg)]
    ring1 = [bm.verts.new(p1 + (t * math.cos(2 * math.pi * i / seg) + u * math.sin(2 * math.pi * i / seg)) * r1) for i in range(seg)]
    for i in range(seg):
        j = (i + 1) % seg; bm.faces.new([ring0[i], ring0[j], ring1[j], ring1[i]])
    if cap:
        bm.faces.new(list(reversed(ring0))); bm.faces.new(ring1)

def tube(name, p0, p1, r, wall, seg=24):
    """труба с толщиной стенки (видимый торец)."""
    bm = bm_of(name); p0, p1 = Vector(p0), Vector(p1); d = (p1 - p0).normalized()
    t = d.orthogonal().normalized(); u = d.cross(t)
    R = []
    for p, rr in ((p0, r), (p1, r), (p1, r - wall), (p0, r - wall)):
        R.append([bm.verts.new(p + (t * math.cos(2 * math.pi * i / seg) + u * math.sin(2 * math.pi * i / seg)) * rr) for i in range(seg)])
    for k in range(4):
        a, b = R[k], R[(k + 1) % 4]
        for i in range(seg):
            j = (i + 1) % seg; bm.faces.new([a[i], a[j], b[j], b[i]])

def ring(name, c, axis, r_out, r_in, th, seg=32):
    a = Vector(axis).normalized(); c = Vector(c)
    tube(name, c - a * th / 2, c + a * th / 2, r_out, r_out - r_in, seg)

def ubeam_x(name, x0, x1, y_out, z0, h, b, t, outward):
    """швеллер вдоль X: стенка на y_out, полки внутрь (outward=+1 -> полки в +Y)."""
    s = outward
    box(name, (x0, y_out, z0), (x1, y_out + s * t, z0 + h))
    box(name, (x0, y_out, z0), (x1, y_out + s * b, z0 + t))
    box(name, (x0, y_out, z0 + h - t), (x1, y_out + s * b, z0 + h))

def ubeam_y(name, y0, y1, x_out, z0, h, b, t, outward):
    s = outward
    box(name, (x_out, y0, z0), (x_out + s * t, y1, z0 + h))
    box(name, (x_out, y0, z0), (x_out + s * b, y1, z0 + t))
    box(name, (x_out, y0, z0 + h - t), (x_out + s * b, y1, z0 + h))

def mesh_panel(name, o, u, v, lu, lv, pitch=0.05, w=0.004):
    """сварная сетка: o — угол, u/v — единичные направления в плоскости, lu/lv — размеры."""
    o, u, v = Vector(o), Vector(u).normalized(), Vector(v).normalized(); n = u.cross(v)
    nu = max(1, int(round(lu / pitch))); nv = max(1, int(round(lv / pitch)))
    for i in range(1, nu):
        c = o + u * (lu * i / nu) + v * (lv / 2)
        obox(name, c, u, v, n, w / 2, lv / 2, w / 2)
    for j in range(1, nv):
        c = o + v * (lv * j / nv) + u * (lu / 2) + n * w
        obox(name, c, u, v, n, lu / 2, w / 2, w / 2)

def panel_frame(name, o, u, v, lu, lv, s=0.03):
    o, u, v = Vector(o), Vector(u).normalized(), Vector(v).normalized(); n = u.cross(v)
    for c, hu, hv in ((o + u * (lu / 2) + v * (s / 2), lu / 2, s / 2), (o + u * (lu / 2) + v * (lv - s / 2), lu / 2, s / 2),
                      (o + u * (s / 2) + v * (lv / 2), s / 2, lv / 2), (o + u * (lu - s / 2) + v * (lv / 2), s / 2, lv / 2)):
        obox(name, c, u, v, n, hu, hv, s / 2)

def guard(o, u, v, lu, lv, frame='steel_guard_frame', mesh='steel_guard_mesh'):
    panel_frame(frame, o, u, v, lu, lv)
    mesh_panel(mesh, o, u, v, lu, lv)

X, Y, Z = (1, 0, 0), (0, 1, 0), (0, 0, 1)

# ================= РАМА =================
for (x, y) in ((0, 0), (L - T, 0), (0, W - T), (L - T, W - T)):
    box('steel_rama', (x, y, 0), (x + T, y + T, H))
for y in (0, W - T):
    box('steel_rama', (0, y, H - T), (L, y + T, H)); box('steel_rama', (0, y, 0), (L, y + T, T))
for x in (0, L - T):
    box('steel_rama', (x, 0, H - T), (x + T, W, H)); box('steel_rama', (x, 0, 0), (x + T, W, T))
# торцевые листы: дальний (фланцевая плита барабана) и ближний (под привод)
box('steel_wall', (-0.012, -0.01, -0.0), (0.0, W + 0.01, H))
box('steel_wall', (L, -0.01, 0.0), (L + 0.012, W + 0.01, H))
# раскосы по лицевой и задней стороне
def bar(name, a, b, wdt, th, side):
    a, b = Vector(a), Vector(b); d = (b - a).normalized(); n = Vector(side)
    obox(name, (a + b) / 2, d, n.cross(d), n, (b - a).length / 2, wdt / 2, th / 2)
bar('steel_rama', (0.03, -0.005, 1.13), (L - 0.03, -0.005, 0.98), 0.08, 0.01, Y)
bar('steel_rama', (0.03, W + 0.005, 1.14), (L - 0.03, W + 0.005, 0.74), 0.06, 0.01, Y)
# рым-проушины на верхних торцевых балках
for (x, y) in ((0.03, 0.13), (0.03, W - 0.23), (L - 0.03, W - 0.30), (L - 0.03, 0.06)):
    ring('steel_lug', (x, y, H + 0.09), X, 0.075, 0.045, 0.018)
    box('steel_lug', (x - 0.008, y - 0.05, H), (x + 0.008, y + 0.05, H + 0.03))

# ================= БАРАБАН =================
cyl('steel_cloth', (DX0, DY, DZ), (DX1, DY, DZ), DR, 64)          # фильтровальная ткань / обечайка
for x in (DX0, DX1 - 0.03):
    ring('steel_drum', (x + 0.015, DY, DZ), X, DR + 0.04, DR - 0.03, 0.03, 64)
    for i in range(20):
        a = 2 * math.pi * i / 20
        p = Vector((x - 0.002, DY + math.cos(a) * (DR + 0.02), DZ + math.sin(a) * (DR + 0.02)))
        cyl('steel_bolts', p, p + Vector((0.04, 0, 0)), 0.009, 10)
for i in range(8):   # продольные рёбра с болтами
    a = 2 * math.pi * (i + 0.5) / 8
    c = Vector((0, DY + math.cos(a) * (DR + 0.008), DZ + math.sin(a) * (DR + 0.008)))
    rad = Vector((0, math.cos(a), math.sin(a))); tan = Vector((0, -math.sin(a), math.cos(a)))
    obox('steel_drum', c + Vector(((DX0 + DX1) / 2, 0, 0)), X, tan, rad, (DX1 - DX0) / 2, 0.02, 0.008)
    for k in range(4):
        p = c + Vector((DX0 + (DX1 - DX0) * (k + 0.5) / 4, 0, 0)) + rad * 0.008
        cyl('steel_bolts', p, p + rad * 0.012, 0.011, 10)

# ================= ПРОМЫВОЧНЫЕ КОЛЛЕКТОРЫ =================
for (y, z) in ((0.35, 1.15), (0.50, 1.04)):
    cyl('steel_pipe', (0.02, y, z), (L + 0.06, y, z), 0.021, 16)
    for k in range(13):
        x = 0.10 + k * (L - 0.15) / 12
        cyl('steel_nozzle', (x - 0.018, y, z), (x + 0.018, y, z), 0.03, 16)
        cyl('steel_nozzle', (x, y, z), (x, y, z - 0.05), 0.011, 10)


# ================= ПРИВОД НА БЛИЖНЕМ ТОРЦЕ =================
MY, MZ = 0.14, 1.06
box('steel_gear', (L + 0.012, MY - 0.14, MZ - 0.16), (L + 0.12, MY + 0.14, MZ + 0.13))      # редуктор
cyl('steel_motor', (L + 0.12, MY, MZ), (L + 0.28, MY, MZ), 0.09, 32)
cyl('steel_motor', (L + 0.28, MY, MZ), (L + 0.33, MY, MZ), 0.095, 32)                       # кожух вентилятора
box('steel_motor', (L + 0.14, MY - 0.06, MZ + 0.075), (L + 0.25, MY + 0.06, MZ + 0.14))      # клеммная коробка
box('steel_gear', (L + 0.012, 0.87, 1.06), (L + 0.03, 1.01, 1.20))                          # коробка датчика уровня
cyl('steel_gear', (L + 0.012, 0.70, 1.10), (L + 0.08, 0.70, 1.10), 0.03, 16)

# ================= ВЫХОДНАЯ КАМЕРА С ЖЁЛОБОМ =================
box('steel_tank', (BX0, BY0, 0), (BX1, BY1, BH - 0.22))                 # закрытая часть
if BX0 > L + 0.02:
    box('steel_tank', (L + 0.012, 0.0, 0), (BX0, BY1, BH - 0.22))   # перемычка к торцу рамы
s = 0.004
box('steel_tank', (BX0, BY0, BH - 0.22), (BX1, BY0 + s, BH))             # лицевая стенка
box('steel_tank', (BX1 - s, BY0, BH - 0.22), (BX1, BY1 + 0.14, BH + 0.16))          # торцевая стенка с бортом
bar('steel_tank', (BX0, BY1 + 0.07, BH + 0.17), (BX1, BY1 + 0.07, BH + 0.13), 0.17, s, (0, 0.6, -0.8))   # наклонный борт жёлоба
               # дно жёлоба
cyl('black_pump', (2.95, 0.12, BH - 0.22), (2.95, 0.12, BH + 0.16), 0.07, 24)       # шламовый насос
# ================= КОРЗИНА (мешочный фильтр) =================
cyl('steel_basket', (KX, KY, 0.02), (KX, KY, 1.14), KR, 40)
ring('steel_basket', (KX, KY, 1.11), Z, KR + 0.008, KR - 0.01, 0.07, 40)
ring('steel_basket', (KX, KY, 0.03), Z, KR + 0.012, KR - 0.01, 0.05, 40)
for i in range(24):
    a = 2 * math.pi * i / 24
    p = Vector((KX + math.cos(a) * (KR + 0.009), KY + math.sin(a) * (KR + 0.009), 1.11))
    cyl('black_holes', p, p + Vector((math.cos(a), math.sin(a), 0)) * 0.002, 0.007, 8)
for sgn in (-1, 1):   # две П-образные ручки
    a = Vector((KX - 0.13, KY + sgn * 0.075, 1.14)); b = Vector((KX + 0.13, KY + sgn * 0.075, 1.14))
    cyl('steel_handle', a, a + Vector((0, 0, 0.22)), 0.008, 10); cyl('steel_handle', b, b + Vector((0, 0, 0.22)), 0.008, 10)
    cyl('steel_handle', a + Vector((0, 0, 0.22)), b + Vector((0, 0, 0.22)), 0.008, 10)

# ---------- сборка объектов ----------
def build_objects():
    objs = []
    for name, bm in BM.items():
        if os.environ.get('ESP_NOMESH') and 'mesh' in name: continue
        me = bpy.data.meshes.new(name); bm.to_mesh(me); bm.free()
        ob = bpy.data.objects.new(name, me); bpy.context.scene.collection.objects.link(ob); objs.append(ob)
        if not any(k in name for k in ('mesh', 'slots', 'belt', 'bolts', 'cloth', 'nozzle')):
            m = ob.modifiers.new('Bevel', 'BEVEL'); m.width = 0.003; m.segments = 2; m.limit_method = 'ANGLE'
    return objs

def materials(objs):
    def mat(name, rgb, metal, rough):
        m = bpy.data.materials.get(name) or bpy.data.materials.new(name); m.use_nodes = True
        b = m.node_tree.nodes['Principled BSDF']
        b.inputs['Base Color'].default_value = (*rgb, 1); b.inputs['Metallic'].default_value = metal; b.inputs['Roughness'].default_value = rough
        return m
    M = {'steel': mat('ESP_Steel', (0.78, 0.79, 0.8), 1.0, 0.26), 'galv': mat('ESP_Galv', (0.6, 0.62, 0.63), 0.9, 0.45),
         'black': mat('ESP_Black', (0.03, 0.03, 0.035), 0.0, 0.5), 'blue': mat('ESP_Blue', (0.02, 0.09, 0.32), 0.0, 0.35)}
    for o in objs:
        o.data.materials.append(M.get(o.name.split('_')[0], M['steel']))
        for p in o.data.polygons: p.use_smooth = False

BM_KEYS = list(BM.keys())
bpy.ops.wm.read_factory_settings(use_empty=True)
OBJS = build_objects(); materials(OBJS)

if '--save' in sys.argv:
    bpy.ops.wm.save_as_mainfile(filepath=os.path.join(HERE, SLUG + '.blend'))
    os.makedirs(os.path.join(ROOT, 'public', 'models'), exist_ok=True)
    bpy.ops.export_scene.gltf(filepath=os.path.join(ROOT, 'public', 'models', SLUG + '.glb'), export_format='GLB',
                              export_apply=True, export_yup=True)
