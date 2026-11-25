/** Splits a site name into single-letter accent runs. The first letter and the
 *  first G are both accented, so DOMIGEN renders as D(OMI)G(EN). */
export function brandSegments(name = '') {
  const value = String(name || '')
  if (!value) return []

  const marks = [0]
  const gIndex = value.toLowerCase().indexOf('g', 1)
  if (gIndex > 0) marks.push(gIndex)

  const points = [...new Set(marks)].sort((a, b) => a - b)
  const segments = []
  let cursor = 0

  points.forEach((start) => {
    if (start > cursor) {
      segments.push({ text: value.slice(cursor, start), accent: false })
    }
    segments.push({ text: value[start], accent: true })
    cursor = start + 1
  })

  if (cursor < value.length) {
    segments.push({ text: value.slice(cursor), accent: false })
  }

  return segments
}
