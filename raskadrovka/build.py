# -*- coding: utf-8 -*-
import json, re, os, html, base64
B = os.path.dirname(os.path.abspath(__file__))

times = [float(m) for m in re.findall(r'pts_time:([0-9.]+)', open(B+'/times.txt').read())]
frames = sorted(os.listdir(B+'/f'))
DUR = 401.961
if len(times) < len(frames):
    times += [DUR]*(len(frames)-len(times))

segs = []
j = json.load(open(B+'/tr.json'))
for s in j.get('transcription', []):
    o = s.get('offsets', {})
    segs.append((o.get('from',0)/1000.0, o.get('to',0)/1000.0, s.get('text','').strip()))

def mmss(t):
    return "%d:%05.2f" % (int(t//60), t%60)

cards = []
for i, fn in enumerate(frames):
    t0 = times[i]
    t1 = times[i+1] if i+1 < len(times) else DUR
    txt = " ".join(s[2] for s in segs if s[1] > t0+0.15 and s[0] < t1-0.15).strip()
    cards.append({"i": i+1, "img": "data:image/jpeg;base64,"+base64.b64encode(open(B+"/f/"+fn,"rb").read()).decode(), "t0": round(t0,2), "t1": round(t1,2),
                  "tc": mmss(t0)+" – "+mmss(t1), "dur": round(t1-t0,1), "vo": txt})

DATA = json.dumps(cards, ensure_ascii=False)
nvo = sum(1 for c in cards if c['vo'])

TPL = r'''<!DOCTYPE html><html lang="ru"><head><meta charset="utf-8">
<title>Раскадровка ESP_final_040926</title>
<style>
*{box-sizing:border-box}
body{margin:0;background:#1a1a1a;color:#fff;font-family:Arial,Helvetica,sans-serif}
header{position:sticky;top:0;z-index:10;background:#2c3e50;padding:12px 18px;display:flex;gap:14px;align-items:center;flex-wrap:wrap;border-bottom:2px solid #34495e}
h1{font-size:17px;margin:0;color:#fff}
.stat{font-size:13px;color:#95a5a6}
.stat b{color:#3498db}
button{background:#3498db;color:#fff;border:0;border-radius:4px;padding:8px 14px;font-size:13px;cursor:pointer}
button:hover{background:#2980b9}
button.g{background:#27ae60}button.g:hover{background:#1e8449}
button.o{background:#34495e}button.o:hover{background:#3d566e}
#saved{font-size:12px;color:#27ae60;min-width:120px}
.grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(320px,1fr));gap:16px;padding:18px}
.card{background:#2c3e50;border-radius:8px;overflow:hidden;display:flex;flex-direction:column;border:1px solid #34495e}
.card.novo{border-color:#e67e22}
.card img{width:100%;display:block;background:#000;cursor:pointer}
.meta{display:flex;justify-content:space-between;align-items:center;padding:7px 10px;background:#34495e;font-size:12px}
.num{font-weight:bold;color:#3498db}
.tc{color:#bdc3c7;font-family:monospace}
.sect{padding:8px 10px}
.lbl{font-size:11px;text-transform:uppercase;letter-spacing:.5px;color:#7f8c8d;margin-bottom:4px}
.vo{background:#1a1a1a;border-radius:4px;padding:8px;font-size:13px;line-height:1.45;color:#ecf0f1;white-space:pre-wrap}
.vo.empty{color:#e67e22;font-style:italic}
textarea{width:100%;min-height:70px;background:#1a1a1a;color:#fff;border:1px solid #46637f;border-radius:4px;padding:8px;font-size:13px;font-family:inherit;resize:vertical}
textarea:focus{outline:0;border-color:#3498db}
textarea.filled{border-color:#27ae60}
.filter{display:flex;gap:6px}
.filter button.on{background:#27ae60}
#lb{display:none;position:fixed;inset:0;background:rgba(0,0,0,.92);z-index:99;align-items:center;justify-content:center;flex-direction:column;gap:10px}
#lb img{max-width:92vw;max-height:80vh}
#lb div{color:#bdc3c7;font-family:monospace}
</style></head><body>
<header>
<h1>Раскадровка · ESP_final_040926_1080.mp4</h1>
<span class="stat">кадров <b>__N__</b> · с озвучкой <b>__NVO__</b> · без озвучки <b>__NEMPTY__</b></span>
<span class="filter"><button class="o on" data-f="all">Все</button><button class="o" data-f="novo">Без озвучки</button><button class="o" data-f="vo">С озвучкой</button></span>
<button class="g" onclick="save()">Сохранить</button>
<button onclick="exportTxt()">Скачать .txt</button>
<button onclick="exportJson()">Скачать .json</button>
<button class="o" onclick="document.getElementById('imp').click()">Загрузить .json</button>
<input id="imp" type="file" accept=".json" hidden onchange="imp(this)">
<span id="saved"></span>
</header>
<div class="grid" id="grid"></div>
<div id="lb" onclick="this.style.display='none'"></div>
<script>
const DATA = __DATA__;
const KEY = 'esp_raskadrovka_v1';
let draft = {};
try{ draft = JSON.parse(localStorage.getItem(KEY)||'{}'); }catch(e){}

const grid = document.getElementById('grid');
grid.innerHTML = DATA.map(c=>`
<div class="card ${c.vo?'':'novo'}" data-vo="${c.vo?1:0}">
  <img src="${c.img}" loading="lazy" onclick="lb('${c.img}','${c.tc}')">
  <div class="meta"><span class="num">#${c.i}</span><span class="tc">${c.tc}</span><span>${c.dur}s</span></div>
  <div class="sect"><div class="lbl">Текущая озвучка</div>
    <div class="vo ${c.vo?'':'empty'}">${c.vo? esc(c.vo) : '— нет озвучки —'}</div></div>
  <div class="sect"><div class="lbl">${c.vo?'Правка / дополнение':'Текст для озвучки'}</div>
    <textarea data-i="${c.i}" placeholder="${c.vo?'что поправить или добавить…':'напишите текст, который надо озвучить…'}"></textarea></div>
</div>`).join('');

function esc(s){return s.replace(/[&<>]/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;'}[m]))}
document.querySelectorAll('textarea').forEach(t=>{
  const i=t.dataset.i; if(draft[i]){t.value=draft[i];t.classList.add('filled');}
  t.addEventListener('input',()=>{t.classList.toggle('filled',!!t.value.trim());autosave();});
});
let tm; function autosave(){clearTimeout(tm);tm=setTimeout(save,800)}
function collect(){const o={};document.querySelectorAll('textarea').forEach(t=>{if(t.value.trim())o[t.dataset.i]=t.value.trim()});return o}
function save(){draft=collect();localStorage.setItem(KEY,JSON.stringify(draft));
  const s=document.getElementById('saved');s.textContent='✓ сохранено '+new Date().toLocaleTimeString('ru-RU');
  setTimeout(()=>s.textContent='',3000);}
function dl(name,txt,type){const b=new Blob([txt],{type:type});const a=document.createElement('a');
  a.href=URL.createObjectURL(b);a.download=name;a.click();}
function exportJson(){save();dl('raskadrovka_esp.json',JSON.stringify(DATA.map(c=>({...c,new_text:draft[c.i]||''})),null,2),'application/json')}
function exportTxt(){save();const s=DATA.map(c=>`#${c.i}  ${c.tc}\nЕСТЬ: ${c.vo||'—'}\nНАДО: ${draft[c.i]||'—'}\n`).join('\n');
  dl('raskadrovka_esp.txt',s,'text/plain;charset=utf-8')}
function imp(el){const f=el.files[0];if(!f)return;const r=new FileReader();r.onload=()=>{
  try{const a=JSON.parse(r.result);a.forEach(c=>{if(c.new_text){const t=document.querySelector(`textarea[data-i="${c.i}"]`);
  if(t){t.value=c.new_text;t.classList.add('filled')}}});save();}catch(e){alert('Не JSON')}};r.readAsText(f)}
document.querySelectorAll('[data-f]').forEach(b=>b.onclick=()=>{
  document.querySelectorAll('[data-f]').forEach(x=>x.classList.remove('on'));b.classList.add('on');
  const f=b.dataset.f;document.querySelectorAll('.card').forEach(c=>{
    c.style.display = f==='all' || (f==='novo'&&c.dataset.vo==='0') || (f==='vo'&&c.dataset.vo==='1') ? '' : 'none';});});
function lb(src,tc){const l=document.getElementById('lb');l.innerHTML=`<img src="${src}"><div>${tc}</div>`;l.style.display='flex'}
window.addEventListener('beforeunload',save);
</script></body></html>'''

out = (TPL.replace('__DATA__', DATA).replace('__N__', str(len(cards)))
         .replace('__NVO__', str(nvo)).replace('__NEMPTY__', str(len(cards)-nvo)))
open(B+'/raskadrovka.html','w').write(out)
print("frames:", len(cards), "with voiceover:", nvo, "empty:", len(cards)-nvo)
