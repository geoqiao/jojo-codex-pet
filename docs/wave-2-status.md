# Wave 2 Status — Parts 4–6

Date: 2026-07-21

All 15 Wave 2 pets now have complete Codex Pet v2 packages. Every package contains a validated 8 × 11, 1536 × 2288 RGBA WebP atlas with all nine standard animation states and all sixteen look directions. Deterministic validation, three isolated blind direction reviews, continuity review, independent final visual QA, package-hash verification, and local-install verification are complete.

The owner approved the complete animation overview on 2026-07-21. All 15 are now `released`, exported publicly, and independently installable.

## Batch result

| Part | Pets | Packages | Engineering gate | Local install | Release state |
| --- | ---: | ---: | --- | --- | --- |
| Part 4 | 4 | 4 | Pass | Verified | Released |
| Part 5 | 5 | 5 | Pass | Verified | Released |
| Part 6 | 6 | 6 | Pass | Verified | Released |
| **Wave 2** | **15** | **15** | **Pass** | **Verified** | **Released** |

Review the complete reels, contact sheets, and direction sheets in the [Wave 2 animation review](visual/wave-2-animation-review/README.md). Part-specific implementation evidence is recorded in [Part 5 status](wave-2-part-5-status.md) and [Part 6 status](wave-2-part-6-status.md).

## Accepted non-blocking exceptions

- Josuke Higashikata: 067.5°, 112.5°, and 337.5° have weaker secondary-axis cues; cardinals and ordered-loop direction pass.
- Crazy Diamond: continuity metrics report isolated statistical outliers, but the labeled loop and independent visual QA show no visible snap.
- Yoshikage Kira: 022.5° and 337.5° use deliberately subtle horizontal signs near 000°.
- Killer Queen: 202.5° is subtle in isolation and 157.5° is near-frontal; the down-facing sequence remains monotonic.
- Giorno Giovanna: near-cardinal secondary axes can be ambiguous outside the labeled sequence.
- Gold Experience: one isolated 225°/135° comparison is review-only; the complete loop does not reverse.
- Gold Experience Requiem: 157.5° has a subtle horizontal sign near 180°.
- Diavolo: remaining blind findings are intermediate-axis ambiguity rather than cardinal or quadrant failures.
- King Crimson: 135°→180° and 270°→000° are uneven but remain correctly ordered without reversal.
- Jolyne Cujoh: only near-cardinal horizontal signs were flagged for review.
- Stone Free: all 28 blind axis classifications pass; its lower-alpha edges are intentional and clean.
- Enrico Pucci: measured silhouette outliers were visually classified as smooth pose changes.
- Whitesnake: blind-review warnings are limited to intermediate-axis ambiguity.
- C-MOON: 067.5°/112.5° produced a split isolated vertical-axis reading, and 180°→202.5° is a larger crouch-to-stand transition; cardinals, quadrants, attachment, baseline, and loop closure pass.
- Made in Heaven: intermediate blind warnings remain recorded; the repaired running-right row keeps its amber acceleration band attached through every frame.

No accepted exception involves a failed cardinal direction, wrong principal quadrant in the ordered loop, clipping, chroma residue, detached ability effect, missing state, package mismatch, or v2 contract error.

## Verification

- `pnpm check`: 36 catalog entries across nine Parts; 23 v2 packages validated; Astro reports zero errors, warnings, or hints.
- `pnpm build`: 82 English and Simplified Chinese static routes generated successfully.
- Repository package files match their accepted final QA atlases.
- All 15 Wave 2 packages are installed under `~/.codex/pets/`; installed package files match the repository hashes.

## Release result

The engineering batch and owner animation review are complete. On 2026-07-21, all 15 catalog entries moved to `released`; public package export and every supported per-pet install route are enabled. The 13 Wave 3 headline entries remain visible as `planned` until their real packages pass the same gate.
