import { useState } from 'react'
import { Link } from 'react-router-dom'
import AuthShell from '../components/AuthShell'

const initialForm = {
  username: '',
  email: '',
  password: '',
  confirm: '',
  terms: false,
}

export default function SignUp() {
  const [form, setForm] = useState(initialForm)
  const [error, setError] = useState('')
  const [done, setDone] = useState(false)

  const update = (field) => (event) => {
    const value = field === 'terms' ? event.target.checked : event.target.value
    setForm((current) => ({ ...current, [field]: value }))
    setError('')
    setDone(false)
  }

  const handleSubmit = (event) => {
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
    setDone(true)
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
        {done && (
          <p className="form-success" role="status">
            Demo account created — nothing was saved.
          </p>
        )}

        <button type="submit" className="btn btn-primary btn-block">
          Create account <span className="arrow">→</span>
        </button>
      </form>
    </AuthShell>
  )
}
