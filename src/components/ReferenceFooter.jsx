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
                <span className="fmt-social-icon" role="img" aria-label="Twitter" title="Twitter">
                  <svg viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M23.954 4.569a10 10 0 0 1-2.825.775 4.958 4.958 0 0 0 2.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 0 0-8.384 4.482A13.944 13.944 0 0 1 1.64 3.162a4.822 4.822 0 0 0-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 0 1-2.228-.616v.061a4.923 4.923 0 0 0 3.946 4.827 4.996 4.996 0 0 1-2.212.085 4.936 4.936 0 0 0 4.604 3.417 9.868 9.868 0 0 1-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 0 0 7.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0 0 24 4.59z" />
                  </svg>
                </span>
              </li>
              <li>
                <span className="fmt-social-icon" role="img" aria-label="YouTube" title="YouTube">
                  <svg viewBox="0 0 24 24" aria-hidden="true">
                    <path
                      fillRule="evenodd"
                      d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"
                    />
                  </svg>
                </span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
