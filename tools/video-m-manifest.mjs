// Собирает список роликов, у которых есть мобильная версия *-m.mp4
import { readdirSync, statSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
const root = 'public'
const out = []
const walk = (d) => { for (const f of readdirSync(d)) { const p = join(d, f); const s = statSync(p); if (s.isDirectory()) walk(p); else if (f.endsWith('-m.mp4')) out.push('/' + p.slice(root.length + 1).replace(/-m\.mp4$/, '.mp4')) } }
walk(join(root, 'videos')); walk(join(root, 'media'))
writeFileSync('assets/video-m.json', JSON.stringify(out.sort(), null, 0))
console.log(out.length)
