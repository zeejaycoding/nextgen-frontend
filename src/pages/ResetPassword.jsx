import { useState } from 'react'
import { Link, useParams, useSearchParams } from 'react-router-dom'
import AuthShell from '../components/AuthShell'
import { resetMemberPassword } from '../lib/api'

export default function ResetPassword() {
  const [searchParams] = useSearchParams()
  const { token: pathToken } = useParams()
  const token = pathToken || searchParams.get('token') || ''
  const [form, setForm] = useState({ newPassword: '', confirmPassword: '' })
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')
  const [done, setDone] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  const update = (field) => (event) => {
    setForm((current) => ({ ...current, [field]: event.target.value }))
    setError('')
  }

  const handleSubmit = async (event) => {
    event.preventDefault()

    if (!token) {
      setError('This reset link is invalid. Please request a new one.')
      return
    }
    if (form.newPassword.length < 8) {
      setError('Password must be at least 8 characters.')
      return
    }
    if (form.newPassword !== form.confirmPassword) {
      setError('Passwords do not match.')
      return
    }

    setError('')
    setSubmitting(true)
    try {
      const data = await resetMemberPassword({ token, newPassword: form.newPassword })
      setDone(true)
      setMessage(data.message || 'Password updated. You can sign in now.')
    } catch (err) {
      setError(err.status ? err.message : 'Unable to reset your password right now.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <AuthShell
      title="Reset password"
      subtitle="Choose a new password for your account."
      footer={
        <>
          Need a new link? <Link to="/forgot-password">Request another</Link>
        </>
      }
    >
      {done ? (
        <div className="auth-result">
          <p className="form-info" role="status">{message}</p>
          <Link to="/signin" className="btn btn-primary btn-block">Sign in →</Link>
        </div>
      ) : (
        <form className="auth-form" onSubmit={handleSubmit} noValidate>
          <label className="field">
            <span>New password</span>
            <input
              type="password"
              value={form.newPassword}
              onChange={update('newPassword')}
              placeholder="At least 8 characters"
              autoComplete="new-password"
            />
          </label>

          <label className="field">
            <span>Confirm password</span>
            <input
              type="password"
              value={form.confirmPassword}
              onChange={update('confirmPassword')}
              placeholder="Repeat your new password"
              autoComplete="new-password"
            />
          </label>

          {error && <p className="form-error" role="alert">{error}</p>}

          <button type="submit" className="btn btn-primary btn-block" disabled={submitting}>
            {submitting ? 'Saving…' : 'Reset password'} <span className="arrow">→</span>
          </button>
        </form>
      )}
    </AuthShell>
  )
}
