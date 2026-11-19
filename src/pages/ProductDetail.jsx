import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import CheckoutModal from '../components/CheckoutModal'
import Lightbox from '../components/Lightbox'
import ProductImage from '../components/ProductImage'
import { formatDate, formatPrice, galleryFor, products, youtubeEmbed } from '../data/products'
import NotFound from './NotFound'

export default function ProductDetail() {
  const { slug } = useParams()
  const product = products.find((item) => String(item.slug || item.id) === slug)
  const [activeImage, setActiveImage] = useState(0)
  const [viewer, setViewer] = useState(null)
  const [checkout, setCheckout] = useState(false)

  useEffect(() => {
    setActiveImage(0)
    setViewer(null)
  }, [slug])

  if (!product) return <NotFound />

  const gallery = galleryFor(product)
  const embed = youtubeEmbed(product.video || 'https://www.youtube.com/watch?v=aqz-KE-bpKQ')
  const features = product.features || []

  const buy = () => setCheckout(true)

  return (
    <div className="container page-content detail-page">
      <nav className="breadcrumb" aria-label="Breadcrumb">
        <Link to="/">Home</Link><span>/</span>
        <Link to="/shop">Shop</Link><span>/</span>
        <span>{product.title}</span>
      </nav>

      <div className="detail-hero">
        <div className="detail-gallery">
          <div className="detail-main-image">
            {product.badge && (
              <span className={`product-badge${product.badge === 'Free' ? ' product-badge--free' : ''}`}>
                {product.badge}
              </span>
            )}
            <button
              type="button"
              className="detail-image-button"
              onClick={() => setViewer(activeImage)}
              aria-label="Open image full size"
            >
              <ProductImage product={product} src={gallery[activeImage]} />
              <span className="media-open-hint">Click to enlarge ↗</span>
            </button>
          </div>

          {gallery.length > 1 && (
            <div className="detail-thumbs">
              {gallery.map((image, index) => (
                <button
                  type="button"
                  key={image + index}
                  className={`detail-thumb${index === activeImage ? ' is-active' : ''}`}
                  onClick={() => setActiveImage(index)}
                  aria-label={`Show screenshot ${index + 1}`}
                >
                  <ProductImage product={product} src={image} />
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="detail-info">
          <span className="detail-eyebrow">{product.game} · {product.category}</span>
          <h1>{product.title}</h1>
          <p className="detail-lead">{product.description}</p>

          <div className="detail-price-row">
            <span className="detail-price">{formatPrice(product.price)}</span>
            <span className="detail-availability">Available now</span>
          </div>

          <div className="detail-actions">
            <button type="button" className="btn btn-primary btn-lg" onClick={buy}>
              Buy now <span className="arrow">→</span>
            </button>
          </div>

          <dl className="detail-meta">
            <div><dt>Reference</dt><dd>#{String(product.id).padStart(3, '0')}</dd></div>
            <div><dt>Created by</dt><dd>{product.contact}</dd></div>
            <div><dt>Version</dt><dd>{product.version || '1.0'}</dd></div>
            <div><dt>Published</dt><dd>{formatDate(product.published)}</dd></div>
          </dl>
        </div>
      </div>

      <section className="detail-section">
        <div className="detail-section-head">
          <h2>About this {product.category.toLowerCase()}</h2>
        </div>
        <p className="detail-copy">{product.description}</p>
        {features.length > 0 && (
          <ul className="feature-list">
            {features.map((feature) => <li key={feature}>{feature}</li>)}
          </ul>
        )}
      </section>

      {embed && (
        <section className="detail-section">
          <div className="detail-section-head"><h2>Video</h2></div>
          <div className="video-frame">
            <iframe
              src={embed}
              title={`${product.title} video`}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        </section>
      )}

      {gallery.length > 1 && (
        <section className="detail-section">
          <div className="detail-section-head"><h2>Screenshots</h2></div>
          <div className="shot-grid">
            {gallery.map((image, index) => (
              <button
                type="button"
                key={image + index}
                onClick={() => { setActiveImage(index); setViewer(index) }}
                aria-label={`Open screenshot ${index + 1} full size`}
              >
                <ProductImage product={product} src={image} />
              </button>
            ))}
          </div>
        </section>
      )}

      <div className="detail-buy-bar">
        <div>
          <span>Ready to get started?</span>
          <strong>{product.title} — {formatPrice(product.price)}</strong>
        </div>
        <button type="button" className="btn btn-primary btn-lg" onClick={buy}>
          Buy now <span className="arrow">→</span>
        </button>
      </div>

      {viewer !== null && (
        <Lightbox
          images={gallery}
          index={viewer}
          onIndexChange={setViewer}
          onClose={() => setViewer(null)}
          product={product}
          title={product.title}
        />
      )}

      {checkout && <CheckoutModal product={product} onClose={() => setCheckout(false)} />}
    </div>
  )
}
