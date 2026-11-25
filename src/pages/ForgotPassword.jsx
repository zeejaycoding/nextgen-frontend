import { useState } from 'react'
import { Link } from 'react-router-dom'
import AuthShell from '../components/AuthShell'
import { requestPasswordReset } from '../lib/api'

export default function ForgotPassword() {
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async (event) => {
    event.preventDefault()

    if (!/^\S+@\S+\.\S+$/.test(email)) {
      setError('Please enter a valid email address.')
      return
    }

    setError('')
    setMessage('')
    setSubmitting(true)
    try {
      const data = await requestPasswordReset(email.trim())
      setMessage(data.message || 'If an account exists for that email, a reset link has been sent.')
    } catch (err) {
      setError(err.status ? err.message : 'Unable to send the reset email right now.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <AuthShell
      title="Forgot password"
      subtitle="Enter your email and we’ll send you a reset link."
      footer={
        <>
          Remembered it? <Link to="/signin">Back to sign in</Link>
        </>
      }
    >
      <form className="auth-form" onSubmit={handleSubmit} noValidate>
        <label className="field">
          <span>Email address</span>
          <input
            type="email"
            value={email}
            onChange={(event) => {
              setEmail(event.target.value)
              setError('')
              setMessage('')
            }}
            placeholder="you@example.com"
            autoComplete="email"
          />
        </label>

        {error && <p className="form-error" role="alert">{error}</p>}
        {message && <p className="form-info" role="status">{message}</p>}

        <button type="submit" className="btn btn-primary btn-block" disabled={submitting}>
          {submitting ? 'Sending…' : 'Send reset link'} <span className="arrow">→</span>
        </button>
      </form>
    </AuthShell>
  )
}
