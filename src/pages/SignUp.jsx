import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import AuthShell from '../components/AuthShell'
import { useMember } from '../context/MemberContext'
import { resendVerificationEmail, signUpMember } from '../lib/api'

const initialForm = {
  username: '',
  email: '',
  password: '',
  confirm: '',
  terms: false,
}

export default function SignUp() {
  const navigate = useNavigate()
  const { token } = useMember()

  useEffect(() => {
    if (token) navigate('/', { replace: true })
  }, [token, navigate])
  const [form, setForm] = useState(initialForm)
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [sentTo, setSentTo] = useState('')
  const [resending, setResending] = useState(false)
  const [resendMessage, setResendMessage] = useState('')

  const update = (field) => (event) => {
    const value = field === 'terms' ? event.target.checked : event.target.value
    setForm((current) => ({ ...current, [field]: value }))
    setError('')
  }

  const handleSubmit = async (event) => {
    event.preventDefault()

    if (form.username.trim().length < 3) {
      setError('Username needs at least 3 characters.')
      return
    }
    if (!/^\S+@\S+\.\S+$/.test(form.email)) {
      setError('Please enter a valid email address.')
      return
    }
    if (form.password.length < 8) {
      setError('Password must be at least 8 characters.')
      return
    }
    if (form.password !== form.confirm) {
      setError('Passwords do not match.')
      return
    }
    if (!form.terms) {
      setError('Please accept the terms to continue.')
      return
    }

    setError('')
    setSubmitting(true)
    try {
      const data = await signUpMember({
        username: form.username.trim(),
        email: form.email.trim(),
        password: form.password,
      })
      setSentTo(data.email || form.email.trim())
    } catch (error) {
      setError(error.status ? error.message : 'Unable to create your account right now. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  const handleResend = async () => {
    setResending(true)
    setResendMessage('')
    try {
      const data = await resendVerificationEmail(sentTo)
      setResendMessage(data.message || 'A new verification link has been sent.')
    } catch (error) {
      setResendMessage(error.status ? error.message : 'Unable to resend the email right now.')
    } finally {
      setResending(false)
    }
  }

  if (sentTo) {
    return (
      <AuthShell
        title="Check your email"
        subtitle="One more step before you can sign in."
        footer={
          <>
            Already verified? <Link to="/signin">Sign in</Link>
          </>
        }
      >
        <div className="auth-result">
          <p className="form-info" role="status">
            We sent a verification link to <strong>{sentTo}</strong>. Open it to activate your account, then sign in.
          </p>
          <button type="button" className="btn btn-ghost btn-block" onClick={handleResend} disabled={resending}>
            {resending ? 'Sending…' : 'Resend verification email'}
          </button>
          {resendMessage && <p className="form-info" role="status">{resendMessage}</p>}
        </div>
      </AuthShell>
    )
  }

  return (
    <AuthShell
      title="Sign up"
      subtitle="Join the team and get access to every release."
      footer={
        <>
          Already have an account? <Link to="/signin">Sign in</Link>
        </>
      }
    >
      <form className="auth-form" onSubmit={handleSubmit} noValidate>
        <label className="field">
          <span>Username</span>
          <input
            type="text"
            value={form.username}
            onChange={update('username')}
            placeholder="write your name"
            autoComplete="username"
          />
        </label>

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
          <input
            type="password"
            value={form.password}
            onChange={update('password')}
            placeholder="At least 8 characters"
            autoComplete="new-password"
          />
        </label>

        <label className="field">
          <span>Confirm password</span>
          <input
            type="password"
            value={form.confirm}
            onChange={update('confirm')}
            placeholder="Repeat your password"
            autoComplete="new-password"
          />
        </label>

        <label className="checkbox-field checkbox-field--terms">
          <input type="checkbox" checked={form.terms} onChange={update('terms')} />
          <span>I agree to the terms of use and community guidelines.</span>
        </label>

        {error && <p className="form-error" role="alert">{error}</p>}

        <button type="submit" className="btn btn-primary btn-block" disabled={submitting}>
          {submitting ? 'Creating…' : 'Create account'} <span className="arrow">→</span>
        </button>
      </form>
    </AuthShell>
  )
}
