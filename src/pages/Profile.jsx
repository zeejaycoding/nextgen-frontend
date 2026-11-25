import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import AuthShell from '../components/AuthShell'
import { useMember } from '../context/MemberContext'
import { apiFetch, changeMemberPassword } from '../lib/api'

const initialForm = {
  currentPassword: '',
  newPassword: '',
  confirmPassword: '',
}

export default function Profile() {
  const navigate = useNavigate()
  const { token, user, signOut } = useMember()
  const [profile, setProfile] = useState(null)
  const [form, setForm] = useState(initialForm)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    if (!token) navigate('/signin', { replace: true })
  }, [token, navigate])

  useEffect(() => {
    if (!token) return undefined
    let active = true

    apiFetch('/auth/me', { token })
      .then((data) => {
        if (active) setProfile(data)
      })
      .catch((err) => {
        if (err.status === 401) {
          signOut()
          navigate('/signin', { replace: true })
        }
      })

    return () => {
      active = false
    }
  }, [token, signOut, navigate])

  const update = (field) => (event) => {
    setForm((current) => ({ ...current, [field]: event.target.value }))
    setError('')
    setSuccess('')
  }

  const handleSubmit = async (event) => {
    event.preventDefault()

    if (!form.currentPassword) {
      setError('Enter your current password.')
      return
    }
    if (form.newPassword.length < 8) {
      setError('New password must be at least 8 characters.')
      return
    }
    if (form.newPassword !== form.confirmPassword) {
      setError('Passwords do not match.')
      return
    }

    setError('')
    setSuccess('')
    setSubmitting(true)
    try {
      await changeMemberPassword({
        currentPassword: form.currentPassword,
        newPassword: form.newPassword,
      })
      setForm(initialForm)
      setSuccess('Password changed successfully.')
    } catch (err) {
      setError(err.status ? err.message : 'Unable to change your password right now.')
    } finally {
      setSubmitting(false)
    }
  }

  const displayName = profile?.username || profile?.name || user?.username || user?.name || 'Member'
  const email = profile?.email || user?.email || ''

  return (
    <AuthShell
      title="My profile"
      subtitle="Your account details and password settings."
      footer={
        <>
          Want to browse? <Link to="/shop">Back to shop</Link>
        </>
      }
    >
      <div className="profile-summary">
        <div>
          <span>Username</span>
          <strong>{displayName}</strong>
        </div>
        <div>
          <span>Email address</span>
          <strong>{email}</strong>
        </div>
      </div>

      <h2 className="profile-section-title">Change password</h2>
      <form className="auth-form" onSubmit={handleSubmit} noValidate>
        <label className="field">
          <span>Current password</span>
          <input
            type="password"
            value={form.currentPassword}
            onChange={update('currentPassword')}
            placeholder="Your current password"
            autoComplete="current-password"
          />
        </label>

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
          <span>Confirm new password</span>
          <input
            type="password"
            value={form.confirmPassword}
            onChange={update('confirmPassword')}
            placeholder="Repeat your new password"
            autoComplete="new-password"
          />
        </label>

        {error && <p className="form-error" role="alert">{error}</p>}
        {success && <p className="form-info" role="status">{success}</p>}

        <button type="submit" className="btn btn-primary btn-block" disabled={submitting}>
          {submitting ? 'Saving…' : 'Change password'} <span className="arrow">→</span>
        </button>
      </form>
    </AuthShell>
  )
}
