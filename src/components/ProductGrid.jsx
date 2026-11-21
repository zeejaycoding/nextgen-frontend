import { useState } from 'react'
import { Link } from 'react-router-dom'
import { formatDate, galleryFor, isFreeProduct, priceLabel } from '../data/products'
import Lightbox from './Lightbox'
import ProductImage from './ProductImage'

function productPath(product) {
  return `/product/${product.slug || product.id}`
}

export default function ProductGrid({ products }) {
  const [viewer, setViewer] = useState(null)

  return (
    <>
      <div className="product-grid">
        {products.map((product) => (
          <article className="product-card" key={product.id}>
            <button
              type="button"
              className="product-media-link product-media-button"
              onClick={() => setViewer({ product, index: 0 })}
              aria-label={`Open screenshots for ${product.title}`}
            >
              <span className="product-media">
                {product.badge && (
                  <span className={`product-badge${product.badge === 'Free' ? ' product-badge--free' : ''}`}>
                    {product.badge}
                  </span>
                )}
                <ProductImage product={product} />
                <span className="media-open-hint">Click to view ↗</span>
              </span>
            </button>

            <div className="product-body">
              <span className="product-eyebrow">{product.game} · {product.category}</span>
              <h3 className="product-title">{product.title}</h3>

              <dl className="product-meta">
                <div>
                  <dt>Price</dt>
                  <dd className={isFreeProduct(product) ? 'price-free' : 'price'}>
                    {priceLabel(product)}
                  </dd>
                </div>
                <div>
                  <dt>Contact</dt>
                  <dd>{product.contact}</dd>
                </div>
                <div>
                  <dt>Published</dt>
                  <dd>{formatDate(product.published)}</dd>
                </div>
              </dl>

              <Link to={productPath(product)} className="btn btn-outline product-button">
                More info <span className="arrow">→</span>
              </Link>
            </div>
          </article>
        ))}
      </div>

      {viewer && (
        <Lightbox
          images={galleryFor(viewer.product, products)}
          index={viewer.index}
          onIndexChange={(index) => setViewer((current) => ({ ...current, index }))}
          onClose={() => setViewer(null)}
          product={viewer.product}
          title={viewer.product.title}
        />
      )}
    </>
  )
}
