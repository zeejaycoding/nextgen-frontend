import HomeProductGrid from '../components/HomeProductGrid'
import { latestApps, mostSold } from '../data/products'

export default function Home() {
  return (
    <div className="ref-home-wrap">
      <div className="container page-content ref-home">
        <section className="ref-section">
          <h2 className="ref-page-header">Most Sold</h2>
          <HomeProductGrid products={mostSold} showMedals />
        </section>

        <section className="ref-section">
          <h2 className="ref-page-header">Latest Applications</h2>
          <HomeProductGrid products={latestApps} />
        </section>
      </div>
    </div>
  )
}
