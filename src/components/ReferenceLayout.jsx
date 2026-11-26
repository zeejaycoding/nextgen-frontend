import { useEffect, useRef, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { DISCORD_INVITE } from '../config'
import { brandSegments } from '../lib/brand'
import { useMember } from '../context/MemberContext'
import { useSiteSettings } from '../context/SiteSettingsContext'
import ReferenceFooter from './ReferenceFooter'

/** Header, navigation and footer used only by the reference-clone pages. */
export default function ReferenceLayout({ children }) {
  const { name, logo } = useSiteSettings()
  const { token, user, signOut } = useMember()
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const [menuOpen, setMenuOpen] = useState(false)
  const dropdownRef = useRef(null)
  const onHome = pathname === '/'
  const memberName = user?.name || user?.username || user?.email || 'Member'

  useEffect(() => setMenuOpen(false), [pathname, token])

  useEffect(() => {
    if (!menuOpen) return undefined

    const onPointerDown = (event) => {
      if (!dropdownRef.current?.contains(event.target)) setMenuOpen(false)
    }
    const onKeyDown = (event) => {
      if (event.key === 'Escape') setMenuOpen(false)
    }

    document.addEventListener('mousedown', onPointerDown)
    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.removeEventListener('mousedown', onPointerDown)
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [menuOpen])

  const handleLogout = () => {
    setMenuOpen(false)
    signOut()
    navigate('/', { replace: true })
  }

  const closeMenu = () => setMenuOpen(false)
  const onShop = pathname.startsWith('/shop') || pathname.startsWith('/product')
  const brandParts = brandSegments(name)

  return (
    <div className="fmt-clone">
      <div className="fmt-topbar">
        <div className="fmt-container fmt-topbar-inner">
          {token ? (
            <div className="user pull-right">
              <div className="space-bar">
                <div
                  ref={dropdownRef}
                  className={`dropdown${menuOpen ? ' open' : ''}`}
                  style={{ display: 'inline' }}
                >
                  <a
                    className="dropdown-toggle"
                    data-toggle="dropdown"
                    href="#user-panel"
                    aria-haspopup="true"
                    aria-expanded={menuOpen}
                    onClick={(event) => {
                      event.preventDefault()
                      setMenuOpen((value) => !value)
                    }}
                  >
                    Hello <strong>{memberName}</strong>
                    <i className="fmt-uniE04F" aria-hidden="true" />
                  </a>
                  <ul className="dropdown-menu" role="menu" aria-label="User Panel">
                    <li className="divider" role="presentation" />
                    <li className="dropdown-title" role="presentation">User Panel</li>
                    <li className="divider" role="presentation" />
                    <li><Link to="/users/account" onClick={closeMenu}>Account</Link></li>
                    <li>
                      <button type="button" className="fmt-panel-logout" onClick={handleLogout}>
                        Log Out
                      </button>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          ) : (
            <ul className="fmt-topbar-links">
              <li><Link to="/signin">Sign In</Link> |</li>
              <li><Link to="/signup">Sign Up</Link></li>
            </ul>
          )}
        </div>
      </div>

      <div className="fmt-header">
        <div className="fmt-container">
          <div className="fmt-header-inner">
            <div className="fmt-brand">
              <Link to="/" className="fmt-logo" aria-label={`${name} home`}>
                {logo ? <img src={logo} alt="" /> : <span className="fmt-logo-fallback">D</span>}
              </Link>
              <Link to="/" className="fmt-site-name">
                {brandParts.length ? brandParts.map((part, index) => (
                  part.accent
                    ? <span className="fmt-brand-accent" key={index}>{part.text}</span>
                    : <span key={index}>{part.text}</span>
                )) : (
                  <>
                    <span className="fmt-brand-accent">D</span>OMIGEN
                  </>
                )}
              </Link>
            </div>
            {!token && (
              <Link to="/signup" className="fmt-signup-btn">
                Sign Up <span aria-hidden="true">→</span>
              </Link>
            )}
          </div>
        </div>
      </div>

      <nav className="fmt-nav" aria-label="Main navigation">
        <div className="fmt-container fmt-nav-inner">
          <ul className="fmt-nav-links">
            <li className={onHome ? 'active' : undefined}>
              <Link to="/">Home</Link>
            </li>
            <li className={onShop ? 'active' : undefined}>
              <Link to="/shop">Shop</Link>
            </li>
            <li>
              <a href={DISCORD_INVITE} target="_blank" rel="noreferrer">Discord</a>
            </li>
          </ul>
        </div>
      </nav>

      <div className="fmt-main">{children}</div>
      <ReferenceFooter />
    </div>
  )
}
