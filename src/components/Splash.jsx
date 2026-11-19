import { useEffect, useState } from 'react'
import Logo from './Logo'

/** Short branded intro shown once per page load / refresh. */
export default function Splash({ caption = 'Loading NextGen Update…' }) {
  const [phase, setPhase] = useState('visible')

  useEffect(() => {
    const leave = setTimeout(() => setPhase('leaving'), 1250)
    const done = setTimeout(() => setPhase('done'), 1750)
    return () => {
      clearTimeout(leave)
      clearTimeout(done)
    }
  }, [])

  if (phase === 'done') return null

  return (
    <div className={`splash${phase === 'leaving' ? ' splash--leaving' : ''}`} aria-hidden="true">
      <span className="splash-glow" />
      <div className="splash-center">
        <Logo size={88} light />
        <span className="splash-track"><span className="splash-progress" /></span>
        <span className="splash-caption">{caption}</span>
      </div>
    </div>
  )
}
