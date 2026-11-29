import { useEffect, useRef, useState } from 'react'
import { Link, useParams, useSearchParams } from 'react-router-dom'
import AuthShell from '../components/AuthShell'
import { resendVerificationEmail, verifyMemberEmail } from '../lib/api'

export default function VerifyEmail() {
  const [searchParams] = useSearchParams()
  const { token: pathToken } = useParams()
  const token = pathToken || searchParams.get('token') || ''
  const [status, setStatus] = useState('loading')
  const [message, setMessage] = useState('Verifying your email…')
  const [email, setEmail] = useState('')
  const [resendEmail, setResendEmail] = useState('')
  const [resendMessage, setResendMessage] = useState('')
  const [resending, setResending] = useState(false)
  const started = useRef(false)

  useEffect(() => {
    // React StrictMode replays effects in development; a verification link is
    // single-use, so only the first attempt is allowed to call the API.
    if (started.current) return
    started.current = true

    if (!token) {
      setStatus('error')
      setMessage('This verification link is missing its token. Sign in to request a new one.')
      return
    }

    verifyMemberEmail(token)
      .then((data) => {
        setStatus('success')
        setEmail(data.email || '')
        setMessage(data.message || 'Email verified. You can sign in now.')
      })
      .catch((error) => {
        setStatus('error')
        setMessage(error.status ? error.message : 'Unable to verify your email right now.')
      })
  }, [token])

  const handleResend = async (event) => {
    event.preventDefault()
    if (!/^\S+@\S+\.\S+$/.test(resendEmail)) {
      setResendMessage('Please enter a valid email address.')
      return
    }

    setResending(true)
    setResendMessage('')
    try {
      const data = await resendVerificationEmail(resendEmail.trim())
      setResendMessage(data.message || 'A new verification link has been sent.')
    } catch (error) {
      setResendMessage(error.status ? error.message : 'Unable to resend the email right now.')
    } finally {
      setResending(false)
    }
  }

  return (
    <AuthShell
      title={status === 'success' ? 'Email verified' : status === 'error' ? 'Verification issue' : 'Verifying email'}
      subtitle={status === 'success' ? 'Your account is ready.' : 'One more step to activate your account.'}
      footer={
        status === 'success' ? (
          <>Ready to go? <Link to="/signin">Sign in</Link></>
        ) : (
          <>Need help? <Link to="/signin">Back to sign in</Link></>
        )
      }
    >
      <div className="auth-result">
        <p className={status === 'error' ? 'form-error' : 'form-info'} role={status === 'error' ? 'alert' : 'status'}>
          {message}
          {email && <> <strong>{email}</strong></>}
        </p>

        {status === 'success' && (
          <Link to="/signin" className="btn btn-primary btn-block">Sign in →</Link>
        )}

        {status === 'error' && (
          <form className="auth-form" onSubmit={handleResend} noValidate>
            <label className="field">
              <span>Resend verification email</span>
              <input
                type="email"
                value={resendEmail}
                onChange={(event) => { setResendEmail(event.target.value); setResendMessage('') }}
                placeholder="you@example.com"
                autoComplete="email"
              />
            </label>
            <button type="submit" className="btn btn-ghost btn-block" disabled={resending}>
              {resending ? 'Sending…' : 'Send a new link'}
            </button>
            {resendMessage && <p className="form-info" role="status">{resendMessage}</p>}
          </form>
        )}
      </div>
    </AuthShell>
  )
}
