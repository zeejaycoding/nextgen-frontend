import { Link } from 'react-router-dom'
import { DISCORD_INVITE } from '../config'
import { useSiteSettings } from '../context/SiteSettingsContext'

export default function ReferenceFooter() {
  const { name, tagline } = useSiteSettings()
  const initial = name ? name.charAt(0) : 'D'
  const rest = name ? name.slice(1) : 'OMIGEN'

  return (
    <div className="fmt-footer-wrapper">
      <div className="fmt-footer-top">
        <div className="fmt-container">
          <div className="fmt-footer-row">
            <div className="fmt-footer-widget fmt-footer-ad-widget">
              <div className="fmt-widget-title">
                <h2>Advertising</h2>
              </div>
              <div className="fmt-widget-content">
                <div className="fmt-ad" aria-hidden="true" />
              </div>
            </div>

            <div className="fmt-footer-widget">
              <div className="fmt-widget-title">
                <h2>Pages</h2>
              </div>
              <div className="fmt-widget-content">
                <ul className="fmt-footer-nav">
                  <li><Link to="/">Home</Link></li>
                  <li><Link to="/shop">Shop</Link></li>
                  <li><a href={DISCORD_INVITE} target="_blank" rel="noreferrer">Discord</a></li>
                </ul>
              </div>
            </div>

            <div className="fmt-footer-widget">
              <div className="fmt-widget-title">
                <h2>Useful links</h2>
              </div>
              <div className="fmt-widget-content">
                <ul className="fmt-footer-nav">
                  <li><a href="/terms">Terms of Use</a></li>
                  <li><Link to="/signin">Sign In</Link></li>
                  <li><Link to="/signup">Sign Up</Link></li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="fmt-footer fmt-container">
        <div className="fmt-footer-inner">
          <div className="fmt-copyright">
            <p>
              © 2012 - 2026 <span className="fmt-brand-accent">{initial}</span>
              {rest}
              {tagline ? <span className="fmt-footer-tagline"> {tagline}</span> : null}
            </p>
          </div>
          <div className="fmt-share">
            <ul className="fmt-footer-nav fmt-share-nav">
              <li>
                <span className="fmt-social-icon" role="img" aria-label="Facebook" title="Facebook">f</span>
              </li>
              <li>
                <span className="fmt-social-icon" role="img" aria-label="Twitter" title="Twitter">t</span>
              </li>
              <li>
                <span className="fmt-social-icon" role="img" aria-label="YouTube" title="YouTube">▶</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
