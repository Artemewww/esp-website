import mediaDefaults from '~/content/defaults/media.json'

/**
 * «Медиа-центр»: [{ title, desc, kind: 'video'|'presentation', file, poster, duration }].
 * Правится в админке.
 */
export const mediaList = mediaDefaults

export const useMediaCenter = () => {
  const media = useEditableList('media', mediaList)
  return { media }
}
