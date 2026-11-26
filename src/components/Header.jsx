import { Link, NavLink, useNavigate } from 'react-router-dom'
import { DISCORD_INVITE } from '../config'
import Logo from './Logo'
import { useMember } from '../context/MemberContext'
import { useSiteSettings } from '../context/SiteSettingsContext'

const navItems = [
  { label: 'Home', to: '/' },
  { label: 'Shop', to: '/shop' },
  { label: 'Discord', to: DISCORD_INVITE, external: true },
]

export default function Header() {
  const { name } = useSiteSettings()
  const { token, user, signOut } = useMember()
  const navigate = useNavigate()
  const memberName = user?.name || user?.username || user?.email || 'Member'

  const handleLogout = () => {
    signOut()
    navigate('/', { replace: true })
  }

  return (
    <header className="site-header">
      <div className="top-header">
        <div className="container top-header-inner">
          <Link to="/" className="brand-link" aria-label={`${name} home`}>
            <Logo withTagline={false} />
          </Link>

          <div className="header-auth">
            {token ? (
              <>
                <span className="auth-member-name">Hello <strong>{memberName}</strong></span>
                <Link to="/users/account" className="auth-profile-link">Account</Link>
                <button type="button" className="auth-signin auth-logout" onClick={handleLogout}>
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/signin" className="auth-signin">Sign In</Link>
                <Link to="/signup" className="btn btn-primary btn-sm">Sign Up</Link>
              </>
            )}
          </div>
        </div>
      </div>

      <nav className="main-nav" aria-label="Main navigation">
        <div className="container main-nav-inner">
          <ul className="nav-list">
            {navItems.map((item) => (
              <li key={item.label}>
                {item.external ? (
                  <a href={item.to} target="_blank" rel="noreferrer">
                    {item.label} <span className="external-arrow" aria-hidden="true">↗</span>
                  </a>
                ) : (
                  <NavLink
                    to={item.to}
                    end={item.to === '/'}
                    className={({ isActive }) => (isActive ? 'active' : undefined)}
                  >
                    {item.label}
                  </NavLink>
                )}
              </li>
            ))}
          </ul>
        </div>
      </nav>
    </header>
  )
}
