/** Polished cyan medal badge with the rank number, worn on the card corner. */
export default function RankMedal({ rank }) {
  if (!rank || rank > 3) return null

  const gradientId = `medal-gradient-${rank}`

  return (
    <span className="ref-medal" aria-label={`Rank ${rank}`}>
      <svg viewBox="0 0 56 64" aria-hidden="true" focusable="false">
        <defs>
          <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#4fd0ff" />
            <stop offset="100%" stopColor="#0489cf" />
          </linearGradient>
        </defs>
        <path className="ref-medal-ribbon" d="M13 5 L28 20 L19 34 L4 19 Z" />
        <path className="ref-medal-ribbon" d="M43 5 L28 20 L37 34 L52 19 Z" />
        <circle
          className="ref-medal-disc"
          cx="28"
          cy="42"
          r="19"
          fill={`url(#${gradientId})`}
        />
        <circle className="ref-medal-inner" cx="28" cy="42" r="15" />
        <text
          className="ref-medal-number"
          x="28"
          y="42"
          textAnchor="middle"
          dominantBaseline="central"
        >
          {rank}
        </text>
      </svg>
    </span>
  )
}
