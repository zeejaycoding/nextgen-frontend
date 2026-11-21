import { Link } from 'react-router-dom'
import { priceLabel } from '../data/products'
import RankMedal from './RankMedal'

/** Card markup matching the reference application grid. */
export default function ReferenceProductCard({ product, rank }) {
  return (
    <div className="fmt-card">
      <div className="fmt-card-content">
        <div className="fmt-card-details">
          {rank ? (
            <span className="fmt-rank" aria-label={`Rank ${rank}`}>
              <RankMedal rank={rank} />
            </span>
          ) : null}
          <div className="fmt-card-title">{product.title}</div>
          <div className="fmt-picture">
            <img className="fmt-card-image" src={product.image} alt="" />
          </div>
          <div className="fmt-infos">
            <p>Price : {priceLabel(product)}</p>
            <p>
              Contact : <span className="fmt-contact">{product.contact}</span>
            </p>
            <p>Published at : {product.publishedAt || product.published}</p>
            <p className="fmt-more">
              <Link to={`/product/${product.slug || product.id}`} className="fmt-btn">More info</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
