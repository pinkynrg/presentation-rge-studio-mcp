// Shared config for the provider list + cycle timing.
// Change it here once → the title cycler AND the "How to connect" tabs both update.
import claude from '../assets/logos/claude.svg'
import chatgpt from '../assets/logos/chatgpt.svg'
import n8n from '../assets/logos/n8n.svg'
import gemini from '../assets/logos/gemini.svg'
import copilot from '../assets/logos/copilot.svg'
import cursor from '../assets/logos/cursor.svg'
import perplexity from '../assets/logos/perplexity.svg'
import mistral from '../assets/logos/mistral.svg'
import grok from '../assets/logos/grok.svg'
import zapier from '../assets/logos/zapier.svg'
import make from '../assets/logos/make.svg'
import windsurf from '../assets/logos/windsurf.svg'
import replit from '../assets/logos/replit.svg'
import raycast from '../assets/logos/raycast.svg'
import warp from '../assets/logos/warp.svg'
import cline from '../assets/logos/cline.svg'

export const PURPLE = '#7747ff'

// order = cycle/tab order. First 3 are the tested ones (red dot).
// steps are real for the first 3 and the final "any"; mock for the rest.
export const PROVIDERS = [
  { key: 'claude', label: 'Claude', color: '#D97757', rec: true, logo: claude, steps: ['Settings → Connectors', 'Add custom connector', 'Paste the URL', 'Sign in'] },
  { key: 'chatgpt', label: 'ChatGPT', color: '#10A37F', logo: chatgpt, steps: ['Paid plan', 'Enable Developer Mode', 'Create App', 'Auth: OAuth'] },
  { key: 'n8n', label: 'N8N', color: '#EA4B71', logo: n8n, steps: ['Add MCP node', 'Transport: HTTP Streamable', 'Auth: MCP OAuth2', 'Dynamic Client Registration', 'Connect, sign in'] },
  { key: 'gemini', label: 'Gemini', color: PURPLE, logo: gemini, steps: ['Open settings', 'Add extension', 'Drop the URL', 'Authorize'] },
  { key: 'copilot', label: 'Copilot', color: PURPLE, logo: copilot, steps: ['Copilot menu', 'New MCP server', 'Enter the URL', 'Log in'] },
  { key: 'cursor', label: 'Cursor', color: PURPLE, logo: cursor, steps: ['Cursor → MCP', 'Register server', 'URL goes here', 'Approve access'] },
  { key: 'perplexity', label: 'Perplexity', color: PURPLE, logo: perplexity, steps: ['Connectors tab', 'Create connector', 'Server address', 'OAuth login'] },
  { key: 'mistral', label: 'Mistral', color: PURPLE, logo: mistral, steps: ['Le Chat setup', 'Attach a tool', 'Point to URL', 'Confirm sign-in'] },
  { key: 'grok', label: 'Grok', color: PURPLE, logo: grok, steps: ['Grok settings', 'Hook up MCP', 'Paste endpoint', 'Allow access'] },
  { key: 'zapier', label: 'Zapier', color: PURPLE, logo: zapier, steps: ['New Zap', 'MCP action', 'Feed the URL', 'Connect account'] },
  { key: 'make', label: 'Make', color: PURPLE, logo: make, steps: ['Add a module', 'MCP client', 'URL in config', 'Link account'] },
  { key: 'windsurf', label: 'Windsurf', color: PURPLE, logo: windsurf, steps: ['Windsurf → MCP', 'Add a server', 'Server URL', 'Trust it'] },
  { key: 'replit', label: 'Replit', color: PURPLE, logo: replit, steps: ['Open Replit', 'Add integration', 'Paste endpoint', 'Authorize app'] },
  { key: 'raycast', label: 'Raycast', color: PURPLE, logo: raycast, steps: ['Raycast AI', 'Add MCP', 'Paste server', 'Connect'] },
  { key: 'warp', label: 'Warp', color: PURPLE, logo: warp, steps: ['Warp terminal', 'Agent config', 'Add the URL', 'Confirm'] },
  { key: 'cline', label: 'Cline', color: PURPLE, logo: cline, steps: ['Cline settings', 'MCP servers', 'Enter address', 'OAuth'] },
  { key: 'any', label: 'Any Assistant', color: PURPLE, italic: true, logo: null, steps: ['Paste the URL', 'Sign in (OAuth)', 'Create'] },
]

export const LAST = PROVIDERS.length - 1

// Shared cycle timing: exponential speed-up, then a long hold on the last item,
// then loop. Used by both the title cycler and the How-to-connect tabs.
export function cycleDelay(idx) {
  if (idx >= LAST) return 10000
  // whole scroll to the last tab finishes in under 5s, then a long hold
  return Math.max(28, Math.round(1700 * Math.pow(0.62, idx)))
}
