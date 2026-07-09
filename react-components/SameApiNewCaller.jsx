import { useState, useEffect } from 'react'

const apiPulseKf = `
@keyframes apiPulse {
  0%, 100% { box-shadow: 0 0 0 0 rgba(119, 71, 255, 0); }
  50% { box-shadow: 0 0 18px 8px rgba(119, 71, 255, 0.35); }
}
`

// Same API, new caller: the human clicks Save in the app, the AI calls the
// create_email tool — the very same request lands on the very same backend API.
export default function SameApiNewCaller() {
  const [step, setStep] = useState(0)
  // 0 human clicks · 1 chip flies · 2 API hit · 3 AI calls · 4 chip flies · 5 API hit
  useEffect(() => {
    const t = setInterval(() => setStep((s) => (s + 1) % 6), 1100)
    return () => clearInterval(t)
  }, [])

  const humanTurn = step <= 2
  const hit = step === 2 || step === 5

  const panel = (active) => ({
    border: `2px solid ${active ? '#7747ff' : '#e8deff'}`,
    borderRadius: '12px',
    padding: '0.6rem',
    background: 'rgba(255,255,255,0.8)',
    opacity: active ? 1 : 0.45,
    transition: 'opacity 0.4s, border-color 0.4s',
    display: 'flex',
    flexDirection: 'column',
  })

  // The request rides an empty lane BELOW the boxes: it starts under its
  // caller and converges to the center (under the API), overlapping no text.
  const laneChip = (side, flying, gone) => {
    const isLeft = side === 'left'
    return {
      position: 'absolute',
      top: '3px',
      // stop with the badge CENTERED on the midline (half of it past 50%)
      [side]: flying ? '50%' : '9%',
      transform: flying ? (isLeft ? 'translateX(-50%)' : 'translateX(50%)') : 'translateX(0)',
      background: '#1a1a1a',
      color: '#7CFC98',
      fontFamily: 'monospace',
      fontSize: '0.6rem',
      padding: '0.15rem 0.5rem',
      borderRadius: '6px',
      whiteSpace: 'nowrap',
      boxShadow: '0 2px 8px rgba(0,0,0,0.25)',
      opacity: gone ? 0 : 1,
      transition: `${side} 0.9s ease-in-out, transform 0.9s ease-in-out, opacity 0.3s`,
      zIndex: 5,
    }
  }

  // Action label under the author name — pops in only while that side is
  // firing its request, hidden otherwise. Fixed height so layout never jumps.
  const actionPill = (text, show) => (
    <div style={{ height: '1.4rem', textAlign: 'center', margin: '0.25rem 0 0.5rem' }}>
      <span style={{
        display: 'inline-block',
        color: '#7747ff', fontStyle: 'italic', fontWeight: 600,
        fontSize: '0.68rem', whiteSpace: 'nowrap',
        opacity: show ? 1 : 0,
        transform: show ? 'translateY(0)' : 'translateY(-4px)',
        transition: 'opacity 0.3s, transform 0.3s',
      }}>⚡ {text}</span>
    </div>
  )

  return (
    <div style={{ position: 'relative', marginTop: '1.2rem' }}>
      <style>{apiPulseKf}</style>
      <style>{`.slidev-layout div.req-chip, .slidev-layout div.req-chip * { color: #7CFC98 !important; }`}</style>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.1fr 1fr', gap: '1.2rem', alignItems: 'stretch' }}>

        {/* Human + app UI */}
        <div style={panel(humanTurn)}>
          <div style={{ textAlign: 'center', fontSize: '1.6rem' }}>🙋</div>
          <div style={{ textAlign: 'center', fontSize: '0.7rem', fontWeight: 700 }}>
            You, in the RGE Studio app
          </div>
          {actionPill('clicks Save', humanTurn)}
          {/* editor screenshot in a mac-window frame */}
          <div style={{
            border: '1px solid #e0e0e0', borderRadius: '8px', overflow: 'hidden',
            flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column',
          }}>
            <div style={{ background: '#f0f0f0', padding: '0.2rem 0.4rem', display: 'flex', gap: '0.2rem' }}>
              {['#ff5f57', '#febc2e', '#28c840'].map((c) => (
                <span key={c} style={{ width: 7, height: 7, borderRadius: '50%', background: c, display: 'inline-block' }} />
              ))}
            </div>
            <img src="/assets/editor.png" style={{
              width: '100%', flex: 1, minHeight: 0, objectFit: 'cover', objectPosition: 'top', display: 'block',
            }} />
          </div>
        </div>

        {/* The API — the waiter */}
        <div style={{
          border: '2px solid #7747ff',
          borderRadius: '14px',
          padding: '0.8rem 0.6rem',
          background: 'white',
          textAlign: 'center',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          animation: hit ? 'apiPulse 0.9s ease-in-out' : 'none',
        }}>
          <div style={{ fontSize: '2.2rem' }}>🤵</div>
          <div style={{ fontWeight: 800, fontSize: '0.85rem', color: '#7747ff' }}>The backend API</div>
          <div style={{ fontSize: '0.65rem', color: '#666', marginBottom: '0.4rem' }}>the waiter: you ask, it brings</div>
          <code style={{
            background: '#f8f6ff', borderRadius: '6px', padding: '0.2rem 0.5rem',
            fontSize: '0.6rem', display: 'inline-block',
          }}>POST /messages/</code>
          <div style={{
            color: '#22bb33', fontWeight: 800, fontSize: '0.75rem', marginTop: '0.35rem',
            opacity: hit ? 1 : 0, transition: 'opacity 0.3s',
          }}>200 ✓ saved</div>
        </div>

        {/* The AI */}
        <div style={panel(!humanTurn)}>
          <div style={{ textAlign: 'center', fontSize: '1.6rem' }}>🤖</div>
          <div style={{ textAlign: 'center', fontSize: '0.7rem', fontWeight: 700 }}>
            The AI, in your chat
          </div>
          {actionPill('calls the tool', !humanTurn)}
          <div style={{
            background: '#f8f6ff', borderRadius: '10px 10px 10px 2px', padding: '0.45rem 0.55rem',
            fontSize: '0.62rem', fontFamily: 'monospace',
            border: step === 3 ? '1px solid #7747ff' : '1px solid transparent',
            transition: 'border-color 0.3s',
          }}>
            create_email(&#123;<br />
            &nbsp;&nbsp;template_id: "tpl_a1b2c3",<br />
            &nbsp;&nbsp;customer_id: 3,<br />
            &nbsp;&nbsp;brand_id: 7,<br />
            &nbsp;&nbsp;project_id: 42,<br />
            &nbsp;&nbsp;name: "Summer Sale"<br />
            &#125;)
          </div>
        </div>
      </div>

      {/* flight lane — empty band below the boxes; the request rides it toward the API */}
      <div style={{ position: 'relative', height: '30px', marginTop: '0.6rem' }}>
        <div style={{ position: 'absolute', top: '50%', left: '9%', right: '9%', borderTop: '1px dashed #d9cffa' }} />
        <div className="req-chip" style={laneChip('left', step >= 1 && step <= 2, step > 2 || step < 1)}>POST /messages/</div>
        <div className="req-chip" style={laneChip('right', step >= 4, step < 4)}>POST /messages/</div>
      </div>
    </div>
  )
}
