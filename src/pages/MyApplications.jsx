import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useMember } from '../context/MemberContext'
import { listMemberApplications } from '../lib/api'

function displayDate(value) {
  if (!value) return '—'
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) {
    const parts = String(value).slice(0, 10).split('-')
    return parts.length === 3 ? `${parts[2]}/${parts[1]}/${parts[0]}` : String(value)
  }
  const day = String(date.getUTCDate()).padStart(2, '0')
  const month = String(date.getUTCMonth() + 1).padStart(2, '0')
  return `${day}/${month}/${date.getUTCFullYear()}`
}

export default function MyApplications() {
  const navigate = useNavigate()
  const { token } = useMember()
  const [applications, setApplications] = useState([])
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!token) navigate('/signin', { replace: true })
  }, [token, navigate])

  useEffect(() => {
    if (!token) return undefined
    let active = true

    listMemberApplications()
      .then((data) => {
        if (active) setApplications(Array.isArray(data) ? data : [])
      })
      .catch((err) => {
        if (active) setError(err.message || 'Unable to load your applications right now.')
      })
      .finally(() => {
        if (active) setLoading(false)
      })

    return () => {
      active = false
    }
  }, [token])

  return (
    <>
      <section className="fmt-breadcrumb-section">
        <div className="fmt-container">
          <ul className="fmt-breadcrumb">
            <li><Link to="/">Home</Link></li>
            <li className="fmt-divider">/</li>
            <li><Link to="/users/account">My Account</Link></li>
            <li className="fmt-divider">/</li>
            <li className="fmt-active">My Applications</li>
          </ul>
        </div>
      </section>

      <div className="fmt-container fmt-page">
        <h2 className="fmt-page-header">My Applications</h2>

        {error && <p className="fmt-alert fmt-alert-error">{error}</p>}
        {loading ? (
          <p className="fmt-empty">Loading your applications…</p>
        ) : applications.length ? (
          <table className="fmt-table">
            <thead>
              <tr>
                <th>Application</th>
                <th>Purchased</th>
                <th>Amount</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {applications.map((item) => (
                <tr key={item.id || item.stripeSessionId || item.product}>
                  <td>{item.product || 'Application'}</td>
                  <td>{displayDate(item.date || item.createdAt)}</td>
                  <td>{Number(item.amount) === 0 ? 'FREE' : `$${Number(item.amount || 0).toFixed(2)}`}</td>
                  <td>{item.status || 'Completed'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="fmt-empty">You have not purchased any applications yet.</p>
        )}
      </div>
    </>
  )
}
