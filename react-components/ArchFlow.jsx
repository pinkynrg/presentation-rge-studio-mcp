import { useState, useRef } from 'react'
import rgeIcon from '../assets/rge-icon.svg'
import beefreeIcon from '../assets/sdk-icon.svg'
import claudeLogo from '../assets/logos/claude.svg'

// Node centers + half-extents (percent of the diagram box on the right).
// 4 horizontal layers, top to bottom:
//   1) AI assistant   2) RGE Studio MCP   3) backend + content   4) renderer + SDK MCP
const N = {
  assistant: { cx: 50, cy: 11, hw: 12, hh: 8 },
  mcp: { cx: 50, cy: 36, hw: 12, hh: 8 },
  backend: { cx: 27, cy: 63, hw: 12, hh: 8 },
  content: { cx: 68, cy: 63, hw: 12, hh: 8 },
  renderer: { cx: 48, cy: 89, hw: 12, hh: 8 },
  sdk: { cx: 88, cy: 89, hw: 12, hh: 8 },
}

// Where each tool's request actually goes.
//   mcp      = served by the MCP itself (get_instructions)
//   backend  = REST to our own backend (most tools)
//   sdk      = content service API → SDK MCP (codemode + get_inspired)
//   renderer = content service API → renderer (previews + screenshots)
const GROUPS = [
  { name: 'Rules', bg: '#f3efff', bd: '#e0d5f7', tools: [
    { raw: 'get_instructions', tgt: 'mcp', label: 'Read the rules' },
  ] },
  { name: 'Find your stuff', bg: '#eef4ff', bd: '#d3e2fb', tools: [
    { raw: 'list_customers', tgt: 'backend', label: 'Organizations' },
    { raw: 'list_brands', tgt: 'backend', label: 'Workspaces' },
    { raw: 'list_projects', tgt: 'backend', label: 'Folders' },
    { raw: 'list_root_project_emails', tgt: 'backend', label: 'Top-level emails' },
    { raw: 'list_project_emails', tgt: 'backend', label: 'Folder emails' },
    { raw: 'get_email', tgt: 'backend', label: 'One email' },
    { raw: 'get_brand_styles', tgt: 'backend', label: 'Brand styles' },
  ] },
  { name: 'Drafting', bg: '#eefaf1', bd: '#cdeed6', tools: [
    { raw: 'open_email_editor', id: 'open_blank', tgt: 'content_sdk', label: 'Blank draft' },
    { raw: 'open_email_editor', id: 'open_existing', tgt: 'backend_content_sdk', label: 'Draft from an email' },
    { raw: 'get_inspired', tgt: 'backend_content_sdk', label: 'Reuse a design' },
    { raw: 'edit_email', tgt: 'content_sdk', label: 'Edit with code' },
  ] },
  { name: 'Check', bg: '#fff6e8', bd: '#f2e2bf', tools: [
    { raw: 'preview_email', tgt: 'content_renderer', label: 'Preview' },
    { raw: 'preview_saved_email', tgt: 'backend_content_renderer', label: 'Preview saved' },
    { raw: 'screenshot_email', tgt: 'content_renderer', label: 'Self-check shot' },
  ] },
  { name: 'Save', bg: '#fdeef4', bd: '#f6d3e2', tools: [
    { raw: 'create_email', tgt: 'content_renderer_backend', label: 'Save new' },
    { raw: 'update_saved_email', tgt: 'content_renderer_backend', label: 'Update saved' },
    { raw: 'update_email_metadata', tgt: 'backend', label: 'Edit metadata' },
    { raw: 'export_email_html', tgt: 'backend', label: 'Export HTML' },
  ] },
]

// The MCP server orchestrates: it calls the backend and the content service
// itself (in sequence), and the SDK MCP + renderer sit behind the content
// service. So multi-hop tools bounce back through the MCP between calls.
// out to the target(s), then the response travels back to the assistant
// The content service is a gateway, never a dead end: calls that pass through
// it land on the SDK MCP (editor / codemode / inspiration) or the renderer
// (html + screenshots). Saves then continue to the backend.
const ROUTES = {
  mcp: ['assistant', 'mcp', 'assistant'],
  backend: ['assistant', 'mcp', 'backend', 'mcp', 'assistant'],
  content_sdk: ['assistant', 'mcp', 'content', 'sdk', 'content', 'mcp', 'assistant'],
  content_renderer: ['assistant', 'mcp', 'content', 'renderer', 'content', 'mcp', 'assistant'],
  backend_content_sdk: ['assistant', 'mcp', 'backend', 'mcp', 'content', 'sdk', 'content', 'mcp', 'assistant'],
  backend_content_renderer: ['assistant', 'mcp', 'backend', 'mcp', 'content', 'renderer', 'content', 'mcp', 'assistant'],
  content_renderer_backend: ['assistant', 'mcp', 'content', 'renderer', 'content', 'mcp', 'backend', 'mcp', 'assistant'],
}

// trim the center→center segment to each box's border
function edge(a, b) {
  const dx = b.cx - a.cx, dy = b.cy - a.cy
  const adx = Math.abs(dx) || 1e-6, ady = Math.abs(dy) || 1e-6
  const GAP = 0.02 // small detach from each box border
  const tA = Math.min(a.hw / adx, a.hh / ady) + GAP
  const tB = Math.min(b.hw / adx, b.hh / ady) + GAP
  return { x1: a.cx + dx * tA, y1: a.cy + dy * tA, x2: b.cx - dx * tB, y2: b.cy - dy * tB }
}

export default function ArchFlow() {
  const [tool, setTool] = useState(null)   // active raw tool name
  const [target, setTarget] = useState(null) // 'mcp' | 'backend' | 'sdk'
  const [wp, setWp] = useState(0)           // waypoint the dot is travelling TO
  const [arrivedWp, setArrivedWp] = useState(0) // last waypoint index reached
  const timers = useRef([])

  const TRAVEL = 280, DWELL = 160

  const fire = (it) => {
    timers.current.forEach(clearTimeout)
    timers.current = []
    setTool(it.id || it.raw)
    setTarget(it.tgt)
    setWp(0)
    setArrivedWp(0)
    const path = ROUTES[it.tgt]
    let t = 0
    for (let i = 1; i < path.length; i++) {
      t += DWELL
      timers.current.push(setTimeout(() => setWp(i), t))          // start moving
      t += TRAVEL
      timers.current.push(setTimeout(() => setArrivedWp(i), t))   // arrive
    }
    // final dwell, then vanish + reset to neutral
    t += DWELL
    timers.current.push(setTimeout(() => { setTool(null); setTarget(null); setWp(0); setArrivedWp(0) }, t))
  }

  const route = target ? ROUTES[target] : null
  const dotNode = route ? route[wp] : null

  // An arrow lights the moment the dot STARTS crossing it outbound, and only
  // turns off once the dot has FINISHED crossing it on the way back.
  const crossed = (k1, k2) => {
    if (!route) return false
    const idxs = []
    for (let i = 1; i < route.length; i++) {
      const p = route[i - 1], q = route[i]
      if ((p === k1 && q === k2) || (p === k2 && q === k1)) idxs.push(i)
    }
    if (!idxs.length) return false
    const first = idxs[0], last = idxs[idxs.length - 1]
    return wp >= first && arrivedWp < last
  }

  // A box lights when the dot ARRIVES at it, and turns off once the dot has
  // moved back past it (same in/out principle as the arrows).
  const nodeLit = (key) => {
    if (!route) return false
    const idxs = []
    route.forEach((n, i) => { if (n === key) idxs.push(i) })
    if (!idxs.length) return false
    return arrivedWp >= idxs[0] && arrivedWp <= idxs[idxs.length - 1]
  }

  const box = (nodeKey, lit, children) => {
    const n = N[nodeKey]
    return (
      <div style={{
        position: 'absolute', left: `${n.cx}%`, top: `${n.cy}%`,
        width: `${n.hw * 2}%`, height: `${n.hh * 2}%`, boxSizing: 'border-box',
        transform: `translate(-50%, -50%) scale(${lit ? 1.04 : 1})`,
        border: `2px solid ${lit ? '#7747ff' : '#d9cffa'}`, borderRadius: '12px',
        background: '#fff', padding: '0.3rem', textAlign: 'center',
        display: 'flex', flexDirection: 'column', justifyContent: 'center',
        boxShadow: lit ? '0 4px 14px rgba(119,71,255,0.28)' : '0 1px 4px rgba(0,0,0,0.06)',
        transition: 'all 0.35s', zIndex: 2,
      }}>{children}</div>
    )
  }
  const title = (t) => <div style={{ fontWeight: 800, fontSize: '0.6rem', color: '#7747ff', lineHeight: 1.1 }}>{t}</div>
  const sub = (t) => <div style={{ fontSize: '0.46rem', color: '#666', lineHeight: 1.1, marginTop: '0.1rem' }}>{t}</div>

  const chip = (t, g) => {
    const on = tool === (t.id || t.raw)
    return (
      <div key={t.id || t.raw} className={on ? 'af-tool af-on' : 'af-tool'} onClick={() => fire(t)} style={{
        boxSizing: 'border-box', padding: '0.2rem 0.35rem', borderRadius: '6px', lineHeight: 1.15,
        border: `1px solid ${on ? '#7747ff' : g.bd}`,
        background: on ? '#7747ff' : g.bg,
        boxShadow: on ? '0 2px 6px rgba(119,71,255,0.3)' : 'none',
      }}>
        <div className="af-label" style={{ fontSize: '0.46rem', fontWeight: 700 }}>{t.label}</div>
        <div className="af-raw" style={{ fontSize: '0.36rem', fontFamily: 'monospace', wordBreak: 'break-all' }}>{t.raw}</div>
      </div>
    )
  }

  const arrow = (a, b, active) => {
    const e = edge(a, b)
    return (
      <line x1={`${e.x1}%`} y1={`${e.y1}%`} x2={`${e.x2}%`} y2={`${e.y2}%`}
        stroke={active ? '#7747ff' : '#e2d9f6'} strokeWidth={active ? 2.5 : 2}
        strokeLinecap="round"
        markerStart={active ? 'url(#arrOn)' : 'url(#arrOff)'}
        markerEnd={active ? 'url(#arrOn)' : 'url(#arrOff)'} />
    )
  }

  const dc = dotNode ? N[dotNode] : null

  return (
    <div style={{ display: 'flex', gap: '1.4rem', marginTop: '0.6rem', height: '410px' }}>
      <style>{`
        .af-tool { cursor: pointer; transition: all 0.12s; }
        .af-tool:hover { background: #efeaff !important; border-color: #b9a6ee !important; }
        .slidev-layout .af-label { color: #1a1a1a !important; }
        .slidev-layout .af-raw { color: #7a6aa6 !important; }
        .slidev-layout .af-on .af-label, .slidev-layout .af-on .af-raw { color: #fff !important; }
        .slidev-layout .af-h { color: #1a1a1a !important; }
        .slidev-layout .af-hint { color: #8a8a8a !important; }
      `}</style>

      {/* left: the tool calls, in their own titled container */}
      <div style={{ flex: '0 0 52%', marginTop: '1rem' }}>
        <div style={{
          border: '1px solid #e8deff', borderRadius: '14px', background: 'rgba(255,255,255,0.55)',
          padding: '0.7rem 0.8rem', display: 'flex', flexDirection: 'column', gap: '0.55rem',
        }}>
          <div>
            <div className="af-h" style={{ fontSize: '0.9rem', fontWeight: 800 }}>The tool calls</div>
            <div className="af-hint" style={{ fontSize: '0.6rem', marginTop: '0.1rem' }}>Click one to watch where its request goes.</div>
          </div>
          {chip(GROUPS[0].tools[0], GROUPS[0])}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.35rem', alignItems: 'start' }}>
            {GROUPS.slice(1).map((g) => (
              <div key={g.name}>
                <div style={{ fontSize: '0.44rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.02em', marginBottom: '0.3rem' }}>{g.name}</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
                  {g.tools.map((t) => chip(t, g))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* right: the diagram */}
      <div style={{ flex: 1, position: 'relative', transform: 'translate(-1.5rem, -4.2rem)' }}>
        <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 0 }}>
          <defs>
            <marker id="arrOn" markerWidth="12" markerHeight="12" refX="9" refY="5" orient="auto-start-reverse" markerUnits="userSpaceOnUse">
              <path d="M1,1 L10,5 L1,9 Z" fill="#7747ff" />
            </marker>
            <marker id="arrOff" markerWidth="12" markerHeight="12" refX="9" refY="5" orient="auto-start-reverse" markerUnits="userSpaceOnUse">
              <path d="M1,1 L10,5 L1,9 Z" fill="#e2d9f6" />
            </marker>
          </defs>
          {arrow(N.assistant, N.mcp, crossed('assistant', 'mcp'))}
          {arrow(N.mcp, N.backend, crossed('mcp', 'backend'))}
          {arrow(N.mcp, N.content, crossed('mcp', 'content'))}
          {arrow(N.content, N.sdk, crossed('content', 'sdk'))}
          {arrow(N.content, N.renderer, crossed('content', 'renderer'))}
        </svg>

        {/* travelling request */}
        {dc && (
          <div style={{
            position: 'absolute', left: `${dc.cx}%`, top: `${dc.cy}%`,
            width: 15, height: 15, borderRadius: '50%', background: '#7747ff',
            boxShadow: '0 0 10px 3px rgba(119,71,255,0.5)',
            transform: 'translate(-50%, -50%)',
            transition: 'left 0.28s ease-in-out, top 0.28s ease-in-out',
            zIndex: 1,
          }} />
        )}

        {box('assistant', nodeLit('assistant'), <>
          <img src={claudeLogo} style={{ height: 16, width: 16, display: 'block', margin: '0 auto 0.15rem' }} />
          {title('AI assistant')}
          {sub('any MCP client')}
        </>)}

        {box('mcp', nodeLit('mcp'), <>
          <img src={rgeIcon} style={{ height: 16, width: 16, display: 'block', margin: '0 auto 0.15rem' }} />
          {title('RGE Studio MCP')}
          {sub('the front door')}
        </>)}

        {box('backend', nodeLit('backend'), <>
          <img src={rgeIcon} style={{ height: 18, width: 18, display: 'block', margin: '0 auto 0.2rem' }} />
          {title('RGE Studio backend')}
          {sub('REST · most tools')}
        </>)}

        {box('content', nodeLit('content'), <>
          <img src={beefreeIcon} style={{ height: 15, width: 'auto', display: 'block', margin: '0 auto 0.15rem' }} />
          {title('SDK content service API')}
          {sub('the home of all sdk services')}
        </>)}

        {box('sdk', nodeLit('sdk'), <>
          <img src={beefreeIcon} style={{ height: 15, width: 'auto', display: 'block', margin: '0 auto 0.15rem' }} />
          {title('SDK MCP')}
          {sub('coediting sessions & code mode')}
        </>)}

        {box('renderer', nodeLit('renderer'), <>
          <img src={beefreeIcon} style={{ height: 15, width: 'auto', display: 'block', margin: '0 auto 0.15rem' }} />
          {title('Renderer')}
          {sub('previews & screenshots')}
        </>)}
      </div>
    </div>
  )
}
