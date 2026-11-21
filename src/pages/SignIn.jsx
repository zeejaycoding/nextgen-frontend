import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import AuthShell from '../components/AuthShell'
import { signInMember } from '../lib/api'

export default function SignIn() {
  const navigate = useNavigate()
  const [form, setForm] = useState({ email: '', password: '', remember: true })
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [resetNotice, setResetNotice] = useState(false)

  const update = (field) => (event) => {
    const value = field === 'remember' ? event.target.checked : event.target.value
    setForm((current) => ({ ...current, [field]: value }))
    setError('')
  }

  const handleSubmit = async (event) => {
    event.preventDefault()

    if (!/^\S+@\S+\.\S+$/.test(form.email)) {
      setError('Please enter a valid email address.')
      return
    }
    if (form.password.length < 6) {
      setError('Password must be at least 6 characters.')
      return
    }

    setError('')
    setSubmitting(true)
    try {
      await signInMember({ email: form.email.trim(), password: form.password })
      navigate('/', { replace: true })
    } catch (error) {
      setError(error.status ? error.message : 'Unable to sign in right now. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <AuthShell
      title="Sign in"
      subtitle="Welcome back. Log in to your account."
      footer={
        <>
          Don’t have an account? <Link to="/signup">Create one</Link>
        </>
      }
    >
      <form className="auth-form" onSubmit={handleSubmit} noValidate>
        <label className="field">
          <span>Email address</span>
          <input
            type="email"
            value={form.email}
            onChange={update('email')}
            placeholder="you@example.com"
            autoComplete="email"
          />
        </label>

        <label className="field">
          <span>Password</span>
          <span className="password-field">
            <input
              type={showPassword ? 'text' : 'password'}
              value={form.password}
              onChange={update('password')}
              placeholder="••••••••"
              autoComplete="current-password"
            />
            <button
              type="button"
              className="password-toggle"
              onClick={() => setShowPassword((visible) => !visible)}
            >
              {showPassword ? 'Hide' : 'Show'}
            </button>
          </span>
        </label>

        <div className="form-row">
          <label className="checkbox-field">
            <input
              type="checkbox"
              checked={form.remember}
              onChange={update('remember')}
            />
            <span>Remember me</span>
          </label>
          <button
            type="button"
            className="text-button"
            onClick={() => setResetNotice(true)}
          >
            Forgot password?
          </button>
        </div>

        {error && <p className="form-error" role="alert">{error}</p>}
        {resetNotice && (
          <p className="form-info" role="status">
            Password reset isn’t available yet. Please contact support.
          </p>
        )}

        <button type="submit" className="btn btn-primary btn-block" disabled={submitting}>
          {submitting ? 'Signing in…' : 'Sign in'} <span className="arrow">→</span>
        </button>
      </form>
    </AuthShell>
  )
}
