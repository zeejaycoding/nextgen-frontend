import { useEffect, useState } from 'react'

/** Product screenshot — renders only an image the admin actually added. */
export default function ProductImage({ product, src, className = '' }) {
  const source = src || product?.image
  const [failed, setFailed] = useState(false)

  useEffect(() => setFailed(false), [source])

  if (!source || failed) return null

  return (
    <img
      className={className}
      src={source}
      alt={product?.title || 'Product screenshot'}
      loading="lazy"
      onError={() => setFailed(true)}
    />
  )
}
