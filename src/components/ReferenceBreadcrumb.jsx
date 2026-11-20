import { Link } from 'react-router-dom'

/** Breadcrumb strip shown above the shop and product-detail content. */
export default function ReferenceBreadcrumb({ current }) {
  return (
    <div className="fmt-breadcrumb-section">
      <div className="fmt-container">
        <ul className="fmt-breadcrumb">
          <li><Link to="/">Home</Link></li>
          <li className="fmt-divider"><span>/</span></li>
          <li><Link to="/shop">Shop</Link></li>
          {current ? (
            <>
              <li className="fmt-divider"><span>/</span></li>
              <li className="fmt-active">{current}</li>
            </>
          ) : null}
        </ul>
      </div>
    </div>
  )
}
