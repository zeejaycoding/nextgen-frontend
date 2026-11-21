import { useEffect, useState } from 'react'
import { BACKEND_ERROR_EVENT } from '../lib/api'

export default function BackendNotice() {
  const [message, setMessage] = useState('')

  useEffect(() => {
    const onError = (event) => setMessage(
      event.detail?.message || 'The backend is unavailable right now.',
    )
    window.addEventListener(BACKEND_ERROR_EVENT, onError)
    return () => window.removeEventListener(BACKEND_ERROR_EVENT, onError)
  }, [])

  if (!message) return null

  return (
    <div className="backend-notice" role="alert">
      <strong>Backend unavailable</strong>
      <span>{message}</span>
      <button type="button" onClick={() => setMessage('')} aria-label="Dismiss notice">×</button>
    </div>
  )
}
