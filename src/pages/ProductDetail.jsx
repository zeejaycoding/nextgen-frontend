import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import CheckoutModal from '../components/CheckoutModal'
import Lightbox from '../components/Lightbox'
import ProductImage from '../components/ProductImage'
import ReferenceBreadcrumb from '../components/ReferenceBreadcrumb'
import { useProducts } from '../context/ProductsContext'
import { readMemberAuth } from '../lib/api'
import {
  formatDetailDate,
  galleryFor,
  isFreeProduct,
  priceLabel,
  youtubeEmbed,
} from '../data/products'
import NotFound from './NotFound'

export default function ProductDetail() {
  const { slug } = useParams()
  const { products, findProduct } = useProducts()
  const product = findProduct(slug)
  const [viewer, setViewer] = useState(null)
  const [checkout, setCheckout] = useState(false)
  const [showLoginNotice, setShowLoginNotice] = useState(false)

  useEffect(() => {
    setViewer(null)
    setShowLoginNotice(false)
  }, [slug])

  if (!product) return <NotFound />

  const openCheckout = () => {
    const { token } = readMemberAuth()
    if (!token) {
      setShowLoginNotice(true)
      return
    }
    setShowLoginNotice(false)
    setCheckout(true)
  }

  const gallery = galleryFor(product, products)
  const embed = youtubeEmbed(product.video)
  const reference = String(product.id).padStart(3, '0')
  const screenshots = gallery.slice(1)

  const grouped = (product.features || []).map((feature) => {
    const [label, rest] = feature.split(': ')
    return rest
      ? { label, items: rest.split(',').map((item) => item.trim()).filter(Boolean) }
      : { label: '', items: [feature] }
  })
  const plainFeatures = grouped.filter((group) => !group.label).flatMap((group) => group.items)
  const namedGroups = grouped.filter((group) => group.label)

  return (
    <>
      <ReferenceBreadcrumb current={product.title} />
      <div className="fmt-container fmt-page">
        <h2 className="fmt-page-header fmt-page-header--detail">{product.title}</h2>

        <div className="fmt-detail">
          <div className="fmt-detail-inner">
            <div className="fmt-detail-picture">
              <button
                type="button"
                className="fmt-detail-image-button"
                onClick={() => setViewer(0)}
                aria-label="Open image full size"
              >
                <ProductImage product={product} src={gallery[0]} className="fmt-detail-main-img" />
              </button>
            </div>

            <h3 className="fmt-section-title">Application Informations</h3>
            <table className="fmt-table">
              <thead>
                <tr>
                  <th>#ID</th>
                  <th>Created by</th>
                  <th>Price</th>
                  <th>Version</th>
                  <th>Published at</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>#{reference}</td>
                  <td>{product.contact}</td>
                  <td>{priceLabel(product)}</td>
                  <td>{product.version || '1.0'}</td>
                  <td>{formatDetailDate(product.publishedAt, product.published)}</td>
                </tr>
              </tbody>
            </table>

            <h3 className="fmt-section-title">Description of Application</h3>
            <div className="fmt-description">
              <p>{product.description}</p>

              {(plainFeatures.length > 0 || namedGroups.length > 0) && (
                <>
                  <p>A few features that are available:</p>
                  {plainFeatures.length > 0 && (
                    <ul>
                      {plainFeatures.map((feature) => <li key={feature}>{feature}</li>)}
                    </ul>
                  )}
                  {namedGroups.map((group) => (
                    <div className="fmt-feature-group" key={group.label}>
                      <p className="fmt-group-title">{group.label}</p>
                      <ul>
                        {group.items.map((item) => <li key={item}>{item}</li>)}
                      </ul>
                    </div>
                  ))}
                </>
              )}

              <p className="fmt-note">A console with <strong>CCAPI</strong> installed is required</p>
              <p>Video :</p>

              <div className="fmt-shot-row">
                {screenshots.slice(0, 2).map((image, index) => (
                  <button
                    type="button"
                    key={image + index}
                    className="fmt-shot-button"
                    onClick={() => setViewer(index + 1)}
                    aria-label={`Open screenshot ${index + 1} full size`}
                  >
                    <ProductImage product={product} src={image} />
                  </button>
                ))}
              </div>

              {screenshots[2] ? (
                <div className="fmt-shot-row fmt-shot-row--single">
                  <button
                    type="button"
                    className="fmt-shot-button"
                    onClick={() => setViewer(3)}
                    aria-label="Open screenshot 3 full size"
                  >
                    <ProductImage product={product} src={screenshots[2]} />
                  </button>
                </div>
              ) : null}

              {embed && (
                <div className="fmt-video">
                  <iframe
                    src={embed}
                    title={`${product.title} video`}
                    width="560"
                    height="315"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
              )}
            </div>

            <h3 className="fmt-section-title">Buy Application</h3>
            <div className="fmt-buy">
              <p className="fmt-buy-price">{priceLabel(product)}</p>
              <button type="button" className="fmt-buy-btn" onClick={openCheckout}>
                Buy Application <span aria-hidden="true">→</span>
              </button>
              {showLoginNotice && (
                <p className="fmt-buy-login" role="alert">
                  Please <Link to="/signin">sign in</Link> to buy this application.
                </p>
              )}
              <p className="fmt-buy-note">
                {isFreeProduct(product)
                  ? 'Free application — no payment details needed.'
                  : 'Secure checkout powered by Stripe.'}
              </p>
            </div>
          </div>
        </div>
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
    </>
  )
}
