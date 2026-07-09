import { useState, useEffect } from 'react'

// All 18 tools, grouped by what they're actually for. Labels are human-readable;
// the real tool names live in the code — here we care about what they DO.
const STAGES = [
  {
    icon: '📖', name: 'Read the rules', tools: [
      { label: 'Read the rulebook', raw: 'get_instructions' },
    ],
  },
  {
    icon: '🔍', name: 'Find your stuff', tools: [
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
    icon: '✍️', name: 'Create the email', tools: [
      { label: 'Start a draft', raw: 'open_email_editor' },
      { label: 'Reuse a design', raw: 'get_inspired' },
      { label: 'SDK MCP → code mode', raw: 'edit_email' },
    ],
  },
  {
    icon: '👀', name: 'Check it', tools: [
      { label: 'Preview in chat', raw: 'preview_email' },
      { label: 'Preview a saved one', raw: 'preview_saved_email' },
      { label: 'Screenshot (AI self-check)', raw: 'screenshot_email' },
    ],
  },
  {
    icon: '💾', name: 'Save & export', tools: [
      { label: 'Save as new', raw: 'create_email' },
      { label: 'Update a saved one', raw: 'update_saved_email' },
      { label: 'Edit name / subject', raw: 'update_email_metadata' },
      { label: 'Get HTML (for other tools)', raw: 'export_email_html' },
    ],
  },
]

// Stages light up left to right; each stage pops its tool chips in.
export default function ToolJourney() {
  const [step, setStep] = useState(0)
  useEffect(() => {
    const t = setInterval(() => setStep((s) => (s + 1) % (STAGES.length + 2)), 1500)
    return () => clearInterval(t)
  }, [])

  return (
    <div style={{ marginTop: '1rem' }}>
      <style>{`.slidev-layout div.tool-raw { color: #6f5aa0 !important; }`}</style>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '0.7rem', alignItems: 'start' }}>
        {STAGES.map((stage, si) => {
          const lit = si <= step
          const active = si === step
          return (
            <div key={stage.name}>
              {/* stage header */}
              <div style={{
                textAlign: 'center',
                background: lit ? '#f1ebff' : '#f5f5f7',
                color: lit ? '#7747ff' : '#aaa',
                border: `1px solid ${lit ? (active ? '#7747ff' : '#d9cffa') : '#e8e8ea'}`,
                boxShadow: active ? '0 3px 10px rgba(119,71,255,0.18)' : 'none',
                borderRadius: '10px',
                padding: '0.35rem 0.2rem',
                marginBottom: '0.5rem',
                transform: active ? 'scale(1.06)' : 'scale(1)',
                transition: 'all 0.4s',
              }}>
                <div style={{ fontSize: '1.2rem', lineHeight: 1.2 }}>{stage.icon}</div>
                <div style={{ fontSize: '0.65rem', fontWeight: 800 }}>{stage.name}</div>
              </div>

              {/* tool chips */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                {stage.tools.map((tool, ti) => (
                  <div key={tool.raw} style={{
                    background: lit ? '#f8f6ff' : '#f5f5f5',
                    borderLeft: `2px solid ${lit ? '#7747ff' : '#ddd'}`,
                    padding: '0.2rem 0.35rem',
                    lineHeight: 1.2,
                    opacity: lit ? 1 : 0.5,
                    transform: lit ? 'scale(1)' : 'scale(0.95)',
                    transition: 'all 0.3s',
                    transitionDelay: active ? `${ti * 70}ms` : '0ms',
                  }}>
                    <div style={{ fontSize: '0.52rem', color: lit ? '#1a1a1a' : '#aaa' }}>{tool.label}</div>
                    <div className="tool-raw" style={{ fontSize: '0.42rem', fontFamily: 'monospace' }}>{tool.raw}</div>
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
