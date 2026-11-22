// Shared formatting helpers for the live product catalogue.
export function isFreeProduct(product) {
  return String(product?.badge || '').toLowerCase() === 'free' || Number(product?.price) === 0
}

/** Free products never display a dollar amount, even if a price was entered. */
export function priceLabel(product) {
  return isFreeProduct(product) ? 'FREE' : `$${Number(product.price).toFixed(2)}`
}

/** Published date shown as DD/MM/YYYY everywhere. */
export function formatDetailDate(publishedAt, published) {
  const value = publishedAt || published || ''
  const match = String(value).match(/^(\d{4})-(\d{2})-(\d{2})/)
  if (!match) return value || '—'
  const [, year, month, day] = match
  return `${day}/${month}/${year}`
}

export function formatDate(value) {
  return formatDetailDate(value)
}

/** Only images the admin actually added: main image first, then own screenshots. */
export function galleryFor(product) {
  return [...new Set([
    product?.image,
    ...(Array.isArray(product?.images) ? product.images : []),
  ].filter(Boolean))]
}

export function youtubeEmbed(value) {
  if (!value) return null
  const input = String(value).trim()
  const watch = input.match(/[?&]v=([^&#]+)/)
  const short = input.match(/youtu\.be\/([^?&#]+)/)
  const embed = input.match(/\/embed\/([^&#]+)/)
  const id = watch?.[1] || short?.[1] || embed?.[1] || (/^[a-zA-Z0-9_-]{11}$/.test(input) ? input : '')
  return id ? `https://www.youtube-nocookie.com/embed/${id}` : null
}
