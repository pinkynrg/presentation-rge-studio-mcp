import { useState, useEffect } from 'react'

const ASSISTANTS = [
  { name: 'Claude', color: '#D97757' },
  { name: 'ChatGPT', color: '#10A37F' },
  { name: 'N8N', color: '#EA4B71' },
  { name: 'any assistant', color: '#7747ff', italic: true },
]

// Title-slide subtitle: "RGE Studio, inside <assistant>" with the assistant
// name cycling. Sets the "any assistant" theme before a word is spoken.
export default function AssistantCycler() {
  const [i, setI] = useState(0)
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    const t = setInterval(() => {
      setVisible(false)
      setTimeout(() => {
        setI((x) => (x + 1) % ASSISTANTS.length)
        setVisible(true)
      }, 250)
    }, 1800)
    return () => clearInterval(t)
  }, [])

  const a = ASSISTANTS[i]

  return (
    <div style={{ fontSize: '1.5rem', marginTop: '1rem' }}>
      RGE Studio, inside{' '}
      <span style={{
        display: 'inline-block',
        minWidth: '8rem',
        textAlign: 'left',
        fontWeight: 800,
        color: a.color,
        fontStyle: a.italic ? 'italic' : 'normal',
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(10px)',
        transition: 'opacity 0.25s, transform 0.25s',
      }}>{a.name}</span>
    </div>
  )
}
