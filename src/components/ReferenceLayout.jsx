import { Link, useLocation, useNavigate } from 'react-router-dom'
import { DISCORD_INVITE } from '../config'
import { useMember } from '../context/MemberContext'
import { useSiteSettings } from '../context/SiteSettingsContext'
import ReferenceFooter from './ReferenceFooter'

/** Header, navigation and footer used only by the three reference-clone pages. */
export default function ReferenceLayout({ children }) {
  const { name, logo } = useSiteSettings()
  const { token, user, signOut } = useMember()
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const onHome = pathname === '/'
  const memberName = user?.name || user?.username || user?.email || 'Member'

  const handleLogout = () => {
    signOut()
    navigate('/', { replace: true })
  }
  const onShop = pathname.startsWith('/shop') || pathname.startsWith('/product')

  return (
    <div className="fmt-clone">
      <div className="fmt-topbar">
        <div className="fmt-container fmt-topbar-inner">
          <ul className="fmt-topbar-links">
            {token ? (
              <>
                <li><span className="fmt-member-name">Hi, {memberName}</span> |</li>
                <li>
                  <button type="button" className="fmt-logout" onClick={handleLogout}>Logout</button>
                </li>
              </>
            ) : (
              <>
                <li>
                  <Link to="/signin">Sign In</Link> |
                </li>
                <li>
                  <Link to="/signup">Sign Up</Link>
                </li>
              </>
            )}
          </ul>
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
                <span className="fmt-brand-accent">{name ? name.charAt(0) : 'D'}</span>
                {name ? name.slice(1) : 'OMIGEN'}
              </Link>
            </div>
            <Link to="/signup" className="fmt-signup-btn">
              Sign Up <span aria-hidden="true">→</span>
            </Link>
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
