import ReferenceProductCard from '../components/ReferenceProductCard'
import { useProducts } from '../context/ProductsContext'

export default function Home() {
  const { mostSold } = useProducts()

  return (
    <div className="fmt-container fmt-page">
      <h2 className="fmt-page-header">Most Sold</h2>
      {mostSold.length ? (
        <div className="fmt-grid">
          {mostSold.map((product, index) => (
            <ReferenceProductCard
              key={product.id}
              product={product}
              rank={index < 3 ? index + 1 : undefined}
            />
          ))}
        </div>
      ) : (
        <p className="fmt-empty">No applications have been added yet.</p>
      )}
    </div>
  )
}
