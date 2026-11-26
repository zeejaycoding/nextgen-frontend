import ReferenceProductCard from '../components/ReferenceProductCard'
import { useProducts } from '../context/ProductsContext'

export default function Home() {
  const { mostSold, latest } = useProducts()
  const topSold = mostSold.slice(0, 3)
  const newest = latest.slice(0, 3)

  return (
    <div className="fmt-container fmt-page">
      <section className="fmt-home-section">
        <h2 className="fmt-section-title">Most Sold</h2>
        {topSold.length ? (
          <div className="fmt-grid">
            {topSold.map((product, index) => (
              <ReferenceProductCard key={product.id} product={product} rank={index + 1} />
            ))}
          </div>
        ) : (
          <p className="fmt-empty">No applications have been added yet.</p>
        )}
      </section>

      <section className="fmt-home-section">
        <h2 className="fmt-section-title">Lasted Products</h2>
        {newest.length ? (
          <div className="fmt-grid">
            {newest.map((product) => (
              <ReferenceProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <p className="fmt-empty">No applications have been added yet.</p>
        )}
      </section>
    </div>
  )
}
