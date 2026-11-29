import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useMember } from '../context/MemberContext'
import { createMemberTicket, createSocket, listMemberTickets } from '../lib/api'

function displayDate(value) {
  if (!value) return '—'
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return String(value).slice(0, 10)
  const day = String(date.getUTCDate()).padStart(2, '0')
  const month = String(date.getUTCMonth() + 1).padStart(2, '0')
  return `${day}/${month}/${date.getUTCFullYear()}`
}

function statusClass(status) {
  return String(status || 'Open').toLowerCase().replace(/\s+/g, '-')
}

// Older server versions wrapped socket payloads in { message: ... }. Accept
// both shapes so a reply is never silently dropped.
function eventData(payload) {
  if (payload && payload.message && typeof payload.message === 'object' && payload.message.id) {
    return payload.message
  }
  return payload
}

export default function TicketPanel() {
  const navigate = useNavigate()
  const { token, signOut } = useMember()
  const [tickets, setTickets] = useState([])
  const [form, setForm] = useState({ subject: '', message: '' })
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)

  const handleError = (err) => {
    if (err?.status === 401) {
      signOut()
      navigate('/signin', { replace: true })
      return
    }
    setError(err?.message || 'Unable to load your tickets right now.')
  }

  const refresh = async (silent = false) => {
    try {
      const data = await listMemberTickets()
      setTickets(Array.isArray(data) ? data : [])
      if (!silent) setSuccess('Tickets updated.')
    } catch (err) {
      if (!silent) handleError(err)
    }
  }

  useEffect(() => {
    if (!token) navigate('/signin', { replace: true })
  }, [token, navigate])

  useEffect(() => {
    if (!token) return undefined
    let active = true

    setLoading(true)
    listMemberTickets()
      .then((data) => {
        if (active) setTickets(Array.isArray(data) ? data : [])
      })
      .catch((err) => {
        if (active) handleError(err)
      })
      .finally(() => {
        if (active) setLoading(false)
      })

    return () => {
      active = false
    }
  }, [token])

  useEffect(() => {
    if (!token) return undefined

    const socket = createSocket({ token })
    socket.on('ticket:updated', (payload) => {
      const ticket = eventData(payload)
      if (!ticket?.id) return
      setTickets((current) => {
        const exists = current.some((item) => String(item.id) === String(ticket.id))
        return exists
          ? current.map((item) => (String(item.id) === String(ticket.id) ? ticket : item))
          : [ticket, ...current]
      })
      setSuccess('An admin updated your ticket.')
    })
    socket.on('ticket:deleted', (payload) => {
      const ticket = eventData(payload)
      if (!ticket?.id) return
      setTickets((current) => current.filter((item) => String(item.id) !== String(ticket.id)))
    })
    socket.connect()

    return () => socket.disconnect()
  }, [token])

  // Keep the page correct even if the socket is unavailable or an event is
  // missed: re-read on focus, on tab visibility, and periodically.
  useEffect(() => {
    if (!token) return undefined

    const onFocus = () => refresh(true)
    const onVisibility = () => {
      if (document.visibilityState === 'visible') refresh(true)
    }
    window.addEventListener('focus', onFocus)
    document.addEventListener('visibilitychange', onVisibility)
    const timer = window.setInterval(() => {
      if (document.visibilityState === 'visible') refresh(true)
    }, 20000)

    return () => {
      window.removeEventListener('focus', onFocus)
      document.removeEventListener('visibilitychange', onVisibility)
      window.clearInterval(timer)
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
      setSuccess('Ticket sent to the admin team.')
    } catch (err) {
      handleError(err)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <>
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

      <div className="fmt-ticket-list-header">
        <h3 className="fmt-ticket-list-title">Your tickets</h3>
        <button type="button" className="fmt-btn" onClick={() => refresh(false)}>Refresh</button>
      </div>
      {loading ? (
        <p className="fmt-empty">Loading your tickets…</p>
      ) : tickets.length ? (
        <div className="fmt-notification-list">
          {tickets.map((ticket) => (
            <article className="fmt-notification-item" key={ticket.id}>
              <div className="fmt-notification-title">{ticket.subject}</div>
              <div className="fmt-notification-meta">
                #{String(ticket.id).slice(-6)} · Opened {displayDate(ticket.date || ticket.createdAt)}
                {' · '}
                <span className={`fmt-ticket-status fmt-ticket-status--${statusClass(ticket.status)}`}>
                  {ticket.status || 'Open'}
                </span>
              </div>
              <p className="fmt-ticket-message">{ticket.message}</p>
              {ticket.response ? (
                <div className="fmt-ticket-reply">
                  <strong>Response from admin</strong>
                  <p>{ticket.response}</p>
                </div>
              ) : null}
            </article>
          ))}
        </div>
      ) : (
        <p className="fmt-empty">You have not opened any tickets yet.</p>
      )}
    </>
  )
}
