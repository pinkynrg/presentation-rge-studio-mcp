import { useState, useEffect } from 'react'

const BRAINS = [
  { name: 'Claude', color: '#D97757' },
  { name: 'ChatGPT', color: '#10A37F' },
  { name: 'N8N', color: '#EA4B71' },
]

const chip = (emoji, label, opts = {}) => (
  <div style={{
    background: opts.bg || '#f8f6ff',
    borderLeft: `3px solid ${opts.accent || '#7747ff'}`,
    borderRadius: '6px',
    padding: '0.35rem 0.5rem',
    fontSize: '0.7rem',
    fontWeight: 600,
    display: 'flex',
    alignItems: 'center',
    gap: '0.4rem',
    opacity: opts.dim ? 0.35 : 1,
    transform: opts.pop ? 'scale(1.04)' : 'scale(1)',
    transition: 'opacity 0.4s, transform 0.4s',
  }}>
    <span>{emoji}</span><span>{label}</span>
  </div>
)

// The flip: before we owned brain + prompt + tools inside our product.
// Now the user's assistant is the brain, and we only hand over the tools.
export default function TheFlip() {
  const [step, setStep] = useState(0) // 0 before, 1 brain arrives, 2 wires up, 3 email done
  const [brain, setBrain] = useState(0)

  useEffect(() => {
    const t = setInterval(() => setStep((s) => (s + 1) % 4), 2000)
    return () => clearInterval(t)
  }, [])

  useEffect(() => {
    const t = setInterval(() => setBrain((b) => (b + 1) % BRAINS.length), 4000)
    return () => clearInterval(t)
  }, [])

  const b = BRAINS[brain]

  const productBox = (children, { label }) => (
    <div style={{
      border: '2px solid #7747ff',
      borderRadius: '12px',
      padding: '0.6rem',
      background: 'rgba(255,255,255,0.7)',
      position: 'relative',
    }}>
      <div style={{
        position: 'absolute', top: '-0.7rem', left: '0.8rem',
        background: '#7747ff', color: 'white', borderRadius: '8px',
        padding: '0.1rem 0.6rem', fontSize: '0.6rem', fontWeight: 700,
      }}>{label}</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem', marginTop: '0.3rem' }}>
        {children}
      </div>
    </div>
  )

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: '3rem',
      marginTop: '1.5rem',
      alignItems: 'start',
    }}>
      {/* BEFORE */}
      <div>
        <h3 style={{ textAlign: 'center', fontSize: '0.95rem', marginBottom: '1.6rem' }}>
          ⏪ Before — the Co-Pilot
        </h3>
        {productBox(
          <>
            {chip('🧠', 'The brain — our agent')}
            {chip('📋', 'The rules — our system prompt')}
            {chip('🧰', 'The buttons — our tools')}
          </>,
          { label: 'OUR PRODUCT' },
        )}
        <p style={{ textAlign: 'center', fontSize: '0.75rem', color: '#666', marginTop: '0.8rem' }}>
          Everything ours, inside our walls.
        </p>
      </div>

      {/* NOW */}
      <div style={{ opacity: step >= 1 ? 1 : 0.3, transition: 'opacity 0.5s' }}>
        <h3 style={{ textAlign: 'center', fontSize: '0.95rem', marginBottom: '0.4rem' }}>
          ⏩ Now — MCP
        </h3>

        {/* Their brain, outside our box */}
        <div style={{
          display: 'flex', justifyContent: 'center', marginBottom: '0.2rem',
          opacity: step >= 1 ? 1 : 0,
          transform: step >= 1 ? 'scale(1)' : 'scale(0.7)',
          transition: 'opacity 0.4s, transform 0.4s',
        }}>
          <div style={{
            border: `2px solid ${b.color}`, borderRadius: '20px',
            padding: '0.25rem 0.9rem', fontSize: '0.75rem', fontWeight: 800,
            color: b.color, background: 'white', display: 'flex', gap: '0.4rem', alignItems: 'center',
          }}>
            🧠 {b.name} <span style={{ fontWeight: 400, color: '#666' }}>— their brain</span>
          </div>
        </div>

        <div style={{
          textAlign: 'center', fontSize: '1.1rem', color: '#7747ff',
          opacity: step >= 2 ? 1 : 0.15, transition: 'opacity 0.4s',
          lineHeight: 1, marginBottom: '0.4rem',
        }}>↓ ↑</div>

        {productBox(
          <>
            {chip('🧰', 'The buttons — our tools', { pop: step >= 2 })}
            {chip('✉️', 'Email, built & saved', step >= 3 ? { accent: '#22bb33', bg: '#f0fff4' } : { dim: true })}
          </>,
          { label: 'OUR PRODUCT' },
        )}
        <p style={{ textAlign: 'center', fontSize: '0.75rem', color: '#666', marginTop: '0.8rem' }}>
          Their brain. Our buttons. Any assistant.
        </p>
      </div>
    </div>
  )
}
