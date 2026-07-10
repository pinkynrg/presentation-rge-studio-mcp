import { useState, useEffect } from 'react'
import { useInView } from './useInView.js'

// All 18 tools, grouped by what they're actually for. Labels are human-readable;
// the real tool names live in the code — here we care about what they DO.
const STAGES = [
  {
    icon: '📖', name: 'Read the rules', bg: '#f3efff', bd: '#e0d5f7', bdDark: '#a98fe0', tools: [
      { label: 'Read the rulebook', raw: 'get_instructions' },
    ],
  },
  {
    icon: '🔍', name: 'Find your stuff', bg: '#eef4ff', bd: '#d3e2fb', bdDark: '#7ba6e8', tools: [
      { label: 'Organizations', raw: 'list_customers' },
      { label: 'Workspaces', raw: 'list_brands' },
      { label: 'Folders', raw: 'list_projects' },
      { label: 'Emails (top level)', raw: 'list_root_project_emails' },
      { label: 'Emails (in a folder)', raw: 'list_project_emails' },
      { label: "One email's details", raw: 'get_email' },
      { label: 'Brand styles', raw: 'get_brand_styles' },
    ],
  },
  {
    icon: '✍️', name: 'Drafting', bg: '#eefaf1', bd: '#cdeed6', bdDark: '#6cc389', tools: [
      { label: 'Start a draft', raw: 'open_email_editor' },
      { label: 'Reuse a design', raw: 'get_inspired' },
      { label: 'SDK MCP → code mode', raw: 'edit_email' },
    ],
  },
  {
    icon: '👀', name: 'Check it', bg: '#fff6e8', bd: '#f2e2bf', bdDark: '#dcb85e', tools: [
      { label: 'Preview in chat', raw: 'preview_email' },
      { label: 'Preview a saved one', raw: 'preview_saved_email' },
      { label: 'Screenshot (AI self-check)', raw: 'screenshot_email' },
    ],
  },
  {
    icon: '💾', name: 'Save & export', bg: '#fdeef4', bd: '#f6d3e2', bdDark: '#e08bb4', tools: [
      { label: 'Save as new', raw: 'create_email' },
      { label: 'Update a saved one', raw: 'update_saved_email' },
      { label: 'Edit name / subject', raw: 'update_email_metadata' },
      { label: 'Get HTML (for other tools)', raw: 'export_email_html' },
    ],
  },
]

// Stages light up left to right; each stage pops its tool chips in.
export default function ToolJourney() {
  const [ref, inView] = useInView()
  const [step, setStep] = useState(0)
  useEffect(() => { if (!inView) setStep(0) }, [inView])
  useEffect(() => {
    if (!inView) return
    const t = setInterval(() => setStep((s) => (s + 1) % (STAGES.length + 2)), 1500)
    return () => clearInterval(t)
  }, [inView])

  return (
    <div ref={ref} style={{ marginTop: '1.5rem', width: '100%' }}>
      <style>{`.slidev-layout div.tool-raw { color: #6f5aa0 !important; }`}</style>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '0.9rem', alignItems: 'start', width: '100%' }}>
        {STAGES.map((stage, si) => {
          const lit = si <= step
          const active = si === step
          return (
            <div key={stage.name}>
              {/* stage header */}
              <div style={{
                textAlign: 'center',
                background: lit ? stage.bg : '#f5f5f7',
                color: lit ? '#1a1a1a' : '#aaa',
                border: `2px solid ${lit ? (active ? stage.bdDark : stage.bd) : '#e8e8ea'}`,
                boxShadow: active ? '0 4px 14px rgba(0,0,0,0.1)' : 'none',
                borderRadius: '12px',
                padding: '0.4rem 0.3rem',
                marginBottom: '0.6rem',
                transform: active ? 'scale(1.06)' : 'scale(1)',
                transition: 'all 0.4s',
              }}>
                <div style={{ fontSize: '1.3rem', lineHeight: 1.2 }}>{stage.icon}</div>
                <div style={{ fontSize: '0.72rem', fontWeight: 800 }}>{stage.name}</div>
              </div>

              {/* tool chips */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                {stage.tools.map((tool, ti) => (
                  <div key={tool.raw} style={{
                    background: lit ? stage.bg : '#f5f5f5',
                    border: `1px solid ${lit ? stage.bd : '#eee'}`,
                    padding: '0.3rem 0.45rem', borderRadius: '6px',
                    lineHeight: 1.25,
                    opacity: lit ? 1 : 0.5,
                    transform: lit ? 'scale(1)' : 'scale(0.95)',
                    transition: 'all 0.3s',
                    transitionDelay: active ? `${ti * 70}ms` : '0ms',
                  }}>
                    <div style={{ fontSize: '0.58rem', fontWeight: 600, color: lit ? '#1a1a1a' : '#aaa' }}>{tool.label}</div>
                    <div className="tool-raw" style={{ fontSize: '0.45rem', fontFamily: 'monospace' }}>{tool.raw}</div>
                  </div>
                ))}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
