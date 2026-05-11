# Design System — Don Cheli Studio

## Product Context
- **What this is:** AI-powered development platform that orchestrates 7 specialist agents to build software with strict TDD
- **Who it's for:** Developers and product managers who want verified, tested code from a single prompt
- **Space:** Developer tools / AI coding (Cursor, Replit, Bolt, v0, Devin)
- **Type:** Operations dashboard / command center

## Aesthetic Direction
- **Direction:** Industrial/Utilitarian with warmth
- **Decoration level:** minimal — data and typography do the work
- **Mood:** Like a mission control center that's also inviting. Professional but not cold. You trust it with your code because it looks like it was built by engineers who care about craft.
- **Anti-reference:** NOT generic SaaS purple. NOT Tailwind defaults. NOT bubbly rounded everything.

## Typography
- **Display/Hero:** Geist — clean, technical, modern. Sharp geometric shapes signal precision without being cold.
- **Body:** Geist — same family for consistency. The tabular-nums feature makes it perfect for data-heavy dashboards.
- **UI/Labels:** Geist (weight 500) — medium weight for labels and navigation
- **Data/Monospace:** Geist Mono — timestamps, log output, code, metrics. The soul of the dashboard.
- **Loading:** Google Fonts CDN: `https://fonts.googleapis.com/css2?family=Geist:wght@400;500;600;700&family=Geist+Mono:wght@400;500&display=swap`
- **Scale:**
  - xs: 0.6875rem (11px) — metadata, timestamps
  - sm: 0.75rem (12px) — labels, captions
  - base: 0.8125rem (13px) — body text, UI
  - md: 0.875rem (14px) — emphasized body
  - lg: 1rem (16px) — section headers
  - xl: 1.25rem (20px) — page titles
  - 2xl: 1.5rem (24px) — hero numbers/KPIs

## Color
- **Approach:** restrained — one accent + warm neutrals. Color is rare and meaningful.
- **Primary accent:** `#E8C547` (warm gold) — signals authority, completion, premium. Used ONLY for: active states, CTAs, the "signed" state, progress bars.
- **Backgrounds:**
  - `--bg-base: #0C0C0E` — deepest background
  - `--bg-raised: #141416` — cards, panels
  - `--bg-overlay: #1A1A1E` — modals, popovers, hover states
  - `--bg-subtle: #222226` — input backgrounds, code blocks
- **Borders:**
  - `--border-default: #2A2A30` — standard borders
  - `--border-subtle: #1E1E24` — subtle dividers
  - `--border-active: #E8C547` — active/focused elements
- **Text:**
  - `--text-primary: #E8E8EC` — primary content
  - `--text-secondary: #8E8E96` — secondary, labels
  - `--text-muted: #56565E` — disabled, placeholders
  - `--text-accent: #E8C547` — accent text, links, active items
- **Semantic:**
  - `--color-success: #4ADE80` (green-400) — passed, complete, safe
  - `--color-warning: #FBBF24` (amber-400) — warnings, attention
  - `--color-error: #F87171` (red-400) — failed, errors, destructive
  - `--color-info: #60A5FA` (blue-400) — running, in-progress, links
- **Agent colors** (each agent gets a subtle accent):
  - Ana (spec): `#60A5FA` — blue, analytical
  - Marco (QA): `#34D399` — teal, verification
  - Sofia (arch): `#A78BFA` — purple, strategic
  - Luis (design): `#F472B6` — pink, creative
  - Camila (plan): `#FB923C` — orange, organized
  - Diego (dev): `#4ADE80` — green, productive
  - Valentina (review): `#E8C547` — gold, authoritative

## Spacing
- **Base unit:** 4px
- **Density:** compact — this is a data dashboard, not a marketing site
- **Scale:** 
  - 1: 4px, 2: 8px, 3: 12px, 4: 16px, 5: 20px, 6: 24px, 8: 32px, 10: 40px, 12: 48px

## Layout
- **Approach:** grid-disciplined — strict alignment, predictable panels
- **Grid:** 12-column on desktop, single column on mobile
- **Max content width:** none (full-width dashboard)
- **Border radius:**
  - none: 0 — tables, inline elements
  - sm: 4px — buttons, inputs, badges
  - md: 6px — cards, panels
  - lg: 8px — modals, large containers
  - Never use > 8px radius. This is a professional tool, not a toy.

## Motion
- **Approach:** minimal-functional — only transitions that aid comprehension
- **Easing:** `cubic-bezier(0.16, 1, 0.3, 1)` for enter, `ease-in` for exit
- **Duration:** 
  - instant: 0ms — color changes on hover
  - fast: 100ms — button states, checkbox
  - normal: 200ms — panel transitions, expand/collapse
  - Never use > 200ms. Speed = trust.

## Decisions Log
| Date | Decision | Rationale |
|------|----------|-----------|
| 2026-04-16 | Gold accent (#E8C547) over purple | Purple is the #1 AI slop color. Gold signals authority, craft, precision — aligns with "engineering tool" positioning |
| 2026-04-16 | Geist over Inter | Inter is overused in every AI tool. Geist has tabular-nums, is designed for dashboards, and has its own identity |
| 2026-04-16 | Compact density | This is an ops dashboard. Dense data = professional trust. Spacious = marketing site energy |
| 2026-04-16 | Max 8px border-radius | Bubbly corners = toy. Sharp corners = tool. 8px max keeps it professional |
| 2026-04-16 | Restrained color | Color-when-meaningful > color-everywhere. Gold accent stands out because everything else is neutral |
