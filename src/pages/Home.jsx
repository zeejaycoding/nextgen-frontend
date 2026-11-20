import ReferenceProductCard from '../components/ReferenceProductCard'
import { latestApps, mostSold } from '../data/products'

export default function Home() {
  return (
    <div className="fmt-container fmt-page">
      <h2 className="fmt-page-header">Most Sold</h2>
      <div className="fmt-grid">
        {mostSold.map((product, index) => (
          <ReferenceProductCard key={product.id} product={product} rank={index + 1} />
        ))}
      </div>

      <h2 className="fmt-page-header">Latest Applications</h2>
      <div className="fmt-grid">
        {latestApps.map((product) => (
          <ReferenceProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  )
}
