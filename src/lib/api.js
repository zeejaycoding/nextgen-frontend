import { io } from 'socket.io-client'

export const MEMBER_TOKEN_KEY = 'domigen-member-token'
export const MEMBER_USER_KEY = 'domigen-member'
export const MEMBER_AUTH_EVENT = 'domigen:member-auth'
export const ACCOUNT_STATUS_EVENT = 'domigen:account-status'
export const BACKEND_ERROR_EVENT = 'domigen:backend-error'

const DEFAULT_PRODUCTION_API_URL = 'https://domigen-backend.onrender.com'
const configured = import.meta.env.VITE_API_URL
  || (import.meta.env.DEV ? 'http://127.0.0.1:4000' : DEFAULT_PRODUCTION_API_URL)

export const API_BASE = String(configured).replace(/\/$/, '')

export function apiUrl(path) {
  const suffix = path.startsWith('/api/') || path === '/api' ? path : `/api${path}`
  return `${API_BASE}${suffix}`
}

function authHeaders(token) {
  return token ? { Authorization: `Bearer ${token}` } : {}
}

export async function apiFetch(path, { token, ...options } = {}) {
  let response
  try {
    response = await fetch(apiUrl(path), {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...authHeaders(token),
        ...options.headers,
      },
    })
  } catch {
    const message = 'Unable to reach the server. Check that the backend is running.'
    reportBackendError(message)
    const error = new Error(message)
    error.status = 0
    throw error
  }

  let data = null
  try {
    data = await response.json()
  } catch {
    const message = 'The backend returned an invalid response. Check the API URL.'
    reportBackendError(message)
    const error = new Error(message)
    error.status = response.status
    throw error
  }

  if (!response.ok) {
    const message = data?.message || `Request failed (${response.status}).`
    if (response.status >= 500) reportBackendError(message)
    const error = new Error(message)
    error.status = response.status
    error.code = data?.code || ''
    if (error.code === 'ACCOUNT_SUSPENDED' || error.code === 'ACCOUNT_DELETED') {
      window.dispatchEvent(new CustomEvent(ACCOUNT_STATUS_EVENT, {
        detail: { code: error.code, message: error.message },
      }))
    }
    throw error
  }

  return data
}

export function createSocket(auth = {}) {
  return io(API_BASE || window.location.origin, {
    autoConnect: false,
    transports: ['polling', 'websocket'],
    auth,
  })
}

function reportBackendError(message) {
  window.dispatchEvent(new CustomEvent(BACKEND_ERROR_EVENT, { detail: { message } }))
}

function notifyMemberAuth() {
  window.dispatchEvent(new Event(MEMBER_AUTH_EVENT))
}

export function readMemberAuth() {
  try {
    return {
      token: localStorage.getItem(MEMBER_TOKEN_KEY) || '',
      user: JSON.parse(localStorage.getItem(MEMBER_USER_KEY) || 'null'),
    }
  } catch {
    return { token: '', user: null }
  }
}

export function saveMemberAuth({ token, user }) {
  if (token) localStorage.setItem(MEMBER_TOKEN_KEY, token)
  if (user) localStorage.setItem(MEMBER_USER_KEY, JSON.stringify(user))
  notifyMemberAuth()
}

export function clearMemberAuth() {
  localStorage.removeItem(MEMBER_TOKEN_KEY)
  localStorage.removeItem(MEMBER_USER_KEY)
  notifyMemberAuth()
}

export async function signInMember(credentials) {
  const data = await apiFetch('/auth/signin', {
    method: 'POST',
    body: JSON.stringify(credentials),
  })
  saveMemberAuth(data)
  return data
}

export async function signUpMember(details) {
  const data = await apiFetch('/auth/signup', {
    method: 'POST',
    body: JSON.stringify(details),
  })
  saveMemberAuth(data)
  return data
}

export async function createFreeOrder(productId) {
  const { token } = readMemberAuth()
  return apiFetch('/payments', {
    method: 'POST',
    token,
    body: JSON.stringify({ productId }),
  })
}

export async function getPaymentConfig() {
  return apiFetch('/payments/config')
}

export async function createCheckoutSession(payload) {
  const { token } = readMemberAuth()
  return apiFetch('/checkout/session', {
    method: 'POST',
    token,
    body: JSON.stringify(payload),
  })
}

export async function getCheckoutSession(sessionId) {
  const { token } = readMemberAuth()
  return apiFetch(`/checkout/session/${encodeURIComponent(sessionId)}`, { token })
}
