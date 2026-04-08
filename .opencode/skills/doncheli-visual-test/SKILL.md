---
name: doncheli-visual-test
description: Run visual regression tests by comparing UI screenshots against baselines. Activate when user mentions "visual test", "screenshot", "UI regression", "visual diff", "pixel diff", "visual snapshot".
---

# Don Cheli: Visual Test

## Instructions

1. Detect the visual testing tool in use: Playwright, Cypress, Percy, Chromatic, Storybook, or custom
2. Run the visual test suite and capture screenshots of the current state
3. Compare against the stored baseline snapshots
4. Report each visual difference:
   - Component / page name
   - Diff percentage (pixels changed vs. total)
   - Category: layout shift, color change, missing element, new element
5. Classify severity:
   - > 5% diff → blocker (likely regression)
   - 1-5% diff → warning (review required)
   - < 1% diff → info (minor or anti-aliasing)
6. For new snapshots (no baseline exists), prompt the user to approve them as the new baseline
7. Never auto-approve baselines — always require explicit human confirmation
8. Generate a visual diff report with image paths or URLs if available
9. Save report to `.dc/visual-test-report-<timestamp>.md`

## Output Format

```
## Visual Test Report — 2026-03-28T15:00Z

### Summary
- Compared: 24 snapshots
- Passed:   21
- Diffs:     3 (1 blocker, 2 warnings)

### Blocker 🔴
- CheckoutPage/desktop — 12.3% diff
  Category: layout shift — payment form moved 40px down
  Baseline: .visual/baselines/checkout-desktop.png
  Current:  .visual/current/checkout-desktop.png

### Warnings 🟡
- Button/primary — 2.1% diff — color shift (likely theme variable change)
- NavBar/mobile — 1.8% diff — font rendering difference (check font loading)

### New Snapshots (approval required)
- VoiceModal/desktop — no baseline found — run with --approve to set baseline
```
