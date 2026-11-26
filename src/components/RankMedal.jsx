/** Medal badge traced from the reference icon: cyan ribbons + disc + rank number. */
const LEFT_RIBBON = 'M4 0 L20 0 L27 3 L30 6 L48 38 L38 42 L26 51 L0 5 L1 1 Z'
const RIGHT_RIBBON = 'M99 0 L116 0 L119 2 L119 6 L93 51 L85 44 L75 39 L72 39 L72 37 L89 7 L94 2 Z'
const MEDAL_DISC = 'M57 45 L69 46 L83 53 L93 65 L97 78 L96 92 L92 102 L83 112 L68 119 L52 119 L40 114 L30 105 L25 96 L23 89 L23 76 L25 69 L30 60 L41 50 L51 46 L56 46 Z'

export default function RankMedal({ rank }) {
  if (!rank || rank > 3) return null

  return (
    <span className="fmt-rank" aria-label={`Rank ${rank}`}>
      <svg
        className="fmt-uniF2E6"
        viewBox="0 0 120 120"
        aria-hidden="true"
        focusable="false"
      >
        <path fill="#00b0f0" d={LEFT_RIBBON} />
        <path fill="#00b0f0" d={RIGHT_RIBBON} />
        <path fill="#00b0f0" d={MEDAL_DISC} />
        <text
          x="60"
          y="82"
          textAnchor="middle"
          dominantBaseline="central"
          fill="#f8f8f8"
          fontFamily="Arial, sans-serif"
          fontSize="56"
          fontWeight="700"
        >
          {rank}
        </text>
      </svg>
    </span>
  )
}
