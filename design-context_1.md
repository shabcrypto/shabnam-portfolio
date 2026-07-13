# Shabnam Raghavan Portfolio — Design Context

This file is the source of truth for extending this portfolio. Read it fully before writing any code, copy, or layout. Every decision below was made deliberately; do not "improve" the system by flattening it into generic portfolio conventions. When in doubt, ask which symbol or rule applies rather than inventing a new one.

Reference implementation: `hero-shabnam-v10.html` (home page). All tokens, timings, and patterns below are extracted from it.

---

## 1. Who this portfolio belongs to

Shabnam Raghavan. Product designer, 6 years in design, 3+ in high-stakes health InsurTech (IHX, acquired by Perfios). Work shipped to 21,000+ hospitals across India, the GCC, and Kenya. Positioning: a generalist who digs deeper and questions everything. Roles: Product Thinker, Designer, Builder, Strategist. She designs end to end, from research through strategy through deployed code.

She is from the Malabar region of Kerala, the land of lords and looms: Theyyam ritual performance and handloom weaving. She has a deep interest in human psychology. Colleagues at IHX say "do something Shabnam to it" when work needs depth. She identifies as a seeker: meticulous, accountable, resilient, ever learning.

## 2. Design philosophy

The entire visual system is one story told in symbols. Every element must trace back to one of these. Do not add decorative elements that do not belong to this vocabulary.

- **Theyyam (ritual, fire):** The flame petal halo. Represents transformation and intensity of craft. Where she is from, craft and devotion are the same word.
- **The loom (Malabar handloom):** Warp and weft threads. Represents research woven into product: many threads become one cloth. Appears in the hero scene, the intro animation, the ribbon divider, and the hover underlines.
- **The spiral:** A hand-drawn winding journey inward. Represents self-knowledge and the seeker. It draws itself from the outside in.
- **The eye of truth:** Observation, the designer's key trait. Ground truths. Raw sketch linework, never a hard outline. The iris strokes never meet; a hand-drawn ring holds a circle of stillness at the centre.
- **Red (vermillion) is shakti:** Insight, spirit, inner strength. Use it sparingly and meaningfully: it is an accent of power, not a decoration. The circle is the universe and nothing at once.
- **The open corners of the logo:** Ever-expanding, the seeker never stops.

Governing aesthetic rules:

- The page stays quiet; the work carries the colour. Page chrome is paper and ink (or coal and paper on dark sections). Saturated colour lives inside case study imagery and the symbolic accents only.
- Rawness over polish in illustration: hand wobble, layered sketch passes, jittered strokes. Precision lives in typography, spacing, and motion timing instead.
- No fills in the spiritual zone (spiral, eye, iris): ink strokes only.
- Boundaries in immersive moments (intro) are expressed through gradients and drawn lines, never harsh strokes or hard-edged shapes.

## 3. Design tokens

Copy these exactly. All colours are OKLCH.

```css
:root {
  --paper: oklch(96.2% 0.016 78);       /* warm paper, light surface */
  --paper-deep: oklch(93.5% 0.022 74);  /* recessed light surface */
  --ink: oklch(26% 0.021 42);           /* primary text and linework */
  --ink-soft: oklch(42% 0.02 45);       /* secondary text on paper */
  --coal: oklch(18% 0.012 40);          /* case study black; dark sections */
  --coal-soft: oklch(72% 0.015 60);     /* secondary text on coal */
  --vermillion: oklch(52% 0.185 33);    /* shakti red: primary accent */
  --vermillion-deep: oklch(44% 0.17 31);/* hover state of vermillion */
  --turmeric: oklch(72% 0.13 82);       /* gold: secondary accent, accent on coal */

  --space-xs: 8px;  --space-sm: 12px;  --space-md: 24px;
  --space-lg: 48px; --space-xl: 96px;

  --font-display: "Gloock", serif;
  --font-body: "Alegreya Sans", sans-serif;
}
```

Colour usage rules:

- 60/30/10: paper (or coal) dominates, ink (or paper text) supports, vermillion and turmeric together are the 10.
- On coal, prefer turmeric for interactive accents (links, thread underlines); vermillion at 52% lightness has weaker contrast on coal. Vermillion on coal is acceptable only for large display elements.
- Never introduce new hues into page chrome. Case study thumbnails may each own one saturated field colour (teal, indigo, plum are in use) with vermillion and turmeric threaded through as accents.
- Body text on paper is `--ink-soft` with `--ink` for emphasis; on coal it is `--coal-soft` with `--paper` for emphasis.

## 4. Typography

- Display: Gloock, weight 400 only, for h1, h2, h3, wordmark-scale text, large quotes, stat numbers, and the footer quote. Tight letter-spacing on large sizes (around -0.01em). Never bold Gloock.
- Body: Alegreya Sans 400/500/700 plus italic 400. Long-form reading, UI labels, captions.
- Labels and eyebrows: Alegreya Sans, uppercase, letter-spacing 0.12em to 0.18em, sizes 0.72rem to 0.85rem.
- Hero h1: clamp(2.7rem, 6.4vw, 5.4rem), line-height 1.14, text-wrap balance, with margin above and below for breathing room.
- Emphasis inside display headlines: italic Gloock in vermillion, with the hand-drawn turmeric underline SVG (a single quadratic squiggle path that draws in via stroke-dashoffset).
- Do not load additional fonts. Google Fonts link covers Gloock and Alegreya Sans only.

## 5. Layout system

- Content sections cap at 1200px, centred, with 60px horizontal padding on desktop and 24px on mobile (below 900px).
- The page alternates surfaces in a deliberate rhythm: paper hero, coal Selected Work, paper peer quotes, coal footer. Case study pages are coal throughout.
- The woven ribbon divider (14px repeating-linear-gradient of vermillion, turmeric, ink stripes) is the seam between paper and coal sections. Reuse it as the standard section transition across new pages.
- Hero grid: 7fr copy left, 5fr ritual scene right, stacking to a single column below 900px with the scene moved above the copy.
- The hero background carries a faint handloom grid via two repeating-linear-gradients of ink at 3 to 4.5% opacity, 56px cells. This texture belongs to the hero only.
- Case grid: one wide card (image 58%, body 42%, horizontal) followed by two half-width cards. Cards use 1px borders (paper at ~22% opacity on coal), no border-radius on cards, no drop shadows.

## 6. Motion system

Motion is choreography, not decoration. Principles in force:

- Entrances decelerate: `cubic-bezier(0.22, 1, 0.36, 1)` is the house entrance curve. Exits accelerate: `cubic-bezier(0.5, 0, 0.75, 0)` family. Long immersive draws use `cubic-bezier(0.45, 0, 0.3, 1)`.
- Cause and effect: every beat is born from the previous one. No dead air between an action and its consequence; overlap entrances with prior exits.
- Drawn-line entrances: SVG paths reveal via stroke-dasharray/stroke-dashoffset with the dasharray set to the actual path length. The spiral must always draw from the outside inward.
- One orchestrated load sequence per page. Everything in the hero is delayed by `calc(var(--intro-offset) + Nms)`. In v10, `--intro-offset` is 6800ms (the intro length). Any new hero-adjacent element joins this stagger; do not animate on scroll within the hero.
- Hero stagger order and spacing: eyebrow +100, h1 +220, location +340, lede +460, actions +600, provenance +740; scene elements follow from +420 (petals, 45ms apart per petal) through spiral (+900, 2000ms draw), lids (+1050 onward, 90ms apart per pass), iris (+2400), threads, wefts, caption, place.
- Micro-interactions: 160ms colour transitions, 200 to 320ms transforms, hover lifts of -2px to -4px. Nothing elastic, nothing bouncy, no infinite looping animation except the role roller.
- The role roller: unidirectional vertical loop (Designer, Thinker, Builder, Strategist), 9s cycle, holds each word then glides, loops through a duplicated first word for seamlessness. Uses `cubic-bezier(0.65, 0, 0.35, 1)`.
- `prefers-reduced-motion: reduce` is a hard contract: kill all animations and transitions, hide the intro entirely, and hand-set every final state (opacities, dashoffsets to 0, petal rotations to `var(--a)`, roller to first word). Every new animated element MUST be added to this block.

## 7. The intro

Current implementation (v10): a loom weaves itself on a coal canvas. Three warp threads draw down (centre one vermillion), a turmeric weft weaves across, a hand-drawn vermillion ring encircles the loom, "Hello" rises in Gloock, and a letter-spaced uppercase welcome line resolves its tracking over several seconds. The curtain (whole intro) rises at 6800ms with `cubic-bezier(0.65, 0, 0.2, 1)`.

Non-negotiable protections, keep in any revision:

- Click anywhere to skip: sets `--intro-offset` to 0ms on the document element and removes the intro node.
- sessionStorage guard (`shab-intro-seen`): the intro plays once per session; internal navigation must never replay it. Wrap storage access in try/catch and play the intro if storage is unavailable.
- A cleanup `setTimeout` removes the intro node after the animation completes.
- Reduced motion hides the intro completely.
- The intro is `aria-hidden="true"`; it must never trap focus or block assistive tech.

The intro is long by UX standards. That is a conscious trade-off already made. Do not lengthen it further, and do not add an intro to any page other than the home page.

## 8. Component inventory and rules

- **Topbar:** Logo image only as wordmark (no name text), `mix-blend-mode: multiply` so the white PNG background disappears into paper. Nav: Work, About me, Resume, Contact me. Hover reveals the woven thread underline (see below). On coal pages the logo needs a light or transparent variant; flag this rather than hacking filters.
- **Woven thread underline:** The signature hover. An ::after element, height 8px, background of a repeating data-URI SVG squiggle (`M0 4 Q 6 0.5 12 4 T 24 4`, 24x8 tile, stroke-width 2, round caps), revealed by scaleX(0) to scaleX(1) from the left over ~300ms with the house entrance curve. Vermillion stroke (%23c13d1e) on paper surfaces, turmeric stroke (%23dda640) on coal. Use it for nav links and card CTAs; do not use it on body-copy links.
- **Pull the thread:** The case study CTA label, always. Turmeric on coal, bold, with a → arrow that translates 6px on hover while the thread underline scribbles in. Never revert to "Read more" or "View case study."
- **Ritual scene (hero SVG):** viewBox 0 0 520 660. Layers in paint order: spiral (masked out of the eye lens via `#lensMask`), spiral echo, flame petals (13, fan-unfold entrance, rotating from `--a - 85deg`), sketch lids (3 passes per lid at widths 2.6/2.0/1.5 and opacities 0.9/0.5/0.32), jittered ink iris (26 strokes, hollow centre), hand-drawn centre ring, warp threads hanging from the lower lid, two turmeric wefts. Petal gradients run dark at the broad outer end to light at the tip, with a mid stop for a long smooth ramp. Petal outlines are 1.1px ink. Veins are tapered brush-stroke shapes in paper at 0.45 opacity. Do not regenerate this scene with perfect geometry; the wobble and jitter are the point.
- **Provenance stats:** Gloock numbers over uppercase labels: 6 yrs in design, 21,000+ hospitals served, 3+ yrs high-stakes InsurTech. Never inflate these and never add a stat that a case study cannot back.
- **Case cards:** Thumbnail SVG or treated product imagery carrying the colour; tags as 1px-bordered pills; Gloock title; one-to-two sentence description in `--coal-soft`; Pull the thread CTA. Hover: card lifts -4px, border brightens, image scales 1.03.
- **Peer quotes:** Long paragraphs in body font, weight 400, 1.05rem (lead 1.2rem), line-height ~1.7, with bolded phrases for scanning. Oversized Gloock vermillion open-quote mark. Caption: bold name over uppercase designation. The current quotes are PLACEHOLDERS written during design; they must be replaced with real attributed quotes before launch. Never fabricate an attributed quote.
- **Footer:** Coal. Gloock closing quote ("Still digging. Still questioning. Still building. A seeker never stops.", with the last sentence in vermillion italic), large email link underlined in turmeric, vermillion resume button, socials (LinkedIn, GitHub, Dribbble, Medium) with turmeric ↗, phone and location. Email, phone, and all URLs are placeholders to be filled.

## 9. Copy and voice rules

These are absolute for any copy written in this project:

- Never use em dashes. Use commas, colons, or restructure the sentence.
- Never use contractions or shortened forms. Write "do not," "I am," "it is."
- Voice: confident, warm, direct, a little literary. Claims are specific and provable. Personality is welcome; preciousness is not.
- The phrase "do something Shabnam to it" is social proof and lives in the lede and the lead peer quote. Do not promote it back into a headline.
- Never overstate shipment status. CodeRight and DocuSense are designed but not shipped. BenefSnap is live at 270 hospitals. Auto Reconciliation is live at 24 hospitals. If unsure whether something shipped, ask.
- WiseWoman: the case study may cover design process, product philosophy, and evaluation approach. Keep the framing as an independent end-to-end project; do not add employer-comparative claims or commercial framing.

## 10. Accessibility and quality bar

- Interactive elements get visible focus: 2px vermillion outline, 4px offset.
- Decorative SVGs are `aria-hidden="true"`. The role roller exposes its full word list via aria-label on a static wrapper.
- Contrast: body text must pass AA on its surface. Check turmeric and vermillion usage on coal for anything below display size.
- Every animation added anywhere must have its final state declared in the reduced-motion block.
- Semantic structure: one h1 per page, sections with headings, nav landmarks labelled.
- Keep the site dependency-free: no frameworks, no animation libraries. Hand-rolled CSS animation and vanilla JS only. The only external requests are Google Fonts and the logo image.

## 11. Extending the site

When building new pages (case studies, About, Writing):

- Case study pages: coal background throughout, paper text, turmeric interactive accents. Open with a Gloock title and a short lede, then let real product imagery carry colour. Reuse the ribbon as section divider. End with a Pull the thread link to the next case study.
- Case study content structure Shabnam favours: ground truths first (research, who she talked to, what was actually true), then reframing, then design decisions with reasoning, then build and ship detail, then measured outcomes. Depth over gloss.
- About page: this is where the person appears. Use a real photograph here. Cover Malabar origins, the NGO work that opened her interest in human psychology, the research-first practice, and the seeker identity. The hero illustration stays symbolic; the About page is human.
- Do not introduce new symbols, new fonts, new hues, or new interaction patterns without checking against section 2. If a new page seems to need something outside this system, the correct move is to compose existing symbols differently, not to invent.
- File hygiene: the logo PNG must ship alongside pages that reference it; prefer converting the logo to an inline or external SVG with transparent background, plus a light variant for coal surfaces.

## 12. Known open items (do not silently resolve)

- Replace placeholder peer quotes with real, permission-obtained quotes and names.
- Replace placeholder email, phone, resume link, and social URLs.
- Produce a transparent SVG logo and a light-on-coal logo variant.
- Real case study imagery to replace the placeholder SVG thumbnails, colour-treated to keep one dominant field colour per project.
- Decide illustration versus photograph balance once the About page exists.
