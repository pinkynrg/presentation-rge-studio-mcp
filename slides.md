---
theme: seriph
title: RGE Studio MCP
info: |
  ## RGE Studio MCP
  RGE Studio, inside any AI assistant — how we turned our product into
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
6. **What we learned**
7. **Monitoring** · KPIs in Grafana
8. **What's next**
9. **Q & A**

</div>

---

# Two products, two MCPs

Two products, **each with its own MCP.** Today we open up the second one.

<div style="display: grid; grid-template-columns: 1fr 1fr; gap: 2.5rem; margin-top: 2rem; align-items: stretch;">

<div style="border: 2px solid #e8deff; border-radius: 14px; padding: 1rem 1.2rem; background: rgba(255,255,255,0.8);">
  <div style="text-align: center; height: 40px; display: flex; align-items: center; justify-content: center;"><img src="/assets/beefree-icon.png" style="height: 26px; width: auto;" /></div>
  <h3 style="text-align: center; font-size: 1rem; margin-bottom: 0.3rem;">SDK</h3>
  <p style="text-align: center; font-size: 0.8rem; color: #666 !important; margin-bottom: 0.8rem;">the drag-and-drop editor our customers embed</p>
  <div style="text-align: center;"><code style="background: #f0fff4; border: 1px solid #22bb33; border-radius: 8px; padding: 0.25rem 0.7rem; font-size: 0.75rem;">shipped ✓</code></div>
</div>

<div style="border: 2px solid #7747ff; border-radius: 14px; padding: 1rem 1.2rem; background: rgba(255,255,255,0.9); box-shadow: 0 6px 20px rgba(119,71,255,0.2);">
  <div style="text-align: center; height: 40px; display: flex; align-items: center; justify-content: center;"><img src="/assets/rge-icon.svg" style="height: 40px; width: 40px;" /></div>
  <h3 style="text-align: center; font-size: 1rem; margin-bottom: 0.3rem;">RGE Studio</h3>
  <p style="text-align: center; font-size: 0.8rem; color: #666 !important; margin-bottom: 0.8rem;">the app where teams manage all their email designs</p>
  <div style="text-align: center;"><code style="background: #f8f6ff; border: 1px solid #7747ff; border-radius: 8px; padding: 0.25rem 0.7rem; font-size: 0.75rem; font-weight: 700;">today 🎉</code></div>
</div>

</div>

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

# What we learned

<div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 1.5rem; margin-top: 2.5rem;">

<div style="background: linear-gradient(135deg, #f8f6ff 0%, #ffffff 100%); border: 1px solid #e8deff; border-radius: 12px; padding: 1.2rem; box-shadow: 0 4px 12px rgba(119,71,255,0.15);">
  <div style="font-size: 2rem; text-align: center; margin-bottom: 0.5rem;">📌</div>
  <div style="text-align: center; font-weight: 700; font-size: 0.9rem;">One tool, read me first</div>
  <p style="text-align: center; font-size: 0.75rem; color: #666 !important; margin-top: 0.5rem;">the server's own description is optional, not every client reads it. So the rules live in a mandatory tool call</p>
</div>

<div style="background: linear-gradient(135deg, #f8f6ff 0%, #ffffff 100%); border: 1px solid #e8deff; border-radius: 12px; padding: 1.2rem; box-shadow: 0 4px 12px rgba(119,71,255,0.15);">
  <div style="font-size: 2rem; text-align: center; margin-bottom: 0.5rem;">🔗</div>
  <div style="text-align: center; font-weight: 700; font-size: 0.9rem;">1 endpoint ≠ 1 tool</div>
  <p style="text-align: center; font-size: 0.75rem; color: #666 !important; margin-top: 0.5rem;">mapping each REST endpoint straight to a tool isn't always right. Sometimes you tighten the request, and trim the response, to just what the model needs</p>
</div>

<div style="background: linear-gradient(135deg, #f8f6ff 0%, #ffffff 100%); border: 1px solid #e8deff; border-radius: 12px; padding: 1.2rem; box-shadow: 0 4px 12px rgba(119,71,255,0.15);">
  <div style="font-size: 2rem; text-align: center; margin-bottom: 0.5rem;">📸</div>
  <div style="text-align: center; font-weight: 700; font-size: 0.9rem;">Preview was harder than it looked</div>
  <p style="text-align: center; font-size: 0.75rem; color: #666 !important; margin-top: 0.5rem;">inline HTML needs a domain whitelist for images, but users pull images from anywhere. We couldn't allow the whole web. Screenshots won</p>
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

<p style="font-size: 0.9rem; color: #666 !important; margin-top: -0.3rem;">Beta is real. Everything after is a wishlist — ideas we're chasing, not promises.</p>

<React is="Roadmap" />

---
layout: center
class: text-center
---

# Q & A

<div style="font-size: 1.1rem; color: #666 !important; margin-top: 1rem;">ask away 🎤</div>

---
layout: center
class: text-center
---

# Thanks for listening!

<React is="AssistantCycler" />
