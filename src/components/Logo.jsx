import { useId } from 'react'

/** NextGen Update — angular NG badge with a neon cyan edge. */
export default function Logo({ size = 46, withText = true, light = false }) {
  const uid = useId().replace(/:/g, '')
  const neon = `ng-neon-${uid}`
  const shell = `ng-shell-${uid}`
  const glow = `ng-glow-${uid}`

  return (
    <span className="logo-lockup">
      <svg
        className="logo-mark"
        width={size}
        height={size}
        viewBox="0 0 64 64"
        role="img"
        aria-label="NextGen Update logo"
      >
        <defs>
          <linearGradient id={neon} x1="0" y1="1" x2="1" y2="0">
            <stop offset="0%" stopColor="#0581b5" />
            <stop offset="55%" stopColor="#06a7ea" />
            <stop offset="100%" stopColor="#7fe4ff" />
          </linearGradient>
          <linearGradient id={shell} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#06425c" />
            <stop offset="100%" stopColor="#022a3b" />
          </linearGradient>
          <filter id={glow} x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="2.2" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        <path
          d="M20 2h24l18 30-18 30H20L2 32z"
          fill={`url(#${shell})`}
          stroke={`url(#${neon})`}
          strokeWidth="2.5"
          strokeLinejoin="round"
        />
        <path
          d="M22 8h20l13 24-13 24H22L9 32z"
          fill="none"
          stroke="#ffffff"
          strokeOpacity=".12"
          strokeWidth="1"
        />
        <path
          d="M18 46V18h7l14 20V18h7v28h-7L25 26v20z"
          fill="#ffffff"
          filter={`url(#${glow})`}
        />
        <path d="M25 18h7l14 20v-7L32 18h-7z" fill={`url(#${neon})`} />
        <path d="M47 9l7-5-2 10z" fill="#7fe4ff" filter={`url(#${glow})`} />
      </svg>

      {withText && (
        <span className={`logo-word${light ? ' logo-word--light' : ''}`}>
          <span className="logo-word-main">
            NEXT<span className="accent">GEN</span> UPDATE
          </span>
        </span>
      )}
    </span>
  )
}
