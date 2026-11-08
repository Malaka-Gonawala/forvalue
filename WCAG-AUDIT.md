# ForValue: WCAG 2.2 AA audit (7 Nov 2026)

**Verdict: not fully AA yet.** 6 issues to fix, all small CSS/JS changes. Everything else passed.

**Update 8 Nov 2026: all 6 fails fixed** (see TEST-REPORT #48).

How it was checked: axe-core 4.10 (WCAG 2.0/2.1/2.2 A+AA rules) on 25 pages × 3 roles at 390 px and 1440 px, plus keyboard Tab walks, a 320 px reflow test, a modal focus test and manual contrast maths.

## Fails

| # | Criterion | Where | Problem | Fix |
|---|---|---|---|---|
| 1 | 1.4.3 Contrast | index.html role tiles (small text) | #E2EFE5 on #3F774E = 4.47:1 (needs 4.5) | Use white for the small line |
| 2 | 1.4.3 Contrast | lotto-salvato `#code`, profilo `#roleName` (phone) | Gold 300 #EBD488 on Green 700 = 4.34:1 | Use Gold 100 #F8EFCF or white |
| 3 | 1.4.3 Contrast | offerte.html?cat=scarti `#intro` (phone) | muted grey on green band = 1.13:1 | Use white / Green 100 on the band |
| 4 | 1.4.11 Non-text contrast | all pages | Focus ring Gold 500 on light background = 1.8:1 (needs 3:1). Input borders already OK (--field #7E887F) | Focus ring Green 900 on light areas, keep gold on green areas (sidebar, .bar, .hero, bands) |
| 5 | 2.4.11 Focus not obscured | phone: dashboard, offerte, ordini-ricevuti, carrello | Focused links/buttons go under the fixed bottom tab bar / sticky bar | `html{scroll-padding-bottom:110px}` on phone |
| 6 | 2.4.3 Focus order (+ 2.1.1) | lotto.html & offerte.html side panel (#panelWrap); dashboard phone table box (shell.css:92 overflow-x) | Tab leaves the open "Metti in vendita"/"Modifica" dialog into the page behind it, and focus isn't returned to the button on close. Dashboard's scrollable table can't be reached by keyboard | Trap Tab inside panel, `inert` on the page behind, refocus trigger on close; `tabindex="0"` + label on the scroll box |

## Borderline (worth a look, not counted)
- 2.2.2 Pause/Stop: the map truck tracker moves for 45–120 s with no pause button. It is a progress indicator, so usually accepted; reduced-motion is already respected.

## Passed (main ones)
`lang="it"` on every page and EN switch updates `lang` (3.1.1) · all images/icons named or hidden (1.1.1) · form labels, `aria-invalid`, errors with `role="alert"` (1.3.1, 3.3.1, 3.3.2) · landmarks + one h1 per page (1.3.1, 2.4.6) · no horizontal scroll at 320 px (1.4.10) · target size ≥ 24 px (2.5.8) · visible focus exists (2.4.7) · login has autocomplete + paste allowed (1.3.5, 3.3.8) · toasts `role="status"` (4.1.3) · Esc closes panels · Aiuto in the same menu place on every page (3.2.6) · no time limits (2.2.1) · no drag-only actions (2.5.7).

Note: automated tools find about 40% of issues. A real screen-reader pass (NVDA / VoiceOver) is still advised before claiming conformance.
