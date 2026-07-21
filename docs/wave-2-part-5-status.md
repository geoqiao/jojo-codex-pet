# Wave 2 Status — Part 5

Date: 2026-07-20

Part 5 contains five pets. All five completed the V2 engineering and owner-review gates and were publicly released on 2026-07-21.

## Production status

| Pet | V2 package | Blind direction QA | Final visual QA | Local install | Status |
| --- | --- | --- | --- | --- | --- |
| Giorno Giovanna | Pass | Hard gates pass; intermediate-angle warnings reviewed | Pass | Verified | Released |
| Gold Experience | Pass | Hard gates pass; intermediate-angle warning reviewed | Pass | Verified | Released |
| Gold Experience Requiem | Pass | Hard gates pass; one near-down horizontal ambiguity reviewed | Pass | Verified | Released |
| Diavolo | Pass | Hard gates pass; subtle intermediate axes reviewed | Pass | Verified | Released |
| King Crimson | Pass | Hard gates pass; two near-down ambiguities reviewed | Pass | Verified | Released |

## Giorno acceptance evidence

- Complete 8 × 11, 1536 × 2288 RGBA Codex Pet v2 atlas with all nine standard states and sixteen look directions.
- All standard rows pass component extraction with zero frame errors or warnings.
- Strict blind hard gates pass for 090° versus 270° and 000° versus 180° after the rejected right-facing row-10 candidate was regenerated.
- A QA-derived direction-only guide corrected the left-facing family. The guide is not packaged; the final row was redrawn through grounded image generation.
- Uniform deterministic registration corrected a source-canvas scale mismatch. Final area ratios are 1.05 at 157.5° → 180° and 1.08 at 337.5° → 000°.
- The final atlas passes structural, transparency, chroma-edge, packaging, and independent visual QA with zero validator errors or warnings.
- The final owner-review reel is `.work/hatch-pet/part-05-giorno-giovanna/qa/final-animation-reel.gif`.

## Accepted non-blocking exceptions

- Near-cardinal diagonal frames can be horizontally or vertically ambiguous when removed from the ordered loop. The full labeled sequence remains monotonic and all principal cardinal gates pass.
- Continuity diff outliers occur where the silhouette changes between back, profile, and front construction. No pair crosses into the wrong half of the loop.
- The flagged lower-row transparency at 180° is natural negative space between the planted lower limbs, not a body hole.

## Gold Experience acceptance evidence

- Complete 8 × 11, 1536 × 2288 RGBA Codex Pet v2 atlas with nine standard states and sixteen look directions.
- Fourteen generated row-10 candidates were rejected until the final row kept 270° unmistakably screen-left and 292.5° through 337.5° screen-left while rising into 000°.
- A directly verified direction guide combined the accepted 180°→270° and 292.5°→337.5° half-arcs for grounded full-row regeneration; the guide is QA-only and is not packaged.
- Uniform deterministic registration at scale `0.495` leaves zero look-cell edge-safety pixels.
- Three isolated blind reviewers passed the strict 090°/270° and 000°/180° hard gates. The review-only 225°/135° isolated horizontal reversal was accepted after the labeled clockwise sequence showed no quadrant reversal.
- The final atlas passes structural, transparency, chroma-edge, package, local-install, and independent final visual QA with zero validator errors or warnings.
- Repository and local-install hashes match exactly. The owner-review reel is `.work/hatch-pet/part-05-gold-experience/qa/final-animation-reel.gif`.

## Gold Experience Requiem acceptance evidence

- Complete 8 × 11, 1536 × 2288 RGBA Codex Pet v2 atlas with nine standard states and sixteen look directions.
- The first four lower look-row candidates were rejected until a concise topology-locked prompt kept the mask tip image-left of the turquoise eye and the ear gem/crown fins image-right for every 202.5° through 337.5° pose.
- Three isolated blind reviewers pass the strict 090°/270° and 000°/180° hard gates. The only blind warning is the near-down 157.5° horizontal component being ambiguous in isolation; its vertical/down semantics and the complete labeled loop pass.
- Registered row 9 and row 10 use the same deterministic scale `0.4583333333333333`. The final loop boundary area ratios are 1.19 at 157.5°→180° and 1.08 at 337.5°→000°; the broader frontal 180° anchor explains the reviewed first transition.
- The one accepted final despill produces zero validator errors, zero warnings, and zero transparent RGB residue. Independent final visual QA passes with no clipping, body holes, detached effects, identity drift, flicker, or scale jump.
- The owner-review reel is `.work/hatch-pet/part-05-gold-experience-requiem/qa/final-animation-reel.gif`.

## Diavolo acceptance evidence

- Complete 8 × 11, 1536 × 2288 RGBA Codex Pet v2 atlas with nine standard states and sixteen look directions.
- A rejected first final candidate exposed per-pose scale inflation caused by component-fit extraction. Stable-slot extraction preserves a single character pixel scale through crouching, jumping, kneeling, and seated poses.
- Three fresh isolated blind reviewers unanimously pass the 090°/270° and 000°/180° hard gates. All remaining warnings are ambiguous intermediate axes rather than opposite-direction majorities; the labeled clockwise loop remains monotonic.
- Row 9 and row 10 use deterministic factors `0.44144144144144143` and `0.3972517409049917` to reach the same `192.46846846846847`-pixel median final body height.
- The accepted final despill produces zero validator errors, zero warnings, and zero transparent RGB residue in both PNG and WebP. Independent final visual QA passes all nine regenerated post-despill GIFs with zero warnings.
- The package hash matches the accepted final WebP exactly. The owner-review reel is `.work/hatch-pet/part-05-diavolo/qa/final-animation-reel.gif`.

## King Crimson acceptance evidence

- Complete 8 × 11, 1536 × 2288 RGBA Codex Pet v2 atlas with nine standard states and sixteen look directions.
- The integrated forehead face and one attached two-layer temporal slice remain part of the single sprite silhouette throughout the state-specific performances.
- Three isolated blind reviewers pass both strict cardinal gates. The horizontally subtle 157.5° and 202.5° near-down poses retain their vertical/down meaning, and the complete loop has no reversal.
- The accepted final despill produces zero validator errors, zero warnings, and zero transparent RGB residue in both PNG and WebP. Independent final visual QA reports no clipping, holes, foreign bodies, detached effects, chroma fringe, or scale jump.
- The package hash matches the accepted final WebP exactly. The owner-review reel is `.work/hatch-pet/part-05-king-crimson/qa/final-animation-reel.gif`.

## Verification

- `pnpm check`: 36 catalog entries across nine Parts and 23 validated v2 packages; Astro reports zero errors, warnings, or hints.
- `pnpm build`: 82 English and Chinese static pages generated successfully.
- Repository package hashes match the accepted final WebP files for all five Part 5 pets.
- Repository and local-install hashes match for all five Part 5 pets.
- Direct validation of `~/.codex/pets/part-05-giorno-giovanna/spritesheet.webp` passes with zero errors and zero warnings.
- Direct validation of `~/.codex/pets/part-05-diavolo/spritesheet.webp` and `~/.codex/pets/part-05-king-crimson/spritesheet.webp` also passes with zero errors and zero warnings.

## Release result

The owner approved the Part 5 QA overview and its reviewed exceptions on 2026-07-21. All five pets are `released`, publicly exported, and independently installable.
