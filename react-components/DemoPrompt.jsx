import { useState, useEffect } from 'react'
import { useInView } from './useInView.js'

const PROMPT = `Hi Claude, I'm doing a live showcase of an MCP server we built last cycle: RGE STUDIO. Sell it by using it, like a salesperson showing it off to a prospect. Open with a warm greeting and keep a polite, personable tone throughout. Narrate as you go.

Use it end to end to reveal its strengths, exercise every RGE Studio tool at least once, and finish with a quick recap of what each one proved.

When you create emails, keep the two starting points strictly separate. Build one email using only the brand styles, with no inspiration from any existing email. Build the other using only an existing email as inspiration, with no brand styles at all. Never mix the two sources. For the inspired one, keep the same colors and overall design idea, only change what the email is about.

Keep the discovery genuine, but when in doubt, default to the organization BEE Content Design, Inc., and the "RGE Studio - MCP" workspace.

Keep answers detailed but not too verbose. I'm screen-sharing, so favor tight, readable output.

One styling rule: no emojis, and absolutely no long dashes. I hate them.`

// Claude sunburst mark
const ClaudeMark = ({ size }) => (
  <svg viewBox="0 0 100 100" width={size} height={size} style={{ display: 'block', flexShrink: 0 }}>
    <path fill="#cc7c5e" d="m19.6 66.5 19.7-11 .3-1-.3-.5h-1l-3.3-.2-11.2-.3L14 53l-9.5-.5-2.4-.5L0 49l.2-1.5 2-1.3 2.9.2 6.3.5 9.5.6 6.9.4L38 49.1h1.6l.2-.7-.5-.4-.4-.4L29 41l-10.6-7-5.6-4.1-3-2-1.5-2-.6-4.2 2.7-3 3.7.3.9.2 3.7 2.9 8 6.1L37 36l1.5 1.2.6-.4.1-.3-.7-1.1L33 25l-6-10.4-2.7-4.3-.7-2.6c-.3-1-.4-2-.4-3l3-4.2L28 0l4.2.6L33.8 2l2.6 6 4.1 9.3L47 29.9l2 3.8 1 3.4.3 1h.7v-.5l.5-7.2 1-8.7 1-11.2.3-3.2 1.6-3.8 3-2L61 2.6l2 2.9-.3 1.8-1.1 7.7L59 27.1l-1.5 8.2h.9l1-1.1 4.1-5.4 6.9-8.6 3-3.5L77 13l2.3-1.8h4.3l3.1 4.7-1.4 4.9-4.4 5.6-3.7 4.7-5.3 7.1-3.2 5.7.3.4h.7l12-2.6 6.4-1.1 7.6-1.3 3.5 1.6.4 1.6-1.4 3.4-8.2 2-9.6 2-14.3 3.3-.2.1.2.3 6.4.6 2.8.2h6.8l12.6 1 3.3 2 1.9 2.7-.3 2-5.1 2.6-6.8-1.6-16-3.8-5.4-1.3h-.8v.4l4.6 4.5 8.3 7.5L89 80.1l.5 2.4-1.3 2-1.4-.2-9.2-7-3.6-3-8-6.8h-.5v.7l1.8 2.7 9.8 14.7.5 4.5-.7 1.4-2.6 1-2.7-.6-5.8-8-6-9-4.7-8.2-.5.4-2.9 30.2-1.3 1.5-3 1.2-2.5-2-1.4-3 1.4-6.2 1.6-8 1.3-6.4 1.2-7.9.7-2.6v-.2H49L43 72l-9 12.3-7.2 7.6-1.7.7-3-1.5.3-2.8L24 86l10-12.8 6-7.9 4-4.6-.1-.5h-.3L17.2 77.4l-4.7.6-2-2 .2-3 1-1 8-5.5Z" />
  </svg>
)

export default function DemoPrompt() {
  const open = () => window.open(`https://claude.ai/new?q=${encodeURIComponent(PROMPT)}`, '_blank', 'noopener')

  // typewriter — starts when the slide comes into view, resets when it leaves
  const [ref, inView] = useInView()
  const [n, setN] = useState(0)
  useEffect(() => { if (!inView) setN(0) }, [inView])
  useEffect(() => {
    if (!inView || n >= PROMPT.length) return
    const t = setTimeout(() => setN((v) => v + 1), 18)
    return () => clearTimeout(t)
  }, [n, inView])
  const shown = PROMPT.slice(0, n)
  const done = n >= PROMPT.length

  return (
    <div ref={ref} style={{ width: '620px', maxWidth: '88%', margin: '0 auto' }}>
      <style>{`
        .slidev-layout .dpc-txt { color: #eceae4 !important; }
        .slidev-layout .dpc-mut { color: #918d83 !important; }
        .slidev-layout .dpc-greet { color: #d7d2c8 !important; }
        .slidev-layout .dpc-send, .slidev-layout .dpc-send * { color: #26231f !important; }
        .dpc-cursor { animation: dpcBlink 1.05s steps(2, start) infinite; }
        @keyframes dpcBlink { 50% { opacity: 0; } }
        .dpc-composer { transition: box-shadow 0.2s; }
        .dpc-composer:hover { box-shadow: 0 0.5rem 1.6rem rgba(0,0,0,0.35); }
      `}</style>

      {/* org pill */}
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.1rem' }}>
        <span className="dpc-mut" style={{
          background: '#35342f', borderRadius: '8px', padding: '0.32rem 0.7rem',
          fontSize: '0.72rem', fontWeight: 500, lineHeight: 1,
        }}>Growens Group</span>
      </div>

      {/* greeting */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.55rem', marginBottom: '1.3rem' }}>
        <ClaudeMark size={22} />
        <span className="dpc-greet" style={{ fontFamily: 'Roboto Slab, serif', fontSize: '1.6rem', fontWeight: 300 }}>
          Afternoon, Francesco
        </span>
      </div>

      {/* composer */}
      <div className="dpc-composer" style={{
        cursor: 'text', background: '#2b2a28', borderRadius: '16px',
        border: '0.5px solid rgba(255,255,255,0.08)', boxShadow: '0 0.35rem 1.3rem rgba(0,0,0,0.28)',
        padding: '0.8rem 0.9rem 0.6rem', textAlign: 'left',
      }}>
        <div className="dpc-txt" style={{ fontSize: '0.72rem', lineHeight: 1.6, whiteSpace: 'pre-wrap', height: '23.5rem', overflowY: 'auto' }}>
          {shown}
          {!done && <span className="dpc-cursor dpc-txt" style={{ fontWeight: 300 }}>▍</span>}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '0.5rem' }}>
          <span className="dpc-mut" style={{ fontSize: '1.1rem', lineHeight: 1 }}>+</span>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.7rem' }}>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.28rem' }}>
              <span className="dpc-txt" style={{ fontSize: '0.7rem', fontWeight: 500 }}>Opus 4.8</span>
              <span className="dpc-mut" style={{ fontSize: '0.7rem' }}>High</span>
              <span className="dpc-mut" style={{ fontSize: '0.5rem', lineHeight: 1 }}>▾</span>
            </span>

            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#918d83" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="9" y="2" width="6" height="12" rx="3" />
              <path d="M5 10a7 7 0 0 0 14 0" />
              <line x1="12" y1="19" x2="12" y2="22" />
            </svg>

            <span onClick={open} title="Send message" className="dpc-send" style={{
              width: 26, height: 26, borderRadius: '8px', background: '#cc7c5e', cursor: 'pointer',
              display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.9rem', lineHeight: 1,
            }}>↑</span>
          </div>
        </div>
      </div>
    </div>
  )
}
