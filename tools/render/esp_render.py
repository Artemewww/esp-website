"""Рендеры оборудования ESP в подаче DJI из CAD-моделей.

Запуск:
  blender -b -P tools/render/esp_render.py -- <model.stl|obj|glb|fbx|demo> <out_dir> [presets] [samples]

presets через запятую: light,dark,field (по умолчанию все три).
  light — светлая бесшовная студия, ракурс 3/4 сверху (плитки DJI, 16:10)
  dark  — тёмная студия с верхним прожектором, низкий фронтальный ракурс (баннер 21:9)
  field — низкий ракурс 3/4, изделие в правой трети, слева воздух под заголовок
          (баннеры Agras), свет — встроенное «лесное» HDRI, тень на ловушке теней;
          фон потом подставляется настоящим кадром белорусской станции.
Модель масштабируется по габариту, ставится на пол и центрируется. Материалы:
нержавейка — по умолчанию, оцинковка и синяя краска — по имени объекта
(galv*, frame*, blue*, paint*).
"""
import bpy, sys, math, os
from mathutils import Vector

argv = sys.argv[sys.argv.index('--') + 1:] if '--' in sys.argv else []
model = argv[0] if argv else 'demo'
out_dir = argv[1] if len(argv) > 1 else '/tmp/esp_render'
presets = (argv[2] if len(argv) > 2 else 'light,dark,field').split(',')
samples = int(argv[3]) if len(argv) > 3 else 96
os.makedirs(out_dir, exist_ok=True)

bpy.ops.wm.read_factory_settings(use_empty=True)
scene = bpy.context.scene
scene.render.engine = 'CYCLES'
scene.cycles.samples = samples
scene.cycles.use_denoising = True
try:
    prefs = bpy.context.preferences.addons['cycles'].preferences
    prefs.compute_device_type = 'METAL'
    prefs.get_devices()
    for d in prefs.devices: d.use = True
    scene.cycles.device = 'GPU'
except Exception:
    pass
scene.view_settings.view_transform = 'AgX'
scene.view_settings.look = 'AgX - Medium High Contrast'

# ---------- материалы ----------
def mat_steel():
    m = bpy.data.materials.new('ESP_Steel'); m.use_nodes = True
    b = m.node_tree.nodes['Principled BSDF']
    b.inputs['Base Color'].default_value = (0.78, 0.79, 0.8, 1)
    b.inputs['Metallic'].default_value = 1.0
    b.inputs['Roughness'].default_value = 0.26
    if 'Anisotropic' in b.inputs: b.inputs['Anisotropic'].default_value = 0.6
    return m

def mat_galv():
    m = bpy.data.materials.new('ESP_Galv'); m.use_nodes = True
    b = m.node_tree.nodes['Principled BSDF']
    b.inputs['Base Color'].default_value = (0.6, 0.62, 0.63, 1)
    b.inputs['Metallic'].default_value = 0.9
    b.inputs['Roughness'].default_value = 0.45
    return m

def mat_paint(rgb):
    m = bpy.data.materials.new('ESP_Paint'); m.use_nodes = True
    b = m.node_tree.nodes['Principled BSDF']
    b.inputs['Base Color'].default_value = (*rgb, 1)
    b.inputs['Roughness'].default_value = 0.35
    return m

STEEL, GALV, BLUE = mat_steel(), mat_galv(), mat_paint((0.02, 0.09, 0.32))
BLACK, ORANGE, PP = mat_paint((0.02, 0.02, 0.022)), mat_paint((0.9, 0.35, 0.05)), mat_paint((0.12, 0.13, 0.14))

# ---------- модель ----------
def load_model(path):
    ext = os.path.splitext(path)[1].lower()
    before = set(bpy.data.objects)
    if ext == '.stl': bpy.ops.wm.stl_import(filepath=path)
    elif ext == '.obj': bpy.ops.wm.obj_import(filepath=path)
    elif ext in ('.glb', '.gltf'): bpy.ops.import_scene.gltf(filepath=path)
    elif ext == '.fbx': bpy.ops.import_scene.fbx(filepath=path)
    else: raise SystemExit('unsupported ' + ext)
    return [o for o in bpy.data.objects if o not in before and o.type == 'MESH']

def demo_model():
    """Временная модель: ёмкость на раме — только для проверки конвейера."""
    objs = []
    bpy.ops.mesh.primitive_cube_add(size=1, location=(0, 0, 0.75)); t = bpy.context.object; t.scale = (2.4, 1.0, 0.7); t.name = 'tank'; objs.append(t)
    bpy.ops.object.modifier_add(type='BEVEL'); t.modifiers['Bevel'].width = 0.02
    for x in (-1.1, 1.1):
        for y in (-0.45, 0.45):
            bpy.ops.mesh.primitive_cylinder_add(radius=0.035, depth=0.4, location=(x, y, 0.2)); l = bpy.context.object; l.name = 'frame_leg'; objs.append(l)
    bpy.ops.mesh.primitive_cylinder_add(radius=0.03, depth=2.4, location=(0, -0.55, 1.35), rotation=(0, math.pi / 2, 0)); r = bpy.context.object; r.name = 'galv_rail'; objs.append(r)
    return objs

objs = demo_model() if model == 'demo' else load_model(model)
for o in objs:
    n = o.name.lower()
    m = GALV if ('galv' in n or 'frame' in n) else BLUE if ('blue' in n or 'paint' in n) else BLACK if 'black' in n else ORANGE if 'orange' in n else PP if n.startswith('pp') else STEEL
    o.data.materials.clear(); o.data.materials.append(m)
    bpy.context.view_layer.objects.active = o
    o.select_set(True)
    try: bpy.ops.object.shade_auto_smooth()
    except Exception: pass

# Габарит → масштаб к ~3 м по длинной стороне, на пол, в центр
pts = [o.matrix_world @ Vector(c) for o in objs for c in o.bound_box]
mn = Vector((min(p.x for p in pts), min(p.y for p in pts), min(p.z for p in pts)))
mx = Vector((max(p.x for p in pts), max(p.y for p in pts), max(p.z for p in pts)))
size = mx - mn
k = 3.0 / max(size.x, size.y, size.z)
root = bpy.data.objects.new('ESP_root', None); scene.collection.objects.link(root)
for o in objs: o.parent = root
root.scale = (k, k, k)
root.location = (-(mn.x + size.x / 2) * k, -(mn.y + size.y / 2) * k, -mn.z * k)
H = size.z * k

# ---------- окружение ----------
def world_color(rgb, strength=1.0):
    w = bpy.data.worlds.new('W'); scene.world = w; w.use_nodes = True
    bg = w.node_tree.nodes['Background']; bg.inputs[0].default_value = (*rgb, 1); bg.inputs[1].default_value = strength

def world_hdri(name, strength=1.0, rot=0.0):
    w = bpy.data.worlds.new('W'); scene.world = w; w.use_nodes = True
    nt = w.node_tree
    env = nt.nodes.new('ShaderNodeTexEnvironment')
    lib = os.path.join(bpy.utils.resource_path('LOCAL'), 'datafiles', 'studiolights', 'world', name)
    env.image = bpy.data.images.load(lib)
    mp = nt.nodes.new('ShaderNodeMapping'); tc = nt.nodes.new('ShaderNodeTexCoord')
    mp.inputs['Rotation'].default_value[2] = rot
    nt.links.new(tc.outputs['Generated'], mp.inputs['Vector']); nt.links.new(mp.outputs['Vector'], env.inputs['Vector'])
    nt.links.new(env.outputs['Color'], nt.nodes['Background'].inputs['Color'])
    nt.nodes['Background'].inputs['Strength'].default_value = strength

def cyclorama(rgb, rough=0.6):
    bpy.ops.mesh.primitive_plane_add(size=40, location=(0, 4, 0)); p = bpy.context.object
    bpy.ops.object.mode_set(mode='EDIT'); bpy.ops.mesh.subdivide(number_cuts=20); bpy.ops.object.mode_set(mode='OBJECT')
    for v in p.data.vertices:
        if v.co.y > 0: v.co.z = (v.co.y ** 2) / 4.0
    m = bpy.data.materials.new('Cyc'); m.use_nodes = True
    b = m.node_tree.nodes['Principled BSDF']; b.inputs['Base Color'].default_value = (*rgb, 1); b.inputs['Roughness'].default_value = rough
    p.data.materials.append(m)
    bpy.ops.object.shade_smooth()
    return p

def area(name, loc, rot, size, energy, color=(1, 1, 1)):
    l = bpy.data.lights.new(name, 'AREA'); l.size = size; l.energy = energy; l.color = color
    o = bpy.data.objects.new(name, l); o.location = loc; o.rotation_euler = rot; scene.collection.objects.link(o)
    return o

def camera(loc, look, lens, res, name='Cam'):
    c = bpy.data.cameras.new(name); c.lens = lens
    o = bpy.data.objects.new(name, c); scene.collection.objects.link(o); o.location = loc
    d = Vector(look) - Vector(loc); o.rotation_euler = d.to_track_quat('-Z', 'Y').to_euler()
    scene.camera = o
    scene.render.resolution_x, scene.render.resolution_y = res
    return o

from bpy_extras.object_utils import world_to_camera_view

def fit(cam, box, look):
    """Ставит камеру на линии взгляда на таком расстоянии, чтобы изделие было
    максимально крупным, но все углы габарита входили в рамку
    box=(x0, x1, y0, y1) в долях кадра (y снизу). Двоичный поиск."""
    corners = [o.matrix_world @ Vector(c) for o in objs for c in o.bound_box]
    look = Vector(look)
    d = (cam.location - look).normalized()
    def ok(dist):
        cam.location = look + d * dist
        bpy.context.view_layer.update()
        for c in corners:
            p = world_to_camera_view(scene, cam, c)
            if not (p.z > 0 and box[0] <= p.x <= box[1] and box[2] <= p.y <= box[3]):
                return False
        return True
    lo, hi = 0.5, 200.0
    for _ in range(40):
        mid = (lo + hi) / 2
        if ok(mid): hi = mid
        else: lo = mid
    ok(hi)

def render(name):
    scene.render.filepath = os.path.join(out_dir, name + '.png')
    bpy.ops.render.render(write_still=True)

def clear(keep):
    for o in list(scene.objects):
        if o not in keep and o.name != 'ESP_root' and o.parent is None and o.type in ('MESH', 'LIGHT', 'CAMERA'):
            if o.name.startswith('ESP_'): continue
            if o in objs: continue
            bpy.data.objects.remove(o, do_unlink=True)

base = set(scene.objects)
cz = H * 0.45
CENTER = Vector((0, 0, cz))

def orbit(az, el, lens, res, box, shift_x=0.0, look_z=1.0):
    """Камера на орбите вокруг изделия: az — азимут от фронта (−Y), el — высота
    в градусах. shift_x сдвигает изделие в кадре (минус — вправо). Потом fit."""
    look = Vector((0, 0, cz * look_z))
    a, e = math.radians(az), math.radians(el)
    pos = look + Vector((math.sin(a) * math.cos(e), -math.cos(a) * math.cos(e), math.sin(e))) * 12
    c = camera(tuple(pos), tuple(look), lens, res)
    c.data.shift_x = shift_x
    fit(c, box, tuple(look))
    return c

# Лёгкое студийное окружение — даёт стали отражения, в кадре его не видно
def studio_reflections(strength):
    world_hdri('studio.exr', strength, math.radians(20))

if 'light' in presets:
    # Светлая бесшовная студия DJI: 3/4 сверху, мягкий верхний свет
    cyclorama((0.72, 0.73, 0.75), 0.5)
    studio_reflections(0.35)
    scene.view_settings.exposure = -0.6
    area('Key', (-5, -4, 6.5), (math.radians(45), 0, math.radians(-50)), 7, 1400)
    area('Fill', (6, -3, 3.5), (math.radians(70), 0, math.radians(60)), 6, 350)
    area('Top', (0, 1.5, 8), (0, 0, 0), 10, 700)
    orbit(35, 24, 70, (1600, 1000), (0.08, 0.92, 0.1, 0.78))
    render('light')
    clear(base); scene.view_settings.exposure = 0

if 'dark' in presets:
    # Тёмная студия как DJI Dock 4: верхний прожектор, сдержанный контровой свет
    cyclorama((0.008, 0.009, 0.011), 0.32)
    studio_reflections(0.08)
    area('Spot', (0, -0.4, 6), (0, 0, 0), 1.8, 1500, (0.95, 0.97, 1.0))
    area('RimL', (-5, 4, 3.5), (math.radians(65), 0, math.radians(-128)), 2.5, 380, (0.75, 0.85, 1.0))
    area('RimR', (5, 4, 3.5), (math.radians(65), 0, math.radians(128)), 2.5, 380, (0.75, 0.85, 1.0))
    orbit(28, 9, 70, (2100, 900), (0.14, 0.86, 0.1, 0.66), look_z=1.0)
    render('dark')
    clear(base)

if 'field' in presets:
    # Баннер как Agras: низкий ракурс 3/4, изделие справа, слева воздух под текст;
    # фон прозрачный — под него ставится настоящий кадр белорусской станции
    world_hdri('forest.exr', 1.1, math.radians(30))
    bpy.ops.mesh.primitive_plane_add(size=80); g = bpy.context.object; g.is_shadow_catcher = True
    scene.render.film_transparent = True
    sun = bpy.data.lights.new('Sun', 'SUN'); sun.energy = 3.0; sun.angle = math.radians(3); sun.color = (1.0, 0.97, 0.93)
    so = bpy.data.objects.new('Sun', sun); so.rotation_euler = (math.radians(58), 0, math.radians(-40)); scene.collection.objects.link(so)
    scene.view_settings.exposure = -0.35
    orbit(-32, 4, 50, (2100, 900), (0.48, 0.92, 0.06, 0.8), shift_x=-0.24, look_z=1.1)
    render('field')
    scene.render.film_transparent = False
    scene.view_settings.exposure = 0
    clear(base)

if 'gallery' in presets:
    # Серия продуктовых кадров для страницы оборудования (как у DJI): тёмная студия,
    # общий 3/4, фронт, бок, сверху и два крупных плана (рамка шире кадра = кроп в деталь)
    cyclorama((0.01, 0.011, 0.014), 0.35)
    studio_reflections(0.12)
    area('Key', (-4.5, -4, 5.5), (math.radians(50), 0, math.radians(-45)), 4, 900, (1, 0.98, 0.95))
    area('RimL', (-5, 4, 3.5), (math.radians(65), 0, math.radians(-128)), 2.5, 420, (0.75, 0.85, 1.0))
    area('RimR', (5, 4, 3.5), (math.radians(65), 0, math.radians(128)), 2.5, 420, (0.75, 0.85, 1.0))
    area('Top', (0, 0, 7), (0, 0, 0), 3, 600)
    shots = [
        ('hero', 32, 12, 50, (1920, 1080), (0.1, 0.9, 0.12, 0.82), 1.0),
        ('front', 0, 6, 70, (1600, 1000), (0.08, 0.92, 0.1, 0.85), 1.0),
        ('side', 90, 6, 70, (1600, 1000), (0.08, 0.92, 0.1, 0.85), 1.0),
        ('top', 40, 48, 50, (1600, 1000), (0.1, 0.9, 0.08, 0.9), 1.0),
        ('detail-1', 28, 18, 85, (1200, 1200), (-0.45, 1.25, -0.2, 1.1), 1.2),
        ('detail-2', -40, 10, 85, (1200, 1200), (-0.5, 1.3, -0.3, 1.05), 0.7),
    ]
    for name, az, el, lens, res, box, lz in shots:
        for o in [o for o in scene.objects if o.type == 'CAMERA']: bpy.data.objects.remove(o, do_unlink=True)
        orbit(az, el, lens, res, box, look_z=lz)
        render(name)
    clear(base)

print('ESP render done ->', out_dir)
