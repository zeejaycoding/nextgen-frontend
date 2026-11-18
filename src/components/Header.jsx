import { Link, NavLink } from 'react-router-dom'
import { DISCORD_INVITE } from '../config'
import Logo from './Logo'

const navItems = [
  { label: 'Home', to: '/' },
  { label: 'Shop', to: '/shop' },
  { label: 'Discord', to: DISCORD_INVITE, external: true },
]

export default function Header() {
  return (
    <header className="site-header">
      <div className="top-header">
        <div className="container top-header-inner">
          <Link to="/" className="brand-link" aria-label="NextGen home">
            <Logo />
          </Link>

          <div className="header-auth">
            <Link to="/signin" className="auth-signin">Sign In</Link>
            <Link to="/signup" className="btn btn-primary btn-sm">Sign Up</Link>
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
