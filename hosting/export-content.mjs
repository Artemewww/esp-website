// Выгружает описание разделов админки и исходные данные в JSON для PHP-части
// (hosting/api/index.php). Источник один — server/utils/contentRegistry.ts,
// поэтому новый раздел или поле в админке не нужно дублировать в PHP.
//
//   node hosting/export-content.mjs <папка назначения>
import { createJiti } from 'jiti'
import { mkdirSync, writeFileSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const out = process.argv[2]
if (!out) {
  console.error('Укажите папку назначения: node hosting/export-content.mjs deploy/api/_data')
  process.exit(1)
}

const jiti = createJiti(import.meta.url)
const { SECTIONS } = await jiti.import(join(root, 'server/utils/contentRegistry.ts'))

mkdirSync(join(out, 'defaults'), { recursive: true })
const registry = SECTIONS.map(({ defaults, ...spec }) => ({ ...spec, count: defaults.length }))
writeFileSync(join(out, 'registry.json'), JSON.stringify(registry))
for (const s of SECTIONS) {
  writeFileSync(join(out, 'defaults', `${s.key}.json`), JSON.stringify(s.defaults))
}
console.log(`Разделов админки: ${SECTIONS.length} → ${out}`)
