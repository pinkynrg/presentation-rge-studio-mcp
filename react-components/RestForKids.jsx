import { useState, useEffect } from 'react'

const NODES = [
  { x: 14, emoji: '🧒', label: 'You' },
  { x: 50, emoji: '🤵', label: 'The waiter (the API)' },
  { x: 86, emoji: '🍳', label: 'The kitchen (the data)' },
]

// the request travels right, then the response travels back left
const STEPS = [
  { x: 14, emoji: '📝', cap: 'You ask for something.', req: true },
  { x: 50, emoji: '📝', cap: 'The waiter takes your order…', req: true },
  { x: 86, emoji: '📝', cap: '…to the kitchen.', req: true },
  { x: 86, emoji: '🍕', cap: 'The kitchen makes it.', req: false },
  { x: 50, emoji: '🍕', cap: 'The waiter brings it back…', req: false },
  { x: 14, emoji: '🍕', cap: '…and hands it to you!', req: false },
]

export default function RestForKids() {
  const [s, setS] = useState(0)
  useEffect(() => {
    const t = setInterval(() => setS((v) => (v + 1) % STEPS.length), 1300)
    return () => clearInterval(t)
  }, [])

  const st = STEPS[s]
  const accent = st.req ? '#7747ff' : '#22bb33'

  return (
    <div style={{ marginTop: '2rem' }}>
      <style>{`.rk-cap { color: #1a1a1a !important; }`}</style>

      <div style={{ position: 'relative', height: '190px' }}>
        {/* track */}
        <div style={{ position: 'absolute', top: '22%', left: '14%', right: '14%', borderTop: '2px dashed #d9cffa' }} />

        {/* travelling token */}
        <div style={{
          position: 'absolute', top: '22%', left: `${st.x}%`, transform: 'translate(-50%, -50%)',
          transition: 'left 0.9s ease-in-out',
          width: '3rem', height: '3rem', borderRadius: '50%', background: '#fff',
          border: `2px solid ${accent}`, boxShadow: `0 3px 12px ${accent}55`,
          display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.7rem', zIndex: 2,
        }}>{st.emoji}</div>

        {/* nodes */}
        {NODES.map((n) => {
          const here = st.x === n.x
          return (
            <div key={n.label} style={{
              position: 'absolute', left: `${n.x}%`, top: '62%', transform: `translate(-50%, -50%) scale(${here ? 1.12 : 1})`,
              transition: 'transform 0.4s', textAlign: 'center', width: '32%',
            }}>
              <div style={{ fontSize: '3.2rem', lineHeight: 1 }}>{n.emoji}</div>
              <div className="rk-cap" style={{ fontSize: '0.85rem', fontWeight: 700, marginTop: '0.4rem' }}>{n.label}</div>
            </div>
          )
        })}
      </div>

      <div className="rk-cap" style={{ textAlign: 'center', fontSize: '1.3rem', fontWeight: 700, marginTop: '1.4rem' }}>
        {st.cap}
      </div>
      <div style={{ textAlign: 'center', fontSize: '0.9rem', marginTop: '0.6rem' }}>
        <span style={{ color: '#7747ff', fontWeight: 700 }}>You ask</span>
        <span style={{ color: '#999' }}> = request </span>
        <span style={{ color: '#999' }}>·</span>
        <span style={{ color: '#22bb33', fontWeight: 700 }}> it brings back</span>
        <span style={{ color: '#999' }}> = response</span>
      </div>
    </div>
  )
}
