# Brainstorm — RGE Studio MCP Presentation

Working doc to sketch slide content before building the deck. Sequel to the
"AI Co-Pilot" agent talk. Grounded in the actual `beefree-mcp` codebase
(README.md / LIMITATIONS.md there are stale — ignored).

---

## Two products, two MCPs (get this right on stage)

We have **two products**, each with its own MCP:

1. **The SDK email builder** → the **SDK MCP** (`sdk-mcp`, reached through sdk-api). This is
   the MCP the *old* agent talk meant by "Headless MCP integration". Its headline tool is
   **codemode** (`beefree_execute`): run TypeScript against the editor. It also exposes
   granular `beefree_*` tools.
2. **RGE Studio** → the **RGE Studio MCP** (`rge-studio-mcp`, this `beefree-mcp` repo).
   **This talk.** RGE Studio is the application for *managing* your designs (organizations,
   workspaces, folders, emails) built on our custom-integrated SDK. Its MCP exposes that
   management surface **plus** design editing. It runs mostly on **RGE Studio's own backend
   API** (organizations, workspaces, folders, saved emails); only the editing step reuses the
   SDK's codemode as the engine that actually changes the design.

## Context

- **Previous talk**: AI Co-Pilot — an agent (planner + executor) built *inside* the SDK
  editor. We owned the whole loop: agent, tools, system prompt. It closed with
  "What's Next → **Headless MCP integration**" — i.e. the **SDK MCP**.
- **This talk**: the **RGE Studio MCP** — a *different* product's MCP. It brings RGE Studio,
  the whole design-management workflow, to any assistant, powered by RGE Studio's own backend
  API. Editing is just one piece, and for it we reuse the SDK's codemode. The star is
  RGE Studio, not the plumbing underneath.
- **Audience**: mixed room — leadership/product want the *why*; engineers want the *how*.
  Open with vision, go technical, then demo.

## Scope: what we inherit from the old deck

The old deck had two halves, split at the slide **"Now, let's get more technical"**:
- **Everything before it** (the vision intro — "AI is becoming the baseline", "Assistive not
  autonomous", "amplifying creativity", the competitor logos) was a **colleague's**, not
  Francesco's. **We do not carry it over — delete it, don't rebuild it.**
- **From "Now, let's get more technical" onward** is Francesco's — the technical story (agent vs
  tools, capabilities, architecture, lessons, demo, what's next). **That** is the basis for this
  deck.

So the new deck **opens lean and goes technical fast** — no vision runway. Title → straight into
the story (two products → the flip → API/tools → demo). Any scene-setting is one hook slide, not
a section. (A colleague may again do a separate vision intro; if so, ours starts at the tech.)

## Decisions (locked)

- **Audience**: same mixed room as the agent talk.
- **Length**: **15 min, 20 max** → the 12-slide cut below fits; the 20-min ceiling gives a
  little breathing room for the live demo.
- **Demo**: **live from Claude, no fallback.** Bold — rehearse it hard.
- **Status**: **launching soon as Beta** → frame "what's next" as a real rollout.
- **Auth**: **mention only, never explain** — "sign in with your reallygoodemails.com account"
  and move on. OAuth2/OIDC internals lose the room.
- **Competitor framing** (Stensul/Knak/Stripo): **drop it.** Short, fun, internal talk about
  *our* thing — logos cost setup time and steal focus. (Reconsider only if you want a 1-line
  "everyone's doing prompt-to-email; we did something different" throwaway.)
- Consequences for the cut: auth folded into architecture as one line; codemode + preview +
  screenshot merged into one "three moves" slide; lessons kept to 3 bullets.

## Tone & delivery (the north star)

**Explain the tech like to smart kids with short attention spans: simple, fun, fast.**
Not dumbed-down-wrong — just clear and playful. This drives every slide:

- **One idea per slide.** If a slide needs two sentences to set up, it's two slides or it's cut.
- **Analogy first, term second.** Say the everyday version, *then* drop the real word once.
- **Motion carries the meaning** — the animation *is* the explanation, text is a caption.
  Almost no paragraphs; short labels, arrows, emoji, things that move.
- **Show, don't tell** — the live demo is the proof; slides just prime it.
- **Keep energy up** — quick beats, a little humor, never a wall of text or a jargon dump.

### Analogies to lean on (kid-simple, then the real term)

- **API** = a *waiter*. You don't go into the kitchen; you ask the waiter ("save this",
  "list my emails") and it brings the answer. Our backend already has a waiter.
- **MCP** = giving the AI its *own* waiter — a **standard remote control** for our app any
  assistant can hold.
- **A tool** = a *button* the AI is allowed to press. Same buttons the app's UI presses.
- **The flip** = before, we were the driver *and* the car. Now the customer's AI drives; we're
  the *car* — the tools it steers.
- **codemode** = the AI writes a little *recipe*, our kitchen cooks it.
- **screenshot self-review** = the AI takes a *selfie* of its work and checks it before showing you.
- **get_instructions** = we can't open the AI's brain, so we hand it a *cheat-sheet* it must read first.
- **terminology guardrail** = the AI speaks "robot"; we make it speak "human" — translate every time.

## The one-line story

Before: **our agent, our UI, our system prompt.** Now: **any assistant — Claude, Cursor,
ChatGPT — is the brain, and RGE Studio is the set of tools it drives.** We stopped bringing
users to our AI and started bringing RGE Studio into theirs.

## The spine of the whole talk — the flip

- Old world: we own the agent AND the tools AND the system prompt, inside our product.
- MCP world: the user's assistant is the agent. **We only own the tools.** We do NOT control
  the model, its temperature, or its system prompt.
- So the hard problem inverts: how do you get reliable, on-brand, correct behavior when you
  don't own the brain? Everything technical in this deck is an answer to that question.
- Nice callback: the old deck's lessons (tight schemas, less-AI-is-more, split the work)
  reappear here — but re-applied in a world where you don't control the agent at all.

---

## Ground truth from the code (what actually shipped)

**Server**: `rge-studio-mcp` v1.0.0, Go, `go-sdk` StreamableHTTP, **stateless** → real
multi-user remote server. **18 tools**, not the 5 the old README lists.

**It's also a full OAuth2 / OIDC server** (zitadel/oidc): sign in with your
reallygoodemails.com (RGE Studio) account, opaque encrypted access tokens, Postgres-backed token store, RFC 9728
`WWW-Authenticate` discovery so MCP clients auto-find the auth endpoints, automatic token
refresh. This is a big deal and a genuine differentiator.

**Mostly a REST orchestrator, with one proxied tool** (don't overstate "MCP-to-MCP"):
- Most of the 18 tools are **plain REST** calls to two backends — sdk-api (CreateTemplate,
  GetTemplate, RenderHTML, RenderImage/screenshot) and beepro-backend (all `list_*`,
  brand styles, get/create/update/export). No MCP involved.
- **Only `edit_email` (codemode) talks to the SDK MCP as an MCP client, and it's a true
  proxy**: it forwards `code` to the downstream `beefree_execute` tool and returns the result
  verbatim. This is the one place RGE Studio MCP is an MCP *client*.
- **`get_inspired` also reaches the SDK MCP** (the granular `beefree_*` tools), but consumes
  them server-side to synthesize a reference — not a proxy.
- The server never touches the editor or raw email JSON directly; all editing goes through
  the SDK MCP codemode, everything else through REST.

**Real endpoint → tool pairs** (for the "same API, new caller" slide — these are the actual
beepro-backend routes, the same ones the RGE Studio web app calls):
- **Save an email**: Save button → `POST /api/v1/customers/{c}/brands/{b}/projects/{p}/messages/`
  ← MCP tool `create_email`
- **List emails in a folder**: email-list screen → `GET .../projects/{p}/messages/`
  ← MCP tool `list_project_emails`
- **Brand styles**: brand-styles panel → `GET /api/v1/customers/{c}/brands/{b}/styles/`
  ← MCP tool `get_brand_styles`
- **Export HTML**: download → `POST .../messages/{m}/downloadhtml/` ← MCP tool `export_email_html`
- Same `/api/v1/...` surface, two callers: a human clicking in the UI, or an LLM calling a tool.

**The clever bits (the best presentation material):**
- **`get_instructions` — a REQUIRED first tool.** Since we don't own the client's system
  prompt, the server forces the model to fetch its own rules before doing anything.
- **Terminology guardrail** (`instructions.md`): the model must translate internal → user
  names in every visible message — customer→organization, brand→workspace, project→folder,
  message→email, template_id→draft, codemode→editor — and never leak an internal name.
- **codemode (`edit_email`)**: the model writes **TypeScript** executed against the editor.
  RGE Studio MCP **proxies this straight to the SDK MCP's `beefree_execute`** — it's the SDK
  team's tool, wrapped here with auth, ownership, terminology and orchestration. Its ~16K
  description is fetched live from the SDK MCP, cached 30 min, and the tool re-registered at
  runtime — one source of truth. (Direct callback to the old deck's "teach the model our toolset".)
- **`get_inspired`**: reverse-engineers a saved email back into editor tool-calls as design
  *reference* (regenerates UUIDs, normalizes column weights) — inspiration, never verbatim copy.
- **Inline preview = MCP App**: `preview_email` renders the email *in the chat*. Feature-
  flagged (Flipper): server-rendered desktop+mobile images vs an HTML-iframe fallback.
- **`screenshot_email` = self-review loop**: the model takes a PNG "for your review only,
  the user can't see it", checks its own layout, fixes, then saves. Agentic verification.
- **Deterministic server-side guarantees**: strips the editor's trailing empty row on save,
  confirm-destination-before-save, refuses non-email designs (pages) and un-fetchable URLs.

---

## Proposed slides — the 15-min cut (the plan)

~11 content slides + a live demo. Budget: ~10 min slides, ~5 min demo.

1. **Title** — RGE Studio MCP. "RGE Studio, inside any AI assistant."
2. **Recap / hook + two products** — last time we closed on "headless MCP" → that became the
   **SDK MCP**. Now a *second* product, **RGE Studio** (manage your designs), has its own MCP,
   built on top. That's today. (Land the two-MCPs distinction here, once, clearly.)
3. **The flip** — before: our agent, our UI, our system prompt. Now: the user's assistant is
   the brain, we're the tools it calls. Reuse `AgentVsTools`, inverted.
4. **API 101 → same API, new caller** *(the concept the user asked for)* — build up in 3 beats:
   - **What's an API** — the backend exposes endpoints (a menu of requests: "list my emails",
     "save this email", "get brand styles"). Any program can call them over HTTP.
   - **How the RGE Studio web app uses it today** — the app is *just a caller*. You click
     **Save** → the frontend fires `POST /api/v1/.../messages/`. The buttons in the UI are
     wrappers around these endpoints.
   - **How we turn that into an MCP tool** — an MCP tool is *another caller of the exact same
     endpoint* — except now the **LLM** decides when to press it. That's basically what MCP is:
     a standard way to hand your existing API to any assistant. We didn't rebuild the backend;
     we wrapped endpoints we already had (+ auth + a good description). Show one concrete pair:
     `create_email` → the same `POST .../messages/` the Save button hits.
   - Visual idea: split panel — *left* "Human clicks button → API", *right* "LLM calls tool →
     same API". Could adapt `BeforeAfter`.
5. **What it does** — the 18 tools as a journey: *discover* (orgs / workspaces / folders /
   emails, brand styles) → *start* (open / seed draft) → *design* (get_inspired, edit_email)
   → *see* (preview, screenshot) → *persist* (create / update / export). RGE Studio = manage
   **+** design. Needs a **new** animated pipeline component (the old `Capabilities` is really
   a roadmap — reused on slide 11, not here). See animation guideline.
6. **Three moves that make it feel magic** — one slide, three beats:
   (a) **codemode** — model writes TypeScript; proxied to the SDK's `beefree_execute`;
   (b) **inline preview (MCP Apps)** — the email renders *in the chat*;
   (c) **screenshot self-review** — model takes a PNG only it can see, checks its own layout,
   fixes, then saves. (Mention `get_inspired` as a bonus if time.)
7. **The hard part: we don't own the agent** — the inversion + our answers:
   - can't touch the client's system prompt → **`get_instructions` forced first**
   - model leaks internal jargon → **terminology guardrail** (customer→organization, …)
   - non-determinism → **constrained tools, confirm-before-save, refuse pages/URLs**
   - keep the codemode API in sync → **dynamic tool description, live-refreshed**
8. **Architecture (kept dead simple)** — one animated picture, no jargon: Claude → **RGE Studio
   MCP** → two arrows out: one to **our own backend** (does most of the work), one tiny arrow to
   **the SDK's codemode** (only for the actual editing). Auth = one spoken line: "you sign in
   with your reallygoodemails.com account." Don't say OAuth/OIDC/Postgres out loud — it's on the
   diagram at most, not narrated.
9. **Live demo** — build an email end-to-end from Claude, **live, no fallback**. Go full-screen
   in Claude (optionally frame it `VirtualDesktop`-style). This is the proof; rehearse it hard.
10. **Lessons learned** — 3 bullets: instructions beat a system prompt you don't own;
    constrain the tools + make the server deterministic where it matters; give the model eyes.
11. **What's next / Beta** — launching in **Beta for all customers soon** (date = placeholder).
    **Real roadmap items** (from Jira):
    - `export_design` + `list_connectors` (BEEPRO-9135)
    - Smart Check on create & save — stretch (BEEPRO-9136)
    - `search_designs` (BEEPRO-9137)
    - **Officially publish on AI-provider marketplaces** (Claude/ChatGPT/N8N stores) — get discovered.
    - Finally: **in-app chat** — use RGE Studio through a chat agent inside the app.
    **Reuse `Capabilities`** style — roadmap cards + BETA badge + shimmer "more to come".
    (Fold lessons into this slide if running long.)
12. **Thanks**

Trim levers if over 15 min: the demo already *shows* the three moves (slide 6) — if tight,
cut 6 to a title card and let the demo carry it; merge 10 into 11; drop `get_inspired` on 6.

---

## Animation & visual guideline

Written so that **after we delete the old agent slides/components, we know exactly what to
rebuild.** This project uses **no animation library** — animations are hand-rolled:

### The tech (what's actually available here)

- **Slidev** (v52) + `slidev-addon-react` → embed React via `<React is="ComponentName" />`.
  React components live in `react-components/*.jsx` and are registered in `index.ts`.
- **React state loop**: a `step` counter auto-advances with `useEffect` +
  `setInterval(() => setStep(s => (s+1) % N), ms)`. Everything keys off `step`.
- **CSS transitions** inline: `style={{ transition: 'opacity .3s, transform .4s', ... }}`
  animating `opacity`, `transform` (scale / translateX / translateY), `color`, `background`.
- **CSS `@keyframes`** injected via `<style>{keyframes}</style>` — used for looping effects
  (glow pulse, shimmer gradient text, bouncing loader dots).
- **Slidev built-ins** (underused today, cheap wins): `v-click` for step-reveal without React,
  `v-motion` for enter transitions, and **mermaid** for diagrams.
- **Theme** (`styles/index.css`): primary purple `#7747ff`, light `#f8f6ff`/`#e8deff`, teal
  accent `#00838F`/`#D4F1F4`, success `#22bb33`, error `#ff4444`; white bg image + watermark
  logo bottom-right (`.no-watermark` hides it); auto purple numbered circles / bullets.
  Emoji used as lightweight icons (🧰🤖📧🧠⚡📋).

### Reusable animation primitives (keep / rebuild these)

1. **Step-gate reveal** — `opacity: step >= k ? 1 : 0.3` (+ `transform: scale()`); stagger with
   `transitionDelay: ${i*100}ms`. The workhorse; used everywhere.
2. **Streaming log / tool-call list** — a column scrolled by
   `transform: translateY(-${step*26}px)`, rows marked `→ / ✓ / ○`. (BeforeAfter, PlanExecute.)
3. **Checklist tick** — `✅`/`○` flipping as a fast sub-counter ticks (250 ms). (PlanExecute.)
4. **Keyframe FX** — `plannerPulse` (box-shadow glow), `shimmer` (gradient text), `pulse-dot`
   (loader). Copy these three; they cover most "alive" feeling.
5. **`VirtualDesktop`** — THE key primitive. An editor screenshot as background with an
   absolutely-positioned `stagingContent` (center canvas, builds an email row-by-row) and
   `textAreaContent` (log panel). **Re-skin: `sdk.png` → an RGE Studio editor screenshot.**
6. **New to build**: *packet-along-path* (a chip/dot animated from A→B via `translate`, for the
   API + architecture flows) and *typewriter* (reveal code by substring per tick, for codemode).

### Components: keep / repurpose / delete

| Component | Verdict | Use for |
|---|---|---|
| `VirtualDesktop` | **Keep** (re-skin image) | editor frame in slides 3/4/5/6/9 |
| `AgentVsToolsAnimated`/`Static` | **Repurpose** | the flip (slide 3), inverted |
| `BeforeAfter` | **Repurpose** | "same API, new caller" (slide 4) |
| `Capabilities` | **Repurpose** | it's a roadmap+BETA badge → what's-next/Beta (slide 11) |
| `DemoGrid` | **Repurpose / maybe drop** | swaps `beefree.io` iframes; live demo may replace it |
| `PlanExecuteAnimation` | **Delete** | agent-only (planner/executor) — gone from this deck |
| old vision-intro slides (before "Now, let's get more technical") | **Delete** | colleague's, not Francesco's — don't rebuild |
| assets `guy/design-partner/new-ideas/party.png` | **Delete** | old vision imagery |
| assets `logo.png`, background | **Keep** | theme |
| asset `sdk.png` | **Replace** | with an RGE Studio editor screenshot |

### Per-slide animation notes (with concrete examples)

- **S1 Title** — cycle the assistant name: "inside **Claude / Cursor / ChatGPT**" swapping every
  ~1.5 s (`step % 3`), title in a `shimmer` gradient. Cheap, sets the "any assistant" theme.
- **S2 Recap + two products** — timeline reveal: "last talk → SDK MCP" fades in, then the
  **RGE Studio MCP** card drops in *beside/above* it with a connecting arrow (step-gate + slide).
- **S3 The flip** — repurpose `AgentVsToolsAnimated`: step 0 shows our world (agent + tools +
  prompt under our logo); step 1 the agent + prompt fade to 0.2 and slide out (`translateX`);
  step 2 a Claude/Cursor/ChatGPT badge drops in as the new brain, wired to a box that now just
  says **Tools** (ours). The literal inversion.
- **S4 API 101 → same API, new caller** — repurpose `BeforeAfter` two-panel, both landing on ONE
  shared **API** cylinder in the middle. *Left*: a cursor clicks **Save**, a `POST .../messages/`
  chip flies (packet-along-path) into the API → `200 OK`. *Right*: an LLM bubble emits
  `create_email(...)`, the **same** chip flies into the **same** API → `200 OK`. Punchline: pulse
  the shared API box when both hit it.
- **S5 Tool surface** — NEW pipeline component: 5 stages (Discover→Start→Design→See→Persist) light
  up L→R (step-gate); tool chips pop in staggered under the active stage (`scale .8→1`,
  `transitionDelay i*80ms`); a `VirtualDesktop` beside it builds the email as stages advance.
- **S6 Three magic moves** — reveal 3 mini-beats via `v-click`/step: (a) codemode = typewriter of
  TS → `VirtualDesktop` email updates; (b) inline preview = an email screenshot scales into a mock
  chat bubble; (c) screenshot self-review = white **flash** (opacity keyframe) → screenshot appears
  → "✓ looks good". If time-tight, this becomes a title card and the **live demo carries it**.
- **S7 The hard part** — problem→fix pairs slide in on click. Signature beat: a locked 🔒 "system
  prompt (not ours)" greys out, then a glowing **`get_instructions`** rules card injects in;
  terminology row shows `customer / brand` struck-through → morphs to `organization / workspace`
  (strikethrough + color-fade swap).
- **S8 Architecture** — mermaid with nodes revealed in order (`v-click`), or a small React node
  graph with a **packet** flowing Claude → `rge-studio-mcp` → branch (REST to backend + proxy to
  SDK codemode). Animate one request end-to-end; keep it readable.
- **S9 Live demo** — real Claude window (framed), live, no fallback. No canned animation.
- **S10 Lessons** — 3 cards rise in on click (`translateY + opacity`, stagger). Keep minimal.
- **S11 What's next / Beta** — reuse `Capabilities` as-is (cycle cards + BETA badge + `shimmer`
  "more to come"); rewrite cycle content to the RGE Studio MCP roadmap.
- **S12 Thanks** — reuse the S1 shimmer title. **Keep the hidden email-prompt library** that
  lives in HTML comments at the end of the old `slides.md` — great copy-paste fuel for the live demo.

### Guardrails

- Don't over-animate: one focal motion per slide. Auto-loop is fine for ambient slides (title,
  roadmap) but **step through on click** for content slides so you control pacing on stage.
- Reduced-motion: keep durations ≤ 0.5 s; nothing should block reading the slide.

---

## Decisions recap (all resolved)

- **Audience**: mixed room. **Length**: 15 min (20 max). **Demo**: live from Claude, **no
  fallback**. **Status**: Beta soon.
- **Tone**: explain like to fun, distractible kids — simple, analogy-first, motion carries it.
- **Auth**: mention only, never explain. **Competitor framing**: dropped.
- **Product naming**: RGE Studio / reallygoodemails.com in all user-facing copy; `beefree_*`,
  `beefree-mcp`, `beepro` stay only as code identifiers.
