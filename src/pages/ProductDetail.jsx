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
  const reference = String(product.id).padStart(3, '0')
  const paragraphs = product.description.split(/\n+/).filter(Boolean)

  const grouped = (product.features || []).map((feature) => {
    const [label, rest] = feature.split(': ')
    return rest
      ? { label, items: rest.split(',').map((item) => item.trim()).filter(Boolean) }
      : { label: '', items: [feature] }
  })
  const plainFeatures = grouped.filter((group) => !group.label).flatMap((group) => group.items)
  const namedGroups = grouped.filter((group) => group.label)

  const buy = () => setCheckout(true)

  return (
    <div className="container page-content detail-page">
      <nav className="breadcrumb" aria-label="Breadcrumb">
        <Link to="/">Home</Link><span>/</span>
        <Link to="/shop">Shop</Link><span>/</span>
        <span>{product.title}</span>
      </nav>

      <header className="detail-heading">
        <div>
          <span className="detail-eyebrow">{product.game} · {product.category}</span>
          <h1>{product.title}</h1>
        </div>
        <span className="detail-ref">Reference #{reference}</span>
      </header>

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

        <aside className="detail-sidebar">
          <div className="info-panel">
            <h2>Application information</h2>
            <dl className="info-table">
              <div><dt>#ID</dt><dd>#{reference}</dd></div>
              <div><dt>Created by</dt><dd>{product.contact}</dd></div>
              <div><dt>Price</dt><dd className="price-accent">{formatPrice(product.price)}</dd></div>
              <div><dt>Version</dt><dd>{product.version || '1.0'}</dd></div>
              <div><dt>Published at</dt><dd>{formatDate(product.published)}</dd></div>
            </dl>
          </div>

          <div className="sidebar-buy">
            <span className="detail-availability">Available now</span>
            <strong>{formatPrice(product.price)}</strong>
            <button type="button" className="btn btn-primary btn-lg" onClick={buy}>
              Buy Application <span className="arrow">→</span>
            </button>
            <span className="sidebar-note">Sandbox checkout — no real payment is taken.</span>
          </div>
        </aside>
      </div>

      <section className="detail-section">
        <div className="detail-section-head"><h2>Description</h2></div>
        <div className="detail-copy">
          {paragraphs.map((line, index) => <p key={index}>{line}</p>)}
        </div>

        {(plainFeatures.length > 0 || namedGroups.length > 0) && (
          <div className="detail-features">
            <h3>A few features that are available</h3>
            {plainFeatures.length > 0 && (
              <ul className="feature-list">
                {plainFeatures.map((feature) => <li key={feature}>{feature}</li>)}
              </ul>
            )}
            {namedGroups.map((group) => (
              <div className="feature-group" key={group.label}>
                <h4>{group.label}</h4>
                <ul className="feature-list">
                  {group.items.map((item) => <li key={item}>{item}</li>)}
                </ul>
              </div>
            ))}
          </div>
        )}
      </section>

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

      <div className="buy-callout">
        <div>
          <span>Ready to get started?</span>
          <strong>{product.title} — {formatPrice(product.price)}</strong>
        </div>
        <button type="button" className="btn btn-primary btn-lg" onClick={buy}>
          Buy Application <span className="arrow">→</span>
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
