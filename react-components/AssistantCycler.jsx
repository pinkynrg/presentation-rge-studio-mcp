import { useState, useEffect } from 'react'
import { PROVIDERS, LAST, cycleDelay } from './providers'

// Title-slide subtitle: "RGE Studio, inside <assistant>" — cycles the SAME
// providers as the How-to-connect tabs, at the SAME accelerating pace.
export default function AssistantCycler() {
  const [idx, setIdx] = useState(0)

  useEffect(() => {
    const t = setTimeout(() => setIdx((i) => (i >= LAST ? 0 : i + 1)), cycleDelay(idx))
    return () => clearTimeout(t)
  }, [idx])

  const a = PROVIDERS[idx]

  return (
    <div style={{ fontSize: '1.5rem', marginTop: '1rem' }}>
      RGE Studio, inside{' '}
      <span style={{
        display: 'inline-block',
        minWidth: '9rem',
        textAlign: 'left',
        fontWeight: 800,
        color: a.color,
        fontStyle: a.italic ? 'italic' : 'normal',
      }}>{a.label}</span>
    </div>
  )
}
