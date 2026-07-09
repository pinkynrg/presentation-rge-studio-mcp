import { useState, useEffect } from 'react'
import rgeIcon from '../assets/rge-icon.svg'
import beefreeIcon from '../assets/beefree-icon.png'

// Node centers + half-extents (percent of container). Arrows, boxes and the
// travelling dot are ALL derived from these. hw/hh are the box half-width/height
// so arrows can stop exactly at the border while staying colinear with the dot.
const N = {
  assistant: { cx: 9.5, cy: 50, hw: 7.5, hh: 11 },
  mcp: { cx: 41, cy: 50, hw: 11, hh: 14 },
  backend: { cx: 84, cy: 21, hw: 13, hh: 12 },
  editor: { cx: 84, cy: 79, hw: 13, hh: 12 },
}

// Trim the center→center segment to each box's border (same line, shorter ends).
function edge(a, b) {
  const dx = b.cx - a.cx, dy = b.cy - a.cy
  const adx = Math.abs(dx) || 1e-6, ady = Math.abs(dy) || 1e-6
  const tA = Math.min(a.hw / adx, a.hh / ady)
  const tB = Math.min(b.hw / adx, b.hh / ady)
  return {
    x1: a.cx + dx * tA, y1: a.cy + dy * tA,
    x2: b.cx - dx * tB, y2: b.cy - dy * tB,
  }
}

export default function ArchFlow() {
  const [step, setStep] = useState(0)
  useEffect(() => {
    const t = setInterval(() => setStep((s) => (s + 1) % 8), 1300)
    return () => clearInterval(t)
  }, [])

  // The request only ever flows LEFT → RIGHT. Both passes start visibly at the
  // assistant; the hidden snaps reset it invisibly (never a right-to-left glide).
  const PATH = [
    { n: 'assistant', visible: true, snap: true },  // 0 appear at assistant (pass 1)
    { n: 'mcp', visible: true },                     // 1 → MCP
    { n: 'backend', visible: true },                 // 2 → backend
    { n: 'assistant', visible: false, snap: true },  // 3 hidden snap back
    { n: 'assistant', visible: true, snap: true },   // 4 appear at assistant (pass 2)
    { n: 'mcp', visible: true },                     // 5 → MCP
    { n: 'editor', visible: true },                  // 6 → editor engine
    { n: 'assistant', visible: false, snap: true },  // 7 hidden snap back
  ]
  const p = PATH[step]
  const pc = N[p.n]

  const box = (node, lit, w, children) => (
    <div style={{
      position: 'absolute',
      left: `${node.cx}%`, top: `${node.cy}%`,
      width: w,
      transform: `translate(-50%, -50%) scale(${lit ? 1.03 : 1})`,
      border: `${lit ? '2.5px' : '2px'} solid ${lit ? '#7747ff' : '#d9cffa'}`,
      borderRadius: '12px',
      background: '#ffffff',
      padding: '0.45rem 0.6rem',
      textAlign: 'center',
      boxShadow: lit ? '0 4px 14px rgba(119,71,255,0.28)' : '0 1px 4px rgba(0,0,0,0.06)',
      transition: 'border-color 0.4s, border-width 0.4s, box-shadow 0.4s, transform 0.4s',
      // light up only when the ball actually arrives (after its ~1s travel);
      // instant on snap steps where the ball teleports.
      transitionDelay: lit && !p.snap ? '0.9s' : '0s',
      zIndex: 2,
    }}>{children}</div>
  )

  const title = (t) => <div style={{ fontWeight: 800, fontSize: '0.72rem', color: '#7747ff' }}>{t}</div>
  const sub = (t) => <div style={{ fontSize: '0.58rem', color: '#666' }}>{t}</div>

  const arrow = (a, b) => {
    const e = edge(a, b)
    return (
      <line x1={`${e.x1}%`} y1={`${e.y1}%`} x2={`${e.x2}%`} y2={`${e.y2}%`}
        stroke="#C4A3FF" strokeWidth="2.5" markerEnd="url(#arr)" />
    )
  }

  return (
    <div style={{ position: 'relative', height: '330px', marginTop: '1rem' }}>
      {/* arrows — center to center, drawn behind the boxes */}
      <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 0 }}>
        <defs>
          <marker id="arr" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
            <path d="M0,0 L6,3 L0,6" fill="none" stroke="#C4A3FF" strokeWidth="1.5" />
          </marker>
        </defs>
        {arrow(N.assistant, N.mcp)}
        {arrow(N.mcp, N.backend)}
        {arrow(N.mcp, N.editor)}
      </svg>

      {/* the travelling request — rides the arrows, passes under the boxes */}
      <div style={{
        position: 'absolute',
        left: `${pc.cx}%`, top: `${pc.cy}%`,
        width: 14, height: 14, borderRadius: '50%',
        background: '#7747ff',
        boxShadow: '0 0 10px 3px rgba(119,71,255,0.5)',
        transform: 'translate(-50%, -50%)',
        opacity: p.visible ? 1 : 0,
        transition: p.snap ? 'none' : 'left 1s ease-in-out, top 1s ease-in-out, opacity 0.3s',
        zIndex: 1,
      }} />

      {box(N.assistant, step === 0 || step === 4, '15%', <>
        <div style={{ fontSize: '1.3rem' }}>🤖</div>
        {title('AI assistant')}
        {sub('Claude · ChatGPT · N8N · custom agents')}
      </>)}

      {box(N.mcp, step === 1 || step === 5, '22%', <>
        <img src={rgeIcon} style={{ height: 22, width: 22, display: 'block', margin: '0 auto 0.5rem' }} />
        {title('RGE Studio MCP')}
        {sub('the front door')}
        <div style={{ fontSize: '0.55rem', color: '#666', marginTop: '0.2rem' }}>
          🔑 OAuth with your<br /><b>RGE Studio</b> account
        </div>
      </>)}

      {box(N.backend, step === 2, '26%', <>
        <img src={rgeIcon} style={{ height: 22, width: 22, display: 'block', margin: '0 auto 0.5rem' }} />
        {title('RGE Studio backend')}
      </>)}

      {box(N.editor, step === 6, '26%', <>
        <img src={beefreeIcon} style={{ height: 20, width: 'auto', display: 'block', margin: '0 auto 0.5rem' }} />
        {title('SDK MCP')}
      </>)}
    </div>
  )
}
