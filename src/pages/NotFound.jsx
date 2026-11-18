import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <div className="container page-content not-found">
      <span className="not-found-code">404</span>
      <h1>Page not found</h1>
      <p>That page doesn’t exist — let’s get you back on track.</p>
      <Link to="/" className="btn btn-primary">
        Back to home <span className="arrow">→</span>
      </Link>
    </div>
  )
}
