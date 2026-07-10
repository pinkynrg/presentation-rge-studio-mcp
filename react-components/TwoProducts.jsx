import beefreeIcon from '../assets/sdk-icon.svg'
import rgeIcon from '../assets/rge-icon.svg'

// Two cards side by side. On the first slide click, RGE Studio jabs the SDK card
// 6 times, knocks it off the stage, and glides to center. It wants the spotlight.
// `clicks` is Slidev's $clicks, passed from the slide.
export default function TwoProducts({ clicks = 0 }) {
  const phase = clicks >= 1 ? 'charge' : 'idle'

  const cardBase = {
    position: 'absolute', top: 0, height: '100%', width: '46%', boxSizing: 'border-box',
    borderRadius: '14px', padding: '1.6rem 1.2rem',
    display: 'flex', flexDirection: 'column', justifyContent: 'space-evenly',
    alignItems: 'center', textAlign: 'center',
  }
  const badge = { background: '#f0fff4', border: '1px solid #22bb33', borderRadius: '8px', padding: '0.3rem 0.9rem', fontSize: '0.85rem' }

  return (
    <div style={{ position: 'relative', height: '34vh', marginTop: '1.5rem' }}>
      <style>{`.slidev-layout .tp-title { color: #000 !important; } .slidev-layout .tp-desc { color: #666 !important; }`}</style>

      {/* SDK */}
      <div key={`sdk-${phase}`} className={phase === 'charge' ? 'sdk-out' : undefined} style={{
        ...cardBase, left: '1%', border: '2px solid #7747ff', background: 'rgba(255,255,255,0.8)', zIndex: 1,
      }}>
        <img src={beefreeIcon} style={{ height: '72px', width: 'auto' }} />
        <h3 className="tp-title" style={{ fontSize: '1.5rem', margin: 0 }}>SDK</h3>
        <p className="tp-desc" style={{ fontSize: '0.95rem', margin: 0 }}>the drag-and-drop editor our customers embed</p>
        <code style={badge}>MCP shipped</code>
      </div>

      {/* RGE Studio */}
      <div key={`rge-${phase}`} className={phase === 'idle' ? 'rge-pulse' : 'rge-charge'} style={{
        ...cardBase, left: '53%', border: '2px solid #F04F49', background: 'rgba(255,255,255,0.95)', zIndex: 2,
      }}>
        <img src={rgeIcon} style={{ height: '84px', width: '84px' }} />
        <h3 className="tp-title" style={{ fontSize: '1.5rem', margin: 0 }}>RGE Studio</h3>
        <p className="tp-desc" style={{ fontSize: '0.95rem', margin: 0 }}>the app where teams manage all their email designs</p>
        <code style={badge}>MCP shipped today!</code>
      </div>
    </div>
  )
}
