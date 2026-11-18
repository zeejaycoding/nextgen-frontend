import { useMemo, useState } from 'react'
import ProductGrid from '../components/ProductGrid'
import { products } from '../data/products'

const filters = [
  { value: 'all', label: 'All' },
  { value: 'paid', label: 'Paid' },
  { value: 'free', label: 'Free' },
]

export default function Shop() {
  const [query, setQuery] = useState('')
  const [filter, setFilter] = useState('all')
  const [sort, setSort] = useState('newest')

  const visibleProducts = useMemo(() => {
    const term = query.trim().toLowerCase()

    const result = products.filter((product) => {
      const matchesTerm =
        !term ||
        product.title.toLowerCase().includes(term) ||
        product.game.toLowerCase().includes(term) ||
        product.category.toLowerCase().includes(term)

      const matchesFilter =
        filter === 'all' ||
        (filter === 'free' ? product.price === 0 : product.price > 0)

      return matchesTerm && matchesFilter
    })

    return result.sort((a, b) => {
      if (sort === 'price-asc') return a.price - b.price
      if (sort === 'price-desc') return b.price - a.price
      if (sort === 'title') return a.title.localeCompare(b.title)
      return b.published.localeCompare(a.published)
    })
  }, [query, filter, sort])

  return (
    <div className="container page-content shop-page">
      <div className="page-header">
        <div>
          <h1>Applications</h1>
          <p>Browse every mod, tool and release from the team.</p>
        </div>
        <span className="page-count">
          {visibleProducts.length} {visibleProducts.length === 1 ? 'product' : 'products'}
        </span>
      </div>

      <div className="shop-toolbar">
        <label className="search-field">
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M10 2a8 8 0 1 0 4.9 14.3l5.4 5.4 1.4-1.4-5.4-5.4A8 8 0 0 0 10 2Zm0 2a6 6 0 1 1 0 12 6 6 0 0 1 0-12Z" />
          </svg>
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search mods, games…"
            aria-label="Search products"
          />
        </label>

        <div className="filter-group" role="group" aria-label="Filter by price">
          {filters.map((item) => (
            <button
              key={item.value}
              type="button"
              className={filter === item.value ? 'is-active' : undefined}
              onClick={() => setFilter(item.value)}
            >
              {item.label}
            </button>
          ))}
        </div>

        <label className="sort-field">
          <span>Sort:</span>
          <select value={sort} onChange={(event) => setSort(event.target.value)}>
            <option value="newest">Newest</option>
            <option value="price-asc">Price: low to high</option>
            <option value="price-desc">Price: high to low</option>
            <option value="title">Name A–Z</option>
          </select>
        </label>
      </div>

      {visibleProducts.length > 0 ? (
        <ProductGrid products={visibleProducts} />
      ) : (
        <div className="empty-state">
          <h2>No applications found</h2>
          <p>Try a different search term or clear the filters.</p>
          <button
            type="button"
            className="btn btn-outline"
            onClick={() => {
              setQuery('')
              setFilter('all')
              setSort('newest')
            }}
          >
            Reset filters
          </button>
        </div>
      )}
    </div>
  )
}
