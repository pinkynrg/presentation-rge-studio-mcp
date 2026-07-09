import { useState, useEffect } from 'react'

const flashKf = `
@keyframes selfieFlash {
  0% { opacity: 0.9; }
  100% { opacity: 0; }
}
`

// Tiny email mock used by all three cards.
function MiniEmail({ rows = 3, highlight = false }) {
  const palette = ['#7747ff', '#e0e0e0', '#f0f0f0']
  return (
    <div style={{
      border: `1.5px solid ${highlight ? '#22bb33' : '#e0e0e0'}`,
      borderRadius: '6px',
      overflow: 'hidden',
      width: '100%',
      transition: 'border-color 0.3s',
    }}>
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} style={{
          height: i === 0 ? 18 : 12,
          background: palette[i % palette.length],
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          {i === 0 && <span style={{ color: 'white', fontSize: '0.45rem', fontWeight: 700 }}>SUMMER SALE ☀️</span>}
          {i === rows - 1 && (
            <span style={{
              background: '#7747ff', color: 'white', fontSize: '0.4rem',
              borderRadius: 2, padding: '0.05rem 0.4rem', fontWeight: 700,
            }}>Shop now</span>
          )}
        </div>
      ))}
    </div>
  )
}

const CODE_LINES = [
  'addSection({ columns: [12] })',
  'addTitle("Summer Sale ☀️")',
  'addButton("Shop now")',
]

// Three moves that make the MCP feel like magic:
// 1. codemode — the AI writes a little recipe, our editor cooks it
// 2. preview — the email shows up right in the chat
// 3. selfie — the AI screenshots its own work and checks it before saving
export default function ThreeMoves() {
  const [tick, setTick] = useState(0)
  useEffect(() => {
    const t = setInterval(() => setTick((x) => x + 1), 700)
    return () => clearInterval(t)
  }, [])

  const active = Math.floor(tick / 6) % 3
  const sub = tick % 6

  const card = (idx) => ({
    border: `2px solid ${active === idx ? '#7747ff' : '#e8deff'}`,
    borderRadius: '12px',
    padding: '0.7rem',
    background: 'rgba(255,255,255,0.85)',
    opacity: active === idx ? 1 : 0.45,
    transform: active === idx ? 'scale(1.02)' : 'scale(1)',
    transition: 'all 0.4s',
    minHeight: '250px',
  })

  const header = (emoji, title, sub_) => (
    <div style={{ textAlign: 'center', marginBottom: '0.5rem' }}>
      <div style={{ fontSize: '1.6rem' }}>{emoji}</div>
      <div style={{ fontWeight: 800, fontSize: '0.8rem', color: '#7747ff' }}>{title}</div>
      <div style={{ fontSize: '0.62rem', color: '#666' }}>{sub_}</div>
    </div>
  )

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1.2rem', marginTop: '1.2rem' }}>
      <style>{flashKf}</style>
      <style>{`.slidev-layout div.code-term, .slidev-layout div.code-term * { color: #7CFC98 !important; }`}</style>

      {/* 1 — codemode */}
      <div style={card(0)}>
        {header('🧑‍🍳', 'It writes a recipe', 'codemode: real TypeScript, run by our editor')}
        <div style={{ background: '#1a1a1a', borderRadius: '6px', padding: '0.4rem 0.5rem', minHeight: '58px', marginBottom: '0.5rem' }}>
          {CODE_LINES.map((line, i) => (
            <div key={line} className="code-term" style={{
              color: '#7CFC98', fontFamily: 'monospace', fontSize: '0.52rem',
              opacity: active === 0 ? (sub > i ? 1 : 0.12) : 1,
              transition: 'opacity 0.3s',
            }}>{line}</div>
          ))}
        </div>
        <div style={{ opacity: active !== 0 || sub >= 4 ? 1 : 0.15, transition: 'opacity 0.4s' }}>
          <MiniEmail />
        </div>
      </div>

      {/* 2 — preview in chat */}
      <div style={card(1)}>
        {header('💬', 'You see it in the chat', 'MCP Apps: the real email, rendered inline')}
        <div style={{
          background: '#e8f5e9', borderRadius: '10px 10px 2px 10px', padding: '0.3rem 0.5rem',
          fontSize: '0.6rem', width: '80%', marginLeft: 'auto', marginBottom: '0.4rem',
        }}>show me the email</div>
        <div style={{
          background: '#f8f6ff', borderRadius: '10px 10px 10px 2px', padding: '0.4rem',
          width: '88%',
          opacity: active !== 1 || sub >= 2 ? 1 : 0,
          transform: active === 1 && sub < 2 ? 'scale(0.7)' : 'scale(1)',
          transition: 'all 0.5s',
        }}>
          <MiniEmail rows={4} />
        </div>
        <div style={{ fontSize: '0.6rem', color: '#666', textAlign: 'center', marginTop: '0.4rem' }}>
          no links, no attachments — it's just <i>there</i>
        </div>
      </div>

      {/* 3 — selfie check */}
      <div style={card(2)}>
        {header('🤳', 'It checks its own work', 'a screenshot only the AI can see')}
        <div style={{ position: 'relative', width: '88%', margin: '0 auto' }}>
          <MiniEmail rows={4} highlight={active === 2 && sub >= 3} />
          {active === 2 && sub === 1 && (
            <div style={{
              position: 'absolute', inset: 0, background: 'white',
              animation: 'selfieFlash 0.6s ease-out forwards',
            }} />
          )}
        </div>
        <div style={{ textAlign: 'center', marginTop: '0.5rem', fontSize: '0.65rem', fontWeight: 700 }}>
          <span style={{ opacity: active !== 2 || sub >= 3 ? 1 : 0, color: '#22bb33', transition: 'opacity 0.3s' }}>
            ✓ looks good
          </span>
          {' '}
          <span style={{ opacity: active !== 2 || sub >= 5 ? 1 : 0, transition: 'opacity 0.3s' }}>
            → 💾 saved
          </span>
        </div>
      </div>
    </div>
  )
}
