// Shared formatting helpers for the live product catalogue.
export function isFreeProduct(product) {
  return String(product?.badge || '').toLowerCase() === 'free' || Number(product?.price) === 0
}

/** Free products never display a dollar amount, even if a price was entered. */
export function priceLabel(product) {
  return isFreeProduct(product) ? 'FREE' : `$${Number(product.price).toFixed(2)}`
}

export function formatDate(value) {
  if (!value) return '—'
  const [year, month, day] = value.split('-')
  const monthName = new Date(year, month - 1, day).toLocaleString('en', {
    month: 'short',
  })
  return `${monthName} ${day}, ${year}`
}

/** Reference detail-page date: HH:MM:SS DD/MM/YYYY */
export function formatDetailDate(publishedAt, published) {
  const value = publishedAt || published || ''
  const match = value.match(/^(\d{4})-(\d{2})-(\d{2})(?:[ T](\d{2}:\d{2}:\d{2}))?/)
  if (!match) return value || '—'
  const [, year, month, day, time = '00:00:00'] = match
  return `${time} ${day}/${month}/${year}`
}

/** Main image first, followed by the product's own screenshots. */
export function galleryFor(product, catalog = []) {
  const own = [...new Set([
    product.image,
    ...(Array.isArray(product.images) ? product.images : []),
  ].filter(Boolean))]
  const pool = catalog
    .map((item) => item.image)
    .filter((src) => src && !own.includes(src))
  if (!pool.length) return own

  const start = Math.abs(Number(product.id) || 0) % pool.length
  const extras = [0, 1, 2].map((offset) => pool[(start + offset) % pool.length])
  return [...new Set([...own, ...extras])]
}

export function youtubeEmbed(value) {
  if (!value) return null
  const input = String(value).trim()
  const watch = input.match(/[?&]v=([^&#]+)/)
  const short = input.match(/youtu\.be\/([^?&#]+)/)
  const embed = input.match(/\/embed\/([^?&#]+)/)
  const id = watch?.[1] || short?.[1] || embed?.[1] || (/^[a-zA-Z0-9_-]{11}$/.test(input) ? input : '')
  return id ? `https://www.youtube-nocookie.com/embed/${id}` : null
}
