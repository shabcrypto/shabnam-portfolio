# Shabnam Raghavan Portfolio — Design Context

This file is the source of truth for extending this portfolio. Read it fully before writing any code, copy, or layout. Every decision below was made deliberately; do not "improve" the system by flattening it into generic portfolio conventions. When in doubt, ask which symbol or rule applies rather than inventing a new one.

Reference implementation: `index.html` (home page). All tokens, timings, and patterns below are extracted from it. This file was substantially revised after a coconut/asphalt palette and Satoshi/Manrope typography redesign; §3, §4, §5, §7, §8, and §11a supersede the original v10 hero-shabnam build this doc used to describe.

**Upkeep rule:** this file is `design-context.md` (renamed from `design-context_1.md` on 2026-09-13). Whenever a case study page changes or a new one is added, update §11b in the same piece of work. §11b is verified against the rendered pages. Some index-only sections (§4 typography, §5 layout, §8 components) predate the Staatliches redesign and are stale, so check `index.html` before relying on them.

---

## 1. Who this portfolio belongs to

Shabnam Raghavan. Product designer, 6 years in design, 3+ in high-stakes health InsurTech (IHX, acquired by Perfios). Work shipped to 21,000+ hospitals across India, the GCC, and Kenya. Positioning: a generalist who asks the right questions. Roles: Product Thinker, Designer, Builder, Strategist. She designs end to end, from research through strategy through deployed code. Currently working at IHX.

She is from the Malabar region of Kerala, the land of lords and looms: Theyyam ritual performance and handloom weaving. She has a deep interest in human psychology. Colleagues at IHX say "do something Shabnam to it" when work needs depth. She identifies as a seeker: meticulous, accountable, resilient, ever learning.

## 2. Design philosophy

The entire visual system is one story told in symbols. Every element must trace back to one of these. Do not add decorative elements that do not belong to this vocabulary.

- **Theyyam (ritual, fire):** The flame petal halo. Represents transformation and intensity of craft. Where she is from, craft and devotion are the same word.
- **The loom (Malabar handloom):** Warp and weft threads. Represents research woven into product: many threads become one cloth. Appears in the illustration scene, the intro animation, the ribbon divider, and the hover underlines.
- **The spiral:** A hand-drawn winding journey inward. Represents self-knowledge and the seeker. It draws itself from the outside in.
- **The eye of truth:** Observation, the designer's key trait. Ground truths. Raw sketch linework, never a hard outline. The iris strokes never meet; a hand-drawn ring holds a circle of stillness at the centre.
- **Red (vermillion) is shakti:** Insight, spirit, inner strength. Use it very sparingly and meaningfully: it is an accent of power, not a decoration, not a fill. The circle is the universe and nothing at once.
- **The open corners of the logo:** Ever-expanding, the seeker never stops.

Governing aesthetic rules:

- The page stays quiet; the work carries the colour. Page chrome is coconut and asphalt (see §3). Saturated colour lives inside case study imagery and the symbolic accents only. Vermillion is the sole sparing accent on light surfaces; there is no longer a second "always-on" accent color threaded through page chrome the way turmeric once was on coal — turmeric is now reserved for the illustration's own symbolic palette and for accents that must sit on a dark (asphalt) surface, such as the footer.
- Rawness over polish in illustration: hand wobble, layered sketch passes, jittered strokes. Precision lives in typography, spacing, and motion timing instead.
- No fills in the spiritual zone (spiral, eye, iris): ink strokes only.
- Boundaries in immersive moments (intro) are expressed through gradients and drawn lines, never harsh strokes or hard-edged shapes.

## 3. Design tokens (index.html)

Copy these exactly.

```css
:root {
  --coconut: #fdfdfb;         /* page card background, everywhere (was #f0ede5) */
  --coconut-deep: #f4f3ef;    /* card surface and recessed placeholders (was #e6e2d7) */
  --coconut-soft: #b3ada0;    /* secondary text ON a dark (asphalt) surface, e.g. footer */
  --asphalt: #302f2c;         /* primary text, linework, and the one dark surface (footer) */
  --asphalt-soft: #6b6964;    /* secondary text on coconut */
  --vermillion: oklch(52% 0.185 33);      /* shakti red: the sole sparing accent */
  --vermillion-deep: oklch(44% 0.17 31);  /* hover state of vermillion */
  --turmeric: oklch(72% 0.13 82);         /* gold: illustration's own symbolic colour */
  --turmeric-deep: oklch(54% 0.125 78);   /* thin turmeric strokes that need contrast on coconut */

  --space-xs: 8px;  --space-sm: 12px;  --space-md: 24px;
  --space-lg: 48px; --space-xl: 96px;

  --font-display: "Satoshi", sans-serif;
  --font-body: "Manrope", sans-serif;
}
```

`--paper`, `--paper-deep`, `--ink`, `--ink-soft`, `--coal`, `--coal-soft` are retired on index.html. There is no dark "coal" page-chrome surface anymore — the intro, hero, and every section down to Featured Work and peer quotes now sit on `--coconut`. The **only** dark surface left on the home page is the footer, which is `--asphalt` deliberately (see §8).

Colour usage rules:

- Coconut dominates everywhere; asphalt is ink/text/linework; vermillion is the 10 percent accent, used sparingly (never as a large fill — buttons, CTA badges, and card panels use asphalt or coconut as their base, with vermillion reserved for small marks: bullets, the emphasis word in the h1, hover states, the "evidence over applause" phrase).
- The footer is the one place asphalt is a *background*. On it, use `--coconut`/`--coconut-soft` for text and `--turmeric-deep` for the small accent role (social-link arrows) — this revives turmeric's original "accent on a dark surface" job now that the footer is the only surface where it applies.
- Never introduce new hues into page chrome. Case study thumbnails may each own one saturated field colour (teal, indigo, plum are in use) with vermillion threaded through as a sparing accent.
- `--turmeric` itself (not `-deep`) is reserved for the illustration's own symbolic palette (flame petals, its gold gradient stops) — leave those as-is; the `-deep` variant exists specifically for thin strokes/accents that need to read against coconut.

## 4. Typography

**index.html only.** About.html's body copy and the three case study pages keep their own independent type systems (Gloock/Alegreya Sans for about.html's prose; each case study's own established Satoshi/Manrope pairing) — see §11a for what *is* shared across pages (nav, footer) versus what stays independent.

- Display: **Satoshi**, weight 700 for section headings, the footer quote, and most emphasis; weight 900 for the hero h1 (the whole headline is one weight now, not a mixed 700/900 — the vermillion-coloured phrase is differentiated by colour alone, no italic, no underline). Never rely on Gloock/serif on this page anymore.
- Body: **Manrope** 300–800. Long-form reading, UI labels, captions, nav links.
- Labels and eyebrows: Manrope or Satoshi depending on component (small caps, uppercase, letter-spacing 0.12em–0.18em, sizes 0.72–0.85rem) — see each component's own rule in §8, they are not perfectly uniform.
- Hero h1: `clamp(2.4rem, 5.2vw, 4.4rem)`, weight 900, line-height 1.14, text-wrap balance, centered (not left-aligned — see §5).
- Emphasis inside display headlines: vermillion colour only. No italic (Satoshi's italic is a humanist cut that reads oddly against this geometric system), no hand-drawn underline squiggle (removed on request — colour alone carries the emphasis now).
- Satoshi is loaded via Fontshare (`f[]=satoshi@400,500,700,900`); Manrope via Google Fonts (`family=Manrope:wght@300;400;500;600;700;800`). Do not add further font families to index.html.

## 5. Layout system

- Content sections cap at 1200px, centred, with 60px horizontal padding on desktop and 24px on mobile (below 900px).
- The page is coconut end to end except the footer (asphalt). There is no more paper/coal alternation — Selected Work and peer quotes, which used to be forced white in an earlier light-theme pass, are coconut too now, matching the rest of the page.
- The woven ribbon divider (14px repeating-linear-gradient of vermillion, turmeric, asphalt stripes) still marks the seam before Featured Work. Reuse it as the standard section transition.
- **Hero is a single centered column**, not a two-column grid. `justify-content: center` (not top-pinned) so the whole content block — eyebrow, h1, location line, provenance stats, and the "See the work" CTA row — sits vertically centered in a full `100svh` section, with a small deliberate downward bias via asymmetric top/bottom padding (top padding is larger than bottom). The hero background carries a faint handloom grid via two repeating-linear-gradients of asphalt at low opacity (rgba(48,47,44,0.045) and 0.03), 56px cells — this was removed once and explicitly reinstated ("to add depth"); keep it.
- The large hand-drawn illustration ("the ritual scene," ×see §8) is **not in the hero anymore**. It lives in a below-the-fold section (`#vantage`) as a two-column layout: the illustration on the left with `position: sticky` (stays pinned while the right column's much longer text scrolls past it), and a single flowing right-hand column running Design Philosophy → inspiration → Design Process → the four process steps (see §8's Vantage section entry).
- Case grid (Featured Work): one wide card (image 58%, body 42%, horizontal) followed by two half-width cards, plus a "coming soon" card. Cards have `border-radius:16px`, a soft drop shadow, and — new — a two-tone split: the image half stays photographic, the copy half (`.case-body`) is a solid **asphalt** panel with coconut text and a turmeric "Pull the thread" CTA (this is the one place besides the footer where asphalt is used as a fill, deliberately, for contrast against the surrounding coconut section).

## 6. Motion system

Motion is choreography, not decoration. Principles in force:

- Entrances decelerate: `cubic-bezier(0.22, 1, 0.36, 1)` is the house entrance curve. Exits accelerate: `cubic-bezier(0.5, 0, 0.75, 0)` family. Long immersive draws use `cubic-bezier(0.45, 0, 0.3, 1)`.
- Cause and effect: every beat is born from the previous one. No dead air between an action and its consequence; overlap entrances with prior exits.
- Drawn-line entrances: SVG paths reveal via stroke-dasharray/stroke-dashoffset with the dasharray set to the actual path length. The spiral must always draw from the outside inward.
- **Two separate timing systems now exist, do not conflate them:**
  - `--intro-offset` (4800ms) still gates the hero's own load-triggered stagger (eyebrow, h1, location, provenance, the CTA row) — everything that should appear once, right after the intro curtain rises. Hero stagger order: eyebrow +100, h1 +220, location +340, provenance +460, CTA row +600 (relative to `--intro-offset`).
  - `--ritual-offset` (defaults to `9999s`, parked) gates the illustration's own internal choreography (petals, spiral, iris, threads, wefts, caption — same relative offsets as before, just re-zeroed). It is set to `0ms` by an `IntersectionObserver` the first time `.vantage-scene` scrolls into view, once only (`unobserve` after firing). **Every CSS rule that animates a piece of the illustration must reference `--ritual-offset`, not `--intro-offset`** — a past bug shipped with several of the illustration's *class-based* rules (`.spiral`, `.spiral-echo`, `.wash`, `.stipple`, `.iris-g`, `.ritual-caption`) still wired to `--intro-offset` after the scene moved out of the hero, so parts of it animated on page load instead of on scroll. Only the inline per-element `style="animation-delay"` attributes had been correctly renamed. Check both when touching this scene again.
- **Scroll-linked text reveal ("reveal-quote"):** a newer pattern, distinct from the entrance stagger above. Any paragraph that should brighten into full contrast as the user reads down the page gets its words individually wrapped in `<span class="rv-word">`, starts at `opacity: 0.2`, and a shared script drives them. When multiple `.reveal-quote` blocks sit inside one container (currently: philosophy quote, inspiration line, process statement, and the four process steps, all inside `.vantage-write`), they are **not** independently triggered by each block's own viewport position — that made nearby blocks reveal almost simultaneously. Instead one shared scroll-progress value for the whole container is divided into non-overlapping, word-count-weighted segments in DOM order, so each block only starts revealing once the previous one has fully finished. This is the pattern to extend if more reveal-quote blocks are added: register the element with class `reveal-quote`, wrap its text in `rv-word` spans, and it is picked up automatically (segments are computed from `.vantage-write .reveal-quote`, no per-element JS needed).
- Micro-interactions: 160ms colour transitions, 200 to 320ms transforms, hover lifts of -2px to -4px. Nothing elastic, nothing bouncy. Two infinite loops now exist by design: the role roller (below) and the "See the work" badge's rotating text ring + bouncing arrow (§8) — both intentionally continuous, not one-shot.
- The role roller: unidirectional vertical loop (Designer, Thinker, Builder, Strategist), 9s cycle, holds each word then glides, loops through a duplicated first word for seamlessness. Uses `cubic-bezier(0.65, 0, 0.35, 1)`.
- `prefers-reduced-motion: reduce` is a hard contract: kill all animations and transitions, hide the intro entirely, hand-set every final state (opacities, dashoffsets to 0, petal rotations to `var(--a)`, roller to first word, `.rv-word` opacity to 1), and the scroll-triggered scripts (`fitBadgeRing`'s font-fit aside, which always runs) short-circuit at the top via `matchMedia("(prefers-reduced-motion: reduce)")` so the JS-driven reveals never even attach their scroll listeners. Every new animated element MUST be added to this block.

## 7. The intro

**The intro is light now, not dark.** It plays on a `--coconut` canvas (previously `--coal`) — this was a deliberate palette-wide decision, not a one-off. Three warp threads draw down (centre one vermillion, the other two now **asphalt**, not paper-on-dark), a turmeric-deep weft weaves across (bumped from plain turmeric for contrast against the light background), a hand-drawn vermillion ring encircles the loom, and the name resolves in asphalt (this used to be a light-gold literal tuned for a dark background — it would go invisible against coconut if ever reverted without also flipping this colour back).

Non-negotiable protections, keep in any revision:

- Click anywhere to skip: sets `--intro-offset` to 0ms on the document element and removes the intro node.
- sessionStorage guard (`shab-intro-seen`): the intro plays once per session; internal navigation must never replay it. Wrap storage access in try/catch and play the intro if storage is unavailable.
- A cleanup `setTimeout` removes the intro node after the animation completes.
- Reduced motion hides the intro completely.
- The intro is `aria-hidden="true"`; it must never trap focus or block assistive tech.

The intro is long by UX standards. That is a conscious trade-off already made. Do not lengthen it further, and do not add an intro to any page other than the home page.

## 8. Component inventory and rules

- **Topbar:** Text wordmark ("Shabnam Raghavan," Satoshi 700), not a logo image. Nav: Work, About me, Resume, Contact me. This is shared chrome — see §11a, its font (Satoshi wordmark / Manrope links) and colour (asphalt / asphalt-soft) are now synced across index.html, about.html, and all three case studies, even though each page keeps its own background colour. Hover reveals the woven thread underline (below).
- **Woven thread underline:** The signature hover. An ::after element, height 8px, background of a repeating data-URI SVG squiggle (`M0 4 Q 6 0.5 12 4 T 24 4`, 24x8 tile, stroke-width 2, round caps), revealed by scaleX(0) to scaleX(1) from the left over ~300ms with the house entrance curve. Vermillion stroke on coconut surfaces, turmeric on asphalt (footer). Use it for nav links and card CTAs. "The longer story" link (hero) is the one exception with a *persistent* plain 1px underline at rest that transitions into this same weft-squiggle on hover, rather than starting invisible — that pattern (permanent line → weft squiggle on hover) is available for any other link that should read as "always underlined, decorated on hover."
- **Pull the thread:** The case study CTA label, always. Now sits inside an asphalt card panel (see §5) — turmeric, bold, with a → arrow that translates 6px on hover while the thread underline scribbles in (turmeric-coloured squiggle to match, not vermillion, since it's now on a dark panel). Never revert to "Read more" or "View case study."
- **"See the work" badge (hero CTA):** Replaces what used to be a pill button. A small monochrome circle (asphalt) with a bouncing arrow at its centre and "SCROLL TO SEE MY WORK • SCROLL TO SEE MY WORK •" rotating around it on an SVG `textPath`, no red anywhere on it. The ring's radius is fixed (`R = 38` in a 100-unit viewBox) and **the font-size is solved for at runtime**, not hardcoded: a script measures the text's actual rendered length via `getComputedTextLength()` and computes the font-size that makes it fill the ring's circumference, then applies an 18 percent overfill multiplier on top. That overfill is load-bearing, not a mistake: text following a tight curve consumes measurably more arc-length than its flat `getComputedTextLength()` predicts, so an "exact" fit reliably leaves a visible gap in the loop; overshooting on purpose closes it with a slight, invisible overlap instead. If the badge's copy ever changes again, nothing needs to be retuned by hand — the script re-solves for the new string automatically. Sits in a `.cta-row` alongside "The longer story," vertically centered against each other via a shared flex row (not against the whole hero).
- **Ritual scene (illustration SVG):** viewBox 0 0 520 660. Layers in paint order: spiral (masked out of the eye lens via `#lensMask`), spiral echo, flame petals (13, fan-unfold entrance, rotating from `--a - 85deg`), sketch lids (3 passes per lid), jittered ink iris (26 strokes, hollow centre), hand-drawn centre ring, warp threads hanging from the lower lid, two turmeric-deep wefts (bumped from plain turmeric — see §3). Petal outlines are asphalt (was ink). Do not regenerate this scene with perfect geometry; the wobble and jitter are the point. **It no longer lives in the hero** — see §5 and the Vantage entry below for its new home and its scroll-triggered (not load-triggered) animation, and see §6 for the `--ritual-offset` timing system.
- **Vantage section (`#vantage`):** The below-the-fold section replacing what the illustration's old hero slot used to be. Two columns: the sticky illustration (left) and a single right-hand column (`.vantage-write`) running, in strict order: **Design Philosophy** (dot-prefixed eyebrow + a large `philosophy-quote`-styled statement, currently "I notice what others walk past...", with `evidence over applause` in vermillion) → the "My design inspiration..." line, set close beneath it, same reveal treatment, smaller/secondary colour (`--asphalt-soft`) → a visual gap → **Design Process** (its own dot-prefixed eyebrow) → a second `philosophy-quote`-sized statement ("There is no one size fits all process...") → four numbered steps, each with a title and description, all sharing the same word-by-word reveal mechanic. All of this — quote, inspiration, process statement, and all four steps — is driven by one shared sequential scroll-timeline; see §6.
- **Provenance stats:** Satoshi numerals over uppercase labels, single line each (numeral + label inline, not stacked): "3 Yrs in high-stakes UX," "3 core products shipped," "1M monthly users impacted." Lives in the hero now, directly below the location line. Never inflate these and never add a stat that a case study cannot back.
- **Location line:** "Currently working at IHX" (hero). "Bangalore, via the Malabar Coast" moved to the About page's own location line beneath its h1, which no longer repeats "Malabar Coast" in the headline itself — that redundancy was deliberately removed.
- **Case cards:** See §5 for the asphalt copy-panel treatment. Thumbnail or product imagery on one side carrying the colour; tags as pills; Satoshi title (coconut, on the dark panel); one-to-two sentence description in `--coconut-soft`; turmeric "Pull the thread" CTA. Hover: card lifts -4px, border brightens, image scales 1.03.
- **Peer quotes:** Long paragraphs in body font, weight 400, 1.05rem (lead 1.2rem), line-height ~1.7, with bolded phrases for scanning. Oversized Satoshi vermillion open-quote mark. Caption: bold name over uppercase designation. On coconut now, not white/coal. The current quotes are PLACEHOLDERS written during design; they must be replaced with real attributed quotes before launch. Never fabricate an attributed quote.
- **Footer:** **Asphalt** — the one deliberate dark surface left on the page (previously coal, briefly white, now asphalt again). Satoshi closing quote ("Still exploring. Still building."), large coconut email/phone links (vermillion on hover — large enough that vermillion's contrast on a dark surface is acceptable per the original rule), socials (LinkedIn, GitHub, Dribbble, Medium) in coconut-soft with a turmeric-deep ↗, a woven-thread divider, then "Built by..." and location. This exact markup, copy, and styling is now **byte-identical shared chrome across all five pages** (index, about, and all three case studies) — see §11a, this is new and is a deliberate override of the older "case studies never share index's colours" rule.

## 9. Copy and voice rules

These are absolute for any copy written in this project:

- Never use em dashes. Use commas, colons, or restructure the sentence.
- Never use contractions or shortened forms. Write "do not," "I am," "it is."
- Voice: confident, warm, direct, a little literary. Claims are specific and provable. Personality is welcome; preciousness is not.
- The phrase "do something Shabnam to it" is social proof and lives in the About page and the lead peer quote. Do not promote it back into a headline.
- Never overstate shipment status. If unsure whether something shipped, ask.
- Hero headline is "A generalist who asks the right questions." (shortened from an earlier "...who digs deeper and asks the right questions" — do not restore "digs deeper" without being asked).
- WiseWoman: the case study may cover design process, product philosophy, and evaluation approach. Keep the framing as an independent end-to-end project; do not add employer-comparative claims or commercial framing.

## 10. Accessibility and quality bar

- Interactive elements get visible focus: 2px vermillion outline, 4px offset.
- Decorative SVGs are `aria-hidden="true"`. The role roller exposes its full word list via aria-label on a static wrapper.
- Contrast: body text must pass AA on its surface. Check turmeric-deep and vermillion usage on the footer's asphalt background for anything below display size.
- Every animation added anywhere must have its final state declared in the reduced-motion block, including any new `.rv-word` scroll-reveal text (opacity: 1).
- Semantic structure: one h1 per page, sections with headings, nav landmarks labelled.
- Keep the site dependency-free: no frameworks, no animation libraries. Hand-rolled CSS animation and vanilla JS only. External requests are Google Fonts, Fontshare (Satoshi), and product screenshot/video assets.

## 11. Extending the site

When building new pages (case studies, About, Writing):

- Case study pages: share index's surfaces exactly (page card, card surface, shadow, no strokes; see §11b) and keep only their own accent colour (see §11a). Nav and footer are the deliberate exceptions (shared chrome, see §11a). Open with a title and a short lede, then let real product imagery carry colour. Reuse the ribbon as section divider. End with a Pull the thread link to the next case study.
- Below the fixed hero block (§11c), a case study's structure is its own: section order, layout, how many sections and how many assets are chosen per case study. "Ground truths first, then reframing, decisions with reasoning, build and ship, measured outcomes" is a habit Shabnam often uses, not a template to enforce. Depth over gloss.
- About page: this is where the person appears. Use a real photograph here. Cover Malabar origins, the research-first practice, and the seeker identity. Its own location line now lives beneath its h1 (see §8); the hero illustration stays symbolic on index.html, the About page is human.
- Do not introduce new symbols, new fonts, new hues, or new interaction patterns without checking against §2. If a new page seems to need something outside this system, the correct move is to compose existing symbols differently, not to invent.

## 11a. Correction: what's shared across pages versus what's independent

This section has been revised twice now. Current state:

- **Case study backgrounds are no longer independent: they match index exactly, see §11b.** Accent colour is shared *within* a project family, not per-page: TPA Ops, User Management, and AI-Enabled Features are all IHX case studies and all use the exact same indigo/teal (`#3C3ADA`/`#6E6CF0`/`#00B894`/`#046A50`); WiseWoman is a separate project and keeps its own purple. Do not give a same-family case study (e.g. a future second WiseWoman-style page) its own distinct hue by default — confirm which family it belongs to first. All four case studies are light-themed (coconut-toned backgrounds, ported from index's palette specifically for their neutral gray ramp — this was a deliberate later pass, see the case-study-light-theme-spec memory for the exact ramp) but each keeps its own saturated accent hue independent of the others and of index.html's vermillion. Do not replace a case study's own accent with vermillion to "match the home page."
- **Two pieces of chrome ARE now byte-identical shared chrome across all six pages** (index, about, and all four case studies): the **top nav** (wordmark font/weight/colour, nav-link font/colour — only each page's own hover accent colour is allowed to differ) and the **footer** (full markup, copy, and the asphalt/coconut styling — no per-page variation at all, not even accent colour; even the "Other Case Studies" grid and its `.cs-go` CTA already used vermillion as chrome, not each page's own hue, before this pass). This is new and deliberately overrides the older, stricter "case studies never share index's colours" rule for these two specific components. Everything else on a case study page — hero, body sections, cards, data visualisations — stays independent.
- **AI-Enabled Features at the Point of Failure** (`ihx-ai-features-case-study.html`) has no real screenshots yet — every screen reference uses the existing `.video-slot`/`.img-slot` fallback pattern (dashed placeholder + expected filename), consistent with its "designed / in development" status rather than pretending finished visuals exist. Its hero also has no single screenshot to frame (four features at four different stages), so the hero's right column is a `.status-card`/`.status-row`/`.status-pill` component (new, not shared with other case studies) listing each feature's ship status instead of a framed screen.
- **Typography/structure is worth porting more broadly than colour is.** Font-family choices, font sizes, spacing scale, component layout (tag-pills-above-title, card grid structure, hover-underline mechanics) can be ported from index.html into a case study while keeping the case study's own colour variables — this was always true and still is.
- If a future request says "make the case study consistent with the home page," confirm whether that means nav/footer chrome (yes, already the standard), typography/layout (usually yes), or the page's own content-area colour (no, unless explicitly re-confirmed) before touching any accent-colour value.

## 11b. Case study surface system (verified 2026-09-13)

Applies to every case study: `ihx_tpa_ops_.html`, `ihx-user-management-case-study.html`, `ihx-ai-features-case-study.html`, `wisewomen-case-study.html`, and any new one. Checked against computed styles in a rendered browser, not only the CSS source. Update this section whenever a case study changes.

**Page**
- `body` is `--asphalt` `#302f2c`. Content sits in one `.page-card` inset by `--frame` (`clamp(16px, 2vw, 28px)`) with radius `--frame`. The footer stays outside the card, full bleed.
- `.page-card` background is `#fdfdfb`, identical to index. No grid texture on case studies (index keeps its grid; case studies had it removed on request).
- Sections inside the card are transparent. No alternating tinted bands; the hairline `border-top` between sections carries the rhythm.

**Tokens (copy exactly into a new case study's `:root`)**
```css
--coconut: #fdfdfb;        /* page card */
--coconut-deep: #f4f3ef;   /* card surface, matches index .dp-card */
--ground: #f4f3ef;         /* recessed surfaces: placeholders, small badges */
--card-bg: #f4f3ef;
--row-bg: #f4f3ef;         /* rows nested inside a card; dividers carry the structure */
--shadow-card: 0 1px 2px oklch(26% 0.021 42 / 0.04), 0 14px 36px oklch(26% 0.021 42 / 0.06);
```

**Cards (any content panel: tl;dr, stats, personas, decisions, outcomes, callouts, flow nodes)**
- No stroke around a card: `border: none`.
- One drop shadow: `var(--shadow-card)`, the same value index uses on `.dp-card`.
- Surface is `var(--card-bg)` (`#f4f3ef`). Never hardcode a hex for a card fill. Hardcoded `#f0ede5` fills are what left cards off-system before.
- Intentional exceptions that stay:
  - Accent-tinted cards keep their tint (ops indigo `rgba(60,58,218,0.06)`, WiseWoman lilac `rgba(139,92,246,0.05)`), still with no stroke and with the shadow.
  - Accent rules are markers, not outlines: a 3 to 4px left border on callouts (`.callout`, `.synthesis`, inline accent callouts on ops).
  - Dividers between cells inside a card stay (the 1px gap-grid in `.hero-stats` and `.stat-grid`, row borders).
  - Elements that sit on top of a card (`.outcome-note`, `.tnode`) take no shadow of their own.
- Media frames (screenshots, video, demo slots) keep a 1px hairline plus the shadow, matching index's `.case-img`. Dashed borders mark missing-asset placeholders (`.video-slot`, `.img-slot` before its image loads) and go away once the asset is added.

**Hero tags (every case study has them)**
- A row of chips sits directly above the title: `<div class="meta-row hero-tags-top">` with `<span class="chip">` children. Same markup and same style on all four pages; no accent-coloured chip.
- Chip: Manrope 700, `.75rem`, sentence/title case (not uppercase), padding `6px 14px`, radius `100px`, border `1px solid rgba(20,18,14,0.08)`, text `#5B5449`, background `var(--card-bg)`. Row gap `10px`, `18px` below the row, title `margin-top: 0`.
- Content: 4 chips. First is the project family ("IHX Case Study"), then domain/type tags. Current sets: Ops `IHX Case Study · B2B SaaS · WebApp · Health InsurTech`; User Management `IHX Case Study · B2B SaaS · Health InsurTech · User Management`; AI `IHX Case Study · AI Product · Health InsurTech · Applied AI`; WiseWoman `FemTech · MVP · B2C UX · AI Native`.
- The style lives in the shared title override block (next to the `h1` rule) with literal colours, because not every page defines `--border`.

**Typography (audited 2026-09-13)**
- Two faces only. **Staatliches** (weight 400, tracking about 0.02em, never negative) for display: titles, section headings, card titles at 20px and up, big numbers, pull quotes. **Manrope** for everything else: body, captions, labels, table heads, small bold labels. No Satoshi, Gloock or monospace anywhere on a case study, and their font `<link>`s are removed.
- Every `font-size` is a token from index's scale, copied into each case study's `:root`: `--step--1` 0.78 to 0.88rem, `--step-0` 1 to 1.125rem, `--step-1` 1.15 to 1.4rem, `--step-2` 1.5 to 2.4rem, `--step-3` 2 to 3.6rem, `--step-4` 2.3 to 4.8rem, `--step-5` 2.7 to 6.4rem. `em` sizes inside a number (a unit like "hrs") are the only relative exception.
- Roles, identical on every page: `h1` step-4; section `h2` step-3; `h3` step-1; hero metric numbers step-2; body and intros step-0; card copy, labels, eyebrows, captions step--1. Everything else snaps to the nearest step: under 15px step--1, 15 to 20 step-0, 20 to 30 step-1, 30 to 48 step-2, 48 to 67 step-3, 67 to 90 step-4, 90 and up step-5.
- `font-synthesis-weight: none` on the page, so Staatliches is never faux-bolded.
- `body` font-size is `var(--step-0)`, so text that inherits its size is on the scale too. `code` (placeholder file paths) uses Manrope, not monospace.
- Shared chrome must not name a face the page does not load. When the Satoshi link was removed, the footer email and phone fell back to a generic sans; they now match index exactly (Manrope 500, step-0).
- The metric card resets `.tag` (`padding: 0; border: 0; border-radius: 0; background: none`) because some pages also define a global `.tag` pill that would otherwise box the corner label and push it into the number.
- Shared nav, Other Case Studies grid and footer are excluded from this audit; they already match index.

**Titles**
- `h1` is Staatliches 400, tracking 0.02em, size `var(--step-4)`, line-height 1 on every page (enforced with `!important`, because the Ops title is styled inline and inherited the body's 1.6).
- Inline `style=""` attributes must use single quotes for font names (`font-family:'Manrope', sans-serif`). Double quotes close the attribute and silently drop every declaration after them; this happened once on Ops and lost the title's line-height.
- No decorative hero image on Ops: the faint laptop illustration next to the title was removed on request, and the Ops hero is a single column. An emphasis span in a title (`.serif`, `.accent`) changes colour only, never font, weight or style, the same as index's headline.

**Hero metrics (every case study has them)**
- One component, taken from User Management: `<div class="hero-stats">` with three `.cell`s, each `<span class="tag">` (corner label) + `<div class="num">` + `<div class="lbl">`. Three cells, always.
- Style: grid of 3 with 1px dividers (`gap: 1px` over `rgba(20,18,14,0.08)`), no outer stroke, radius 16px, `--shadow-card`, cells on `--card-bg`, padding 24px 20px. Tag Manrope 800 step--1 uppercase top-right; number Staatliches step-2 in the page's accent (`.accent`/`.indigo` #3C3ADA, `.teal` #046A50, `.violet` #7C3AED), 28px below the top so a tag never collides with it; label Manrope 600 step--1. One column under 900px. The CSS lives in the shared override block, identical on every page.
- **Order is fixed: project info row first, then the metric card**, both full width directly under the hero copy (under the hero row on two-column heroes). Never put metrics above project info.

**Project info (every case study has it)**
- `<div class="project-info">` with four `<div class="pi"><span class="pi-l">Label</span><span class="pi-v">Value</span></div>` items, immediately followed by `.hero-stats`. On Ops both sit in one `.page-inner` so their edges align.
- Style: 4-column grid, gap `24px 32px`, `margin-top: 44px`, `padding-top: 24px`, `border-top: 1px solid rgba(20,18,14,0.08)`. Label Manrope 700 step--1 uppercase, tracking .14em, `#5F584F`; value Manrope 600 step--1, `#5B5449`. The metric card after it takes `margin-top: 32px`. Two columns under 900px. CSS lives in the shared override block.
- Fields: Ops `Role · Team · Timeframe · Also Covered`; WiseWoman `Role · Timeframe · Stack · Type`. User Management and AI Features have the CSS but no row yet: the pages do not state role, team or timeframe, so those facts must come from Shabnam, not be written in.
- Numbers must already be backed by the case study. Current sets: Ops ↑67% revenue per claim, 3.23 → 1.56 min time on task (51% reduction), 3 group hospital contracts; User Management 80 → 10 tickets/day, 30 → 10 min to create, 4 → 1 deactivate steps; AI 1.8 to 2L/mo diagnosis entries, +37% delay cost, 12 to 48h stuck queries; WiseWoman 5 days to a live MVP, 6 AI functions, Live with real users.

**WiseWoman section 06, Experience Strategy & Interaction Design (rebuilt 2026-09-13 to Shabnam's reference layout)**
- The section is exactly four blocks, in order: (1) header, `.sec-head` title left and `.exp-intro` paragraph right; (2) "Branding and Colours": label, one-line note, then the app icon tile beside a row of 7 swatches (2 purples, 1 near-white, 4 darks); (3) logo on mobile (tall 4:5 image) beside a column holding the cycle symbol tile, the "Cycle Symbol in the app logo" label and its paragraph; (4) "Intentional Onboarding Design" h3 and paragraph beside the onboarding screen image. The old swatch strip, moon SVG note, the four screen cards and the walkthrough video slot were removed on request.
- Copy is Shabnam's verbatim, except one em dash in the onboarding paragraph replaced with a colon.
- Page background is unchanged. Asset tiles (`.exp-asset`) are dark `#141318` because the artwork is made for black; each shows a dashed placeholder with its filename until the file exists, then the dash goes transparent (`:has(img)`).
- Swatches, in order, each labelled with its own hex: `#8B5CF6`, `#B08CF5`, `#F2F2F2`, `#1A1832`, `#181630`, `#252538`, `#29293D`. Tiles are 11:10, radius 8px, label centred; only the near-white `#F2F2F2` tile carries the card shadow.
- The cycle symbol and its "Cycle Symbol in the app logo" note sit together inside one black (`#000`) card, radius 20px, beside the logo-on-mobile image.
- Assets: `images/wisewoman-app-icon.svg` (from `wisewoman logo.svg`, own `#1E1B2E` tile), `images/wisewoman-cycle-symbol.svg` (from `symbolicmage.svg`, transparent, made for the black card), `images/wisewoman-logo-on-mobile.jpg` (1600×1600 web export of the 3000×3000, 15.7 MB `onmobileuilogo.png`). Image slots drop their placeholder chrome once the file loads.
- Onboarding image: `images/wisewoman-onboarding.png` (462×568, copied from `intentional onboarding.png`): a hand holding the onboarding screen on its own black rounded-corner card, transparent only outside the corners. Shown with `object-fit: contain` so it is never cropped; once it loads the slot's own tile goes transparent and the image's black card is what reads, matching the cycle symbol card.

**WiseWoman hero layout**
- Follows §11c: `.hero` is one column. `.hero-copy` (tags, title, lede), then the full-width `.hero-image` slot, then `.project-info`, then `.hero-stats`. The earlier two-column version (photo beside the title) was replaced on 2026-09-13.
- `images/wisewoman-hero.jpg` (1600×1200 export of `heroimage.png`) is no longer used in the hero; the slot now waits for `images/wisewoman-hero-wide.jpg`. Never embed a hero image as base64.

**Shared chrome** (byte-identical across all case studies, see §11a): top nav, Other Case Studies grid, footer.

**Starting a new case study:** copy the tokens above, wrap content in `.page-card`, reuse the shared chrome markup from an existing case study, then run the card check: every content panel has no stroke, has `--shadow-card`, and uses `--card-bg`.

## 11c. What is fixed on every case study, and what is free (set by Shabnam, 2026-09-13)

This is the governing rule for every case study, current and future. It overrides any older wording in this file that implies one shared page structure.

**Fixed: the hero block.** Every case study opens with the same block, same components, same order:

1. Top nav (shared chrome, §11a)
2. Hero tags (chips, §11b)
3. Hero title (`h1`, §11b Titles)
4. Lede (the short intro paragraph under the title)
5. Hero image, **full width, directly below the title and lede**. Until the real image is added, every case study holds this space with the shared `.hero-image` slot: `<figure class="hero-image">` with a `.hi-ph` label, the expected filename in `<code>`, and an `<img onerror="this.remove()">`. 16:9, radius 20px, `--card-bg` with a 1px dashed `rgba(20,18,14,0.18)` border; once the image loads the dash goes transparent and the card shadow applies. CSS lives in the shared override block on all four pages. Hero images are added last, after the rest of a case study is done.
6. Project info row (§11b)
7. Metrics card (§11b)
8. TL;DR (**required on every case study**, directly after the metrics, same design everywhere)

"Info section" and "project info" are the same thing: the row of Role, Timeline/Timeframe and similar project facts (item 6). There is no separate info section.

**Fixed: element and card design.** Every reusable element looks the same wherever it appears: cards (surface, no stroke, shadow, radius), chips, metric cells, image and video slots, labels, headings and type roles, and the shared chrome. If a card exists on a page, it is the §11b card.

**Free: everything below the hero block.** The body of each case study is deliberately subjective: which sections exist, their order, their layout, how many assets, and which visual treatments suit that story. Do not force one case study's body into another's structure, and do not treat differences below the TL;DR as inconsistencies to fix. Build new body sections from the shared elements, laid out however that case study needs.

## 12. Known open items (do not silently resolve)

- Hero image slots: WiseWoman has its full-width placeholder (expects `images/wisewoman-hero-wide.jpg`). Ops, User Management and AI Features still need the placeholder added below the title and lede when each is worked on; User Management's current screenshot below the metrics moves up into that slot at that point. Hero images themselves are added last.
- TL;DR is missing on Ops and WiseWoman; content has to come from Shabnam.
- Project info row is missing on User Management and AI Features; role, team, timeframe and a fourth field have to come from Shabnam.

- Replace placeholder peer quotes with real, permission-obtained quotes and names.
- Replace placeholder email, phone, resume link, and social URLs (GitHub and Medium links are currently `#` placeholders in the footer).
- Real case study imagery/video to replace remaining placeholder slots — the WiseWoman case study and the User Management case study's walkthrough video + poster are still missing their asset files (the pages degrade gracefully: `onerror` removes the broken element and shows a "drop the file in and it resolves automatically" fallback caption).
- Only three of the Design Process steps' copy came directly from Shabnam's own words ("Understanding the Why" was dictated); "Finding the Ground Truths," "Designing in the Open," and "Building It, Not Just Handing It Off" were drafted to match the site's established voice and have not been explicitly confirmed — check before treating them as final.
- Decide illustration versus photograph balance further if the About page evolves.
