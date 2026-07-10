import { useState, useEffect, useRef } from 'react'
import { PROVIDERS, LAST, cycleDelay } from './providers'
import { useInView } from './useInView.js'

const URL = 'https://mcp.reallygoodemails.com/mcp'
const DOCS = 'https://growens.atlassian.net/wiki/spaces/BEEPro/pages/7104102464/RGE+Studio+-+MCP+Server+beta#How-to-connect'

const GRID_LOGOS = PROVIDERS.filter((p) => p.logo).map((p) => p.logo)

const Cmd = ({ children }) => (
  <div style={{
    flex: 1, minWidth: 0,
    background: '#f4f2fb', border: '1px solid #e0d8f5', borderRadius: '6px',
    padding: '0.3rem 0.5rem', fontFamily: 'monospace', fontSize: '0.58rem',
    overflowX: 'auto', whiteSpace: 'nowrap',
  }}>{children}</div>
)

export default function HowToConnect() {
  const [idx, setIdx] = useState(0)
  const tabRefs = useRef([])
  const stripRef = useRef(null)
  const [ref, inView] = useInView()

  // auto-only (no clicking): shared accelerating cycle, long hold on the last
  // one, then loop. Starts when the slide comes into view, resets on leave.
  useEffect(() => { if (!inView) setIdx(0) }, [inView])
  useEffect(() => {
    if (!inView) return
    const t = setTimeout(() => setIdx((i) => (i >= LAST ? 0 : i + 1)), cycleDelay(idx))
    return () => clearTimeout(t)
  }, [idx, inView])

  // slide the strip so the active tab is centered — scroll ONLY the strip
  // (not the page), clamped so first stays flush-left and last flush-right.
  useEffect(() => {
    const strip = stripRef.current
    const el = tabRefs.current[idx]
    if (!strip || !el) return
    const target = el.offsetLeft - (strip.clientWidth - el.offsetWidth) / 2
    const max = strip.scrollWidth - strip.clientWidth
    // instant: the cycle races (30ms on late tabs), smooth would desync the
    // strip from the highlighted tab.
    strip.scrollTo({ left: Math.max(0, Math.min(target, max)), behavior: 'auto' })
  }, [idx])

  const p = PROVIDERS[idx]
  const items = p.steps
  const logo = p.logo

  return (
    <div ref={ref} style={{ marginTop: '2rem' }}>
      <style>{`
        .slidev-layout .htc-p { color: #7747ff !important; }
        .slidev-layout .htc-mut { color: #c2c2c2 !important; }
        .slidev-layout .htc-num { color: #fff !important; }
        .htc-strip::-webkit-scrollbar { display: none; }
      `}</style>

      <div>
      {/* tabs — horizontally scrollable */}
      <div className="htc-strip" ref={stripRef} style={{
        display: 'flex', gap: '0.25rem', alignItems: 'flex-end',
        overflowX: 'auto', scrollbarWidth: 'none',
      }}>
        {PROVIDERS.map((t, i) => {
          const on = i === idx
          return (
            <div key={t.key} ref={(el) => (tabRefs.current[i] = el)}
              style={{
                padding: '0.4rem 0.85rem', flex: '0 0 auto',
                fontSize: '0.72rem', fontWeight: 700, whiteSpace: 'nowrap',
                display: 'flex', alignItems: 'center', gap: '0.35rem',
                borderRadius: '9px 9px 0 0',
                border: '1px solid',
                borderColor: on ? '#e8deff' : '#efe9fb',
                borderBottomColor: on ? 'transparent' : '#efe9fb',
                background: on ? 'linear-gradient(135deg, #f8f6ff 0%, #ffffff 100%)' : 'transparent',
                opacity: on ? 1 : 0.55,
                transition: 'all 0.15s',
              }}>
              {i !== LAST && <span style={{
                width: 7, height: 7, borderRadius: '50%', display: 'inline-block',
                background: i < 3 ? '#22bb33' : '#ccc',
              }} />}
              <span className={on ? 'htc-p' : 'htc-mut'}>{t.label}</span>
              {t.rec && <span style={{
                background: '#e0a500', borderRadius: '8px',
                padding: '0.02rem 0.35rem', fontSize: '0.5rem', fontWeight: 800,
              }} className="htc-num">recommended</span>}
            </div>
          )
        })}
      </div>

      {/* selected tool panel — numbered steps + provider logo on the right */}
      <div style={{
        background: 'linear-gradient(135deg, #f8f6ff 0%, #ffffff 100%)', border: '1px solid #e8deff', borderTop: 'none',
        borderRadius: '0 0 14px 14px', boxShadow: '0 6px 20px rgba(119,71,255,0.10)',
        padding: '1rem 1.4rem', height: '250px', boxSizing: 'border-box', marginTop: '0',
        display: 'flex', alignItems: 'center', gap: '1.4rem', overflow: 'hidden',
      }}>
        <div style={{ flex: '1 1 0', display: 'flex', justifyContent: 'center' }}>
          <div style={{ textAlign: 'left' }}>
            {items.map((it, i) => (
              <div key={i} style={{ display: 'flex', gap: '0.7rem', alignItems: it.cmd ? 'center' : 'baseline', margin: '0.55rem 0' }}>
                <span style={{
                  flex: '0 0 auto', width: '1.4rem', height: '1.4rem', borderRadius: '50%',
                  background: '#7747ff', display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '0.66rem', fontWeight: 800, boxShadow: '0 2px 6px rgba(119,71,255,0.35)',
                }} className="htc-num">{i + 1}</span>
                {it.cmd
                  ? <Cmd>{it.cmd}</Cmd>
                  : <span style={{ fontSize: '0.88rem', lineHeight: 1.4 }}>{it}</span>}
              </div>
            ))}
          </div>
        </div>
        <div style={{ flex: '0 0 auto', alignSelf: 'stretch', width: '1px', background: '#e8deff', margin: '0.5rem 0' }} />
        <div style={{ flex: '1 1 0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {logo
            ? <img src={logo} style={{ height: '156px', width: 'auto', maxWidth: '156px', objectFit: 'contain', opacity: 0.65 }} />
            : <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px', width: '150px' }}>
                {GRID_LOGOS.map((l, i) => (
                  <img key={i} src={l} style={{ width: '100%', height: '28px', objectFit: 'contain' }} />
                ))}
              </div>}
        </div>
      </div>

      {/* legend — right column */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.35rem', fontSize: '0.64rem', marginTop: '0.7rem' }}>
        <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
          <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#22bb33', display: 'inline-block' }} />
          tested client
        </span>
        <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
          <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#ccc', display: 'inline-block' }} />
          not tested yet, usable if the client supports MCP connectors
        </span>
      </div>
      </div>
    </div>
  )
}
