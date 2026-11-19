import { useEffect, useState } from 'react'

/** Product screenshot with a branded fallback when the image is missing. */
export default function ProductImage({ product, src, className = '' }) {
  const source = src || product?.image
  const [failed, setFailed] = useState(false)

  useEffect(() => setFailed(false), [source])

  if (!source || failed) {
    return (
      <div className={`product-fallback ${className}`} aria-label={product?.title}>
        <span>{(product?.game || 'NG').slice(0, 2).toUpperCase()}</span>
      </div>
    )
  }

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
