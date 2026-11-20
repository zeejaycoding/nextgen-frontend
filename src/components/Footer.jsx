import { Link } from 'react-router-dom'
import { DISCORD_INVITE } from '../config'
import Logo from './Logo'
import { useSiteSettings } from '../context/SiteSettingsContext'

const socials = [
  {
    label: 'Discord',
    href: DISCORD_INVITE,
    path: 'M19.3 5.3A17 17 0 0 0 15 4l-.5 1a15 15 0 0 0-5 0L9 4a17 17 0 0 0-4.3 1.3C2.1 9.4 1.3 13.5 1.7 17.5a17 17 0 0 0 5.2 2.6l1.1-1.8a11 11 0 0 1-1.7-.8l.4-.3a12 12 0 0 0 10.6 0l.4.3c-.5.3-1.1.6-1.7.8l1.1 1.8a17 17 0 0 0 5.2-2.6c.5-4.6-.8-8.7-3.6-12.2ZM8.5 15.3c-1 0-1.8-.9-1.8-2s.8-2 1.8-2 1.8.9 1.8 2-.8 2-1.8 2Zm7 0c-1 0-1.8-.9-1.8-2s.8-2 1.8-2 1.8.9 1.8 2-.8 2-1.8 2Z',
  },
]

export default function Footer() {
  const { name, tagline } = useSiteSettings()
  return (
    <footer className="site-footer">
      <div className="footer-top">
        <div className="container footer-grid">
          <div className="footer-col footer-about">
            <h2 className="footer-title">{name}</h2>
            <p>{tagline}</p>
          </div>

          <div className="footer-col">
            <h2 className="footer-title">Pages</h2>
            <ul className="footer-links">
              <li><Link to="/">Home</Link></li>
              <li><Link to="/shop">Shop</Link></li>
              <li>
                <a href={DISCORD_INVITE} target="_blank" rel="noreferrer">Discord ↗</a>
              </li>
            </ul>
          </div>

          <div className="footer-col">
            <h2 className="footer-title">Useful links</h2>
            <ul className="footer-links">
              <li><Link to="/signin">Sign In</Link></li>
              <li><Link to="/signup">Sign Up</Link></li>
            </ul>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <div className="container footer-bottom-inner">
          <div className="footer-brand">
            <Logo size={34} withText={false} />
            <span>© {new Date().getFullYear()} {name}. All rights reserved.</span>
          </div>
          <ul className="social-links">
            {socials.map((social) => (
              <li key={social.label}>
                <a href={social.href} target="_blank" rel="noreferrer" aria-label={social.label}>
                  <svg viewBox="0 0 24 24" aria-hidden="true">
                    <path d={social.path} />
                  </svg>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  )
}
