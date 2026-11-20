import { useSiteSettings, DEFAULT_SETTINGS } from '../context/SiteSettingsContext'

/** Site logo: admin-controlled artwork with a text fallback. */
export default function Logo({ size = 46, withText = true, withTagline = true, light = false }) {
  const { name, tagline, logo } = useSiteSettings()
  const isDefault = logo === DEFAULT_SETTINGS.logo
  const split = Math.ceil(name.length / 2)
  const showWord = withText && Boolean(name)

  return (
    <span className={`logo-lockup${isDefault ? ' logo-lockup--image' : ''}`}>
      {logo ? (
        <img
          className={`logo-mark logo-image${isDefault ? ' logo-image--default' : ''}`}
          {...(isDefault ? {} : { width: size, height: size })}
          src={logo}
          alt={`${name} logo`}
        />
      ) : (
        <svg className="logo-mark" width={size} height={size} viewBox="0 0 64 64" role="img" aria-label={`${name} logo`}>
          <defs>
            <linearGradient id="ng-neon" x1="0" y1="1" x2="1" y2="0">
              <stop offset="0%" stopColor="#0581b5" />
              <stop offset="55%" stopColor="#06a7ea" />
              <stop offset="100%" stopColor="#7fe4ff" />
            </linearGradient>
            <linearGradient id="ng-shell" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#06425c" />
              <stop offset="100%" stopColor="#022a3b" />
            </linearGradient>
          </defs>
          <path d="M20 2h24l18 30-18 30H20L2 32z" fill="url(#ng-shell)" stroke="url(#ng-neon)" strokeWidth="2.5" strokeLinejoin="round" />
          <path d="M18 46V18h7l14 20V18h7v28h-7L25 26v20z" fill="#fff" />
        </svg>
      )}

      {showWord && (
        <span className={`logo-word logo-word--tagline${light ? ' logo-word--light' : ''}`}>
          <span className="logo-word-main">
            {name.slice(0, split)}<span className="accent">{name.slice(split)}</span>
          </span>
          {withTagline && tagline && <span className="logo-word-sub">{tagline}</span>}
        </span>
      )}
    </span>
  )
}
