I'd like you to restyle this website to match the aesthetic of a pitch deck I've been working on. Before making any changes, create a rollback path:

Make sure the working tree is clean (commit any pending work).
Create a new branch: git checkout -b aesthetic/superpowers-deck
Do all the restyling work on this branch.
When done, commit with a clear message. I can merge it back to main if I like it, or just delete the branch (git branch -D aesthetic/superpowers-deck) to roll it all back.
Don't touch content, routing, or logic — only visual styling. Keep HTML structure, component composition, and copy exactly as-is. You're only changing CSS (or Tailwind classes, or whatever the project uses), typography, colors, spacing, and small decorative elements. Preserve accessibility — keep existing alt text, aria labels, heading hierarchy, and focus states.

The aesthetic: "Laboratory" — warm editorial + scientific
Think: a scientific field notebook crossed with a modern design-system site. Warm paper background, deep ink text, editorial serif for display, clean sans for UI/body, and mono uppercase for metadata and labels. Accents are sparingly-used earthy tones, never saturated/neon. Lots of thin hairline rules. Numbered section markers and "Fig. NN" captions as micro-typography.

Color tokens (use these exact values)
:root {
  /* Surfaces */
  --paper:      #F5EFE6;   /* main background — warm cream */
  --paper-deep: #EDE4D3;   /* subtle alternate surface */
  --ink:        #1B1A17;   /* primary text — near-black warm */
  --ink-soft:   #3A362F;   /* secondary text */
  --mute:       #7A746A;   /* tertiary/meta text */
  --rule:       #C8BEA9;   /* hairlines, borders */

  /* Accents — use SPARINGLY */
  --copper:      #B5532A;  /* primary accent — warm rust/terracotta */
  --copper-soft: rgba(181, 83, 42, 0.08);  /* tinted fill */
  --sage:        #5E7A4F;  /* positive/growth accent — muted green */
  --sage-soft:   rgba(94, 122, 79, 0.10);
  --gold:        #B1863C;  /* tertiary accent — rare use, highlights */
}
Dark mode (if the site has one): invert to --ink background (#12110F) with --paper (#EDE4D3) text; keep accents.

Type system
Load from Google Fonts:

<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Source+Serif+4:ital,opsz,wght@0,8..60,300..700;1,8..60,300..700&family=Inter+Tight:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet">
Roles:

Display / headings (h1, h2, hero): 'Source Serif 4', Georgia, serif — weight 400, letter-spacing -0.02em, line-height 1.05. Use italic for emphasis words (feels editorial, not loud).
Body / UI (paragraphs, buttons, nav, form labels): 'Inter Tight', system-ui, sans-serif — weight 400 for body, 500 for buttons/nav, 600 sparingly.
Meta / labels / eyebrow kickers / figure captions: 'JetBrains Mono', ui-monospace, monospace — ALL CAPS, letter-spacing 0.14em, font-size 12–14px, color --mute or an accent.
Headline sizes scale generously — don't be timid. A hero h1 should be around 5–7rem with tight leading. Body stays at 16–18px.

Spacing & layout
Generous whitespace. Sections breathe. Don't cram.
Content width max ~1400px; prose columns max ~68ch.
Use 1px hairline rules (border: 1px solid var(--rule)) as structural dividers — above footers, between sections, around cards. Avoid heavy 2–3px borders.
Cards: 1px solid var(--ink) border on paper background, no shadow, no rounded corners (or max 2px radius). Internal padding 36px.
Buttons: square corners or 2px radius max. Primary = copper fill with paper text. Secondary = ink outline on paper.
Micro-typography patterns (use where appropriate)
These are the signature moves that make the aesthetic feel specific rather than generic:

Section markers: every major section starts with a mono caps label like § 04 — FEATURES or FIG. 07 — PROOF POINTS in --mute or --copper.
Numbered items: use two-digit formatting — 01, 02, 03, not 1, 2, 3.
Italic emphasis: inside headlines, italicize 1–2 key words in the serif italic — e.g. "Teaching is mentoring, not instruction."
Hairline corner meta: if the site has a landing/hero, consider thin mono labels in the corners (top-left: product name; top-right: version or date; bottom-left: figure label; bottom-right: pagination-style "01 / 08").
Em dashes and middle dots: use — and · liberally in labels and kickers instead of pipes or commas.
What NOT to do
No gradients, no glassmorphism, no neon, no blue/purple startup palette.
No rounded-corner cards with shadows.
No emoji in UI.
No sans-serif headlines (headlines are always serif).
No center-aligned body copy (left-align prose; center is fine for labels and hero single-lines).
Don't invent new accent colors — stick to copper + sage + gold.
Scope
Go through these in order:

Install the fonts and define the CSS custom properties (in the global stylesheet or Tailwind config — whatever this project uses).
Replace the existing color palette with the tokens above. Map semantically (background → --paper, primary text → --ink, etc.).
Swap type families per the roles above.
Restyle: nav, hero, sections, cards, buttons, forms, footer.
Add the mono section markers to major sections.
Adjust spacing to be more generous.
Run the site, spot-check every page, and fix anything that looks broken (contrast, overflow, mobile layout).
When you're done, give me a short summary of what changed so I know what to look at. And remind me of the branch name so I can easily roll back.