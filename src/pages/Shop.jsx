import { useState } from 'react'
import ReferenceBreadcrumb from '../components/ReferenceBreadcrumb'
import ReferenceProductCard from '../components/ReferenceProductCard'
import { products } from '../data/products'

const PER_PAGE = 9
const ordered = [...products].sort((a, b) => b.id - a.id)
const pageCount = Math.ceil(ordered.length / PER_PAGE)

export default function Shop() {
  const [page, setPage] = useState(1)
  const visible = ordered.slice((page - 1) * PER_PAGE, page * PER_PAGE)

  return (
    <>
      <ReferenceBreadcrumb />
      <div className="fmt-container fmt-page">
        <h2 className="fmt-page-header">Applications</h2>

        <div className="fmt-grid">
          {visible.map((product) => (
            <ReferenceProductCard key={product.id} product={product} />
          ))}
        </div>

        <div className="fmt-pagination">
          <ul>
            {Array.from({ length: pageCount }, (_, index) => index + 1).map((number) => (
              <li key={number} className={page === number ? 'active' : undefined}>
                <button type="button" onClick={() => setPage(number)}>{number}</button>
              </li>
            ))}
            {page < pageCount ? (
              <li className="next">
                <button type="button" onClick={() => setPage((current) => current + 1)} rel="next">Next</button>
              </li>
            ) : null}
          </ul>
        </div>
      </div>
    </>
  )
}
