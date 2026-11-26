import { useEffect, useState } from 'react'
import ReferenceBreadcrumb from '../components/ReferenceBreadcrumb'
import ReferenceProductCard from '../components/ReferenceProductCard'
import { useProducts } from '../context/ProductsContext'

const PER_PAGE = 9

export default function Shop() {
  const { products } = useProducts()
  const [page, setPage] = useState(1)

  const ordered = [...products].sort((a, b) => Number(b.id) - Number(a.id))
  const pageCount = Math.max(1, Math.ceil(ordered.length / PER_PAGE))
  const current = Math.min(page, pageCount)
  const visible = ordered.slice((current - 1) * PER_PAGE, current * PER_PAGE)

  useEffect(() => setPage(1), [products])

  return (
    <>
      <ReferenceBreadcrumb />
      <div className="fmt-container fmt-page">
        <h2 className="fmt-page-header">Products</h2>

        <div className="fmt-grid">
          {visible.map((product) => (
            <ReferenceProductCard key={product.id} product={product} />
          ))}
        </div>

        <div className="fmt-pagination">
          <ul>
            {Array.from({ length: pageCount }, (_, index) => index + 1).map((number) => (
              <li key={number} className={current === number ? 'active' : undefined}>
                <button type="button" onClick={() => setPage(number)}>{number}</button>
              </li>
            ))}
            {current < pageCount ? (
              <li className="next">
                <button type="button" onClick={() => setPage((value) => value + 1)} rel="next">Next</button>
              </li>
            ) : null}
          </ul>
        </div>
      </div>
    </>
  )
}
