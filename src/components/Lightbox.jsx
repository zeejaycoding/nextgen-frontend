import { useEffect } from 'react'
import ProductImage from './ProductImage'

/** Full-screen image viewer with prev/next navigation. */
export default function Lightbox({ images, index, onIndexChange, onClose, product, title }) {
  useEffect(() => {
    const onKey = (event) => {
      if (event.key === 'Escape') onClose()
      if (event.key === 'ArrowRight') onIndexChange((index + 1) % images.length)
      if (event.key === 'ArrowLeft') onIndexChange((index - 1 + images.length) % images.length)
    }
    document.addEventListener('keydown', onKey)
    const previous = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = previous
    }
  }, [index, images.length, onIndexChange, onClose])

  if (!images.length) return null

  const go = (step) => onIndexChange((index + step + images.length) % images.length)

  return (
    <div className="lightbox" role="dialog" aria-modal="true" aria-label={title || 'Image viewer'} onClick={onClose}>
      <button type="button" className="lightbox-close" onClick={onClose} aria-label="Close image">×</button>

      {images.length > 1 && (
        <button
          type="button"
          className="lightbox-nav lightbox-nav--prev"
          onClick={(event) => { event.stopPropagation(); go(-1) }}
          aria-label="Previous image"
        >
          ‹
        </button>
      )}

      <div className="lightbox-stage" onClick={(event) => event.stopPropagation()}>
        <ProductImage product={product} src={images[index]} className="lightbox-image" />
        {title && <p className="lightbox-caption">{title}</p>}
      </div>

      {images.length > 1 && (
        <button
          type="button"
          className="lightbox-nav lightbox-nav--next"
          onClick={(event) => { event.stopPropagation(); go(1) }}
          aria-label="Next image"
        >
          ›
        </button>
      )}

      {images.length > 1 && <span className="lightbox-counter">{index + 1} / {images.length}</span>}
    </div>
  )
}
