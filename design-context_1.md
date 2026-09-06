# Shabnam Raghavan Portfolio — Design Context

This file is the source of truth for extending this portfolio. Read it fully before writing any code, copy, or layout. Every decision below was made deliberately; do not "improve" the system by flattening it into generic portfolio conventions. When in doubt, ask which symbol or rule applies rather than inventing a new one.

Reference implementation: `index.html` (home page). All tokens, timings, and patterns below are extracted from it. This file was substantially revised after a coconut/asphalt palette and Satoshi/Manrope typography redesign; §3, §4, §5, §7, §8, and §11a supersede the original v10 hero-shabnam build this doc used to describe.

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
  --coconut: #f0ede5;         /* page background, everywhere including the intro */
  --coconut-deep: #e6e2d7;    /* recessed light surface (placeholders, gradient blends) */
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

- Case study pages: each keeps its own independent light-theme background and its own established accent colour (see §11a) — do not force index.html's coconut/asphalt palette onto a case study's *content* sections. Nav and footer are the deliberate exceptions (shared chrome, see §11a). Open with a title and a short lede, then let real product imagery carry colour. Reuse the ribbon as section divider. End with a Pull the thread link to the next case study.
- Case study content structure Shabnam favours: ground truths first (research, who she talked to, what was actually true), then reframing, then design decisions with reasoning, then build and ship detail, then measured outcomes. Depth over gloss.
- About page: this is where the person appears. Use a real photograph here. Cover Malabar origins, the research-first practice, and the seeker identity. Its own location line now lives beneath its h1 (see §8); the hero illustration stays symbolic on index.html, the About page is human.
- Do not introduce new symbols, new fonts, new hues, or new interaction patterns without checking against §2. If a new page seems to need something outside this system, the correct move is to compose existing symbols differently, not to invent.

## 11a. Correction: what's shared across pages versus what's independent

This section has been revised twice now. Current state:

- **Each case study page keeps its own independent background, distinct from index.html's coconut/asphalt system** — but accent colour is shared *within* a project family, not per-page: TPA Ops, User Management, and AI-Enabled Features are all IHX case studies and all use the exact same indigo/teal (`#3C3ADA`/`#6E6CF0`/`#00B894`/`#046A50`); WiseWoman is a separate project and keeps its own purple. Do not give a same-family case study (e.g. a future second WiseWoman-style page) its own distinct hue by default — confirm which family it belongs to first. All four case studies are light-themed (coconut-toned backgrounds, ported from index's palette specifically for their neutral gray ramp — this was a deliberate later pass, see the case-study-light-theme-spec memory for the exact ramp) but each keeps its own saturated accent hue independent of the others and of index.html's vermillion. Do not replace a case study's own accent with vermillion to "match the home page."
- **Two pieces of chrome ARE now byte-identical shared chrome across all six pages** (index, about, and all four case studies): the **top nav** (wordmark font/weight/colour, nav-link font/colour — only each page's own hover accent colour is allowed to differ) and the **footer** (full markup, copy, and the asphalt/coconut styling — no per-page variation at all, not even accent colour; even the "Other Case Studies" grid and its `.cs-go` CTA already used vermillion as chrome, not each page's own hue, before this pass). This is new and deliberately overrides the older, stricter "case studies never share index's colours" rule for these two specific components. Everything else on a case study page — hero, body sections, cards, data visualisations — stays independent.
- **AI-Enabled Features at the Point of Failure** (`ihx-ai-features-case-study.html`) has no real screenshots yet — every screen reference uses the existing `.video-slot`/`.img-slot` fallback pattern (dashed placeholder + expected filename), consistent with its "designed / in development" status rather than pretending finished visuals exist. Its hero also has no single screenshot to frame (four features at four different stages), so the hero's right column is a `.status-card`/`.status-row`/`.status-pill` component (new, not shared with other case studies) listing each feature's ship status instead of a framed screen.
- **Typography/structure is worth porting more broadly than colour is.** Font-family choices, font sizes, spacing scale, component layout (tag-pills-above-title, card grid structure, hover-underline mechanics) can be ported from index.html into a case study while keeping the case study's own colour variables — this was always true and still is.
- If a future request says "make the case study consistent with the home page," confirm whether that means nav/footer chrome (yes, already the standard), typography/layout (usually yes), or the page's own content-area colour (no, unless explicitly re-confirmed) before touching any accent-colour value.

## 12. Known open items (do not silently resolve)

- Replace placeholder peer quotes with real, permission-obtained quotes and names.
- Replace placeholder email, phone, resume link, and social URLs (GitHub and Medium links are currently `#` placeholders in the footer).
- Real case study imagery/video to replace remaining placeholder slots — the WiseWoman case study and the User Management case study's walkthrough video + poster are still missing their asset files (the pages degrade gracefully: `onerror` removes the broken element and shows a "drop the file in and it resolves automatically" fallback caption).
- Only three of the Design Process steps' copy came directly from Shabnam's own words ("Understanding the Why" was dictated); "Finding the Ground Truths," "Designing in the Open," and "Building It, Not Just Handing It Off" were drafted to match the site's established voice and have not been explicitly confirmed — check before treating them as final.
- Decide illustration versus photograph balance further if the About page evolves.
