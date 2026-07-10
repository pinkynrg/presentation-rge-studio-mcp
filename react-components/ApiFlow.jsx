import { useState, useEffect, useRef } from 'react'
import loginImg from '../assets/app-login.png'
import spinnerImg from '../assets/app-spinner.png'
import contentImg from '../assets/app-content.png'
import rgeIcon from '../assets/rge-icon.svg'
import claudeHome from '../assets/claude-home.png'

const IMGS = { login: loginImg, spinner: spinnerImg, folders: contentImg }

const FOLDERS = ['Newsletters', 'Promotions', 'Welcome flow']

const apiPulseKf = `
@keyframes apiPulse {
  0%, 100% { box-shadow: 0 0 0 0 rgba(119, 71, 255, 0); }
  50% { box-shadow: 0 0 16px 7px rgba(119, 71, 255, 0.35); }
}
`

// Frontend timeline — the login → load-folders story. Used in both slides.
// chip: hide | out (to backend) | at (arrived, backend flashes) | back (to caller)
const F = [
  { img: 'login',   chip: 'hide', pill: '',                     hit: false },
  { img: 'login',   chip: 'hide', pill: 'types email + password', hit: false },
  { img: 'login',   chip: 'out',  pill: '',                     hit: false },
  { img: 'login',   chip: 'at',   pill: '',                     hit: true  },
  { img: 'login',   chip: 'back', pill: '',                     hit: false },
  { img: 'spinner', chip: 'hide', pill: 'loading workspace…',   hit: false },
  { img: 'spinner', chip: 'out',  pill: '',                     hit: false },
  { img: 'spinner', chip: 'at',   pill: '',                     hit: true  },
  { img: 'spinner', chip: 'back', pill: '',                     hit: false },
  { img: 'folders', chip: 'hide', pill: '',                     hit: false },
  { img: 'folders', chip: 'hide', pill: '',                     hit: false },
]

// Twin timeline — folders listing only, both callers in parallel.
// Human app hits the backend directly; the AI (Claude) goes through the RGE
// Studio MCP, which rewrites the tool call into the REST call. The chip changes
// content as it crosses the MCP box.
// One beat grid. Human hops the wide lane in 2 beats; the AI does its two MCP
// hops one-per-beat — so both chips depart together and return home together
// (same round-trip time), even though the AI's path is longer.
// fchip: human lane · aA: Claude↔MCP lane · aB: MCP↔backend lane
const TWIN = [
  { fimg: 'spinner', fchip: 'hide', fhit: false, aA: 'hide', aB: 'hide', mcpHit: false, abHit: false },
  { fimg: 'spinner', fchip: 'out',  fhit: false, aA: 'out',  aB: 'hide', mcpHit: false, abHit: false }, // depart
  { fimg: 'spinner', fchip: 'out',  fhit: false, aA: 'hide', aB: 'out',  mcpHit: true,  abHit: false }, // AI crosses MCP; human still flying
  { fimg: 'spinner', fchip: 'at',   fhit: true,  aA: 'hide', aB: 'at',   mcpHit: false, abHit: true  }, // both at backend
  { fimg: 'spinner', fchip: 'back', fhit: false, aA: 'armed', aB: 'back', mcpHit: false, abHit: false }, // depart home (LaneA staged at MCP)
  { fimg: 'spinner', fchip: 'back', fhit: false, aA: 'back', aB: 'hide', mcpHit: true,  abHit: false }, // AI crosses MCP; human still flying
  { fimg: 'folders', fchip: 'hide', fhit: false, aA: 'hide', aB: 'hide', mcpHit: false, abHit: false }, // both home
]

function Lane({ chip, outCard, backCard, dur = '1.4s' }) {
  // 'armed' = staged invisibly at the backend end, so the next 'back' actually
  // travels backend→caller instead of popping in at the caller.
  const atBackend = chip === 'out' || chip === 'at' || chip === 'armed'
  // out/at = request going; back = response coming home.
  const live = atBackend ? outCard : backCard
  // Freeze the last shown card during `hide` so the fade-out never flips to the
  // next turn's content (fLogin has already changed by the hide step).
  const lastRef = useRef(backCard)
  if (chip !== 'hide') lastRef.current = live
  const card = chip === 'hide' ? lastRef.current : live
  return (
    <div style={{ position: 'relative' }}>
      <div style={{ position: 'absolute', top: '50%', left: 0, right: 0, borderTop: '2px dashed #d9cffa' }} />
      <div className="req-chip" style={{
        position: 'absolute', top: '50%',
        left: atBackend ? 'calc(100% - 4px)' : '4px',
        transform: atBackend ? 'translate(-100%, -50%)' : 'translate(0, -50%)',
        width: 126, textAlign: 'left', background: '#1a1a1a', borderRadius: '10px', padding: '0.4rem 0.5rem',
        boxShadow: '0 4px 14px rgba(0,0,0,0.32)',
        opacity: chip === 'hide' || chip === 'armed' ? 0 : 1,
        transition: `left ${dur} ease-in-out, transform ${dur} ease-in-out, opacity 0.4s`,
        zIndex: 5,
      }}>
        <div className="chip-title" style={{ fontSize: '0.68rem', fontWeight: 700, lineHeight: 1.25 }}>{card.title}</div>
        {card.sub && <div className="chip-sub" style={{ fontSize: '0.56rem', marginTop: '0.15rem' }}>{card.sub}</div>}
        {card.items && (
          <div style={{ marginTop: '0.3rem', display: 'flex', flexDirection: 'column', gap: '0.13rem' }}>
            {card.items.map((it) => (
              <div key={it} className="chip-item" style={{ fontSize: '0.56rem', display: 'flex', gap: '0.3rem', alignItems: 'center' }}>
                <span style={{ opacity: 0.75 }}>📁</span>{it}
              </div>
            ))}
          </div>
        )}
        <div className="chip-tech" style={{ fontFamily: 'monospace', fontSize: '0.54rem', marginTop: '0.35rem', paddingTop: '0.3rem', borderTop: '1px solid rgba(255,255,255,0.16)' }}>{card.tech}</div>
      </div>
    </div>
  )
}


function Backend({ active, hit, ok, square, title = 'Backend' }) {
  return (
    <div style={{
      border: '2px solid #ddd', borderRadius: '12px', padding: '0.4rem',
      background: 'white', textAlign: 'center', display: 'flex', flexDirection: 'column',
      justifyContent: 'center', alignItems: 'center',
      width: square ? '100%' : undefined, aspectRatio: square ? '1 / 1' : undefined,
      opacity: active ? 1 : 0.5, transition: 'opacity 0.4s',
      animation: hit ? 'apiPulse 1.4s ease-in-out' : 'none',
    }}>
      <img src={rgeIcon} style={{ height: square ? 26 : 32, display: 'block' }} />
      <div className="af2-be" style={{ fontWeight: 600, fontSize: square ? '0.5rem' : '0.55rem', marginTop: '0.28rem', opacity: 0.6, textTransform: 'uppercase', letterSpacing: '0.04em' }}>RGE Studio</div>
      <div className="af2-be" style={{ fontWeight: 800, fontSize: square ? '0.92rem' : '1rem', lineHeight: 1.1 }}>{title}</div>
      {ok !== undefined && (
        <div className="af2-ok" style={{ fontWeight: 800, fontSize: '0.6rem', marginTop: '0.3rem', minHeight: '0.85rem', opacity: hit ? 1 : 0, transition: 'opacity 0.3s' }}>
          {ok}
        </div>
      )}
    </div>
  )
}

function Frontend({ img, active, twoRow }) {
  const outer = { display: 'flex', flexDirection: 'column', opacity: active ? 1 : 0.5, transition: 'opacity 0.4s' }
  const macWrap = twoRow
    ? { width: '100%', aspectRatio: '1 / 1', display: 'flex', flexDirection: 'column', borderRadius: '10px', overflow: 'hidden', border: '1px solid #ddd', boxShadow: '0 6px 18px rgba(0,0,0,0.14)', background: '#fff' }
    : { display: 'flex', flexDirection: 'column', borderRadius: '10px', overflow: 'hidden', border: '1px solid #ddd', boxShadow: '0 8px 24px rgba(0,0,0,0.16)', background: '#fff' }
  return (
    <div style={outer}>
      <div style={macWrap}>
        <div style={{ background: '#f0f0f0', padding: '0.2rem 0.4rem', display: 'flex', gap: '0.22rem', alignItems: 'center' }}>
          {['#ff5f57', '#febc2e', '#28c840'].map((c) => (
            <span key={c} style={{ width: 7, height: 7, borderRadius: '50%', background: c, display: 'inline-block' }} />
          ))}
          <span className="af2-mut" style={{ marginLeft: '0.4rem', fontSize: '0.55rem', fontFamily: 'monospace' }}>reallygoodemails.com/app</span>
        </div>
        <img src={IMGS[img]} style={twoRow
          ? { width: '100%', flex: 1, minHeight: 0, objectFit: 'cover', objectPosition: 'top', display: 'block' }
          : { width: '100%', aspectRatio: '2236 / 1920', objectFit: 'cover', objectPosition: 'center', display: 'block' }} />
      </div>
    </div>
  )
}

function Agent({ active }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', opacity: active ? 1 : 0.5, transition: 'opacity 0.4s' }}>
      <div style={{ width: '100%', aspectRatio: '1 / 1', display: 'flex', flexDirection: 'column', borderRadius: '10px', overflow: 'hidden', border: '1px solid #ddd', boxShadow: '0 6px 18px rgba(0,0,0,0.14)', background: '#1f1f1f' }}>
        <div style={{ background: '#f0f0f0', padding: '0.2rem 0.4rem', display: 'flex', gap: '0.22rem', alignItems: 'center' }}>
          {['#ff5f57', '#febc2e', '#28c840'].map((c) => (
            <span key={c} style={{ width: 7, height: 7, borderRadius: '50%', background: c, display: 'inline-block' }} />
          ))}
          <span className="af2-mut" style={{ marginLeft: '0.4rem', fontSize: '0.55rem', fontFamily: 'monospace' }}>claude.ai</span>
        </div>
        <img src={claudeHome} style={{ width: '100%', flex: 1, minHeight: 0, objectFit: 'cover', objectPosition: 'top', display: 'block' }} />
      </div>
    </div>
  )
}

const STYLE_TAG = (
  <>
    <style>{apiPulseKf}</style>
    <style>{`
      .slidev-layout div.req-chip .chip-title { color: #ffffff !important; }
      .slidev-layout div.req-chip .chip-sub { color: #c9b8ff !important; }
      .slidev-layout div.req-chip .chip-item { color: #e8e2ff !important; }
      .slidev-layout div.req-chip .chip-tech { color: #7CFC98 !important; }
      .af2-be { color: #7747ff !important; }
      .af2-ok { color: #22bb33 !important; }
      .af2-title { color: #1a1a1a !important; }
      .af2-mut { color: #8a8a8a !important; }
    `}</style>
  </>
)

const GRID_COLS = '1fr 175px 1fr'

// human app / MCP→backend leg: the REST call
const REST_OUT = { title: 'Can I see my folders?', tech: 'GET /folders' }
const REST_BACK = { title: 'Here you go 👇', items: FOLDERS, tech: '200 · 3 items' }
// Claude↔MCP leg: the AI's tool call, and the friendly answer back
const TOOL_OUT = { title: 'Get my folders', tech: 'list_projects(…)' }
const TOOL_BACK = { title: 'Here you go 👇', items: FOLDERS, tech: 'done' }

function frontCards(login) {
  return {
    ok: login ? '✓ logged in' : '✓ your folders',
    out: login
      ? { title: 'Hi! Can I log in?', sub: 'user: fra · pass: •••••', tech: 'POST /auth/login' }
      : { title: 'Can I see my folders?', tech: 'GET /folders' },
    back: login
      ? { title: 'Sure, you’re in!', tech: '200 OK' }
      : { title: 'Here you go 👇', items: FOLDERS, tech: '200 · 3 items' },
  }
}

export default function ApiFlow({ withAgent = false }) {
  const twoRow = withAgent
  const SEQ = twoRow ? TWIN : F
  const [i, setI] = useState(0)
  useEffect(() => {
    const t = setInterval(() => setI((v) => (v + 1) % SEQ.length), twoRow ? 4400 : 2200)
    return () => clearInterval(t)
  }, [SEQ.length, twoRow])

  // ── Single slide: one row, frontend ↔ backend ──
  if (!twoRow) {
    const st = F[i]
    const c = frontCards(i <= 4)
    return (
      <div style={{ marginTop: '2.6rem' }}>
        {STYLE_TAG}
        <div style={{ display: 'grid', gridTemplateColumns: GRID_COLS, gap: '0', alignItems: 'stretch', height: 'auto' }}>
          <Frontend img={st.img} active twoRow={false} />
          <Lane chip={st.chip} outCard={c.out} backCard={c.back} />
          <Backend active hit={st.hit} ok={c.ok} />
        </div>
      </div>
    )
  }

  // ── Twin slide: folders listing only, both callers in parallel ──
  // Row 1: human app → backend directly. Row 2: Claude → RGE Studio MCP →
  // backend; the chip changes content as it crosses the MCP box.
  const st = TWIN[i]
  const SQ = 178
  return (
    <div style={{ marginTop: '0.6rem' }}>
      {STYLE_TAG}

      {/* Row 1 — human app → backend (one hop, 2 beats) */}
      <div style={{ display: 'grid', gridTemplateColumns: `${SQ}px 1fr ${SQ}px`, gap: '0', alignItems: 'center' }}>
        <Frontend img={st.fimg} active twoRow />
        <Lane chip={st.fchip} outCard={REST_OUT} backCard={REST_BACK} dur="7.6s" />
        <Backend active hit={st.fhit} ok="✓ your folders" square />
      </div>

      {/* Row 2 — Claude → RGE Studio MCP → backend (two hops, 1 beat each) */}
      <div style={{ display: 'grid', gridTemplateColumns: `${SQ}px 1fr ${SQ}px 1fr ${SQ}px`, gap: '0', alignItems: 'center', marginTop: '1.1rem' }}>
        <Agent active />
        <Lane chip={st.aA} outCard={TOOL_OUT} backCard={TOOL_BACK} dur="3.6s" />
        <Backend active hit={st.mcpHit} square title="MCP" />
        <Lane chip={st.aB} outCard={REST_OUT} backCard={REST_BACK} dur="3.6s" />
        <Backend active hit={st.abHit} ok="✓ your folders" square title="Backend" />
      </div>
    </div>
  )
}
