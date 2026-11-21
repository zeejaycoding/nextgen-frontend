import { useMember } from '../context/MemberContext'

export default function AccountNotice() {
  const { notice, dismissNotice } = useMember()
  if (!notice) return null

  return (
    <div className="account-notice" role="alert">
      <span>{notice}</span>
      <button type="button" onClick={dismissNotice} aria-label="Dismiss notice">×</button>
    </div>
  )
}
