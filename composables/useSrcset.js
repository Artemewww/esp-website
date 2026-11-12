import manifest from '~/assets/srcset-manifest.json'

// srcset("/images/a.webp") -> "/images/a-m.webp 828w, /images/a.webp 1920w", or undefined if no -m variant exists.
// Regenerate the manifest after adding variants: python3 tools/srcset-manifest.py
export function srcset(src) {
  if (typeof src !== 'string') return undefined
  const w = manifest[src]
  if (!w) return undefined
  return `${src.replace(/\.[a-z]+$/i, '-m.webp')} 828w, ${src} ${w}w`
}

export const useSrcset = () => srcset
