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
  const [viewer, setViewer] = useState(null)
  const [checkout, setCheckout] = useState(false)

  useEffect(() => setViewer(null), [slug])

  if (!product) return <NotFound />

  const gallery = galleryFor(product)
  const embed = youtubeEmbed(product.video || 'https://www.youtube.com/watch?v=aqz-KE-bpKQ')
  const reference = String(product.id).padStart(3, '0')
  const paragraphs = product.description.split(/\n+/).filter(Boolean)
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
    <div className="fmt-page-wrap">
      <div className="container page-content fmt-page">
        <nav className="breadcrumb" aria-label="Breadcrumb">
          <Link to="/">Home</Link><span>/</span>
          <Link to="/shop">Shop</Link><span>/</span>
          <span>{product.title}</span>
        </nav>

        <h1 className="fmt-title">{product.title}</h1>

        <div className="fmt-panel">
          <div className="fmt-panel-inner">
            <div className="fmt-picture">
              <button
                type="button"
                className="fmt-image-button"
                onClick={() => setViewer(0)}
                aria-label="Open image full size"
              >
                <ProductImage product={product} src={gallery[0]} />
              </button>
            </div>

            <h2 className="fmt-section-title">Application Informations</h2>
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
                  <td className="fmt-price">{formatPrice(product.price)}</td>
                  <td>{product.version || '1.0'}</td>
                  <td>{formatDate(product.published)}</td>
                </tr>
              </tbody>
            </table>

            <h2 className="fmt-section-title">Description of Application</h2>
            <div className="fmt-description">
              {paragraphs.map((line, index) => <p key={index}>{line}</p>)}

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

              <div className="fmt-shots">
                {screenshots.map((image, index) => (
                  <button
                    type="button"
                    key={image + index}
                    className="fmt-shot"
                    onClick={() => setViewer(index + 1)}
                    aria-label={`Open screenshot ${index + 1} full size`}
                  >
                    <ProductImage product={product} src={image} />
                  </button>
                ))}
              </div>

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

            <h2 className="fmt-section-title">Buy Application</h2>
            <div className="fmt-buy">
              <strong>{formatPrice(product.price)}</strong>
              <button type="button" className="btn btn-primary btn-lg" onClick={() => setCheckout(true)}>
                Buy Application <span className="arrow">→</span>
              </button>
              <span>Sandbox checkout — no real payment is taken.</span>
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
      </div>
    </div>
  )
}
