import { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import PanelShell from '../components/PanelShell'
import { useMember } from '../context/MemberContext'
import { apiFetch, changeMemberPassword, listMemberApplications } from '../lib/api'

const TAB_TITLES = {
  account: 'Account',
  password: 'Password',
  notification: 'Notifications',
}

const emptyPassword = {
  currentPassword: '',
  newPassword: '',
  confirmPassword: '',
}

function formatDate(value) {
  const text = String(value || '')
  const parts = text.slice(0, 10).split('-')
  if (parts.length === 3 && parts.every(Boolean)) {
    return `${parts[2]}/${parts[1]}/${parts[0]}`
  }
  const parsed = new Date(text)
  if (Number.isNaN(parsed.getTime())) return text
  const day = String(parsed.getDate()).padStart(2, '0')
  const month = String(parsed.getMonth() + 1).padStart(2, '0')
  return `${day}/${month}/${parsed.getFullYear()}`
}

export default function Account() {
  const navigate = useNavigate()
  const { token, user, signOut } = useMember()
  const [searchParams] = useSearchParams()
  const tabParam = searchParams.get('tab')
  const activeTab = ['account', 'password', 'notification'].includes(tabParam) ? tabParam : 'account'
  const [profile, setProfile] = useState(null)
  const [passwordForm, setPasswordForm] = useState(emptyPassword)
  const [message, setMessage] = useState(null)
  const [busy, setBusy] = useState(false)
  const [purchases, setPurchases] = useState([])
  const [purchasesState, setPurchasesState] = useState('loading')

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
      .catch((error) => {
        if (error.status === 401) {
          signOut()
          navigate('/signin', { replace: true })
        }
      })

    return () => {
      active = false
    }
  }, [token, signOut, navigate])

  useEffect(() => {
    if (!token || activeTab !== 'notification') return undefined
    let active = true

    setPurchasesState('loading')
    listMemberApplications()
      .then((data) => {
        if (!active) return
        setPurchases(Array.isArray(data) ? data : [])
        setPurchasesState('ready')
      })
      .catch((error) => {
        if (!active) return
        if (error.status === 401) {
          signOut()
          navigate('/signin', { replace: true })
          return
        }
        setPurchasesState('error')
      })

    return () => {
      active = false
    }
  }, [token, activeTab, signOut, navigate])

  const handlePasswordChange = (field) => (event) => {
    setPasswordForm((current) => ({ ...current, [field]: event.target.value }))
    setMessage(null)
  }

  const handlePasswordSubmit = async (event) => {
    event.preventDefault()
    if (!passwordForm.currentPassword) {
      setMessage({ type: 'error', text: 'Enter your old password.' })
      return
    }
    if (passwordForm.newPassword.length < 8) {
      setMessage({ type: 'error', text: 'New password must be at least 8 characters.' })
      return
    }
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setMessage({ type: 'error', text: 'Passwords do not match.' })
      return
    }

    setBusy(true)
    setMessage(null)
    try {
      await changeMemberPassword({
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword,
      })
      setPasswordForm(emptyPassword)
      setMessage({ type: 'success', text: 'Password changed successfully.' })
    } catch (error) {
      setMessage({ type: 'error', text: error.message || 'Unable to change your password right now.' })
    } finally {
      setBusy(false)
    }
  }

  const displayName = profile?.username || profile?.name || user?.username || user?.name || ''
  const email = profile?.email || user?.email || ''
  const title = TAB_TITLES[activeTab]
  const subtitle = {
    account: 'Your account information.',
    password: 'Change your password or reset your current password.',
    notification: 'Manage your notifications',
  }[activeTab]

  return (
    <PanelShell active={activeTab} title={title} subtitle={subtitle}>
      {activeTab === 'account' && (
        <form className="fmt-form-horizontal" onSubmit={(event) => event.preventDefault()} noValidate>
          <div className="fmt-control-group">
            <span className="fmt-control-label">Username</span>
            <div className="fmt-controls">
              <span className="fmt-label-data">{displayName}</span>
            </div>
          </div>
          <div className="fmt-control-group">
            <span className="fmt-control-label">Email</span>
            <div className="fmt-controls">
              <span className="fmt-label-data">{email}</span>
            </div>
          </div>
        </form>
      )}

      {activeTab === 'password' && (
        <form className="fmt-form-horizontal" onSubmit={handlePasswordSubmit} noValidate>
          <div className="fmt-control-group">
            <label className="fmt-control-label" htmlFor="account-old-password">Old Password</label>
            <div className="fmt-controls">
              <input
                id="account-old-password"
                type="password"
                value={passwordForm.currentPassword}
                onChange={handlePasswordChange('currentPassword')}
                autoComplete="current-password"
              />
            </div>
          </div>

          <div className="fmt-control-group">
            <label className="fmt-control-label" htmlFor="account-new-password">New Password</label>
            <div className="fmt-controls">
              <input
                id="account-new-password"
                type="password"
                value={passwordForm.newPassword}
                onChange={handlePasswordChange('newPassword')}
                autoComplete="new-password"
              />
            </div>
          </div>

          <div className="fmt-control-group">
            <label className="fmt-control-label" htmlFor="account-confirm-password">
              New Password<br />(confirmation)
            </label>
            <div className="fmt-controls">
              <input
                id="account-confirm-password"
                type="password"
                value={passwordForm.confirmPassword}
                onChange={handlePasswordChange('confirmPassword')}
                autoComplete="new-password"
              />
            </div>
          </div>

          <div className="fmt-form-actions">
            <button type="submit" className="fmt-btn-primary" disabled={busy}>
              {busy ? 'Saving…' : 'Save'}
            </button>
          </div>

          {message?.text && (
            <p className={`fmt-alert fmt-alert-${message.type}`} role="status">
              {message.text}
            </p>
          )}
        </form>
      )}

      {activeTab === 'notification' && (
        <>
          {purchasesState === 'loading' && (
            <div className="fmt-notification-empty">Loading your notifications…</div>
          )}

          {purchasesState === 'error' && (
            <div className="fmt-notification-empty">
              Unable to load your notifications right now.
            </div>
          )}

          {purchasesState === 'ready' && purchases.length === 0 && (
            <div className="fmt-notification-empty">You have not any notifications yet.</div>
          )}

          {purchasesState === 'ready' && purchases.length > 0 && (
            <div className="fmt-notification-list">
              {purchases.map((purchase) => (
                <div className="fmt-notification-item" key={purchase.id || purchase.stripeSessionId || purchase.product}>
                  <div className="fmt-notification-title">
                    {purchase.product || 'Product'}
                  </div>
                  <div className="fmt-notification-meta">
                    Purchased on {formatDate(purchase.date)}
                    {' · '}
                    {purchase.status || 'Completed'}
                    {' · '}
                    {Number(purchase.amount) === 0
                      ? 'FREE'
                      : `$${Number(purchase.amount || 0).toFixed(2)}`}
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </PanelShell>
  )
}
