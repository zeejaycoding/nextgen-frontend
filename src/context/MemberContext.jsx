import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'
import {
  ACCOUNT_STATUS_EVENT,
  MEMBER_AUTH_EVENT,
  apiFetch,
  clearMemberAuth,
  createSocket,
  readMemberAuth,
  saveMemberAuth,
} from '../lib/api'

const MemberContext = createContext(null)

export function MemberProvider({ children }) {
  const [auth, setAuth] = useState(() => readMemberAuth())
  const [notice, setNotice] = useState('')

  const forceLogout = useCallback((message) => {
    clearMemberAuth()
    setAuth({ token: '', user: null })
    setNotice(message || 'Your account is no longer available. Please sign in again.')
  }, [])

  useEffect(() => {
    const sync = () => setAuth(readMemberAuth())
    const onStatus = (event) => forceLogout(event.detail?.message)

    window.addEventListener(MEMBER_AUTH_EVENT, sync)
    window.addEventListener('storage', sync)
    window.addEventListener(ACCOUNT_STATUS_EVENT, onStatus)

    return () => {
      window.removeEventListener(MEMBER_AUTH_EVENT, sync)
      window.removeEventListener('storage', sync)
      window.removeEventListener(ACCOUNT_STATUS_EVENT, onStatus)
    }
  }, [forceLogout])

  useEffect(() => {
    if (!auth.token) return undefined

    const validate = () => apiFetch('/auth/me', { token: auth.token }).catch(() => {})
    validate()
    window.addEventListener('focus', validate)
    return () => window.removeEventListener('focus', validate)
  }, [auth.token])

  useEffect(() => {
    if (!auth.token) return undefined

    const socket = createSocket({ token: auth.token })
    socket.on('account:suspended', (payload) => forceLogout(
      payload?.message || 'Your account has been suspended. Please contact support for help.',
    ))
    socket.on('account:deleted', (payload) => forceLogout(
      payload?.message || 'Your account has been deleted and is no longer available.',
    ))
    socket.on('account:password-changed', (payload) => forceLogout(
      payload?.message || 'Your password was changed by an administrator. Please sign in again.',
    ))
    socket.connect()

    return () => socket.disconnect()
  }, [auth.token, forceLogout])

  const value = useMemo(() => ({
    token: auth.token,
    user: auth.user,
    notice,
    dismissNotice: () => setNotice(''),
    signIn: (data) => {
      setNotice('')
      saveMemberAuth(data)
      setAuth(readMemberAuth())
    },
    signOut: () => {
      setNotice('')
      clearMemberAuth()
      setAuth({ token: '', user: null })
    },
  }), [auth, notice])

  return <MemberContext.Provider value={value}>{children}</MemberContext.Provider>
}

export function useMember() {
  const context = useContext(MemberContext)
  if (!context) throw new Error('useMember must be used within MemberProvider')
  return context
}
