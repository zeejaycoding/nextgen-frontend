import Logo from './Logo'
import { useSiteSettings } from '../context/SiteSettingsContext'

const highlights = [
  'Exclusive mods & tools',
  'Built for gamers, by modders',
  'Updates straight from the team',
]

export default function AuthShell({ title, subtitle, children, footer }) {
  const { tagline } = useSiteSettings()
  return (
    <div className="auth-page">
      <div className="auth-shell">
        <aside className="auth-brand" aria-hidden="true">
          <div className="auth-brand-top">
            <Logo size={54} withText={false} />
          </div>
          <div className="auth-brand-copy">
            <h2>Welcome to the team.</h2>
            <p>Mods, tools and tutorials for the games you love.</p>
          </div>
          <ul className="auth-highlights">
            {highlights.map((item) => (
              <li key={item}>
                <span className="check">✓</span> {item}
              </li>
            ))}
          </ul>
          <span className="auth-brand-foot">{tagline}</span>
        </aside>

        <div className="auth-panel">
          <div className="auth-panel-head">
            <h1>{title}</h1>
            <p>{subtitle}</p>
          </div>
          {children}
          <div className="auth-footer">{footer}</div>
        </div>
      </div>
    </div>
  )
}
