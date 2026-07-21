# Wave 2 Status — Part 6

Date: 2026-07-21

All six Part 6 pets have complete Codex Pet v2 packages and have passed the full engineering gate. Each accepted atlas is 1536 × 2288 RGBA WebP, uses the 8 × 11 v2 layout, includes all nine standard states and sixteen look directions, and is installed locally for owner testing.

## Production status

| Pet | V2 package | Blind direction QA | Final visual QA | Local install | Status |
| --- | --- | --- | --- | --- | --- |
| Jolyne Cujoh | Pass | Hard gates pass; near-cardinal horizontal warnings reviewed | Pass | Verified | Released |
| Stone Free | Pass | All 28 blind axis classifications pass | Pass | Verified | Released |
| Enrico Pucci | Pass | Hard gates pass; metric outliers visually reviewed | Pass | Verified | Released |
| Whitesnake | Pass | Hard gates pass; intermediate-axis warnings reviewed | Pass | Verified | Released |
| C-MOON | Pass | Hard gates pass; one split intermediate vertical-axis reading reviewed | Pass | Verified | Released |
| Made in Heaven | Pass | Hard gates pass; intermediate-axis warnings reviewed | Pass | Verified | Released |

## Accepted non-blocking exceptions

- Jolyne Cujoh: warnings are limited to subtle horizontal signs near the up/down cardinals; the full loop and hard cardinals pass.
- Stone Free: the lower-alpha edge treatment is intentional transparency, not chroma residue or missing anatomy.
- Enrico Pucci: continuity metrics flag silhouette changes that independent visual QA classified as smooth pose motion.
- Whitesnake: blind findings are intermediate-angle ambiguity only; all cardinals and principal quadrants pass.
- C-MOON: the isolated 067.5°/112.5° vertical-axis pair received a split reading, while the labeled clockwise loop remains correctly ordered. The 180°→202.5° transition is larger than adjacent steps but keeps a stable baseline, practical scale, and attached crescent pressure cue.
- Made in Heaven: the regenerated running-right row preserves its attached amber acceleration band through the final frame; remaining blind findings are intermediate-angle ambiguity only.

## Verification

- Every repository atlas passes `validate_atlas.py --require-v2` with zero errors and zero warnings.
- Accepted final atlas and package hashes match for all six pets.
- Repository and `~/.codex/pets/` package files match for all six local installs.
- The complete review artifacts are in [the Wave 2 animation review](visual/wave-2-animation-review/README.md).

## Release result

The owner approved the complete Wave 2 animation overview on 2026-07-21. All six pets are `released`, publicly exported, and independently installable.
