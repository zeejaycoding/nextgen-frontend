import { useState } from 'react'
import { Link } from 'react-router-dom'
import { formatDetailDate, galleryFor, priceLabel } from '../data/products'
import Lightbox from './Lightbox'
import ProductImage from './ProductImage'
import RankMedal from './RankMedal'

function productPath(product) {
  return `/product/${product.slug || product.id}`
}

export default function HomeProductGrid({ products, showMedals = false }) {
  const [viewer, setViewer] = useState(null)

  return (
    <>
      <div className="ref-product-grid">
        {products.map((product, index) => (
          <article className="ref-application" key={product.id}>
            <div className="ref-application-content">
              <div className="ref-application-details">
                {showMedals && <RankMedal rank={index + 1} />}
                <div className="ref-app-title">{product.title}</div>
                <button
                  type="button"
                  className="ref-app-picture"
                  onClick={() => setViewer({ product, index: 0 })}
                  aria-label={`Open screenshots for ${product.title}`}
                >
                  <ProductImage product={product} />
                </button>
                <div className="ref-app-infos">
                  <p className="fmt-price-line">Price : <strong>{priceLabel(product)}</strong></p>
                  <p>Contact : {product.contact}</p>
                  <p>Published at : {formatDetailDate(product.publishedAt, product.published)}</p>
                  <p className="ref-app-action">
                    <Link to={productPath(product)} className="btn btn-primary">More info</Link>
                  </p>
                </div>
              </div>
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
