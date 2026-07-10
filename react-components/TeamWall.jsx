import davide from '../assets/team/davide.jpg'
import marcoBrancaccio from '../assets/team/marco-brancaccio.jpg'
import marcoBianchi from '../assets/team/marco-bianchi.jpg'
import marcello from '../assets/team/marcello.png'
import cinzia from '../assets/team/cinzia.png'
import federico from '../assets/team/federico.jpg'
import flavio from '../assets/team/flavio.jpg'
import elena from '../assets/team/elena.jpg'

const TEAM = [
  { img: davide, name: 'Davide Lafratta', role: 'RGE Studio · Fullstack Engineer', quip: 'the one who is never sarcastic' },
  { img: marcoBrancaccio, name: 'Marco Brancaccio', role: 'SDK · Fullstack Engineer', quip: 'the one who never makes millennial jokes' },
  { img: marcoBianchi, name: 'Marco Bianchi', role: 'SDK · Fullstack Engineer', quip: 'the one who never mumbles' },
  { img: marcello, name: 'Marcello Garini', role: 'RGE Studio · Engineering Manager', quip: 'the one who never overlaps meetings' },
  { img: cinzia, name: 'Cinzia Caleffi', role: 'RGE Studio · Product Manager', quip: 'the one who never breaks your feature by clicking the mouse 1000 times per second' },
  { img: federico, name: 'Federico Fabiano', role: 'RGE Studio · Product Designer', quip: 'the one who is never the wolf in lupus in fabula' },
  { img: flavio, name: 'Flavio Sartori', role: 'Cross · QA Engineer', quip: 'the one who hates beer' },
  { img: elena, name: 'Elena Loatelli', role: 'Product Marketing Manager', quip: "the one who doesn't miss the product team" },
]

export default function TeamWall() {
  return (
    <div style={{ marginTop: '1.8rem' }}>
      <style>{`
        .tw-name { color: #1a1a1a !important; }
        .tw-role { color: #8a8a8a !important; }
        .tw-quip { color: #b0a7c9 !important; }
      `}</style>
      <div style={{
        display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.3rem 1.6rem',
        maxWidth: '620px', margin: '0 auto',
      }}>
        {TEAM.map((p) => (
          <div key={p.name} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.35rem' }}>
            <img src={p.img} style={{
              width: 62, height: 62, borderRadius: '50%', objectFit: 'cover',
              border: '2px solid #e8deff', boxShadow: '0 3px 10px rgba(119,71,255,0.18)',
            }} />
            <div className="tw-name" style={{ fontSize: '0.72rem', fontWeight: 700, lineHeight: 1.1, textAlign: 'center' }}>{p.name}</div>
            <div className="tw-role" style={{ fontSize: '0.6rem', lineHeight: 1, textAlign: 'center' }}>{p.role}</div>
            {p.quip && <div className="tw-quip" style={{ fontSize: '0.58rem', fontStyle: 'italic', fontWeight: 300, lineHeight: 1.25, textAlign: 'center', marginTop: '0.15rem' }}>“{p.quip}”</div>}
          </div>
        ))}
      </div>
    </div>
  )
}
