import { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react'
import { apiFetch, createSocket } from '../lib/api'
import { DEFAULT_SETTINGS } from '../lib/site-settings'

const SETTINGS_KEY = 'domigen-site-settings'

const REQUEST = 'DOMIGEN_REQUEST_SETTINGS'
const SETTINGS = 'DOMIGEN_SETTINGS'

const SiteSettingsContext = createContext(null)

function normalize(value = {}) {
  let logo = typeof value.logo === 'string' ? value.logo : DEFAULT_SETTINGS.logo
  if (logo === '/images/domigen-logo.png' || logo === '/images/domigen-logo.svg') logo = DEFAULT_SETTINGS.logo
  return {
    name: String(value.name ?? DEFAULT_SETTINGS.name).slice(0, 60),
    tagline: String(value.tagline ?? DEFAULT_SETTINGS.tagline).slice(0, 80),
    logo,
  }
}

function read() {
  try {
    return normalize(JSON.parse(localStorage.getItem(SETTINGS_KEY) || '{}'))
  } catch {
    return { ...DEFAULT_SETTINGS }
  }
}

const configuredAdmin = import.meta.env.VITE_ADMIN_URL || (import.meta.env.DEV ? 'http://localhost:5174' : '')

export function SiteSettingsProvider({ children }) {
  const [settings, setSettings] = useState(read)
  const bridge = useRef(null)

  const apply = useCallback((next) => {
    const clean = normalize(next)
    setSettings(clean)
    try {
      localStorage.setItem(SETTINGS_KEY, JSON.stringify(clean))
    } catch {
      /* storage can be unavailable — settings still work in memory */
    }
  }, [])

  const pull = useCallback(() => {
    bridge.current?.contentWindow?.postMessage({ type: REQUEST }, '*')
  }, [])

  useEffect(() => {
    let active = true

    apiFetch('/settings')
      .then((remote) => {
        if (active) apply(remote)
      })
      .catch(() => {
        /* apiFetch already raises the visible backend notice; keep the last
           known branding only so the page can still render. */
      })

    const socket = createSocket()
    socket.on('settings', apply)
    socket.connect()

    return () => {
      active = false
      socket.disconnect()
    }
  }, [apply])

  useEffect(() => {
    const onStorage = (event) => {
      if (event.key === SETTINGS_KEY) {
        try {
          apply(JSON.parse(event.newValue || '{}'))
        } catch {
          /* ignore malformed settings */
        }
      }
    }
    const onMessage = (event) => {
      if (event.data?.type === SETTINGS && event.data.settings) apply(event.data.settings)
    }
    window.addEventListener('storage', onStorage)
    window.addEventListener('message', onMessage)
    window.addEventListener('focus', pull)
    const timer = window.setInterval(pull, 15000)
    return () => {
      window.removeEventListener('storage', onStorage)
      window.removeEventListener('message', onMessage)
      window.removeEventListener('focus', pull)
      window.clearInterval(timer)
    }
  }, [apply, pull])

  useEffect(() => {
    document.title = settings.name
    const icon = document.querySelector('link[rel="icon"]')
    if (icon && settings.logo) icon.href = settings.logo
  }, [settings.name, settings.logo])

  const useBridge = configuredAdmin && new URL(configuredAdmin, window.location.href).origin !== window.location.origin

  return (
    <SiteSettingsContext.Provider value={{ ...settings, settings, apply }}>
      {children}
      {useBridge && (
        <iframe
          ref={bridge}
          className="settings-bridge"
          src={`${configuredAdmin.replace(/\/$/, '')}/site-settings-bridge.html`}
          title="Site settings sync"
          onLoad={pull}
        />
      )}
    </SiteSettingsContext.Provider>
  )
}

export function useSiteSettings() {
  const context = useContext(SiteSettingsContext)
  if (!context) throw new Error('useSiteSettings must be used inside SiteSettingsProvider')
  return context
}
