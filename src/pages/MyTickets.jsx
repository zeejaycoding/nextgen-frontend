import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useMember } from '../context/MemberContext'
import { createMemberTicket, listMemberTickets } from '../lib/api'

function displayDate(value) {
  if (!value) return '—'
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return String(value).slice(0, 10)
  const day = String(date.getUTCDate()).padStart(2, '0')
  const month = String(date.getUTCMonth() + 1).padStart(2, '0')
  return `${day}/${month}/${date.getUTCFullYear()}`
}

export default function MyTickets() {
  const navigate = useNavigate()
  const { token } = useMember()
  const [tickets, setTickets] = useState([])
  const [form, setForm] = useState({ subject: '', message: '' })
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    if (!token) navigate('/signin', { replace: true })
  }, [token, navigate])

  useEffect(() => {
    if (!token) return undefined
    let active = true

    listMemberTickets()
      .then((data) => {
        if (active) setTickets(Array.isArray(data) ? data : [])
      })
      .catch((err) => {
        if (active) setError(err.message || 'Unable to load your tickets right now.')
      })
      .finally(() => {
        if (active) setLoading(false)
      })

    return () => {
      active = false
    }
  }, [token])

  const handleChange = (field) => (event) => {
    setForm((current) => ({ ...current, [field]: event.target.value }))
    setError('')
    setSuccess('')
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    if (form.subject.trim().length < 3) {
      setError('Enter a subject with at least 3 characters.')
      return
    }
    if (form.message.trim().length < 10) {
      setError('Describe your issue in at least 10 characters.')
      return
    }

    setSubmitting(true)
    setError('')
    setSuccess('')
    try {
      const ticket = await createMemberTicket({
        subject: form.subject.trim(),
        message: form.message.trim(),
      })
      setTickets((current) => [ticket, ...current])
      setForm({ subject: '', message: '' })
      setSuccess('Ticket created successfully.')
    } catch (err) {
      setError(err.message || 'Unable to create your ticket right now.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <>
      <section className="fmt-breadcrumb-section">
        <div className="fmt-container">
          <ul className="fmt-breadcrumb">
            <li><Link to="/">Home</Link></li>
            <li className="fmt-divider">/</li>
            <li><Link to="/users/account">My Account</Link></li>
            <li className="fmt-divider">/</li>
            <li className="fmt-active">My Tickets</li>
          </ul>
        </div>
      </section>

      <div className="fmt-container fmt-page">
        <h2 className="fmt-page-header">My Tickets</h2>

        <form className="fmt-form-horizontal fmt-ticket-form" onSubmit={handleSubmit} noValidate>
          <div className="fmt-control-group">
            <label className="fmt-control-label" htmlFor="ticket-subject">Subject</label>
            <div className="fmt-controls">
              <input
                id="ticket-subject"
                type="text"
                value={form.subject}
                onChange={handleChange('subject')}
              />
            </div>
          </div>
          <div className="fmt-control-group">
            <label className="fmt-control-label" htmlFor="ticket-message">Message</label>
            <div className="fmt-controls">
              <textarea
                id="ticket-message"
                rows="5"
                value={form.message}
                onChange={handleChange('message')}
              />
            </div>
          </div>
          <div className="fmt-form-actions">
            <button type="submit" className="fmt-btn-primary" disabled={submitting}>
              {submitting ? 'Sending…' : 'Open ticket'}
            </button>
          </div>
          {error && <p className="fmt-alert fmt-alert-error">{error}</p>}
          {success && <p className="fmt-alert fmt-alert-success">{success}</p>}
        </form>

        {loading ? (
          <p className="fmt-empty">Loading your tickets…</p>
        ) : tickets.length ? (
          <table className="fmt-table">
            <thead>
              <tr>
                <th>Subject</th>
                <th>Created</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {tickets.map((ticket) => (
                <tr key={ticket.id}>
                  <td>{ticket.subject}</td>
                  <td>{displayDate(ticket.date || ticket.createdAt)}</td>
                  <td>{ticket.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="fmt-empty">You have not opened any tickets yet.</p>
        )}
      </div>
    </>
  )
}
