import timelineDefaults from '~/content/defaults/timeline.json'

/** «Путь компании»: [{ year, title, text }]. Правится в админке. */
export const timelineList = timelineDefaults

export const useTimeline = () => {
  const timeline = useEditableList('timeline', timelineList)
  return { timeline }
}
