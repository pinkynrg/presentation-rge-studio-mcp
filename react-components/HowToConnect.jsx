import { useState, useEffect, useRef } from 'react'
import { PROVIDERS, LAST, cycleDelay } from './providers'

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

  // auto-only (no clicking): shared accelerating cycle, long hold on the last
  // one, then loop. Same timing as the title cycler (see providers.js).
  useEffect(() => {
    const t = setTimeout(() => setIdx((i) => (i >= LAST ? 0 : i + 1)), cycleDelay(idx))
    return () => clearTimeout(t)
  }, [idx])

  // keep the active tab scrolled into view (the strip whooshes along)
  useEffect(() => {
    const el = tabRefs.current[idx]
    if (el) el.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' })
  }, [idx])

  const p = PROVIDERS[idx]
  const items = p.steps
  const logo = p.logo

  return (
    <div style={{ marginTop: '0.6rem' }}>
      <style>{`
        .htc-p { color: #7747ff !important; }
        .htc-mut { color: #999 !important; }
        .htc-num { color: #fff !important; }
        .htc-strip::-webkit-scrollbar { display: none; }
      `}</style>

      {/* the easy pitch */}
      <div style={{ fontSize: '1.05rem', fontWeight: 800 }}>
        Nothing to install. No API key. <span className="htc-p">Just a URL:</span>{' '}
        <span style={{
          background: '#f1ebff', border: '1px solid #d9cffa', borderRadius: '8px',
          padding: '0.15rem 0.5rem', fontFamily: 'monospace', fontSize: '0.8rem',
          whiteSpace: 'nowrap',
        }} className="htc-p">{URL}</span>
      </div>

      <div style={{ margin: '0.5rem 0 0.9rem' }} />

      <div>
      {/* tabs — horizontally scrollable */}
      <div className="htc-strip" style={{
        display: 'flex', gap: '0.2rem', borderBottom: '1px solid #e8deff',
        overflowX: 'auto', scrollbarWidth: 'none',
      }}>
        {PROVIDERS.map((t, i) => {
          const on = i === idx
          return (
            <div key={t.key} ref={(el) => (tabRefs.current[i] = el)}
              style={{
                padding: '0.4rem 0.8rem', flex: '0 0 auto',
                fontSize: '0.72rem', fontWeight: 700, whiteSpace: 'nowrap',
                borderBottom: `3px solid ${on ? '#7747ff' : 'transparent'}`,
                marginBottom: '0',
                display: 'flex', alignItems: 'center', gap: '0.35rem',
                transition: 'all 0.2s',
              }}>
              {i !== LAST && <span style={{
                width: 7, height: 7, borderRadius: '50%', display: 'inline-block',
                background: i < 3 ? '#ff4444' : '#ccc',
              }} />}
              <span className={on ? 'htc-p' : 'htc-mut'}>{t.label}</span>
              {t.rec && <span style={{
                background: '#22bb33', borderRadius: '8px',
                padding: '0.02rem 0.35rem', fontSize: '0.5rem', fontWeight: 800,
              }} className="htc-num">recommended</span>}
            </div>
          )
        })}
      </div>

      {/* selected tool panel — numbered steps + provider logo on the right */}
      <div style={{
        background: 'rgba(255,255,255,0.75)', border: '1px solid #e8deff',
        borderRadius: '10px', padding: '0.9rem 1.1rem', height: '280px', boxSizing: 'border-box', marginTop: '0.7rem',
        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '3rem', overflow: 'hidden',
      }}>
        <div style={{ flex: '0 0 300px' }}>
          {items.map((it, i) => (
            <div key={i} style={{ display: 'flex', gap: '0.6rem', alignItems: it.cmd ? 'center' : 'baseline', margin: '0.4rem 0' }}>
              <span style={{
                flex: '0 0 auto', width: '1.2rem', height: '1.2rem', borderRadius: '50%',
                background: '#7747ff', display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '0.62rem', fontWeight: 800,
              }} className="htc-num">{i + 1}</span>
              {it.cmd
                ? <Cmd>{it.cmd}</Cmd>
                : <span style={{ fontSize: '0.85rem', lineHeight: 1.4 }}>{it}</span>}
            </div>
          ))}
        </div>
        <div style={{ flex: '0 0 auto', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {logo
            ? <img src={logo} style={{ height: '240px', width: 'auto', maxWidth: '240px', objectFit: 'contain' }} />
            : <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: '14px' }}>
                {GRID_LOGOS.map((l, i) => (
                  <img key={i} src={l} style={{ width: '46px', height: '46px', objectFit: 'contain' }} />
                ))}
              </div>}
        </div>
      </div>

      {/* legend */}
      <div style={{ display: 'flex', gap: '1.5rem', fontSize: '0.64rem', marginTop: '0.7rem', alignItems: 'center', flexWrap: 'wrap' }}>
        <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
          <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#ff4444', display: 'inline-block' }} />
          tested client
        </span>
        <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
          <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#ccc', display: 'inline-block' }} />
          not tested yet, usable if the client supports MCP connectors
        </span>
      </div>

      {/* detailed docs */}
      <div style={{ fontSize: '0.72rem', marginTop: '0.6rem', wordBreak: 'break-all' }}>
        <span style={{ fontWeight: 700 }}>More details:</span> <a href={DOCS} target="_blank" className="htc-p">{DOCS}</a>
      </div>
      </div>
    </div>
  )
}
