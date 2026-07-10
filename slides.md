---
theme: seriph
title: RGE Studio MCP
info: |
  ## RGE Studio MCP
  RGE Studio, inside any AI assistant. How we turned our product into
  buttons an LLM can press.
class: text-center
drawings:
  persist: false
transition: slide-left
mdc: true
addons:
  - slidev-addon-react
fonts:
  sans: 'Roboto'
  serif: 'Roboto Slab'
  mono: 'Roboto Mono'
---

# RGE Studio MCP

<React is="AssistantCycler" />

---

# The plan

<div style="font-size: 1rem; margin-top: 1rem;">

1. **Two products, two MCPs** · what we built
2. **How it's wired** · one door, whole app behind it
3. **Same API, new caller** · a human clicks, now the AI calls
4. **The 18 tools** · what the AI can do
5. **Live demo** · on claude.ai
6. **How to connect** · any assistant, one URL
7. **The challenges we faced**
8. **Monitoring** · KPIs in Grafana
9. **What's next**
10. **Q & A**

</div>

---

# Two products. Finally, two MCPs.

The SDK has had one for a while. Today, **RGE Studio gets its own.**

<React is="TwoProducts" />

---

# How it's wired

One door. All of RGE Studio behind it.

<React is="ArchFlow" />

---

# Same API, new caller

An API is a **waiter** 🤵. You don't walk into the kitchen. You ask, it brings.

<React is="SameApiNewCaller" />

---

# 18 tools the AI can call

Grouped by what they're for: read the rules, find your stuff, create, check, save.

<React is="ToolJourney" />

---
layout: center
class: text-center
---

# Demo

<!-- Write a travel inspiration email in Airbnb's style. Tone: warm, human, wanderlust-driven. Structure: destination hero with white body background → friendly headline about belonging anywhere → two-sentence intro → three-column destination cards each with a photo, location name, and starting price → host spotlight split-screen with photo and short quote → CTA: 'Start Exploring.' Warm coral and white palette. -->

<!-- Write a premiere email for a new dark thriller series in Netflix's style. Tone: cinematic, mysterious. Structure: full-bleed key art hero with title treatment overlay → release date in red → two-line series logline → three-column episode preview strip with stills and one-line teasers → cast spotlight split-screen → CTA: 'Watch Now.' Black background, Netflix red accents only. -->

<!-- Write a feature announcement email in Spotify's style. Tone: friendly, energetic, slightly playful. Structure: colorful gradient hero with feature name large → two-sentence explanation of what's new → three-column icon triptych showing how it works step by step → animated GIF of the feature in the app → user testimonial pull quote → CTA: 'Try It Now.' Spotify green on dark background. -->

<!-- Write a launch email for a new iPhone in Apple's style. Tone: quiet confidence, zero hype. Structure: full-bleed product hero on white → five-word headline → two-sentence intro → alternating split-screen sections for three key features, each with a close-up shot and one paragraph → specs comparison table against previous model → primary CTA: 'Order Now'. Pure white background, SF Pro typography implied, single grey accent. -->

---

# How to connect

<React is="HowToConnect" />

---

# The challenges that we faced

<div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 1.5rem; margin-top: 2.5rem;">

<div style="background: linear-gradient(135deg, #f8f6ff 0%, #ffffff 100%); border: 1px solid #e8deff; border-radius: 12px; padding: 1.2rem; box-shadow: 0 4px 12px rgba(119,71,255,0.15);">
  <div style="font-size: 2rem; text-align: center; margin-bottom: 0.5rem;">📌</div>
  <div style="text-align: center; font-weight: 700; font-size: 0.9rem;">One tool, read me first</div>
  <p style="text-align: center; font-size: 0.75rem; color: #666 !important; margin-top: 0.5rem;">an MCP server's description is optional, and there's no guarantee an agent reads it or follows it. So we put the instructions inside a tool the agent must call first</p>
</div>

<div style="background: linear-gradient(135deg, #f8f6ff 0%, #ffffff 100%); border: 1px solid #e8deff; border-radius: 12px; padding: 1.2rem; box-shadow: 0 4px 12px rgba(119,71,255,0.15);">
  <div style="font-size: 2rem; text-align: center; margin-bottom: 0.5rem;">🔗</div>
  <div style="text-align: center; font-weight: 700; font-size: 0.9rem;">1 endpoint ≠ 1 tool</div>
  <p style="text-align: center; font-size: 0.75rem; color: #666 !important; margin-top: 0.5rem;">our endpoints return a lot of info meant for the screen, but an agent doesn't need most of it. We trimmed the response to just what the model actually needs</p>
</div>

<div style="background: linear-gradient(135deg, #f8f6ff 0%, #ffffff 100%); border: 1px solid #e8deff; border-radius: 12px; padding: 1.2rem; box-shadow: 0 4px 12px rgba(119,71,255,0.15);">
  <div style="font-size: 2rem; text-align: center; margin-bottom: 0.5rem;">📸</div>
  <div style="text-align: center; font-weight: 700; font-size: 0.9rem;">Preview was harder than it looked</div>
  <p style="text-align: center; font-size: 0.75rem; color: #666 !important; margin-top: 0.5rem;">we show a snapshot image instead of live HTML. Just as good to look at, but safer: no worrying about where external resources (scripts, images, css) are hosted</p>
</div>

</div>

---

# Eyes on it: Grafana

<p style="font-size: 0.95rem; color: #666 !important; margin-top: -0.3rem;">Every tool call emits a structured log. We watch usage, errors and latency live.</p>

<div style="border: 1px solid #ccc; border-radius: 10px; overflow: hidden; box-shadow: 0 8px 28px rgba(0,0,0,0.2); margin-top: 1.2rem; max-width: 624px; margin-left: 0; margin-right: auto;">
  <div style="background: #e8e8ea; padding: 0.35rem 0.6rem; display: flex; align-items: center; gap: 0.35rem;">
    <span style="width: 10px; height: 10px; border-radius: 50%; background: #ff5f57; display: inline-block;"></span>
    <span style="width: 10px; height: 10px; border-radius: 50%; background: #febc2e; display: inline-block;"></span>
    <span style="width: 10px; height: 10px; border-radius: 50%; background: #28c840; display: inline-block;"></span>
    <span style="margin-left: 0.6rem; font-size: 0.65rem; color: #666 !important;">Grafana · RGE Studio MCP</span>
  </div>
  <img src="/assets/grafana.png" style="display: block; width: 100%;" />
</div>

<p style="font-size: 0.8rem; color: #999 !important; margin-top: 1rem;">A few panels today. The logs are all wired, so detailed dashboards are a query away.</p>

---

# What's next

<p style="font-size: 0.9rem; color: #666 !important; margin-top: -0.3rem;">Beta is real. Everything after is a wishlist, ideas we're chasing, not promises.</p>

<React is="Roadmap" />

---
layout: center
class: text-center
---

# Q & A

---
layout: center
class: text-center
---

# Thanks for listening!

<React is="AssistantCycler" />
