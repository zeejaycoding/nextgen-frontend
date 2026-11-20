/** Small rank medal used on the best-selling product cards. */
export default function RankMedal({ rank }) {
  if (!rank || rank > 3) return null

  return (
    <span className="ref-medal" aria-label={`Rank ${rank}`}>
      <svg viewBox="0 0 48 48" role="img" aria-hidden="true">
        <defs>
          <linearGradient id={`medal-${rank}`} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor={rank === 1 ? '#7fe4ff' : rank === 2 ? '#5fc9f2' : '#43a9d4'} />
            <stop offset="100%" stopColor="#0288c4" />
          </linearGradient>
        </defs>
        <path d="M14 30 8 44l10-4 6 6 6-6 10 4-6-14Z" fill="#0288c4" opacity=".85" />
        <circle cx="24" cy="20" r="16" fill={`url(#medal-${rank})`} stroke="#056f9c" strokeWidth="2" />
        <circle cx="24" cy="20" r="12.5" fill="none" stroke="#fff" strokeOpacity=".55" strokeWidth="1.5" />
        <text x="24" y="26" textAnchor="middle" fontSize="17" fontWeight="800" fill="#fff">{rank}</text>
      </svg>
    </span>
  )
}
