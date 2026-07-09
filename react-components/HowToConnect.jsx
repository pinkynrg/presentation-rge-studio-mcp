import { useState, useEffect, useRef } from 'react'
import claude from '../assets/logos/claude.svg'
import chatgpt from '../assets/logos/chatgpt.svg'
import n8n from '../assets/logos/n8n.svg'
import gemini from '../assets/logos/gemini.svg'
import copilot from '../assets/logos/copilot.svg'
import cursor from '../assets/logos/cursor.svg'
import perplexity from '../assets/logos/perplexity.svg'
import mistral from '../assets/logos/mistral.svg'
import grok from '../assets/logos/grok.svg'
import llama from '../assets/logos/llama.svg'
import huggingface from '../assets/logos/huggingface.svg'
import zapier from '../assets/logos/zapier.svg'
import make from '../assets/logos/make.svg'
import windsurf from '../assets/logos/windsurf.svg'
import replit from '../assets/logos/replit.svg'
import deepseek from '../assets/logos/deepseek.svg'
import qwen from '../assets/logos/qwen.svg'
import stackblitz from '../assets/logos/stackblitz.svg'
import langchain from '../assets/logos/langchain.svg'
import vercel from '../assets/logos/vercel.svg'
import raycast from '../assets/logos/raycast.svg'
import warp from '../assets/logos/warp.svg'
import cline from '../assets/logos/cline.svg'
import openrouter from '../assets/logos/openrouter.svg'

const LOGOS = {
  claude, chatgpt, n8n, gemini, copilot, cursor, perplexity, mistral, grok, llama,
  huggingface, zapier, make, windsurf, replit, deepseek, qwen, stackblitz, langchain,
  vercel, raycast, warp, cline, openrouter,
}

const URL = 'https://mcp.reallygoodemails.com/mcp'
const DOCS = 'https://growens.atlassian.net/wiki/spaces/BEEPro/pages/7104102464/RGE+Studio+-+MCP+Server+beta#How-to-connect'

const TABS = [
  { key: 'claude', label: 'Claude', rec: true },
  { key: 'chatgpt', label: 'ChatGPT' },
  { key: 'n8n', label: 'N8N' },
  // ...and everything else (blitzed through to make the point)
  { key: 'gemini', label: 'Gemini' },
  { key: 'copilot', label: 'Copilot' },
  { key: 'cursor', label: 'Cursor' },
  { key: 'perplexity', label: 'Perplexity' },
  { key: 'mistral', label: 'Mistral' },
  { key: 'grok', label: 'Grok' },
  { key: 'llama', label: 'Llama' },
  { key: 'huggingface', label: 'Hugging Face' },
  { key: 'zapier', label: 'Zapier' },
  { key: 'make', label: 'Make' },
  { key: 'windsurf', label: 'Windsurf' },
  { key: 'replit', label: 'Replit' },
  { key: 'deepseek', label: 'DeepSeek' },
  { key: 'qwen', label: 'Qwen' },
  { key: 'stackblitz', label: 'StackBlitz' },
  { key: 'langchain', label: 'LangChain' },
  { key: 'vercel', label: 'Vercel' },
  { key: 'raycast', label: 'Raycast' },
  { key: 'warp', label: 'Warp' },
  { key: 'cline', label: 'Cline' },
  { key: 'openrouter', label: 'OpenRouter' },
  { key: 'any', label: 'Any assistant' },
]

// only a few need bespoke steps; everything else uses the generic flow
const CONTENT = {
  claude: ['Settings → Connectors', 'Add custom connector', 'Paste the URL', 'Sign in'],
  chatgpt: ['Paid plan', 'Enable Developer Mode', 'Create App', 'Auth: OAuth'],
  n8n: ['Add MCP node', 'Transport: HTTP Streamable', 'Auth: MCP OAuth2', 'Dynamic Client Registration', 'Connect, sign in'],
  // mock steps — just for the blitz effect; every row differs tab to tab
  gemini: ['Open settings', 'Add extension', 'Drop the URL', 'Authorize'],
  copilot: ['Copilot menu', 'New MCP server', 'Enter the URL', 'Log in'],
  cursor: ['Cursor → MCP', 'Register server', 'URL goes here', 'Approve access'],
  perplexity: ['Connectors tab', 'Create connector', 'Server address', 'OAuth login'],
  mistral: ['Le Chat setup', 'Attach a tool', 'Point to URL', 'Confirm sign-in'],
  grok: ['Grok settings', 'Hook up MCP', 'Paste endpoint', 'Allow access'],
  llama: ['Wire your app', 'HTTP transport', 'Set the URL', 'Token exchange'],
  huggingface: ['Toolkit config', 'Register MCP', 'Add endpoint', 'Grant access'],
  zapier: ['New Zap', 'MCP action', 'Feed the URL', 'Connect account'],
  make: ['Add a module', 'MCP client', 'URL in config', 'Link account'],
  windsurf: ['Windsurf → MCP', 'Add a server', 'Server URL', 'Trust it'],
  replit: ['Open Replit', 'Add integration', 'Paste endpoint', 'Authorize app'],
  deepseek: ['DeepSeek settings', 'Enable tools', 'URL field', 'Sign in'],
  qwen: ['Qwen console', 'New connector', 'Add address', 'Log on'],
  stackblitz: ['Bolt.new', 'Wire up MCP', 'Drop endpoint', 'Approve'],
  langchain: ['LangChain client', 'MCP adapter', 'Set server URL', 'Grant token'],
  vercel: ['v0 settings', 'MCP tool spec', 'Point to server', 'Allow it'],
  raycast: ['Raycast AI', 'Add MCP', 'Paste server', 'Connect'],
  warp: ['Warp terminal', 'Agent config', 'Add the URL', 'Confirm'],
  cline: ['Cline settings', 'MCP servers', 'Enter address', 'OAuth'],
  openrouter: ['OpenRouter keys', 'Add MCP tool', 'Server address', 'Authorize'],
  any: ['Paste the URL', 'Sign in (OAuth)', 'Create'],
}

const Cmd = ({ children }) => (
  <div style={{
    flex: 1, minWidth: 0,
    background: '#f4f2fb', border: '1px solid #e0d8f5', borderRadius: '6px',
    padding: '0.3rem 0.5rem', fontFamily: 'monospace', fontSize: '0.58rem',
    overflowX: 'auto', whiteSpace: 'nowrap',
  }}>{children}</div>
)

const LAST = TABS.length - 1

export default function HowToConnect() {
  const [idx, setIdx] = useState(0)
  const tabRefs = useRef([])

  // auto-only (no clicking): exponential decay, accelerating into
  // "Any assistant", short pause, then loop from the start.
  useEffect(() => {
    const delay = idx >= LAST ? 1500 : Math.max(30, Math.round(2400 * Math.pow(0.7, idx)))
    const t = setTimeout(() => setIdx((i) => (i >= LAST ? 0 : i + 1)), delay)
    return () => clearTimeout(t)
  }, [idx])

  // keep the active tab scrolled into view (the strip whooshes along)
  useEffect(() => {
    const el = tabRefs.current[idx]
    if (el) el.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' })
  }, [idx])

  const tabKey = TABS[idx].key
  const items = CONTENT[tabKey] || CONTENT.any
  const logo = LOGOS[tabKey]

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
        {TABS.map((t, i) => {
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
          {tabKey === 'any'
            ? <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: '7px', width: '160px' }}>
                {Object.values(LOGOS).map((l, i) => (
                  <img key={i} src={l} style={{ width: '22px', height: '22px', objectFit: 'contain' }} />
                ))}
              </div>
            : <img src={logo} style={{ height: '240px', width: 'auto', maxWidth: '240px', objectFit: 'contain' }} />}
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
