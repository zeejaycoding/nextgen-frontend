import ProductGrid from '../components/ProductGrid'
import { mostSold } from '../data/products'

export default function Home() {
  return (
    <div className="container page-content home-page">
      <section className="section">
        <div className="section-heading">
          <h2>Most Selling</h2>
        </div>
        <ProductGrid products={mostSold} />
      </section>
    </div>
  )
}
